const db = require("../db/connection");
const checkCommentExists = require("../check-comment-exists");

exports.removeComment = (comment_id) => {
    return checkCommentExists(comment_id).then((exists) => {
        if (!exists) {
            return Promise.reject({
                status: 404,
                message: "comment does not exist",
              });
        }
        return db
        .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
        .then((result) => {
            return result;
        })
    })
    }

    exports.incrementVoteComment = (comment_id, updateVoteBy) => {
        const num = updateVoteBy.inc_votes;
        if (num === undefined || typeof num !== "number") {
          return Promise.reject({
            status: 400,
            message: "bad request",
          });
        }
        return checkCommentExists(comment_id).then((exists) => {
          if (!exists) {
            return Promise.reject({
              status: 404,
              message: "comment does not exist",
            });
          }
          const query = `
              UPDATE comments 
              SET votes = votes + $1 
              WHERE comment_id = $2 
              RETURNING *;
            `;
          return db.query(query, [num, comment_id]).then((result) => {
            return result.rows[0];
          });
        });
      };



  exports.selectCommentById = (comment_id) => {
    return checkCommentExists(comment_id).then((exists) => {
      if (!exists) {
        return Promise.reject({
            status: 404,
            message: "comment does not exist",
          });
    }
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id]).then((result) => {
      return result.rows;
    });
    })
  };