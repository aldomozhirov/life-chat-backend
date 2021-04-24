'use strict';
const {
  findConsultationById,
  updateConsultation,
} = require('../../services/consultation.service');
const {
  findMessagesByConsultationId
} = require('../../services/message.service');

exports.getOne = ctx => {
  const { consultationId } = ctx.params;
  const consultation = findConsultationById(consultationId);
  ctx.assert(consultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = consultation;
};

exports.confirm = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'WAIT_PREPAYMENT';
  updateConsultation(updConsultation);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.start = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'PENDING';
  updateConsultation(updConsultation);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.cancel = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'CANCELLED';
  updateConsultation(updConsultation);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.complete = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'CONFIRMATION';
  updateConsultation(updConsultation);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.confirmPayment = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'WAIT_PAYMENT';
  updateConsultation(updConsultation);

  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.getConsultationMessages = ctx => {
  const { consultationId } = ctx.params;
  ctx.assert(
    findConsultationById(consultationId),
    404,
    "The requested consultation doesn't exist",
  );
  const messages = findMessagesByConsultationId(consultationId);
  ctx.status = 200;
  ctx.body = messages;
};
