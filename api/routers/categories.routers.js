const categoriesRouter = require("express").Router()
const { getCategories, postCategory } = require("../controllers/categories.controllers.js");

categoriesRouter.get("/", getCategories)

categoriesRouter.post("/", postCategory)

module.exports = categoriesRouter