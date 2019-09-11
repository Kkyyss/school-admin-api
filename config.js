require('dotenv').config();

const {
  PORT,
  APP_PORT,
  API_URL,
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
} = process.env;

const config = {
  APP_PORT: PORT || APP_PORT,
  NODE_ENV,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  API_URL,
};

module.exports = config;
