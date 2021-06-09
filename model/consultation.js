'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ConsultationSchema = new Schema({
  status: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  can_send_message: Boolean,
  scheduled_on: Date,
  duration: Number,
  total_cost: Number,
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
