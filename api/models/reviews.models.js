const db = require("../../db/connection.js");

exports.selectReviews = (sort_by = "created_at", order = "DESC", category) => {
  const validColumns = ["review_id", "title", "category", "designer", "review_body", "review_img_url", "created_at", "votes"]
  
  const validOrders = ["ASC", "DESC"]

  if(!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" })
  }

  if(!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" })
  }

  let queryStr = `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::int AS comment_count 
  FROM reviews 
  JOIN users ON users.username = reviews.owner LEFT JOIN comments ON comments.review_id = reviews.review_id `

  let queryValues = []

  if(category) {
      queryStr += `WHERE category = $1 `
      queryValues.push(category)
  }

  queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
  console.log(order, "order")
  return db.query(queryStr, queryValues)
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewsById = (review_id) => {
  return db
    .query(
      `
    SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.review_id)::int AS comment_count
    FROM reviews 
    JOIN users ON users.username = reviews.owner JOIN categories ON categories.slug = reviews.category
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;
    `,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.updateReviews = (review_id, incVotes) => {
  return db
    .query(
      `
    UPDATE reviews SET votes = (votes + $1) WHERE review_id = $2 RETURNING *;
  `,
      [incVotes, review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.addComments = (newComment, review_id) => {
  if ("username" in newComment && "body" in newComment) {
    return db
      .query(
        `
    INSERT INTO comments (author, body, review_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `,
        [newComment.username, newComment.body, review_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};

exports.selectReviewComments = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM comments JOIN users ON users.username = comments.author WHERE review_id = $1 ORDER BY created_at DESC;
    `,
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};
