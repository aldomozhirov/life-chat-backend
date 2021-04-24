const koaJwt = require('koa-jwt');
const constants = require('../constants');

module.exports = koaJwt({
  secret: constants.JWT_SECRET, // Should not be hardcoded
});
