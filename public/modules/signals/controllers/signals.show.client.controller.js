'use strict';

angular.module('signals').controller('SignalsShowCtrl', ['$scope', '$stateParams', 'Signal', function($scope, $stateParams, Signal) {
  Signal.get({ _id: $stateParams.signalId }, function(signal) {
    $scope.signal = signal;
  });

  $scope.comment = ""

  $scope.addComment = function(comment) {
    Signal.activitiesAdd({_id: $stateParams.signalId,
    	type: "comment",
    	comment: comment
    }).$promise.then(function() {
    	$scope.load();
    });
  }

  $scope.assign = function(asigneeRole) {
    signal.$update()
  }
}])
