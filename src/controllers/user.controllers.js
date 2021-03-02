const bcrypt = require('bcrypt');
const ModelUser = require('../models/user.model');
const hashPassword = require('../utils/hashPassword');

const userController = {};

// => Esse método identifica se o 'user' existe na base de dados
userController.userExists = async (user) => {
  return ModelUser.findOne({ where: { username: user } });
};

// => Esse método autentica o 'user'
userController.authUser = async (req, res) => {
  try {
    ModelUser.sync();

    const username = req.body.username;
    const userExists = userController.userExists(username);

    if (userExists != null) {
      const user = await ModelUser.findOne({
        where: { username: username },
      });
      const hash = user.dataValues.password;
      bcrypt
        .compare(req.body.password, hash)
        .then((result, err) => {
          if (result) {
            res.status(200).json({
              sucess: true,
              message: 'User authenticate with sucess',
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

// => Esse método lista todos 'users' registrados
userController.allUsers = async (req, res) => {
  ModelUser.sync();
  const users = await ModelUser.findAll();
  if (users === null) {
    res.status(404).json({ sucess: false, message: 'Not found!' });
  } else {
    res.status(200).json(users);
  }
};

// => Esse método cria novos 'users' no BD
// => Recebe os seguintes parametros:
/**
 * {
 *  "username": "João",
 *  "password": "123456",
 *  "password2": "123456",
 *  "email": "joao@gmail.com",
 *  "isAdmin": "false"
 * }
 */
userController.newUser = async (req, res) => {
  ModelUser.sync();
  if (req.body.username && req.body.password) {
    if (req.body.password2 && req.body.password === req.body.password2) {
      ModelUser.findOne({ where: { username: req.body.username } }).then(
        (user) => {
          if (user) {
            res.json({ sucess: false, message: 'Invalid username' });
          } else {
            let encryptPassword;
            try {
              bcrypt
                .hash(req.body.password, 10)
                .then((hash) => {
                  encryptPassword = hash;

                  const newUser = new ModelUser({
                    username: req.body.username,
                    password: encryptPassword,
                    email: req.body.email,
                    isAdmin: req.body.isAdmin,
                  });
                  newUser
                    .save()
                    .then(() => {
                      res.status(201).json({
                        sucess: true,
                        message: 'User created with sucess',
                      });
                    })
                    .catch((err) => {
                      res.status(500).json({ sucess: false, message: err });
                    });
                })
                .catch((err) => {
                  res.status(500).json({
                    sucess: false,
                    message: 'Error on encryptation' + err,
                  });
                });
            } catch (err) {
              res.status(500).json({
                sucess: false,
                message: 'Error on sign up.',
                error: err,
              });
            }
          }
        }
      );
    } else {
      res.status(400).json({ sucess: false, message: 'Passwords dont match' });
    }
  } else {
    res.status(400).json({
      sucess: false,
      message: 'Username and passwords fields are requireds',
    });
  }
};

// => Esse método deleta um 'user'
// => Recebe um 'user' (STRING) como parametro
userController.deleteUser = async (req, res) => {
  ModelUser.sync();
  try {
    if (userController.userExists(req.params.username) != null) {
      ModelUser.destroy({ where: { username: req.params.username } });
      res
        .status(200)
        .json({ sucess: true, message: 'User deleted with sucess' });
    } else {
      res.status(404).json({
        sucess: true,
        message: 'User not exists or not found on database',
      });
    }
  } catch (err) {
    res.status(409).json({ sucess: false, error: err });
  }
};

// => Esse método é responsável por alterar os dados de um 'user'
userController.alterUser = async (req, res) => {
  ModelUser.sync();
  try {
    if (userController.userExists(req.params.username) != null) {
      let encryptPassword;
      try {
        encryptPassword = await hashPassword(req.body.password);
      } catch (err) {
        res.status(500).json({ sucess: false, message: err });
      }

      await ModelUser.update(
        {
          username: req.body.username,
          password: encryptPassword,
          email: req.body.email,
        },
        { where: { username: req.params.username } }
      );
      res
        .status(200)
        .json({ sucess: true, message: 'User altered with sucess' });
    } else {
      res.status(404).json({
        sucess: true,
        message: 'User not exists or not found on database',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(409).json({ sucess: false, error: err });
  }
};

module.exports = userController;
