const db = require("../../db/connection.js");

exports.removeComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments WHERE comment_id = $1 RETURNING *
    `, [comment_id])
    .then((result) => {
        if (!result.rows[0])
          return Promise.reject({ status: 404, msg: "Not found" });
        else return result.rows[0];
      });
}