require('dotenv').config();
const jwt = require('jsonwebtoken');

const createToken = (user) =>
  jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_TIME_LIFE,
    algorithm: 'HS256',
  });

const refreshToken = (user) =>
  jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN,
    algorithm: 'HS256',
  });

module.exports = {
  createToken: createToken,
  refreshToken: refreshToken,
};
