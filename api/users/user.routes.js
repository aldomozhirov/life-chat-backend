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
    .put('/payment', controller.updatePayment)
    .put('/bot', controller.updateBot)
    .put('/details', controller.updateDetails)
    .post('/authorise', authenticate)
    .get('/me', jwt, controller.getMe);

  return router;
};
