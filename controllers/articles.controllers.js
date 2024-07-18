const { selectArticleById, selectArticles, selectArticleComments, insertComment, incrementVote } = require("../models/articles.models")

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
  const {sort_by} = req.query;
  const {order} = req.query;
  const {topic} = req.query;
    selectArticles(sort_by, order, topic)
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
  insertComment(article_id, newComment)
  .then((comment) => {
    res.status(201).send({ comment });
  })
  .catch((err) => {
    next(err);
  })
}

exports.updateVote = (req, res, next) => {
  const num = req.body;
  const { article_id } = req.params;
  incrementVote(article_id, num)
  .then((updatedArticle) => {
    res.status(200).send({ updatedArticle });
  })
  .catch((err) => {
    next(err);
  })
}