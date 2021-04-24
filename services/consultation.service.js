'use strict';

const store = require('../utils/store.util');
const generateId = require('../utils/generateId.util');
const { omit } = require('lodash');
const { findPatientById } = require('./patient.service');
const { findMessageById } = require('./message.service');

exports.createConsultation = data => {
  const newConsultation = {
    id: generateId(),
    user_id: data.user_id,
    created_at: Date.now(),
    status: 'NEW',
    can_send_message: false,
    patient_id: data.patient_id,
  };
  store.consultations.push(newConsultation);
  return newConsultation;
};

exports.findConsultationById = consultationId => {
  const consultation = store.consultations.find(
    consultation => consultation.id === consultationId,
  );
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
};

exports.findActiveConsultationByPatientId = patientId => {
  return store.consultations.find(
    consultation =>
      consultation.patient_id === patientId &&
      !['COMPLETED'].includes(consultation.status),
  );
};

exports.updateConsultation = consultation => {
  let foundIndex = store.consultations.findIndex(
    item => item.id === consultation.id,
  );
  store.consultations[foundIndex] = consultation;
  return consultation;
};
