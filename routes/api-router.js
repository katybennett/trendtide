const apiRouter = require("express").Router();
const { getApi } = require("../controllers/controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.get("/", getApi);

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
