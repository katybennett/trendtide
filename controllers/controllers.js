const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { validateComment } = require("../validators/validators")
const { selectTopics,
    selectArticles, 
    selectArticlesById,
    selectArticleComments,
    insertComment } = require("../model/model");

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

module.exports.postComment = (req, res, next) => {
    
    const { article_id } = req.params;
    const { username, body } = req.body;
    const errors = validateComment(username, body);

    if (errors.length > 0) {
        res.status(400).send({ errors });
    } else {
        insertComment(username, body, article_id)
        .then((comment) => {
            res.status(201).send( { comment })
        })
        .catch((err) => {
            next(err);
        });
    };
};
