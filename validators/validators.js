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
