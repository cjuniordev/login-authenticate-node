const bcrypt = require('bcrypt');

async function hashPassword(password) {
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return hash;
    })
    .catch((err) => {
      return err;
    });
}

module.exports = hashPassword;
