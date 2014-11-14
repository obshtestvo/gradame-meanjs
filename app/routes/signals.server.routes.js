'use strict';

module.exports = function(app) {
  var safeguard = require('../../safeguard');
  var users = require('../../app/controllers/users');
  var signals = require('../../app/controllers/signals');
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();


  // Signal index
  app.get('/api/signals', signals.index);

  // Constants
  app.get('/api/signals/constants', signals.constants);

  // List of signals for current user
  app.get('/api/signals/mine', signals.mine);

  // Signals CRUD
  app.post('/api/signals', multipartMiddleware, signals.logAction('create'), signals.create);
  app.get('/api/signals/:signalId', signals.read);
  app.put('/api/signals/:signalId', multipartMiddleware, signals.logAction('update'), signals.update);
  app.delete('/api/signals/:signalId', signals.delete);

  //app.get('/api/signals/near', signals.findNear);

  app.get('/api/location', signals.location);

  // Signal assignments
  app.post('/api/signals/:signalId/assign', signals.logAction('assign'), signals.assign);
  app.post('/api/signals/:signalId/unassign', signals.logAction('unassign'), signals.unassign)

  // Signal status
  app.put('/api/signals/:signalId/status', signals.status.update);

  // Finish by binding the signal middleware
  app.param('signalId', signals.signalByID);
};
