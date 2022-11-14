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

exports.selectReviewComments = (review_id) => {
  if (/\d/.test(review_id[0])) {
    if (+review_id > 0 && +review_id <= 13){
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
    }
    else {
        return Promise.reject({status: 404, msg: 'Not found'})
    }
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};
