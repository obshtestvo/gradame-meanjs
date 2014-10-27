var _ = require('lodash');

var registry = {};

function parseRule(str) {
  var idx = str.lastIndexOf('.')
  var policy = str.slice(0, idx)
  var name = str.slice(idx + 1);

  return {
    policy: policy,
    name: name
  }
}

function makePolicyHelper(req) {
  return function(obj, ruleString) {
    if (_.isString(obj))
      ruleString = obj;

    var policy = {};

    if (_.isUndefined(ruleString)) {
      policy = _.find(_.values(registry), function(policy) { return (obj instanceof policy.model) })
    }
    else {
      var rule = parseRule(ruleString)
      policy = registry[rule.policy];
    }

    if (_.isEmpty(policy))
      throw "policy not found";

    return {
      can: function(name) {
        policy[name](req, obj);
      }
    }
  }
}

exports.enforce = function(ruleString) {
  var rule = parseRule(ruleString);
  var policy = registry[rule.policy];
  var action = policy[rule.name];

  if (_.isUndefined(action))
    throw "invalid policy rule"

  return function(req, res, next) {
    res.locals.policy = makePolicyHelper(req);

    _.each(policy.permittedAttributes, function(attr) {
      if (_.isUndefined(req.body[attr]))
        return

      req.bodyParams[attr] = req.body[attr]
    })

    if (action(req, req.bodyParams)) {
      next()
    } else {
      res.render(403)
    }
  }
}

exports.install = function(name, policy) {
  registry[name] = policy;
}


