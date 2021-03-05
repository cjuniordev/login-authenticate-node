const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/token.middlewares');

router.get('/api/v1/authorization', verifyToken, (req, res) => {
  return res.status(200).json({
    sucess: true,
    message: 'Token is valid',
    decoded: req.decoded,
  });
});

module.exports = router;
