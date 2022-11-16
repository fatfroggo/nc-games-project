const commentsRouter = require("express").Router()
const { deleteComment, patchComments } = require("../controllers/comments.controllers.js")

commentsRouter.delete("/:comment_id", deleteComment)

commentsRouter.patch("/:comment_id", patchComments)

module.exports = commentsRouter