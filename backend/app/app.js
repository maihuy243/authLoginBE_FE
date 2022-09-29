require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080;
const accountRouter = require('./router/auth.router');
const cors = require('cors');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

accountRouter(app);

app.listen(port, () => console.log('app running by port:', port));
