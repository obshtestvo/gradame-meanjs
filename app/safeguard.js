exports.enforce = function(policy) {
  return function(req, res, next) {
    res.locals.policy = function(scopeData) {
      return {
        can: function() {
          return policy(req, scopeData)
        }
      }
    }
    if (policy(req)) {
      next()
    } else {
      res.render(403)
      // no success
    }
  }
}
