(function(){
"use strict";

angular.module('Site', ['times.tabletop'])

.config(['TabletopProvider', function(TabletopProvider){
    // Tabletop setup
    TabletopProvider.setTabletopOptions({
            key: '1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI',
            simple_url: true
    });
}])        

.factory('DialoguePortfolioParser',[function(){
        var api = {
                parse: function(data){
                        var parsedObj = {};
                        parsedObj.dialogue = [];
                        _.each(data[0].Dialogue.elements,function(el) {
                                parsedObj.dialogue.push({
                                    possibleInput: el.possibleInput.split(','),
                                    response: el.response
                                });
                        });
                        parsedObj.portfolio = data[0].Portfolio.elements;
                        return parsedObj;
                }
        };
        return api;
}])
    
.controller('Dialogue', ['$q','$scope','Tabletop','DialoguePortfolioParser',function($q,$scope,Tabletop,DialoguePortfolioParser) {
    // Waking Grant up...
    Tabletop.then(function(data){
        var deferred = $q.defer();
        if (data) {
                deferred.resolve(data);
        } else {
                deferred.reject("Could not retrieve data");
        }
        return deferred.promise;
    }).then(function(data){
        var parsedData = DialoguePortfolioParser.parse(data);
        var dialogue = parsedData.dialogue;
        var portfolio = parsedData.portfolio;
    },function(msg){console.error(msg);});
}])

.filter('html',['$sce',function($sce){
    return function(val){
            return $sce.trustAsHtml(val);
    };
}]);

})(); 
