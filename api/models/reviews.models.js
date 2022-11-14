const db = require("../../db/connection.js");

exports.selectReviews = () => {
  return db
    .query(
      `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id) AS comment_count 
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
    SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at
    FROM reviews 
    JOIN users ON users.username = reviews.owner JOIN categories ON categories.slug = reviews.category
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length !== 0) {
        return result.rows[0];
      } else {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
    });
};
