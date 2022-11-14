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


// Edit
// Responds with:

// a review object, which should have the following properties:

// review_id which is the primary key
// title
// review_body
// designer
// review_img_url
// votes
// category field which references the slug in the categories table
// owner field that references a user's primary key (username)
// created_at
