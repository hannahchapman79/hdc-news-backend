const db = require("./db/connection");

function checkCommentExists (comment_id) {
    return db 
        .query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false;
            }
            else if (rows.length === 1) {
                return true;
            }
        })
}



module.exports = checkCommentExists;