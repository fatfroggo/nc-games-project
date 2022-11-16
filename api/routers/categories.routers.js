const categoriesRouter = require("express").Router()
const { getCategories } = require("../controllers/categories.controllers.js");

categoriesRouter.get("/", getCategories)

module.exports = categoriesRouter