(function() {
	'use strict';

	/* 
		A4 pixels (portrait):
		300dpi	- 2480 x 3508
		72dpi	- 595 x 842
	*/

	let vid,
	vidLength,
	width = 250, height = 141,  // Base is 16:9
	baseFPS = 3, 
	recursionRate = 1000 / baseFPS,
	running = false,
	
	imgDiv = document.querySelector('.imageDIV'),
	canvas = document.querySelector('.destination'),
	allFrameData = [],
	ctx;

	function init(){
		vid = document.getElementById('vid');
		vid.addEventListener('play', playing);
	}
	function playing(e) {
		if(running) return;
		running = true;
		if(vid.videoHeight != 0){
			height = vid.videoHeight;
			width = vid.videoWidth;
		}
		vidLength = vid.duration;
		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');

		timerCallback();
	}
	function timerCallback() {
		if (vid.paused || vid.ended) return;
		computeFrame();
		setTimeout( () => timerCallback(), recursionRate);
	}
	function computeFrame() {
		ctx.drawImage(vid, 0, 0, width, height);
		// ctx.drawImage(vid, 0, 0, 38, 21);
		let frameData = canvas.toDataURL();
		let imageEl = document.createElement('img');
		allFrameData.push(frameData);
		imageEl.src = frameData;
		imgDiv.appendChild(imageEl);
		return;
	}

	init();

})();