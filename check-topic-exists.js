const db = require("./db/connection");

function checkTopicExists (topic) {
    return db 
        .query('SELECT * FROM topics WHERE slug = $1', [topic])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false;
            }
            else if (rows.length === 1) {
                return true;
            }
        })
}



module.exports = checkTopicExists;