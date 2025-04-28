const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");

module.exports.getApi = (req, res) => {
    res.status(200).send({ endpoints: endpointsJson });
};