const express = require('express');
const router = express.Router();

router.get('/api/v1', (req, res) => {
  res.status(200).send({
    sucess: true,
    message: 'Welcome to API',
    version: '1.0.0',
  });
});

router.post('/api/v1', (req, res) => {
  res.status(200).send({
    sucess: true,
    message: `${req.body.message}`,
    version: '1.0.0',
  });
});

module.exports = router;
