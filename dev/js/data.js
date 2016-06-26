(function(){
"use strict";

angular.module('Site', ['times.tabletop'])

.config(['TabletopProvider', function(TabletopProvider){
    // Tabletop setup
    TabletopProvider.setTabletopOptions({
            key: 'https://docs.google.com/spreadsheets/d/1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI/pubhtml',
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
                                    // remember to eval later as this is a string and not an array
                                    possibleInput: el.possibleInput,
                                    response: el.response
                                });
                        });
                        parsedObj.portfolio = data[0].Portfolio.elements;
                        return parsedObj;
                }
        };
        return api;
}])
    
.controller('Dialogue', ['$scope','Tabletop','DialoguePortfolioParser',function($scope,Tabletop,DialoguePortfolioParser) {
    var parsedData;
    // Waking Grant up...
    Tabletop.then(function(data){
        parsedData = DialoguePortfolioParser.parse(data);
    }); 
    $scope.lol = "test";
}]);

})(); 
