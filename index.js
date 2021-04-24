'use strict';

const https = require('https');
const server = require('./server');

const { port } = require('./config').server;

const telegram = require('./telegram');

async function bootstrap() {
  /**
   * Add external services init as async operations (db, redis, etc...)
   * e.g.
   * await sequelize.authenticate()
   */
  return https.createServer(server.callback()).listen(port);
}

bootstrap()
  .then(server => {
    console.log(`🚀 Server listening on port ${server.address().port}!`);
    telegram.subscribeUpdates('b2e60dcf-cbbf-413e-9aa0-08fb50a5c675');
  })
  .catch(err => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:');
      console.error(err);
      process.exit();
    });
  });
