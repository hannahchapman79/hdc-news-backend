const db = require("../db/connection");
const checkArticleExists = require("../check-article-exists");

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
    `
  return db
    .query(query, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return checkArticleExists(article_id).then(exists => {
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
      })
    }
