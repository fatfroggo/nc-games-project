const { selectCategories, addCategory } = require("../models/categories.models.js")

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCategory = (req, res, next) => {
    const newCategory = req.body
    addCategory(newCategory)
    .then((category) => {
        res.status(201).send({ category })
    })
    .catch((next))
}