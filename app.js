const express = require("express");
const app = express();
const db = require("./db/connection");
const apiRouter = require('./routes/api-router');

app.use(express.json());

app.use("/api", apiRouter);

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