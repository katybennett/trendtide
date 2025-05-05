const { InvalidRequestError } = require('./InvalidRequestError');

exports.validateComment = (username, body) => {

    const errors = [];

    if (!username || username.length === 0) {
        errors.push("username is required")
    }
    if (!body || body.length === 0) {
        errors.push("body is required")
    }

    if (errors.length > 0) {
        throw new InvalidRequestError(errors);
    }
};

exports.validateUpdateVoteCount = (inc_votes) => {

    const errors = [];

    if (inc_votes === 0 || !Number.isInteger(inc_votes)) {
        errors.push("Vote is not valid")
    };

    if (errors.length > 0) {
        throw new InvalidRequestError(errors);
    }
};
