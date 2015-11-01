$(document).ready(function() {
	$("#secret").click(function(){
		change();
	});

	setTimeout(function(){
		$('body').addClass('loaded');
		$('h1').css('color','#222222');
	}, 2500);
});

var state = 0;

var change = function(){

	if (state == 0) {
		$("#bob .inner-div").css("background-color","dodgerblue");
		renderer.setClearColor( 0x222222 );
		state = 1;
	} else {
		$("#bob .inner-div").css("background-color","cornflowerblue");
		renderer.setClearColor( 0xFFFFFF );
		state = 0;
	}
	

};