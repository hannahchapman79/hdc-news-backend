const {removeComment, incrementVoteComment, selectCommentById} = require("../models/comments.models");

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

exports.updateComment = (req, res, next) => {
    const num = req.body;
    const { comment_id } = req.params;
    incrementVoteComment(comment_id, num)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    })
  }

  exports.getCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    selectCommentById(comment_id).then((comment) => {
        res.status(200).send({comment});
    })
    .catch((err) => {
        next(err);
      })
}

