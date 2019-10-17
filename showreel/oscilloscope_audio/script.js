(function(){
	'use strict';
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	let canvas = document.querySelector('.oscilloscope'),
		ctx = canvas.getContext('2d'),
		width = 300,
		height = 300,
		widthHalf = width * .5,
		heightHalf = height * .5,
		isInitiated = false,
		scalar = 120,
		colourTick = 0,
		audioOffset = 0,
		audioContext,
		trackID = 'planets.mp3',  // reconstruct blocks planets asteroids shrooms
		audio,// = new Audio(),
		bufferLength = 1024 * 2,
		processor, source, splitter,
		buttons = [...document.querySelectorAll('button')];
	canvas.height = height;
	canvas.width = width;
	ctx.fillStyle = '#2ed136';

	buttons[0].addEventListener('click', (e) => {
		initAudio();
		audio.play();
		audio.currentTime = audioOffset;
	})
	buttons[1].addEventListener('click', (e) => audio.pause())

	// for(let i=2; i<buttons.length; i++){
	// 	buttons[i].addEventListener('click', (e) => pickTrack(e))
	// }
	// function pickTrack(e){
	// 	if(isInitiated){
	// 		audio.pause();
	// 	}
	// 	audio = new Audio(e.target.getAttribute('data-trackID') + '.mp3');
	// 	isInitiated = false;
	// }

	function initAudio(){
		if(isInitiated) return;
		isInitiated = true;
		audioContext = new AudioContext();
		processor = audioContext.createScriptProcessor(bufferLength, 2, 2);
		audio.crossOrigin = 'anonymous';
		audio.addEventListener('canplaythrough', function(){  
			source = audioContext.createMediaElementSource(audio)
			splitter = audioContext.createChannelSplitter(2);
			source.connect(splitter);
			source.connect(processor);
			source.connect(audioContext.destination);
			processor.connect(audioContext.destination);
		}, false);
		processor.onaudioprocess = function(evt){
			let inputR = evt.inputBuffer.getChannelData(0),
				inputL = evt.inputBuffer.getChannelData(1),
				i = 0;
			ctx.clearRect(0,0,width, height);
			// ctx.fillStyle = 'hsl(' + colourTick++ + ',100%,70%)';
			while ( i < bufferLength ){
				ctx.fillRect(heightHalf + inputR[i] * scalar, widthHalf + inputL[i] * -1 * scalar, 1, 1);
				i++;
			}
		}
	}

	audio = new Audio(trackID);
})();