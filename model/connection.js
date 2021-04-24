'use strict';

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'lifechatsmz',
    database: 'ebdb',
    charset: 'utf8',
  },
});

module.exports = require('bookshelf')(knex);
