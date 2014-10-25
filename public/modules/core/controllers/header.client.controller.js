'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
    //this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
    Menus.addMenuItem('topbar', 'Начало', '/', 'item', 'home-dash', true, '*');
    Menus.addMenuItem('topbar', 'Сигнали', 'signals/', 'item', 'signals.index', true, '*');
    Menus.addMenuItem('topbar', 'Подай сигнал', 'signals/new', 'item', 'signals.new', true, '*');

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

    console.log($scope.menu.items);

    $scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
