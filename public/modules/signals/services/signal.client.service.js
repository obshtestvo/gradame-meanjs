angular.module('core').factory('Signal', ['$resource', function($resource) {
  var imageAppenderTransform = function (data) {
    var formData = new FormData();
    // need to convert our json object to a string version of json otherwise
    // the browser will do a 'toString()' on the object which will result
    // in the value '[Object object]' on the server.

    var images = data.images;
    delete data.images;

    for (var i in data){
      if (i.charAt(0) != "$")
        formData.append(i, data[i]);
    }

    if (images && images.length){
      for (var i = 0; i < images.length; i++) {
        formData.append('image_'+i, images[i]);
      }
    }

    return formData;
  }

  var defaultActions = {
    save: {
      method: 'POST',
      headers: { 'Content-Type': undefined },
      transformRequest: imageAppenderTransform
    },
    update: {
      method: 'PUT',
      headers: { 'Content-Type': undefined },
      transformRequest: imageAppenderTransform
    },
    activitiesAdd: {
      method: 'POST',
      isArray: false,
      params: {
        memberRoute: 'activities'
      }
    },
    assign: {
      method: 'POST',
      isArray: false,
      params: {
        memberRoute: 'assignments'
      }
    },
    findNear: {
      method: 'GET',
      isArray: true,
      params: {
        collectionRoute: 'near'
      }
    },
    mine: {
      method: 'GET',
      isArray: true,
      params: {
        collectionRoute: 'mine'
      }
    },
  }

  var Signal = $resource('/api/signals/:collectionRoute:_id/:memberRoute/:userId', { _id: '@_id' }, defaultActions);


  Signal.constants = {
    ACTIVITY_TYPE: {
      COMMENT: 1,
      TRANSITION: 2
    },
    SIGNAL_STATUS: {
      OPEN: 1,
      INPROGRESS: 2,
      CLOSED: 3,
      INVALID: 4
    }
  }

  return Signal;
}]);
