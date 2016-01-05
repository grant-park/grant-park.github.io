var app = angular.module('App', ['ngSanitize', 'luegg.directives', 'ngAnimate']);

app.controller("Messaging", ['$scope','$timeout', function($scope, $timeout){
	$scope.showApps = true;
	getWeather();
	getAge();
	$scope.age = '20'
	$scope.weather = 'Dunno!'
	$scope.bubbles = [];
	var y = '<p>Hi, I&#39;m Grant Park. Ask me anything you&#39;d like. <br/> For suggestions, try <span style="color:lemonchiffon;">&#39;?&#39;</span>';
	$scope.bubbles.push({mes: y, isMe: true});
	$scope.check = function(checkee){
		if (checkee) {
			return "oddBubble"
		} else {
			return "evenBubble"
		}
	}
	$scope.send = function() {
		if ($scope.bubbleText != "" && $scope.bubbleText) {
			var convos = [
				{response: 'My favorite movie is <i>The Imitation Game</i>.', possibleInputs: ["movie"]},
				{response: 'My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.', possibleInputs: ["book"]},
				{response: 'Nikola Tesla', possibleInputs: ["person in history","historical person","favorite person"]},
				{response: 'Bay Area', possibleInputs: ["place"]},
				{response: 'Tonkatsu', possibleInputs: ["food"]},
				{response: 'Dog', possibleInputs: ["animal"]},
				{response: 'Teal', possibleInputs: ["color", "colour"]},
				{response: 'I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.', possibleInputs: ["want to do","plan","future","would you like to do","what do you want"]},
				{response: 'I like jazz, hip-hop, and classical music.', possibleInputs: ["music","listen","genre","what do you like","what kind of stuff do you like"]},
				{response: 'I play the piano and violin.', possibleInputs: ["instruments","play"]},
				{response: 'I&#39;m currently majoring in computer science and music at Amherst College.', possibleInputs: ["study","major","subject","degree","bachelor","college","school"]},
				{response: $scope.age, possibleInputs: ["age","old"]},
				{response: 'Grant Park', possibleInputs: ["name"]},
				{response: 'I currently live in Amherst, MA.', possibleInputs: ["where","live"]},
				{response: 'Sorry to hear that. &#128533;', possibleInputs: ["not","bad","terrible"]},
				{response: 'Sweet. &#128522;', possibleInputs: ["good","fine","well","awesome","fantastic","amazing"]},
				{response: 'I&#39;m doing pretty well, thanks! How about you?', possibleInputs: ["how are you","how are you doing","how are you feeling"]},
				{response: $scope.weather, possibleInputs: ["weather","cold","climate","temp","hot","warm","chill"]},
				{response: 'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.', possibleInputs: ["project","example","done"]},
				{response: 'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;', possibleInputs: ["contact","email","reach"]},
				{response: 'I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.', possibleInputs: ["about","you do","job","occupation","now","language","work","who are you"]},
				{response: 'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;', possibleInputs: ["do you like to do","hob","design","extracurricular","outside","fun"]},
				{response: 'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.', possibleInputs: ["linkedin"]},
				{response: 'Here is my <a href="https://github.com/sungjp">Github</a>.', possibleInputs: ["git"]},
				{response: 'Here is my <a href="resume.pdf">resume</a>.', possibleInputs: ["resume"]},
				{response: 'Here is my <a href="resume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.', possibleInputs: ["links"]}
			];
			var convosEq = [
				{response: "Hello &#128522;", possibleInputs: ["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","yo","oi","eyy"]},
				{response: 'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ', possibleInputs: ["?","help"]}
			];
			document.getElementById("thesend").disabled = true;
			$scope.bubbles.push({mes: $scope.bubbleText, isMe: false});
			var g = {mes: '<div class="loading"></div>', isMe: true};
			$timeout(function(){$scope.bubbles.push(g)},400).then(function(){
				for(var i=0; i<convos.length; i++) {
					var each = convos[i];
					for(var j=0; j<each.possibleInputs.length; j++) {
						var input = each.possibleInputs[j];
						if ($scope.bubbleText.toLowerCase().indexOf(input) != -1) {
							$scope.sendBubble(each.response);
							return;
						};
					};
				};
				for(var i=0; i<convosEq.length; i++) {
					var each = convosEq[i];
					for(var j=0; j<each.possibleInputs.length; j++) {
						var input = each.possibleInputs[j];
						if ($scope.bubbleText.toLowerCase() === input) {
							$scope.sendBubble(each.response);
							return;
						};
					};
				};
				if ($scope.bubbleText.toLowerCase() === "clear") {
					$scope.bubbles = [];
					$scope.sendBubble('<p>Hi, I&#39;m Grant Park. Ask me anything you&#39;d like. <br/> For suggestions, try <span style="color:lemonchiffon;">&#39;?&#39;</span>');
					return;
				} else if ($scope.bubbleText.toLowerCase() === "switch") {
					$scope.sendBubble('Switching!');
					$scope.switch();
					return;
				}
				$scope.sendBubble("Sorry, I can&#39;t respond to that.");
			});
		};
	};

	$scope.sendBubble = function(input) {
		$scope.bubbleText = '';
		var x = {mes: input, isMe: true};
		$timeout(function(){
			$scope.bubbles.pop();
			$scope.bubbles.push(x);
			document.getElementById("thesend").disabled = false;
		},800);
	};

	$scope.switch = function() {
		if ($scope.showApps) {
			$scope.showApps = false;
		} else {
			$scope.showApps = true;
		}
	};

	function getWeather(){
		jQuery(document).ready(function($) {
		  $.ajax({
		  url : "http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/MA/Amherst.json",
		  dataType : "jsonp",
		  success : function(parsed_json) {
			  var location = parsed_json['location']['city'];
			  var temp_f = parsed_json['current_observation']['temp_f'];
			  var message = "The current temperature in " + location + " is: " + temp_f + "&deg;F &#128513;";
			  if (temp_f < 50) {
			  	message = "Brrr! The current temperature in " + location + " is: " + temp_f + "&deg;F &#128559;";
			  }
			  $scope.weather = message;
		  }
		  });
		});
	};

	function getAge(){
		var d = new Date();
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var day = d.getDay();
		var difference = year - 1995;
		if (month < 12) {
			difference -= 1;
		} else if (day < 2) {
			difference -= 1;
		}
		$scope.age = difference;
	}

	$scope.projects = [
	{
		description: 'Website 1.0',
		image: 'images/web1.png',
		link: 'http://www.grantpark.rocks'
	},
	{
		description: 'Hungrie',
		image: 'images/hungrie.jpg',
		link: 'http://www.hungrie.site'
	},
	{
		description: 'Byte',
		image: 'images/byte.png',
		link: 'http://yhackbyte.herokuapp.com/'
	},
	{
		description: 'NoteSMS',
		image: 'images/onenote.jpg',
		link: 'BostonHacks/index.html'
	},
	{
		description: 'OutsideHacks',
		image: 'images/outside.png',
		link: 'outside.html'
	},
	{
		description: 'Amherst EC',
		image: 'images/amherst.png',
		link: 'http://amherstec.github.io/'
	},
	{
		description: 'Codepen',
		image: 'images/codepen.jpg',
		link: 'http://codepen.io/sungjp/'
	},
	{
		description: 'Resume',
		image: 'images/paper.jpg',
		link: 'https://represent.io/grantxs'
	},
	{
		description: 'Github',
		image: 'images/github.jpeg',
		link: 'https://github.com/sungjp'
	},
	{
		description: 'LinkedIn',
		image: 'images/linked.png',
		link: 'https://www.linkedin.com/in/granthpark'
	}
	];

	$scope.tabs = [
	{
		description: 'Music',
		image: 'images/soundcloud.png',
		link: 'https://soundcloud.com/grant-park'
	},
	{
		description: 'Blog',
		image: 'images/medium.png',
		link: 'https://medium.com/@grantxs'
	},
	{
		description: 'Design',
		image: 'images/behance.jpg',
		link: 'https://www.behance.net/grantpark'
	}
	];
}]);

app.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
