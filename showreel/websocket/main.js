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
		messageWindow = document.getElementById('message'),
		socket, socketUID,
		uid,
		countDownCount,
		players = {}, isPlayer = false, isPlayer1 = false,
		leftPaddle, rightPaddle, activePaddle = null,
		keysDown = {},
		canvas, ctx,
		ball,
		scoreP1 = document.getElementById('p1'),
		scoreP2 = document.getElementById('p2'),
		pointsP1 = 0, pointsP2 = 0,
		Tau=Math.PI*2;

	const	MOVE = 'move',
			PLAYER = 'player',
			JOIN = 'join',
			START = 'start',
			SCORE = 'score',
			STATUS_MESSAGE = 'ready',
			POLL_ACTIVE_PLAYERS = 'pollPlayers',
			LEFT_PADDLE_ID = 'left',
			RIGHT_PADDLE_ID = 'right',
			KEY_UP = 38,
			KEY_DOWN = 40;
	
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
		document.addEventListener('keydown', (evt) => keysDown[evt.keyCode] = true);
		document.addEventListener('keyup', (evt) => delete keysDown[evt.keyCode]);
	}
	
	
/* SOCKETS */
	function setupWebSocket(){
		// socket = new WebSocket("wss://node2.wsninja.io");ws://achex.ca:4010
		socket = new WebSocket("ws://achex.ca:4010");

		socket.onmessage = function(event){
			// console.log('received: ' + event.data, event.data);
			receiveMessage(JSON.parse(event.data));
		}; // add event handler for incomming message
	
		socket.onclose = function(event){
			console.log('log: Diconnected');
		}; // add event handler for diconnection 
	
		socket.onerror = function(event){
			console.log('log: Error');
		}; // add event handler for error 
	
		socket.onopen = function(event){
			console.log('log: Connected', event);
		};// add event handler for new connection 




		/* socket.addEventListener('open', function(event) {
			// sendMessage({ guid: 'f5eb085b-e187-4850-b260-3889aca6b3ff' });
		});
		socket.addEventListener('message', function(event) {
			receiveMessage(JSON.parse(event.data));
		}); */
	}
	
	function sendMessage(msg){
		console.log('sending...', msg);
		socket.send(JSON.stringify(msg));
	}
	
	function receiveMessage(message){
		console.log('received;', message, message.SID);
		
		if(message.SID != undefined && socketUID === undefined){
			socketUID = message.SID;
			uid = Date.now();
			// addPlayer(uid);
			console.log('socketUID: ' + socketUID);
			sendMessage({"setID":String(uid), "passwd":String(uid)});
		}

		/* if(message.accepted){
			uid = Date.now();
			addPlayer(uid);
			sendMessage({ state:JOIN, uid:uid });
		}
		
		switch(message.state){
			case MOVE:
				if(message.paddleID === LEFT_PADDLE_ID){
					leftPaddle.y = message.paddleY;
				}
				else if(message.paddleID === RIGHT_PADDLE_ID){
					rightPaddle.y = message.paddleY;
				}
				if(!isPlayer1){
					ball.x = message.ballX;
					ball.y = message.ballY;
				}
				break;
			case JOIN:
				// reset list before POLL to ensure only active members
				resetPlayerList();
				// then let all memebers know your id
				sendMessage({ state:POLL_ACTIVE_PLAYERS, uid:uid });
				break;
			case POLL_ACTIVE_PLAYERS:
				addPlayer(message.uid);
				break;
			case STATUS_MESSAGE:
				setStatusMessage(message.msg, false);
				break;
			case SCORE:
				setScore(message.playerID);
				break;
			default:
				// console.log('Unhandled message:', msg);
		} */
	}

	// Socket state heartbeat
	/*setInterval(function() {
		console.log(socket.readyState);
		if (socket.readyState === 0) statusMessage.textContent = "Connecting...";
		if (socket.readyState === 1) statusMessage.textContent = "Connected";
		if (socket.readyState === 2) statusMessage.textContent = "Closing...";
		if (socket.readyState === 3) statusMessage.textContent = "Disconnected";
	}, 1000);*/
	
/* PLAYERS */
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
		let active = 0, playerCount = 0;
		for(let player in players){
			playerCount++;
			if(players[player] < uid) active++;
		}
		if(active < 2){
			isPlayer = true;
			if(active === 0){
				activePaddle = leftPaddle;
				rightPaddle.activate(false);
				isPlayer1 = true;
			}
			else{
				activePaddle = rightPaddle;
				leftPaddle.activate(false);
				isPlayer1 = false;
			}
			activePaddle.activate(true);
		}
		else{
			isPlayer = false;
			leftPaddle.activate(false);
			rightPaddle.activate(false);
		}

		// console.log(isPlayer1, playerCount)
		if(playerCount >= 1 && isPlayer1){
			countDownStart();
		}
	}

	function countDownStart(){
		countDownCount = 4;
		setStatusMessage('ready', true);
		runCountDown();
	}
	
	function runCountDown(){
		setTimeout(function() {
			if(--countDownCount <= 0){
				setStatusMessage('', true);
				ball.start();
			}
			else{
				setStatusMessage(countDownCount, true);
				runCountDown();
			}
		}, 1000);
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

			if(isPlayer1){
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

/* MESSAGING */
	function setStatusMessage(msg, forward){
		if(forward){
			sendMessage({state:STATUS_MESSAGE, msg:msg});
		}
		messageWindow.innerHTML = msg;
	}
	function setScore(playerID){
		//
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
		Object.defineProperty(this, 'vx', { value:0, writable:true} );
		Object.defineProperty(this, 'vy', { value:0, writable:true} );
		Object.defineProperty(this, 'radius', { value:radius, writable:true} );
		Object.defineProperty(this, 'colour', { value:'#fff', writable:true} );
		Object.defineProperty(this, 'speed', { value:5, writable:true} );
		Object.defineProperty(this, 'running', { value:false, writable:true} );
		Object.defineProperty(this, 'leftPaddle', { value:p1, writable:true} );
		Object.defineProperty(this, 'rightPaddle', { value:p2, writable:true} );
	}
	Ball.prototype.start = function(){
		this.running = true;
		this.vx = this.speed;
		if(Math.random() < .5) this.vx *= -1;
		// this.vy = Math.random()*(this.speed*.5)-this.speed; // Commented out to force easy horizontal play
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
			if(this.y < this.leftPaddle.y || this.y > this.leftPaddle.y+this.leftPaddle.length){
				console.log('Explode!')
				// setScore()
				// countDownStart();
				this.stop();
			}
			else{
				this.x = this.leftPaddle.paddleHitX;
				this.vx *= -1;
			}
		}
		else if(this.x > this.rightPaddle.paddleHitX){
			// console.log(this.y, this.rightPaddle.y, this.rightPaddle.length)
			if(this.y < this.rightPaddle.y || this.y > this.rightPaddle.y+this.rightPaddle.length){
				console.log('Explode!')
				// countDownStart();
				this.stop();
			}
			else{
				this.x = this.rightPaddle.paddleHitX;
				this.vx *= -1;
			}
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
	}

	init();
	
}());