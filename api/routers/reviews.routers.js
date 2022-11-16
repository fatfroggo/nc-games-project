const { getReviews, getReviewsById, patchReviewById, getReviewComments, postComments } = require("../controllers/rewiews.controllers")

const reviewsRouter = require("express").Router()

reviewsRouter.get("/", getReviews)

reviewsRouter.get("/:review_id", getReviewsById)

reviewsRouter.patch("/:review_id", patchReviewById)

reviewsRouter.get("/:review_id/comments", getReviewComments)

reviewsRouter.post("/:review_id/comments", postComments)

module.exports = reviewsRouter