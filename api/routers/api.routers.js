const apiRouter = require("express").Router();
const { getJSON } = require("../controllers/api.controllers.js");
const categoriesRouter = require("./categories.routers.js");
const commentsRouter = require("./comments.routers.js");
const reviewsRouter = require("./reviews.routers.js");
const usersRouter = require("./users.routers.js");

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.get("/", getJSON);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
