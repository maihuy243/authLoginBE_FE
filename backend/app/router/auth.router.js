const AccountController = require('../controllers/account.controller');
const middleWareCheckToken = require('../controllers/middlewareCheckToken');
module.exports = (app) => {
  app.post('/account/dangki', AccountController.register);
  app.post('/account/dangnhap', AccountController.login);
  app.post('/account/refresh', AccountController.requestRefreshToken);
  app.get(
    '/account/logout',
    middleWareCheckToken.verify,
    AccountController.logout,
  );
  app.get(
    '/account',
    middleWareCheckToken.verify,
    AccountController.getAccount,
  );
};
