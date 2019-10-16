(function() {
	'use strict';

	/* 
		A4 pixels (portrait):
		300dpi	- 2480 x 3508
		72dpi	- 595 x 842
	*/

	let vid = document.querySelector('.vid'),
	canvas = document.querySelector('.destination'),
	downLoadLink = document.querySelector('.save-as-file'),

	ctx,
	cWidth_print = 3508,
	cHeight_print = 2480,
	cWidth_screen = 842,
	cHeight_screen = 595,
	cWidth,
	cHeight,
	
	ratio = 9 / 16,  // Set default aspect ration @ 16:9
	iWidthBase = 350,
	iWidth = iWidthBase, 
	iHeight = iWidth * ratio,

	smoothingQuality = 'high', // medium is acceptable.

	baseFPS = 1, 
	recursionRate = Math.round(1000 / baseFPS),
	recursiveTimer,
	running = false,
	
	cols, 
	totalFrames,
	counter = 0,
	skipStart = 2,

	forPrint = false;

	/* Extend audio / video so we can query whether is playing */
	Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
		get: function(){
			return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
		}
	})

	downLoadLink.addEventListener('click', download, false);
	// document.querySelector('.start-over').addEventListener('click', () => {
	// 	reset();
	// }, false);
	// document.querySelector('#printDPI').addEventListener('change', (evt) => {
	// 	forPrint = evt.target.checked;
	// 	resetOptions();
	// }, false);

	// document.querySelector('#fpsSelect').value = baseFPS;
	// document.querySelector('#fpsSelect').addEventListener('change', (evt) => {
	// 	baseFPS = evt.target.value;
	// 	recursionRate = Math.round(1000 / baseFPS);
	// 	resetOptions();
	// }, false);

	function init(){
		setCanvasWidth();
		ctx = canvas.getContext('2d');
		ctx.imageSmoothingQuality = smoothingQuality;

		vid.addEventListener('play', playing);
		vid.addEventListener('pause', paused);
	}

	function setCanvasWidth(){
		canvas.width = cWidth = forPrint ? cWidth_print :  cWidth_screen;
		canvas.height = cHeight = forPrint ? cHeight_print : cHeight_screen;
	}

	function playing() {
		if(running) return;
		running = true;
		totalFrames = Math.floor(vid.duration * baseFPS - skipStart);
		if(vid.videoHeight != undefined && vid.videoHeight != 0 && vid.videoWidth != undefined && vid.videoWidth){
			ratio = vid.videoHeight / vid.videoWidth;
		}
		calculateImageSize();
		timerCallback();
	}
	function paused() {
		running = false;
	}

	function download() {
		let imageToSave;
		if (forPrint) {
			imageToSave = canvas.toDataURL('image/jpeg', 0.7);
		}
		else {
			imageToSave = canvas.toDataURL('image/png');
		}
        downLoadLink.setAttribute('href', imageToSave);
	}

	// function resetOptions(val) {
	// 	let currentlyPlaying = vid.playing;
	// 	clearTimeout(recursiveTimer);
	// 	vid.pause();
	// 	vid.currentTime = 0;
	// 	iWidth = iWidthBase;
	// 	iHeight = Math.round(iWidth * ratio);
	// 	totalFrames = vid.duration * baseFPS - skipStart;
	// 	counter = 0;
	// 	ctx.clearRect(0, 0, cWidth, cHeight);
	// 	setCanvasWidth();
	// 	calculateImageSize();
		
	// 	if (currentlyPlaying) {
	// 		vid.play();
	// 	}
	// }

	/* Ensure all captured frames fit on destination canvas */
	function calculateImageSize(){
		cols = Math.floor(cWidth / iWidth);
		if((totalFrames / cols) * iHeight > cHeight) {
			iWidth -= 1;
			iHeight = iWidth * ratio;
			calculateImageSize();
		}
	}

	function timerCallback() {
		if (vid.paused || vid.ended) return;
		computeFrame();
		recursiveTimer = setTimeout( () => timerCallback(), recursionRate);
	}

	/* Grab current video frame to canvas */
	function computeFrame() {
		if(counter >= skipStart){
			ctx.drawImage(vid, ((counter-skipStart) % cols) * iWidth, Math.floor((counter-skipStart) / cols) * iHeight, iWidth, iHeight);
		}
		counter++;
	}

	// function reset() {
	// 	document.querySelector('.vid').classList.add('hidden');
	// 	document.querySelector('.drop-zone').classList.remove('hidden');
	// 	document.querySelector('.vid').pause();
	// 	document.querySelector('#video-src').setAttribute('src', '');
	// 	counter = 0;
	// 	ctx.clearRect(0, 0, cWidth, cHeight);
	// }

	function createDropZone(target, id, w, h){
		let dropCanvas = document.createElement('canvas');
		dropCanvas.width = w;
        dropCanvas.height = h;
		dropCanvas.id = id;
		
		let dropCtx = dropCanvas.getContext('2d');
		dropCtx.strokeStyle = '#bada55';
		dropCtx.fillStyle = '#fff';
		dropCtx.moveTo(10, 30);
		dropCtx.lineTo(w-10, h-10);
		dropCtx.moveTo(10, h-10);
		dropCtx.lineTo(w-10, 30);
		dropCtx.rect(10, 30, w-20, h-40);
		dropCtx.stroke();
		dropCtx.font = '14pt Arial';
		dropCtx.fillText('Drop a video here', 47, 20);
		document.querySelector(target).appendChild(dropCanvas);

		// To enable drag and drop
        dropCanvas.addEventListener('dragover', (evt) => evt.preventDefault(), false);

        // Handle dropped image file - only Firefox and Google Chrome
        dropCanvas.addEventListener('drop', (evt) => {
			evt.preventDefault();
			// reset();
			document.querySelector('.vid').classList.remove('hidden');
			document.querySelector('.drop-zone').classList.add('hidden');

            // resetForUpload();
			let files = evt.dataTransfer.files;
            if (files.length > 0) {
				let file = files[0];
				document.querySelector('#video-src').setAttribute('type',  file.type);
				document.querySelector('.save-as-file').download = file.name.split('.')[0] + '.png';
				let reader = new FileReader();
				reader.onload = (file) => {
					document.querySelector('#video-src').setAttribute('src', file.target.result);
					document.querySelector('.vid').load();
				};
				reader.readAsDataURL(file);
            }
        }, false);
	}

	createDropZone('.drop-zone', 'dropCanvas', 250, 141);
	init();

})();