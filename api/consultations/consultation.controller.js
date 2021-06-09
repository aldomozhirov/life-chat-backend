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

exports.getOne = async ctx => {
  const { consultationId } = ctx.params;
  const consultation = await findConsultationById(consultationId, true);
  ctx.assert(consultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = consultation;
};

exports.prepaid = async ctx => {
  const { consultationId } = ctx.params;
  const updConsultation = await updateConsultation(consultationId, {
    status: 'PREPAID',
  });
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.start = async ctx => {
  const { consultationId } = ctx.params;
  const updConsultation = await updateConsultation(consultationId, {
    status: 'PENDING',
  });
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.complete = async ctx => {
  const { consultationId } = ctx.params;
  const updConsultation = await updateConsultation(consultationId, {
    status: 'WAIT_PAYMENT',
  });
  ctx.assert(updConsultation, 404, "The requested consultation doesn't exist");
  await telegram.requestConsultationPayment(consultationId);
  ctx.status = 200;
  ctx.body = { result: 'SUCCESS', status: updConsultation.status };
};

exports.getConsultationMessages = async ctx => {
  const { consultationId } = ctx.params;
  ctx.assert(
    await findConsultationById(consultationId),
    404,
    "The requested consultation doesn't exist",
  );
  const messages = await findMessagesByConsultationId(consultationId);
  ctx.status = 200;
  ctx.body = messages;
};

exports.sendConsultationMessage = async ctx => {
  const { consultationId } = ctx.params;
  ctx.assert(
    await findConsultationById(consultationId),
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
