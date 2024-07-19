const express = require("express");
const {
  getArticleById,
  getArticles,
  getArticleComments,
  postComment,
  updateVote,
} = require("../controllers/articles.controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", updateVote);

module.exports = articlesRouter;
