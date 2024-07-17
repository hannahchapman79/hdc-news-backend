const db = require("./db/connection");

function checkUserExists (username) {
    return db 
        .query('SELECT * FROM users WHERE username = $1', [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false;
            }
            else if (rows.length === 1) {
                return true;
            }
        })
}



module.exports = checkUserExists;