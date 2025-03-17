import os
import random
import pandas as pd
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent
from datetime import datetime

# Load environment variables
SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')

# Load word database
df = pd.read_csv('words_database.csv')

# Select 10 words that haven't been sent yet
unsent_words = df[df['sent'] == False]
if len(unsent_words) >= 10:
    selected_indices = random.sample(unsent_words.index.tolist(), 10)
else:
    # If not enough unsent words, reset some words and select again
    num_to_reset = min(10 - len(unsent_words), len(df[df['sent'] == True]))
    reset_indices = random.sample(df[df['sent'] == True].index.tolist(), num_to_reset)
    df.loc[reset_indices, 'sent'] = False
    
    # Select from updated pool
    unsent_words = df[df['sent'] == False]
    selected_indices = random.sample(unsent_words.index.tolist(), min(10, len(unsent_words)))

# Create email content
html_content = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; }}
        .word {{ margin-bottom: 15px; }}
        .definition {{ margin-left: 20px; }}
        .example {{ margin-left: 20px; font-style: italic; color: #666; }}
    </style>
</head>
<body>
    <h1>Your Daily 10 English Words</h1>
    <p>Date: {datetime.now().strftime('%Y-%m-%d')}</p>
    <hr>
"""

for idx in selected_indices:
    word = df.loc[idx, 'word']
    definition = df.loc[idx, 'definition']
    example = df.loc[idx, 'example'] if not pd.isna(df.loc[idx, 'example']) else ""
    
    html_content += f"""
    <div class="word">
        <h3>{word}</h3>
        <div class="definition">{definition}</div>
    """
    
    if example:
        html_content += f'<div class="example">Example: {example}</div>'
    
    html_content += "</div>"

html_content += """
</body>
</html>
"""

# Mark words as sent
df.loc[selected_indices, 'sent'] = True

# Save updated database
df.to_csv('words_database.csv', index=False)

# Send email
message = Mail(
    from_email=Email(SENDER_EMAIL),
    to_emails=To(RECIPIENT_EMAIL),
    subject='Your Daily English Vocabulary - Learn 10 New Words',
    html_content=HtmlContent(html_content)
)

try:
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    response = sg.send(message)
    print(f"Email sent with status code: {response.status_code}")
except Exception as e:
    print(f"Error sending email: {e}")
