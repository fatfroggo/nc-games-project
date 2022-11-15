const express = require("express");

const { getCategories } = require("./controllers/categories.controllers.js");
const {
  getReviews,
  getReviewsById,
  patchReviewById
} = require("./controllers/rewiews.controllers.js");

const app = express();
app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsById);

app.patch("/api/reviews/:review_id", patchReviewById)

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
