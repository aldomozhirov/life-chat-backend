'use strict';

const joi = require('joi');
const userSchema = require('../../schemas/user');
const {
  userExistsByEmail,
  findUserById,
  createUser,
  updateUserBilling,
  updateUserBot,
  updateUserDetails,
} = require('../../services/user.service');
const {
  findConsultationsByUserId,
} = require('../../services/consultation.service');
const constants = require('../../constants');
const { verify } = require('jsonwebtoken');

exports.createOne = async ctx => {
  const data = joi.validate(ctx.request.body, userSchema.user);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  if (await userExistsByEmail(data.value.email)) {
    return ctx.throw(403, 'User with such email already exists');
  }
  const newUser = await createUser(data.value);
  ctx.status = 201;
  ctx.body = newUser;
};

exports.updateBilling = async ctx => {
  const data = joi.validate(ctx.request.body, userSchema.payment);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  await updateUserBilling(getUserIdByToken(ctx), data.value);
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.updateBot = async ctx => {
  const data = joi.validate(ctx.request.body, userSchema.bot);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  await updateUserBot(getUserIdByToken(ctx), data.value);
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.updateDetails = async ctx => {
  const data = joi.validate(ctx.request.body, userSchema.details);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  await updateUserDetails(getUserIdByToken(ctx), data.value);
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS' };
};

exports.getMe = async ctx => {
  const user = await findUserById(getUserIdByToken(ctx));
  ctx.assert(user, 404, "The requested user doesn't exist");
  ctx.status = 200;
  ctx.body = user;
};

exports.getMyConsultations = async ctx => {
  const userId = getUserIdByToken(ctx);
  const consultations = await findConsultationsByUserId(userId, true);
  ctx.status = 200;
  ctx.body = consultations;
};

const getUserIdByToken = ctx => {
  const token = ctx.request.header.authorization.split(' ')[1];
  const decoded = verify(token, constants.JWT_SECRET);
  return decoded.user_id;
};
