const {
  selectReviews,
  selectReviewComments,
  selectReviewsById,
  updateReviews,
  addComments,
} = require("../models/reviews.models.js");

const { selectCategories } = require("../models/categories.models.js")

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query;

    selectCategories(category)
    .then(() => {
        return selectReviews(sort_by, order, category)
    })
    .then((reviews) => {
        res.status(200).send({ reviews })
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
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { incVotes } = req.body;

  updateReviews(review_id, incVotes)
    .then((review) => {
      res.status(202).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { review_id } = req.params;
  const newComment = req.body;
  selectReviewsById(review_id)
    .then(() => {
      return addComments(newComment, review_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((next));
};
