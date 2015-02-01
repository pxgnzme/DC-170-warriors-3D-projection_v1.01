/*
WARRIORS FLICK KICK OBJECT
AUTHOR: FRAZER CAMERON @pixelgiantnz NZME
VERSION 1.01
*/

function flickKick(){

	var obj = this;

	this.world = {

		postHeight:500,
		barheight:200,
		postWidth:250,
		dToPosts:700,
		cameraHeight:30,
		fovAddedMaxHtAtPosts:50,
		gravity:30,
		pitchAngle:60,
		dToScreen:30,
		dSceenToBall:30,
		balllength:30,
		ballWidth:20

	};

	this.createGame = function(w,ht){

		obj.canvasWidth = w;
		obj.canvasheight = ht;
		obj.worldHeight = obj.canvasheight;
		obj.worldWidth = obj.canvasheight;

		$.logThis("Create game : width :> "+w+" :: height :> "+ht);

		$('#game_container').html("<canvas width='"+w+"' height = '"+ht+"' id = 'game_stage'/>");

		obj.midX = w/2;

		

		//obj.world.dToScreen = 1/Math.tan((obj.world.fov * Math.PI/180)/2);

		//$.logThis("d :> "+obj.world.dToScreen);

		//Calculare ideal field of view angle (fov)

		obj.world.fov = (Math.atan((obj.world.fovAddedMaxHtAtPosts+(obj.world.postHeight-obj.world.cameraHeight))/(obj.world.dToPosts+obj.world.dToScreen+obj.world.dSceenToBall)))/(Math.PI/180);

		$.logThis("fov :> "+obj.world.fov);

		obj.canvas = document.getElementById('game_stage');
		obj.context = obj.canvas.getContext('2d');

		obj.drawWorld();


	};

	this.drawWorld = function(){

		

		var basePostsProjY = obj.world.cameraHeight * (obj.world.dToScreen/(obj.world.dToPosts+obj.world.dSceenToBall+obj.world.dToScreen));

		var topPostsProjY = (obj.world.postHeight - obj.world.cameraHeight) * (obj.world.dToScreen/(obj.world.dToPosts+obj.world.dSceenToBall)) *-1;

		var basePostSceenY = (obj.worldHeight/2)+((obj.worldHeight/2)*basePostsProjY);

		var topPostSceenY = (obj.worldHeight/2)+((obj.worldHeight/2)*topPostsProjY);

		var postsHt = basePostSceenY - topPostSceenY;

		$.logThis("projected posts base :> "+basePostsProjY);

		var imageObj = new Image();

		imageObj.onload = function() {

			obj.context.drawImage(imageObj, obj.midX-((postsHFactor*postsHt)/2), topPostSceenY,postsHFactor*postsHt,postsHt);

		};

		imageObj.src = 'img/posts.png';

		//draw ball

		var halfFov = obj.world.fov/2;

		$.logThis("half fov :> "+halfFov);

		var distanceToBall = obj.world.dToScreen + obj.world.dSceenToBall;

		$.logThis("distanceToBall :> "+distanceToBall);

		var fullFOV = Math.tan(halfFov * Math.PI/180)*distanceToBall;

		//var fullFovHAtBall =  Math.tan((obj.world.fov * Math.PI/180)/2)*(obj.world.dSceenToBall+obj.world.dToScreen);

		$.logThis("fullFOV  :> "+fullFOV );

		var baseBallProjY = obj.world.cameraHeight * (obj.world.dToScreen/(obj.world.dSceenToBall+obj.world.dToScreen));

		$.logThis("base ball Y :> "+baseBallProjY);

		var baseBallSceenY = (obj.worldHeight/2)+((obj.worldHeight/2)*baseBallProjY);

		$.logThis("base ball Y screen :> "+baseBallSceenY);

		/*var baseBallProjY = obj.world.cameraHeight * (obj.world.dToScreen/obj.world.dSceenToBall);

		var topBallProjY = (obj.world.balllength - obj.world.cameraHeight) * (obj.world.dToScreen/obj.world.dSceenToBall);

		var baseBallSceenY = (obj.worldHeight/2)+((obj.worldHeight/2)*baseBallProjY);

		var topBallSceenY = (obj.worldHeight/2)+((obj.worldHeight/2)*topBallProjY);

		var ballHt = baseBallProjY - topBallProjY;
		var ballWidth = (obj.world.ballWidth/obj.world.balllength)*ballHt;

		var ballImageObj = new Image();

		ballImageObj.onload = function() {

			obj.context.drawImage(ballImageObj, obj.midX-(ballWidth/2), topBallSceenY,ballWidth,obj.world.ballHt);

			//obj.context.drawImage(ballImageObj, 0, 0,20,30);

		};

		ballImageObj.src = 'img/ball_default.png';*/


	};

	/*this.resizeGame = function(w,ht){

		//obj.canvas.clearRect(0, 0, w, ht);

		//obj.createGame(w,ht);

	};*/

	/*this.clearCanvas = function(w,ht){

		//var ct = obj.canvas;
		//obj.canvas.clearRect(0, 0, w, ht);

		//$.logThis("clear :: ct :> "+obj.canvas);

		obj.canvas.clearRect(0, 0, w, ht);

	}*/
	
}