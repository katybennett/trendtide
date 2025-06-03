const db = require("../db/connection");

module.exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => rows);
};

module.exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => rows);
};

module.exports.selectUserById = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No username found under: ${username}`,
        });
      }
      return rows[0];
    });
};

module.exports.selectArticles = ({
  sortBy = "created_at",
  order = "desc",
  topic = null,
  limit = null,
  offset = 0,
}) => {
  const validSortFields = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
  ];

  if (!validSortFields.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort field`,
    });
  }

  const validSortOrders = ["asc", "desc", "ASC", "DESC"];

  if (!validSortOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort order`,
    });
  }

  let whereSql = "";
  const queryParams = [];
  if (topic) {
    whereSql += ` WHERE a.topic = $1`;
    queryParams.push(topic);
  }

  let limitOffsetSql = "";
  if (limit !== null) {
    limitOffsetSql = ` LIMIT ${limit} OFFSET ${offset}`;
  }

  let queryString = `SELECT
    a.author,
    a.title,
    a.article_id,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url,
    COUNT(c.comment_id)::INT AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c
    ON c.article_id = a.article_id
    ${whereSql}
    GROUP BY a.article_id
    ORDER BY ${sortBy} ${order}
    ${limitOffsetSql}
    `;

  return db.query(queryString, queryParams).then(({ rows }) => rows);
};

module.exports.selectArticleById = (article_id) => {
  let queryString = `SELECT
    a.author,
    a.title,
    a.article_id,
    a.topic,
    a.created_at,
    a.votes,
    a.body,
    a.article_img_url,
    COUNT(c.comment_id)::INT AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c
    ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: `No article found under article id: ${article_id}`,
      });
    }
    return rows[0];
  });
};

module.exports.selectArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found under article id: ${article_id}`,
        });
      }
      return result.rows;
    });
};

module.exports.insertComment = (username, body, article_id) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [username, body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports.insertArticle = (
  author,
  title,
  topic,
  body,
  article_img_url
) => {
  return db
    .query(
      "INSERT INTO articles (author, title, topic, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING article_id",
      [author, title, topic, body, article_img_url]
    )
    .then((result) => {
      console.log("RESULT", result.rows);
      const article_id = result.rows[0].article_id;
      const article = this.selectArticleById(article_id);
      return article;
    });
};

module.exports.updateArticleVoteCount = (inc_votes, article_id) => {
  return db
    .query(
      `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found under article id: ${article_id}`,
        });
      }
      return rows[0];
    });
};

module.exports.updateCommentVoteCount = (inc_votes, comment_id) => {
  return db
    .query(
      `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No comment found under comment id: ${comment_id}`,
        });
      }
      return rows[0];
    });
};

module.exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1 
        RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `No comment found under comment id: ${comment_id}`,
        });
      }
      return rows;
    });
};
