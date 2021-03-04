const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/token.middlewares');

router.get('/api/v1/authorization', verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
