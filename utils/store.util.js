'use strict';

exports.users = [
  {
    id: 'b2e60dcf-cbbf-413e-9aa0-08fb50a5c675',
    createdAt: 1619260383709,
    first_name: 'Имя',
    last_name: 'Фамилия',
    patronymic: 'Отчество',
    inn: '246212699703',
    phone: '79437618979',
    email: 'user@mail.com',
    nationality: 'RUS',
    payment: {
      card_number: '4692065455989192',
    },
    bot: {
      token: '1756313727:AAE6j_yRhSL1PJPpb04Xo762riQSxzWVz0k',
    },
    details: {
      rate: 2000,
      experience: 5,
      welcome_message: 'Приветственное сообщение для пациента',
    },
  },
];

exports.consultations = [
  {
    id: '1a42fc9f-267a-4276-a1cc-f99dfc9ba206',
    user_id: 'b2e60dcf-cbbf-413e-9aa0-08fb50a5c675',
    last_message_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    created_at: '2018-09-28T10:55:51.603Z',
    scheduled_on: '2018-09-28T10:55:51.603Z',
    status: 'NEW',
    duration: 52362345722,
    total_cost: 2546.0,
    can_send_message: false,
    patient_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
  },
];

exports.patients = [
  {
    id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    chat_id: '122559221',
    first_name: 'Иван',
    last_name: 'Сидоров',
    username: 'isidorov',
    avatar_href: 'http://something/damienmarchand/sqdsdqsdsfds',
    last_activity: '2018-09-28T10:55:51.603Z',
    first_activity: '2018-09-28T10:55:51.603Z',
  },
];

exports.messages = [
  {
    id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    consultation_id: '1a42fc9f-267a-4276-a1cc-f99dfc9ba206',
    patient_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    text: 'Hello!',
    sent_at: '2018-09-28T10:55:51.603Z',
  },
];
