'use strict';

const controller = require('./user.controller');
const jwt = require('../../middleware/jwt.middleware');
const authenticate = require('../../middleware/authenticate.middleware');

module.exports = Router => {
  const router = new Router({
    prefix: `/users`,
  });

  router
    .post('/', controller.createOne)
    .post('/authorise', authenticate)
    .put('/payment', jwt, controller.updateBilling)
    .put('/bot', jwt, controller.updateBot)
    .put('/details', jwt, controller.updateDetails)
    .get('/me', jwt, controller.getMe)
    .get('/me/consultations', jwt, controller.getMyConsultations);

  return router;
};
