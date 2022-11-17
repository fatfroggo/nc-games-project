const db = require("../../db/connection.js");

exports.selectCategories = (category) => {
  let queryStr = "SELECT * FROM categories";
  let queryValues = [];

  if (category) {
    queryStr += ` WHERE slug = $1;`;
    queryValues.push(category);
  }
  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return result.rows;
    }
  });
};

exports.addCategory = (newCategory) => {
  if ("slug" in newCategory && "description" in newCategory) {
    return db
      .query(
        `
        INSERT INTO categories (slug, description)
    VALUES
    ($1, $2)
    RETURNING *;
  `,
        [newCategory.slug, newCategory.description]
      )
      .then((result) => {
        return result.rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};
