const db = require("../db/connection");
const checkArticleExists = require("../check-article-exists");
const checkUserExists = require("../check-user-exists");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `article does not exist`,
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.selectArticles = () => {
  const query = `
    SELECT 
        articles.article_id, 
        articles.title, 
        articles.topic, 
        articles.author, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
    FROM 
        articles
    LEFT JOIN 
        comments
    ON 
        articles.article_id = comments.article_id
    GROUP BY 
        articles.article_id
    ORDER BY 
        articles.created_at DESC;
`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.selectArticleComments = (article_id) => {
  const query = `
    SELECT 
        *
    FROM
        comments
    WHERE
        article_id = $1
    ORDER BY
        created_at DESC;
    `;
  return db.query(query, [article_id]).then((result) => {
    if (result.rows.length === 0) {
      return checkArticleExists(article_id).then((exists) => {
        if (!exists) {
          return Promise.reject({
            status: 404,
            message: `article does not exist`,
          });
        }
        return result.rows;
      });
    }
    return result.rows;
  });
};

exports.insertComment = (article_id, newComment) => {
  if (!newComment.username || !newComment.body) {
    return Promise.reject({
      status: 400,
      message: "bad request",
    });
  }
  return checkArticleExists(article_id).then((exists) => {
    if (!exists) {
      return Promise.reject({
        status: 404,
        message: "article does not exist",
      });
    }
    return checkUserExists(newComment.username).then((userExists) => {
      if (!userExists) {
        return Promise.reject({
          status: 404,
          message: "user does not exist",
        });
      } else {
        return db
          .query(
            "INSERT INTO comments (author, body, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *",
            [newComment.username, newComment.body, article_id, 0]
          )
          .then((result) => {
            return result.rows[0];
          });
      }
    });
  });
};

exports.incrementVote = (article_id, updateVoteBy) => {
  const num = updateVoteBy.inc_votes;
  if (num === undefined || typeof num !== "number") {
    return Promise.reject({
      status: 400,
      message: "bad request",
    });
  }
  return checkArticleExists(article_id).then((exists) => {
    if (!exists) {
      return Promise.reject({
        status: 404,
        message: "article does not exist",
      });
    }
    const query = `
        UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;
      `;
    return db.query(query, [num, article_id]).then((result) => {
      return result.rows[0];
    });
  });
};
