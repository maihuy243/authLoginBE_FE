const db = require('../configs/connectdb');

const modelUser = (user) => {
  username = user.username;
  email = user.email;
  password = user.password;
};

modelUser.createUser = (data, result) => {
  db.query('insert into user set ?', data, (err, listData) => {
    console.log(err);
    if (err) result(null);
    else result(data);
  });
};

modelUser.checkLogin = (data, result) => {
  db.query(
    'select * from user where username = ?',
    [data.username],
    (err, listData) => {
      if (err) {
        result(null);
      } else {
        result(listData[0]);
      }
    },
  );
};

modelUser.getAccount = (result) => {
  db.query('select * from user', (err, data) => {
    if (err) result(null);
    else result(data);
  });
};

module.exports = modelUser;
