const express = require("express")

const { getCategories } = require("./controllers/games.controllers.js")
const { getReviews, getReviewsById } = require("./controllers/rewiews.controllers.js")

const app = express();

app.get("/api/categories", getCategories)

app.get("/api/reviews", getReviews)

app.get("/api/reviews/:review_id", getReviewsById)

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({ msg : err.msg })
    }
    else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    console.log(err, "internal server error")
    res.sendStatus(500)
})

module.exports = app;