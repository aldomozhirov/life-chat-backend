'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {
  findPatientByChatId,
  createPatient,
} = require('../services/patient.service');
const {
  createConsultation,
  findActiveConsultationByPatientId,
  updateConsultation,
} = require('../services/consultation.service');
const { findUserById } = require('../services/user.service');
const { saveMessage } = require('../services/message.service');

exports.subscribeUpdates = userId => {
  const user = findUserById(userId);
  const token = user.bot.token;
  const welcomeMessage = user.details.welcome_message;
  const bot = new TelegramBot(token, { polling: true });
  bot.on('message', msg => {
    const chatId = msg.chat.id;
    let patient = findPatientByChatId(chatId);
    if (!patient) {
      patient = createPatient({
        chat_id: chatId,
        first_name: msg.chat.first_name,
        last_name: msg.chat.last_name,
        username: msg.chat.username,
        avatar_href:
          'https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png',
        last_activity: msg.date,
        first_activity: msg.date,
      });
    }
    let consultation = findActiveConsultationByPatientId(patient.id);
    let isNewConsultation = false;
    if (!consultation) {
      consultation = createConsultation({
        patient_id: patient.id,
        user_id: userId,
      });
      isNewConsultation = true;
    }
    const message = saveMessage({
      consultation_id: consultation.id,
      patient_id: patient.id,
      text: msg.text,
      sent_at: msg.date,
    });
    consultation.last_message_id = message.id;
    updateConsultation(consultation);
    if (isNewConsultation) {
      bot.sendMessage(chatId, welcomeMessage);
    }
  });
};
