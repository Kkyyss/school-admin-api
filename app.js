const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const errorhandler = require('errorhandler');

// const api = require('./routes');

const app = express();

app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(session({ secret: 'ecommerce', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.use(errorhandler());

// append /api for our http requests
// app.use(api);

app.use((err, req, res, next) => {
  console.log(err.stack);

  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: err
  }});
});

module.exports = app;
