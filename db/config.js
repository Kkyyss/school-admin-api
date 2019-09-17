const {DATABASE} = require('../config');

// for Sequelize CLI migration purpose
const initial = {
  database: 'heroku_cca4672858a9d4e',
  username: 'b51039b94061f2',
  password: '9a2f88e6',
  host: 'us-cdbr-iron-east-02.cleardb.net',
  dialect: 'mysql',
};

module.exports = {
  development: {
    database: DATABASE.DATABASE || initial.database,
    username: DATABASE.USERNAME || initial.username,
    password: DATABASE.PASSWORD || initial.password,
    host: DATABASE.HSOT || initial.host,
    dialect: DATABASE.DIALECT || initial.dialect,
  },
  test: initial,
  production: {},
};
