'use strict';

const joi = require('joi');
const {
  findConsultationById,
  updateConsultation,
} = require('../../services/consultation.service');
const {
  findMessagesByConsultationId,
} = require('../../services/message.service');
const telegram = require('../../telegram');
const messageSchema = require('../../schemas/message');
const constants = require('../../constants');
const { verify } = require('jsonwebtoken');

exports.getOne = ctx => {
  const { consultationId } = ctx.params;
  const consultation = findConsultationById(consultationId, true);
  ctx.assert(consultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = consultation;
};

exports.prepaid = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'PREPAID';
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

exports.complete = ctx => {
  const { consultationId } = ctx.params;
  let updConsultation = findConsultationById(consultationId);
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");

  updConsultation.status = 'WAIT_PAYMENT';
  updateConsultation(updConsultation);

  telegram.requestConsultationPayment(consultationId);

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

exports.sendConsultationMessage = async ctx => {
  const { consultationId } = ctx.params;
  ctx.assert(
    findConsultationById(consultationId),
    404,
    "The requested consultation doesn't exist",
  );
  const data = joi.validate(ctx.request.body, messageSchema);
  if (data.error) {
    return ctx.throw(422, data.error);
  }
  const text = data.value.text;
  const userId = getUserIdByToken(ctx);
  const message = await telegram.sendConsultationMessage(
    userId,
    consultationId,
    text,
  );

  ctx.status = 200;
  ctx.body = { ...message };
};

const getUserIdByToken = ctx => {
  const token = ctx.request.header.authorization.split(' ')[1];
  const decoded = verify(token, constants.JWT_SECRET);
  return decoded.user_id;
};
