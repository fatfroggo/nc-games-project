const express = require("express");

const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews, getReviewComments,
  getReviewsById,
  postComments
} = require("./controllers/rewiews.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js")

const app = express();
app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.get("/api/users", getUsers)

app.get("/api/reviews/:review_id/comments", getReviewComments)

app.post("/api/reviews/:review_id/comments", postComments)


app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'Bad request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
  console.log(err, "internal server error"); // this log is intentional and acts as an error handler
  res.sendStatus(500);
});

module.exports = app;
