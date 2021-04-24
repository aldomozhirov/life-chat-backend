'use strict';

const store = require('../../utils/store.util');

exports.getOne = ctx => {
  const { consultationId } = ctx.params;
  const consultation = findConsultationById(consultationId);
  ctx.assert(consultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = consultation;
};

exports.confirm = ctx => {
  ctx.status = 501;
};

exports.start = ctx => {
  ctx.status = 501;
};

exports.cancel = ctx => {
  ctx.status = 501;
};

exports.complete = ctx => {
  ctx.status = 501;
};

exports.confirmPayment = ctx => {
  ctx.status = 501;
};

const findConsultationById = consultationId => {
  return store.consultations.find(
    consultation => consultation.id === consultationId,
  );
};
