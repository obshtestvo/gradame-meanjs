'use strict';

module.exports = function(app) {
  var safeguard = require('safeguard');
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
  app.post('/api/signals', multipartMiddleware, signals.create);
  app.get('/api/signals/:signalId', signals.read);
  app.put('/api/signals/:signalId', multipartMiddleware, signals.update);
  app.delete('/api/signals/:signalId', signals.delete);

  //app.get('/api/signals/near', signals.findNear);

  // GeoIP location
  app.get('/api/location', signals.location);

  // Signal activities
  app.post('/api/signals/:signalId/activities', signals.activities.create);

  // Signal assignments
  app.post('/api/signals/:signalId/assignments',
    users.requiresLogin,
    signals.assignments.populateAssignment,
    safeguard.enforce(signals.assignments.policy.assign),
    signals.assignments.create
  );
  app.put('/api/signals/:signalId/assignments/:id',
    users.requiresLogin,
    signals.assignments.populateAssignment,
    safeguard.enforce(signals.assignments.policy.assign),
    signals.assignments.update);
  app.delete('/api/signals/:signalId/assignments/:id',
    users.requiresLogin,
    signals.assignments.populateAssignment,
    safeguard.enforce(signals.assignments.policy.unassign),
    signals.assignments.delete);

  // Finish by binding the signal middleware
  app.param('signalId', signals.signalByID);
};
