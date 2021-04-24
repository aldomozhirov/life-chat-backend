'use strict';

const store = require('../utils/store.util');
const generateId = require('../utils/generateId.util');

exports.saveMessage = data => {
  const newMessage = {
    id: generateId(),
    ...data,
  };
  store.messages.push(newMessage);
  return newMessage;
};

exports.findMessageById = messageId => {
  return store.messages.find(message => message.id === messageId);
};

exports.findMessagesByConsultationId = consultationId => {
  return store.messages.filter(
    message => message.consultation_id === consultationId,
  );
};
