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
  const {limit} = req.query;
  const {p} = req.query;
    selectArticles(sort_by, order, topic, limit, p)
    .then((articles) => {
      const totalCount = articles.length;
        res.status(200).send({ articles, totalCount });
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