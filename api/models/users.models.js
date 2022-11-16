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

exports.selectUserByUsername = (username) => {
    return db.query(`
    SELECT username, name, avatar_url FROM USERS WHERE username = $1
    `, [username])
    .then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({ status : 404, msg: "Not found"})
        }
        else {
        return result.rows[0]
        }
    })
}