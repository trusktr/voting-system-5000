function setTitleCenter() {
	var _title = $('#title'),
		width = _title.width(),
		height = _title.height();

	_title.css({"margin-left" : ""+(-width/2)+"px"});
	_title.css({"margin-top" : ""+(-height/2)+"px"});
}

$(document).ready(function(){
	setTitleCenter();
	
	$('html').css({'background-color':'none'});
	
		
	var mouseMoveCount = 0;
	$('body').on('mousemove', function() {
		var _this = $(this),
			colorHigh = 219, // RGB
			colorLow = 143, // RGB
			colorRange = colorHigh - colorLow,
			rgbParts = [];
		
		if (mouseMoveCount%20 == 0) {
			for (var i=0; i<3; i++) {
				rgbParts[i] = Math.floor(Math.random()*colorRange + colorLow);
				console.log(rgbParts[i]);
			}
			$('body').css({'background-color':'rgb('+rgbParts[0]+','+rgbParts[1]+','+rgbParts[2]+')'}); // TODO use integers
			
			mouseMoveCount = 0;
		}
		
		mouseMoveCount++;
	});
});

$(window).resize(function(){
});


