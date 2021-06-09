'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  text: String,
  sent_at: Date,
});

module.exports = mongoose.model('Message', MessageSchema);
