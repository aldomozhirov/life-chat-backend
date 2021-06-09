'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PatientSchema = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  chat_id: String,
  avatar_href: String,
  last_activity: Date,
  first_activity: Date,
});

module.exports = mongoose.model('Patient', PatientSchema);
