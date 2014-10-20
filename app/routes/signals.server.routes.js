'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var signals = require('../../app/controllers/signals');
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();


  // GeoIP location
  // TODO: move to separate controller; similar to users module helper should be kept in a separate directory
  app.get('/api/location', signals.location);

  // Article Routes
  app.get('/api/signals', signals.list);
  app.get('/api/signals/constants', signals.constants);
  app.get('/api/signals/near', signals.findNear);
  app.get('/api/signals/mine', signals.mine);
  //app.post('/signals', users.requiresLogin, signals.create);
  app.post('/api/signals', multipartMiddleware, signals.create);
  app.get('/api/signals/:signalId', signals.read);
  //app.put('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.update);
  app.put('/api/signals/:signalId', signals.update);
  app.post('/api/signals/:signalId/activities', signals.activitiesAdd);
  app.post('/api/signals/:signalId/assignments', signals.assign);
  app.delete('/api/signals/:signalId/assignment/:id', users.requiresLogin, signals.requiresAssignmentUnlessSuper, signals.unassign);
  //app.del('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.delete);
  app.delete('/api/signals/:signalId', signals.delete);


  // Finish by binding the article middleware
  app.param('signalId', signals.signalByID);
};
