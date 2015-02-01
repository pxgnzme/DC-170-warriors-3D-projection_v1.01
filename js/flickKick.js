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
		fovAddedMaxHtAtPosts:150,
		gravity:30,
		pitchAngle:60,
		dToScreen:30,
		dSceenToBall:15,
		balllength:15,
		ballWidth:10

	};

	this.createGame = function(w,ht){

		obj.canvasWidth = w;
		obj.canvasheight = ht;
		obj.worldHeight = obj.canvasheight;
		obj.worldWidth = obj.canvasheight;

		$.logThis("Create game : width :> "+w+" :: height :> "+ht);

		$('#game_container').html("<canvas width='"+w+"' height = '"+ht+"' id = 'game_stage'/>");

		obj.midX = w/2;

		obj.world.ballHfactor = obj.world.ballWidth/obj.world.balllength;

		obj.world.fov = (Math.atan((obj.world.fovAddedMaxHtAtPosts+(obj.world.postHeight-obj.world.cameraHeight))/(obj.world.dToPosts+obj.world.dToScreen+obj.world.dSceenToBall)))/(Math.PI/180);

		$.logThis("fov :> "+obj.world.fov);

		obj.canvas = document.getElementById('game_stage');
		obj.context = obj.canvas.getContext('2d');

		obj.drawWorld();


	};

	this.drawWorld = function(){

		var cameraToPosts = obj.world.dToPosts + obj.world.dSceenToBall + obj.world.dToScreen;

		var heightOfFovAtPosts = Math.tan(obj.world.fov * Math.PI/180)*cameraToPosts;

		var topPostsProjY = (obj.world.postHeight-obj.world.cameraHeight)/heightOfFovAtPosts;

		var topPostsScreenY = (obj.worldHeight/2) - ((obj.worldHeight/2)*topPostsProjY);

		var bottomPostsProY = obj.world.cameraHeight/heightOfFovAtPosts;

		var bottomPostsScreenY = (obj.worldHeight/2) + ((obj.worldHeight/2)*bottomPostsProY);

		var postsScreenHeight = bottomPostsScreenY-topPostsScreenY;

		var postsScreenWidth = postsScreenHeight * postsHFactor;

		var postImageObj = new Image();

		postImageObj.onload = function() {

			obj.context.drawImage(postImageObj, obj.midX-(postsScreenWidth/2), topPostsScreenY,postsScreenWidth,postsScreenHeight);

		};

		postImageObj.src = 'img/posts.png';

		// DRAW BALL

		var cameraToBall = obj.world.dSceenToBall + obj.world.dToScreen;

		var heightOfFovAtBall = Math.tan(obj.world.fov * Math.PI/180)*cameraToBall;

		var topBallProjY = (obj.world.cameraHeight-obj.world.balllength)/heightOfFovAtBall;

		var topBallScreenY = (obj.worldHeight/2) + ((obj.worldHeight/2)*topBallProjY);

		var bottomBallProY = obj.world.cameraHeight/heightOfFovAtBall;

		var bottomBallScreenY = (obj.worldHeight/2) + ((obj.worldHeight/2)*bottomBallProY);

		var ballScreenHeight = bottomBallScreenY-topBallScreenY;


		var ballScreenWidth = obj.world.ballHfactor * ballScreenHeight;

		var ballImageObj = new Image();

		ballImageObj.onload = function() {

			obj.context.drawImage(ballImageObj, obj.midX-(ballScreenWidth/2), topBallScreenY,ballScreenWidth,ballScreenHeight);

		};

		ballImageObj.src = 'img/ball_default.png';

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