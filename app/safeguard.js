// policy helper:
// tova policy se injectva sled ili povreme na res.render()
//
// policy(signal).can('assignToSomeoneelse')
// policy e exposenata funkciq ot controller0a, contoller-specific helper, Symfony components
// policy znae za req.user i znae che obekta podavan e ima policies i kak da podade user
// vtoroto can e invoker za policy-to
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