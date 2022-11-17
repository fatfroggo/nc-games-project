const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  deleteUser,
  patchUser,
  postUser,
} = require("../controllers/users.controllers.js");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

usersRouter.delete("/:username", deleteUser);

usersRouter.patch("/:username", patchUser);

usersRouter.post("/", postUser)

module.exports = usersRouter;
