const modelUser = require('../models/account.model');
const bcrypt = require('bcryptjs');
const _Token = require('../configs/_Token');
const _jwt = require('jsonwebtoken');

let arrRefreshToken = [];

const AccountController = {
  // REGISTER -------------
  register: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const user = { ...req.body, password: hashed };
      modelUser.createUser(user, (response) => {
        res.status(200).json({ result: response });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // LOGIN -------------

  login: (req, res) => {
    try {
      const user = req.body;
      modelUser.checkLogin(user, async (response) => {
        if (!response) {
          res.status(401).json('Invalid username !');
        } else {
          const comparePassword = await bcrypt.compare(
            user.password,
            response.password,
          );
          if (!comparePassword) {
            res.status(401).json('Invalid password !');
          } else {
            const _tokenAccess = _Token.createToken(response);
            const _freshToken = _Token.refreshToken(response);
            arrRefreshToken.push(_freshToken);
            res.cookie('refreshToken', _freshToken, {
              httpOnly: true,
              secure: false,
              sameSite: 'strict',
            });
            // Không trả về password
            const { password, ...other } = response;
            res.status(200).json({ _tokenAccess, ...other });
          }
        }
      });
    } catch (error) {
      res.status(500).json('Error');
    }
  },

  // LOGOUT ----------------------------

  logout: (req, res) => {
    res.clearCookie('refreshToken');
    arrRefreshToken.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json('Logout Success !');
  },

  // REQUEST REFRESH TOKEN -------------

  requestRefreshToken: (req, res) => {
    const _tokenRefresh = req.cookies.refreshToken;
    // Check Token tạo ra và token khi lấy có trùng nhau không
    if (!arrRefreshToken.includes(_tokenRefresh)) {
      res.status(403).json('Refresh token is not valid');
    }
    // Loại token cũ để thay bằng token mới
    arrRefreshToken.filter((token) => token !== _tokenRefresh);
    if (_tokenRefresh) {
      _jwt.verify(
        _tokenRefresh,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) res.status(401).json('token invalid !');
          const newToken = _Token.createToken(user);
          const newFreshToken = _Token.refreshToken(user);
          arrRefreshToken.push(newFreshToken);
          res.cookie('refreshToken', newFreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
          });

          res.status(200).json({ accessTokenNew: newToken });
        },
      );
    } else res.status(401).json('You are not authenticated !');
  },

  // GET ALL ACCOUNT -------------

  getAccount: (req, res) => {
    modelUser.getAccount((respone) => {
      res.status(200).json({ result: respone });
    });
  },
};

module.exports = AccountController;
