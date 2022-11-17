const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  deleteUser,
  patchUser,
} = require("../controllers/users.controllers.js");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByUsername);

usersRouter.delete("/:username", deleteUser);

usersRouter.patch("/:username", patchUser);

module.exports = usersRouter;
