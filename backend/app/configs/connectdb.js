const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASS_DB,
  database: process.env.NAME_DB,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    console.log('Connect faild !');
  } else console.log('Connected');
});

module.exports = connection;
