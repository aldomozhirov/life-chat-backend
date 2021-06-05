'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BillingSchema = new Schema({
  card_number: String,
});

module.exports = mongoose.model('Billing', BillingSchema);
