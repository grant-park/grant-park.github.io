(function(){
"use strict";

angular.module('Site', ['times.tabletop','ngSanitize','luegg.directives'])

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
                                    possibleInputs: el.possibleInputs.split(','),
                                    response: el.response
                                });
                        });
                        parsedObj.portfolio = data[0].Portfolio.elements;
                        return parsedObj;
                }
        };
        return api;
}])

.factory('DialogueCache',[function(){
    return { dialogue: [{response:"Hello &#128522;",possibleInputs:["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","eyy"]},{response:"I was born in Chattanooga, TN and raised in Huntsville, AL.",possibleInputs:["where are you from","you from","born"]},{response:"Yup",possibleInputs:["okay","oh"]},{response:"Why, thank-you &#128522;",possibleInputs:["you're","youre","you are"]},{response:"My favorite movie is <i>The Imitation Game</i>.",possibleInputs:["movie"]},{response:"My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.",possibleInputs:["book"]},{response:"Nikola Tesla",possibleInputs:["person in history","historical person","favorite person"]},{response:"Bay Area",possibleInputs:["place"]},{response:"Tonkatsu",possibleInputs:["food"]},{response:"Dog",possibleInputs:["animal"]},{response:"Teal",possibleInputs:["color","colour"]},{response:"I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.",possibleInputs:["want to do","plan","future","would you like to do","what do you want"]},{response:"I like jazz, hip-hop, and classical music.",possibleInputs:["music","listen","genre","what do you like","what kind of stuff do you like"]},{response:"I play the piano and violin.",possibleInputs:["instruments","play"]},{response:"I&#39;m currently majoring in computer science and music at Amherst College.",possibleInputs:["study","major","subject","degree","bachelor","college","school"]},{response:"20",possibleInputs:[" age","old"]},{response:"Grant Park",possibleInputs:["name"]},{response:"I currently live in Amherst, MA.",possibleInputs:["where","live"]},{response:"Sorry to hear that. &#128533;",possibleInputs:["not","bad","terrible"]},{response:"Sweet. &#128522;",possibleInputs:["good","fine","well","awesome","fantastic","amazing","same","me too","as well"]},{response:"I&#39;m doing pretty well, thanks! How about you?",possibleInputs:["how are you","how are you doing","how are you feeling"]},{response:"I think everyday is a nice day...",possibleInputs:["weather","cold","climate","temp","hot","warm","chill"]},{response:"&#128522;",possibleInputs:["lol","rofl","wow","woah","dang","huh","eh","hm","jeez","geez","cool"]},{response:'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.',possibleInputs:["project","example","done"]},{response:'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;',possibleInputs:["contact","email","reach"]},{response:"I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.",possibleInputs:["about","you do","job","occupation","now","language","work","who are you","who"]},{response:'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;',possibleInputs:["do you like to do","hob","design","extracurricular","outside","fun"]},{response:'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["linkedin"]},{response:'Here is my <a href="https://github.com/sungjp">Github</a>.',possibleInputs:["git"]},{response:'Here is my <a href="parkgrantresume.pdf" target="_blank">resume</a>.',possibleInputs:["resume"]},{response:'Here is my <a href="parkgrantresume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["links"]},{response:"Hello &#128522;",possibleInputs:["yo","oi"]},{response:'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ',possibleInputs:["?","help"]}],
            /* Fill this in later */
            portfolio: [{}]
    };
}])

.factory('GrantsAge',[function(){
    var date = new Date(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    day = date.getDay(),
    diff = year - 1995;
    if (12 > month) {
            diff -= 1;
    } else {
            if (2 > day) {
                    diff -= 1;
            }
    }
    return diff;
}])

.factory('Weather',['$http','$q',function($http,$q){
    var deferred = $q.defer();
    var weather;
    var weatherPromise = $http.get("http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/MA/Amherst.json").then(function(response){
            var data = response.data;
            var location = data.location.city,
                currentTemp = data.current_observation.temp_f;
                weather = "The current temperature in " + location + " is: " + currentTemp + "&deg;F &#128513;";
            if (50 > currentTemp) {
                    weather = "Brrr! The current temperature in " + location + " is: " + currentTemp + "&deg:F &#128559;";
            }
         },function(errorMsg){
            console.error(errorMsg);
            weather = "I don't have a clue actually...";
         });
    var resolve = function(){
        deferred.resolve(weather);
    };
    if (weather) {
        resolve();
    } else {
        weatherPromise.then(function(){
            resolve();
        });
    }
    return deferred.promise;
}])
    
.controller('Dialogue', ['$element','$timeout','$q','$scope','Tabletop','DialoguePortfolioParser','DialogueCache','Weather','GrantsAge',function($element,$timeout,$q,$scope,Tabletop,DialoguePortfolioParser,DialogueCache,Weather,GrantsAge) {

    // In case spreadsheets are too slow
    var parsedData = DialogueCache, 
        dialogue = DialogueCache.dialogue, 
        portfolio = DialogueCache.portfolio;

    // Returns response promise based on input
    var dialogueResponse = function(input){
        var deferred = $q.defer();
        for (var i=0;i<dialogue.length;i++){
            for (var j=0;j<dialogue[i].possibleInputs.length;j++){
                if (input.toLowerCase().indexOf(dialogue[i].possibleInputs[j].toLowerCase()) !== -1) {
                        deferred.resolve({ response: dialogue[i].response, i: i, j: j });
                        return deferred.promise;
                }
            }
        }
        deferred.reject("Sorry, I can't respond to that.");
        return deferred.promise;
    };

    // Add to message queue
    var registerMessage = function(msg,sender){
        $scope.messageQueue.push({ sender: sender ? sender : 'Grant', message: msg }); 
    };

    // Initial screen is dialogue
    $scope.dialogue = true;
    $scope.buttonClicked = function(){
        $scope.dialogue = !$scope.dialogue;
    };
    $scope.currentUserText;

    // Send filtered response
    $scope.messageQueue = [];
    $scope.send = function(input) {
        registerMessage(input, 'user');
        $element.find('input').val('');
        $scope.currentUserText = null;
        dialogueResponse(input).then(function(data){
                switch (data.response) {
                        case "E.AGE":
                                registerMessage(GrantsAge);
                                break;
                        case "E.WEATHER":
                                Weather.then(function(resp){
                                        registerMessage(resp);
                                });
                                break;
                        default:
                                registerMessage(data.response);
                }
        },function(notFoundMsg){
            registerMessage(notFoundMsg);
        });
    };

    // Waking Google spreadsheets up...
    Tabletop.then(function(data){
        var deferred = $q.defer();
        if (data) {
                deferred.resolve(data);
        } else {
                deferred.reject("Could not retrieve data");
        }
        return deferred.promise;
    }).then(function(data){
        parsedData = DialoguePortfolioParser.parse(data);
        dialogue = parsedData.dialogue;
        portfolio = parsedData.portfolio;
    },function(msg){console.error(msg);});

    registerMessage("Hi, I'm Grant Park. Ask me anything you'd like. For suggestions, try '?'");

}]);
})(); 
