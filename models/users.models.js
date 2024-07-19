const db = require("../db/connection");
const checkUserExists = require("../check-user-exists");

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;').then((result) => {
      return result.rows;
    });
  };

  exports.selectUserByUsername = (username) => {
    return checkUserExists(username).then((exists) => {
      if (!exists) {
        return Promise.reject({
            status: 404,
            message: "user does not exist",
          });
    }
    return db.query('SELECT * FROM users WHERE username = $1;', [username]).then((result) => {
      return result.rows;
    });
    })
  };