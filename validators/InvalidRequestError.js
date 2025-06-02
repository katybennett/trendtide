function InvalidRequestError(errors = []) {
  this.name = "InvalidRequestError";
  this.message = `Invalid Request: ${errors.join(", ")}`;
}
InvalidRequestError.prototype = Error.prototype;

exports.InvalidRequestError = InvalidRequestError;
