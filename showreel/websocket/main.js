(function() {
	'use strict';

	window.requestAnimFrame = (function(){
		return	window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function(callback, element){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	
	let width=600, height=400,
		socket,
		uid,
		players = {}, isPlayer = false, isMaster = false,
		leftPaddle, rightPaddle, activePaddle = null,
		canvas, ctx,
		ball,
		Tau=Math.PI*2;
		/*px=width*.5, py=height*.5,*/

	const	MOVE = 'move',
			PLAYER = 'player',
			JOIN = 'join',
			POLL_ACTIVE_PLAYERS = 'pollPlayers',
			LEFT_PADDLE_ID = 'left',
			RIGHT_PADDLE_ID = 'right';

	let KEY_UP = 38,
		KEY_DOWN = 40,
		keysDown = {};
	
	function createCanvas(id, w, h) {
		var tCanvas = document.createElement('canvas');
		tCanvas.width = w;
		tCanvas.height = h;
		tCanvas.id = id;
		return tCanvas;
	}
	
	function setUpEvents(){
		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}
		/*canvas.addEventListener('mousemove', function(evt) {
			var mousePos = getMousePos(canvas, evt);
			moveBall(mousePos.x, mousePos.y);
			// sendMessage({ state:MOVE, x:px, y:py });
		}, false);
*/
		// document.addEventListener('keydown', (evt) => console.log(evt.keyCode));
		document.addEventListener('keydown', (evt) => keysDown[evt.keyCode] = true);
		document.addEventListener('keyup', (evt) => delete keysDown[evt.keyCode]);
	}
	
	// Check the socket state and update status field accordingly.
	setInterval(function() {
	// console.log(socket.readyState);
	// if (socket.readyState === 0) statusMessage.textContent = "Connecting...";
	// if (socket.readyState === 1) statusMessage.textContent = "Connected";
	// if (socket.readyState === 2) statusMessage.textContent = "Closing...";
	// if (socket.readyState === 3) statusMessage.textContent = "Disconnected";
	}, 1000);
	
	function setupWebSocket(){
		socket = new WebSocket("wss://node2.wsninja.io");
		socket.addEventListener('open', function(event) {
			sendMessage({ guid: 'f5eb085b-e187-4850-b260-3889aca6b3ff' });
		});
		socket.addEventListener('message', function(event) {
			receiveMessage(JSON.parse(event.data));
		});
	}
	
	function sendMessage(msg){
		// console.log('sendMessage', msg.state)
		socket.send(JSON.stringify(msg));
	}
	
	function receiveMessage(msg){
		// console.log(msg)
		if(msg.accepted){
			uid = Date.now();
			addPlayer(uid);
			sendMessage({ state:JOIN, uid:uid });
		}
		
		switch(msg.state){
			case MOVE:
				if(msg.paddleID === LEFT_PADDLE_ID){
					leftPaddle.y = msg.paddleY;
				}
				else if(msg.paddleID === RIGHT_PADDLE_ID){
					rightPaddle.y = msg.paddleY;
				}
				if(!isMaster){
					ball.x = msg.ballX;
					ball.y = msg.ballY;
				}
				break;
			case JOIN:
				// reset list before POLL to ensure only active members
				resetPlayerList();
				// then let all memebers know your id
				sendMessage({ state:POLL_ACTIVE_PLAYERS, uid:uid });
				break;
			case POLL_ACTIVE_PLAYERS:
				addPlayer(msg.uid);
				break;
			default:
				// console.log('Unhandled message:', msg);
		}
	}
	
	function addPlayer(id){
		players[id] = id;
		checkIsPlayer();
	}


	function resetPlayerList(){
		/* Ensure only active players are in list */
		players = {};
		addPlayer(uid);
	}

	function checkIsPlayer(){
		let active = 0;
		for(let player in players){
			if(players[player] < uid) active++;
		}
		if(active < 2){
			isPlayer = true;
			if(active === 0){
				activePaddle = leftPaddle;
				rightPaddle.activate(false);
				isMaster = true;
			}
			else{
				activePaddle = rightPaddle;
				leftPaddle.activate(false);
				isMaster = false;
			}
			activePaddle.activate(true);
		}
		else{
			isPlayer = false;
			leftPaddle.activate(false);
			rightPaddle.activate(false);
		}
	}

	function update(){
		if(isPlayer){
			if(keysDown[KEY_DOWN]){
				activePaddle.y += activePaddle.speed;
			}
			if(keysDown[KEY_UP]){
				activePaddle.y -= activePaddle.speed;
			}
			activePaddle.checkBounds();

			if(isMaster){
				ball.update();
			}

			sendMessage({ state:MOVE, ballX:ball.x, ballY:ball.y, paddleID:activePaddle.id, paddleY:activePaddle.y });
		}
		draw();
	}
	
	function draw(){
		ctx.clearRect(0,0,width, height);

		ctx.fillStyle = ball.colour;
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Tau);
		ctx.fill();

		ctx.fillStyle = leftPaddle.colour;
		ctx.beginPath();
		ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.length);

		ctx.fillStyle = rightPaddle.colour;
		ctx.beginPath();
		ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.length);
	}

    function animate(){
        update();
        draw();
        requestAnimFrame(animate);
    }
	
	function init(){
		canvas = createCanvas('stage', width, height);
		document.getElementById('stage').appendChild(canvas);
		ctx = canvas.getContext('2d');
		ctx.fillStyle = '#ff4500';

		leftPaddle = new Paddle(LEFT_PADDLE_ID, true, 20, 170, height);
		rightPaddle = new Paddle(RIGHT_PADDLE_ID, false, 585, 170, height);

		ball = new Ball(width*.5, height*.5, 10, width, height, leftPaddle, rightPaddle);

		setUpEvents();
		setupWebSocket();
		animate();

		ball.start();
	}

/* PADDLES */
	let Paddle = function(id, left, x, y, height){
		Object.defineProperty(this, 'id', { value:id, writable:true} );
		Object.defineProperty(this, 'isLeft', { value:left, writable:true} );
		Object.defineProperty(this, 'isActive', { value:false, writable:true} );
		Object.defineProperty(this, 'x', { value:x, writable:true} );
		Object.defineProperty(this, 'y', { value:y, writable:true} );
		Object.defineProperty(this, 'width', { value:10, writable:true} );
		Object.defineProperty(this, 'length', { value:70, writable:true} );
		Object.defineProperty(this, 'height', { value:height, writable:true} );
		Object.defineProperty(this, 'maxY', { value:this.height - this.length, writable:true} );
		Object.defineProperty(this, 'speed', { value:3, writable:true} );
		Object.defineProperty(this, 'rebound', { value:this.speed*3, writable:true} );
		Object.defineProperty(this, 'colour', { value:'#dddddd', writable:true} );
		Object.defineProperty(this, 'baseColour', { value:this.colour, writable:true} );
		Object.defineProperty(this, 'activeColour', { value:'#aaffaa', writable:true} );
		Object.defineProperty(this, 'paddleHitX', { value:x, writable:true} );
		if(this.isLeft){
			this.paddleHitX = this.x+this.width;
		}
	}
	Paddle.prototype.activate = function(bool){
		this.isActive = bool;
		this.colour = this.isActive ? this.activeColour : this.baseColour;
	}
	Paddle.prototype.checkBounds = function(){
		if(this.y < 0) this.y = this.rebound;
		if(this.y > this.maxY) this.y = this.maxY-this.rebound;
	}

/* BALL */
	let Ball = function(x,y,radius,w,h,p1,p2){
		Object.defineProperty(this, 'x', { value:x, writable:true} );
		Object.defineProperty(this, 'y', { value:y, writable:true} );
		Object.defineProperty(this, 'w', { value:w, writable:true} );
		Object.defineProperty(this, 'h', { value:h, writable:true} );
		Object.defineProperty(this, 'radius', { value:radius, writable:true} );
		Object.defineProperty(this, 'colour', { value:'#ff4500', writable:true} );
		Object.defineProperty(this, 'speed', { value:5, writable:true} );
		Object.defineProperty(this, 'running', { value:false, writable:true} );
		Object.defineProperty(this, 'leftPaddle', { value:p1, writable:true} );
		Object.defineProperty(this, 'rightPaddle', { value:p2, writable:true} );
	}
	Ball.prototype.start = function(){
		this.running = true;
		this.vx = this.speed;
		if(Math.random() < .5) this.vx *= -1;
		this.vy = Math.random()*(this.speed*.5)-this.speed;
	}
	Ball.prototype.stop = function(){
		this.running = false;
		this.reset();
	}
	Ball.prototype.reset = function(){
		this.x = this.w * .5;
		this.y = this.h * .5;
	}
	Ball.prototype.update = function(){
		if(!this.running) return;

		this.x += this.vx;
		this.y += this.vy;

		if(this.x < this.leftPaddle.paddleHitX){
			if(this.y < this.leftPaddle.y || this.y > this.leftPaddle.y+this.leftPaddle.height){
				console.log('Explode!')
				this.stop();
			}
			else{
				this.x = this.leftPaddle.paddleHitX;
				this.vx *= -1;
			}
		}
		else if(this.x > this.w){
			this.x = this.w;
			this.vx *= -1;
		}
		if(this.y < 0){
			this.y = 0;
			this.vy *= -1;
		}
		else if(this.y > this.h){
			this.y = this.h;
			this.vy *= -1;
		}
	}
	
/* KICK OFF */
	init();
	
}());