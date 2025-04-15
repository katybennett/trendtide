// const db = require("../connection")

const seed = async ({ topicData, userData, articleData, commentData }) => {
    await db.query(`DROP TABLE IF EXISTS articles;`)
  
    await db.query(`DROP TABLE IF EXISTS users;`)
    
    await db.query(`DROP TABLE IF EXISTS topics;`)
  
    await db.query(`CREATE TABLE topics(
        slug VARCHAR(10) PRIMARY KEY,
        description VARCHAR(100) NOT NULL,
        img_url VARCHAR(1000) NOT NULL
    );`);
  
    await db.query(`CREATE TABLE users(
      username VARCHAR(40) PRIMARY KEY,
      name VARCHAR(40) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
    );`);
  
    await db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(40) NOT NULL,
      topic VARCHAR(10) REFERENCES topics(slug),
      author VARCHAR(40) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) NOT NULL
    );`);
};


// module.exports = seed;