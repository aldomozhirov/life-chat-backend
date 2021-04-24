'use strict';

const generateId = require('../utils/generateId.util');
const store = require('../utils/store.util');
const { findPatientById } = require('./patient.service');
const { findMessageById } = require('./message.service');
const { omit } = require('lodash');

exports.createUser = user => {
  const newUser = {
    id: generateId(),
    createdAt: Date.now(),
    ...user,
  };
  store.users.push(newUser);
  return newUser;
};

exports.updateUser = user => {
  let foundIndex = store.users.findIndex(item => item.id === user.id);
  store.users[foundIndex] = user;
  return user;
};

exports.findUserById = userId => {
  return store.users.find(user => user.id === userId);
};

exports.findConsultationsByUserId = userId => {
  return store.consultations
    .filter(consultation => consultation.user_id === userId)
    .map(consultation => {
      return {
        ...omit(consultation, ['patient_id', 'user_id']),
        patient: findPatientById(consultation.patient_id),
        last_message:
          consultation.last_message_id &&
          omit(findMessageById(consultation.last_message_id), [
            'consultation_id',
            'patient_id',
          ]),
      };
    });
};

exports.userExistsById = userId => {
  return !!store.users.find(user => user.id === userId);
};

exports.userExistsByEmail = email => {
  return !!store.users.find(user => user.email === email);
};
