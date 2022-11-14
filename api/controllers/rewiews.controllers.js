const { selectReviews, selectReviewsById } = require("../models/reviews.models.js")

exports.getReviews = (req, res, next) => {
    selectReviews() 
    .then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getReviewsById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewsById(review_id)
    .then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err)
    })
}

