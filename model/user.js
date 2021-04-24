'use strict';

const connection = require('./connection');

module.exports = connection.Model.extend({
  tableName: 'users',
});
