const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, 
    getTopics,
    getArticles,
    getArticlesById,
    getArticleComments,
    postComments } = require("./controllers/controllers");

// app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComments);

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
    else {
        next(err);
    };
});

app.use((err, req, res, next) => {

    const knownErrorCodes = ["22P02"];

    if(knownErrorCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad Request!'})
    }
    else {
        console.log(err)
        next(err)
    };
});

app.get('/*notfound', (req, res) => {
    res.status(404).send({ msg: '404 Not Found' });
});

module.exports = app;