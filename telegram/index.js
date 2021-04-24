'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {
  findPatientByChatId,
  createPatient,
} = require('../services/patients.service');
const { createConsultation } = require('../services/consultation.service');
const { findUserById } = require('../services/user.service');

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
    createConsultation({
      patient_id: patient.id,
      user_id: userId,
    });
    console.log(msg.text);
    bot.sendMessage(chatId, welcomeMessage);
  });
};
