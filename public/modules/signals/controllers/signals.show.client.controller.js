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

    //Removes current user assignments
    function clearAssignments(signal) {
      return signal.assignments = _.filter(
        signal.assignments,
        function(a) {a.userId == $scope.authentication.user._id}
      );
    }
    function assign() {
      signal.assignemnts = clearAssignments(signal);
      signal.assignments.push($scope.userAssignment);
      signal.$update();
    }

    function unassign() {
      signal.assignemnts = clearAssignments(signal);
      signal.$update();
    }

    $scope.userAssignment == null;
    _.each(signal.assignments, function(assignment) {
        if(assignment.userId ==  $scope.authentication.user._id) {
            $scope.userAssignment = assignment;
        }
    });

    if($scope.userAssignment == null) {
      $scope.userAssignment == {
        userId:  $scope.authentication.user._id,
        signalId: signal.id
      };
    }

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
