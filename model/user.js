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
});

module.exports = mongoose.model('User', UserSchema);
