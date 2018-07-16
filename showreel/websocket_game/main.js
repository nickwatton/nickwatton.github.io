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

	const	JOIN = 'join',
			KEY_UP = 38,
			KEY_DOWN = 40,
			LEFT_PADDLE_ID = 'left',
			MOVE = 'move',
			POLL_ACTIVE_PLAYERS = 'pollActivePlayers',
			RIGHT_PADDLE_ID = 'right',
			SCORES = 'scores',
			STATUS_MESSAGE = 'ready',
			STOP = 'stop';
	
	let width=600, height=400, Tau=Math.PI*2,
		canvas, ctx,
		messageWindow = document.getElementById('message'),
		keysDown = {},
		socket, uid, isLoungeHost = false,
		players = {}, isPlayer = false,
		game, 
		countDownCount;

	let createCanvas = (id, w, h) => {
		var tCanvas = document.createElement('canvas');
		tCanvas.width = w;
		tCanvas.height = h;
		tCanvas.id = id;
		return tCanvas;
	},
	setUpEvents = () => {
		document.addEventListener('keydown', (evt) => keysDown[evt.keyCode] = true);
		document.addEventListener('keyup', (evt) => delete keysDown[evt.keyCode]);
	}
	
/* SOCKETS */
	let setupWebSocket = () => {
		socket = new WebSocket("wss://node2.wsninja.io");
		socket.addEventListener('open', function(event) {
			sendMessage({ guid: 'f5eb085b-e187-4850-b260-3889aca6b3ff' });
		});
		socket.addEventListener('message', function(event) {
			receiveMessage(JSON.parse(event.data));
		});
	},
	sendMessage = (msg) => {
		// console.log('sendMessage:', msg);
		socket.send(JSON.stringify(msg));
	},
	receiveMessage = (message) =>  {
		// console.log('receiveMessage:', message);
		if(message.accepted){
			uid = Date.now();
			addPlayer(uid);
			sendMessage({ state:JOIN, uid:uid });
			return;
		}
		switch(message.state){
			case JOIN:
				// reset list before POLL to ensure only active members
				resetPlayerList();
				// ensure self ID is recorded
				addPlayer(message.uid);
				// then let all members know your id
				sendMessage({ state:POLL_ACTIVE_PLAYERS, uid:uid });
				break;
			case MOVE:
				if(message.paddleID === LEFT_PADDLE_ID){
					game.paddleLeft.y = message.paddleY;
				}
				else if(message.paddleID === RIGHT_PADDLE_ID){
					game.paddleRight.y = message.paddleY;
				}
				if(!isLoungeHost){
					game.ball.x = message.ballX;
					game.ball.y = message.ballY;
				}
				break;
			case POLL_ACTIVE_PLAYERS:
				addPlayer(message.uid);
				break;
			case STATUS_MESSAGE:
				setStatusMessage(message.msg, false);
				break;
			case SCORES:
				console.log(message)
				game.scoreManager.updateScoreUI(message.score1, message.score2);
				break;
			case STOP:
				game.manageExplode(false);
				break;
			default:
				console.log('Unhandled message:', message);
		}
	}
	
/* PLAYERS */
	let addPlayer = (id) => {
		players[id] = id;
		checkPlayerStack();
	},
	resetPlayerList = () => {
		/* Ensure only active players are in list */
		players = {};
		addPlayer(uid);
	},
	checkPlayerStack = () => {
		let stackPosition = 0, playerCount = 0; 
		isPlayer = isLoungeHost = false;

		for(let player in players){
			playerCount++;
			if(players[player] < uid){
				stackPosition++;
			}
		}
		
		if(stackPosition === 0){
			isPlayer = true;
			isLoungeHost = true;
			game.activePaddle = game.paddleLeft;
		}
		else if(stackPosition === 1){
			isPlayer = true;
			game.activePaddle = game.paddleRight;
		}
		
		game.paddleLeft.activate(false);
		game.paddleRight.activate(false);
		if(isPlayer){
			game.activePaddle.activate(true);
		}

		if(playerCount < 2){
			setStatusMessage('Waiting for player 2 ', false);
		}
		else{
			setStatusMessage('Player ' + (stackPosition + 1) + ' ' + isPlayer, false);
		}

		if(isLoungeHost && !game.gameInPlay && playerCount >= 2){
			// console.log('countDownStart (gameInPlay?)', game.gameInPlay)
			countDownStart();
		}
	};

