const { selectArticleById, selectArticles, selectArticleComments, sendComment } = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      })
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      })
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
  .then((comments) => {
    res.status(200).send({ comments });
  })
  .catch((err) => {
    next(err);
  })
}

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  sendComment(article_id, newComment)
  .then((comment) => {
    res.status(201).send({ comment });
  })
  .catch((err) => {
    next(err);
  })
}