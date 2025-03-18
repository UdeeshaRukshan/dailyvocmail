const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const csv = require("csv-parser");

dotenv.config();
const { EMAIL_USER, EMAIL_PASS, RECIPIENT_EMAIL } = process.env;

let words = [];
fs.createReadStream(path.join(__dirname, "vocabulary_database.csv"))
  .pipe(csv())
  .on("data", (row) => words.push(row))
  .on("end", () => {
    sendEmail(words);
  });

async function sendEmail(words) {
  let unsentWords = words.filter((word) => word.sent === "False");

  if (unsentWords.length < 10) {
    words.forEach((word) => {
      if (word.sent === "True") word.sent = "False";
    });
    unsentWords = words.filter((word) => word.sent === "False");
  }

  let selectedWords = unsentWords.slice(0, 10);
  selectedWords.forEach((word) => (word.sent = "True"));

  // Update CSV file
  const updatedCSV = [
    "word,definition,example,sent",
    ...words.map(
      (word) => `${word.word},${word.definition},${word.example},${word.sent}`
    ),
  ].join("\n");
  fs.writeFileSync(path.join(__dirname, "vocabulary_database.csv"), updatedCSV);

  // email content with elegant design
  let htmlContent = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #003366;
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .date {
                text-align: center;
                font-size: 16px;
                color: #888;
                margin-bottom: 20px;
            }
            .word {
                background-color: #f0f8ff;
                border-left: 5px solid #003366;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .word h3 {
                margin: 0;
                font-size: 18px;
                color: #003366;
            }
            .definition {
                margin-left: 20px;
                color: #444;
                font-size: 16px;
            }
            .example {
                margin-left: 20px;
                font-style: italic;
                color: #666;
                font-size: 14px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <h1>Your Daily 10 English Words</h1>
            <p class="date">Date: ${new Date().toISOString().split("T")[0]}</p>
            <hr>
  
    `;

  selectedWords.forEach(({ word, definition, example }) => {
    htmlContent += `
        <div class="word">
            <h3>${word}</h3>
            <div class="definition">${definition}</div>
            ${example ? `<div class="example">Example: ${example}</div>` : ""}
        </div>
      `;
  });

  htmlContent += `
            <div class="footer">
                <p>Thank you for using our daily word service!</p>
            </div>
        </div>
    </body>
    </html>
    `;

  
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com", 
    port: 465, 
    secure: true, 
    auth: {
      user: EMAIL_USER, 
      pass: EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: RECIPIENT_EMAIL,
    subject: "Your Daily 10 English Words",
    html: htmlContent, 
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

console.log("Email Service");