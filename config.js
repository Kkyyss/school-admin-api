require('dotenv').config();

const {
  PORT,
  APP_PORT,
  API_URL,
  API_VERSION,
  NODE_ENV,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_DIALECT,
} = process.env;

const config = {
  APP_PORT: PORT || APP_PORT,
  NODE_ENV,
  API_URL,
  API_VERSION,
  DATABASE: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
  },
};

module.exports = config;
