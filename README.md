
 # DailyVocMail: Vocabulary Enhancement System

![DailyVocMail Banner](https://via.placeholder.com/800x200/0073b7/ffffff?text=DailyVocMail)

> *"The beginning of wisdom is the definition of terms." — Socrates*

## 📚 Overview

**DailyVocMail** is a sophisticated vocabulary enhancement system designed to expand your lexical repertoire through regular email delivery of carefully curated words. Each delivery includes comprehensive definitions, contextual examples, and etymological insights to facilitate deep learning and retention.

## ✨ Features

- **Daily Word Delivery**: Receive vocabulary words directly to your inbox
- **Comprehensive Database**: Access to over 5,000 high-value vocabulary words
- **Learning Progression**: Words delivered in strategic sequences for optimal retention
- **Contextual Examples**: Each word includes practical usage examples
- **Spaced Repetition**: Previously sent words are reviewed periodically
- **Custom Categories**: Words organized by academic, professional, and literary domains

## 🚀 Getting Started

### Prerequisites

- Nodejs 14+
- SMTP server access for email delivery
- CSV management capabilities

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dailyvocmail.git
   cd dailyvocmail
   ```

2. Install required dependencies:
   ```bash
   npm install 
   ```

3. Configure your email settings in `config.yml`:
   ```yaml
   smtp:
     server: smtp.example.com
     port: 587
     username: your_username
     password: your_password
   ```

4. Run the setup script:
   ```bash
   node index.js
   ```

## 📋 Database Structure

The vocabulary database (`vocabulary_database.csv`) follows this structure:

| Column | Description |
|--------|-------------|
| word | The vocabulary word |
| definition | Concise definition of the word |
| example | Contextual example sentence |
| sent | Boolean tracking if word has been sent |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the Apache 2.0 - see the LICENSE file for details.

## 📧 Contact

For questions, suggestions, or collaboration opportunities, please contact:

📮 udeeshagamage12@gmail.com

---