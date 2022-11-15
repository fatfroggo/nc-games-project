const { readJSON } = require("../models/api.models.js")

exports.getJSON = (req, res, next) => {
    readJSON()
    .then((result) => {
        res.status(200).send(result)
    })
}