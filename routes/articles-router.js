const { getArticles, getArticleById, getArticleComments, postComment, updateArticleById } = require("../controllers/controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", updateArticleById);

module.exports = articlesRouter;