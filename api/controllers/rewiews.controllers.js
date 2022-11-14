const { selectReviews, selectReviewComments } = require("../models/reviews.models.js")

exports.getReviews = (req, res, next) => {
    selectReviews() 
    .then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewComments(review_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
 }
 
 