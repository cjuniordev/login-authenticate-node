const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ModelUser = require('../models/user.model');
const userExists = require('../utils/userExists');

require('dotenv').config();

const logController = {};

// => Esse método autentica o 'user'
// => Recebe os seguintes parametros:
/**
 * {
 *  "username": "joao",
 *  "password": "123456"
 * }
 */
logController.authUser = async (req, res) => {
  try {
    ModelUser.sync();

    const exist = userExists(req.body.username);

    if (exist) {
      const user = await ModelUser.findOne({
        where: { username: req.body.username },
      });
      const hash = user.dataValues.password;
      bcrypt
        .compare(req.body.password, hash)
        .then((result, err) => {
          if (result) {
            const id = user.dataValues.id;
            const token = jwt.sign({ id }, process.env.SECRET, {
              expiresIn: 300,
            });
            res.status(200).json({
              sucess: true,
              message: 'User authenticate with sucess',
              token: token,
            });
          } else {
            res.status(406).json({
              sucess: false,
              message: 'Passwords do not match',
              error: err,
            });
          }
        })
        .catch((err) => {
          res.json({ sucess: false, error: err });
        });
    } else {
      res.json({ sucess: false, message: 'User not exists' });
    }
  } catch (err) {
    res.json({ sucess: false, error: err });
  }
};

logController.clearToken = (req, res) => {
  res.status(200).json({
    sucess: true,
    message: 'Token was clear with sucess',
    token: null,
  });
};

module.exports = logController;
