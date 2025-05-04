const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { validateComment, validateUpdateVoteCount } = require("../validators/validators")
const { selectTopics,
    selectArticles,
    selectUsers, 
    selectArticlesById,
    selectArticleComments,
    insertComment,
    updateArticleVoteCount, 
    deleteCommentById,
    selectUsersById,
    updateCommentVoteCount} = require("../model/model");

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
    
    selectTopics().then(({ rows }) => {
        res.status(200).send({ topics: rows });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsers = (req, res) => {
    
    selectUsers().then(({ rows }) => {
        res.status(200).send({ users: rows });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsersById = (req, res, next) => {

    const { username } = req.params;

    selectUsersById(username)
    .then((user) => {
        res.status(200).send(user)
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {

    const { sortBy, order, topic } = req.query;

    selectArticles(sortBy, order, topic).then(( articles ) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesById = (req, res, next) => {

    const { article_id } = req.params;

    selectArticlesById(article_id)
    .then((article) => {
        res.status(200).send( { article })
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticleComments = async (req, res, next) => {
    
    const { article_id } = req.params;

    try {
        const comments = await selectArticleComments(article_id);
        res.status(200).send({ comments });
    }
    catch (err) {
        next(err);
    };
};

exports.postComment = async (req, res, next) => {
    
    const { article_id } = req.params;
    const { username, body } = req.body;

    try {
        const errors = validateComment(username, body);

        if (errors.length > 0) {
            res.status(400).send({ errors });
        } else {
            const comment = await insertComment(username, body, article_id);
            res.status(201).send({ comment })
        }
    }
    catch (err) {
        next(err);
    };
};

exports.updateArticleById = (req, res, next) => {

    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const errors = validateUpdateVoteCount(inc_votes);

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


exports.updateCommentById = (req, res, next) => {

    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const errors = validateUpdateVoteCount(inc_votes);

    if (errors.length > 0) {
        res.status(400).send({ errors });
    } else {
        updateCommentVoteCount(inc_votes, comment_id)
        .then((updatedComment) => {
            res.status(200).send( { updatedComment } )
        })
        .catch((err) => {
            next(err);
        });
    };
};


exports.deleteComment = (req, res, next) => {

    const { comment_id } = req.params;

    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    });   
};
