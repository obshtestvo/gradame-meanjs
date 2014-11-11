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

angular.module('signals').controller('SignalAssignmentsCtrl', ['$scope', '$stateParams', 'SignalAssignment', 'Authentication', 'signal', 'Signal',
  function($scope, $stateParams, SignalAssignment, Authentication, signal, Signal) {
    function assign() {
      Signal.assign({_id: signal._id}, $scope.userAssignment);
    }

    function unassign() {
      Signal.unassign({_id: signal._id}, $scope.userAssignment);
    }

    $scope.userAssignment = $scope.userAssignment ? $scope.userAssignment : {};
    $scope.userAssignment.user = $scope.authentication.user;

    _.each(signal.assignments, function(assignment) {
        if(assignment.user._id ==  $scope.authentication.user._id) {
            $scope.userAssignment = assignment;
        }
    });

    $scope.$watch('userAssignment', function(newValue, oldValue) {
      if (oldValue == null) return;
      if (_.isEqual(oldValue, newValue)) return;

      if (newValue.role == null) {
        unassign();
      }
      else {
        assign();
      }
    }, true);
  }
])
