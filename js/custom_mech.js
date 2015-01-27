// VERSION 1.01

var ball,doc;

var goals = 0;

var distToPosts = 700;
var widthOfPosts = 250;

var factor = 60;

var testing = false;

var myElement = document.getElementById('myElement');

var mc = new Hammer(myElement);

$(document).ready(function() {

	ball = {

		speed:180,
		angle:50,
		gravity:30,
		gAngle:0,
		gDir:0

	};

	doc = {

		bottom: $(document).height(),
		right: $(document).width()

	}; 	

	setupHammer();

});

function setupHammer(){

	mc.get("swipe").set({ direction: Hammer.DIRECTION_ALL, velocity:0});

	mc.on("swipe", function(ev) {

	    var velocityFactor;

	    ball.gDir = 0;
	    var gestureAngle = 0;

	    if(ev.angle < 0){
	    	gestureAngle = ev.angle*-1;
		}else{
			 gestureAngle = ev.angle;
		}

		if(gestureAngle > 90){

			gestureAngle = 90-(gestureAngle-90);
			ball.gDir = 1;

		} 

		if(testing){
			myElement.textContent ="Gesture Angle :> "+Math.round(gestureAngle)+" :: Speed :> "+ev.velocity;
		}

		if(gestureAngle < 78){
			gestureAngle = 78;
		}

		ball.gAngle = gestureAngle;

	    if(ev.velocity < 0){

	    	velocityFactor = ev.velocity*-1;

	    }else{

	    	velocityFactor = ev.velocity;
	    }

	    if (velocityFactor < 2.5){

	    	velocityFactor = 2.5;

	    }else if(velocityFactor > 3.8){

	    	velocityFactor = 3.8;

	    }

	    ball.speed = Number(velocityFactor)*factor;

	    getTrad();

	   //tracePath();

	});

}



// create a simple instance
// by default, it only adds horizontal recognizers




//tradCalc();

/*function tradCalc(){

	var range = (Math.pow(ball.speed,2) * Math.sin((ball.angle * (Math.PI/180))*2))/ ball.gravity;

	alert(range);

}*/

function getTrad(){

	$('.trace').remove();

	var vX = ball.speed * Math.cos(ball.angle * Math.PI/180);
	$.logThis("Velocity X :> "+vX);
	
	var vY = ball.speed * Math.sin(ball.angle * Math.PI/180);
	$.logThis("Velocity Y :> "+vY);

	var timeOfFlight = distToPosts/vX;
	$.logThis("time of flight :> "+timeOfFlight);

	var hAtX = ((distToPosts * vY)/vX) - (0.5 * ball.gravity * (Math.pow(distToPosts,2)/Math.pow(vX,2)));
	$.logThis("height at posts :> "+hAtX);

	var dirDisAtX = distToPosts/Math.tan(ball.gAngle * Math.PI/180);

	var hitLeft = 0;

	$.logThis("dir :> "+ball.gDir);

	if(ball.gDir == 0){

		hitLeft = (widthOfPosts/2)+dirDisAtX;
	
	}else{

		hitLeft = (widthOfPosts/2)-dirDisAtX;

		$.logThis("dirDisAtX :> "+dirDisAtX+" :: hit left :> "+hitLeft);

	}

	displayHitLeft = hitLeft-(25/2);
	displayHAtX = hAtX-(38/2);

	$('#goal').append('<div class="trace" style="bottom: '+
		displayHAtX+'px; left: '+displayHitLeft+'px"></div>');

	if(hAtX > 200){ 

		if(hitLeft >= 0 && hitLeft <= widthOfPosts){
			goals ++;

			$('#score_txt').html(goals);
		}

	}else{


	}

	


}

function offscreen(x, y) {

	var offscreen = false;

	if(x > doc.right){

		offscreen = true;
	
	};
	
	if(x < 0){

		offscreen = true;

	}

	if(y > doc.bottom){

		offscreen = true;

	}

	if(y < 0){

		offscreen = true;

	}

	return offscreen;

} 

function tracePath(){

	$('.trace').remove();

	var trace = {

		x: 0,
		y: doc.bottom,
		time:0

	}

	//var trace_offscreen = false;
	var trace_offscreen = false;

	while(!trace_offscreen) {

		x = ball.speed * Math.cos(ball.angle * Math.PI/180) * trace.time + trace.x;

		y = ball.speed * Math.sin(ball.angle * Math.PI/180) * trace.time -0.5 * ball.gravity * Math.pow(trace.time,2);

		y = trace.y - y;

		trace_offscreen = offscreen(x, y);

		if(!trace_offscreen){

			console.log(y);

			$('body').append('<div class="trace" style="top: '+y+'px; left: '+x+'px;"></div>');

			trace.time += 0.5;

		}

		

	} 

}



// =====================================================================================================
// ADDITIONAL FUNCTIONS
// =====================================================================================================
// validate email

function validateEmail(email){ 

	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
	
	if(!reg.test(email)){ 
	
		return false;
	
	}else{
		
		return true;
		
	} 

} 

function getUniqueTime() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
}


// CONSOLE LOG FUNCTION ---------------------------------------------
// taken from http://www.nodans.com/index.cfm/2010/7/12/consolelog-throws-error-on-Internet-Explorer-IE

jQuery.logThis = function(text){
  
   if((window['console'] !== undefined)){
     
        console.log(text);
    
   }

}

