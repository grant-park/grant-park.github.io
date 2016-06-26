(function(){
"use strict";

angular.module('Site', ['times.tabletop'])

.config(function(TabletopProvider){
    // Tabletop setup
    TabletopProvider.setTabletopOptions({
            key: '1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI',
            simpleSheet: true
    });
})

.controller('Dialogue', ['$scope','Tabletop', function($scope,Tabletop) {
    Tabletop.then(function(data){
            $scope.bob = data[0];
    }); 
    $scope.lol = "test";
}]);

})();
