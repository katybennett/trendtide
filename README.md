trendtide

link hosted version: https://trendtidenews.onrender.com

🚀 Project Overview

It is a full-stack web application built with Node.js, Express and PostgreSQL. It allows users to check articles and interact with content by voting, commenting, etc. The project was developed as part of the Northcoders bootcamp, and demonstrates key skills in RESTful API design, database management, and backend development.

🛠️ Technologies Used
Node.js
PostgreSQL
Express.js
Jest / Supertest (for testing)
dotenv


📦 Getting Started
To get a local copy up and running, follow these steps:
1. Clone the repository
git clone

2. Install dependencies
npm install

3. Create environment variables
You will need two .env files for your databases, one for development and one for testing.
.env.development
PGDATABASE= nc_news
.env.test
PGDATABASE= nc_news_test

4. Set up the local database
npm run setup-dbs     # Creates the dev and test databases
npm run seed          # Seeds the database

5. Run tests
npm test

6. Start the server
npm run start

✅ Minimum Requirements
Node.js: v23.10.0 or higher
PostgreSQL: v16.8 or higher
