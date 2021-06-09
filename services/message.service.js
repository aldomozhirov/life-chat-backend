'use strict';

const Message = require('../model/message');

exports.saveMessage = async payload => {
  const newMessage = new Message(payload);
  await newMessage.save();
  return newMessage;
};

exports.findMessageById = messageId => {
  return Message.findById(messageId)
    .populate('consultation')
    .populate('patient');
};

exports.findMessagesByConsultationId = consultationId => {
  return Message.find({ consultation: consultationId })
    .populate('consultation')
    .populate('patient');
};
