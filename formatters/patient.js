'use strict';

const { pick } = require('lodash');

exports.format = patient => {
  return {
    id: patient._id,
    created_at: patient._id.getTimestamp(),
    ...pick(patient['_doc'], [
      'first_name',
      'last_name',
      'username',
      'chat_id',
      'avatar_href',
      'last_activity',
      'first_activity',
    ]),
  };
};
