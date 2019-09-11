const config = require('./config');
const app = require('./app');

const { APP_PORT } = config;

// Establish DB connection.
// require('./db')();

// launch our backend into a port
app.listen(APP_PORT, () => console.log(`LISTENING ON PORT ${APP_PORT}`));
