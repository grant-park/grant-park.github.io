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

		  mTag.width = 300;
		  mTag.height = 300;
		  fTag.width = 300;
		  fTag.height = 300;

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

		
			$('img').each(function() {
		        var maxWidth = 100; // Max width for the image
		        var maxHeight = 100;    // Max height for the image
		        var ratio = 0;  // Used for aspect ratio
		        var width = $(this).width();    // Current image width
		        var height = $(this).height();  // Current image height

		        // Check if the current width is larger than the max
		        if(width > maxWidth){
		            ratio = maxWidth / width;   // get ratio for scaling image
		            $(this).css("width", maxWidth); // Set new width
		            $(this).css("height", height * ratio);  // Scale height based on ratio
		            height = height * ratio;    // Reset height to match scaled image
		            width = width * ratio;    // Reset width to match scaled image
		        }

		        // Check if current height is larger than max
		        if(height > maxHeight){
		            ratio = maxHeight / height; // get ratio for scaling image
		            $(this).css("height", maxHeight);   // Set new height
		            $(this).css("width", width * ratio);    // Scale width based on ratio
		            width = width * ratio;    // Reset width to match scaled image
		            height = height * ratio;    // Reset height to match scaled image
		        }
		    });
		});

