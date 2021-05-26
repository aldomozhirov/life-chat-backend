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
      token: '1724130296:AAFsbq73Jjhk6tdxA_LFgt_9TRs1WWlNKjE',
    },
    details: {
      rate: 2000,
      experience: 5,
      welcome_message:
        'Привет! Меня зовут Ольга Иванова, я психолог со стажем более 20 лет. Я помогу вам в решении ваших жизненных трудностей. Мы можем общаться как текстовыми сообщениями, так и голосовыми или созвониться по аудио/видео связи. Моя рабочая ставка 2000 рублей в час.',
    },
  },
];

exports.consultations = [
  {
    id: '1a42fc9f-267a-4276-a1cc-f99dfc9ba206',
    user_id: 'b2e60dcf-cbbf-413e-9aa0-08fb50a5c675',
    last_message_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    created_at: 1620328780,
    scheduled_on: 1620328780,
    status: 'NEW',
    duration: 52362345722,
    total_cost: 2546.0,
    can_send_message: false,
    patient_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
  },
  {
    id: '1a42fc9f-267a-4276-a1cc-f99dfc9ba207',
    user_id: 'b2e60dcf-cbbf-413e-9aa0-08fb50a5c675',
    last_message_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    created_at: 1620328780,
    scheduled_on: 1620328780,
    status: 'COMPLETED',
    duration: 52362345722,
    total_cost: 2546.0,
    can_send_message: false,
    patient_id: 'de13a5fa-028f-418e-9c92-b64827b35fef',
  },
];

exports.patients = [
  {
    id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    chat_id: '122559221',
    first_name: 'Иван',
    last_name: 'Сидоров',
    username: 'isidorov',
    avatar_href: 'https://randomuser.me/api/portraits/women/81.jpg',
    last_activity: 1620328780,
    first_activity: 1620328780,
  },
  {
    id: 'de13a5fa-028f-418e-9c92-b64827b35fef',
    chat_id: '122559221',
    first_name: 'Лена',
    last_name: 'Иванова',
    username: 'livanova',
    avatar_href: 'https://randomuser.me/api/portraits/women/82.jpg',
    last_activity: 1620328780,
    first_activity: 1620328780,
  },
];

exports.messages = [
  {
    id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    consultation_id: '1a42fc9f-267a-4276-a1cc-f99dfc9ba206',
    patient_id: 'de13a5fa-028f-418e-9c92-b64827b35fed',
    text: 'Hello!',
    sent_at: 1620328780,
  },
];
