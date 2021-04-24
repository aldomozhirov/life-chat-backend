'use strict';

const joi = require('joi');
const userSchema = require('../../schemas/user');
const {
  userExistsByEmail,
  userExistsById,
  findUserById,
  createUser,
  updateUser,
  findConsultationsByUserId,
} = require('../../services/user.service');
const constants = require('../../constants');
const { verify } = require('jsonwebtoken');

exports.createOne = ctx => {
  const data = joi.validate(ctx.request.body, userSchema.user);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  if (userExistsByEmail(data.value.email)) {
    return ctx.throw(403, 'User with such email already exists');
  }

  const newUser = createUser(data.value);

  ctx.status = 201;
  ctx.body = newUser;
};

exports.updatePayment = ctx => {
  const data = joi.validate(ctx.request.body, userSchema.payment);
  if (data.error) {
    return ctx.throw(422, data.error);
  }

  let updatedUser = findUserById(getUserIdByToken(ctx));
  ctx.assert(updatedUser, 404, "The requested user doesn't exist");

  updatedUser.payment = data.value;
  updateUser(updatedUser);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.updateBot = ctx => {
  const data = joi.validate(ctx.request.body, userSchema.bot);
  if (data.error) {
    return ctx.throw(422, data.error);
  }

  let updatedUser = findUserById(getUserIdByToken(ctx));
  ctx.assert(updatedUser, 404, "The requested user doesn't exist");

  updatedUser.bot = data.value;
  updateUser(updatedUser);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.updateDetails = ctx => {
  const data = joi.validate(ctx.request.body, userSchema.details);
  if (data.error) {
    return ctx.throw(422, data.error);
  }

  let updatedUser = findUserById(getUserIdByToken(ctx));
  ctx.assert(updatedUser, 404, "The requested user doesn't exist");

  updatedUser.details = data.value;
  updateUser(updatedUser);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.getMe = ctx => {
  const user = findUserById(getUserIdByToken(ctx));
  ctx.assert(user, 404, "The requested user doesn't exist");
  ctx.status = 200;
  ctx.body = user;
};

exports.getMyConsultations = ctx => {
  const userId = getUserIdByToken(ctx);
  ctx.assert(userExistsById(userId), 404, "The requested user doesn't exist");
  const consultations = findConsultationsByUserId(userId, true);
  ctx.status = 200;
  ctx.body = consultations;
};

const getUserIdByToken = ctx => {
  const token = ctx.request.header.authorization.split(' ')[1];
  const decoded = verify(token, constants.JWT_SECRET);
  return decoded.user_id;
};
