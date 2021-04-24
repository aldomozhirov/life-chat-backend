'use strict';

const store = require('../utils/store.util');
const generateId = require('../utils/generateId.util');

exports.createConsultation = data => {
  const newConsultation = {
    id: generateId(),
    user_id: 'b2e60dcf-cbbf-413e-9aa0-08fb50a5c675',
    created_at: Date.now(),
    status: 'NEW',
    can_send_message: false,
    patient_id: data.patient_id,
  };
  store.consultations.push(newConsultation);
  return newConsultation;
};

exports.findConsultationById = consultationId => {
  return store.consultations.find(
    consultation => consultation.id === consultationId,
  );
};

exports.updateConsultation = consultation => {
  let foundIndex = store.consultations.findIndex(
    item => item.id === consultation.id,
  );
  store.consultations[foundIndex] = consultation;
  return consultation;
};
