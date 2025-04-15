const db = require("../connection")
const format = require('pg-format');
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`)
    })
    .then(() => {
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(10) PRIMARY KEY,
      description VARCHAR(100) NOT NULL,
      img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(40) PRIMARY KEY,
      name VARCHAR(40) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(300)NOT NULL,
      topic VARCHAR(10) REFERENCES topics(slug),
      author VARCHAR(40) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(40) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      const formattedTopicsData = topicData.map((topic) => {
        return [
          topic.slug,
          topic.description,
          topic.img_url,
        ];
      });
      const insertTopicDataQuery = format(
        'INSERT INTO topics (slug, description, img_url) VALUES %L', 
        formattedTopicsData
      );
      return db.query(insertTopicDataQuery);
    })
    .then(() => {
      const formattedUsersData = userData.map((user) => {
        return [
          user.username,
          user.name,
          user.avatar_url,
        ];
      });
      const insertUserDataQuery = format(
        'INSERT INTO users (username, name, avatar_url) VALUES %L', 
        formattedUsersData
      );
      return db.query(insertUserDataQuery);
    })
    .then(() => {
      const formattedArticlesData = articleData.map((article) => {
        const formattedArticle = convertTimestampToDate(article);
        return [
          formattedArticle.title,
          formattedArticle.topic,
          formattedArticle.author,
          formattedArticle.body,
          formattedArticle.created_at,
          formattedArticle.votes,
          formattedArticle.article_img_url,
        ];
      });
      const insertArticlesQuery = format(
        'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L', 
        formattedArticlesData
      );
      return db.query(insertArticlesQuery);
    })
    .then(() => {
      const formattedCommentsData = commentData.map((comment) => {
        const formattedComment = convertTimestampToDate(comment);
        return [
          formattedComment.article_id,
          formattedComment.body,
          formattedComment.votes,
          formattedComment.author,
          formattedComment.created_at,
        ];
      });
      const insertCommentsQuery = format(
        'INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L', 
        formattedCommentsData
      );
      return db.query(insertCommentsQuery);
    }) 
};


module.exports = seed;