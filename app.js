const express = require("express");
const app = express();
const db = require("./db/connection");
const apiRouter = require("./routes/api-router");
const { InvalidRequestError } = require("./validators/InvalidRequestError");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const knownErrorCodes = ["22P02", "23503"];

  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.name === "InvalidRequestError") {
    res.status(400).send({ msg: err.message });
  } else if (knownErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

app.get("/*notfound", (req, res) => {
  res.status(404).send({ msg: "404 Not Found" });
});

module.exports = app;
