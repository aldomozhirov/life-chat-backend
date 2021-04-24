'use strict';

const store = require('../utils/store.util');
const generateId = require('../utils/generateId.util');

exports.findPatientById = patientId => {
  return store.patients.find(patient => patient.id === patientId);
};

exports.findPatientByChatId = chatId => {
  return store.patients.find(patient => patient.chat_id === chatId);
};

exports.createPatient = data => {
  const newPatient = {
    id: generateId(),
    createdAt: Date.now(),
    ...data,
  };
  store.patients.push(newPatient);
  return newPatient;
};
