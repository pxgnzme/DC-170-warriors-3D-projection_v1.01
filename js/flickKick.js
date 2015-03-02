/*
WARRIORS FLICK KICK OBJECT
AUTHOR: FRAZER CAMERON @pixelgiantnz NZME
VERSION 1.01
*/

var kickDisabled = false;

var canvas,context;

function flickKick(){

	var obj = this;

	this.score = {

		totalKicks:0,
		totalOver:0,
		curScore:0

	};

	this.level = {

		curtime:60,
		stage1:0.70,
		stage2:0.80,
		stage3:0.90,
		stage4:1,
		multi1:2,
		multi2:3,
		multi3:4,
		multi4:5,
		levelScore:0
	
	};

	//this.paused = true;
	this.inflight = false;

	this.world = {

		postHeight:600,
		postThick:10,
		barheight:200,
		postWidth:200,
		dToPosts:700,
		cameraHeight:30,
		fovAddedMaxHtAtPosts:200,
		gravity:30,
		pitchAngle:60,
		dToScreen:30,
		dSceenToBall:20,
		balllength:15,
		ballWidth:10,
		flightFrames:35,
		vfactor:60,
		windFactor:-2,
		curView:1,
		ballPos:0

	};

	this.ball = {

		speed:180,
		angle:45,
		gravity:30,
		gAngle:0,
		gDir:0,
		curFF:0,
		state:0,
		curX:0,
		curY:0,
		teebase:0,
		hitV:false,
		hitH:false,
		postHitW:0

	};

	this.indicator = {
		x:0,
		y:0,
		totalFrames:10,
		alive:false,
		mode:0,
		curFrame:0,
		radius:2
	}

	this.posts = {

		postsScreenWidth:0,
		topPostsScreenY:0,
		postsScreenHeight:0,
		sideDiff:0,
		padHeight: 0.75

	};
	

	this.createGame = function(w,ht){

		obj.canvasWidth = w;
		obj.canvasheight = ht;
		obj.worldHeight = obj.canvasheight;
		obj.worldWidth = obj.worldHeight;

		$('#game_container').html("<canvas width='"+w+"' height = '"+ht+"' id = 'game_stage'/>");

		obj.midX = w/2;

		obj.world.ballHfactor = obj.world.ballWidth/obj.world.balllength;

		obj.world.fov = (Math.atan((obj.world.fovAddedMaxHtAtPosts+(obj.world.postHeight-obj.world.cameraHeight))/(obj.world.dToPosts+obj.world.dToScreen+obj.world.dSceenToBall)))/(Math.PI/180);

		canvas = document.getElementById('game_stage');
		context = canvas.getContext('2d');

		obj.drawWorld();

		obj.runTimer();

		var bgWFactor = 14389/1216;

		$('#bg'+obj.world.curView).show();

		$('.bg').css("background-size", (winHeight/2)*bgWFactor+"px "+winHeight/2+"px");


	};

	//wipe canvas -- 
	this.wipeCanvas = function() {
	
		context.clearRect(0,0,obj.canvasWidth,obj.canvasheight);	
		
	};

	this.drawWorld = function(){

		obj.drawPosts();

		obj.getBallSteps(1);

	};

	this.drawTee = function(){

		context.save();

		context.translate(obj.midX,obj.ball.teebase);

		context.beginPath();

		context.moveTo(obj.ball.teeWidth*-1, 0);
      	context.lineTo(0, obj.ball.teeWidth*-1);
      	context.lineTo(obj.ball.teeWidth, 0);

      	context.quadraticCurveTo(0, 30, obj.ball.teeWidth*-1, 0);
    
      	context.lineJoin = 'round';
      	context.fillStyle = '#fff568';
	    context.fill();

	    context.clip();

	    context.beginPath();
	    context.arc(0, obj.ball.teeWidth*-1, obj.ball.teeWidth/1.5, 0, 2 * Math.PI, false);
	    context.fillStyle = '#d6ce57';
	    context.fill();

      	context.restore();

	};

	this.drawPosts = function(){

		var inside = true;
		var left = false;

		if(obj.posts.sideDiff > ((obj.world.postWidth/2)*-1) && obj.posts.sideDiff < (obj.world.postWidth/2)){

			var rPostDiffToBall = (obj.world.postWidth/2)-obj.posts.sideDiff;
		
		}else{

			var rPostDiffToBall = obj.posts.sideDiff-(obj.world.postWidth/2);

			 inside = false;

			 if(obj.posts.sideDiff < 0){

			 	left = true;

			 }

		}

		var rPostd = Math.sqrt(Math.pow(rPostDiffToBall,2)+Math.pow(obj.world.dToPosts,2));

		var rPostAngle = Math.atan(700/rPostDiffToBall);
		
		if(obj.posts.sideDiff > ((obj.world.postWidth/2)*-1) && obj.posts.sideDiff < (obj.world.postWidth/2)){

			var centerAngle = ((90 * (Math.PI/180)) - Math.atan(700/obj.posts.sideDiff))+(90 * (Math.PI/180));

			var rPostAngleFromCemter = centerAngle - rPostAngle;

		}else{

			var centerAngle = Math.atan(700/obj.posts.sideDiff);

			var rPostAngleFromCemter = rPostAngle - centerAngle;

		}

		var rPostwidthFromCenter =  Math.sin(rPostAngleFromCemter)*rPostd;

		var rPostToCamera = rPostwidthFromCenter/Math.tan(rPostAngleFromCemter);

		var WidthOfFovAtRPost = Math.tan(obj.world.fov * Math.PI/180)*rPostToCamera;

		var rthickness = (obj.world.postThick/WidthOfFovAtRPost)*(obj.worldWidth/2);

		var screenRPost = (rPostwidthFromCenter/(WidthOfFovAtRPost/2))*(obj.worldWidth/2); 

		obj.posts.screenRPost = screenRPost;

		var rPostHeight = (obj.world.postHeight/WidthOfFovAtRPost)*(obj.worldHeight/2);

		var topRPostProjY = (obj.world.postHeight-obj.world.cameraHeight)/WidthOfFovAtRPost;

		var topRPostsScreenY = (obj.worldHeight/2) - ((obj.worldHeight/2)*topRPostProjY);

		//crossbar vars

		var rCrossBarHeight = (obj.world.barheight/WidthOfFovAtRPost)*(obj.worldHeight/2);

		//--

		context.save();
		context.translate(obj.midX,topRPostsScreenY);

		context.beginPath();

		context.rect(screenRPost, 0, rthickness, rPostHeight);

		var grd1 = context.createLinearGradient(screenRPost, 0, screenRPost+rthickness, 0);
	 
	    grd1.addColorStop(0, '#AAA');   
	  
	    grd1.addColorStop(1, '#FFF');
	
		context.fillStyle = grd1;

	    context.fill();

	    context.beginPath();

	    context.rect(screenRPost-(rthickness*2), rPostHeight-(rCrossBarHeight*obj.posts.padHeight), rthickness*5, rCrossBarHeight*obj.posts.padHeight);

	    var grd4 = context.createLinearGradient(screenRPost-(rthickness*2), 0, screenRPost+(rthickness*2), 0);

	    if(inside){

		   // dark #9d292b
		   // medium #c02a2c
		   // light #c24648

		    grd4.addColorStop(0.2, '#b52624');

		    grd4.addColorStop(0.3, '#c02a2c');
	


	    }else{

	    	if(left){

		    	grd4.addColorStop(0.3, '#b52624');    
		    	
		    	grd4.addColorStop(0.4, '#c02a2c');

	    	}else{
		    	
		    	grd4.addColorStop(0.7, '#c02a2c');    
		    	
		    	grd4.addColorStop(0.8, '#cc3634');

			}

	    }

	    context.fillStyle = grd4;

	    context.fill();

		context.restore();

		// left post

		var lPostDiffToBall = obj.posts.sideDiff+(obj.world.postWidth/2);

		var lPostd = Math.sqrt(Math.pow(lPostDiffToBall,2)+Math.pow(obj.world.dToPosts,2));

		var lPostAngle = Math.atan(700/lPostDiffToBall);

		var lPostAngleFromCemter = centerAngle-lPostAngle;

		var lPostwidthFromCenter =  Math.sin(lPostAngleFromCemter)*lPostd;

		var lPostToCamera = lPostwidthFromCenter/Math.tan(lPostAngleFromCemter);

		var WidthOfFovAtLPost = Math.tan(obj.world.fov * Math.PI/180)*lPostToCamera;

		var screenLPost = (lPostwidthFromCenter/(WidthOfFovAtLPost/2))*(obj.worldWidth/2); 

		obj.posts.screenLPost = screenLPost;

		var lPostHeight = (obj.world.postHeight/WidthOfFovAtLPost)*(obj.worldHeight/2);

		var topLPostProjY = (obj.world.postHeight-obj.world.cameraHeight)/WidthOfFovAtLPost;

		var topLPostsScreenY = (obj.worldHeight/2) - ((obj.worldHeight/2)*topLPostProjY);

		var lthickness = (obj.world.postThick/WidthOfFovAtLPost)*(obj.worldWidth/2);

		var lCrossBarHeight = (obj.world.barheight/WidthOfFovAtLPost)*(obj.worldHeight/2);

		context.save();
		context.translate(obj.midX,topLPostsScreenY);

		context.beginPath();

		context.rect((screenLPost+lthickness)*-1, 0, lthickness, lPostHeight);

		var grd2 = context.createLinearGradient((screenLPost+lthickness)*-1, 0, screenLPost*-1, 0);

	    grd2.addColorStop(0, '#AAA');   
	    
	    grd2.addColorStop(1, '#FFF');
	
		context.fillStyle = grd2;

	    context.fill();

	    context.beginPath();

	    context.rect((screenLPost+lthickness+(lthickness*2))*-1, lPostHeight-(lCrossBarHeight*obj.posts.padHeight), lthickness*5, lCrossBarHeight*obj.posts.padHeight);

	    var grd5 = context.createLinearGradient((screenLPost+lthickness+(lthickness*2))*-1, 0, (screenLPost-(lthickness*2))*-1, 0);

	    if(inside){

		    
		    grd5.addColorStop(0.7, '#c02a2c'); 

		    grd5.addColorStop(0.8, '#cc3634');


	    }else{

	    	if(left){

		    	grd5.addColorStop(0.3, '#b52624');    
		    	
		    	grd5.addColorStop(0.4, '#c02a2c');

	    	}else{

			    grd5.addColorStop(0.6, '#c02a2c');    
			   
			    grd5.addColorStop(0.7, '#cc3634');

			}

	    }

	    context.fillStyle = grd5;

	    context.fill();

		context.restore();

		// cross bar

		context.beginPath();

		context.moveTo(obj.midX + screenRPost,topRPostsScreenY+(rPostHeight-rCrossBarHeight+(rthickness/2)));

		context.lineTo(obj.midX-screenLPost, topLPostsScreenY + (lPostHeight-lCrossBarHeight+(lthickness/2)));

		context.lineTo(obj.midX-screenLPost, topLPostsScreenY + (lPostHeight-lCrossBarHeight-(lthickness/2)));

		context.lineTo(obj.midX + screenRPost, topRPostsScreenY + (rPostHeight-rCrossBarHeight- (rthickness/2)));

		context.lineTo(obj.midX + screenRPost,topRPostsScreenY+(rPostHeight-rCrossBarHeight+(rthickness/2)));

	    var grd3 = context.createLinearGradient(obj.midX+screenRPost, 0, obj.midX+(screenLPost*-1), 0);
	    // light blue
	    grd3.addColorStop(0, '#AAA');   
	    // dark blue
	    grd3.addColorStop(0.3, '#FFF');
	    grd3.addColorStop(1, '#ccc');
	
		context.fillStyle = grd3;

      	context.fill();

		context.restore();

	};

	this.refreshWorld = function(){

		obj.drawPosts();

		obj.drawTee();

		obj.getBallTrad();

	};

	this.getBallTrad = function(){

		if(obj.ball.curFF < obj.world.flightFrames){
		
			obj.getBallSteps(1);
			obj.ball.curFF++;

		}else{

			var ts =  obj.world.dToPosts/obj.world.flightFrames;

			$.logThis(obj.ball.curFF*ts);

			obj.indicator.x = obj.ball.curX;
			obj.indicator.y = obj.ball.curY;

			obj.ball.hitV = obj.hitV();
			obj.ball.hitH = obj.hitH();

			obj.ball.curFF = 0;
			obj.ball.state = 0;
			obj.getBallSteps(0);

		}

	};

	this.hitV = function(){

		//return true;

		if (obj.getBallHeightAtX(obj.world.dToPosts) > obj.world.barheight){

			return true;

		}else{

			return false;

		}

	};

	this.hitH = function(){

		var hX = Math.tan(obj.ball.gAngle * Math.PI/180)*obj.world.dToPosts;

		var cameraToBall = obj.world.dToPosts + obj.world.dToScreen + obj.world.dSceenToBall;

		var widthOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var hXFactor = hX/(widthOfFovAtBall/2);

		var wind = obj.world.windFactor*obj.ball.curFF;

		var distanceFromCenter = (obj.midX*hXFactor)+wind;

		if(obj.ball.gDir > 0){

			distanceFromCenter = (obj.midX*hXFactor)-wind;

		}

		if(obj.ball.gDir > 0 ){

			var postDiff =  obj.posts.screenLPost;
		
		}else{
			var postDiff = obj.posts.screenRPost;
		}

		if(distanceFromCenter < postDiff){

			return true;

		}else{

			return false;

		}

	};


	this.getBallSteps = function(mode){

		var ts =  obj.world.dToPosts/obj.world.flightFrames;
		
		var curBallLenght = obj.ballLenghtAtX(ts*obj.ball.curFF);
		var curBallWidth = curBallLenght*obj.world.ballHfactor;

		// get current vertical
		var curBallV =  obj.getTradScreenV(ts*obj.ball.curFF,obj.getBallHeightAtX(ts*obj.ball.curFF));

		// get currnet horisontal

		var curBallH = obj.getTradScreenH(ts*obj.ball.curFF);

		obj.ball.curX = curBallH;
		obj.ball.curY = curBallV;

		if(!obj.inflight){

			obj.ball.teebase = (curBallV + (curBallLenght/2));
			obj.ball.teeWidth = (curBallLenght/2)/2;
		
		}

		obj.drawTee();

		obj.drawBall(curBallH, curBallV, curBallLenght);

		if(mode == 0){
			obj.inflight = false;
		}



		

	}

	this.drawBall = function(h,v,ballL){

		var curState;

		context.save();

		context.translate(h,v);

		var ballAngle = obj.ball.gAngle;

		if(obj.ball.gDir > 0){

			ballAngle = ballAngle*-1;

		}

		context.rotate(ballAngle * Math.PI/180);	

		if(obj.ball.state > 0){

			curState = 0.7;
			obj.ball.state = 0;

		}else{

			curState = 1;
			obj.ball.state = 1;

		}

		context.scale(obj.world.ballHfactor, curState);	

		context.beginPath();
      	context.arc(0, 0, ballL/2, 0, 2 * Math.PI, false);	

		var grd = context.createRadialGradient((ballL/2)*-0.8,(ballL/2)*-0.8, ((ballL/2)/10), 0,0, (ballL/2)*2);
		// light blue
		grd.addColorStop(0, '#eee');

		// dark blue
		grd.addColorStop(1, '#666');
		
		context.fillStyle = grd;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = '#999';
		context.stroke();


		context.beginPath();
		context.moveTo(0, 0-(ballL/2));
		context.lineTo(0, 0+(ballL/2));
		context.stroke();

		context.restore();

	};

	this.showIndicator = function(){

		obj.drawIndicator();

		kickDisabled = false;
		

	};

	this.drawIndicator = function(){


		var indicatorColor = 'red'

		if(obj.ball.hitV && obj.ball.hitH) {

			indicatorColor = 'white';

			context.beginPath();
	      	context.arc(obj.indicator.x, obj.indicator.y, obj.indicator.radius, 0, 2 * Math.PI, false);	
	      	context.strokeStyle = indicatorColor;
	      	context.lineWidth = 2;
	      	context.fillStyle = indicatorColor;
		    context.fill();
	      	context.stroke();
	      	

	      	context.beginPath();
	      	context.arc(obj.indicator.x, obj.indicator.y, obj.indicator.radius*4, 0, 2 * Math.PI, false);
	      	context.strokeStyle = indicatorColor;
	      	context.lineWidth = 4;
	      	context.stroke();

	      	context.beginPath();
	      	context.arc(obj.indicator.x, obj.indicator.y, obj.indicator.radius*8, 0, 2 * Math.PI, false);
	      	context.lineWidth = 8;
	      	context.strokeStyle = indicatorColor;
	      	context.stroke();	

		}else{

			context.beginPath();
			context.moveTo(obj.indicator.x-(obj.indicator.radius*8), obj.indicator.y-(obj.indicator.radius*8));
			context.lineTo(obj.indicator.x+(obj.indicator.radius*8), obj.indicator.y+(obj.indicator.radius*8));
			context.lineWidth = 8;
	      	context.strokeStyle = indicatorColor;
			context.stroke();

			context.beginPath();
			context.moveTo(obj.indicator.x-(obj.indicator.radius*8), obj.indicator.y
				+(obj.indicator.radius*8));
			context.lineTo(obj.indicator.x+(obj.indicator.radius*8), obj.indicator.y-(obj.indicator.radius*8));
			context.lineWidth = 8;
	      	context.strokeStyle = indicatorColor;
			context.stroke();

		}

		obj.kickResult();

		obj.ball.hitV = false;
		obj.ball.hitH = false;

		

	}

	this.kickResult = function(){

		obj.score.totalKicks ++;

		var resTxt = "MISS!";

		if(obj.ball.hitV && obj.ball.hitH){

			resTxt = "GOAL!";

			obj.score.totalOver ++;

		}

		$('#result_container').html("<h2>"+resTxt+"</h2>");

		$("#result_container").fadeIn(200,function(){

			$("#result_container").delay(500).fadeOut(200);

		});

		$("#score-fraction").html(obj.score.totalOver+"/"+obj.score.totalKicks);

		var hitPercent = Math.ceil((obj.score.totalOver/obj.score.totalKicks)*100);

		$('#score-percent').html(""+hitPercent+"");

	};

	this.getBallHeightAtX = function(x){

		var vX = obj.ball.speed * Math.cos(obj.ball.angle * Math.PI/180);
		//$.logThis("Velocity X :> "+vX);
		
		var vY = obj.ball.speed * Math.sin(obj.ball.angle * Math.PI/180);
		//$.logThis("Velocity Y :> "+vY);

		var hAtX = ((x * vY)/vX) - (0.5 * obj.ball.gravity * (Math.pow(x,2)/Math.pow(vX,2)));

		return hAtX;

	};



	this.getTradScreenV = function(d,ht){

	 	var cameraToBall = d + obj.world.dToScreen + obj.world.dSceenToBall;

		var heightOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var ballProjYFactor = (obj.world.cameraHeight-ht)/heightOfFovAtBall;

		var topBallScreenY;

		if(ballProjYFactor < 0){

			ballScreenY = (obj.worldHeight/2) - ((obj.worldHeight/2)*(ballProjYFactor*-1));

		}else{

			ballScreenY = (obj.worldHeight/2) + ((obj.worldHeight/2)*ballProjYFactor);

		}

		return ballScreenY;

	};

	this.getTradScreenH = function(d){

		var cameraToBall = d + obj.world.dToScreen + obj.world.dSceenToBall;

		//var cameraToBall = d;

		var wind = obj.world.windFactor*obj.ball.curFF;

		//obj.ball.gAngle = 8;

		var hX = Math.tan(obj.ball.gAngle * Math.PI/180)*d;

		var widthOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var hXFactor = hX/(widthOfFovAtBall/2);

		var ballScreenH;

		if(obj.ball.gDir > 0){

			ballScreenH = obj.midX - (obj.midX*hXFactor);

		}else{

			ballScreenH = obj.midX + (obj.midX*hXFactor);

		}

		return ballScreenH+wind;

	};


	this.ballLenghtAtX = function(d){

		var cameraToBall = d + obj.world.dToScreen + obj.world.dSceenToBall;

		var heightOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var ballHeightFovFactor = obj.world.balllength/heightOfFovAtBall;

		var ballLenght = (obj.worldHeight/2)*ballHeightFovFactor;

		return ballLenght;

	};

	this.launchKick = function(ev){
	
		if(!obj.inflight){

			obj.inflight = true; 

			var velocityFactor;

		    obj.ball.gDir = 0;
		    var gestureAngle = 0;

		    if(ev.angle < 0){
		    	gestureAngle = ev.angle*-1;
			}else{
				 gestureAngle = ev.angle;
			}

			if(gestureAngle > 90){

				gestureAngle = gestureAngle-90;
				obj.ball.gDir = 1;

			}else{
				gestureAngle = 90-gestureAngle;
			} 

			if(gestureAngle > 50){
				gestureAngle = 50;
			}

			obj.ball.gAngle = gestureAngle;

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

		    obj.ball.speed = Number(velocityFactor)*obj.world.vfactor;

			obj.gameLoop();

			
		}else{


		}

	}

	this.runTimer = function(){

		$('#time-secs').html(obj.level.curtime);

		var timer = setTimeout(function(){

			obj.updateTime();

		},1000);

	}

	this.updateTime = function(){

		obj.level.curtime--;

		if(obj.level.curtime > 0){

			$('#time-secs').html(obj.level.curtime);

	      	obj.runTimer(obj.level.curtime);
	    
		}else{

			$('#time-secs').html("END");

			var scoreFraction = obj.score.totalOver/obj.score.totalKicks;

			var hitPercent = Math.ceil(scoreFraction*100);

			var multiplier = "0";

			if(scoreFraction >= obj.level.stage1 && scoreFraction < obj.level.stage2){

				multiplier = obj.level.multi1;

				obj.level.levelScore = obj.score.totalOver * obj.level.multi1;

			}else if(scoreFraction >= obj.level.stage2 && scoreFraction < obj.level.stage3){

				multiplier = obj.level.multi2;

				obj.level.levelScore = obj.score.totalOver * obj.level.multi2;

			}else if(scoreFraction >= obj.level.stage3 && scoreFraction < obj.level.stage4){

				multiplier = obj.level.multi3;

				obj.level.levelScore = obj.score.totalOver * obj.level.multi3;

			}else if(scoreFraction == obj.level.stage4){

				multiplier = obj.level.multi4;

				obj.level.levelScore = obj.score.totalOver * obj.level.multi4;

			}else{

				obj.level.levelScore = obj.score.totalOver;

			}

			obj.score.curScore += obj.level.levelScore;

			$("#total-score").html(""+obj.score.curScore+"");

			$(".total").show();

			$("#endLevel").show().html("<h2>NICE!</h2><p>You got : "+obj.score.totalOver+"/"+obj.score.totalKicks+"<br />@ "+hitPercent+"%<br />x "+multiplier+"<br />Level score: "+obj.level.levelScore+"<br />Total score: "+obj.score.curScore+"</p><button class ='next_btn'>Continue >></button>");


			$('.next_btn').on('click',function(){

				if(obj.world.curView == 1){

					obj.world.curView = 2;
					obj.posts.sideDiff = 500;

				}else{

					obj.world.curView = 1;
					obj.posts.sideDiff = 0;

				}

				obj.resetLevel();

			});

		}

	}

	this.resetLevel = function(){

		obj.level.levelScore = 0;
		obj.level.curtime = 60;
		obj.score.totalOver = 0;
		obj.score.totalKicks = 0;
		obj.ball.curFF = 0;
		obj.ball.state = 0;

		$('.bg').hide();
		$('#bg'+obj.world.curView).show();

		$("#endLevel").html("").hide();

		$("#score-fraction").html(obj.score.totalOver+"/"+obj.score.totalKicks);

		var hitPercent = Math.ceil((obj.score.totalOver/obj.score.totalKicks)*100);

		$('#score-percent').html(""+hitPercent+"");

		obj.runTimer();

		obj.wipeCanvas();

		obj.drawWorld();


	};

	//game loop
	this.gameLoop = function() {
		
		if(obj.inflight){
			
			obj.wipeCanvas();
			obj.refreshWorld();
	
			var gameInterval = setTimeout(obj.gameLoop, 1000 / 30);

		}else{

			obj.showIndicator();

		}
	  
	}

	
}