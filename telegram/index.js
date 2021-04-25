'use strict';

const TelegramBot = require('node-telegram-bot-api');
const WalletOne = require('../walletone');

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

const proposeTerms = (bot, chatId, consultationId) => {
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

  bot.on('callback_query', async function(callback) {
    if (callback.data.includes('term')) {
      const chatId = callback.message.chat.id;
      const option = parseInt(callback.data.split('-')[1]);
      const term = option === 0 ? 'ближайшее время' : terms[option];
      await requestPayment(
        bot,
        chatId,
        `Договорились, напишу вам в ${term}. До начала консультации вам нужно внести предоплату 1000 рублей, нажав на кнопку ниже. Обращаю ваше внимание, что в случае отмены консультации позднее, чем за час до назначенного времени, предоплата не возвращается.`,
        1000,
      );
      bot.sendMessage(
        chatId,
        'А пока мы ждем консультацию, расскажите, что вас тревожит или о чем вы хотели бы со мной пообщаться?',
      );
    }
  });
};

const requestPayment = async (bot, chatId, message, amount) => {
  let invoice = await WalletOne.generateInvoice(1000);

  const invoiceId = invoice.id;
  let paymentUrl;
  while (!paymentUrl) {
    invoice = await WalletOne.getInvoiceStatus(invoiceId);
    const params = invoice.payload.params;
    if (params) {
      const H2hCheckoutUrlObj = params.find(
        item => item.first === 'H2hCheckoutUrl',
      );
      if (H2hCheckoutUrlObj) {
        paymentUrl = H2hCheckoutUrlObj.second;
      }
    }
  }

  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Оплатить',
            url: paymentUrl,
          },
        ],
      ],
    },
  });

  let invoiceStatus = invoice.states;
  while (invoiceStatus !== 'FINISHED') {
    invoice = await WalletOne.getInvoiceStatus(invoiceId);
    invoiceStatus = invoice.states;
  }

  const billUrl = invoice.payload.params.find(
    item => item.first === 'SmzBillUrl',
  ).second;

  bot.sendMessage(chatId, 'Отлично! Платеж прошёл!', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть чек',
            url: billUrl,
          },
        ],
      ],
    },
  });

  return Promise.resolve(true);
};

exports.sendConsultationMessage = async (userId, consultationId, text) => {
  const bot = bots[userId];
  const consultation = findConsultationById(consultationId);
  const patient = findPatientById(consultation.patient_id);
  const chatId = patient.chat_id;
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

exports.requestConsultationPayment = async (userId, consultationId) => {
  const bot = bots[userId];
  const consultation = findConsultationById(consultationId);
  const patient = findPatientById(consultation.patient_id);
  const chatId = patient.chat_id;
  return requestPayment(
    bot,
    chatId,
    'Отлично пообщались! Продолжительность консультации - 2 часа. Cумма к оплате - 3000 рублей. Оплатить можно по ссылке ниже.',
    3000,
  );
};