/* COUNTDOWN */
	let countDownStart = () => {
		countDownCount = 4;
		setStatusMessage('ready', true);
		runCountDown();
	},
	runCountDown = () => {
		setTimeout(function() {
			if(--countDownCount <= 0){
				setStatusMessage('', true);
				game.gameInPlay = true;
				game.ball.start();
				// console.log('gameInPlay?', game.gameInPlay)
			}
			else{
				setStatusMessage(countDownCount, true);
				runCountDown();
			}
		}, 1000);
	}

	let animate = () => {
        update();
        draw();
        requestAnimFrame(animate);
	},
	update = () => {
		if(isPlayer && game.gameInPlay){
			if(keysDown[KEY_DOWN]){
				game.activePaddle.y += game.activePaddle.speed;
			}
			if(keysDown[KEY_UP]){
				game.activePaddle.y -= game.activePaddle.speed;
			}
			game.activePaddle.checkBounds();

			if(isLoungeHost){
				game.ball.update();
			}

			sendMessage({ state:MOVE, ballX:game.ball.x, ballY:game.ball.y, paddleID:game.activePaddle.id, paddleY:game.activePaddle.y });
		}
		draw();
	},
	draw = () => {
		ctx.clearRect(0, 0, width, height);

		ctx.fillStyle = game.ball.colour;
		ctx.beginPath();
		ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Tau);
		ctx.fill();

		ctx.fillStyle = game.paddleLeft.colour;
		ctx.beginPath();
		ctx.fillRect(game.paddleLeft.x, game.paddleLeft.y, game.paddleLeft.width, game.paddleLeft.length);

		ctx.fillStyle = game.paddleRight.colour;
		ctx.beginPath();
		ctx.fillRect(game.paddleRight.x, game.paddleRight.y, game.paddleRight.width, game.paddleRight.length);
	};

/* MESSAGING */
	let setStatusMessage = (msg, forward) => {
		if(forward){
			sendMessage({state:STATUS_MESSAGE, msg:msg});
		}
		messageWindow.innerHTML = msg;
	},
	setScore = (playerID) => {
		//
	};

/* GAME */
	let Game = function(w, h){
		Object.defineProperty(this, 'activePaddle', { value:null, writable:true} );
		Object.defineProperty(this, 'ball', { value:null, writable:true} );
		Object.defineProperty(this, 'gameInPlay', { value:false, writable:true} );
		Object.defineProperty(this, 'h', { value:h, writable:true} );
		Object.defineProperty(this, 'paddleLeft', { value:null, writable:true} );
		Object.defineProperty(this, 'paddleRight', { value:null, writable:true} );
		Object.defineProperty(this, 'scoreManager', { value:null, writable:true} );
		Object.defineProperty(this, 'w', { value:w, writable:true} );
		//
		this.ball = new Ball(this.w * .5, this.h * .5, 10, this.w, this.h) ;
		this.paddleLeft = new Paddle(LEFT_PADDLE_ID, true, 5, this.h);
		this.paddleRight = new Paddle(RIGHT_PADDLE_ID, false, 585, this.h);
		this.scoreManager = new ScoreManager();
	}
	Game.prototype.manageExplode = function(forward){
		// console.log('Explode!', whichSide);
		game.gameInPlay = false;
		this.ball.stop();
		this.ball.reset();
		this.paddleLeft.reset();
		this.paddleRight.reset();
		if(forward){
			sendMessage({state:STOP});
		}
		countDownStart();
	}

/* SCORE MANAGER */
	let ScoreManager = function(){
		/* P1 is always on LEFT */
		Object.defineProperty(this, 'scoreElP1', { value:null, writable:true} );
		Object.defineProperty(this, 'scoreElP2', { value:null, writable:true} );
		Object.defineProperty(this, 'scoreP1', { value:0, writable:true} );
		Object.defineProperty(this, 'scoreP2', { value:1, writable:true} );
		Object.defineProperty(this, 'scoreValue', { value:1, writable:true} );
		this.scoreElP1 = document.getElementById('p1');
		this.scoreElP2 = document.getElementById('p2');
	}
	ScoreManager.prototype.updateScore = function(paddle){
		if(paddle === game.paddleLeft){
			this.scoreP2 += this.scoreValue;
		}
		else{
			this.scoreP1 += this.scoreValue;
		}
		this.updateScoreUI(this.scoreP1, this.scoreP2);
		this.broadcastScores();
	}
	ScoreManager.prototype.broadcastScores = function(){
		sendMessage({ state:SCORES, score1:this.scoreP1, score2:this.scoreP2 });
	}
	ScoreManager.prototype.updateScoreUI = function(p1, p2){
		this.scoreElP1.innerHTML = p1;
		this.scoreElP2.innerHTML = p2;
	}

