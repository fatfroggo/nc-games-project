const {
  selectReviews,
  selectReviewComments,
  selectReviewsById, addComments,
} = require("../models/reviews.models.js");

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then(() => {
      return selectReviewComments(review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};exports.postComments = (req, res, next) => {
    const { review_id } = req.params;
    const newComment = req.body;
    selectReviewsById(review_id)
    .then(() => {
        return addComments(newComment, review_id)
    })
    .then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}
