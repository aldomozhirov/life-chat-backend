'use strict';

const store = require('../utils/store.util');
const generateId = require('../utils/generateId.util');

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
