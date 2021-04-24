'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {
  findPatientById,
  findPatientByChatId,
  createPatient,
  updatePatient,
} = require('../services/patient.service');
const {
  createConsultation,
  findActiveConsultationByPatientId,
  updateConsultation,
  findConsultationById,
} = require('../services/consultation.service');
const { findUserById } = require('../services/user.service');
const { saveMessage } = require('../services/message.service');

let bots = {};

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
    if (msg.text !== '/start') {
      const message = saveMessage({
        consultation_id: consultation.id,
        patient_id: patient.id,
        text: msg.text,
        sent_at: msg.date,
      });
      consultation.last_message_id = message.id;
      updateConsultation(consultation);
    }
    patient.last_activity = msg.date;
    updatePatient(patient);
    if (isNewConsultation) {
      bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Запросить консультацию',
                callback_data: 'request_consultation',
              },
            ],
          ],
        },
      });
    }
  });

  bot.on('callback_query', function(callback) {
    if (callback.data === 'request_consultation') {
      const chatId = callback.message.chat.id;
      proposeTerms(bot, chatId);
    }
  });

  bots[userId] = bot;
};

const proposeTerms = (bot, chatId) => {
  const currentDate = new Date();
  let currentHour = currentDate.getHours();
  let hours = [];
  for (let i = 0; i < 5; i++) {
    if (currentHour++ === 23) {
      currentHour = 0;
    }
    hours.push(`${('0' + currentHour).slice(-2)}:00`);
  }
  const terms = ['Прямо сейчас', ...hours];
  const keyboardOptions = terms.map((term, index) => [
    {
      text: term,
      callback_data: `term-${index}`,
    },
  ]);

  bot.sendMessage(chatId, 'Когда вам удобнее всего пообщаться?', {
    reply_markup: {
      inline_keyboard: keyboardOptions,
    },
  });

  bot.on('callback_query', function(callback) {
    if (callback.data.includes('term')) {
      const chatId = callback.message.chat.id;
      const option = parseInt(callback.data.split('-')[1]);
      const term = terms[option];
      bot.sendMessage(
        chatId,
        option === 0
          ? 'Отлично! Cвяжемся в ближайшее время'
          : `Замечательно! До связи в ${term}`,
      );
    }
  });
};

exports.sendConsultationMessage = async (userId, consultationId, text) => {
  const bot = bots[userId];
  const consultation = findConsultationById(consultationId);
  const chatId = consultation.patient.chat_id;
  return bot.sendMessage(chatId, text).then(msg => {
    const message = saveMessage({
      consultation_id: consultation.id,
      text: text,
      sent_at: msg.date,
    });
    consultation.last_message_id = message.id;
    updateConsultation(consultation);
    return message;
  });
};
