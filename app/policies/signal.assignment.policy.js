var mongoose = require('mongoose');
var model = mongoose.model('SignalAssignment');

module.exports = {
  permittedAttributes: ['role', 'user'],
  create: function(req, obj) {
    return req.user._id == obj.user
  },
  update: function(req, obj) {
    return req.assignment.user._id == obj.user
  },
  delete: function(req, obj) {
    return req.assignment.user._id == req.user._id
  },
  model: model
}
