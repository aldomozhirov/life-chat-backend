'use strict';

const store = require('../utils/store.util');
const { findPatientById } = require('./patient.service');
const { findMessageById } = require('./message.service');
const User = require('../model/user');
const { omit } = require('lodash');

exports.createUser = async user => {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
};

exports.updateUser = user => {
  let foundIndex = store.users.findIndex(item => item.id === user.id);
  store.users[foundIndex] = user;
  return user;
};

exports.findUserById = async userId => {
  const user = await User.findById(userId);
  return user;
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

exports.userExistsById = userId => {
  return !!store.users.find(user => user.id === userId);
};

exports.userExistsByEmail = async email => {
  const user = await User.findOne({ email });
  return !!user;
};
