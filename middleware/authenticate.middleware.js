const { sign } = require('jsonwebtoken');
const User = require('../model/user');
const { jwtSecret } = require('../config').server;

module.exports = async function(ctx) {
  const { username, password } = ctx.request.body;

  const user = await User.findOne({ email: username });
  if (!!user && password === 'password') {
    ctx.status = 200;
    ctx.body = {
      auth_token: sign({ user_id: user._id }, jwtSecret, {
        expiresIn: '48h',
      }),
    };
  } else {
    ctx.status = 401;
  }
  return ctx;
};
