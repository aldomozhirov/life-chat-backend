const { sign } = require('jsonwebtoken');
const store = require('../utils/store.util');
const constants = require('../constants');

module.exports = function(ctx) {
  const { username, password } = ctx.request.body;

  const user = store.users.find(user => user.email === username);
  if (!!user && password === 'password') {
    ctx.status = 200;
    ctx.body = {
      auth_token: sign({ user_id: user.id }, constants.JWT_SECRET, {
        expiresIn: '48h',
      }),
    };
  } else {
    ctx.status = 401;
  }
  return ctx;
};
