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

exports.subscribeUpdates = async userId => {
  const user = await findUserById(userId);
  const token = user.bot.token;
  const welcomeMessage = user.welcome_message;
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', async msg => {
    const chatId = msg.chat.id;
    let patient = await findPatientByChatId(chatId);
    if (!patient) {
      patient = await createPatient({
        chat_id: chatId,
        first_name: msg.chat.first_name,
        last_name: msg.chat.last_name,
        username: msg.chat.username,
        avatar_href:
          'https://cdn.iconscout.com/icon/free/png-256/avatar-373-456325.png',
        first_activity: new Date(msg.date * 1000),
      });
    }
    let consultation = await findActiveConsultationByPatientId(patient._id);
    let isNewConsultation = false;
    if (!consultation) {
      consultation = await createConsultation({
        patient: patient._id,
        user: userId,
      });
      isNewConsultation = true;
    }
    if (msg.text !== '/start') {
      const message = await saveMessage({
        consultation: consultation._id,
        patient: patient._id,
        text: msg.text,
        sent_at: new Date(msg.date * 1000),
      });
      await updateConsultation(consultation._id, { last_message: message._id });
    }
    await updatePatient(patient._id, {
      last_activity: new Date(msg.date * 1000),
    });
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

  bot.on('callback_query', async function(callback) {
    if (callback.data.includes('term')) {
      const chatId = callback.message.chat.id;
      const option = parseInt(callback.data.split('-')[1]);
      /*const term = option === 0 ? 'ближайшее время' : terms[option];
      await requestPayment(
        bot,
        chatId,
        `Договорились, напишу вам в ${term}. До начала консультации вам нужно внести предоплату 1000 рублей, нажав на кнопку ниже. Обращаю ваше внимание, что в случае отмены консультации позднее, чем за час до назначенного времени, предоплата не возвращается.`,
        1000,
      );*/
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
  const consultation = await findConsultationById(consultationId);
  const patient = await findPatientById(consultation.patient._id);
  const chatId = patient.chat_id;
  return bot.sendMessage(chatId, text).then(async msg => {
    const message = await saveMessage({
      consultation: consultationId,
      text: text,
      sent_at: new Date(msg.date * 1000),
    });
    await updateConsultation(consultationId, { last_message: message._id });
    return message;
  });
};

exports.requestConsultationPayment = async (userId, consultationId) => {
  const bot = bots[userId];
  const consultation = await findConsultationById(consultationId);
  const patient = await findPatientById(consultation.patient._id);
  const chatId = patient.chat_id;
  return requestPayment(
    bot,
    chatId,
    'Отлично пообщались! Продолжительность консультации - 2 часа. Cумма к оплате - 3000 рублей. Оплатить можно по ссылке ниже.',
    3000,
  );
};
