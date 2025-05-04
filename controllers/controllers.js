const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { validateComment, validateUpdateVoteCount } = require("../validators/validators")
const { selectTopics,
    selectArticles,
    selectUsers, 
    selectArticleById,
    selectArticleComments,
    insertComment,
    updateArticleVoteCount, 
    deleteCommentById,
    selectUserById,
    updateCommentVoteCount} = require("../model/model");

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = async (req, res, next) => {

    try {
        const topics = await selectTopics();
        res.status(200).send({ topics });
    } 
    catch (err) {
        next(err);
    };
};

exports.getUsers = async (req, res, next) => {

    try {
        const users = await selectUsers();
        res.status(200).send({ users });
    }
    catch (err) {
        next(err);
    };
};

exports.getUserById = async (req, res, next) => {

    const { username } = req.params;

    try {
        const user = await selectUserById(username);
        res.status(200).send(user);
    }
    catch (err) { 
        next(err);
    };
};

exports.getArticles = async (req, res, next) => {

    const { sortBy, order, topic } = req.query;

    try {
        const articles = await selectArticles(sortBy, order, topic);
        res.status(200).send({ articles });
    }
    catch (err) { 
        next(err);
    };
};

exports.getArticleById = async (req, res, next) => {

    const { article_id } = req.params;

    try {
        const article = await selectArticleById(article_id);
        res.status(200).send( { article });
    }
    catch (err) { 
        next(err);
    };
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

exports.updateArticleById = async (req, res, next) => {

    const { article_id } = req.params;
    const { inc_votes } = req.body;

    try {
        const errors = validateUpdateVoteCount(inc_votes);

        if (errors.length > 0) {
            res.status(400).send({ errors });
        } else {
            const updatedArticle = await updateArticleVoteCount(inc_votes, article_id);
            res.status(200).send( { updatedArticle } );
        }
    }
    catch (err) {
        next(err);
    };
};

exports.updateCommentById = async (req, res, next) => {

    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    try {
        const errors = validateUpdateVoteCount(inc_votes);
        if (errors.length > 0) {
            res.status(400).send({ errors });
        } else {
            const updatedComment = await updateCommentVoteCount(inc_votes, comment_id);
            res.status(200).send( { updatedComment } )
        }
    }
    catch (err) {
        next(err);
    };
};

exports.deleteComment = async (req, res, next) => {

    const { comment_id } = req.params;

    try {
        const result = await deleteCommentById(comment_id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    };
};
