const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { selectTopics,
    selectArticles, 
    selectArticlesById,
    selectArticleComments } = require("../model/model");

module.exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};

module.exports.getTopics = (req, res) => {
   
    selectTopics().then(({ rows }) => {
        res.status(200).send({ topics: rows });
    })
    .catch((err) => {
        next(err);
    });
};

module.exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticlesById(article_id)
    .then((article) => {
        res.status(200).send( { article })
    })
    .catch((err) => {
        next(err);
    });
};

module.exports.getArticles = (req, res, next) => {

    selectArticles().then((result) => {
        res.status(200).send({ articles: result.rows });
    })
    .catch((err) => {
        next(err);
    });
};

module.exports.getArticleComments = (req, res, next) => {

    const { article_id } = req.params;

    selectArticleComments(article_id).then(({ rows }) => {
        res.status(200).send({ comments: rows }); 
    })
    .catch((err) => {
        next(err);
    });
};

module.exports.postComments = (req, res, next) => {

    const {username, body } = req.body;
    
}
