'use strict';

angular.module('signals').controller('SignalsShowCtrl', ['$scope', '$stateParams','Authentication', 'Signal', 'signal', function($scope, $stateParams, Authentication, Signal, signal)  {
  $scope.authentication = Authentication;

  $scope.signal = signal;

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
}])

angular.module('signals').controller('SignalAssignmentsCtrl', ['$scope', '$stateParams', 'SignalAssignment', 'Authentication', 'signal',
  function($scope, $stateParams, SignalAssignment, Authentication, signal) {
    var userAssignment = signal.getUserAssignment(Authentication.user._id);

    $scope.userAssignment = new SignalAssignment(userAssignment)

    function assign() {
      $scope.userAssignment.userId = $scope.authentication.user._id;
      $scope.userAssignment.$save({ signalId: signal._id });
    }

    function unassign() {
      $scope.userAssignment.userId = $scope.authentication.user._id;
      $scope.userAssignment.$remove({ signalId: signal._id });
    }

    $scope.$watch('userAssignment', function(value) {
      if (_.isEmpty(userAssignment) && value.role == null)
        return;

      if (value.role == null) {
        unassign();
      }
      else {
        assign();
      }
    }, true);
  }
])
