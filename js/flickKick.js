/*
WARRIORS FLICK KICK OBJECT
AUTHOR: FRAZER CAMERON @pixelgiantnz NZME
VERSION 1.01
*/

var canvas,context;

function flickKick(){

	var obj = this;

	this.paused = true;

	this.world = {

		postHeight:500,
		barheight:200,
		postWidth:250,
		dToPosts:700,
		cameraHeight:30,
		fovAddedMaxHtAtPosts:200,
		gravity:30,
		pitchAngle:60,
		dToScreen:30,
		dSceenToBall:15,
		balllength:15,
		ballWidth:10,
		flightFrames:40,
		vfactor:60

	};

	this.tradBallImageObj = new Image();

	this.ball = {

		speed:180,
		angle:50,
		gravity:30,
		gAngle:0,
		gDir:0,
		curFF:0,
		state:0

	};

	this.postImageObj = new Image();

	this.posts = {

		postsScreenWidth:0,
		topPostsScreenY:0,
		postsScreenHeight:0

	};
	

	this.createGame = function(w,ht){

		obj.canvasWidth = w;
		obj.canvasheight = ht;
		obj.worldHeight = obj.canvasheight;
		obj.worldWidth = obj.worldHeight;

		obj.postImageObj.src = 'img/posts.png';
		obj.tradBallImageObj.src = 'img/ball_default.png';

		$.logThis("Create game : width :> "+w+" :: height :> "+ht);

		$('#game_container').html("<canvas width='"+w+"' height = '"+ht+"' id = 'game_stage'/>");

		obj.midX = w/2;

		obj.world.ballHfactor = obj.world.ballWidth/obj.world.balllength;

		obj.world.fov = (Math.atan((obj.world.fovAddedMaxHtAtPosts+(obj.world.postHeight-obj.world.cameraHeight))/(obj.world.dToPosts+obj.world.dToScreen+obj.world.dSceenToBall)))/(Math.PI/180);

		$.logThis("fov :> "+obj.world.fov);

		canvas = document.getElementById('game_stage');
		context = canvas.getContext('2d');

		obj.drawWorld();


	};

	//wipe canvas -- 
	this.wipeCanvas = function() {
	
		context.clearRect(0,0,obj.canvasWidth,obj.canvasheight);	
		
	};

	this.drawWorld = function(){

		var cameraToPosts = obj.world.dToPosts + obj.world.dSceenToBall + obj.world.dToScreen;

		var heightOfFovAtPosts = Math.tan(obj.world.fov * Math.PI/180)*cameraToPosts;

		var topPostsProjY = (obj.world.postHeight-obj.world.cameraHeight)/heightOfFovAtPosts;

		obj.posts.topPostsScreenY = (obj.worldHeight/2) - ((obj.worldHeight/2)*topPostsProjY);

		var bottomPostsProY = obj.world.cameraHeight/heightOfFovAtPosts;

		var bottomPostsScreenY = (obj.worldHeight/2) + ((obj.worldHeight/2)*bottomPostsProY);

		obj.posts.postsScreenHeight = bottomPostsScreenY-obj.posts.topPostsScreenY;

		obj.posts.postsScreenWidth = obj.posts.postsScreenHeight * postsHFactor;

		obj.postImageObj.onload = function() {

			context.drawImage(obj.postImageObj, obj.midX-(obj.posts.postsScreenWidth/2), obj.posts.topPostsScreenY,obj.posts.postsScreenWidth,obj.posts.postsScreenHeight);

			obj.getBallSteps();

		};

		//obj.drawBall();
		

	};

	this.refreshWorld = function(){

		context.drawImage(obj.postImageObj, obj.midX-(obj.posts.postsScreenWidth/2), obj.posts.topPostsScreenY,obj.posts.postsScreenWidth,obj.posts.postsScreenHeight);

		obj.getBallTrad();

	};

	this.getBallTrad = function(){

		if(obj.ball.curFF < obj.world.flightFrames){
		
			obj.getBallSteps();
			obj.ball.curFF++;

		}else{

			obj.ball.curFF = 0;
			obj.ball.state = 0;
			obj.getBallSteps();
			obj.paused = true;

		}

	};

	this.getBallSteps = function(){

		var ts =  obj.world.dToPosts/obj.world.flightFrames;
		
		var curBallLenght = obj.ballLenghtAtX(ts*obj.ball.curFF);
		var curBallWidth = curBallLenght*obj.world.ballHfactor;

		// get current vertical
		var curBallV =  obj.getTradScreenV(ts*obj.ball.curFF,obj.getBallHeightAtX(ts*obj.ball.curFF));

		// get currnet horisontal

		var curBallH = obj.getTradScreenH(ts*obj.ball.curFF);

		//$.logThis("cur H :> "+curBallH);
		//var curBallH = obj.midX-(curBallWidth/2);

		//context.drawImage(obj.tradBallImageObj, curBallH, curBallV,curBallWidth, curBallLenght);

		obj.drawBall(curBallH, curBallV, curBallLenght);

		

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

      	//context.restore();

		var grd = context.createRadialGradient((ballL/2)*-0.8,(ballL/2)*-0.8, ((ballL/2)/10), 0,0, (ballL/2)*2);
		// light blue
		grd.addColorStop(0, '#eee');

		// dark blue
		grd.addColorStop(1, '#666');
		//grd.addColorStop(1, '#000');

		//context.fillStyle = '#ddd';
		context.fillStyle = grd;
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = '#999';
		context.stroke();

		//context.translate(h,v);
		//context.rotate(ballAngle * Math.PI/180);
		//context.scale(obj.world.ballHfactor, 0.7);

		//context.restore();

		context.beginPath();
		context.moveTo(0, 0-(ballL/2));
		context.lineTo(0, 0+(ballL/2));
		context.stroke();

		context.restore();

	}

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

		var hX = Math.tan(obj.ball.gAngle * Math.PI/180)*d;

		var widthOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var hXFactor = hX/widthOfFovAtBall;

		var ballScreenH;

		if(obj.ball.gDir > 0){

			ballScreenH = obj.midX - (obj.midX*hXFactor);

		}else{

			ballScreenH = obj.midX + (obj.midX*hXFactor);

		}

		return ballScreenH;

	};

	this.ballLenghtAtX = function(d){

		var cameraToBall = d + obj.world.dToScreen + obj.world.dSceenToBall;

		var heightOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var ballHeightFovFactor = obj.world.balllength/heightOfFovAtBall;

		var ballLenght = (obj.worldHeight/2)*ballHeightFovFactor;

		return ballLenght;

	};

	this.launchKick = function(ev){

		//$.logThis("launch kick");
	
		if(obj.paused){

			obj.paused = false;

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

			$.logThis("gesture angle :> "+gestureAngle);

			if(gestureAngle > 35){
				gestureAngle = 35;
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


		   //tracePath();

			obj.gameLoop();
			
		}

	}

	//game loop
	this.gameLoop = function() {
		
		if(!obj.paused){
			
			obj.wipeCanvas();
			obj.refreshWorld();
	
			var gameInterval = setTimeout(obj.gameLoop, 1000 / 30);

		}else{

			$.logThis("ball flight ended");

		}
	  
	}

	
}