const express = require("express")

const { getCategories } = require("./controllers/categories.controllers.js")
const { getReviews } = require("./controllers/rewiews.controllers.js")

const app = express();

app.get("/api/categories", getCategories)

app.get("/api/reviews", getReviews)

app.use((err, req, res, next) => {
    console.log(err, "internal server error") // this log is intentional and acts as an error handler
    res.sendStatus(500)
})

module.exports = app;