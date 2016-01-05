var app = angular.module('App', ['ngSanitize', 'luegg.directives', 'ngAnimate']);

app.controller("Messaging", ['$scope','$timeout', function($scope, $timeout){
	$scope.showApps = true;
	$scope.bubbles = [];
	var y = '<p>Hi, I&#39;m Grant Park. Ask me anything you&#39;d like. <br/> For suggestions, try <span style="color:lemonchiffon;">&#39;?&#39;</span>';
	var z = {mes: y, isMe: true}
	$scope.bubbles.push(z);
	$scope.check = function(checkee){
		if (checkee) {
			return "oddBubble"
		} else {
			return "evenBubble"
		}
	}
	$scope.send = function(){
		if ($scope.bubbleText != "" && $scope.bubbleText) {
			var l = {mes: $scope.bubbleText, isMe: false};
			$scope.bubbles.push(l);
			var g = {mes: '<div class="loading"></div>', isMe: true};
			$timeout(function(){$scope.bubbles.push(g)},400).then(function(){
				if ($scope.bubbleText.toLowerCase() === "?" || $scope.bubbleText.toLowerCase() === "help") {
					$scope.bubbleText = '';
					$timeout(function(){
					$scope.bubbles.pop();
					var x = 'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ';
					var w = {mes: x, isMe: true}
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("links") != -1) {
					$scope.bubbleText = '';
					$timeout(function(){
					$scope.bubbles.pop();
					var x = 'Here is my <a href="resume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.';
					var w = {mes: x, isMe: true}
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("resume") != -1) {
					$scope.bubbleText = '';
					$timeout(function(){
						$scope.bubbles.pop();
						var x = 'Here is my <a href="resume.pdf">resume</a>.';
					var w = {mes: x, isMe: true}
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("git") != -1) {
					$scope.bubbleText = '';
					$timeout(function(){
						$scope.bubbles.pop();
						var x = 'Here is my <a href="https://github.com/sungjp">Github</a>.';
						var w = {mes: x, isMe: true}
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("linkedin") != -1) {
					$scope.bubbleText = '';
					$timeout(function(){
						$scope.bubbles.pop();
					var x = 'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.';
					var w = {mes: x, isMe: true}
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("hob") != -1) {
					$scope.bubbleText = '';
					var x = 'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;';
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase() === "about") {
					$scope.bubbleText = '';
					var x = 'I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.';
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("contact") != -1) {
					$scope.bubbleText = '';
					var x = 'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;';
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase().indexOf("project") != -1) {
					$scope.bubbleText = '';
					var x = 'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to projects.';
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase() === "clear") {
					$scope.bubbleText = '';
					var x = '<p>Hi, I&#39;m Grant Park. Ask me anything you&#39;d like. <br/> For suggestions, try <span style="color:lemonchiffon;">&#39;?&#39;</span>';
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				} else if ($scope.bubbleText.toLowerCase() === "switch") {
					$scope.bubbleText = '';
					$scope.bubbles.pop();
					$scope.switch();
				} else {
					$scope.bubbleText = '';
					var x = "Sorry, I can&#39;t respond to that.";
					var w = {mes: x, isMe: true}
					$timeout(function(){
						$scope.bubbles.pop();
					$scope.bubbles.push(w);
					}, 800);
				}

			});
		};
	};
	$scope.switch = function() {
		if ($scope.showApps) {
			$scope.showApps = false;
		} else {
			$scope.showApps = true;
		}
	};

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
		image: 'images/outside.jpg',
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
