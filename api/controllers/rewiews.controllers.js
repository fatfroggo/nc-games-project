const {
  selectReviews,
  selectReviewComments,
  selectReviewsById, updateReviews,
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
        next(err)
    })
}

exports.patchReviewById = (req, res, next) => {
    const { review_id } = req.params;
    const { incVotes } = req.body;

    updateReviews(review_id, incVotes)
    .then((review) => {
        res.status(202).send({ review })
    })
    .catch((err) => {
        next(err)
    })
}

