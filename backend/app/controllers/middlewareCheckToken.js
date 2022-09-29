const jwt = require('jsonwebtoken');

const middleWareCheckToken = {
  verify: (req, res, next) => {
    const token = req.headers.token || req.headers.authorization;
    if (token) {
      const _tokenAccess = token.split(' ')[1];
      jwt.verify(_tokenAccess, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json('Token is not valid !');
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json('You are not authencicate !');
    }
  },
};

module.exports = middleWareCheckToken;
