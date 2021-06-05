const { sign } = require('jsonwebtoken');
const constants = require('../constants');
const User = require('../model/user');

module.exports = async function(ctx) {
  const { username, password } = ctx.request.body;

  const user = await User.findOne({ email: username });
  console.log(user);
  if (!!user && password === 'password') {
    ctx.status = 200;
    ctx.body = {
      auth_token: sign({ user_id: user._id }, constants.JWT_SECRET, {
        expiresIn: '48h',
      }),
    };
  } else {
    ctx.status = 401;
  }
  return ctx;
};
