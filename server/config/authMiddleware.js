const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, token ausente.' });
  }

  try {
    const verified = jwt.verify(token, '30549ceb13eb9feb9d08d4d573598fcc667c3947');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
