const koaJwt = require('koa-jwt');
const { jwtSecret: secret } = require('../config').server;

module.exports = koaJwt({
  secret,
});
