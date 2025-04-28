const express = require("express");
const app = express();
const db = require("./db/connection");
const { getApi, 
    getTopics } = require("./controllers/controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get('/*notfound', (req, res) => {
    res.status(404).send({ msg: '404 Not Found' });
})

module.exports = app;