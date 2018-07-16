(function() {
	'use strict';

	const	JOIN = 'join',
			STATUS_MESSAGE = 'ready',
			POLL_ACTIVE_PLAYERS = 'pollActivePlayers';
	
	let messageWindow = document.getElementById('message'),
		socket,
		uid,
		players = {},
		isLoungeHost = false,
		isPlayer = false;
	
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
			case POLL_ACTIVE_PLAYERS:
				addPlayer(message.uid);
				break;
			case STATUS_MESSAGE:
				setStatusMessage(message.msg, false);
				break;
			default:
				console.log('Unhandled message:', message);
		}
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
		isPlayer = false;

		for(let player in players){
			playerCount++;
			if(players[player] < uid){
				stackPosition++;
			}
		}
		
		if(stackPosition === 0){
			isPlayer = true;
			isLoungeHost = true;
		}
		else if(stackPosition === 1){
			isPlayer = true;
		}

		if(playerCount < 2){
			setStatusMessage('Waiting for player 2 ', false);
		}
		else{
			setStatusMessage('Player ' + (stackPosition + 1) + ' ' + isPlayer, false);
		}
	};

/* MESSAGING */
	let setStatusMessage = (msg, forward) => {
		if(forward){
			sendMessage({state:STATUS_MESSAGE, msg:msg});
		}
		messageWindow.innerHTML = msg;
	};
	
/* KICK OFF */
	let init = () => {
		setupWebSocket();
	}
	init();
	
}());