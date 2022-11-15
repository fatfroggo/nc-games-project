const db = require("../../db/connection.js");

exports.selectReviews = () => {
  return db
    .query(
      `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::int AS comment_count 
    FROM reviews 
    JOIN users ON users.username = reviews.owner LEFT JOIN comments ON comments.review_id = reviews.review_id 
    GROUP BY reviews.review_id ORDER BY created_at DESC;
    `
    )
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
        return Promise.reject({ status: 404, msg: "Not found" })
      } else {
        return result.rows[0];
      }
    });
};

exports.addComments = (newComment, review_id) => {
  if(
    "username" in newComment &&
    "body" in newComment
  ){
  return db.query(`
    INSERT INTO comments (author, body, review_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `, [newComment.username, newComment.body, review_id])
    .then((result) => {
      return result.rows[0]
    })
  }
  else {
    return Promise.reject({ status : 400, msg : "Bad request"})
  }
}

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
