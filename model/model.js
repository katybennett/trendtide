const db = require("../db/connection");

module.exports.selectTopics = () => {
    return db
    .query("SELECT * FROM topics")
};

module.exports.selectArticlesById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({
                status: 404, 
                msg: `No article found under article id: ${article_id}`
            });
        };
        return rows[0];
    });  
};

module.exports.selectArticles = () => {
    
    let queryString = `SELECT
        a.author,
        a.title,
        a.article_id,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles AS a
        LEFT JOIN comments
        ON comments.article_id = a.article_id
        GROUP BY a.article_id
        ORDER BY a.created_at DESC`;


    return db
    .query(queryString) 
};

module.exports.selectArticleComments = (article_id) => {
    return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC", [article_id])
    .then((result) => {

        if (!result.rows.length) {
            return Promise.reject({
                status: 404, 
                msg: `No article found under article id: ${article_id}`
            });
        };
        return result;
    });    
};

module.exports.insertComment = (username, body, article_id) => {
    return db
    .query(
       "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
       [username, body, article_id] 
    )
    .then((result) => {
        return result.rows[0]
    })
}

