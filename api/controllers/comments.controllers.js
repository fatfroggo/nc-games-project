const { removeComment, updateComment } = require("../models/comments.models.js")

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then((comment) => {
        res.sendStatus(204)
    })
    .catch(next)
}

exports.patchComments = (req, res, next) => {
    const { incVotes } = req.body
    const { comment_id } = req.params;
    updateComment(incVotes, comment_id)
    .then((comment) => {
        res.status(202).send({ comment })
    })
    .catch(next)
}