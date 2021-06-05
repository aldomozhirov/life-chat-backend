'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BotSchema = new Schema({
  token: String,
});

module.exports = mongoose.model('Bot', BotSchema);
