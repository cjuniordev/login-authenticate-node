const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ sucess: false, message: 'Failed to authenticate token.' });
    }

    req.userId = decoded.id;
    console.log(req.userId);
    next();
  });
}

export default verifyToken;
