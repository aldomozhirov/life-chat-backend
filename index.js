'use strict';

const http = require('http');
const server = require('./server');
const initDb = require('./database');

const { port } = require('./config').server;

const telegram = require('./telegram');

async function bootstrap() {
  /**
   * Add external services init as async operations (db, redis, etc...)
   * e.g.
   * await sequelize.authenticate()
   */
  await initDb();
  return http.createServer(server.callback()).listen(port);
}

bootstrap()
  .then(async server => {
    console.log(`🚀 Server listening on port ${server.address().port}!`);
    await telegram.subscribeUpdates('60bba22378bb6e74fd304c16');
  })
  .catch(err => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:');
      console.error(err);
      process.exit();
    });
  });
