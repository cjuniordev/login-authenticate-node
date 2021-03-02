const express = require('express');
const router = express.Router();

const {
  authUser,
  allUsers,
  newUser,
  deleteUser,
  alterUser,
} = require('../controllers/user.controllers');

// => Rota que 'loga' usuário
// -- (/api/v1/users/auth)
router.post('/api/v1/users/auth', (req, res) => {
  authUser(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

// => Rota GET que lista todos usuarios
// -- (/api/v1/users)
router.get('/api/v1/users', (req, res) => {
  allUsers(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

// => Rota POST que registra novos usuários
// -- (/api/v1/users)
router.post('/api/v1/users', (req, res) => {
  newUser(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

// => Rota DELETE que deleta um usuário a partir de um 'username' como param
// -- (/api/v1/users/:username)
router.delete('/api/v1/users/:username', (req, res) => {
  deleteUser(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

// => Rota PUT que altera um usuário a partir de um param
// -- (/api/v1/users/:username )
router.put('/api/v1/users/:username', (req, res) => {
  alterUser(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

module.exports = router;
