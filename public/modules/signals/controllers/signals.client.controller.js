'use strict';

angular.module('signals').controller('SignalsNewCtrl', ['$scope', '$state', 'Signal', function ($scope, $state, Signal) {
  $scope.signal = new Signal();

  var geocoder = new google.maps.Geocoder();

  $scope.mapIdleHandlers.trackCenter = function(map, eventName, originalEventArgs) {
    $scope.signal.location = map.getCenter().toString();
    geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          $scope.signal.address = results[0].formatted_address;
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  }

  // TODO: add validation
  $scope.save = function() {
    if (!$scope.signal.status) {
      $scope.signal.status = 0;
    }

    // TODO: handle errors
    $scope.signal.$save(function() {
      $state.go('signals.index')
    })
  }

  $scope.reset = function() {
    $scope.signal = new Signal();
  }
}])

angular.module('signals').controller('SignalsIndexCtrl', ['$scope', 'Signal', function ($scope, Signal) {
    $scope.signals = [];

    function reloadSignals() {
      if (_.isEmpty($scope.params.bounds))
        return;

      Signal.query($scope.params, function(signals) {
        $scope.markers.length = 0
        _.each(signals, function(sig) {
          var id = sig._id;
          var marker = {
            id: id,
            options: {
              animation: google.maps.Animation.DROP,
            },
            icon: '/modules/signals/img/markers/sign.png',
            coords: {
              latitude: sig.location[0],
              longitude: sig.location[1]
            }
          }
          $scope.markers.push(marker)
        })
        $scope.signals = signals;
      });
    }

    $scope.$watch('params', reloadSignals, true);

    $scope.autocomplete = {
      details: {},
      options: {
        country: 'bg'
      }
    }

    $scope.$watch('autocomplete.details', function(details) {
      if (_.isEmpty(details))
        return;

      var location = details.geometry.location;

      var coords = {
        latitude: location.lat(),
        longitude: location.lng()
      }

      $scope.map.center = coords;
    });
  }
])

angular.module('signals').controller('SignalsCtrl', ['$scope', 'geolocation', 'location', 'constants',
  function ($scope, geolocation, location, constants) {
    $scope.mapIdleHandlers = {};
    $scope.signalTypes = [
      "Улична дупка",
      "Липсваща шахта",
      "Висящи кабели",
      "Нерегламентиран боклук",
      "Вандализъм"
    ];

    $scope.params = {
      bounds: "",
      location: "",
      type: "",
      status: ""
    };

    $scope.mapIdleHandlers.trackBounds = function(map, eventName, originalEventArgs) {
      $scope.params.bounds = map.getBounds().toString();
      $scope.$apply()
      $scope.params.bounds = bounds;
    }

    $scope.signalStatuses = {}
    $scope.signalStatuses[constants.SIGNAL_STATUS.UNCONFIRMED] =  "отворен";
    $scope.signalStatuses[constants.SIGNAL_STATUS.CLOSED] =  "решен";

    $scope.markers = []

    $scope.currentMarker = {
      id: "center",
      options: {
        animation: google.maps.Animation.DROP
      },
      icon: '/modules/signals/img/markers/pin.png',
      coords: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }


    $scope.map = {
      control: {},
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3
      },
      center: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      zoom: 15,
      events: {
        idle: function(map, eventName, originalEventArgs) {
          _.each($scope.mapIdleHandlers, function(handler) {
            handler(map, eventName, originalEventArgs);
          })
        }
      }
    };

    // attempt to fetch more accurate location from browser location services
    geolocation.getLocation().then(function(data){
      $scope.map.center = data.coords;
      $scope.currentMarker.coords = data.coords;
    });


    $scope.autocomplete = {
      details: {},
      options: {
        country: 'bg'
      }
    }

    $scope.$watch('autocomplete.details', function(details) {
      if (_.isEmpty(details))
        return;

      var location = details.geometry.location;

      var coords = {
        latitude: location.lat(),
        longitude: location.lng()
      }

      $scope.map.center = coords;
    });
  }
]);
