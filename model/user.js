'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  patronymic: String,
  inn: String,
  phone: String,
  nationality: String,
  rate: String,
  experience: Number,
  welcome_message: String,
  billing: { type: mongoose.Schema.Types.ObjectId, ref: 'Billing' },
  bot: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
});

module.exports = mongoose.model('User', UserSchema);
