'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$localStorage',

	function($localStorage) {
		var _this = this;

		_this._data = {
			user: window.user || $localStorage.user
		};

		return _this._data;
	}
]);
