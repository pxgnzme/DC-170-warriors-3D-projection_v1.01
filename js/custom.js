// VERSION 1.01

var winWidth,winHeight,gameOb,resizeTimer;

var postsWidth = 250;
var postsHeight = 500;

var postsHFactor = postsWidth/postsHeight;
var postsWFactor = postsHeight/postsWidth;

$(document).ready(function(){

	winWidth = $(window).innerWidth();
	winHeight = $(window).innerHeight();

	startGame();

	var bgWFactor = 14389/1216;

	$('body').css("background-size", (winHeight/2)*bgWFactor+"px "+winHeight/2+"px");

});

function startGame(){

	gameOb = new flickKick();
	gameOb.createGame(winWidth, winHeight);

}

function resizeListeners(){

	/*$(window).on('resize',function(){

		gameOb.clearCanvas(winWidth, winHeight);

		//clearTimeout(resizeTimer);
		//resizeTimer = setTimeout(resizeCanvas, 100);

	});*/

}

/*function resizeCanvas(){

	$.logThis("resize");

	winWidth = $(window).innerWidth();
	winHeight = $(window).innerHeight();

	gameOb.resizeGame(winWidth, winHeight);

}*/

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

// resize event




// CONSOLE LOG FUNCTION ---------------------------------------------
// taken from http://www.nodans.com/index.cfm/2010/7/12/consolelog-throws-error-on-Internet-Explorer-IE

jQuery.logThis = function(text){
  
   if((window['console'] !== undefined)){
     
        console.log(text);
    
   }

}

