// an array of objects, each object should have the following property:
// username
// name
// avatar_url

const db = require("../../db/connection.js");

exports.selectUsers = () => {
    return db.query(`
    SELECT username, name, avatar_url FROM users
    `)
    .then((result) => {
        return result.rows
    })
}