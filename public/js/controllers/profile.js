"use strict"
app.controller('ProfileCtrl',
	[ "$scope", "$state", "$upload", "$location", "$http", "Auth", 
	function ($scope, $state, $upload, $location, $http, Auth) {
		
		if(!Auth.signedIn()){
			Auth.logout();
		}

		if(Auth.getUserData()){
			$scope.user = _.clone(Auth.getUserData());
		}


		$scope.linkWith = Auth.linkWith;
		$scope.unlink = Auth.unlink;

		$scope.save = function (userData) {
			$http.put('/users/me',userData).success(function(){
				console.log('User Data Updated');
				Auth.reloadUserData().then(function(){
					$state.go('home.profile');
				})
			})
		};

		$scope.changePic = function(provider){
			 $http.post('/users/me/picture',{provider:provider}).success(function(data){
				if(data.msg){
					console.log(data.msg)
				}
				Auth.reloadUserData().then(function(){
					$state.go('home.profile'); //, {}, { reload: true, inherit: false, notify: true, location: true });
				})
			 })
		}

		// TODO: show progress
		$scope.uploadPic = function(){
			$scope.upload = $upload.upload({
				url: '/users/me/picture',
				method: 'POST',
				withCredentials: true,
				data: {fileString: $scope.imageCropResult, provider: 'upload'}
			}).error(function(evt) {
				//$scope.progressLbl = ($scope.i18n.PROFILE_IMAGE_UPLOAD_FAILED);
			}).progress(function(evt) {
				//$scope.progressLbl = ($scope.i18n.PROFILE_IMAGE_UPLOAD_PROGRESS) + parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(data, status, headers, config) {
				/*
				$scope.progressLbl = ($scope.i18n.PROFILE_IMAGE_UPLOAD_SUCCESS);
				$scope.showOriginalImage = false;
				$scope.showCropComponent = false;
				$scope.showCroppedImage = true;
				$scope.showApply = false;
				$scope.showOK = true;
				$scope.showCancel = false;
				*/
				Auth.reloadUserData().then(function(){
			$state.go('home.profile'); //, {}, { reload: true, inherit: false, notify: true, location: true });
			})

			});
		}
		
	}]);