const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { validateComment, validateUpdateArticleVoteCount } = require("../validators/validators")
const { selectTopics,
    selectArticles,
    selectUsers, 
    selectArticlesById,
    selectArticleComments,
    insertComment,
    updateArticleVoteCount, 
    deleteCommentById} = require("../model/model");

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

module.exports.getUsers = (req, res) => {
    
    selectUsers().then(({ rows }) => {
        res.status(200).send({ users: rows });
    })
    .catch((err) => {
        next(err);
    });
};

module.exports.getArticles = (req, res, next) => {

    selectArticles().then(({ rows }) => {
        res.status(200).send({ articles: rows });
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

module.exports.updateArticleById = (req, res, next) => {

    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const errors = validateUpdateArticleVoteCount(inc_votes);

    if (errors.length > 0) {
        res.status(400).send({ errors });
    } else {
        updateArticleVoteCount(inc_votes, article_id)
        .then((updatedArticle) => {
            res.status(200).send( { updatedArticle } )
        })
        .catch((err) => {
            next(err);
        });
    };
};

module.exports.deleteComment = (req, res, next) => {

    const { comment_id } = req.params;

    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    });   
};
