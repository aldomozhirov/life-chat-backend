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
    .put('/:consultationId/cancel', controller.cancel)
    .put('/:consultationId/complete', controller.complete)
    .put('/:consultationId/confirmPayment', controller.confirmPayment)
    .use(jwt);

  return router;
};
