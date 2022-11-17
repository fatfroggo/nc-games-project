const db = require("../../db/connection.js");

exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT username, name, avatar_url FROM users
    `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `
    SELECT username, name, avatar_url FROM USERS WHERE username = $1
    `,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.removeUser = (username) => {
  return db
    .query(
      `
    DELETE FROM users WHERE username = $1 RETURNING *
    `,
      [username]
    )
    .then((result) => {
      if (!result.rows[0])
        return Promise.reject({ status: 404, msg: "Not found" });
      else return result.rows[0];
    });
};

exports.updateUser = (newUsername, username) => {
  if ("username" in newUsername) {
    return db
      .query(
        `
        UPDATE users SET username = $1 WHERE username = $2 RETURNING *;
      `,
        [newUsername.username, username]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        } else {
          return result.rows[0];
        }
      });
  }
};
