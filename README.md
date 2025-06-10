# Trendtide News

🔗 Demo: https://trendtidenews.onrender.com/api

## Project Overview

This backend project was built as part of the Northcoders bootcamp using Node.js, Express, and PostgreSQL. It gave me the chance to really get hands-on with building a RESTful API from scratch and sharpen my skills in backend development.

I designed and built the API to handle all the usual operations: GET, POST, PATCH, and DELETE, allowing users to interact with articles, comments, topics, and users. I also set up a solid database schema in PostgreSQL, ensuring all tables are properly connected and queries run efficiently.

A big focus was writing clear and reliable server logic to manage requests and responses, including validating inputs and handling errors effectively. To keep everything running smoothly, I wrote thorough tests using Jest and Supertest, covering both, common use cases, and edge cases to catch errors.

This project gave me confidence in creating real-world backend APIs, managing relational databases, and following best practices to build a robust, well-tested application.

## 🛠️ Technologies Used

- Node.js
- PostgreSQL
- Express.js
- Jest / Supertest (for testing)
- dotenv

## 📦 Getting Started

To get a local copy up and running, follow these steps:

### 1. Clone the repository

```
git clone
```

### 2. Install dependencies

```
npm install
```

### 3. Create environment variables

You will need two .env files for your databases, one for development and one for testing.

```
.env.development
PGDATABASE= nc_news
.env.test
PGDATABASE= nc_news_test
```

### 4. Set up the local database

```
npm run setup-dbs     # Creates the dev and test databases
npm run seed          # Seeds the database
```

### 5. Run tests

```
npm test
```

### 6. Start the server

```
npm run start
```

## ✅ Minimum Requirements

`Node.js: v23.10.0 or higher`
`PostgreSQL: v16.8 or higher`
