const compression = require('compression');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const helmet = require('helmet');

const api = require('./routes');

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(errorhandler());

// append /api/{version} for our http requests
app.use(api);

app.use((err, req, res, next) => {
  console.log(err.stack);

  res.status(err.status || 500);
  res.json({errors: {
    message: err.message,
    error: err,
  }});
});

module.exports = app;
