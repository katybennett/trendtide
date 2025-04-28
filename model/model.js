const db = require("../db/connection");

module.exports.selectTopics = () => {
    return db
    .query("SELECT * FROM topics")
};

module.exports.selectArticlesById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    // .then((result) => {
    //     return result.rows[0];
    // })
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


