const express = require("express");
const { deleteComment, updateComment, getCommentById } = require("../controllers/comments.controllers");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);
commentsRouter.patch("/:comment_id", updateComment);
commentsRouter.get("/:comment_id", getCommentById);

module.exports = commentsRouter;
