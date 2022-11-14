const express = require("express")

const { getCategories } = require("./controllers/games.controllers.js")

const app = express();
app.use(express.json())

app.get("/api/categories", getCategories)

app.use((err, req, res, next) => {
    console.log(err, "internal server error")
    res.sendStatus(500)
})

module.exports = app;