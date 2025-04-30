module.exports.validateComment = (username, body) => {

    const errors = [];

    if (!username || username.length === 0) {
        errors.push("username is required")
    }
    if (!body || body.length === 0) {
        errors.push("body is required")
    }

    return errors;

};

module.exports.validateUpdateArticleVoteCount = (inc_votes) => {

    const errors = [];

    if (inc_votes === 0 || !Number.isInteger(inc_votes)) {
        errors.push("inc_vote must be an integer not equal to 0")
    }

    return errors;

};