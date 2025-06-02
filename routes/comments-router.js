const {
  updateCommentById,
  deleteComment,
} = require("../controllers/controllers");
const commentsRouter = require("express").Router();

commentsRouter.patch("/:comment_id", updateCommentById);
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
