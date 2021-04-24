'use strict';

const joi = require('joi');

exports.user = {
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  patronymic: joi.string().required(),
  inn: joi.string().required(),
  phone: joi.string().required(),
  email: joi.string().required(),
  nationality: joi.string().required(),
};

exports.payment = {
  card_number: joi.string().required(),
};

exports.bot = {
  token: joi.string().required(),
};

exports.details = {
  rate: joi.number().required(),
  experience: joi.number().required(),
  welcome_message: joi.string().required(),
};
