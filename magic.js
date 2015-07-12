jQuery(document).ready(function($) {
		  $.ajax({
		  url : "http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/CA/San_Francisco.json",
		  dataType : "jsonp",
		  success : function(parsed_json) {
		  var weather = parsed_json['current_observation']['weather'];
		  console.log(weather);
		  if (weather == "Patches of Fog" || weather == "Shallow Fog" || weather == "Partial Fog" || weather == "Overcast" || weather == "Clear" || weather == "Partly Cloudy" || weather == "Mostly Cloudy" || weather == "Scattered Clouds" || weather == "Light Mist" || weather == "Heavy Mist") { 
		  document.getElementById("mainz").innerHTML = "The weather at Outside Lands is OKAY!";
		  }
		  else {
		  	document.getElementById("mainz").innerHTML = "The weather at Outside Lands sucks right now.";
		  }
		  var location = parsed_json['location']['city'];
		  var temp_f = parsed_json['current_observation']['temp_f'];
		  document.getElementById("weather").innerHTML = "Current temperature in " + location + " is " + temp_f + "&#176" + "F" + " and it's " + weather.toLowerCase() + ".";
		  $(window).trigger('resize');
		}
		  });
		});