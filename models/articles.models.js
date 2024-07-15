const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id] )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
              status: 404,
              message: `article does not exist`,
            });
          }
          else {
            return result.rows[0];
          }
      });
}

exports.selectArticles = () => {
    return db.query('SELECT * FROM articles;')
    .then((result) => {
        const articles = result.rows;
        const comment_count = 0;
       const newArticles = articles.map((article) => {
            return db.query ('SELECT * FROM comments;')
            .then((commentsResult) => {
                const comments = commentsResult.rows;
                comments.forEach((comment) => {
                    if (article.article_id === comment.article_id) {
                        article.comment_count ++;
                    }
                })
            })
        })
        return newArticles;

    })

}