var app = angular.module('App',[]);

app.controller('MainController', function($scope){
	$scope.profile = null;
	$scope.iOSWeb = false;
	$scope.normal = false;
	$scope.back = false;
	$scope.web = false;
	$scope.panel = false;
	$scope.toiOS = function(){
		$scope.iOSWeb = true;
		$scope.normal = true;
		$scope.back = true;
		$scope.panel = true;
	}

	$scope.toWeb = function(){
		$scope.iOSWeb = true;
		$scope.web = true;
		$scope.normal = false;
		$scope.back = true;
	};

	$scope.backTo = function(){
		$scope.iOSWeb = false;
		$scope.web = false;
		$scope.normal = false;
		$scope.back = false;
		$scope.panel = false;
	} 
});