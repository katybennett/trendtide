const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  updateArticleById,
  postArticle,
} = require("../controllers/controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.post("/", postArticle);
articlesRouter.patch("/:article_id", updateArticleById);

module.exports = articlesRouter;
