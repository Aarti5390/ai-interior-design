const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Make sure 'next' is a function (it always is in Express, but keep this check)
  if (typeof next !== 'function') {
    return res.status(500).json({ error: 'Internal server error: next is not a function' });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); // ✅ 'next' is properly defined
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};