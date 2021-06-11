'use strict';

const { pick, set, map } = require('lodash');
const { format: formatPatient } = require('./patient');
const { format: formatMessage } = require('./message');

exports.format = consultation => {
  const { _id } = consultation;
  const { patient, last_message } = consultation['_doc'];

  const formatted = {
    id: _id,
    created_at: _id.getTimestamp(),
    ...pick(consultation['_doc'], [
      'status',
      'duration',
      'total_cost',
      'can_send_message',
      'scheduled_on',
    ]),
  };

  patient && set(formatted, 'patient', formatPatient(patient));
  last_message && set(formatted, 'last_message', formatMessage(last_message));

  return formatted;
};

exports.formatArray = consultations => {
  return map(consultations, this.format);
};
