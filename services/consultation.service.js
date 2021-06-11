'use strict';

const Consultation = require('../model/consultation');

exports.createConsultation = async payload => {
  const newConsultation = new Consultation({
    ...payload,
    status: 'NEW',
    can_send_message: false,
  });
  await newConsultation.save();
  return newConsultation;
};

exports.findConsultationById = (consultationId, format = false) => {
  return Consultation.findById(consultationId)
    .populate('user')
    .populate('patient')
    .populate('last_message');
};

exports.findConsultationsByUserId = userId => {
  return Consultation.find({ user: userId })
    .populate('patient')
    .populate({
      path: 'last_message',
      populate: {
        path: 'patient',
        model: 'Patient',
      },
    });
};

exports.findActiveConsultationByPatientId = patientId => {
  return Consultation.findOne({
    patient: patientId,
    status: { $ne: 'COMPLETED' },
  })
    .populate('user')
    .populate('patient')
    .populate('last_message');
};

exports.updateConsultation = (consultationId, payload) => {
  return Consultation.findByIdAndUpdate(consultationId, payload)
    .populate('user')
    .populate('patient')
    .populate('last_message');
};
