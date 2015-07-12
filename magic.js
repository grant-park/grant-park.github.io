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

		  var mdiv = document.getElementById("mpics");
		  var fdiv = document.getElementById("fpics");
		  var mTag = document.createElement('img');
		  var fTag = document.createElement('img');


		  mTag.style.maxWidth = "100%";
		  fTag.style.maxWidth = "100%";


		  mTag.style.borderRadius = "100px"
		  fTag.style.borderRadius = "100px"

		  mTag.style.webkitBoxShadow = "0px 0px 10px 4px rgba(119, 119, 119, 0.75)"
		  fTag.style.webkitBoxShadow = "0px 0px 10px 4px rgba(119, 119, 119, 0.75)"


		  if (temp_f > 80) {
		  	mTag.src = "temp/mabove80.jpg";
		  	fTag.src = "temp/fabove80.jpg";
		  	document.getElementById("mpics").appendChild(mTag);
		  	document.getElementById("fpics").appendChild(fTag);
		  }
		  else if (temp_f < 80 && temp_f > 60) {
		  	fTag.src = "temp/f60thru80.jpg";
		  	mTag.src = "temp/m50thru80.jpg";
		  	document.getElementById("fpics").appendChild(fTag);
		  	document.getElementById("mpics").appendChild(mTag);
		  }
		  else if (temp_f < 60) {
		  	fTag.src = "temp/fbelow60.jpg";
		  	mTag.src = "temp/m50thru80.jpg";
		  	document.getElementById("fpics").appendChild(fTag);
		  	document.getElementById("mpics").appendChild(mTag);
		  }
		  else if (temp_f < 50) {
		  	fTag.src = "temp/fbelow60.jpg";
		  	mTag.src = "temp/mbelow50.jpg";
		  	document.getElementById("fpics").appendChild(fTag);
		  	document.getElementById("mpics").appendChild(mTag);
		  }

		}
		  });

		

		});

