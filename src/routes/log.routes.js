const express = require('express');
const router = express.Router();

const { authUser } = require('../controllers/log.controllers');

// => Rota que 'loga' usuário
// -- (/api/v1/users/auth)
router.post('/api/v1/login', (req, res) => {
  authUser(req, res).catch((err) => {
    res.json({ sucess: false, error: err });
  });
});

module.exports = router;
