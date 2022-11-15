const { fs } = require("fs")

exports.readJSON = () => {
    fs.readFile("../../endpoints.json")
    .then((result) => {
        return result
    })
}