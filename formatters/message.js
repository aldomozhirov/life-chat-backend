'use strict';

const { pick, set, map } = require('lodash');
const { format: formatPatient } = require('./patient');

exports.format = message => {
  const { _id, _doc } = message;
  const { patient } = _doc;

  const formatted = {
    id: _id,
    ...pick(message['_doc'], ['text', 'sent_at']),
  };

  patient && set(formatted, 'patient', formatPatient(patient));

  return formatted;
};

exports.formatArray = messages => {
  return map(messages, this.format);
};
