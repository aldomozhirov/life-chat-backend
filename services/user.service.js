'use strict';

const User = require('../model/user');
const Billing = require('../model/billing');
const Bot = require('../model/bot');

exports.createUser = async payload => {
  const newUser = new User(payload);
  await newUser.save();
  return newUser;
};

exports.updateUserBilling = async (userId, payload) => {
  const billing = new Billing(payload);
  await billing.save();
  return User.findByIdAndUpdate(userId, { billing });
};

exports.updateUserBot = async (userId, payload) => {
  const bot = new Bot(payload);
  await bot.save();
  return User.findByIdAndUpdate(userId, { bot });
};

exports.updateUserDetails = async (userId, payload) => {
  return User.findByIdAndUpdate(userId, { ...payload });
};

exports.findUserById = async userId => {
  return User.findById(userId).populate('bot');
};

exports.userExistsById = async userId => {
  const user = await User.findById(userId);
  return !!user;
};

exports.userExistsByEmail = async email => {
  const user = await User.findOne({ email });
  return !!user;
};