/* PADDLES */
	let Paddle = function(id, isLeft, x, height){
		Object.defineProperty(this, 'activeColour', { value:'#aaffaa', writable:true} );
		Object.defineProperty(this, 'baseColour', { value:'#dddddd', writable:true} );
		Object.defineProperty(this, 'colour', { value:0, writable:true} );
		Object.defineProperty(this, 'id', { value:id, writable:true} );
		Object.defineProperty(this, 'height', { value:height, writable:true} );
		Object.defineProperty(this, 'isActive', { value:false, writable:true} );
		Object.defineProperty(this, 'isLeft', { value:isLeft, writable:true} );
		Object.defineProperty(this, 'length', { value:70, writable:true} );
		Object.defineProperty(this, 'maxY', { value:0, writable:true} );
		Object.defineProperty(this, 'paddleHitX', { value:x, writable:true} );
		Object.defineProperty(this, 'rebound', { value:0, writable:true} );
		Object.defineProperty(this, 'speed', { value:3, writable:true} );
		Object.defineProperty(this, 'width', { value:10, writable:true} );
		Object.defineProperty(this, 'x', { value:x, writable:true} );
		Object.defineProperty(this, 'y', { value:0, writable:true} );
		this.colour = this.baseColour;
		this.maxY = this.height - this.length;
		this.y = this.maxY * .5;
		this.rebound = this.speed * 3;
		if(this.isLeft){
			this.paddleHitX = this.x + this.width;
		}
	}
	Paddle.prototype.activate = function(bool){
		this.isActive = bool;
		this.colour = this.isActive ? this.activeColour : this.baseColour;
	}
	Paddle.prototype.checkBounds = function(){
		if(this.y < 0) this.y = this.rebound;
		if(this.y > this.maxY) this.y = this.maxY - this.rebound;
	}
	Paddle.prototype.reset = function(){
		this.y = this.maxY * .5;
	}

/* BALL */
	let Ball = function(x,y,radius){
		Object.defineProperty(this, 'colour', { value:'#fff', writable:true} );
		Object.defineProperty(this, 'radius', { value:radius, writable:true} );
		Object.defineProperty(this, 'running', { value:false, writable:true} );
		Object.defineProperty(this, 'speed', { value:5, writable:true} );
		Object.defineProperty(this, 'vx', { value:0, writable:true} );
		Object.defineProperty(this, 'vy', { value:0, writable:true} );
		Object.defineProperty(this, 'x', { value:x, writable:true} );
		Object.defineProperty(this, 'y', { value:y, writable:true} );
	}
	Ball.prototype.start = function(){
		this.running = true;
		this.vx = this.speed;
		if(Math.random() < .5) this.vx *= -1;
		// this.vy = Math.random()*(this.speed*.5)-this.speed; // Commented out to force TEST horizontal play
	}
	Ball.prototype.stop = function(){
		this.running = false;
	}
	Ball.prototype.reset = function(){
		this.x = game.w * .5;
		this.y = game.h * .5;
	}
	Ball.prototype.update = function(){
		if(!this.running) return;

		this.x += this.vx;
		this.y += this.vy;

		if(this.x < game.paddleLeft.paddleHitX){
			if(this.y < game.paddleLeft.y || this.y > game.paddleLeft.y + game.paddleLeft.length){
				game.manageExplode(true);
				game.scoreManager.updateScore(game.paddleLeft);
			}
			else{
				this.x = game.paddleLeft.paddleHitX;
				this.vx *= -1;
			}
		}
		else if(this.x > game.paddleRight.paddleHitX){
			if(this.y < game.paddleRight.y || this.y > game.paddleRight.y + game.paddleRight.length){
				game.manageExplode(true);
				game.scoreManager.updateScore(game.paddleRight);
			}
			else{
				this.x = game.paddleRight.paddleHitX;
				this.vx *= -1;
			}
		}
		if(this.y < 0){
			this.y = 0;
			this.vy *= -1;
		}
		else if(this.y > game.h){
			this.y = game.h;
			this.vy *= -1;
		}
	}

/* KICK OFF */
	let init = () => {
		canvas = createCanvas('stage', width, height);
		document.getElementById('stage').appendChild(canvas);
		ctx = canvas.getContext('2d');
		ctx.fillStyle = '#ff4500';
		
		game = new Game(width, height);
		// game.init();

		setUpEvents();
		setupWebSocket();
		animate();
	}
	init();
	
}());