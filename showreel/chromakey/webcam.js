(function() {
	'use strict';

	let vid, c1, ctx1, c2, ctx2, 
	background, bgData,
	width, height, 
	options, 
		baseFPS=30, recursionRate = 1000/baseFPS, 
		gifFramesMax = 10, gifFramesCount = 0,
		gifWidth = 320, gifHeight = 240,
		autoCaptureRunning = false, autoCaptureRate = 500,
	rgb, baseR = 100, baseG = 100, baseB=200,
	allImages = [], imageDIV = document.getElementById('imageDIV'),
	imageUpload = document.getElementById('imageUpload'),
	constraints = { video: {width: {exact: 640}, height: {exact: 480}} },
	video = document.querySelector('video');

	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

	function handleSuccess(stream) {
		video.srcObject = stream;
		setTimeout( function () { init(); }, 500);
	}
	function handleError(error) { 
		let errorMsg = document.createElement('p');
		errorMsg.innerHTML = '<p>Sorry. This webcam experiment is not supported in your browser.<br>ERROR: ' + error + '</p>';
		let outputDIV = document.getElementById('description');
		errorMsg.style.color = 'orange';
		outputDIV.appendChild(errorMsg);
	}

	function init(){
		createUI();

		c1 = document.getElementById('c1');
		ctx1 = c1.getContext('2d');
		c2 = document.getElementById('c2');
		ctx2 = c2.getContext('2d');

		width = c1.width = c2.width = video.videoWidth;
		height = c1.height = c2.height = video.videoHeight;

		let videoRatio = width / height;
		let videoOutScaleFactor = gifWidth / width;
		gifHeight = gifWidth * videoRatio * videoOutScaleFactor;
	
		background = new Image();
		background.onload = function(){
			ctx2.drawImage(background, 0, 0, width, height);
			bgData = ctx2.getImageData(0, 0, width, height);
			videoCaptureRecursion();
		}
		background.src = "bunny.jpg";
	}

	function createUI(){
		rgb = QuickSettings.create(0, 0, 'Chroma Key RGB', document.getElementById('ui'));
		rgb.addRange('RED default('+baseR+')', 0, 255, baseR, 1, function(e){ baseR = e; });
		rgb.addRange('GREEN default('+baseG+')', 0, 255, baseG, 1, function(e){ baseG = e; });
		rgb.addRange('BLUE default('+baseB+')', 0, 255, baseB, 1, function(e){ baseB = e; });

		options = QuickSettings.create(0, 0, 'GIF capture options', document.getElementById('ui'));
		options.addButton('Capture frame', manualCapture);
		options.addButton('Start AUTO Capture', startAutoCapture);
		options.addTextArea("Output");
		options.addRange('No. frames in GIF (3 - 60)', 3, 60, gifFramesMax, 1, function(e){ gifFramesMax = e; });
		options.addRange('AUTO capture delay (milliseconds)', 250, 5000, autoCaptureRate, 50, function(e){ autoCaptureRate = e; });
		// options.addRange('FPS', 1, 60, baseFPS, 1, function(e){ recursionRate = 1000 / e; });

		addDropEvent();
	}

	function addDropEvent(){
		imageUpload.addEventListener("dragover", function (evt) {
			evt.preventDefault();
		}, false);
		// Handle dropped image file - only Firefox and Google Chrome
		imageUpload.addEventListener('drop', function (evt) {
			var files = evt.dataTransfer.files;
			if (files.length > 0) {
				var file = files[0];
				if (typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
					var reader = new FileReader();
					// Note: addEventListener doesn't work in Chrome for this event
					reader.onload = function (evt) {
						background.src = evt.target.result
						bgData = ctx2.getImageData(0, 0, width, height);
					};
					reader.readAsDataURL(file);
				}
			}
			evt.preventDefault();
		}, false);
	}

	function videoCaptureRecursion() {
		computeBlendedFrame();
		setTimeout( function () {
			videoCaptureRecursion();
		}, recursionRate);
	}

	function manualCapture(){
		if(autoCaptureRunning) return;
		if(gifFramesCount < gifFramesMax){
			updateOutput('Manual capture: ' + (gifFramesCount + 1) + ' of ' + gifFramesMax);
		}
		captureCanvasAsImage();
	}

	function startAutoCapture(){
		reset();
		autoCaptureRunning = true;
		autoCaptureFrame();
	}

	function autoCaptureFrame(){
		if(!autoCaptureRunning) return;

		setTimeout( function () {
			autoCaptureFrame();
		}, autoCaptureRate);

		updateOutput('AUTO capture: ' + (gifFramesCount + 1));
		captureCanvasAsImage();

		if(gifFramesCount === gifFramesMax){
			autoCaptureRunning = false;
		}
	}

	function updateOutput(value){
		options.setValue("Output", value);
	}

	function reset(){
		allImages.length = 0;
		gifFramesCount = 0;
		autoCaptureRunning = false;
	}

	function computeBlendedFrame() {
		ctx1.drawImage(video, 0, 0, width, height);
		let frame = ctx1.getImageData(0, 0, width, height);
		let l = frame.data.length / 4;

		for (let i = 0; i < l; i++) {
			let r = frame.data[i * 4 + 0];
			let g = frame.data[i * 4 + 1];
			let b = frame.data[i * 4 + 2];
			if (g > baseG && r > baseR && b < baseB) {
				frame.data[i * 4] = bgData.data[i * 4];
				frame.data[i * 4 + 1] = bgData.data[i * 4 + 1];
				frame.data[i * 4 + 2] = bgData.data[i * 4 + 2];
			}
		}
		ctx2.putImageData(frame, 0, 0);
		return;
	}
	
	function captureCanvasAsImage(){
		let dataURL = c2.toDataURL(),
		imageEl = document.createElement('img');
		imageEl.src = dataURL;
		allImages.push(imageEl);

		gifFramesCount += 1;
		if(gifFramesCount === gifFramesMax){
			createGIF();
			reset();
			updateOutput('Capture complete. Making GIF');
		}
	}

	function createGIF(){
		gifshot.createGIF(
		{
			'images': allImages,
			'gifWidth': gifWidth,
			'gifHeight': gifHeight
		},
		function(obj) {
			if(!obj.error) {
				let image = obj.image,
				animatedImage = document.createElement('img');
				animatedImage.src = image;
				imageDIV.appendChild(animatedImage);
			}
		});
	}

})();