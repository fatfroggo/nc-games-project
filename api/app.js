const express = require("express");

const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews,
  getReviewComments,
  getReviewsById,
  patchReviewById,
  postComments,
} = require("./controllers/rewiews.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js")
const { getJSON } = require("./controllers/api.controllers.js")

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/users", getUsers)

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postComments);

app.get("/api", getJSON)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "internal server error"); // this log is intentional and acts as an error handler
  res.sendStatus(500);
});

module.exports = app;
