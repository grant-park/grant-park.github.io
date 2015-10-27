$(document).ready(function() {
	$("#secret").click(function(){
		change();
	});
});

var state = 0;

var change = function(){

	if (state == 0) {
		$("#bob .inner-div").css("background-color","slategray");
		renderer.setClearColor( 0x222222 );
		state = 1;
	} else {
		$("#bob .inner-div").css("background-color","cornflowerblue");
		renderer.setClearColor( 0xFFFFFF );
		state = 0;
	}
	

};