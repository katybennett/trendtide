const db = require("../db/connection");

module.exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
}

