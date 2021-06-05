'use strict';

const store = require('../utils/store.util');
const { findPatientById } = require('./patient.service');
const { findMessageById } = require('./message.service');
const User = require('../model/user');
const Billing = require('../model/billing');
const Bot = require('../model/bot');
const { omit } = require('lodash');

exports.createUser = async payload => {
  const newUser = new User(payload);
  await newUser.save();
  return newUser;
};

exports.updateUserBilling = async (userId, payload) => {
  const billing = new Billing(payload);
  return User.findByIdAndUpdate(userId, { billing });
};

exports.updateUserBot = async (userId, payload) => {
  const bot = new Bot(payload);
  return User.findByIdAndUpdate(userId, { bot });
};

exports.updateUserDetails = async (userId, payload) => {
  return User.findByIdAndUpdate(userId, { ...payload });
};

exports.findUserById = async userId => {
  return User.findById(userId);
};

exports.findConsultationsByUserId = (userId, format = false) => {
  return store.consultations
    .filter(consultation => consultation.user_id === userId)
    .map(consultation => {
      return format
        ? {
            ...omit(consultation, ['patient_id', 'user_id']),
            patient: findPatientById(consultation.patient_id),
            last_message:
              consultation.last_message_id &&
              omit(findMessageById(consultation.last_message_id), [
                'consultation_id',
                'patient_id',
              ]),
          }
        : consultation;
    });
};

exports.userExistsById = async userId => {
  const user = await User.findById(userId);
  return !!user;
};

exports.userExistsByEmail = async email => {
  const user = await User.findOne({ email });
  return !!user;
};
