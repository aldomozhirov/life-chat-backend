'use strict';

const { pick } = require('lodash');

exports.format = user => {
  return {
    id: user._id,
    created_at: user._id.getTimestamp(),
    ...pick(user['_doc'], [
      'first_name',
      'last_name',
      'patronymic',
      'inn',
      'phone',
      'email',
      'nationality',
      'experience',
      'rate',
      'welcome_message',
    ]),
  };
};
