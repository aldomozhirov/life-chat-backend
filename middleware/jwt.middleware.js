const koaJwt = require('koa-jwt');
const { jwtSecret: secret } = require('../config');

module.exports = koaJwt({
  secret,
});
