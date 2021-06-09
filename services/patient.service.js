'use strict';

const Patient = require('../model/patient');

exports.findPatientById = patientId => {
  return Patient.findById(patientId);
};

exports.findPatientByChatId = chatId => {
  return Patient.findOne({ chat_id: chatId });
};

exports.createPatient = async payload => {
  const newPatient = new Patient(payload);
  await newPatient.save();
  return newPatient;
};

exports.updatePatient = (patientId, payload) => {
  return Patient.findByIdAndUpdate(patientId, payload);
};
