(function() {
	'use strict';


	/* Multiple seeks don't work. 
		Memory blooms to 100% and video playback just freezes. 
		Doesn't matter if I donothing with the frames - it's just the repeated seeking.
		Must be a memory leak somewhere. */



	let vid,
	vidLength,
	width = 250, height = 141,  // Base is 16:9
	seekRate = 1,
	seekPosition = 5,
	seekDelay = 300, // 400
	running = false;
	
	let imgDiv = document.querySelector('#imageDIV');
	let canvas = document.querySelector('#c1');
	let ctx;

	function init(){
		vid = document.getElementById('vid');
		vid.onplaying = playing();
	}

	function playing(e) {
		if(running) return;
		running = true;
		vidLength = vid.duration;
		if(vid.videoHeight != 0){
			height = vid.videoHeight;
			width = vid.videoWidth;
		}

		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');
		
		vid.pause();
		seek();
		vid.addEventListener('seeked', seekHandler);
	}

	function seek(){
		seekPosition += seekRate;
		if(seekPosition > vidLength) {
			console.log('end now');
			return;
		}
		vid.currentTime = seekPosition;
	}

	function seekHandler() {
		setTimeout(() => {computeFrame(); seek();}, seekDelay);
	}
	function computeFrame() {
		ctx.drawImage(vid, 0, 0, width, height);
		let frameData = canvas.toDataURL();
		let imageEl = document.createElement('img');
		imageEl.src = frameData;
		imgDiv.appendChild(imageEl);
		return;
	}
	init();

})();