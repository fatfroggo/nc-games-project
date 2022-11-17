const {
  selectReviews,
  selectReviewComments,
  selectReviewsById,
  updateReviews,
  addComments,
  addReviews,
  removeReviews
} = require("../models/reviews.models.js");

const { selectCategories } = require("../models/categories.models.js");
const { selectUserByUsername } = require("../models/users.models.js");

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order, limit, p } = req.query;
    selectCategories(category)
    .then(() => {
        return selectReviews(sort_by, order, limit, p, category)
    })
    .then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  const { limit, p } = req.query
  selectReviewsById(review_id)
    .then(() => {
      return selectReviewComments(review_id, limit, p);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getReviewsById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { incVotes } = req.body;

  updateReviews(review_id, incVotes)
    .then((review) => {
      res.status(202).send({ review });
    })
    .catch(next);
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
    .catch(next);
};

exports.postReviews = (req, res, next) => {
  const newReview = req.body;
  selectUserByUsername(newReview.owner)
  .then(() => {
    return selectCategories(newReview.category)
  })
  .then(() => {
    return addReviews(newReview) 
  })
  .then((review) => {
    res.status(201).send({review})
  })
  .catch(next)
}

exports.deleteReviews = (req, res, next) => {
  const { review_id } = req.params
  removeReviews(review_id)
  .then((result) => {
    res.sendStatus(204)
  })
  .catch(next)
}