const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
const { selectTopics } = require("../model/model");

module.exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};

module.exports.getTopics = (req, res) => {
   
    selectTopics().then((result) => {
        res.status(200).send({ topics: result.rows });
    })
    .catch((err) => {
        console.log(err);
        next(err);
    });
};