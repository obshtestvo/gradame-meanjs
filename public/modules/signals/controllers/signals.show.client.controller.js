'use strict';

angular.module('signals').controller('SignalsShowCtrl', ['$scope', '$stateParams', 'Signal', 'Authentication', function($scope, $stateParams, Signal, Authentication) {
  $scope.authentication = Authentication;

  Signal.get({ _id: $stateParams.signalId }, function(signal) {
    $scope.signal = signal;
  });

  $scope.comment = ""

  $scope.addComment = function(comment) {
    Signal.activitiesAdd({
      _id: $stateParams.signalId,
    	type: "comment",
    	comment: comment
    }).$promise.then(function() {
    	$scope.load();
    });
  }

  //@TODO Not implemented
  $scope.assign = function(asigneeRole) {
    if (!asigneeRole) {
      // unassign
    }
    Signal.assign({ userId: $scope.authentication.user._id, role: asigneeRole}, function(signal) {

    })
  }
}])
