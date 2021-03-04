const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const headerAuth = req.headers.authorization;
    if (!headerAuth) {
      return res
        .status(401)
        .json({ sucess: false, message: 'No token provided' });
    }
    const [, token] = headerAuth.split(' ');
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).json({
          sucess: false,
          message: 'Failed to authenticate token',
        });
      }

      req.decoded = decoded;
      next();
    });
  } catch (err) {
    res.json({ sucess: false, error: err });
  }
};

module.exports = verifyToken;
