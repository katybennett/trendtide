const usersRouter = require("express").Router();
const { getUsersById, getUsers } = require("../controllers/controllers");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUsersById);

module.exports = usersRouter;