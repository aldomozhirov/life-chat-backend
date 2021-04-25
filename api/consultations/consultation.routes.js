'use strict';

const controller = require('./consultation.controller');
const jwt = require('../../middleware/jwt.middleware');

module.exports = Router => {
  const router = new Router({
    prefix: `/consultations`,
  });

  router
    .get('/:consultationId', controller.getOne)
    .get('/:consultationId/messages', controller.getConsultationMessages)
    .post('/:consultationId/reply', controller.sendConsultationMessage)
    .put('/:consultationId/start', controller.start)
    .put('/:consultationId/prepaid', controller.prepaid)
    .put('/:consultationId/complete', controller.complete)
    .use(jwt);

  return router;
};
