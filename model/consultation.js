'use strict';

const mongoose = require('mongoose');
const Patient = require('patient');

const Schema = mongoose.Schema;
const ConsultationSchema = new Schema({
  status: String,
  duration: Number,
  total_cost: Number,
  patient: Patient,
  scheduled_on: Date,
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
