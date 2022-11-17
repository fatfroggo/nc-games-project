const { getReviews, getReviewsById, patchReviewById, getReviewComments, postComments, postReviews, deleteReviews } = require("../controllers/rewiews.controllers")

const reviewsRouter = require("express").Router()

reviewsRouter.get("/", getReviews)

reviewsRouter.get("/:review_id", getReviewsById)

reviewsRouter.patch("/:review_id", patchReviewById)

reviewsRouter.get("/:review_id/comments", getReviewComments)

reviewsRouter.post("/:review_id/comments", postComments)

reviewsRouter.post("/", postReviews)

reviewsRouter.delete("/:review_id", deleteReviews)

module.exports = reviewsRouter