const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Token not provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(401).send({ error: 'Not a valid token.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token expired.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Token invalid.' });
    } else {
      return res.status(401).send({ error: 'Not authorized to access this resource.' });
    }
  }
};

module.exports = auth;
