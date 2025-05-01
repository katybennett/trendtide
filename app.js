const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, 
    getTopics,
    getUsers,
    getArticles,
    getArticlesById,
    getArticleComments,
    postComment,
    updateArticleById, 
    deleteComment,
    getUSersById,
    getUsersById} = require("./controllers/controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsersById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
    else {
        next(err);
    };
});

app.use((err, req, res, next) => {

    const knownErrorCodes = ["22P02", "23503"];

    if(knownErrorCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad Request!'})
    }
    else {
        next(err)
    };
});

app.get('/*notfound', (req, res) => {
    res.status(404).send({ msg: '404 Not Found' });
});

module.exports = app;