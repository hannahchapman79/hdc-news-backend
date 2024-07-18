const {removeComment} = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then(() => {
        res.status(204).send({ message: "comment deleted" });
    })
    .catch((err) => {
        next(err);
      })
}