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

exports.addUser = (newUser) => {
  if("username" in newUser && "name" in newUser && "avatar_url" in newUser) {
    return db.query(`
    INSERT INTO users (username, name, avatar_url)
    VALUES 
    ($1, $2, $3) RETURNING *;
    `, [newUser.username, newUser.name, newUser.avatar_url])
    .then((result) => {
      return result.rows[0]
    })
  }
  else{
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  
}