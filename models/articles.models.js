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
    return db.query('SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;')
    .then((result) => {
        const articles = result.rows;
        articles.forEach(article => {
            article.comment_count = 0;
        });
        const articlePromises = articles.map(article => {
            return db.query('SELECT * FROM comments WHERE article_id = $1;', [article.article_id])
                .then(commentsResult => {
                    commentsResult.rows.forEach(comment => {
                        if (comment.article_id === article.article_id) {
                            article.comment_count++;
                        }
                    });
                    return article; 
                });
        });
        return Promise.all(articlePromises)
        .then(updatedArticles => {
            return updatedArticles; 
        });
    })

}