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