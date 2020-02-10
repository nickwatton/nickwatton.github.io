(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* Singleton Event dispatcher
	Coordinates all game events throught the application */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventManager = function () {
	_createClass(EventManager, null, [{
		key: 'BUTTON_CLICKED',
		get: function get() {
			return 'button clicked';
		}
	}, {
		key: 'CHANGE_STATE',
		get: function get() {
			return 'change state';
		}
	}, {
		key: 'EVENT_NAME',
		get: function get() {
			return 'set event name';
		}
	}, {
		key: 'MUTE_TOGGLE',
		get: function get() {
			return 'toggle audio';
		}
	}, {
		key: 'PIN_UPDATE',
		get: function get() {
			return 'pin update';
		}
	}, {
		key: 'SEND_DATA',
		get: function get() {
			return 'send data';
		}
	}, {
		key: 'SOLUTION_SEQUENCE',
		get: function get() {
			return 'subtractiveGridIds';
		}
	}]);

	function EventManager() {
		_classCallCheck(this, EventManager);

		this.subscribers = {};
	}

	/* Other portions of code register desire to be notified of particular events */


	_createClass(EventManager, [{
		key: 'subscribe',
		value: function subscribe(event, handler) {
			if (this.subscribers[event]) {
				this.subscribers[event].push(handler);
			} else {
				this.subscribers[event] = [handler];
			}
		}

		/* Notify code which has registered to be notified of particular events */

	}, {
		key: 'dispatch',
		value: function dispatch(event, data) {
			if (this.subscribers[event]) {
				this.subscribers[event].forEach(function (handler) {
					handler(data);
				});
			}
		}
	}]);

	return EventManager;
}();

exports.default = EventManager;
var eventManager = exports.eventManager = new EventManager();

},{}],2:[function(require,module,exports){
'use strict';

/* Core code from: https://gist.github.com/remy/753003 */

/* A class to play a part of loaded audio.
	Dependant upon SFXManager */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSprite = function () {
	function AudioSprite(id, src, spriteLength, startPoint, loop, audioLead) {
		var volume = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
		var muted = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

		_classCallCheck(this, AudioSprite);

		this.audio = document.createElement('audio');
		this.id = id;
		this.loop = loop;
		this.muted = muted;
		this.resetVolume = volume;
		this.startPoint = startPoint;
		this.track = this;
		this.volume = volume;

		if (this.audio.canPlayType('audio/mpeg;')) {
			this.audio.src = src + '.mp3';
		} else {
			this.audio.src = src + '.ogg';
		}
		this.audio.autobuffer = true;
		this.audio.load();
		this.audio.muted = true;

		this.updateCallback = null;
		this.playing = false;
		this.lastUsed = 0;
		this.spriteLength = spriteLength;
		this.audioLead = audioLead;
	}

	/* Effectively a user initiated preload. Because iOS. */


	_createClass(AudioSprite, [{
		key: 'force',
		value: function force() {
			this.audio.pause();
			this.audio.removeEventListener('play', this.force, false);
		}
	}, {
		key: 'progress',
		value: function progress() {
			this.audio.removeEventListener('progress', this.progress, false);
			if (this.track.updateCallback !== null) {
				this.track.updateCallback();
			}
		}
	}, {
		key: 'kickoff',
		value: function kickoff() {
			this.audio.play();
			document.documentElement.removeEventListener('click', this.kickoff, true);
		}
	}, {
		key: 'play',
		value: function play() {
			var track = this,
			    audio = this.audio,
			    time = this.audioLead + this.startPoint,
			    nextTime = time + this.spriteLength;

			if (this.playing) {
				// console.log('Sorry, this AudioSprite is busy. Come back in', this.spriteLength, 'seconds');
				return;
			}

			if (!this.muted) {
				audio.volume = this.volume;
			} else {
				audio.volume = 0;
			}

			clearInterval(track.timer);
			track.playing = true;
			track.lastUsed = +new Date();

			audio.muted = this.muted;
			audio.pause();
			try {
				if (time === 0) {
					time = 0.01; // yay hacks. Sometimes setting time to 0 doesn't play back
				}
				audio.currentTime = time;
				audio.play();
			} catch (evt) {
				this.updateCallback = function () {
					track.updateCallback = null;
					audio.currentTime = time;
					audio.play();
				};
				audio.play();
			}

			track.timer = setInterval(function () {
				if (audio.currentTime >= nextTime) {
					track.stop();
					if (track.loop) {
						track.play();
					}
				}
			}, 10);
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.audio.pause();
			this.audio.muted = true;
			try {
				clearInterval(this.timer);
			} catch (evt) {/* {[*_*]} */}
			this.playing = false;
		}
	}, {
		key: 'mute',
		value: function mute(TF) {
			this.muted = TF;
			this.audio.muted = this.muted;
			this.audio.volume = this.volume;
		}
	}, {
		key: 'changeVolume',
		value: function changeVolume(value) {
			try {
				this.volume = value;
				if (!this.audio.muted) {
					this.audio.volume = this.volume;
				}
			} catch (evt) {
				// console.log('AudioSprite.changeVolume()', evt);
			}
		}
	}]);

	return AudioSprite;
}();

exports.default = AudioSprite;

},{}],3:[function(require,module,exports){
/* eslint-disable id-length */
'use strict';

/* Creates a particle system which playes through a generated mask (Matte) */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bubbles = function () {
	_createClass(Bubbles, null, [{
		key: 'Tau',
		get: function get() {
			return Math.PI * 2;
		}
	}]);

	function Bubbles(domID) {
		_classCallCheck(this, Bubbles);

		this.domTarget;
		this.canvas;
		this.context;
		this.matte;
		this.width = 54;
		this.height = 83;
		this.numParticles = 60;
		this.allParticles = [];
		this.Tau = Math.PI * 2;
		this.fillColour = 'rgba(200, 200, 255, .3)';
		this.strokeColour = '#bebebe';
		this.strokeWidth = .5;
		this.running = false;

		this.timeOut;

		this.createCanvas(domID, this.width, this.height);
		this.init();
		this.matte.draw();

		this.start();
	}

	/* Creates own canvas to reduce draw updates on main game canvas */


	_createClass(Bubbles, [{
		key: 'createCanvas',
		value: function createCanvas(domID, width, height) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = width;
			this.canvas.height = height;

			this.domTarget = document.getElementById(domID);
			this.domTarget.appendChild(this.canvas);
			this.context = this.canvas.getContext('2d');

			this.context.fillStyle = this.fillColour;
			this.context.strokeStyle = this.strokeColour;
			this.context.lineWidth = this.strokeWidth;
		}

		/* Create the mask and generate all particles using an Object Pool pattern */

	}, {
		key: 'init',
		value: function init() {
			this.matte = new MaskMatte(this.width, this.height, this.context);
			for (var index = 0; index < this.numParticles; index++) {
				this.allParticles.push(this.makeParticle({}, Math.random() * this.height + 10));
			}
		}

		/* Creates individual particle. Called initially and when particle is recycled */

	}, {
		key: 'makeParticle',
		value: function makeParticle(particle, initY) {
			particle.x = Math.random() * this.width;
			particle.y = initY;
			particle.vx = Math.random() * 4 + 2;
			particle.vy = Math.random() * 1.5 + .7;
			particle.radius = 1 * particle.vy;
			return particle;
		}

		/* Updates particle properties for movement.
  	Checks if particle is out of boiunds, and recycles it if required */

	}, {
		key: 'update',
		value: function update() {
			var particle = void 0;
			for (var index = 0; index < this.numParticles; index++) {
				particle = this.allParticles[index];
				particle.x += Math.sin(particle.vx += .05) * .1;
				particle.y -= particle.vy;
				if (particle.x > this.width || particle.x < 0 || particle.y < 0) {
					this.makeParticle(particle, this.height + 5);
				}
			}
		}

		/* Draw the particle */

	}, {
		key: 'draw',
		value: function draw() {
			var particle = void 0;
			for (var index = 0; index < this.numParticles; index++) {
				particle = this.allParticles[index];
				this.context.beginPath();
				this.context.arc(particle.x, particle.y, particle.radius, 0, Bubbles.Tau);
				this.context.fill();
				this.context.stroke();
			}
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.running = false;
		}
	}, {
		key: 'start',
		value: function start() {
			this.running = true;
			this.animate();
		}

		/* Controls the animatioon cycle at a slower than requestAnimationFrame (RAF) rate, to reduce performance load */

	}, {
		key: 'animate',
		value: function animate() {
			var _this = this;

			if (!this.running) {
				return;
			}
			this.context.clearRect(0, 0, this.width, this.height);
			this.update();
			this.context.save(); // this saves clipping path. no need to redraw as it is static
			this.draw();
			this.context.restore();

			setTimeout(function () {
				return _this.animate();
			}, 33);
		}
	}]);

	return Bubbles;
}();

/*  For animation */
/*  Create clipping path so the bubbles conform to the shape of the glass */


exports.default = Bubbles;

var MaskMatte = function () {
	function MaskMatte(width, height, ctx) {
		_classCallCheck(this, MaskMatte);

		this.width = width;
		this.height = height * 2;
		this.xOffset = width * .5;
		this.yOffset = 0;
		this.canvasCtx = ctx;
	}

	_createClass(MaskMatte, [{
		key: 'draw',
		value: function draw() {
			var heightControlPointFactor = .7;
			var widthControlPointOffset = 6;
			this.canvasCtx.beginPath();
			this.canvasCtx.moveTo(0, 0);
			this.canvasCtx.lineTo(this.width, 0);
			this.canvasCtx.bezierCurveTo(this.width + widthControlPointOffset, this.height * heightControlPointFactor, 0 - widthControlPointOffset, this.height * heightControlPointFactor, 0, 0);
			this.canvasCtx.closePath();
			this.canvasCtx.clip();
		}
	}]);

	return MaskMatte;
}();

},{}],4:[function(require,module,exports){
'use strict';

/* Creates a canvas element */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
	function Canvas(domID) {
		var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'gameCanvas';
		var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 640;
		var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 480;
		var renderFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		_classCallCheck(this, Canvas);

		this.canvas;
		this.context;
		this.domElement = document.getElementById(domID);
		this.height;
		this.id = id;
		this.renderFunction = renderFunction;
		this.width;

		this.createCanvas();
		this.resize(width, height);
	}

	_createClass(Canvas, [{
		key: 'createCanvas',
		value: function createCanvas() {
			this.canvas = document.createElement('canvas');
			this.canvas.id = this.id;
			this.domElement.appendChild(this.canvas);
			this.context = this.canvas.getContext('2d');

			this.context.fillStyle = 'blue';
			this.context.beginPath();
			this.context.rect(0, 0, this.width, this.height);
			this.context.fill();
		}

		/* Other visual game elements are registered to the canvas, which calls their individual render functions.
  	This keeps a single render loop, and keeps everything in sync */

	}, {
		key: 'render',
		value: function render() {
			this.context.save();

			if (this.renderFunction) {
				this.renderFunction(this);
			}

			this.context.restore();
		}

		/* Incase we need to resize the canvas (we don't in this application) */

	}, {
		key: 'resize',
		value: function resize(width, height) {
			this.width = this.canvas.width = width;
			this.height = this.canvas.height = height;
		}
	}]);

	return Canvas;
}();

exports.default = Canvas;

},{}],5:[function(require,module,exports){
'use strict';

/* Single cell within interacive opacity layer.
	Manages own state, tweenng, and rendering to canvas */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
	_createClass(Cell, null, [{
		key: 'MAX_OPACITY',
		get: function get() {
			return .9;
		}
	}, {
		key: 'MIN_OPACITY',
		get: function get() {
			return 0;
		}
	}, {
		key: 'NEAR_ENOUGH',
		get: function get() {
			return 0.01;
		}
	}]);

	function Cell() {
		var xLoc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var yLoc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var opacity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
		var eWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
		var eHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;

		_classCallCheck(this, Cell);

		this.opacity = opacity;
		this.targetOpacity = this.opacity;
		this.baseSpeed = Math.random() * .05 + .05;
		this.speed = this.baseSpeed;
		this.height = eHeight;
		this.width = eWidth;
		this.xLoc = xLoc;
		this.yLoc = yLoc;
		this.inFlux = true;
	}

	/* iPad used at Events. They are rubbish, so we turn off animation */


	_createClass(Cell, [{
		key: 'setForIOS',
		value: function setForIOS() {
			this.baseSpeed = 1;
			this.speed = 1;
		}

		/* Called to turn window on/off
  	Needs not be different.
  	If different, needs animation - set inFlux flag */

	}, {
		key: 'setOpacity',
		value: function setOpacity(opacityChange) {
			this.targetOpacity = this.opacity + opacityChange;

			// keep target within expected bounds
			if (this.targetOpacity > Cell.MAX_OPACITY) {
				this.targetOpacity = Cell.MAX_OPACITY;
			}
			if (this.targetOpacity < Cell.MIN_OPACITY) {
				this.targetOpacity = Cell.MIN_OPACITY;
			}

			// Speed can be + or - which allows use to always add it in update loop
			// which removes logic / load in performance sensitive code
			this.speed = this.targetOpacity < this.opacity ? this.baseSpeed * -1 : this.baseSpeed;

			// only animate cell if change is required
			if (this.targetOpacity !== this.opacity) {
				this.inFlux = true;
			}
		}

		// update opacity and keep within bounds

	}, {
		key: 'update',
		value: function update() {
			// linear ease
			this.opacity += this.speed;

			if (this.opacity > Cell.MAX_OPACITY) {
				this.opacity = Cell.MAX_OPACITY;
			}
			if (this.opacity < Cell.MIN_OPACITY) {
				this.opacity = Cell.MIN_OPACITY;
			}
		}
	}, {
		key: 'render',
		value: function render(canvas) {
			// Only render if in flux
			if (!this.inFlux) {
				return;
			}

			this.update();
			// Use 'near enough' animation stop
			if (Math.abs(this.targetOpacity - this.opacity) < Cell.NEAR_ENOUGH) {
				this.opacity = this.targetOpacity;
				this.inFlux = false;
			}

			// clear and render just the required area of canvas to reduce pixels drawn / load
			canvas.context.clearRect(this.xLoc, this.yLoc, this.width, this.height);
			canvas.context.fillStyle = 'rgba(0, 0, 0,' + this.opacity + ')';
			canvas.context.beginPath();
			canvas.context.rect(this.xLoc, this.yLoc, this.width, this.height);
			canvas.context.fill();
		}
	}]);

	return Cell;
}();

exports.default = Cell;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.formManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Singleton
	Manages form valiadtion and submission.
	There is a different form for Internal and External events.
	This controls which is displayed and manages required valiadtion fields */
var FormManager = function () {
	function FormManager() {
		var _this = this;

		_classCallCheck(this, FormManager);

		this.eventName = '';
		this.runAsEvent = false;
		this.submitForm; // Form is different for Internal and external events
		this.formValid;
		this.inputs;
		this.valid;
		this.slt4ID = '#singleLineText4';
		this.formLocked = false;

		this.isInternal;

		_EventManager.eventManager.subscribe(_EventManager2.default.EVENT_NAME, function (evt) {
			return _this.setEvent(evt.data);
		});
		_EventManager.eventManager.subscribe(_stateManager2.default.SCORE, function (evt) {
			return document.querySelector(_this.slt4ID).value = evt.raw;
		});

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			if (evt.data === _stateManager2.default.PLAY_AGAIN) {
				/* Unlock the form */
				_this.formLocked = false;
			}
		});
	}

	/* Based on url hash, cotrols whether the game is Internal or External
 	Set variable / properties accordingly */


	_createClass(FormManager, [{
		key: 'setEvent',
		value: function setEvent(evt) {
			var _this2 = this;

			if (evt === _stateManager2.default.EXTERNAL) {
				this.createValidationList(false);
				this.runAsEvent = true;
				this.slt4ID = '#singleLineText4-external';
				this.submitForm = document.querySelector('#registerFormExternal');
			} else {
				this.createValidationList(true);
				this.submitForm = document.querySelector('#registerForm');
			}
			this.submitForm.addEventListener('submit', function (evt) {
				evt.preventDefault();
				_this2.submitHandler();
			}, false);
		}

		/* Set form fields for validation */

	}, {
		key: 'createValidationList',
		value: function createValidationList() {
			var isInternal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this.isInternal = isInternal;
			if (isInternal) {
				this.inputs = [{ id: '#fName', type: 'string', submitValue: 'firstName=' }, { id: '#fEmail', type: 'email', submitValue: 'emailAddress=' }, { id: '#fTnC', type: 'checkbox', submitValue: 'singleLineText5=' }, { id: '#singleLineText4', type: 'number', submitValue: 'singleLineText4=' }];
			} else {
				this.inputs = [{ id: '#fName-external', type: 'string', submitValue: 'name=' }, { id: '#fEmail-external', type: 'email', submitValue: 'email=' }, { id: '#fCompany-external', type: 'string', submitValue: 'company=' }, { id: '#fType-external', type: 'string', submitValue: 'type=' }, { id: '#fCountry-external', type: 'string', submitValue: 'country=' }, { id: '#fMarketing', type: 'optional', submitValue: 'optIn=' }, { id: '#fTnC-external', type: 'checkbox', submitValue: 'lastName=' }];
			}
		}

		/* Runs through validationon all fields when user submits form
  	Sends Event for form to be submitted to server when valid */

	}, {
		key: 'submitHandler',
		value: function submitHandler() {
			if (this.formLocked) {
				/* Stops double clicking once form is sent */
				return;
			}
			document.activeElement.blur();
			this.formResetValidation();

			var submitString = 'elqFormName=digi_game_internal&elqSiteID=1911602307&elqCampaignId=&';

			this.valid = true;
			for (var index = 0, loop = this.inputs.length; index < loop; index++) {
				var field = document.querySelector(this.inputs[index].id);
				var value = field.value;
				if (this.inputs[index].type === 'string') {
					if (!this.validateString(value)) {
						field.classList.add('error-state');
						this.valid = false;
					}
				} else if (this.inputs[index].type === 'email') {
					if (!this.validateEmail(value)) {
						field.classList.add('error-state');
						this.valid = false;
					}
				} else if (this.inputs[index].type === 'checkbox') {
					if (!field.checked) {
						field.classList.add('error-state');
						this.valid = false;
					}
				} else if (this.inputs[index].type === 'optional') {
					// do nothing - requires no validation as it is optional.
				} else {
						// Unhandled field type
						// Extend code here if required
					}
				if (this.valid) {
					var addField = encodeURI(this.inputs[index].submitValue + value);
					submitString += addField + '&';
				}
			}
			if (!this.valid) {
				return;
			}

			// All validation passed
			/* Lock the form */
			this.formLocked = true;
			submitString += 'singleLineText6=' + new Date().toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");
			if (this.isInternal) {
				submitString += '&lastName=none';
			}
			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, {
				'data': _EventManager2.default.SEND_DATA,
				'submitData': submitString,
				'thisPlayerName': document.querySelector(this.isInternal ? '#fName' : '#fName-external').value,
				'thisPlayerEmail': document.querySelector(this.isInternal ? '#fEmail' : '#fEmail-external').value });
		}

		// resetform after validation

	}, {
		key: 'formResetValidation',
		value: function formResetValidation() {
			for (var index = 0, loop = this.inputs.length; index < loop; index++) {
				document.querySelector(this.inputs[index].id).classList.remove('error-state');
			}
		}
	}, {
		key: 'validateEmail',
		value: function validateEmail(email) {
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		}
	}, {
		key: 'validateString',
		value: function validateString(value) {
			return value !== undefined && value !== '' ? true : false;
		}
	}]);

	return FormManager;
}();

exports.default = FormManager;
var formManager = exports.formManager = new FormManager();

},{"./EventManager.js":1,"./stateManager":20}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

var _gameTimerUtils = require('./gameTimerUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Singlton.
	Keep track of time spend solving puzzle */
var GameTimer = function () {
	function GameTimer() {
		var _this = this;

		var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
		var domID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.time-display';

		_classCallCheck(this, GameTimer);

		this.domElement = document.querySelector('.time-display');
		this.fps = fps;
		this.gameTime = 0;
		this.running = false;

		this.startTick;

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			switch (evt.data) {
				case _stateManager2.default.PLAY_AGAIN:
					_this.reset();
					break;

				case _stateManager2.default.PLAYING:
					_this.start();
					break;

				case _stateManager2.default.WINNER:
					_this.stop();
					break;
			}

			if (evt.data === _stateManager2.default.WINNER) {
				_this.stop();
				_EventManager.eventManager.dispatch(_stateManager2.default.SCORE, { 'data': _gameTimerUtils.gameTimerUtils.reportMMSSTH(_this.gameTime), 'raw': _this.gameTime });
			}
		});
	}

	_createClass(GameTimer, [{
		key: 'start',
		value: function start() {
			this.startTick = new Date().getTime();
			this.running = true;
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.running = false;
		}
	}, {
		key: 'update',
		value: function update() {
			if (!this.running) {
				return;
			}
			this.gameTime += 1;
			this.display();
		}
	}, {
		key: 'display',
		value: function display() {
			this.domElement.innerHTML = _gameTimerUtils.gameTimerUtils.reportMMSSTH(this.gameTime); //reportSSMilli();
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.stop();
			this.gameTime = 0;
		}
	}]);

	return GameTimer;
}();

exports.default = GameTimer;

},{"./EventManager.js":1,"./gameTimerUtils":8,"./stateManager":20}],8:[function(require,module,exports){
'use strict';

/* Utility class.
	Formats counter/timer as MM:SS:TH */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameTimerUtils = function () {
	function GameTimerUtils() {
		_classCallCheck(this, GameTimerUtils);

		this.fps = 60;
	}

	_createClass(GameTimerUtils, [{
		key: 'reportMMSSTH',
		value: function reportMMSSTH(counter) {
			var seconds = Math.floor(counter / this.fps);
			var minutes = Math.floor(seconds / 60);
			var millisecs = counter - seconds * this.fps;

			seconds = seconds - minutes * 60;

			if (millisecs < 10) {
				millisecs = '0' + millisecs;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			return minutes + ':' + seconds + ':' + millisecs;
		}
	}]);

	return GameTimerUtils;
}();

exports.default = GameTimerUtils;
var gameTimerUtils = exports.gameTimerUtils = new GameTimerUtils();

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cell = require('./cell');

var _cell2 = _interopRequireDefault(_cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Hold a view of windows.
	Builds covers and manages grid adjustment layers */
var Grid = function () {
	_createClass(Grid, null, [{
		key: 'ADDITIVE',
		get: function get() {
			return 'additive';
		}
	}, {
		key: 'SUBTRACTIVE',
		get: function get() {
			return 'subtractive';
		}
	}]);

	function Grid() {
		var xPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var yPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var columns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
		var rows = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
		var eWidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
		var eHeight = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 15;
		var yShift = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : .1;
		var meshData = arguments[7];
		var subtractiveGrid = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : undefined;

		_classCallCheck(this, Grid);

		this.columns = columns;
		this.rows = rows;
		this.xPos = xPos;
		this.yPos = yPos;
		this.yShift = yShift;
		this.size = this.columns * this.rows;
		this.cells = [];
		this.numOfGates = 10;
		this.gates = new Array(this.numOfGates); // We require exactly 10 filter grids - one for each button

		this.setSubtractiveFilter(subtractiveGrid);

		this.initSubtractiveFilters();
		this.parseMeshData(meshData);
		this.generateResetGrids();

		this.buildGrid(eWidth, eHeight);
	}

	_createClass(Grid, [{
		key: 'setForIOS',
		value: function setForIOS() {
			for (var index = 0; index < this.cells.length; index++) {
				this.cells[index].setForIOS();
			}
		}

		// Generate grid of overlay cells

	}, {
		key: 'buildGrid',
		value: function buildGrid(eWidth, eHeight) {
			for (var indexRow = 0; indexRow < this.rows; indexRow++) {
				for (var indexCol = 0; indexCol < this.columns; indexCol++) {
					this.cells.push(new _cell2.default(indexCol * eWidth + this.xPos, indexRow * eHeight + this.yPos + this.yShift * indexCol, _cell2.default.MAX_OPACITY, eWidth, eHeight));
				}
			}
		}

		// Create random placement and order for subtractive filters

	}, {
		key: 'generateUnique',
		value: function generateUnique() {
			var rnd = void 0;
			while (this.subtractiveGrids.length < 4) {
				rnd = Math.floor(Math.random() * this.gates.length);
				if (this.subtractiveGrids.indexOf(rnd) === -1) {
					this.subtractiveGrids.push(rnd);
				}
			}
		}

		/* If no PIN sequence (IDs for subtractive grids) */

	}, {
		key: 'setSubtractiveFilter',
		value: function setSubtractiveFilter(subtractiveGrid) {
			this.subtractiveGrids = subtractiveGrid === undefined ? [] : subtractiveGrid;

			if (subtractiveGrid === undefined) {
				this.generateUnique();
			}
		}

		// Create empty array ready for mesh data parsing to populate with filter data

	}, {
		key: 'initSubtractiveFilters',
		value: function initSubtractiveFilters() {
			for (var index = 0; index < this.subtractiveGrids.length; index++) {
				this.gates[this.subtractiveGrids[index]] = [];
			}
		}

		// Generate subtractive grids from mesh data

	}, {
		key: 'parseMeshData',
		value: function parseMeshData(meshData) {
			for (var index = 0; index < meshData.length; index++) {
				this.gates[this.subtractiveGrids[0]].push(meshData[index] === 'a' ? 1 : 0);
				this.gates[this.subtractiveGrids[1]].push(meshData[index] === 'b' ? 1 : 0);
				this.gates[this.subtractiveGrids[2]].push(meshData[index] === 'c' ? 1 : 0);
				this.gates[this.subtractiveGrids[3]].push(meshData[index] === 'd' ? 1 : 0);
			}
		}

		// Generate reset grids

	}, {
		key: 'generateResetGrids',
		value: function generateResetGrids() {
			for (var index = 0; index < this.gates.length; index++) {
				if (this.gates[index] === undefined) {
					this.gates[index] = this.makeFilterGate(0, this.size); // set additive / reset grid here
				}
			}
		}

		// Utility to make simple block filters

	}, {
		key: 'makeFilterGate',
		value: function makeFilterGate(start, end) {
			var filter = [];
			for (var index = 0; index < this.size; index++) {
				filter[index] = index >= start && index <= end ? 1 : 0;
			}
			return filter;
		}
	}, {
		key: 'render',
		value: function render(canvas) {
			for (var index = 0; index < this.cells.length; index++) {
				this.cells[index].render(canvas);
			}
		}

		// Iterates through the grid and changes opacity based on the filter

	}, {
		key: 'applyGate',
		value: function applyGate(id) {
			var behaviour = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Grid.ADDITIVE;

			var theFilter = this.gates[id],
			    cell = void 0,
			    behaviourModifier = behaviour === Grid.SUBTRACTIVE ? -1 : 1;
			for (var index = 0; index < this.cells.length; index++) {
				cell = this.cells[index];
				cell.setOpacity(theFilter[index] * behaviourModifier);
			}
		}
	}, {
		key: 'reset',
		value: function reset(subtractiveGrid, meshData) {
			for (var index = 0; index < this.cells.length; index++) {
				this.cells[index].setOpacity(1);
			}

			this.gates = new Array(this.numOfGates);
			this.setSubtractiveFilter(subtractiveGrid);

			this.initSubtractiveFilters();
			this.parseMeshData(meshData);
			this.generateResetGrids();
		}
	}]);

	return Grid;
}();

exports.default = Grid;

},{"./cell":5}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _mesh = require('./mesh');

var _mesh2 = _interopRequireDefault(_mesh);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Manages all the little black-outs for the windows */
var GridManager = function () {
	function GridManager() {
		var _this = this;

		_classCallCheck(this, GridManager);

		this.meshData = new _mesh2.default();
		this.totalGridCells = 0;
		this.solved = false;
		this.matteGrids = []; // grid of cells which overlay windows as dim-out layers

		_EventManager.eventManager.subscribe(_EventManager2.default.BUTTON_CLICKED, function (evt) {
			return _this.handleGateSwitch(evt.data);
		});

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			if (evt.data === _stateManager2.default.PLAY_AGAIN) {
				_this.reset();
			}
			if (evt.data === _stateManager2.default.WINNER) {
				_this.solved = true;
			}
		});

		_EventManager.eventManager.subscribe(_EventManager2.default.EVENT_NAME, function (evt) {
			if (evt.data === _stateManager2.default.EXTERNAL) {
				_this.setForIOS();
			}
		});
	}

	_createClass(GridManager, [{
		key: 'init',
		value: function init() {
			this.matteGrids.push(new _grid2.default(1, 1, // offsets
			15, 18, // cols and rows
			7.8, 20.2, // cell size
			.45, // yShift
			this.meshData.mesh, // Used to construct grid
			undefined // first grid calculates positions for solution buttons (subtractiveGrids)
			));
			this.meshData.flip();
			this.matteGrids.push(new _grid2.default(118, 50, 15, 18, // cols and rows
			5.5, 20.2, .2, this.meshData.mesh, this.matteGrids[0].subtractiveGrids));
			_EventManager.eventManager.dispatch(_EventManager2.default.SOLUTION_SEQUENCE, { 'data': this.matteGrids[0].subtractiveGrids });
		}
	}, {
		key: 'setForIOS',
		value: function setForIOS() {
			console.log('ios');
			for (var index = 0; index < this.matteGrids.length; index++) {
				this.matteGrids[index].setForIOS();
			}
		}
	}, {
		key: 'reset',
		value: function reset() {
			for (var index = 0; index < this.matteGrids.length; index++) {
				var subtractiveGrid = void 0;
				if (index > 0) {
					subtractiveGrid = this.matteGrids[0].subtractiveGrids;
				}
				if (index !== 1) {
					this.meshData.flip();
				}

				this.matteGrids[index].reset(subtractiveGrid, this.meshData.mesh);
			}
			this.solved = false;
			_EventManager.eventManager.dispatch(_EventManager2.default.SOLUTION_SEQUENCE, { 'data': this.matteGrids[0].subtractiveGrids });
		}
	}, {
		key: 'handleGateSwitch',
		value: function handleGateSwitch(id) {
			if (this.solved) {
				return;
			}
			for (var filterGrid, index = 0; index < this.matteGrids.length; index++) {
				filterGrid = this.matteGrids[index];
				filterGrid.applyGate(id, filterGrid.subtractiveGrids.indexOf(id) !== -1 ? _grid2.default.SUBTRACTIVE : '');
			}
		}
	}]);

	return GridManager;
}();

exports.default = GridManager;

},{"./EventManager.js":1,"./grid":9,"./mesh":14,"./stateManager":20}],11:[function(require,module,exports){
'use strict';

/* eslint-disable no-unused-vars */

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.readDeviceOrientation = exports.get = exports.isMobile = exports.debounce = undefined;

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let stateManager = new StateManager();
var orientationChangePhaseCache = '';

/* delay fast repeat event listeners, eg resize */
function debounce(func, wait, immediate) {
	var timeout = void 0;
	return function () {
		var context = this,
		    args = arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

function get(id) {
	return document.getElementById(id);
}

/* Using this method as an interface to check through to include all mobile */
function isMobile() {
	return window.mobilecheck();
}

/* respond to resize to generate and update offsets */
function readDeviceOrientation(wrapper) {
	// return;
	if (!isMobile()) {
		return;
		// console.log('Blocking readDeviceOrientation() mobile only catch for testing');
	}

	var rect = wrapper.getBoundingClientRect();
	if (window.innerWidth > window.innerHeight - rect.top - 2) {
		// if (gamePhase === PORTRAIT) {
		// 	gamePhase = orientationChangePhaseCache;
		// }
	} else {}
		// orientationChangePhaseCache = gamePhase === PORTRAIT ? orientationChangePhaseCache : gamePhase;
		// gamePhase = PORTRAIT;
		// eventManager.dispatch(EventManager.CHANGE_STATE, {'data': ORIENTATION_WARNING});

		// classUtils.setClass('container', gamePhase);
}

exports.debounce = debounce;
exports.isMobile = isMobile;
exports.get = get;
exports.readDeviceOrientation = readDeviceOrientation;

},{"./EventManager.js":1,"./stateManager":20}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.introVideo = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Video controller */
var IntroVideo = function () {
	_createClass(IntroVideo, null, [{
		key: 'RUN_AS_TESTING',
		get: function get() {
			return IntroVideo.testing;
		},
		set: function set(bool) {
			IntroVideo.testing = bool;
		}
	}]);

	function IntroVideo(testing) {
		var _this = this;

		_classCallCheck(this, IntroVideo);

		this.vid = document.querySelector('.asi-video');
		this.vidMessage = document.querySelector('p.video-message');
		this.countdown = document.querySelector('.video-message .countdown-count');
		this.counter = 3;
		this.countDownRunning = false;
		this.countdownDuration = 3.5;
		this.testing = testing;

		this.progressDisplay = document.querySelector('.video-progress-wrapper .video-progress');

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			switch (evt.data) {
				case _stateManager2.default.VIDEO:
					_this.start();
					break;
			}
		});
	}

	/* If testing skip video, otherwise
 	play video and listen for timeupdate events */


	_createClass(IntroVideo, [{
		key: 'start',
		value: function start() {
			var _this2 = this;

			if (IntroVideo.testing) {
				this.initCountdown();
			} else {
				this.vid.play();
				this.vid.addEventListener('timeupdate', function (evt) {
					return _this2.updatePlaybackPercentage(evt);
				});
			}
		}

		/* Scale the progress bar, plus if near the end, strat the count-in to the game */

	}, {
		key: 'updatePlaybackPercentage',
		value: function updatePlaybackPercentage(evt) {
			var duration = evt.target.duration;
			var currentTime = evt.target.currentTime;

			this.progressDisplay.style.width = currentTime * 100 / duration + '%';

			if (!this.countDownRunning && duration - currentTime < this.countdownDuration) {
				this.initCountdown();
			}
		}

		/* Set variables and reveal countdown elements */

	}, {
		key: 'initCountdown',
		value: function initCountdown() {
			this.countDownRunning = true;
			this.vidMessage.style.opacity = 1;
			this.countDown();
		}

		/* Recursive method to update DOM countdown visual */

	}, {
		key: 'countDown',
		value: function countDown() {
			var _this3 = this;

			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.COUNTDOWN });
			this.countdown.innerHTML = 'in...<br><span class="counter">' + this.counter-- + '</span>';
			setTimeout(function () {
				return _this3.counter === 0 ? _this3.presetPlay() : _this3.countDown();
			}, 1000);
		}

		/* Final update of DOM countdown visual */

	}, {
		key: 'presetPlay',
		value: function presetPlay() {
			var _this4 = this;

			this.countdown.innerHTML = 'in...<br><span class="counter">' + this.counter + '</span>';
			setTimeout(function () {
				return _this4.pushToPlay();
			}, 600);
		}

		/* Event to start game */

	}, {
		key: 'pushToPlay',
		value: function pushToPlay() {
			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.PLAYING });
			this.clean();
		}

		/* Cleanup  */

	}, {
		key: 'clean',
		value: function clean() {
			var _this5 = this;

			try {
				this.vid.removeEventListener('timeupdate', function (evt) {
					return _this5.updatePlaybackPercentage(evt);
				});
			} catch (evt) {
				//
			}
		}
	}]);

	return IntroVideo;
}();

exports.default = IntroVideo;
var introVideo = exports.introVideo = new IntroVideo();

},{"./EventManager.js":1,"./stateManager":20}],13:[function(require,module,exports){
'use strict';

require('./polyfills');

var _helpers = require('./helpers');

var _canvas = require('./canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _sfxManager = require('./sfxManager');

var _pinWatcher = require('./pinWatcher');

var _pinWatcher2 = _interopRequireDefault(_pinWatcher);

var _gridManager = require('./gridManager');

var _gridManager2 = _interopRequireDefault(_gridManager);

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

var _gameTimer = require('./gameTimer');

var _gameTimer2 = _interopRequireDefault(_gameTimer);

var _introVideo = require('./introVideo');

var _introVideo2 = _interopRequireDefault(_introVideo);

var _replayCount = require('./replayCount');

var _formManager = require('./formManager');

var _resultsManager = require('./resultsManager');

var _bubbles = require('./bubbles');

var _bubbles2 = _interopRequireDefault(_bubbles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Singleton
// Singleton
// Singleton
// Singleton
/* eslint-disable no-unused-vars */
(function () {
	'use strict';

	var CANVAS_ID = 'game-wrapper',
	    pageRoot = document.documentElement,
	    canvasWidth = 205,
	    canvasHeight = 404,
	    TESTING = true; // Used to skip video

	var wrapper = (0, _helpers.get)(CANVAS_ID),
	    gridCanvas = void 0,
	    pinWatcher = new _pinWatcher2.default(),
	    gridManager = new _gridManager2.default(),
	    gameTimer = new _gameTimer2.default(60, '.time-display'),
	    gamePadButtonsActive = false,
	    replayLocked = false,
	    bubbles1 = void 0,
	    bubbles2 = void 0,
	    gameType = _stateManager2.default.INTERNAL;

	_introVideo2.default.RUN_AS_TESTING = TESTING;
	gridManager.init();
	pinWatcher.init();

	var clockWrapper = document.querySelector('.clock-wrapper');
	var clockToggle = document.querySelector('.time-toggle');

	Date.now = Date.now || function () {
		return +new Date();
	};

	// Enable click events on in-game buttons only once play starts
	_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
		if (evt.data === _stateManager2.default.PLAYING) {
			replayLocked = false; // Allow user to 'play again'
			activateGameButtons();
		}
	});

	// Change HTML interface to reflect solution satus
	_EventManager.eventManager.subscribe(_EventManager2.default.PIN_UPDATE, function (evt) {
		updateButtonState(evt.data);
	});

	/* setup touch events */
	function setupEvents() {
		document.addEventListener('touchstart', touchHandler, true);
		document.addEventListener('touchmove', touchHandler, true);
		document.addEventListener('touchend', touchHandler, true);
		document.addEventListener('touchcancel', touchHandler, true);
	}
	/* This enables touch events */
	function touchHandler(event) {
		// if(gamePhase != PLAY) { return; }
		var touches = event.changedTouches,
		    first = touches[0],
		    type = '';
		switch (event.type) {
			case 'touchstart':
				type = 'mousedown';break;
			case 'touchmove':
				type = 'mousemove';break;
			case 'touchend':
				type = 'mouseup';break;
			default:
				return;
		}
		var simulatedEvent = document.createEvent('MouseEvent');
		simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/, null);
		first.target.dispatchEvent(simulatedEvent);
	}

	window.onorientationchange = _helpers.readDeviceOrientation;
	window.onresize = resizeHandler;
	(0, _helpers.readDeviceOrientation)(wrapper);

	if (!('ontouchstart' in document.documentElement) && !navigator.maxTouchPoints && !navigator.msMaxTouchPoints) {
		pageRoot.className += ' notouch';
	}

	/* respond to resize to generate and update offsets */
	// eslint-disable-next-line no-unused-vars
	var resizeHandler = (0, _helpers.debounce)(function (evt) {
		(0, _helpers.readDeviceOrientation)(wrapper);
	}, 100);

	// Enable click events on in-game buttons
	var buttons = [].slice.call(document.querySelectorAll('.btn')); // grab all .btn elements as array
	function activateGameButtons() {
		if (gamePadButtonsActive) {
			return;
		}

		var _loop = function _loop(index) {
			buttons[index].addEventListener('click', function () {
				return _EventManager.eventManager.dispatch(_EventManager2.default.BUTTON_CLICKED, { 'data': index });
			});
		};

		for (var index = 0; index < buttons.length; index++) {
			_loop(index);
		}
		gamePadButtonsActive = true;
	}

	// Change HTML interface to reflect solution satus
	function updateButtonState(id) {
		if (id === null) {
			for (var index = 0; index < buttons.length; index++) {
				buttons[index].classList.remove('correct');
			}
		} else {
			if (!buttons[id].classList.contains('look')) {
				buttons[id].classList.add('correct');
			}
		}
	}

	// Set click listeners for interface buttons which allow user to navigate through game interface
	function addClickListeners() {
		// Some pages have internal/external versions, which require different buttons to be hooked up
		if (gameType === _stateManager2.default.INTERNAL) {
			document.querySelector('.panel-button.how-to-play').addEventListener('click', function () {
				return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.HOW_TO });
			});
			document.querySelector('.panel-button.back').addEventListener('click', function () {
				return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.BACK });
			});
		} else {
			document.querySelector('.panel-button.how-to-play-external').addEventListener('click', function () {
				return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.HOW_TO });
			});
			document.querySelector('.panel-button.back-external').addEventListener('click', function () {
				return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.BACK });
			});
		}

		document.querySelector('.panel-button.watch-film').addEventListener('click', function () {
			return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.VIDEO });
		});

		document.querySelector('.panel-button.play-again').addEventListener('click', function (evt) {
			evt.preventDefault();
			callPlayAgain();
		});
		document.querySelector('.panel-button.play-again-board').addEventListener('click', function (evt) {
			evt.preventDefault();
			callPlayAgain();
		});
		document.querySelector('.game-option-buttons .reset').addEventListener('click', function (evt) {
			evt.preventDefault();
			callPlayAgain();
		});
	}

	function callPlayAgain() {
		if (replayLocked) {
			/* Stop replay / play again being clicked multiple times FBz 82387 */
			return;
		}
		_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.PLAY_AGAIN });
		replayLocked = true;
	}

	// Toggle audio on user interaction
	document.querySelector('.game-option-buttons .mute').addEventListener('click', function (evt) {
		evt.preventDefault();handleMuteToggle();
	});
	function handleMuteToggle() {
		document.querySelector('.game-option-buttons .mute').classList.toggle('muted');
		_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _EventManager2.default.MUTE_TOGGLE });
	}

	// Set click listeners on T&C links in all views
	var tncLinks = [].slice.call(document.querySelectorAll('.tnc-link')); // grab all .tnc links as array
	for (var index = 0; index < tncLinks.length; index++) {
		tncLinks[index].addEventListener('click', function () {
			return _EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.TNC });
		});
	}

	// Toggle game counter clock visablity - to remove non-essentail movemovement from game if user desires
	clockToggle.addEventListener('click', function () {
		return toggleClock();
	});
	function toggleClock() {
		clockWrapper.classList.toggle('closed');
	}

	// Add all filter grids to render queue
	gridCanvas = new _canvas2.default(CANVAS_ID, 'game-canvas', canvasWidth, canvasHeight, function (gridCanvas) {
		for (var _index = 0; _index < gridManager.matteGrids.length; _index++) {
			gridManager.matteGrids[_index].render(gridCanvas);
		}
	});

	// Called each frome to render game canvas and update timer
	function gameRenderLoop() {
		gridCanvas.render();
		gameTimer.update();
		// eslint-disable-next-line no-undef
		requestAnimFrame(gameRenderLoop); // -- RAF imported with polyfills.js
	}

	function startRendering() {
		gameRenderLoop();
	}

	// Check if playing with a hash - this toggles game features (entry form) for internal or external play
	function checkEventHash() {
		var eventName = window.location.hash.slice(1);
		gameType = eventName !== undefined && eventName !== '' ? _stateManager2.default.EXTERNAL : _stateManager2.default.INTERNAL;
		_EventManager.eventManager.dispatch(_EventManager2.default.EVENT_NAME, { 'data': gameType });
	}

	/* We are seeing performance hit on these devices.
 	Remove extranious elements. */
	function isNotLegacyIPhone() {
		var windowH = window.innerHeight,
		    windowW = window.innerWidth,
		    valid = true;
		if (windowH === 320 || windowW === 320) {
			valid = false;
		} else if (windowH === 375 || windowW === 375) {
			valid = false;
		} else if (windowH === 414 || windowW === 414) {
			valid = false;
		}
		return valid;
	}

	setupEvents();
	checkEventHash();

	if (isNotLegacyIPhone() && gameType === _stateManager2.default.INTERNAL) {
		// These are the champagne bubbles, for subtle visual effect
		bubbles1 = new _bubbles2.default('bubbles_1');
		bubbles2 = new _bubbles2.default('bubbles_2');
	}
	addClickListeners();
	startRendering();

	_stateManager.stateManager.updateDOM();

	// eventManager.subscribe('CAKE', () => { console.log('get cake')} );
	// eventManager.subscribe('CAKE', () => { console.log('eat cake')} );
	// eventManager.unsubscribe('CAKE', () => { console.log('get cake')} );
})(); // Singleton

// Singleton

},{"./EventManager.js":1,"./bubbles":3,"./canvas":4,"./formManager":6,"./gameTimer":7,"./gridManager":10,"./helpers":11,"./introVideo":12,"./pinWatcher":15,"./polyfills":16,"./replayCount":17,"./resultsManager":18,"./sfxManager":19,"./stateManager":20}],14:[function(require,module,exports){
'use strict';

/* Map of cells to cover/reveal windows.
	Each of a,b,c,d reflects a group of cells which can be affected by a single button */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MeshData = function () {
	function MeshData() {
		var flip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		_classCallCheck(this, MeshData);

		this.mesh = ['d', 'd', 'd', 'd', 'd', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'a', 'a', 'a', 'd', 'd', 'd', 'd', 'd', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'a', 'a', 'a', 'd', 'd', 'd', 'd', 'd', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'a', 'a', 'a', 'd', 'b', 'c', 'a', 'b', 'b', 'a', 'a', 'c', 'd', 'd', 'b', 'b', 'b', 'b', 'd', 'b', 'c', 'a', 'b', 'b', 'a', 'a', 'c', 'd', 'a', 'a', 'a', 'a', 'a', 'd', 'b', 'c', 'a', 'b', 'b', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'd', 'b', 'c', 'a', 'b', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'd', 'b', 'c', 'a', 'b', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'b', 'c', 'a', 'b', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'b', 'c', 'a', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'd', 'b', 'c', 'a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'd', 'a', 'c', 'a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'd', 'a', 'c', 'c', 'b', 'd', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'd', 'a', 'd', 'c', 'b', 'd', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'a', 'd', 'c', 'b', 'd', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'a', 'd', 'c', 'b', 'd', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'a', 'd', 'd', 'b', 'd', 'b', 'a', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'c', 'a', 'd', 'd', 'b', 'd', 'b', 'a', 'd', 'd', 'd', 'd', 'd', 'd', 'd'];
		if (flip) {
			this.flip();
		}
	}

	/* This reverses the sequence so each of the two buildings can share this data, but not be identical */


	_createClass(MeshData, [{
		key: 'flip',
		value: function flip() {
			this.mesh = this.mesh.reverse();
		}
	}]);

	return MeshData;
}();

exports.default = MeshData;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

/* Keeps watch on the current solved state of the PIN solution
	Is responsible to dispatch event when the puzzle is solved, which stops clock, triggers end sequence etc. */

var PinWatcher = function () {
	function PinWatcher() {
		var _this = this;

		_classCallCheck(this, PinWatcher);

		this.pin;
		this.solvedSequence = [];

		/* Check for right but wrong - correct numbers, wrong sequence */
		this.pinOrdered = []; // holds version of PIN, but sorted
		this.keyStack = [-1, -1, -1, -1]; // last four number
		this.rightButWrong = false;

		_EventManager.eventManager.subscribe(_EventManager2.default.SOLUTION_SEQUENCE, function (evt) {
			_this.setPin(evt.data);
		});
	}

	_createClass(PinWatcher, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			_EventManager.eventManager.subscribe(_EventManager2.default.BUTTON_CLICKED, function (evt) {
				_this2.handleGateSwitch(evt.data);
			});
		}

		/* Reference to winning PIN */

	}, {
		key: 'setPin',
		value: function setPin(pin) {
			this.pin = pin;
			this.pinOrderedString = this.pin.slice().sort().toString();
			this.keyStack = [-1, -1, -1, -1];
			this.resetSolvedSequence();

			// logging out solution for faster testing
			console.log('PIN:', this.pin.map(function (val) {
				return val + 1;
			}).toString());
		}

		/* Clears any stored (partial) solution
  	Dispatches update to broadcast reset */

	}, {
		key: 'resetSolvedSequence',
		value: function resetSolvedSequence() {
			this.solvedSequence = [];
			_EventManager.eventManager.dispatch(_EventManager2.default.PIN_UPDATE, { 'data': null });
		}
	}, {
		key: 'handleGateSwitch',
		value: function handleGateSwitch(id) {
			// Check if correct keys, but (potentially) wrong order
			this.rightButWrong = false;
			this.keyStack.unshift(id);
			this.keyStack.pop();
			if (this.keyStack.slice().sort().toString() === this.pinOrderedString) {
				this.rightButWrong = true;
			}

			// console.log(this.keyStack.slice().sort().toString(), this.pinOrderedString)

			// zero based IDs
			if (id === this.pin[this.solvedSequence.length]) {
				this.solvedSequence.push(id);
				_EventManager.eventManager.dispatch(_EventManager2.default.PIN_UPDATE, { 'data': id });
				if (this.solvedSequence.length === this.pin.length && this.solvedSequence.toString() === this.pin.toString()) {
					_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.WINNER });
				}
			} else {
				// PIN was wrong - reset PIN pad
				this.resetSolvedSequence();
				_EventManager.eventManager.dispatch(_EventManager2.default.PIN_UPDATE, { 'data': null });

				/* Numbers correct but wrong order. Request UI update
    	Send through keys pressed, just in case... */
				if (this.rightButWrong) {
					_EventManager.eventManager.dispatch(_stateManager2.default.RIGHT_BUT_WRONG, { 'data': this.keyStack });
				}
			}
		}
	}]);

	return PinWatcher;
}();
// export let pinWatcher = new PinWatcher();


exports.default = PinWatcher;

},{"./EventManager.js":1,"./stateManager":20}],16:[function(require,module,exports){
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable id-length */
'use strict';

/* Utilities */

window.mobilecheck = function () {
	var check = false;

	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			check = true;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

/* Polyfills */
window.requestAnimFrame = function () {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
		window.setTimeout(callback, 1000 / 60);
	};
}();

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.replayCount = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* A game view which displays a countdown into the game, after the initial play, which is preceeded by the video */
var ReplayCount = function () {
	function ReplayCount() {
		var _this = this;

		_classCallCheck(this, ReplayCount);

		this.countdown = document.querySelector('.replay-count');
		this.counter = 3;
		this.countDownRunning = false;
		this.countdownDuration = 3.5;

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			if (evt.data === _stateManager2.default.PLAY_AGAIN) {
				_this.init();
			}
		});
	}

	_createClass(ReplayCount, [{
		key: 'init',
		value: function init() {
			this.counter = 3;
			this.countDownRunning = true;
			this.countDown();
		}

		/* Recursive method to update DOM countdown visual */

	}, {
		key: 'countDown',
		value: function countDown() {
			var _this2 = this;

			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.COUNTDOWN });
			this.countdown.innerHTML = 'in...<br><span class="counter">' + this.counter-- + '</span>';
			setTimeout(function () {
				return _this2.counter === 0 ? _this2.presetPlay() : _this2.countDown();
			}, 1000);
		}

		/* Final update of DOM countdown visual */

	}, {
		key: 'presetPlay',
		value: function presetPlay() {
			var _this3 = this;

			this.countdown.innerHTML = 'in...<br><span class="counter">' + this.counter + '</span>';
			setTimeout(function () {
				return _this3.pushToPlay();
			}, 600);
		}

		/* Event to start game */

	}, {
		key: 'pushToPlay',
		value: function pushToPlay() {
			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.PLAYING });
		}
	}]);

	return ReplayCount;
}();

exports.default = ReplayCount;
var replayCount = exports.replayCount = new ReplayCount();

},{"./EventManager.js":1,"./stateManager":20}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resultsManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

var _gameTimerUtils = require('./gameTimerUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Singleton to manage DB interactions, parsing and display of results */
var ResultsManager = function () {
	function ResultsManager() {
		var _this = this;

		_classCallCheck(this, ResultsManager);

		this.resultsURL = 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/leaderboard.json';
		// this.resultsURL = '/leaderboard.json';
		this.score = 0;
		this.playerName;
		this.playerEmail;

		this.submitCache;

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			if (evt.data === _EventManager2.default.SEND_DATA) {
				_this.playerName = evt.thisPlayerName;
				_this.playerEmail = evt.thisPlayerEmail;
				_this.improvedScore = false;
				// this.sendResult(evt);
				_this.submitCache = evt;
				_this.preFetchScores();
			}
		});
		_EventManager.eventManager.subscribe(_stateManager2.default.SCORE, function (evt) {
			_this.score = evt.raw;
			//console.log('score (time) for DB', evt.raw);
		});

		_EventManager.eventManager.subscribe(_EventManager2.default.EVENT_NAME, function (evt) {
			if (evt === _stateManager2.default.EXTERNAL) {
				_this.resultsURL = 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/leaderboard-plsa.json';
			}
		});

		this.resultFields;
		this.resultDBEntries = [];
		this.grabDOM();
	}

	// Gather and hold a reference to leaderboard fields, ready for populating


	_createClass(ResultsManager, [{
		key: 'grabDOM',
		value: function grabDOM() {
			this.resultFields = [].slice.call(document.querySelectorAll('.player-result'));
		}

		/* Before submitting we need to grab existing scores and check current score isn't lower
  	...because no facility for this on the server */

	}, {
		key: 'preFetchScores',
		value: function preFetchScores() {
			var _this2 = this;

			// grab results from DB
			//console.log(this.resultsURL);
			var request = new XMLHttpRequest();
			request.open('GET', this.resultsURL);
			request.responseType = 'json';
			request.onload = function (evt) {
				if (evt.srcElement.status >= 200 && evt.srcElement.status < 400) {
					// on success...
					_this2.parsePreFetchData(evt.srcElement.response);
				} else {
					// We reached our target server, but it returned an error
					_this2.handleDBError(evt.srcElement.response);
				}
			};
			request.onerror = function () {
				// There was a connection error of some sort
				_this2.handleDBError();
			};
			request.send();
		}

		/* Bring back score data to check if new score is better */

	}, {
		key: 'parsePreFetchData',
		value: function parsePreFetchData(resp) {
			/* Do full parse of data, so we can write leaderboard if score is NOT better */
			var improvedScore = false;
			var newUser = true;
			this.resultDBEntries.length = 0;
			if (typeof resp === 'string') {
				resp = JSON.parse(resp);
			}
			for (var index = 0; index < resp.elements.length; index++) {
				var dat = {};
				dat.name = resp.elements[index].fieldValues[4].value;
				dat.score = Number(resp.elements[index].fieldValues[3].value);
				dat.uid = resp.elements[index].uniqueCode;
				this.resultDBEntries.push(dat);

				/* If DB UID (email) == player, check score */
				if (resp.elements[index].fieldValues[0].value === this.playerEmail) {
					newUser = false;
					if (dat.score > this.score) {
						improvedScore = true;
					}
				}
			}

			/* If current score is better (smaller), submit it
   	otherwise write and load leaderboard */
			if (improvedScore || newUser) {
				/* Send score to DB.
    	This will also trigger re-load of scores.
    	Could easily be improved. Just run comparison on values to write to leaderboard,
    	and insert this user if required, and only send score if there is improvement, without re-parsing.
    	But needed super fast fix.
    	I am so sorry. */
				/* Nick should never be sorry. He is wonderful */
				this.sendResult(this.submitCache);
			} else {
				// Ensure results are sorted numerically
				this.sortByKey(this.resultDBEntries, 'score');

				// Write results to leaderboard
				this.writeResults();

				// Broadcast leaderboard ready event
				_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.LEADERBOARD });
			}
		}
	}, {
		key: 'sendResult',
		value: function sendResult(evt) {
			var _this3 = this;

			// send result to DB - evt.submitData;
			//console.log('data sent via api - ', evt.submitData);
			var request = new XMLHttpRequest();
			request.open('POST', 'https://s1911602307.t.eloqua.com/e/f2');
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.onload = function () {
				if (request.status === 200) {
					setTimeout(function () {
						_this3.loadScoreTable();
					}, 500);
				} else if (request.status !== 200) {}
			};
			request.send(evt.submitData);
		}

		/* Load in results */

	}, {
		key: 'loadScoreTable',
		value: function loadScoreTable() {
			var _this4 = this;

			// grab results from DB
			var request = new XMLHttpRequest();
			request.open('GET', this.resultsURL);
			request.responseType = 'json';
			request.onload = function (evt) {
				if (evt.srcElement.status >= 200 && evt.srcElement.status < 400) {
					// on success...
					_this4.parseData(evt.srcElement.response);
				} else {
					// We reached our target server, but it returned an error
					_this4.handleDBError(evt.srcElement.response);
				}
			};
			request.onerror = function () {
				// There was a connection error of some sort
				_this4.handleDBError();
			};
			request.send('score=' + this.score);
		}
	}, {
		key: 'handleDBError',
		value: function handleDBError() {
			var err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

			// Do something interfacy to show the error
			console.log('Error...', err);
		}
	}, {
		key: 'parseData',
		value: function parseData(resp) {
			// parse score data
			this.resultDBEntries.length = 0;
			if (typeof resp === 'string') {
				resp = JSON.parse(resp);
			}
			for (var index = 0; index < resp.elements.length; index++) {
				var dat = {};
				dat.name = resp.elements[index].fieldValues[4].value;
				dat.score = Number(resp.elements[index].fieldValues[3].value);
				dat.uid = resp.elements[index].uniqueCode;
				this.resultDBEntries.push(dat);
			}
			// Ensure results are sorted numerically
			this.sortByKey(this.resultDBEntries, 'score');

			// Write results to leaderboard
			this.writeResults();

			// Broadcast leaderboard ready event
			_EventManager.eventManager.dispatch(_EventManager2.default.CHANGE_STATE, { 'data': _stateManager2.default.LEADERBOARD });
		}
	}, {
		key: 'sortByKey',
		value: function sortByKey(array, key) {
			return array.sort(function (a, b) {
				var x = a[key];
				var y = b[key];
				return x < y ? -1 : x > y ? 1 : 0;
			});
		}
	}, {
		key: 'writeResults',
		value: function writeResults() {
			var loop = this.resultDBEntries.length >= 10 ? 10 : this.resultDBEntries.length;
			for (var index = 0; index < loop; index++) {
				var leader = this.resultDBEntries[index];
				this.resultFields[index].querySelector('.player-name p').innerHTML = leader.name.substring(0, 20); // leader.firstName + ' ' + leader.lastName;
				this.resultFields[index].querySelector('.player-score p').innerHTML = _gameTimerUtils.gameTimerUtils.reportMMSSTH(leader.score);
			}

			// Now populate player score in unique field
			document.querySelector('.your-score .player-name p').innerHTML = this.playerName.substring(0, 20);
			document.querySelector('.your-score .player-score p').innerHTML = _gameTimerUtils.gameTimerUtils.reportMMSSTH(this.score);
		}
	}]);

	return ResultsManager;
}();

exports.default = ResultsManager;
var resultsManager = exports.resultsManager = new ResultsManager();

},{"./EventManager.js":1,"./gameTimerUtils":8,"./stateManager":20}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sfxManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _audioSprite = require('./audioSprite');

var _audioSprite2 = _interopRequireDefault(_audioSprite);

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _stateManager = require('./stateManager');

var _stateManager2 = _interopRequireDefault(_stateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

/* Creates and controls the playback of audio fragments (audioSprites) within the game */

var SFXManager = function () {
	_createClass(SFXManager, null, [{
		key: 'ATMOS',
		get: function get() {
			return 0;
		}
	}, {
		key: 'CLICK',
		get: function get() {
			return 1;
		}
	}, {
		key: 'COUNTDOWN',
		get: function get() {
			return 2;
		}
	}, {
		key: 'TAA_DAA',
		get: function get() {
			return 3;
		}
	}]);

	function SFXManager() {
		var _this = this;

		_classCallCheck(this, SFXManager);

		// eslint-disable-next-line no-unused-vars
		var AudioContext = window.AudioContext || window.webkitAudioContext;

		this.isAvailable = false;
		this.muted = false;
		this.context = undefined;
		this.audioSprites = [];
		this.justToggled = false;
		this.justToggledTimer = null;
		this.checkAvailable();

		_EventManager.eventManager.subscribe(_EventManager2.default.BUTTON_CLICKED, function () {
			_this.playSFX(SFXManager.CLICK);
		});
		_EventManager.eventManager.subscribe(_EventManager2.default.COUNTDOWN, function () {
			_this.playSFX(SFXManager.COUNTDOWN);
		});
		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			switch (evt.data) {
				case _stateManager2.default.VIDEO:
				case _stateManager2.default.PLAY_AGAIN:
					_this.playSFX(SFXManager.ATMOS);
					break;

				case _stateManager2.default.COUNTDOWN:
					_this.playSFX(SFXManager.COUNTDOWN);
					break;

				case _stateManager2.default.WINNER:
					_this.killAll();
					_this.playSFX(SFXManager.TAA_DAA);
					break;

				case _EventManager2.default.MUTE_TOGGLE:
					_this.toggleOnOff();
					break;
			}
		});

		_EventManager.eventManager.subscribe(_EventManager2.default.EVENT_NAME, function (evt) {
			if (evt === _stateManager2.default.EXTERNAL) {
				_this.isAvailable = false;
				_this.killAll();
				_this.hideAudioUI();
			}
		});
	}

	_createClass(SFXManager, [{
		key: 'checkAvailable',
		value: function checkAvailable() {
			try {
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.context = new window.AudioContext();
				this.isAvailable = true;
				this.generate();
			} catch (evt) {
				// console.log('Web Audio API error:', evt);
			}

			if (!this.isAvailable) {
				this.hideAudioUI();
			}
		}
	}, {
		key: 'hideAudioUI',
		value: function hideAudioUI() {
			document.querySelector('.game-option-buttons .mute').style.display = 'none';
		}

		/* Create AudioSprites, ready for use. */

	}, {
		key: 'generate',
		value: function generate() {
			//										id, 					src, 					spriteLength,	startPoint, 	loop, 	audioLead,	volume, muted
			this.audioSprites.push(new _audioSprite2.default(SFXManager.ATMOS, 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/audio/audioSprite', 21.7, 0, true, 0, .1, this.muted));
			this.audioSprites.push(new _audioSprite2.default(SFXManager.CLICK, 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/audio/audioSprite', 0.1, 21.8, false, 0, .2, this.muted));
			this.audioSprites.push(new _audioSprite2.default(SFXManager.COUNTDOWN, 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/audio/audioSprite', 3.5, 23.1, false, 0, .5, this.muted));
			this.audioSprites.push(new _audioSprite2.default(SFXManager.TAA_DAA, 'https://campaigns.aberdeenstandard.com/ASI-capabilities/gameface/audio/audioSprite', 2.5, 26.5, false, 0, 1, this.muted));
		}

		/* Call audiosprite to play */

	}, {
		key: 'playSFX',
		value: function playSFX(id) {
			if (!this.isAvailable) {
				return;
			}
			this.audioSprites[id].play();
		}
	}, {
		key: 'toggleOnOff',
		value: function toggleOnOff() {
			var _this2 = this;

			if (this.justToggled) {
				return false;
			}

			this.muted = !this.muted;
			for (var loop = this.audioSprites.length, iterator = 0; iterator < loop; iterator++) {
				this.audioSprites[iterator].mute(this.muted);
			}

			this.justToggled = true;
			setTimeout(function () {
				return _this2.justToggled = false;
			}, 500);
		}
	}, {
		key: 'changeVolume',
		value: function changeVolume(id, value) {
			try {
				this.audioSprites[id].changeVolume(this.audioSprites[id].volume += value);
			} catch (evt) {
				// throw new Error('SFXManager.changeVolume()', evt);
			}
		}
	}, {
		key: 'killAll',
		value: function killAll() {
			for (var loop = this.audioSprites.length, iterator = 0; iterator < loop; iterator++) {
				this.audioSprites[iterator].stop();
				this.audioSprites[iterator].volume = this.audioSprites[iterator].resetVolume;
			}
		}
	}, {
		key: 'endGame',
		value: function endGame() {
			this.killAll();
			this.playSFX(this.BOING);
		}
	}]);

	return SFXManager;
}();

exports.default = SFXManager;
var sfxManager = exports.sfxManager = new SFXManager();

},{"./EventManager.js":1,"./audioSprite":2,"./stateManager":20}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.stateManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventManager = require('./EventManager.js');

var _EventManager2 = _interopRequireDefault(_EventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Holds state of game.
	Controls DOM elements accordingly */
var StateManager = function () {
	_createClass(StateManager, null, [{
		key: 'WELCOME',
		get: function get() {
			return 'welcome';
		}
	}, {
		key: 'HOW_TO',
		get: function get() {
			return 'how to play';
		}
	}, {
		key: 'VIDEO',
		get: function get() {
			return 'video';
		}
	}, {
		key: 'COUNTDOWN',
		get: function get() {
			return 'countdown';
		}
	}, {
		key: 'PLAYING',
		get: function get() {
			return 'playing';
		}
	}, {
		key: 'RIGHT_BUT_WRONG',
		get: function get() {
			return 'wrong order';
		}
	}, {
		key: 'PLAY_AGAIN',
		get: function get() {
			return 'reset and play';
		}
	}, {
		key: 'WINNER',
		get: function get() {
			return 'winner';
		}
	}, {
		key: 'SCORE',
		get: function get() {
			return 'score';
		}
	}, {
		key: 'LEADERBOARD',
		get: function get() {
			return 'leaderboard';
		}
	}, {
		key: 'TNC',
		get: function get() {
			return 'TnCs';
		}
	}, {
		key: 'BACK',
		get: function get() {
			return 'return from TnCs';
		}
	}, {
		key: 'ORIENTATION_WARNING',
		get: function get() {
			return 'orientation warning';
		}
	}, {
		key: 'EXTERNAL',
		get: function get() {
			return 'external game';
		}
	}, {
		key: 'INTERNAL',
		get: function get() {
			return 'internal game';
		}
	}]);

	function StateManager() {
		var _this = this;

		_classCallCheck(this, StateManager);

		this.state = StateManager.WELCOME;
		this.cachedState;

		this.uiPanels = document.querySelector('.ui-panels');
		this.welcomePanel;
		this.howToPanel = document.querySelector('.ui-panel.how-to');
		this.videoPanel = document.querySelector('.ui-panel.video');
		this.winnerPanel;
		this.playerScore;
		this.leaderPanel = document.querySelector('.ui-panel.leader-board');
		this.countDownPanel = document.querySelector('.ui-panel.count-down');
		this.tncPanel = document.querySelector('.tnc');
		this.resetButton = document.querySelector('.game-option-buttons .reset');

		this.rightWrongMessage = document.querySelector('.game-panels');

		this.winnerDelay;

		_EventManager.eventManager.subscribe(_EventManager2.default.CHANGE_STATE, function (evt) {
			_this.changeState(evt.data);
		});
		_EventManager.eventManager.subscribe(StateManager.SCORE, function (evt) {
			_this.playerScore.innerHTML = evt.data;
		});
		_EventManager.eventManager.subscribe(_EventManager2.default.EVENT_NAME, function (evt) {
			return _this.setGameType(evt.data);
		});
		_EventManager.eventManager.subscribe(_EventManager2.default.PIN_UPDATE, function () {
			return _this.clearRightButWrong();
		});
		_EventManager.eventManager.subscribe(StateManager.RIGHT_BUT_WRONG, function (evt) {
			return _this.showRightButWrong(evt.data);
		});
	}

	/* Sets variable dom elements for use, based on INTERNAL / EXTERNAL game
 	This removes need for logic on page/state swap */


	_createClass(StateManager, [{
		key: 'setGameType',
		value: function setGameType(gameType) {
			if (gameType === StateManager.EXTERNAL) {
				this.playerScore = document.querySelector('.your-score-external');
				this.tncPanel = document.querySelector('.tnc-external');
				this.welcomePanel = document.querySelector('.ui-panel.welcome-external');
				this.winnerPanel = document.querySelector('.ui-panel.winner-external');
			} else {
				this.playerScore = document.querySelector('.your-score');
				this.tncPanel = document.querySelector('.tnc');
				this.welcomePanel = document.querySelector('.ui-panel.welcome');
				this.winnerPanel = document.querySelector('.ui-panel.winner');
			}

			this.allThePanels = [this.welcomePanel, this.howToPanel, this.videoPanel, this.winnerPanel, this.leaderPanel, this.countDownPanel, this.tncPanel];
		}
	}, {
		key: 'changeState',
		value: function changeState(state) {
			if (state === StateManager.TNC) {
				this.cachedState = this.state;
			}
			this.state = state;
			this.updateDOM(state);
		}
	}, {
		key: 'closeAllPanels',
		value: function closeAllPanels() {
			for (var loop = this.allThePanels.length, index = 0; index < loop; index++) {
				this.allThePanels[index].classList.remove('open');
			}
			this.uiPanels.classList.remove('hi-top');
			this.clearRightButWrong();
		}
	}, {
		key: 'showRightButWrong',
		value: function showRightButWrong(nums) {
			this.rightWrongMessage.querySelector('.key-stack').innerHTML = ' <br>(' + nums + ')';
			this.rightWrongMessage.classList.add('open');
		}
	}, {
		key: 'clearRightButWrong',
		value: function clearRightButWrong() {
			this.rightWrongMessage.classList.remove('open');
		}

		// Create random placement and order for subtractive filters

	}, {
		key: 'updateDOM',
		value: function updateDOM() {
			switch (this.state) {
				case StateManager.WELCOME:
					this.uiPanels.classList.add('open');
					this.welcomePanel.classList.add('open');
					break;

				case StateManager.HOW_TO:
					this.closeAllPanels();
					this.howToPanel.classList.add('open');
					break;

				case StateManager.VIDEO:
					this.closeAllPanels();
					this.videoPanel.classList.add('open');
					break;

				case StateManager.PLAYING:
					document.querySelector('.btn-grid').classList.remove('hidden');
					document.querySelector('.clock-wrapper').classList.remove('hidden');
					this.resetButton.classList.remove('hidden');
					this.uiPanels.classList.remove('open');
					this.closeAllPanels();
					break;

				case StateManager.PLAY_AGAIN:
					clearTimeout(this.winnerDelay);
					this.closeAllPanels();
					this.resetButton.classList.add('hidden');
					this.uiPanels.classList.add('open');
					this.countDownPanel.classList.add('open');
					document.querySelector('.ui-panel.leader-board').classList.remove('open');
					break;

				case StateManager.WINNER:
					this.setWinner();
					break;

				case StateManager.LEADERBOARD:
					this.closeAllPanels();
					this.leaderPanel.classList.add('open');
					// call DB etc
					break;

				case StateManager.TNC:
					this.tncPanel.classList.add('open');
					break;

				case StateManager.BACK:
					this.tncPanel.classList.remove('open');
					this.changeState(this.cachedState);
					break;

				case StateManager.ORIENTATION_WARNING:
					// pause game if state == playing
					// show orientation overlay
					break;
			}
		}

		/* Separate method to make timeout delay simpler and more transparent */

	}, {
		key: 'setWinner',
		value: function setWinner() {
			var _this2 = this;

			this.clearRightButWrong();
			this.winnerDelay = setTimeout(function () {
				_this2.uiPanels.classList.add('open');
				_this2.uiPanels.classList.add('hi-top');
				_this2.winnerPanel.classList.add('open');
			}, 1200);
		}
	}]);

	return StateManager;
}();

exports.default = StateManager;
var stateManager = exports.stateManager = new StateManager();

},{"./EventManager.js":1}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXEV2ZW50TWFuYWdlci5qcyIsInNyY1xcc2NyaXB0c1xcYXVkaW9TcHJpdGUuanMiLCJzcmNcXHNjcmlwdHNcXGJ1YmJsZXMuanMiLCJzcmNcXHNjcmlwdHNcXGNhbnZhcy5qcyIsInNyY1xcc2NyaXB0c1xcY2VsbC5qcyIsInNyY1xcc2NyaXB0c1xcZm9ybU1hbmFnZXIuanMiLCJzcmNcXHNjcmlwdHNcXGdhbWVUaW1lci5qcyIsInNyY1xcc2NyaXB0c1xcZ2FtZVRpbWVyVXRpbHMuanMiLCJzcmNcXHNjcmlwdHNcXGdyaWQuanMiLCJzcmNcXHNjcmlwdHNcXGdyaWRNYW5hZ2VyLmpzIiwic3JjXFxzY3JpcHRzXFxoZWxwZXJzLmpzIiwic3JjXFxzY3JpcHRzXFxpbnRyb1ZpZGVvLmpzIiwic3JjXFxzY3JpcHRzXFxtYWluLmpzIiwic3JjXFxzY3JpcHRzXFxtZXNoLmpzIiwic3JjXFxzY3JpcHRzXFxwaW5XYXRjaGVyLmpzIiwic3JjXFxzY3JpcHRzXFxwb2x5ZmlsbHMuanMiLCJzcmNcXHNjcmlwdHNcXHJlcGxheUNvdW50LmpzIiwic3JjXFxzY3JpcHRzXFxyZXN1bHRzTWFuYWdlci5qcyIsInNyY1xcc2NyaXB0c1xcc2Z4TWFuYWdlci5qcyIsInNyY1xcc2NyaXB0c1xcc3RhdGVNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUE7Ozs7Ozs7Ozs7O0lBRXFCLFk7OztzQkFDUTtBQUMzQixVQUFPLGdCQUFQO0FBQ0E7OztzQkFDeUI7QUFDekIsVUFBTyxjQUFQO0FBQ0E7OztzQkFDdUI7QUFDdkIsVUFBTyxnQkFBUDtBQUNBOzs7c0JBQ3dCO0FBQ3hCLFVBQU8sY0FBUDtBQUNBOzs7c0JBQ3VCO0FBQ3ZCLFVBQU8sWUFBUDtBQUNBOzs7c0JBQ3NCO0FBQ3RCLFVBQU8sV0FBUDtBQUNBOzs7c0JBQzhCO0FBQzlCLFVB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QUE3RixFQUFpRyxHQUFqRyxFQUFxRyxHQUFyRyxFQUF5RyxHQUF6RyxFQUE2RyxHQUE3RyxFQUFpSCxHQUFqSCxFQUFxSCxHQUFySCxFQUF5SCxHQUF6SCxFQUE2SCxHQUE3SCxFQUFpSSxHQUFqSSxFQUFxSSxHQUFySSxFQUF5SSxHQUF6SSxFQUE2SSxHQUE3SSxFQUFpSixHQUFqSixFQUFxSixHQUFySixFQUF5SixHQUF6SixFQUE2SixHQUE3SixFQUFpSyxHQUFqSyxFQUFxSyxHQUFySyxFQUF5SyxHQUF6SyxFQUE2SyxHQUE3SyxFQUFpTCxHQUFqTCxFQUFxTCxHQUFyTCxFQUF5TCxHQUF6TCxFQUE2TCxHQUE3TCxFQUFpTSxHQUFqTSxFQUFxTSxHQUFyTSxFQUF5TSxHQUF6TSxFQUE2TSxHQUE3TSxFQUFpTixHQUFqTixFQUFxTixHQUFyTixFQUF5TixHQUF6TixFQUE2TixHQUE3TixFQUFpTyxHQUFqTyxFQUFxTyxHQUFyTyxFQUF5TyxHQUF6TyxFQUE2TyxHQUE3TyxFQUFpUCxHQUFqUCxFQUFxUCxHQUFyUCxFQUF5UCxHQUF6UCxFQUE2UCxHQUE3UCxFQUFpUSxHQUFqUSxFQUFxUSxHQUFyUSxFQUF5USxHQUF6USxFQUE2USxHQUE3USxFQUFpUixHQUFqUixFQUFxUixHQUFyUixFQUF5UixHQUF6UixFQUE2UixHQUE3UixFQUFpUyxHQUFqUyxFQUFxUyxHQUFyUyxFQUF5UyxHQUF6UyxFQUE2UyxHQUE3UyxFQUFpVCxHQUFqVCxFQUFxVCxHQUFyVCxFQUF5VCxHQUF6VCxFQUE2VCxHQUE3VCxFQUFpVSxHQUFqVSxFQUFxVSxHQUFyVSxFQUF5VSxHQUF6VSxFQUE2VSxHQUE3VSxFQUFpVixHQUFqVixFQUFxVixHQUFyVixFQUF5VixHQUF6VixFQUE2VixHQUE3VixFQUFpVyxHQUFqVyxFQUFxVyxHQUFyVyxFQUF5VyxHQUF6VyxFQUE2VyxHQUE3VyxFQUFpWCxHQUFqWCxFQUFxWCxHQUFyWCxFQUF5WCxHQUF6WCxFQUE2WCxHQUE3WCxFQUFpWSxHQUFqWSxFQUFxWSxHQUFyWSxFQUF5WSxH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QixTQUFwQixDQUE4QixHQUE5QixDQUFrQyxNQUFsQztBQUNBLGNBQVMsYUFBVCxDQUF1Qix3QkFBdkIsRUFBaUQsU0FBakQsQ0FBMkQsTUFBM0QsQ0FBa0UsTUFBbEU7QUFDQTs7QUFFRCxTQUFLLGFBQWEsTUFBbEI7QUFDQyxVQUFLLFNBQUw7QUFDQTs7QUFFRCxTQUFLLGFBQWEsV0FBbEI7QUFDQyxVQUFLLGNBQUw7QUFDQSxVQUFLLFdBQUwsQ0FBaUIsU0FBakIsQ0FBMkIsR0FBM0IsQ0FBK0IsTUFBL0I7QUFDQTtBQUNBOztBQUVELFNBQUssYUFBYSxHQUFsQjtBQUNDLFVBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsTUFBNUI7QUFDQTs7QUFFRCxTQUFLLGFBQWEsSUFBbEI7QUFDQyxVQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLE1BQS9CO0FBQ0EsVUFBSyxXQUFMLENBQWlCLEtBQUssV0FBdEI7QUFDQTs7QUFFRCxTQUFLLGFBQWEsbUJBQWxCO0FBQ0M7QUFDQTtBQUNBO0FBdkRGO0FBeURBOztBQUVEOzs7OzhCQUNZO0FBQUE7O0FBQ1gsUUFBSyxrQkFBTDtBQUNBLFFBQUssV0FBTCxHQUFtQixXQUFZLFlBQU07QUFDcEMsV0FBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixNQUE1QjtBQUNBLFdBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsUUFBNUI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsU0FBakIsQ0FBMkIsR0FBM0IsQ0FBK0IsTUFBL0I7QUFDQSxJQUprQixFQUloQixJQUpnQixDQUFuQjtBQUtBOzs7Ozs7a0JBak1tQixZO0FBbU1kLElBQUksc0NBQWUsSUFBSSxZQUFKLEVBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyogU2luZ2xldG9uIEV2ZW50IGRpc3BhdGNoZXJcblx0Q29vcmRpbmF0ZXMgYWxsIGdhbWUgZXZlbnRzIHRocm91Z2h0IHRoZSBhcHBsaWNhdGlvbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcblx0c3RhdGljIGdldCBCVVRUT05fQ0xJQ0tFRCgpIHtcblx0XHRyZXR1cm4gJ2J1dHRvbiBjbGlja2VkJztcblx0fVxuXHRzdGF0aWMgZ2V0IENIQU5HRV9TVEFURSgpIHtcblx0XHRyZXR1cm4gJ2NoYW5nZSBzdGF0ZSc7XG5cdH1cblx0c3RhdGljIGdldCBFVkVOVF9OQU1FKCkge1xuXHRcdHJldHVybiAnc2V0IGV2ZW50IG5hbWUnO1xuXHR9XG5cdHN0YXRpYyBnZXQgTVVURV9UT0dHTEUoKSB7XG5cdFx0cmV0dXJuICd0b2dnbGUgYXVkaW8nO1xuXHR9XG5cdHN0YXRpYyBnZXQgUElOX1VQREFURSgpIHtcblx0XHRyZXR1cm4gJ3BpbiB1cGRhdGUnO1xuXHR9XG5cdHN0YXRpYyBnZXQgU0VORF9EQVRBKCkge1xuXHRcdHJldHVybiAnc2VuZCBkYXRhJztcblx0fVxuXHRzdGF0aWMgZ2V0IFNPTFVUSU9OX1NFUVVFTkNFKCkge1xuXHRcdHJldHVybiAnc3VidHJhY3RpdmVHcmlkSWRzJztcblx0fVxuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuc3Vic2NyaWJlcnMgPSB7fTtcblx0fVxuXG5cdC8qIE90aGVyIHBvcnRpb25zIG9mIGNvZGUgcmVnaXN0ZXIgZGVzaXJlIHRvIGJlIG5vdGlmaWVkIG9mIHBhcnRpY3VsYXIgZXZlbnRzICovXG5cdHN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuXHRcdGlmICh0aGlzLnN1YnNjcmliZXJzW2V2ZW50XSkge1xuXHRcdFx0dGhpcy5zdWJzY3JpYmVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLnN1YnNjcmliZXJzW2V2ZW50XSA9IFtoYW5kbGVyXTtcblx0XHR9XG5cdH1cblxuXHQvKiBOb3RpZnkgY29kZSB3aGljaCBoYXMgcmVnaXN0ZXJlZCB0byBiZSBub3RpZmllZCBvZiBwYXJ0aWN1bGFyIGV2ZW50cyAqL1xuXHRkaXNwYXRjaChldmVudCwgZGF0YSkge1xuXHRcdGlmICh0aGlzLnN1YnNjcmliZXJzW2V2ZW50XSkge1xuXHRcdFx0dGhpcy5zdWJzY3JpYmVyc1tldmVudF0uZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKSB7XG5cdFx0XHRcdGhhbmRsZXIoZGF0YSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn1cbmV4cG9ydCBsZXQgZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBDb3JlIGNvZGUgZnJvbTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcmVteS83NTMwMDMgKi9cblxuLyogQSBjbGFzcyB0byBwbGF5IGEgcGFydCBvZiBsb2FkZWQgYXVkaW8uXG5cdERlcGVuZGFudCB1cG9uIFNGWE1hbmFnZXIgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9TcHJpdGUge1xuXHRjb25zdHJ1Y3RvcihpZCwgc3JjLCBzcHJpdGVMZW5ndGgsIHN0YXJ0UG9pbnQsIGxvb3AsIGF1ZGlvTGVhZCwgdm9sdW1lID0gMSwgbXV0ZWQgPSBmYWxzZSkge1xuXHRcdHRoaXMuYXVkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLmxvb3AgPSBsb29wO1xuXHRcdHRoaXMubXV0ZWQgPSBtdXRlZDtcblx0XHR0aGlzLnJlc2V0Vm9sdW1lID0gdm9sdW1lO1xuXHRcdHRoaXMuc3RhcnRQb2ludCA9IHN0YXJ0UG9pbnQ7XG5cdFx0dGhpcy50cmFjayA9IHRoaXM7XG5cdFx0dGhpcy52b2x1bWUgPSB2b2x1bWU7XG5cblx0XHRpZiAodGhpcy5hdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkge1xuXHRcdFx0dGhpcy5hdWRpby5zcmMgPSBzcmMgKyAnLm1wMyc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYXVkaW8uc3JjID0gc3JjICsgJy5vZ2cnO1xuXHRcdH1cblx0XHR0aGlzLmF1ZGlvLmF1dG9idWZmZXIgPSB0cnVlO1xuXHRcdHRoaXMuYXVkaW8ubG9hZCgpO1xuXHRcdHRoaXMuYXVkaW8ubXV0ZWQgPSB0cnVlO1xuXG5cdFx0dGhpcy51cGRhdGVDYWxsYmFjayA9IG51bGw7XG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cdFx0dGhpcy5sYXN0VXNlZCA9IDA7XG5cdFx0dGhpcy5zcHJpdGVMZW5ndGggPSBzcHJpdGVMZW5ndGg7XG5cdFx0dGhpcy5hdWRpb0xlYWQgPSBhdWRpb0xlYWQ7XG5cdH1cblxuXHQvKiBFZmZlY3RpdmVseSBhIHVzZXIgaW5pdGlhdGVkIHByZWxvYWQuIEJlY2F1c2UgaU9TLiAqL1xuXHRmb3JjZSgpIHtcblx0XHR0aGlzLmF1ZGlvLnBhdXNlKCk7XG5cdFx0dGhpcy5hdWRpby5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5JywgdGhpcy5mb3JjZSwgZmFsc2UpO1xuXHR9XG5cblx0cHJvZ3Jlc3MoKSB7XG5cdFx0dGhpcy5hdWRpby5yZW1vdmVFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHRoaXMucHJvZ3Jlc3MsIGZhbHNlKTtcblx0XHRpZiAodGhpcy50cmFjay51cGRhdGVDYWxsYmFjayAhPT0gbnVsbCkge1xuXHRcdFx0dGhpcy50cmFjay51cGRhdGVDYWxsYmFjaygpO1xuXHRcdH1cblx0fVxuXG5cdGtpY2tvZmYoKSB7XG5cdFx0dGhpcy5hdWRpby5wbGF5KCk7XG5cdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5raWNrb2ZmLCB0cnVlKTtcblx0fVxuXG5cdHBsYXkoKSB7XG5cdFx0bGV0XHR0cmFjayA9IHRoaXMsXG5cdFx0XHRhdWRpbyA9IHRoaXMuYXVkaW8sXG5cdFx0XHR0aW1lID0gdGhpcy5hdWRpb0xlYWQgKyB0aGlzLnN0YXJ0UG9pbnQsXG5cdFx0XHRuZXh0VGltZSA9IHRpbWUgKyB0aGlzLnNwcml0ZUxlbmd0aDtcblxuXHRcdGlmICh0aGlzLnBsYXlpbmcpIHtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdTb3JyeSwgdGhpcyBBdWRpb1Nwcml0ZSBpcyBidXN5LiBDb21lIGJhY2sgaW4nLCB0aGlzLnNwcml0ZUxlbmd0aCwgJ3NlY29uZHMnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMubXV0ZWQpIHtcblx0XHRcdGF1ZGlvLnZvbHVtZSA9IHRoaXMudm9sdW1lO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhdWRpby52b2x1bWUgPSAwO1xuXHRcdH1cblxuXHRcdGNsZWFySW50ZXJ2YWwodHJhY2sudGltZXIpO1xuXHRcdHRyYWNrLnBsYXlpbmcgPSB0cnVlO1xuXHRcdHRyYWNrLmxhc3RVc2VkID0gK25ldyBEYXRlKCk7XG5cblx0XHRhdWRpby5tdXRlZCA9IHRoaXMubXV0ZWQ7XG5cdFx0YXVkaW8ucGF1c2UoKTtcblx0XHR0cnkge1xuXHRcdFx0aWYgKHRpbWUgPT09IDAgKSB7XG5cdFx0XHRcdHRpbWUgPSAwLjAxOyAvLyB5YXkgaGFja3MuIFNvbWV0aW1lcyBzZXR0aW5nIHRpbWUgdG8gMCBkb2Vzbid0IHBsYXkgYmFja1xuXHRcdFx0fVxuXHRcdFx0YXVkaW8uY3VycmVudFRpbWUgPSB0aW1lO1xuXHRcdFx0YXVkaW8ucGxheSgpO1xuXHRcdH0gY2F0Y2ggKGV2dCkge1xuXHRcdFx0dGhpcy51cGRhdGVDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dHJhY2sudXBkYXRlQ2FsbGJhY2sgPSBudWxsO1xuXHRcdFx0XHRhdWRpby5jdXJyZW50VGltZSA9IHRpbWU7XG5cdFx0XHRcdGF1ZGlvLnBsYXkoKTtcblx0XHRcdH07XG5cdFx0XHRhdWRpby5wbGF5KCk7XG5cdFx0fVxuXG5cdFx0dHJhY2sudGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoYXVkaW8uY3VycmVudFRpbWUgPj0gbmV4dFRpbWUpIHtcblx0XHRcdFx0dHJhY2suc3RvcCgpO1xuXHRcdFx0XHRpZiAodHJhY2subG9vcCkge1xuXHRcdFx0XHRcdHRyYWNrLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIDEwKTtcblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0dGhpcy5hdWRpby5wYXVzZSgpO1xuXHRcdHRoaXMuYXVkaW8ubXV0ZWQgPSB0cnVlO1xuXHRcdHRyeSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuXHRcdH0gY2F0Y2ggKGV2dCkgeyAvKiB7WypfKl19ICovIH1cblx0XHR0aGlzLnBsYXlpbmcgPSBmYWxzZTtcblx0fVxuXG5cdG11dGUoVEYpIHtcblx0XHR0aGlzLm11dGVkID0gVEY7XG5cdFx0dGhpcy5hdWRpby5tdXRlZCA9IHRoaXMubXV0ZWQ7XG5cdFx0dGhpcy5hdWRpby52b2x1bWUgPSB0aGlzLnZvbHVtZTtcblx0fVxuXG5cdGNoYW5nZVZvbHVtZSh2YWx1ZSkge1xuXHRcdHRyeSB7XG5cdFx0XHR0aGlzLnZvbHVtZSA9IHZhbHVlO1xuXHRcdFx0aWYgKCF0aGlzLmF1ZGlvLm11dGVkKSB7XG5cdFx0XHRcdHRoaXMuYXVkaW8udm9sdW1lID0gdGhpcy52b2x1bWU7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZXZ0KSB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnQXVkaW9TcHJpdGUuY2hhbmdlVm9sdW1lKCknLCBldnQpO1xuXHRcdH1cblx0fVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgaWQtbGVuZ3RoICovXG4ndXNlIHN0cmljdCc7XG5cbi8qIENyZWF0ZXMgYSBwYXJ0aWNsZSBzeXN0ZW0gd2hpY2ggcGxheWVzIHRocm91Z2ggYSBnZW5lcmF0ZWQgbWFzayAoTWF0dGUpICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1YmJsZXMge1xuXHRzdGF0aWMgZ2V0IFRhdSgpIHtcblx0XHRyZXR1cm4gTWF0aC5QSSAqIDI7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihkb21JRCkge1xuXHRcdHRoaXMuZG9tVGFyZ2V0O1xuXHRcdHRoaXMuY2FudmFzO1xuXHRcdHRoaXMuY29udGV4dDtcblx0XHR0aGlzLm1hdHRlO1xuXHRcdHRoaXMud2lkdGggPSA1NDtcblx0XHR0aGlzLmhlaWdodCA9IDgzO1xuXHRcdHRoaXMubnVtUGFydGljbGVzID0gNjA7XG5cdFx0dGhpcy5hbGxQYXJ0aWNsZXMgPSBbXTtcblx0XHR0aGlzLlRhdSA9IE1hdGguUEkgKiAyO1xuXHRcdHRoaXMuZmlsbENvbG91ciA9ICdyZ2JhKDIwMCwgMjAwLCAyNTUsIC4zKSc7XG5cdFx0dGhpcy5zdHJva2VDb2xvdXIgPSAnI2JlYmViZSc7XG5cdFx0dGhpcy5zdHJva2VXaWR0aCA9IC41O1xuXHRcdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG5cdFx0dGhpcy50aW1lT3V0O1xuXG5cdFx0dGhpcy5jcmVhdGVDYW52YXMoZG9tSUQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHR0aGlzLmluaXQoKTtcblx0XHR0aGlzLm1hdHRlLmRyYXcoKTtcblxuXHRcdHRoaXMuc3RhcnQoKTtcblx0fVxuXG5cdC8qIENyZWF0ZXMgb3duIGNhbnZhcyB0byByZWR1Y2UgZHJhdyB1cGRhdGVzIG9uIG1haW4gZ2FtZSBjYW52YXMgKi9cblx0Y3JlYXRlQ2FudmFzKGRvbUlELCB3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdHRoaXMuZG9tVGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xuXHRcdHRoaXMuZG9tVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG91cjtcblx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZUNvbG91cjtcblx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy5zdHJva2VXaWR0aDtcblx0fVxuXG5cdC8qIENyZWF0ZSB0aGUgbWFzayBhbmQgZ2VuZXJhdGUgYWxsIHBhcnRpY2xlcyB1c2luZyBhbiBPYmplY3QgUG9vbCBwYXR0ZXJuICovXG5cdGluaXQoKSB7XG5cdFx0dGhpcy5tYXR0ZSA9IG5ldyBNYXNrTWF0dGUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMuY29udGV4dCk7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtUGFydGljbGVzOyBpbmRleCsrKSB7XG5cdFx0XHR0aGlzLmFsbFBhcnRpY2xlcy5wdXNoKHRoaXMubWFrZVBhcnRpY2xlKHt9LCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQgKyAxMCkpO1xuXHRcdH1cblx0fVxuXG5cdC8qIENyZWF0ZXMgaW5kaXZpZHVhbCBwYXJ0aWNsZS4gQ2FsbGVkIGluaXRpYWxseSBhbmQgd2hlbiBwYXJ0aWNsZSBpcyByZWN5Y2xlZCAqL1xuXHRtYWtlUGFydGljbGUocGFydGljbGUsIGluaXRZKSB7XG5cdFx0cGFydGljbGUueCA9IE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoO1xuXHRcdHBhcnRpY2xlLnkgPSBpbml0WTtcblx0XHRwYXJ0aWNsZS52eCA9IE1hdGgucmFuZG9tKCkgKiA0ICsgMjtcblx0XHRwYXJ0aWNsZS52eSA9IE1hdGgucmFuZG9tKCkgKiAxLjUgKyAuNztcblx0XHRwYXJ0aWNsZS5yYWRpdXMgPSAxICogcGFydGljbGUudnk7XG5cdFx0cmV0dXJuIHBhcnRpY2xlO1xuXHR9XG5cblx0LyogVXBkYXRlcyBwYXJ0aWNsZSBwcm9wZXJ0aWVzIGZvciBtb3ZlbWVudC5cblx0XHRDaGVja3MgaWYgcGFydGljbGUgaXMgb3V0IG9mIGJvaXVuZHMsIGFuZCByZWN5Y2xlcyBpdCBpZiByZXF1aXJlZCAqL1xuXHR1cGRhdGUoKSB7XG5cdFx0bGV0IHBhcnRpY2xlO1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm51bVBhcnRpY2xlczsgaW5kZXgrKykge1xuXHRcdFx0cGFydGljbGUgPSB0aGlzLmFsbFBhcnRpY2xlc1tpbmRleF07XG5cdFx0XHRwYXJ0aWNsZS54ICs9IE1hdGguc2luKHBhcnRpY2xlLnZ4ICs9IC4wNSkgKiAuMTtcblx0XHRcdHBhcnRpY2xlLnkgLT0gcGFydGljbGUudnk7XG5cdFx0XHRpZiAocGFydGljbGUueCA+IHRoaXMud2lkdGggfHwgcGFydGljbGUueCA8IDAgfHwgcGFydGljbGUueSA8IDApIHtcblx0XHRcdFx0dGhpcy5tYWtlUGFydGljbGUocGFydGljbGUsIHRoaXMuaGVpZ2h0ICsgNSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyogRHJhdyB0aGUgcGFydGljbGUgKi9cblx0ZHJhdygpIHtcblx0XHRsZXQgcGFydGljbGU7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubnVtUGFydGljbGVzOyBpbmRleCsrKSB7XG5cdFx0XHRwYXJ0aWNsZSA9IHRoaXMuYWxsUGFydGljbGVzW2luZGV4XTtcblx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdHRoaXMuY29udGV4dC5hcmMocGFydGljbGUueCwgcGFydGljbGUueSwgcGFydGljbGUucmFkaXVzLCAwLCBCdWJibGVzLlRhdSk7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbCgpO1xuXHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdH1cblx0fVxuXG5cdHN0b3AoKSB7XG5cdFx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cdH1cblxuXHRzdGFydCgpIHtcblx0XHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xuXHRcdHRoaXMuYW5pbWF0ZSgpO1xuXHR9XG5cblx0LyogQ29udHJvbHMgdGhlIGFuaW1hdGlvb24gY3ljbGUgYXQgYSBzbG93ZXIgdGhhbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKFJBRikgcmF0ZSwgdG8gcmVkdWNlIHBlcmZvcm1hbmNlIGxvYWQgKi9cblx0YW5pbWF0ZSgpIHtcblx0XHRpZiAoIXRoaXMucnVubmluZykge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdHRoaXMuY29udGV4dC5zYXZlKCk7IC8vIHRoaXMgc2F2ZXMgY2xpcHBpbmcgcGF0aC4gbm8gbmVlZCB0byByZWRyYXcgYXMgaXQgaXMgc3RhdGljXG5cdFx0dGhpcy5kcmF3KCk7XG5cdFx0dGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuXHRcdHNldFRpbWVvdXQoICgpID0+IHRoaXMuYW5pbWF0ZSgpLCAzMyk7XG5cdH1cbn1cblxuLyogIEZvciBhbmltYXRpb24gKi9cbi8qICBDcmVhdGUgY2xpcHBpbmcgcGF0aCBzbyB0aGUgYnViYmxlcyBjb25mb3JtIHRvIHRoZSBzaGFwZSBvZiB0aGUgZ2xhc3MgKi9cbmNsYXNzIE1hc2tNYXR0ZSB7XG5cdGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIGN0eCkge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodCAqIDI7XG5cdFx0dGhpcy54T2Zmc2V0ID0gd2lkdGggKiAuNTtcblx0XHR0aGlzLnlPZmZzZXQgPSAwO1xuXHRcdHRoaXMuY2FudmFzQ3R4ID0gY3R4O1xuXHR9XG5cblx0ZHJhdygpIHtcblx0XHRsZXQgaGVpZ2h0Q29udHJvbFBvaW50RmFjdG9yID0gLjc7XG5cdFx0bGV0IHdpZHRoQ29udHJvbFBvaW50T2Zmc2V0ID0gNjtcblx0XHR0aGlzLmNhbnZhc0N0eC5iZWdpblBhdGgoKTtcblx0XHR0aGlzLmNhbnZhc0N0eC5tb3ZlVG8oMCwwKTtcblx0XHR0aGlzLmNhbnZhc0N0eC5saW5lVG8odGhpcy53aWR0aCwgMCk7XG5cdFx0dGhpcy5jYW52YXNDdHguYmV6aWVyQ3VydmVUbyhcblx0XHRcdHRoaXMud2lkdGggKyB3aWR0aENvbnRyb2xQb2ludE9mZnNldCwgdGhpcy5oZWlnaHQgKiBoZWlnaHRDb250cm9sUG9pbnRGYWN0b3IsXG5cdFx0XHQwIC0gd2lkdGhDb250cm9sUG9pbnRPZmZzZXQsIHRoaXMuaGVpZ2h0ICogaGVpZ2h0Q29udHJvbFBvaW50RmFjdG9yLFxuXHRcdFx0MCwgMCk7XG5cdFx0dGhpcy5jYW52YXNDdHguY2xvc2VQYXRoKCk7XG5cdFx0dGhpcy5jYW52YXNDdHguY2xpcCgpO1xuXHR9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIENyZWF0ZXMgYSBjYW52YXMgZWxlbWVudCAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIHtcblx0Y29uc3RydWN0b3IoZG9tSUQsIGlkID0gJ2dhbWVDYW52YXMnLCB3aWR0aCA9IDY0MCwgaGVpZ2h0ID0gNDgwLCByZW5kZXJGdW5jdGlvbiA9IG51bGwpIHtcblx0XHR0aGlzLmNhbnZhcztcblx0XHR0aGlzLmNvbnRleHQ7XG5cdFx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSUQpO1xuXHRcdHRoaXMuaGVpZ2h0O1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLnJlbmRlckZ1bmN0aW9uID0gcmVuZGVyRnVuY3Rpb247XG5cdFx0dGhpcy53aWR0aDtcblxuXHRcdHRoaXMuY3JlYXRlQ2FudmFzKCk7XG5cdFx0dGhpcy5yZXNpemUod2lkdGgsIGhlaWdodCk7XG5cdH1cblxuXHRjcmVhdGVDYW52YXMoKSB7XG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblx0XHR0aGlzLmNhbnZhcy5pZCA9IHRoaXMuaWQ7XG5cdFx0dGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICdibHVlJztcblx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0dGhpcy5jb250ZXh0LnJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cdH1cblxuXHQvKiBPdGhlciB2aXN1YWwgZ2FtZSBlbGVtZW50cyBhcmUgcmVnaXN0ZXJlZCB0byB0aGUgY2FudmFzLCB3aGljaCBjYWxscyB0aGVpciBpbmRpdmlkdWFsIHJlbmRlciBmdW5jdGlvbnMuXG5cdFx0VGhpcyBrZWVwcyBhIHNpbmdsZSByZW5kZXIgbG9vcCwgYW5kIGtlZXBzIGV2ZXJ5dGhpbmcgaW4gc3luYyAqL1xuXHRyZW5kZXIoKSB7XG5cdFx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblxuXHRcdGlmICh0aGlzLnJlbmRlckZ1bmN0aW9uKSB7XG5cdFx0XHR0aGlzLnJlbmRlckZ1bmN0aW9uKHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cdH1cblxuXHQvKiBJbmNhc2Ugd2UgbmVlZCB0byByZXNpemUgdGhlIGNhbnZhcyAod2UgZG9uJ3QgaW4gdGhpcyBhcHBsaWNhdGlvbikgKi9cblx0cmVzaXplKHdpZHRoLCBoZWlnaHQpIHtcblx0XHR0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcblx0fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBTaW5nbGUgY2VsbCB3aXRoaW4gaW50ZXJhY2l2ZSBvcGFjaXR5IGxheWVyLlxuXHRNYW5hZ2VzIG93biBzdGF0ZSwgdHdlZW5uZywgYW5kIHJlbmRlcmluZyB0byBjYW52YXMgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENlbGwge1xuXHRzdGF0aWMgZ2V0IE1BWF9PUEFDSVRZKCkge1xuXHRcdHJldHVybiAuOTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgTUlOX09QQUNJVFkoKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRzdGF0aWMgZ2V0IE5FQVJfRU5PVUdIKCkge1xuXHRcdHJldHVybiAwLjAxO1xuXHR9XG5cdGNvbnN0cnVjdG9yKHhMb2MgPSAwLCB5TG9jID0gMCwgb3BhY2l0eSA9IDEsIGVXaWR0aCA9IDEwLCBlSGVpZ2h0ID0gMTApIHtcblx0XHR0aGlzLm9wYWNpdHkgPSBvcGFjaXR5O1xuXHRcdHRoaXMudGFyZ2V0T3BhY2l0eSA9IHRoaXMub3BhY2l0eTtcblx0XHR0aGlzLmJhc2VTcGVlZCA9IE1hdGgucmFuZG9tKCkgKiAuMDUgKyAuMDU7XG5cdFx0dGhpcy5zcGVlZCA9IHRoaXMuYmFzZVNwZWVkO1xuXHRcdHRoaXMuaGVpZ2h0ID0gZUhlaWdodDtcblx0XHR0aGlzLndpZHRoID0gZVdpZHRoO1xuXHRcdHRoaXMueExvYyA9IHhMb2M7XG5cdFx0dGhpcy55TG9jID0geUxvYztcblx0XHR0aGlzLmluRmx1eCA9IHRydWU7XG5cdH1cblxuXHQvKiBpUGFkIHVzZWQgYXQgRXZlbnRzLiBUaGV5IGFyZSBydWJiaXNoLCBzbyB3ZSB0dXJuIG9mZiBhbmltYXRpb24gKi9cblx0c2V0Rm9ySU9TKCkge1xuXHRcdHRoaXMuYmFzZVNwZWVkID0gMTtcblx0XHR0aGlzLnNwZWVkID0gMTtcblx0fVxuXG5cdC8qIENhbGxlZCB0byB0dXJuIHdpbmRvdyBvbi9vZmZcblx0XHROZWVkcyBub3QgYmUgZGlmZmVyZW50LlxuXHRcdElmIGRpZmZlcmVudCwgbmVlZHMgYW5pbWF0aW9uIC0gc2V0IGluRmx1eCBmbGFnICovXG5cdHNldE9wYWNpdHkob3BhY2l0eUNoYW5nZSkge1xuXHRcdHRoaXMudGFyZ2V0T3BhY2l0eSA9IHRoaXMub3BhY2l0eSArIG9wYWNpdHlDaGFuZ2U7XG5cblx0XHQvLyBrZWVwIHRhcmdldCB3aXRoaW4gZXhwZWN0ZWQgYm91bmRzXG5cdFx0aWYgKHRoaXMudGFyZ2V0T3BhY2l0eSA+IENlbGwuTUFYX09QQUNJVFkpIHtcblx0XHRcdHRoaXMudGFyZ2V0T3BhY2l0eSA9IENlbGwuTUFYX09QQUNJVFk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLnRhcmdldE9wYWNpdHkgPCBDZWxsLk1JTl9PUEFDSVRZKSB7XG5cdFx0XHR0aGlzLnRhcmdldE9wYWNpdHkgPSBDZWxsLk1JTl9PUEFDSVRZO1xuXHRcdH1cblxuXHRcdC8vIFNwZWVkIGNhbiBiZSArIG9yIC0gd2hpY2ggYWxsb3dzIHVzZSB0byBhbHdheXMgYWRkIGl0IGluIHVwZGF0ZSBsb29wXG5cdFx0Ly8gd2hpY2ggcmVtb3ZlcyBsb2dpYyAvIGxvYWQgaW4gcGVyZm9ybWFuY2Ugc2Vuc2l0aXZlIGNvZGVcblx0XHR0aGlzLnNwZWVkID0gdGhpcy50YXJnZXRPcGFjaXR5IDwgdGhpcy5vcGFjaXR5ID8gdGhpcy5iYXNlU3BlZWQgKiAtMSA6IHRoaXMuYmFzZVNwZWVkO1xuXG5cdFx0Ly8gb25seSBhbmltYXRlIGNlbGwgaWYgY2hhbmdlIGlzIHJlcXVpcmVkXG5cdFx0aWYgKHRoaXMudGFyZ2V0T3BhY2l0eSAhPT0gdGhpcy5vcGFjaXR5KSB7XG5cdFx0XHR0aGlzLmluRmx1eCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0Ly8gdXBkYXRlIG9wYWNpdHkgYW5kIGtlZXAgd2l0aGluIGJvdW5kc1xuXHR1cGRhdGUoKSB7XG5cdFx0Ly8gbGluZWFyIGVhc2Vcblx0XHR0aGlzLm9wYWNpdHkgKz0gdGhpcy5zcGVlZDtcblxuXHRcdGlmICh0aGlzLm9wYWNpdHkgPiBDZWxsLk1BWF9PUEFDSVRZKSB7XG5cdFx0XHR0aGlzLm9wYWNpdHkgPSBDZWxsLk1BWF9PUEFDSVRZO1xuXHRcdH1cblx0XHRpZiAodGhpcy5vcGFjaXR5IDwgQ2VsbC5NSU5fT1BBQ0lUWSkge1xuXHRcdFx0dGhpcy5vcGFjaXR5ID0gQ2VsbC5NSU5fT1BBQ0lUWTtcblx0XHR9XG5cdH1cblxuXHRyZW5kZXIoY2FudmFzKSB7XG5cdFx0Ly8gT25seSByZW5kZXIgaWYgaW4gZmx1eFxuXHRcdGlmICghdGhpcy5pbkZsdXgpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdC8vIFVzZSAnbmVhciBlbm91Z2gnIGFuaW1hdGlvbiBzdG9wXG5cdFx0aWYgKE1hdGguYWJzKHRoaXMudGFyZ2V0T3BhY2l0eSAtIHRoaXMub3BhY2l0eSkgPCBDZWxsLk5FQVJfRU5PVUdIKSB7XG5cdFx0XHR0aGlzLm9wYWNpdHkgPSB0aGlzLnRhcmdldE9wYWNpdHk7XG5cdFx0XHR0aGlzLmluRmx1eCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGNsZWFyIGFuZCByZW5kZXIganVzdCB0aGUgcmVxdWlyZWQgYXJlYSBvZiBjYW52YXMgdG8gcmVkdWNlIHBpeGVscyBkcmF3biAvIGxvYWRcblx0XHRjYW52YXMuY29udGV4dC5jbGVhclJlY3QodGhpcy54TG9jLCB0aGlzLnlMb2MsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHRjYW52YXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCcgKyB0aGlzLm9wYWNpdHkgKyAnKSc7XG5cdFx0Y2FudmFzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0Y2FudmFzLmNvbnRleHQucmVjdCh0aGlzLnhMb2MsIHRoaXMueUxvYywgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdGNhbnZhcy5jb250ZXh0LmZpbGwoKTtcblx0fVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XG5cbi8qIFNpbmdsZXRvblxuXHRNYW5hZ2VzIGZvcm0gdmFsaWFkdGlvbiBhbmQgc3VibWlzc2lvbi5cblx0VGhlcmUgaXMgYSBkaWZmZXJlbnQgZm9ybSBmb3IgSW50ZXJuYWwgYW5kIEV4dGVybmFsIGV2ZW50cy5cblx0VGhpcyBjb250cm9scyB3aGljaCBpcyBkaXNwbGF5ZWQgYW5kIG1hbmFnZXMgcmVxdWlyZWQgdmFsaWFkdGlvbiBmaWVsZHMgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm1NYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5ldmVudE5hbWUgPSAnJztcblx0XHR0aGlzLnJ1bkFzRXZlbnQgPSBmYWxzZTtcblx0XHR0aGlzLnN1Ym1pdEZvcm07IC8vIEZvcm0gaXMgZGlmZmVyZW50IGZvciBJbnRlcm5hbCBhbmQgZXh0ZXJuYWwgZXZlbnRzXG5cdFx0dGhpcy5mb3JtVmFsaWQ7XG5cdFx0dGhpcy5pbnB1dHM7XG5cdFx0dGhpcy52YWxpZDtcblx0XHR0aGlzLnNsdDRJRCA9ICcjc2luZ2xlTGluZVRleHQ0Jztcblx0XHR0aGlzLmZvcm1Mb2NrZWQgPSBmYWxzZTtcblxuXHRcdHRoaXMuaXNJbnRlcm5hbDtcblxuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkVWRU5UX05BTUUsIChldnQpID0+IHRoaXMuc2V0RXZlbnQoZXZ0LmRhdGEpKTtcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKFN0YXRlTWFuYWdlci5TQ09SRSwgKGV2dCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNsdDRJRCkudmFsdWUgPSBldnQucmF3KTtcblxuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgKGV2dCkgPT4ge1xuXHRcdFx0aWYgKGV2dC5kYXRhID09PSBTdGF0ZU1hbmFnZXIuUExBWV9BR0FJTikge1xuXHRcdFx0XHQvKiBVbmxvY2sgdGhlIGZvcm0gKi9cblx0XHRcdFx0dGhpcy5mb3JtTG9ja2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHQvKiBCYXNlZCBvbiB1cmwgaGFzaCwgY290cm9scyB3aGV0aGVyIHRoZSBnYW1lIGlzIEludGVybmFsIG9yIEV4dGVybmFsXG5cdFx0U2V0IHZhcmlhYmxlIC8gcHJvcGVydGllcyBhY2NvcmRpbmdseSAqL1xuXHRzZXRFdmVudChldnQpIHtcblx0XHRpZiAoZXZ0ID09PSBTdGF0ZU1hbmFnZXIuRVhURVJOQUwpIHtcblx0XHRcdHRoaXMuY3JlYXRlVmFsaWRhdGlvbkxpc3QoZmFsc2UpO1xuXHRcdFx0dGhpcy5ydW5Bc0V2ZW50ID0gdHJ1ZTtcblx0XHRcdHRoaXMuc2x0NElEID0gJyNzaW5nbGVMaW5lVGV4dDQtZXh0ZXJuYWwnO1xuXHRcdFx0dGhpcy5zdWJtaXRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlZ2lzdGVyRm9ybUV4dGVybmFsJyk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5jcmVhdGVWYWxpZGF0aW9uTGlzdCh0cnVlKTtcblx0XHRcdHRoaXMuc3VibWl0Rm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZWdpc3RlckZvcm0nKTtcblx0XHR9XG5cdFx0dGhpcy5zdWJtaXRGb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldnQpID0+IHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dGhpcy5zdWJtaXRIYW5kbGVyKCk7XG5cdFx0fSwgZmFsc2UpO1xuXHR9XG5cblx0LyogU2V0IGZvcm0gZmllbGRzIGZvciB2YWxpZGF0aW9uICovXG5cdGNyZWF0ZVZhbGlkYXRpb25MaXN0KGlzSW50ZXJuYWwgPSB0cnVlKSB7XG5cdFx0dGhpcy5pc0ludGVybmFsID0gaXNJbnRlcm5hbDtcblx0XHRpZiAoaXNJbnRlcm5hbCkge1xuXHRcdFx0dGhpcy5pbnB1dHMgPSBbXG5cdFx0XHRcdHtpZDonI2ZOYW1lJywgdHlwZTonc3RyaW5nJywgc3VibWl0VmFsdWU6J2ZpcnN0TmFtZT0nfSxcblx0XHRcdFx0e2lkOicjZkVtYWlsJywgdHlwZTonZW1haWwnLCBzdWJtaXRWYWx1ZTonZW1haWxBZGRyZXNzPSd9LFxuXHRcdFx0XHR7aWQ6JyNmVG5DJywgdHlwZTonY2hlY2tib3gnLCBzdWJtaXRWYWx1ZTonc2luZ2xlTGluZVRleHQ1PSd9LFxuXHRcdFx0XHR7aWQ6JyNzaW5nbGVMaW5lVGV4dDQnLCB0eXBlOidudW1iZXInLCBzdWJtaXRWYWx1ZTonc2luZ2xlTGluZVRleHQ0PSd9XTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmlucHV0cyA9IFtcblx0XHRcdFx0e2lkOicjZk5hbWUtZXh0ZXJuYWwnLCB0eXBlOidzdHJpbmcnLCBzdWJtaXRWYWx1ZTonbmFtZT0nfSxcblx0XHRcdFx0e2lkOicjZkVtYWlsLWV4dGVybmFsJywgdHlwZTonZW1haWwnLCBzdWJtaXRWYWx1ZTonZW1haWw9J30sXG5cdFx0XHRcdHtpZDonI2ZDb21wYW55LWV4dGVybmFsJywgdHlwZTonc3RyaW5nJywgc3VibWl0VmFsdWU6J2NvbXBhbnk9J30sXG5cdFx0XHRcdHtpZDonI2ZUeXBlLWV4dGVybmFsJywgdHlwZTonc3RyaW5nJywgc3VibWl0VmFsdWU6J3R5cGU9J30sXG5cdFx0XHRcdHtpZDonI2ZDb3VudHJ5LWV4dGVybmFsJywgdHlwZTonc3RyaW5nJywgc3VibWl0VmFsdWU6J2NvdW50cnk9J30sXG5cdFx0XHRcdHtpZDonI2ZNYXJrZXRpbmcnLCB0eXBlOidvcHRpb25hbCcsIHN1Ym1pdFZhbHVlOidvcHRJbj0nfSxcblx0XHRcdFx0e2lkOicjZlRuQy1leHRlcm5hbCcsIHR5cGU6J2NoZWNrYm94Jywgc3VibWl0VmFsdWU6J2xhc3ROYW1lPSd9XTtcblx0XHR9XG5cdH1cblxuXHQvKiBSdW5zIHRocm91Z2ggdmFsaWRhdGlvbm9uIGFsbCBmaWVsZHMgd2hlbiB1c2VyIHN1Ym1pdHMgZm9ybVxuXHRcdFNlbmRzIEV2ZW50IGZvciBmb3JtIHRvIGJlIHN1Ym1pdHRlZCB0byBzZXJ2ZXIgd2hlbiB2YWxpZCAqL1xuXHRzdWJtaXRIYW5kbGVyKCkge1xuXHRcdGlmICh0aGlzLmZvcm1Mb2NrZWQpIHtcblx0XHRcdC8qIFN0b3BzIGRvdWJsZSBjbGlja2luZyBvbmNlIGZvcm0gaXMgc2VudCAqL1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0XHR0aGlzLmZvcm1SZXNldFZhbGlkYXRpb24oKTtcblxuXHRcdGxldCBzdWJtaXRTdHJpbmcgPSAnZWxxRm9ybU5hbWU9ZGlnaV9nYW1lX2ludGVybmFsJmVscVNpdGVJRD0xOTExNjAyMzA3JmVscUNhbXBhaWduSWQ9Jic7XG5cblx0XHR0aGlzLnZhbGlkID0gdHJ1ZTtcblx0XHRmb3IgKGxldCBpbmRleCA9IDAsIGxvb3AgPSB0aGlzLmlucHV0cy5sZW5ndGg7IGluZGV4IDwgbG9vcDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IGZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmlucHV0c1tpbmRleF0uaWQpO1xuXHRcdFx0bGV0IHZhbHVlID0gZmllbGQudmFsdWU7XG5cdFx0XHRpZiAodGhpcy5pbnB1dHNbaW5kZXhdLnR5cGUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGlmICghdGhpcy52YWxpZGF0ZVN0cmluZyh2YWx1ZSkpIHtcblx0XHRcdFx0XHRmaWVsZC5jbGFzc0xpc3QuYWRkKCdlcnJvci1zdGF0ZScpO1xuXHRcdFx0XHRcdHRoaXMudmFsaWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5pbnB1dHNbaW5kZXhdLnR5cGUgPT09ICdlbWFpbCcpIHtcblx0XHRcdFx0aWYgKCF0aGlzLnZhbGlkYXRlRW1haWwodmFsdWUpKSB7XG5cdFx0XHRcdFx0ZmllbGQuY2xhc3NMaXN0LmFkZCgnZXJyb3Itc3RhdGUnKTtcblx0XHRcdFx0XHR0aGlzLnZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHRoaXMuaW5wdXRzW2luZGV4XS50eXBlID09PSAnY2hlY2tib3gnKSB7XG5cdFx0XHRcdGlmICghZmllbGQuY2hlY2tlZCkge1xuXHRcdFx0XHRcdGZpZWxkLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXN0YXRlJyk7XG5cdFx0XHRcdFx0dGhpcy52YWxpZCA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0aGlzLmlucHV0c1tpbmRleF0udHlwZSA9PT0gJ29wdGlvbmFsJykge1xuXHRcdFx0XHQvLyBkbyBub3RoaW5nIC0gcmVxdWlyZXMgbm8gdmFsaWRhdGlvbiBhcyBpdCBpcyBvcHRpb25hbC5cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBVbmhhbmRsZWQgZmllbGQgdHlwZVxuXHRcdFx0XHQvLyBFeHRlbmQgY29kZSBoZXJlIGlmIHJlcXVpcmVkXG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy52YWxpZCkge1xuXHRcdFx0XHRsZXQgYWRkRmllbGQgPSBlbmNvZGVVUkkodGhpcy5pbnB1dHNbaW5kZXhdLnN1Ym1pdFZhbHVlICsgdmFsdWUpO1xuXHRcdFx0XHRzdWJtaXRTdHJpbmcgKz0gYWRkRmllbGQgKyAnJic7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghdGhpcy52YWxpZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEFsbCB2YWxpZGF0aW9uIHBhc3NlZFxuXHRcdC8qIExvY2sgdGhlIGZvcm0gKi9cblx0XHR0aGlzLmZvcm1Mb2NrZWQgPSB0cnVlO1xuXHRcdHN1Ym1pdFN0cmluZyArPSAnc2luZ2xlTGluZVRleHQ2PScgKyAobmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDE5KS5yZXBsYWNlKC8tL2csIFwiLVwiKS5yZXBsYWNlKFwiVFwiLCBcIiBcIikpO1xuXHRcdGlmICh0aGlzLmlzSW50ZXJuYWwpIHtcblx0XHRcdHN1Ym1pdFN0cmluZyArPSAnJmxhc3ROYW1lPW5vbmUnO1xuXHRcdH1cblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwge1xuXHRcdFx0J2RhdGEnOiBFdmVudE1hbmFnZXIuU0VORF9EQVRBLFxuXHRcdFx0J3N1Ym1pdERhdGEnOiBzdWJtaXRTdHJpbmcsXG5cdFx0XHQndGhpc1BsYXllck5hbWUnOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIHRoaXMuaXNJbnRlcm5hbCA/ICcjZk5hbWUnIDogJyNmTmFtZS1leHRlcm5hbCcgKS52YWx1ZSxcblx0XHRcdCd0aGlzUGxheWVyRW1haWwnOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIHRoaXMuaXNJbnRlcm5hbCA/ICcjZkVtYWlsJyA6ICcjZkVtYWlsLWV4dGVybmFsJyApLnZhbHVlIH0pO1xuXHR9XG5cblx0Ly8gcmVzZXRmb3JtIGFmdGVyIHZhbGlkYXRpb25cblx0Zm9ybVJlc2V0VmFsaWRhdGlvbigpIHtcblx0XHRmb3IgKGxldCBpbmRleCA9IDAsIGxvb3AgPSB0aGlzLmlucHV0cy5sZW5ndGg7IGluZGV4IDwgbG9vcDsgaW5kZXgrKykge1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmlucHV0c1tpbmRleF0uaWQpLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yLXN0YXRlJyk7XG5cdFx0fVxuXHR9XG5cblx0dmFsaWRhdGVFbWFpbChlbWFpbCkge1xuXHRcdGxldCByZSA9IC9cXFMrQFxcUytcXC5cXFMrLztcblx0XHRyZXR1cm4gcmUudGVzdChlbWFpbCk7XG5cdH1cblxuXHR2YWxpZGF0ZVN0cmluZyh2YWx1ZSkge1xuXHRcdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSAnJyA/IHRydWUgOiBmYWxzZTtcblx0fVxufVxuZXhwb3J0IGxldCBmb3JtTWFuYWdlciA9IG5ldyBGb3JtTWFuYWdlcigpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XG5pbXBvcnQge2dhbWVUaW1lclV0aWxzfSBmcm9tICcuL2dhbWVUaW1lclV0aWxzJztcblxuLyogU2luZ2x0b24uXG5cdEtlZXAgdHJhY2sgb2YgdGltZSBzcGVuZCBzb2x2aW5nIHB1enpsZSAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVRpbWVyIHtcblx0Y29uc3RydWN0b3IoZnBzID0gNjAsIGRvbUlEID0gJy50aW1lLWRpc3BsYXknKSB7XG5cdFx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpbWUtZGlzcGxheScpO1xuXHRcdHRoaXMuZnBzID0gZnBzO1xuXHRcdHRoaXMuZ2FtZVRpbWUgPSAwO1xuXHRcdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5zdGFydFRpY2s7XG5cblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIChldnQpID0+IHtcblx0XHRcdHN3aXRjaCAoZXZ0LmRhdGEpIHtcblx0XHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuUExBWV9BR0FJTjpcblx0XHRcdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuUExBWUlORzpcblx0XHRcdFx0XHR0aGlzLnN0YXJ0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuV0lOTkVSOlxuXHRcdFx0XHRcdHRoaXMuc3RvcCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZXZ0LmRhdGEgPT09IFN0YXRlTWFuYWdlci5XSU5ORVIpIHtcblx0XHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0XHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChTdGF0ZU1hbmFnZXIuU0NPUkUsIHsnZGF0YSc6IGdhbWVUaW1lclV0aWxzLnJlcG9ydE1NU1NUSCh0aGlzLmdhbWVUaW1lKSwgJ3Jhdyc6IHRoaXMuZ2FtZVRpbWV9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRzdGFydCgpIHtcblx0XHR0aGlzLnN0YXJ0VGljayA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdHRoaXMucnVubmluZyA9IHRydWU7XG5cdH1cblx0c3RvcCgpIHtcblx0XHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblx0fVxuXHR1cGRhdGUoKSB7XG5cdFx0aWYgKCF0aGlzLnJ1bm5pbmcpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5nYW1lVGltZSArPSAxO1xuXHRcdHRoaXMuZGlzcGxheSgpO1xuXHR9XG5cblx0ZGlzcGxheSgpIHtcblx0XHR0aGlzLmRvbUVsZW1lbnQuaW5uZXJIVE1MID0gZ2FtZVRpbWVyVXRpbHMucmVwb3J0TU1TU1RIKHRoaXMuZ2FtZVRpbWUpOy8vcmVwb3J0U1NNaWxsaSgpO1xuXHR9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuc3RvcCgpO1xuXHRcdHRoaXMuZ2FtZVRpbWUgPSAwO1xuXHR9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIFV0aWxpdHkgY2xhc3MuXG5cdEZvcm1hdHMgY291bnRlci90aW1lciBhcyBNTTpTUzpUSCAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVRpbWVyVXRpbHMge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmZwcyA9IDYwO1xuXHR9XG5cdHJlcG9ydE1NU1NUSChjb3VudGVyKSB7XG5cdFx0bGV0IHNlY29uZHMgPSBNYXRoLmZsb29yKGNvdW50ZXIgLyB0aGlzLmZwcyk7XG5cdFx0bGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XG5cdFx0bGV0IG1pbGxpc2VjcyA9IGNvdW50ZXIgLSAoc2Vjb25kcyAqIHRoaXMuZnBzKTtcblxuXHRcdHNlY29uZHMgPSBzZWNvbmRzIC0gKG1pbnV0ZXMgKiA2MCk7XG5cblx0XHRpZiAobWlsbGlzZWNzIDwgMTApIHtcblx0XHRcdG1pbGxpc2VjcyA9ICcwJyArIG1pbGxpc2Vjcztcblx0XHR9XG5cdFx0aWYgKHNlY29uZHMgPCAxMCkge1xuXHRcdFx0c2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG5cdFx0fVxuXHRcdGlmIChtaW51dGVzIDwgMTApIHtcblx0XHRcdG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuXHRcdH1cblx0XHRyZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHMgKyAnOicgKyBtaWxsaXNlY3M7XG5cdH1cbn1cbmV4cG9ydCBsZXQgZ2FtZVRpbWVyVXRpbHMgPSBuZXcgR2FtZVRpbWVyVXRpbHMoKTtcbiIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBDZWxsIGZyb20gJy4vY2VsbCc7XG5cbi8qIEhvbGQgYSB2aWV3IG9mIHdpbmRvd3MuXG5cdEJ1aWxkcyBjb3ZlcnMgYW5kIG1hbmFnZXMgZ3JpZCBhZGp1c3RtZW50IGxheWVycyAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZCB7XG5cdHN0YXRpYyBnZXQgQURESVRJVkUoKSB7XG5cdFx0cmV0dXJuICdhZGRpdGl2ZSc7XG5cdH1cblx0c3RhdGljIGdldCBTVUJUUkFDVElWRSgpIHtcblx0XHRyZXR1cm4gJ3N1YnRyYWN0aXZlJztcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHhQb3MgPSAwLCB5UG9zID0gMCwgY29sdW1ucyA9IDEwLCByb3dzID0gMTAsIGVXaWR0aCA9IDEwLCBlSGVpZ2h0ID0gMTUsIHlTaGlmdCA9IC4xLCBtZXNoRGF0YSwgc3VidHJhY3RpdmVHcmlkID0gdW5kZWZpbmVkKSB7XG5cdFx0dGhpcy5jb2x1bW5zID0gY29sdW1ucztcblx0XHR0aGlzLnJvd3MgPSByb3dzO1xuXHRcdHRoaXMueFBvcyA9IHhQb3M7XG5cdFx0dGhpcy55UG9zID0geVBvcztcblx0XHR0aGlzLnlTaGlmdCA9IHlTaGlmdDtcblx0XHR0aGlzLnNpemUgPSB0aGlzLmNvbHVtbnMgKiB0aGlzLnJvd3M7XG5cdFx0dGhpcy5jZWxscyA9IFtdO1xuXHRcdHRoaXMubnVtT2ZHYXRlcyA9IDEwO1xuXHRcdHRoaXMuZ2F0ZXMgPSBuZXcgQXJyYXkodGhpcy5udW1PZkdhdGVzKTsgLy8gV2UgcmVxdWlyZSBleGFjdGx5IDEwIGZpbHRlciBncmlkcyAtIG9uZSBmb3IgZWFjaCBidXR0b25cblxuXHRcdHRoaXMuc2V0U3VidHJhY3RpdmVGaWx0ZXIoc3VidHJhY3RpdmVHcmlkKTtcblxuXHRcdHRoaXMuaW5pdFN1YnRyYWN0aXZlRmlsdGVycygpO1xuXHRcdHRoaXMucGFyc2VNZXNoRGF0YShtZXNoRGF0YSk7XG5cdFx0dGhpcy5nZW5lcmF0ZVJlc2V0R3JpZHMoKTtcblxuXHRcdHRoaXMuYnVpbGRHcmlkKGVXaWR0aCwgZUhlaWdodCk7XG5cdH1cblxuXHRzZXRGb3JJT1MoKSB7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHR0aGlzLmNlbGxzW2luZGV4XS5zZXRGb3JJT1MoKTtcblx0XHR9XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBncmlkIG9mIG92ZXJsYXkgY2VsbHNcblx0YnVpbGRHcmlkKGVXaWR0aCwgZUhlaWdodCkge1xuXHRcdGZvciAobGV0IGluZGV4Um93ID0gMDsgaW5kZXhSb3cgPCB0aGlzLnJvd3M7IGluZGV4Um93KyspIHtcblx0XHRcdGZvciAobGV0IGluZGV4Q29sID0gMDsgaW5kZXhDb2wgPCB0aGlzLmNvbHVtbnM7IGluZGV4Q29sKyspIHtcblx0XHRcdFx0dGhpcy5jZWxscy5wdXNoKG5ldyBDZWxsKFxuXHRcdFx0XHRcdGluZGV4Q29sICogZVdpZHRoICsgdGhpcy54UG9zLFxuXHRcdFx0XHRcdGluZGV4Um93ICogZUhlaWdodCArIHRoaXMueVBvcyArICh0aGlzLnlTaGlmdCAqIGluZGV4Q29sKSxcblx0XHRcdFx0XHRDZWxsLk1BWF9PUEFDSVRZLFxuXHRcdFx0XHRcdGVXaWR0aCxcblx0XHRcdFx0XHRlSGVpZ2h0XG5cdFx0XHRcdCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENyZWF0ZSByYW5kb20gcGxhY2VtZW50IGFuZCBvcmRlciBmb3Igc3VidHJhY3RpdmUgZmlsdGVyc1xuXHRnZW5lcmF0ZVVuaXF1ZSgpIHtcblx0XHRsZXQgcm5kO1xuXHRcdHdoaWxlICh0aGlzLnN1YnRyYWN0aXZlR3JpZHMubGVuZ3RoIDwgNCkge1xuXHRcdFx0cm5kID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5nYXRlcy5sZW5ndGgpO1xuXHRcdFx0aWYgKHRoaXMuc3VidHJhY3RpdmVHcmlkcy5pbmRleE9mKHJuZCkgPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuc3VidHJhY3RpdmVHcmlkcy5wdXNoKHJuZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyogSWYgbm8gUElOIHNlcXVlbmNlIChJRHMgZm9yIHN1YnRyYWN0aXZlIGdyaWRzKSAqL1xuXHRzZXRTdWJ0cmFjdGl2ZUZpbHRlcihzdWJ0cmFjdGl2ZUdyaWQpIHtcblx0XHR0aGlzLnN1YnRyYWN0aXZlR3JpZHMgPSBzdWJ0cmFjdGl2ZUdyaWQgPT09IHVuZGVmaW5lZCA/IFtdIDogc3VidHJhY3RpdmVHcmlkO1xuXG5cdFx0aWYgKHN1YnRyYWN0aXZlR3JpZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRlVW5pcXVlKCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ3JlYXRlIGVtcHR5IGFycmF5IHJlYWR5IGZvciBtZXNoIGRhdGEgcGFyc2luZyB0byBwb3B1bGF0ZSB3aXRoIGZpbHRlciBkYXRhXG5cdGluaXRTdWJ0cmFjdGl2ZUZpbHRlcnMoKSB7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuc3VidHJhY3RpdmVHcmlkcy5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRcdHRoaXMuZ2F0ZXNbdGhpcy5zdWJ0cmFjdGl2ZUdyaWRzW2luZGV4XV0gPSBbXTtcblx0XHR9XG5cdH1cblxuXHQvLyBHZW5lcmF0ZSBzdWJ0cmFjdGl2ZSBncmlkcyBmcm9tIG1lc2ggZGF0YVxuXHRwYXJzZU1lc2hEYXRhKG1lc2hEYXRhKSB7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG1lc2hEYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0dGhpcy5nYXRlc1t0aGlzLnN1YnRyYWN0aXZlR3JpZHNbMF1dLnB1c2gobWVzaERhdGFbaW5kZXhdID09PSAnYScgPyAxIDogMCk7XG5cdFx0XHR0aGlzLmdhdGVzW3RoaXMuc3VidHJhY3RpdmVHcmlkc1sxXV0ucHVzaChtZXNoRGF0YVtpbmRleF0gPT09ICdiJyA/IDEgOiAwKTtcblx0XHRcdHRoaXMuZ2F0ZXNbdGhpcy5zdWJ0cmFjdGl2ZUdyaWRzWzJdXS5wdXNoKG1lc2hEYXRhW2luZGV4XSA9PT0gJ2MnID8gMSA6IDApO1xuXHRcdFx0dGhpcy5nYXRlc1t0aGlzLnN1YnRyYWN0aXZlR3JpZHNbM11dLnB1c2gobWVzaERhdGFbaW5kZXhdID09PSAnZCcgPyAxIDogMCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gR2VuZXJhdGUgcmVzZXQgZ3JpZHNcblx0Z2VuZXJhdGVSZXNldEdyaWRzKCkge1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmdhdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0aWYgKHRoaXMuZ2F0ZXNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0dGhpcy5nYXRlc1tpbmRleF0gPSB0aGlzLm1ha2VGaWx0ZXJHYXRlKDAsIHRoaXMuc2l6ZSk7IC8vIHNldCBhZGRpdGl2ZSAvIHJlc2V0IGdyaWQgaGVyZVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFV0aWxpdHkgdG8gbWFrZSBzaW1wbGUgYmxvY2sgZmlsdGVyc1xuXHRtYWtlRmlsdGVyR2F0ZShzdGFydCwgZW5kKSB7XG5cdFx0bGV0IGZpbHRlciA9IFtdO1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNpemU7IGluZGV4KyspIHtcblx0XHRcdGZpbHRlcltpbmRleF0gPSAoaW5kZXggPj0gc3RhcnQgJiYgaW5kZXggPD0gZW5kKSA/IDEgOiAwO1xuXHRcdH1cblx0XHRyZXR1cm4gZmlsdGVyO1xuXHR9XG5cblx0cmVuZGVyKGNhbnZhcykge1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmNlbGxzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0dGhpcy5jZWxsc1tpbmRleF0ucmVuZGVyKGNhbnZhcyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSXRlcmF0ZXMgdGhyb3VnaCB0aGUgZ3JpZCBhbmQgY2hhbmdlcyBvcGFjaXR5IGJhc2VkIG9uIHRoZSBmaWx0ZXJcblx0YXBwbHlHYXRlKGlkLCBiZWhhdmlvdXIgPSBHcmlkLkFERElUSVZFKSB7XG5cdFx0bGV0IHRoZUZpbHRlciA9IHRoaXMuZ2F0ZXNbaWRdLFxuXHRcdFx0Y2VsbCxcblx0XHRcdGJlaGF2aW91ck1vZGlmaWVyID0gYmVoYXZpb3VyID09PSBHcmlkLlNVQlRSQUNUSVZFID8gLTEgOiAxO1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmNlbGxzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0Y2VsbCA9IHRoaXMuY2VsbHNbaW5kZXhdO1xuXHRcdFx0Y2VsbC5zZXRPcGFjaXR5KHRoZUZpbHRlcltpbmRleF0gKiBiZWhhdmlvdXJNb2RpZmllcik7XG5cdFx0fVxuXHR9XG5cblx0cmVzZXQoc3VidHJhY3RpdmVHcmlkLCBtZXNoRGF0YSkge1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmNlbGxzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0dGhpcy5jZWxsc1tpbmRleF0uc2V0T3BhY2l0eSgxKTtcblx0XHR9XG5cblx0XHR0aGlzLmdhdGVzID0gbmV3IEFycmF5KHRoaXMubnVtT2ZHYXRlcyk7XG5cdFx0dGhpcy5zZXRTdWJ0cmFjdGl2ZUZpbHRlcihzdWJ0cmFjdGl2ZUdyaWQpO1xuXG5cdFx0dGhpcy5pbml0U3VidHJhY3RpdmVGaWx0ZXJzKCk7XG5cdFx0dGhpcy5wYXJzZU1lc2hEYXRhKG1lc2hEYXRhKTtcblx0XHR0aGlzLmdlbmVyYXRlUmVzZXRHcmlkcygpO1xuXHR9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBFdmVudE1hbmFnZXIsIHtldmVudE1hbmFnZXJ9IGZyb20gJy4vRXZlbnRNYW5hZ2VyLmpzJztcbmltcG9ydCBNZXNoRGF0YSBmcm9tICcuL21lc2gnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBTdGF0ZU1hbmFnZXIgZnJvbSAnLi9zdGF0ZU1hbmFnZXInO1xuXG4vKiBNYW5hZ2VzIGFsbCB0aGUgbGl0dGxlIGJsYWNrLW91dHMgZm9yIHRoZSB3aW5kb3dzICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkTWFuYWdlciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMubWVzaERhdGEgPSBuZXcgTWVzaERhdGEoKTtcblx0XHR0aGlzLnRvdGFsR3JpZENlbGxzID0gMDtcblx0XHR0aGlzLnNvbHZlZCA9IGZhbHNlO1xuXHRcdHRoaXMubWF0dGVHcmlkcyA9IFtdOyAvLyBncmlkIG9mIGNlbGxzIHdoaWNoIG92ZXJsYXkgd2luZG93cyBhcyBkaW0tb3V0IGxheWVyc1xuXG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuQlVUVE9OX0NMSUNLRUQsIChldnQpID0+IHRoaXMuaGFuZGxlR2F0ZVN3aXRjaChldnQuZGF0YSkgKTtcblxuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgKGV2dCkgPT4ge1xuXHRcdFx0aWYgKGV2dC5kYXRhID09PSBTdGF0ZU1hbmFnZXIuUExBWV9BR0FJTikge1xuXHRcdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXZ0LmRhdGEgPT09IFN0YXRlTWFuYWdlci5XSU5ORVIpIHtcblx0XHRcdFx0dGhpcy5zb2x2ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuRVZFTlRfTkFNRSwgKGV2dCkgPT4ge1xuXHRcdFx0aWYgKGV2dC5kYXRhID09PSBTdGF0ZU1hbmFnZXIuRVhURVJOQUwpIHtcblx0XHRcdFx0dGhpcy5zZXRGb3JJT1MoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGluaXQoKSB7XG5cdFx0dGhpcy5tYXR0ZUdyaWRzLnB1c2gobmV3IEdyaWQoXG5cdFx0XHQxLCAxLCAvLyBvZmZzZXRzXG5cdFx0XHQxNSwgMTgsIC8vIGNvbHMgYW5kIHJvd3Ncblx0XHRcdDcuOCwgMjAuMiwgLy8gY2VsbCBzaXplXG5cdFx0XHQuNDUsIC8vIHlTaGlmdFxuXHRcdFx0dGhpcy5tZXNoRGF0YS5tZXNoLCAvLyBVc2VkIHRvIGNvbnN0cnVjdCBncmlkXG5cdFx0XHR1bmRlZmluZWQgLy8gZmlyc3QgZ3JpZCBjYWxjdWxhdGVzIHBvc2l0aW9ucyBmb3Igc29sdXRpb24gYnV0dG9ucyAoc3VidHJhY3RpdmVHcmlkcylcblx0XHQpKTtcblx0XHR0aGlzLm1lc2hEYXRhLmZsaXAoKTtcblx0XHR0aGlzLm1hdHRlR3JpZHMucHVzaChuZXcgR3JpZChcblx0XHRcdDExOCwgNTAsXG5cdFx0XHQxNSwgMTgsIC8vIGNvbHMgYW5kIHJvd3Ncblx0XHRcdDUuNSwgMjAuMixcblx0XHRcdC4yLFxuXHRcdFx0dGhpcy5tZXNoRGF0YS5tZXNoLFxuXHRcdFx0dGhpcy5tYXR0ZUdyaWRzWzBdLnN1YnRyYWN0aXZlR3JpZHNcblx0XHQpKTtcblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLlNPTFVUSU9OX1NFUVVFTkNFLCB7J2RhdGEnOiB0aGlzLm1hdHRlR3JpZHNbMF0uc3VidHJhY3RpdmVHcmlkc30pO1xuXHR9XG5cblx0c2V0Rm9ySU9TKCkge1xuXHRcdGNvbnNvbGUubG9nKCdpb3MnKTtcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tYXR0ZUdyaWRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0dGhpcy5tYXR0ZUdyaWRzW2luZGV4XS5zZXRGb3JJT1MoKTtcblx0XHR9XG5cdH1cblxuXHRyZXNldCgpIHtcblx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tYXR0ZUdyaWRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IHN1YnRyYWN0aXZlR3JpZDtcblx0XHRcdGlmIChpbmRleCA+IDApIHtcblx0XHRcdFx0c3VidHJhY3RpdmVHcmlkID0gdGhpcy5tYXR0ZUdyaWRzWzBdLnN1YnRyYWN0aXZlR3JpZHM7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW5kZXggIT09IDEpIHtcblx0XHRcdFx0dGhpcy5tZXNoRGF0YS5mbGlwKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubWF0dGVHcmlkc1tpbmRleF0ucmVzZXQoc3VidHJhY3RpdmVHcmlkLCB0aGlzLm1lc2hEYXRhLm1lc2gpO1xuXHRcdH1cblx0XHR0aGlzLnNvbHZlZCA9IGZhbHNlO1xuXHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuU09MVVRJT05fU0VRVUVOQ0UsIHsnZGF0YSc6IHRoaXMubWF0dGVHcmlkc1swXS5zdWJ0cmFjdGl2ZUdyaWRzfSk7XG5cdH1cblxuXHRoYW5kbGVHYXRlU3dpdGNoKGlkKSB7XG5cdFx0aWYgKHRoaXMuc29sdmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGZvciAobGV0IGZpbHRlckdyaWQsIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm1hdHRlR3JpZHMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRmaWx0ZXJHcmlkID0gdGhpcy5tYXR0ZUdyaWRzW2luZGV4XTtcblx0XHRcdGZpbHRlckdyaWQuYXBwbHlHYXRlKGlkLCBmaWx0ZXJHcmlkLnN1YnRyYWN0aXZlR3JpZHMuaW5kZXhPZihpZCkgIT09IC0xID8gR3JpZC5TVUJUUkFDVElWRSA6ICcnKTtcblx0XHR9XG5cdH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCBFdmVudE1hbmFnZXIsIHtldmVudE1hbmFnZXJ9IGZyb20gJy4vRXZlbnRNYW5hZ2VyLmpzJztcbmltcG9ydCBTdGF0ZU1hbmFnZXIgZnJvbSAnLi9zdGF0ZU1hbmFnZXInO1xuXG4vLyBsZXQgc3RhdGVNYW5hZ2VyID0gbmV3IFN0YXRlTWFuYWdlcigpO1xubGV0IG9yaWVudGF0aW9uQ2hhbmdlUGhhc2VDYWNoZSA9ICcnO1xuXG4vKiBkZWxheSBmYXN0IHJlcGVhdCBldmVudCBsaXN0ZW5lcnMsIGVnIHJlc2l6ZSAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdGxldCB0aW1lb3V0O1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0bGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuXHRcdGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0bGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0ZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHR9XG5cdH07XG59XG5cblxuZnVuY3Rpb24gZ2V0KGlkKSB7XG5cdHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG59XG5cblxuLyogVXNpbmcgdGhpcyBtZXRob2QgYXMgYW4gaW50ZXJmYWNlIHRvIGNoZWNrIHRocm91Z2ggdG8gaW5jbHVkZSBhbGwgbW9iaWxlICovXG5mdW5jdGlvbiBpc01vYmlsZSgpIHtcblx0cmV0dXJuIHdpbmRvdy5tb2JpbGVjaGVjaygpO1xufVxuXG4vKiByZXNwb25kIHRvIHJlc2l6ZSB0byBnZW5lcmF0ZSBhbmQgdXBkYXRlIG9mZnNldHMgKi9cbmZ1bmN0aW9uIHJlYWREZXZpY2VPcmllbnRhdGlvbih3cmFwcGVyKSB7XG5cdC8vIHJldHVybjtcblx0aWYgKCFpc01vYmlsZSgpKSB7XG5cdFx0cmV0dXJuO1xuXHRcdC8vIGNvbnNvbGUubG9nKCdCbG9ja2luZyByZWFkRGV2aWNlT3JpZW50YXRpb24oKSBtb2JpbGUgb25seSBjYXRjaCBmb3IgdGVzdGluZycpO1xuXHR9XG5cblx0bGV0IHJlY3QgPSB3cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRpZiAod2luZG93LmlubmVyV2lkdGggPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSByZWN0LnRvcCAtIDIpIHtcblx0XHQvLyBpZiAoZ2FtZVBoYXNlID09PSBQT1JUUkFJVCkge1xuXHRcdC8vIFx0Z2FtZVBoYXNlID0gb3JpZW50YXRpb25DaGFuZ2VQaGFzZUNhY2hlO1xuXHRcdC8vIH1cblx0fSBlbHNlIHtcblx0XHQvLyBvcmllbnRhdGlvbkNoYW5nZVBoYXNlQ2FjaGUgPSBnYW1lUGhhc2UgPT09IFBPUlRSQUlUID8gb3JpZW50YXRpb25DaGFuZ2VQaGFzZUNhY2hlIDogZ2FtZVBoYXNlO1xuXHRcdC8vIGdhbWVQaGFzZSA9IFBPUlRSQUlUO1xuXHRcdC8vIGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCB7J2RhdGEnOiBPUklFTlRBVElPTl9XQVJOSU5HfSk7XG5cdH1cblx0Ly8gY2xhc3NVdGlscy5zZXRDbGFzcygnY29udGFpbmVyJywgZ2FtZVBoYXNlKTtcbn1cblxuXG5leHBvcnQge2RlYm91bmNlLCBpc01vYmlsZSwgZ2V0LCByZWFkRGV2aWNlT3JpZW50YXRpb259O1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XG5cbi8qIFZpZGVvIGNvbnRyb2xsZXIgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludHJvVmlkZW8ge1xuXHRzdGF0aWMgZ2V0IFJVTl9BU19URVNUSU5HKCkge1xuXHRcdHJldHVybiBJbnRyb1ZpZGVvLnRlc3Rpbmc7XG5cdH1cblx0c3RhdGljIHNldCBSVU5fQVNfVEVTVElORyhib29sKSB7XG5cdFx0SW50cm9WaWRlby50ZXN0aW5nID0gYm9vbDtcblx0fVxuXHRjb25zdHJ1Y3Rvcih0ZXN0aW5nKSB7XG5cdFx0dGhpcy52aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXNpLXZpZGVvJyk7XG5cdFx0dGhpcy52aWRNZXNzYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigncC52aWRlby1tZXNzYWdlJyk7XG5cdFx0dGhpcy5jb3VudGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW8tbWVzc2FnZSAuY291bnRkb3duLWNvdW50Jyk7XG5cdFx0dGhpcy5jb3VudGVyID0gMztcblx0XHR0aGlzLmNvdW50RG93blJ1bm5pbmcgPSBmYWxzZTtcblx0XHR0aGlzLmNvdW50ZG93bkR1cmF0aW9uID0gMy41O1xuXHRcdHRoaXMudGVzdGluZyA9IHRlc3Rpbmc7XG5cblx0XHR0aGlzLnByb2dyZXNzRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlby1wcm9ncmVzcy13cmFwcGVyIC52aWRlby1wcm9ncmVzcycpO1xuXG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCAoZXZ0KSA9PiB7XG5cdFx0XHRzd2l0Y2ggKGV2dC5kYXRhKSB7XG5cdFx0XHRcdGNhc2UgU3RhdGVNYW5hZ2VyLlZJREVPOlxuXHRcdFx0XHRcdHRoaXMuc3RhcnQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qIElmIHRlc3Rpbmcgc2tpcCB2aWRlbywgb3RoZXJ3aXNlXG5cdFx0cGxheSB2aWRlbyBhbmQgbGlzdGVuIGZvciB0aW1ldXBkYXRlIGV2ZW50cyAqL1xuXHRzdGFydCgpIHtcblx0XHRpZiAoSW50cm9WaWRlby50ZXN0aW5nKSB7XG5cdFx0XHR0aGlzLmluaXRDb3VudGRvd24oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy52aWQucGxheSgpO1xuXHRcdFx0dGhpcy52aWQuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIChldnQpID0+IHRoaXMudXBkYXRlUGxheWJhY2tQZXJjZW50YWdlKGV2dCkpO1xuXHRcdH1cblx0fVxuXG5cdC8qIFNjYWxlIHRoZSBwcm9ncmVzcyBiYXIsIHBsdXMgaWYgbmVhciB0aGUgZW5kLCBzdHJhdCB0aGUgY291bnQtaW4gdG8gdGhlIGdhbWUgKi9cblx0dXBkYXRlUGxheWJhY2tQZXJjZW50YWdlKGV2dCkge1xuXHRcdGxldCBkdXJhdGlvbiA9IGV2dC50YXJnZXQuZHVyYXRpb247XG5cdFx0bGV0IGN1cnJlbnRUaW1lID0gZXZ0LnRhcmdldC5jdXJyZW50VGltZTtcblxuXHRcdHRoaXMucHJvZ3Jlc3NEaXNwbGF5LnN0eWxlLndpZHRoID0gKChjdXJyZW50VGltZSAqIDEwMCkgLyBkdXJhdGlvbikgKyAnJSc7XG5cblx0XHRpZiAoIXRoaXMuY291bnREb3duUnVubmluZyAmJiAoZHVyYXRpb24gLSBjdXJyZW50VGltZSA8IHRoaXMuY291bnRkb3duRHVyYXRpb24pKSB7XG5cdFx0XHR0aGlzLmluaXRDb3VudGRvd24oKTtcblx0XHR9XG5cdH1cblxuXHQvKiBTZXQgdmFyaWFibGVzIGFuZCByZXZlYWwgY291bnRkb3duIGVsZW1lbnRzICovXG5cdGluaXRDb3VudGRvd24oKSB7XG5cdFx0dGhpcy5jb3VudERvd25SdW5uaW5nID0gdHJ1ZTtcblx0XHR0aGlzLnZpZE1lc3NhZ2Uuc3R5bGUub3BhY2l0eSA9IDE7XG5cdFx0dGhpcy5jb3VudERvd24oKTtcblx0fVxuXG5cdC8qIFJlY3Vyc2l2ZSBtZXRob2QgdG8gdXBkYXRlIERPTSBjb3VudGRvd24gdmlzdWFsICovXG5cdGNvdW50RG93bigpIHtcblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzpTdGF0ZU1hbmFnZXIuQ09VTlRET1dOfSk7XG5cdFx0dGhpcy5jb3VudGRvd24uaW5uZXJIVE1MID0gJ2luLi4uPGJyPjxzcGFuIGNsYXNzPVwiY291bnRlclwiPicgKyB0aGlzLmNvdW50ZXItLSArICc8L3NwYW4+Jztcblx0XHRzZXRUaW1lb3V0KCAoKSA9PiAodGhpcy5jb3VudGVyID09PSAwID8gdGhpcy5wcmVzZXRQbGF5KCkgOiB0aGlzLmNvdW50RG93bigpKSwgMTAwMCk7XG5cdH1cblxuXHQvKiBGaW5hbCB1cGRhdGUgb2YgRE9NIGNvdW50ZG93biB2aXN1YWwgKi9cblx0cHJlc2V0UGxheSgpIHtcblx0XHR0aGlzLmNvdW50ZG93bi5pbm5lckhUTUwgPSAnaW4uLi48YnI+PHNwYW4gY2xhc3M9XCJjb3VudGVyXCI+JyArIHRoaXMuY291bnRlciArICc8L3NwYW4+Jztcblx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMucHVzaFRvUGxheSgpLCA2MDApO1xuXHR9XG5cblx0LyogRXZlbnQgdG8gc3RhcnQgZ2FtZSAqL1xuXHRwdXNoVG9QbGF5KCkge1xuXHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCB7J2RhdGEnOlN0YXRlTWFuYWdlci5QTEFZSU5HfSk7XG5cdFx0dGhpcy5jbGVhbigpO1xuXHR9XG5cblx0LyogQ2xlYW51cCAgKi9cblx0Y2xlYW4oKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRoaXMudmlkLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoZXZ0KSA9PiB0aGlzLnVwZGF0ZVBsYXliYWNrUGVyY2VudGFnZShldnQpKTtcblx0XHR9IGNhdGNoIChldnQpIHtcblx0XHRcdC8vXG5cdFx0fVxuXHR9XG59XG5leHBvcnQgbGV0IGludHJvVmlkZW8gPSBuZXcgSW50cm9WaWRlbygpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCAnLi9wb2x5ZmlsbHMnO1xuaW1wb3J0IHtkZWJvdW5jZSwgZ2V0LCByZWFkRGV2aWNlT3JpZW50YXRpb259IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcbmltcG9ydCB7c2Z4TWFuYWdlcn0gZnJvbSAnLi9zZnhNYW5hZ2VyJzsgLy8gU2luZ2xldG9uXG5pbXBvcnQgUGluV2F0Y2hlciBmcm9tICcuL3BpbldhdGNoZXInO1xuaW1wb3J0IEdyaWRNYW5hZ2VyIGZyb20gJy4vZ3JpZE1hbmFnZXInO1xuaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciwge3N0YXRlTWFuYWdlcn0gZnJvbSAnLi9zdGF0ZU1hbmFnZXInOyAvLyBTaW5nbGV0b25cbmltcG9ydCBHYW1lVGltZXIgZnJvbSAnLi9nYW1lVGltZXInO1xuaW1wb3J0IEludHJvVmlkZW8sIHtpbnRyb1ZpZGVvfSBmcm9tICcuL2ludHJvVmlkZW8nOyAvLyBTaW5nbGV0b25cbmltcG9ydCB7cmVwbGF5Q291bnR9IGZyb20gJy4vcmVwbGF5Q291bnQnOyAvLyBTaW5nbGV0b25cbmltcG9ydCB7Zm9ybU1hbmFnZXJ9IGZyb20gJy4vZm9ybU1hbmFnZXInOyAvLyBTaW5nbGV0b25cbmltcG9ydCB7cmVzdWx0c01hbmFnZXJ9IGZyb20gJy4vcmVzdWx0c01hbmFnZXInOyAvLyBTaW5nbGV0b25cblxuaW1wb3J0IEJ1YmJsZXMgZnJvbSAnLi9idWJibGVzJztcblxuXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRjb25zdCBDQU5WQVNfSUQgPSAnZ2FtZS13cmFwcGVyJyxcblx0XHRwYWdlUm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRjYW52YXNXaWR0aCA9IDIwNSxcblx0XHRjYW52YXNIZWlnaHQgPSA0MDQsXG5cdFx0VEVTVElORyA9IHRydWU7XHRcdC8vIFVzZWQgdG8gc2tpcCB2aWRlb1xuXG5cdGxldFx0d3JhcHBlciA9IGdldChDQU5WQVNfSUQpLFxuXHRcdGdyaWRDYW52YXMsXG5cdFx0cGluV2F0Y2hlciA9IG5ldyBQaW5XYXRjaGVyKCksXG5cdFx0Z3JpZE1hbmFnZXIgPSBuZXcgR3JpZE1hbmFnZXIoKSxcblx0XHRnYW1lVGltZXIgPSBuZXcgR2FtZVRpbWVyKDYwLCAnLnRpbWUtZGlzcGxheScpLFxuXHRcdGdhbWVQYWRCdXR0b25zQWN0aXZlID0gZmFsc2UsXG5cdFx0cmVwbGF5TG9ja2VkID0gZmFsc2UsXG5cdFx0YnViYmxlczEsXG5cdFx0YnViYmxlczIsXG5cdFx0Z2FtZVR5cGUgPSBTdGF0ZU1hbmFnZXIuSU5URVJOQUw7XG5cblx0SW50cm9WaWRlby5SVU5fQVNfVEVTVElORyA9IFRFU1RJTkc7XG5cdGdyaWRNYW5hZ2VyLmluaXQoKTtcblx0cGluV2F0Y2hlci5pbml0KCk7XG5cblx0bGV0IGNsb2NrV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9jay13cmFwcGVyJyk7XG5cdGxldCBjbG9ja1RvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lLXRvZ2dsZScpO1xuXG5cdERhdGUubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7IHJldHVybiArbmV3IERhdGUoKTsgfTtcblxuXHQvLyBFbmFibGUgY2xpY2sgZXZlbnRzIG9uIGluLWdhbWUgYnV0dG9ucyBvbmx5IG9uY2UgcGxheSBzdGFydHNcblx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCAoZXZ0KSA9PiB7XG5cdFx0aWYgKGV2dC5kYXRhID09PSBTdGF0ZU1hbmFnZXIuUExBWUlORykge1xuXHRcdFx0cmVwbGF5TG9ja2VkID0gZmFsc2U7IC8vIEFsbG93IHVzZXIgdG8gJ3BsYXkgYWdhaW4nXG5cdFx0XHRhY3RpdmF0ZUdhbWVCdXR0b25zKCk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBDaGFuZ2UgSFRNTCBpbnRlcmZhY2UgdG8gcmVmbGVjdCBzb2x1dGlvbiBzYXR1c1xuXHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5QSU5fVVBEQVRFLCAoZXZ0KSA9PiB7XG5cdFx0dXBkYXRlQnV0dG9uU3RhdGUoZXZ0LmRhdGEpO1xuXHR9KTtcblxuXHQvKiBzZXR1cCB0b3VjaCBldmVudHMgKi9cblx0ZnVuY3Rpb24gc2V0dXBFdmVudHMoKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRvdWNoSGFuZGxlciwgdHJ1ZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2hIYW5kbGVyLCB0cnVlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRvdWNoSGFuZGxlciwgdHJ1ZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0b3VjaEhhbmRsZXIsIHRydWUpO1xuXHR9XG5cdC8qIFRoaXMgZW5hYmxlcyB0b3VjaCBldmVudHMgKi9cblx0ZnVuY3Rpb24gdG91Y2hIYW5kbGVyKGV2ZW50KSB7XG5cdFx0Ly8gaWYoZ2FtZVBoYXNlICE9IFBMQVkpIHsgcmV0dXJuOyB9XG5cdFx0bGV0IHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcblx0XHRcdGZpcnN0ID0gdG91Y2hlc1swXSxcblx0XHRcdHR5cGUgPSAnJztcblx0XHRzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcblx0XHRcdGNhc2UgJ3RvdWNoc3RhcnQnOlx0dHlwZSA9ICdtb3VzZWRvd24nOyBicmVhaztcblx0XHRcdGNhc2UgJ3RvdWNobW92ZSc6XHR0eXBlID0gJ21vdXNlbW92ZSc7IGJyZWFrO1xuXHRcdFx0Y2FzZSAndG91Y2hlbmQnOlx0dHlwZSA9ICdtb3VzZXVwJztcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGxldCBzaW11bGF0ZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50Jyk7XG5cdFx0c2ltdWxhdGVkRXZlbnQuaW5pdE1vdXNlRXZlbnQodHlwZSwgdHJ1ZSwgdHJ1ZSwgd2luZG93LCAxLFxuXHRcdFx0Zmlyc3Quc2NyZWVuWCwgZmlyc3Quc2NyZWVuWSxcblx0XHRcdGZpcnN0LmNsaWVudFgsIGZpcnN0LmNsaWVudFksIGZhbHNlLFxuXHRcdFx0ZmFsc2UsIGZhbHNlLCBmYWxzZSwgMC8qbGVmdCovLCBudWxsKTtcblx0XHRmaXJzdC50YXJnZXQuZGlzcGF0Y2hFdmVudChzaW11bGF0ZWRFdmVudCk7XG5cdH1cblxuXHR3aW5kb3cub25vcmllbnRhdGlvbmNoYW5nZSA9IHJlYWREZXZpY2VPcmllbnRhdGlvbjtcblx0d2luZG93Lm9ucmVzaXplID0gcmVzaXplSGFuZGxlcjtcblx0cmVhZERldmljZU9yaWVudGF0aW9uKHdyYXBwZXIpO1xuXG5cdGlmICghKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgJiYgIW5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyAmJiAhbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMpIHtcblx0XHRwYWdlUm9vdC5jbGFzc05hbWUgKz0gJyBub3RvdWNoJztcblx0fVxuXG5cdC8qIHJlc3BvbmQgdG8gcmVzaXplIHRvIGdlbmVyYXRlIGFuZCB1cGRhdGUgb2Zmc2V0cyAqL1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblx0bGV0IHJlc2l6ZUhhbmRsZXIgPSBkZWJvdW5jZShmdW5jdGlvbihldnQpIHtcblx0XHRyZWFkRGV2aWNlT3JpZW50YXRpb24od3JhcHBlcik7XG5cdH0sIDEwMCk7XG5cblx0Ly8gRW5hYmxlIGNsaWNrIGV2ZW50cyBvbiBpbi1nYW1lIGJ1dHRvbnNcblx0bGV0IGJ1dHRvbnMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4nKSk7IC8vIGdyYWIgYWxsIC5idG4gZWxlbWVudHMgYXMgYXJyYXlcblx0ZnVuY3Rpb24gYWN0aXZhdGVHYW1lQnV0dG9ucygpIHtcblx0XHRpZiAoZ2FtZVBhZEJ1dHRvbnNBY3RpdmUpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGJ1dHRvbnMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRidXR0b25zW2luZGV4XS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQlVUVE9OX0NMSUNLRUQsIHsnZGF0YSc6aW5kZXh9KSk7XG5cdFx0fVxuXHRcdGdhbWVQYWRCdXR0b25zQWN0aXZlID0gdHJ1ZTtcblx0fVxuXG5cdC8vIENoYW5nZSBIVE1MIGludGVyZmFjZSB0byByZWZsZWN0IHNvbHV0aW9uIHNhdHVzXG5cdGZ1bmN0aW9uIHVwZGF0ZUJ1dHRvblN0YXRlKGlkKSB7XG5cdFx0aWYgKGlkID09PSBudWxsKSB7XG5cdFx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYnV0dG9ucy5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRcdFx0YnV0dG9uc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnY29ycmVjdCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmICghYnV0dG9uc1tpZF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdsb29rJykpIHtcblx0XHRcdFx0YnV0dG9uc1tpZF0uY2xhc3NMaXN0LmFkZCgnY29ycmVjdCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIFNldCBjbGljayBsaXN0ZW5lcnMgZm9yIGludGVyZmFjZSBidXR0b25zIHdoaWNoIGFsbG93IHVzZXIgdG8gbmF2aWdhdGUgdGhyb3VnaCBnYW1lIGludGVyZmFjZVxuXHRmdW5jdGlvbiBhZGRDbGlja0xpc3RlbmVycygpIHtcblx0XHQvLyBTb21lIHBhZ2VzIGhhdmUgaW50ZXJuYWwvZXh0ZXJuYWwgdmVyc2lvbnMsIHdoaWNoIHJlcXVpcmUgZGlmZmVyZW50IGJ1dHRvbnMgdG8gYmUgaG9va2VkIHVwXG5cdFx0aWYgKGdhbWVUeXBlID09PSBTdGF0ZU1hbmFnZXIuSU5URVJOQUwpIHtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1idXR0b24uaG93LXRvLXBsYXknKS5hZGRFdmVudExpc3RlbmVyICgnY2xpY2snLCAoKSA9PiBldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzpTdGF0ZU1hbmFnZXIuSE9XX1RPfSkpO1xuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsLWJ1dHRvbi5iYWNrJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzpTdGF0ZU1hbmFnZXIuQkFDS30pKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwtYnV0dG9uLmhvdy10by1wbGF5LWV4dGVybmFsJykuYWRkRXZlbnRMaXN0ZW5lciAoJ2NsaWNrJywgKCkgPT4gZXZlbnRNYW5hZ2VyLmRpc3BhdGNoKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIHsnZGF0YSc6U3RhdGVNYW5hZ2VyLkhPV19UT30pKTtcblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1idXR0b24uYmFjay1leHRlcm5hbCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gZXZlbnRNYW5hZ2VyLmRpc3BhdGNoKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIHsnZGF0YSc6U3RhdGVNYW5hZ2VyLkJBQ0t9KSk7XG5cdFx0fVxuXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVsLWJ1dHRvbi53YXRjaC1maWxtJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzpTdGF0ZU1hbmFnZXIuVklERU99KSk7XG5cblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFuZWwtYnV0dG9uLnBsYXktYWdhaW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldnQpID0+IHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Y2FsbFBsYXlBZ2FpbigpO1xuXHRcdH0pO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lbC1idXR0b24ucGxheS1hZ2Fpbi1ib2FyZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2dCkgPT4ge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjYWxsUGxheUFnYWluKCk7XG5cdFx0fSk7XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWUtb3B0aW9uLWJ1dHRvbnMgLnJlc2V0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGNhbGxQbGF5QWdhaW4oKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNhbGxQbGF5QWdhaW4oKSB7XG5cdFx0aWYgKHJlcGxheUxvY2tlZCkge1xuXHRcdFx0LyogU3RvcCByZXBsYXkgLyBwbGF5IGFnYWluIGJlaW5nIGNsaWNrZWQgbXVsdGlwbGUgdGltZXMgRkJ6IDgyMzg3ICovXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCB7J2RhdGEnOlN0YXRlTWFuYWdlci5QTEFZX0FHQUlOfSk7XG5cdFx0cmVwbGF5TG9ja2VkID0gdHJ1ZTtcblx0fVxuXG5cdC8vIFRvZ2dsZSBhdWRpbyBvbiB1c2VyIGludGVyYWN0aW9uXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lLW9wdGlvbi1idXR0b25zIC5tdXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7ZXZ0LnByZXZlbnREZWZhdWx0KCk7IGhhbmRsZU11dGVUb2dnbGUoKTt9KTtcblx0ZnVuY3Rpb24gaGFuZGxlTXV0ZVRvZ2dsZSgpIHtcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vcHRpb24tYnV0dG9ucyAubXV0ZScpLmNsYXNzTGlzdC50b2dnbGUoJ211dGVkJyk7XG5cdFx0ZXZlbnRNYW5hZ2VyLmRpc3BhdGNoKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIHsnZGF0YSc6RXZlbnRNYW5hZ2VyLk1VVEVfVE9HR0xFfSk7XG5cdH1cblxuXHQvLyBTZXQgY2xpY2sgbGlzdGVuZXJzIG9uIFQmQyBsaW5rcyBpbiBhbGwgdmlld3Ncblx0bGV0IHRuY0xpbmtzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG5jLWxpbmsnKSk7IC8vIGdyYWIgYWxsIC50bmMgbGlua3MgYXMgYXJyYXlcblx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRuY0xpbmtzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdHRuY0xpbmtzW2luZGV4XS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCB7J2RhdGEnOlN0YXRlTWFuYWdlci5UTkN9KSk7XG5cdH1cblxuXHQvLyBUb2dnbGUgZ2FtZSBjb3VudGVyIGNsb2NrIHZpc2FibGl0eSAtIHRvIHJlbW92ZSBub24tZXNzZW50YWlsIG1vdmVtb3ZlbWVudCBmcm9tIGdhbWUgaWYgdXNlciBkZXNpcmVzXG5cdGNsb2NrVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlQ2xvY2soKSk7XG5cdGZ1bmN0aW9uIHRvZ2dsZUNsb2NrKCkge1xuXHRcdGNsb2NrV3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdjbG9zZWQnKTtcblx0fVxuXG5cdC8vIEFkZCBhbGwgZmlsdGVyIGdyaWRzIHRvIHJlbmRlciBxdWV1ZVxuXHRncmlkQ2FudmFzID0gbmV3IENhbnZhcyhDQU5WQVNfSUQsICdnYW1lLWNhbnZhcycsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQsIChncmlkQ2FudmFzKSA9PiB7XG5cdFx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGdyaWRNYW5hZ2VyLm1hdHRlR3JpZHMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRncmlkTWFuYWdlci5tYXR0ZUdyaWRzW2luZGV4XS5yZW5kZXIoZ3JpZENhbnZhcyk7XG5cdFx0fVxuXHR9KTtcblxuXG5cblx0Ly8gQ2FsbGVkIGVhY2ggZnJvbWUgdG8gcmVuZGVyIGdhbWUgY2FudmFzIGFuZCB1cGRhdGUgdGltZXJcblx0ZnVuY3Rpb24gZ2FtZVJlbmRlckxvb3AoKSB7XG5cdFx0Z3JpZENhbnZhcy5yZW5kZXIoKTtcblx0XHRnYW1lVGltZXIudXBkYXRlKCk7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdFx0cmVxdWVzdEFuaW1GcmFtZShnYW1lUmVuZGVyTG9vcCk7XHQvLyAtLSBSQUYgaW1wb3J0ZWQgd2l0aCBwb2x5ZmlsbHMuanNcblx0fVxuXG5cdGZ1bmN0aW9uIHN0YXJ0UmVuZGVyaW5nKCkge1xuXHRcdGdhbWVSZW5kZXJMb29wKCk7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBwbGF5aW5nIHdpdGggYSBoYXNoIC0gdGhpcyB0b2dnbGVzIGdhbWUgZmVhdHVyZXMgKGVudHJ5IGZvcm0pIGZvciBpbnRlcm5hbCBvciBleHRlcm5hbCBwbGF5XG5cdGZ1bmN0aW9uIGNoZWNrRXZlbnRIYXNoKCkge1xuXHRcdGxldCBldmVudE5hbWUgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKTtcblx0XHRnYW1lVHlwZSA9IChldmVudE5hbWUgIT09IHVuZGVmaW5lZCAmJiBldmVudE5hbWUgIT09ICcnKSA/IFN0YXRlTWFuYWdlci5FWFRFUk5BTCA6IFN0YXRlTWFuYWdlci5JTlRFUk5BTDtcblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkVWRU5UX05BTUUsIHsnZGF0YSc6Z2FtZVR5cGV9KTtcblx0fVxuXG5cdC8qIFdlIGFyZSBzZWVpbmcgcGVyZm9ybWFuY2UgaGl0IG9uIHRoZXNlIGRldmljZXMuXG5cdFx0UmVtb3ZlIGV4dHJhbmlvdXMgZWxlbWVudHMuICovXG5cdGZ1bmN0aW9uIGlzTm90TGVnYWN5SVBob25lKCkge1xuXHRcdGxldCB3aW5kb3dIID0gd2luZG93LmlubmVySGVpZ2h0LFxuXHRcdFx0d2luZG93VyA9IHdpbmRvdy5pbm5lcldpZHRoLFxuXHRcdFx0dmFsaWQgPSB0cnVlO1xuXHRcdGlmICh3aW5kb3dIID09PSAzMjAgfHwgd2luZG93VyA9PT0gMzIwKSB7XG5cdFx0XHR2YWxpZCA9IGZhbHNlO1xuXHRcdH0gZWxzZSBpZiAod2luZG93SCA9PT0gMzc1IHx8IHdpbmRvd1cgPT09IDM3NSkge1xuXHRcdFx0dmFsaWQgPSBmYWxzZTtcblx0XHR9IGVsc2UgaWYgKHdpbmRvd0ggPT09IDQxNCB8fCB3aW5kb3dXID09PSA0MTQpIHtcblx0XHRcdHZhbGlkID0gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZDtcblx0fVxuXG5cdHNldHVwRXZlbnRzKCk7XG5cdGNoZWNrRXZlbnRIYXNoKCk7XG5cblx0aWYgKGlzTm90TGVnYWN5SVBob25lKCkgJiYgZ2FtZVR5cGUgPT09IFN0YXRlTWFuYWdlci5JTlRFUk5BTCkge1xuXHRcdC8vIFRoZXNlIGFyZSB0aGUgY2hhbXBhZ25lIGJ1YmJsZXMsIGZvciBzdWJ0bGUgdmlzdWFsIGVmZmVjdFxuXHRcdGJ1YmJsZXMxID0gbmV3IEJ1YmJsZXMoJ2J1YmJsZXNfMScpO1xuXHRcdGJ1YmJsZXMyID0gbmV3IEJ1YmJsZXMoJ2J1YmJsZXNfMicpO1xuXHR9XG5cdGFkZENsaWNrTGlzdGVuZXJzKCk7XG5cdHN0YXJ0UmVuZGVyaW5nKCk7XG5cblx0c3RhdGVNYW5hZ2VyLnVwZGF0ZURPTSgpO1xuXG5cdC8vIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ0NBS0UnLCAoKSA9PiB7IGNvbnNvbGUubG9nKCdnZXQgY2FrZScpfSApO1xuXHQvLyBldmVudE1hbmFnZXIuc3Vic2NyaWJlKCdDQUtFJywgKCkgPT4geyBjb25zb2xlLmxvZygnZWF0IGNha2UnKX0gKTtcblx0Ly8gZXZlbnRNYW5hZ2VyLnVuc3Vic2NyaWJlKCdDQUtFJywgKCkgPT4geyBjb25zb2xlLmxvZygnZ2V0IGNha2UnKX0gKTtcbn0oKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIE1hcCBvZiBjZWxscyB0byBjb3Zlci9yZXZlYWwgd2luZG93cy5cblx0RWFjaCBvZiBhLGIsYyxkIHJlZmxlY3RzIGEgZ3JvdXAgb2YgY2VsbHMgd2hpY2ggY2FuIGJlIGFmZmVjdGVkIGJ5IGEgc2luZ2xlIGJ1dHRvbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzaERhdGEge1xuXHRjb25zdHJ1Y3RvcihmbGlwID0gZmFsc2UpIHtcblx0XHR0aGlzLm1lc2ggPSBbJ2QnLCdkJywnZCcsJ2QnLCdkJywnYicsJ2InLCdiJywnYicsJ2MnLCdjJywnYycsJ2EnLCdhJywnYScsJ2QnLCdkJywnZCcsJ2QnLCdkJywnYicsJ2InLCdiJywnYicsJ2MnLCdjJywnYycsJ2EnLCdhJywnYScsJ2QnLCdkJywnZCcsJ2QnLCdkJywnYicsJ2InLCdiJywnYicsJ2MnLCdjJywnYycsJ2EnLCdhJywnYScsJ2QnLCdiJywnYycsJ2EnLCdiJywnYicsJ2EnLCdhJywnYycsJ2QnLCdkJywnYicsJ2InLCdiJywnYicsJ2QnLCdiJywnYycsJ2EnLCdiJywnYicsJ2EnLCdhJywnYycsJ2QnLCdhJywnYScsJ2EnLCdhJywnYScsJ2QnLCdiJywnYycsJ2EnLCdiJywnYicsJ2EnLCdhJywnYicsJ2InLCdiJywnYicsJ2InLCdiJywnYicsJ2QnLCdiJywnYycsJ2EnLCdiJywnYicsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2QnLCdiJywnYycsJ2EnLCdiJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdiJywnYycsJ2EnLCdiJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdiJywnYycsJ2EnLCdiJywnYycsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2QnLCdiJywnYycsJ2EnLCdiJywnYicsJ2InLCdiJywnYicsJ2InLCdiJywnYicsJ2InLCdiJywnYicsJ2QnLCdhJywnYycsJ2EnLCdiJywnYicsJ2InLCdiJywnYicsJ2InLCdiJywnYicsJ2InLCdiJywnYicsJ2QnLCdhJywnYycsJ2MnLCdiJywnZCcsJ2EnLCdhJywnYScsJ2EnLCdhJywnYScsJ2EnLCdhJywnYScsJ2QnLCdhJywnZCcsJ2MnLCdiJywnZCcsJ2EnLCdhJywnYScsJ2EnLCdhJywnYScsJ2EnLCdhJywnYScsJ2MnLCdhJywnZCcsJ2MnLCdiJywnZCcsJ2InLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdhJywnZCcsJ2MnLCdiJywnZCcsJ2InLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdjJywnYycsJ2MnLCdhJywnZCcsJ2QnLCdiJywnZCcsJ2InLCdhJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCcsJ2MnLCdhJywnZCcsJ2QnLCdiJywnZCcsJ2InLCdhJywnZCcsJ2QnLCdkJywnZCcsJ2QnLCdkJywnZCddO1xuXHRcdGlmIChmbGlwKSB7XG5cdFx0XHR0aGlzLmZsaXAoKTtcblx0XHR9XG5cdH1cblxuXHQvKiBUaGlzIHJldmVyc2VzIHRoZSBzZXF1ZW5jZSBzbyBlYWNoIG9mIHRoZSB0d28gYnVpbGRpbmdzIGNhbiBzaGFyZSB0aGlzIGRhdGEsIGJ1dCBub3QgYmUgaWRlbnRpY2FsICovXG5cdGZsaXAoKSB7XG5cdFx0dGhpcy5tZXNoID0gdGhpcy5tZXNoLnJldmVyc2UoKTtcblx0fVxufVxuIiwiaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XG5cbid1c2Ugc3RyaWN0JztcblxuLyogS2VlcHMgd2F0Y2ggb24gdGhlIGN1cnJlbnQgc29sdmVkIHN0YXRlIG9mIHRoZSBQSU4gc29sdXRpb25cblx0SXMgcmVzcG9uc2libGUgdG8gZGlzcGF0Y2ggZXZlbnQgd2hlbiB0aGUgcHV6emxlIGlzIHNvbHZlZCwgd2hpY2ggc3RvcHMgY2xvY2ssIHRyaWdnZXJzIGVuZCBzZXF1ZW5jZSBldGMuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaW5XYXRjaGVyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5waW47XG5cdFx0dGhpcy5zb2x2ZWRTZXF1ZW5jZSA9IFtdO1xuXG5cdFx0LyogQ2hlY2sgZm9yIHJpZ2h0IGJ1dCB3cm9uZyAtIGNvcnJlY3QgbnVtYmVycywgd3Jvbmcgc2VxdWVuY2UgKi9cblx0XHR0aGlzLnBpbk9yZGVyZWQgPSBbXTsgLy8gaG9sZHMgdmVyc2lvbiBvZiBQSU4sIGJ1dCBzb3J0ZWRcblx0XHR0aGlzLmtleVN0YWNrID0gWy0xLC0xLC0xLC0xXTsgLy8gbGFzdCBmb3VyIG51bWJlclxuXHRcdHRoaXMucmlnaHRCdXRXcm9uZyA9IGZhbHNlO1xuXG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuU09MVVRJT05fU0VRVUVOQ0UsIChldnQpID0+IHsgdGhpcy5zZXRQaW4oZXZ0LmRhdGEpOyB9KTtcblx0fVxuXG5cdGluaXQoKSB7XG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuQlVUVE9OX0NMSUNLRUQsIChldnQpID0+IHsgdGhpcy5oYW5kbGVHYXRlU3dpdGNoKGV2dC5kYXRhKTsgfSk7XG5cdH1cblxuXHQvKiBSZWZlcmVuY2UgdG8gd2lubmluZyBQSU4gKi9cblx0c2V0UGluKHBpbikge1xuXHRcdHRoaXMucGluID0gcGluO1xuXHRcdHRoaXMucGluT3JkZXJlZFN0cmluZyA9IHRoaXMucGluLnNsaWNlKCkuc29ydCgpLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5rZXlTdGFjayA9IFstMSwtMSwtMSwtMV07XG5cdFx0dGhpcy5yZXNldFNvbHZlZFNlcXVlbmNlKCk7XG5cblx0XHQvLyBsb2dnaW5nIG91dCBzb2x1dGlvbiBmb3IgZmFzdGVyIHRlc3Rpbmdcblx0XHRjb25zb2xlLmxvZygnUElOOicsIHRoaXMucGluLm1hcCgodmFsKSA9PiB2YWwgKyAxKS50b1N0cmluZygpKTtcblx0fVxuXG5cdC8qIENsZWFycyBhbnkgc3RvcmVkIChwYXJ0aWFsKSBzb2x1dGlvblxuXHRcdERpc3BhdGNoZXMgdXBkYXRlIHRvIGJyb2FkY2FzdCByZXNldCAqL1xuXHRyZXNldFNvbHZlZFNlcXVlbmNlKCkge1xuXHRcdHRoaXMuc29sdmVkU2VxdWVuY2UgPSBbXTtcblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLlBJTl9VUERBVEUsIHsnZGF0YSc6IG51bGx9KTtcblx0fVxuXG5cdGhhbmRsZUdhdGVTd2l0Y2goaWQpIHtcblx0XHQvLyBDaGVjayBpZiBjb3JyZWN0IGtleXMsIGJ1dCAocG90ZW50aWFsbHkpIHdyb25nIG9yZGVyXG5cdFx0dGhpcy5yaWdodEJ1dFdyb25nID0gZmFsc2U7XG5cdFx0dGhpcy5rZXlTdGFjay51bnNoaWZ0KGlkKTtcblx0XHR0aGlzLmtleVN0YWNrLnBvcCgpO1xuXHRcdGlmICh0aGlzLmtleVN0YWNrLnNsaWNlKCkuc29ydCgpLnRvU3RyaW5nKCkgPT09IHRoaXMucGluT3JkZXJlZFN0cmluZykge1xuXHRcdFx0dGhpcy5yaWdodEJ1dFdyb25nID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmtleVN0YWNrLnNsaWNlKCkuc29ydCgpLnRvU3RyaW5nKCksIHRoaXMucGluT3JkZXJlZFN0cmluZylcblxuXHRcdC8vIHplcm8gYmFzZWQgSURzXG5cdFx0aWYgKGlkID09PSB0aGlzLnBpblt0aGlzLnNvbHZlZFNlcXVlbmNlLmxlbmd0aF0pIHtcblx0XHRcdHRoaXMuc29sdmVkU2VxdWVuY2UucHVzaChpZCk7XG5cdFx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLlBJTl9VUERBVEUsIHsnZGF0YSc6IGlkfSk7XG5cdFx0XHRpZiAodGhpcy5zb2x2ZWRTZXF1ZW5jZS5sZW5ndGggPT09IHRoaXMucGluLmxlbmd0aCAmJiB0aGlzLnNvbHZlZFNlcXVlbmNlLnRvU3RyaW5nKCkgPT09IHRoaXMucGluLnRvU3RyaW5nKCkpIHtcblx0XHRcdFx0ZXZlbnRNYW5hZ2VyLmRpc3BhdGNoKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIHsnZGF0YSc6IFN0YXRlTWFuYWdlci5XSU5ORVJ9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBQSU4gd2FzIHdyb25nIC0gcmVzZXQgUElOIHBhZFxuXHRcdFx0dGhpcy5yZXNldFNvbHZlZFNlcXVlbmNlKCk7XG5cdFx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLlBJTl9VUERBVEUsIHsnZGF0YSc6IG51bGx9KTtcblxuXHRcdFx0LyogTnVtYmVycyBjb3JyZWN0IGJ1dCB3cm9uZyBvcmRlci4gUmVxdWVzdCBVSSB1cGRhdGVcblx0XHRcdFx0U2VuZCB0aHJvdWdoIGtleXMgcHJlc3NlZCwganVzdCBpbiBjYXNlLi4uICovXG5cdFx0XHRpZiAodGhpcy5yaWdodEJ1dFdyb25nKSB7XG5cdFx0XHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChTdGF0ZU1hbmFnZXIuUklHSFRfQlVUX1dST05HLCB7J2RhdGEnOiB0aGlzLmtleVN0YWNrfSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxufVxuLy8gZXhwb3J0IGxldCBwaW5XYXRjaGVyID0gbmV3IFBpbldhdGNoZXIoKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11c2VsZXNzLWVzY2FwZSAqL1xuLyogZXNsaW50LWRpc2FibGUgaWQtbGVuZ3RoICovXG4ndXNlIHN0cmljdCc7XG5cbi8qIFV0aWxpdGllcyAqL1xud2luZG93Lm1vYmlsZWNoZWNrID0gZnVuY3Rpb24oKSB7XG5cdGxldCBjaGVjayA9IGZhbHNlO1xuXG5cdChmdW5jdGlvbihhKSB7aWYgKC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm98YW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaS50ZXN0KGEpIHx8IC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCw0KSkpIHtcblx0XHRjaGVjayA9IHRydWU7XG5cdH1cblx0fSkobmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudmVuZG9yIHx8IHdpbmRvdy5vcGVyYSk7XG5cdHJldHVybiBjaGVjaztcbn07XG5cbi8qIFBvbHlmaWxscyAqL1xud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHRcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdFx0XHRmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0XHRcdH07XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEV2ZW50TWFuYWdlciwge2V2ZW50TWFuYWdlcn0gZnJvbSAnLi9FdmVudE1hbmFnZXIuanMnO1xuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XG5cbi8qIEEgZ2FtZSB2aWV3IHdoaWNoIGRpc3BsYXlzIGEgY291bnRkb3duIGludG8gdGhlIGdhbWUsIGFmdGVyIHRoZSBpbml0aWFsIHBsYXksIHdoaWNoIGlzIHByZWNlZWRlZCBieSB0aGUgdmlkZW8gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcGxheUNvdW50IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5jb3VudGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVwbGF5LWNvdW50Jyk7XG5cdFx0dGhpcy5jb3VudGVyID0gMztcblx0XHR0aGlzLmNvdW50RG93blJ1bm5pbmcgPSBmYWxzZTtcblx0XHR0aGlzLmNvdW50ZG93bkR1cmF0aW9uID0gMy41O1xuXG5cdFx0ZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCAoZXZ0KSA9PiB7IGlmIChldnQuZGF0YSA9PT0gU3RhdGVNYW5hZ2VyLlBMQVlfQUdBSU4pIHt0aGlzLmluaXQoKTt9IH0pO1xuXHR9XG5cblx0aW5pdCgpIHtcblx0XHR0aGlzLmNvdW50ZXIgPSAzO1xuXHRcdHRoaXMuY291bnREb3duUnVubmluZyA9IHRydWU7XG5cdFx0dGhpcy5jb3VudERvd24oKTtcblx0fVxuXG5cdC8qIFJlY3Vyc2l2ZSBtZXRob2QgdG8gdXBkYXRlIERPTSBjb3VudGRvd24gdmlzdWFsICovXG5cdGNvdW50RG93bigpIHtcblx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzpTdGF0ZU1hbmFnZXIuQ09VTlRET1dOfSk7XG5cdFx0dGhpcy5jb3VudGRvd24uaW5uZXJIVE1MID0gJ2luLi4uPGJyPjxzcGFuIGNsYXNzPVwiY291bnRlclwiPicgKyB0aGlzLmNvdW50ZXItLSArICc8L3NwYW4+Jztcblx0XHRzZXRUaW1lb3V0KCAoKSA9PiAodGhpcy5jb3VudGVyID09PSAwID8gdGhpcy5wcmVzZXRQbGF5KCkgOiB0aGlzLmNvdW50RG93bigpKSwgMTAwMCk7XG5cdH1cblxuXHQvKiBGaW5hbCB1cGRhdGUgb2YgRE9NIGNvdW50ZG93biB2aXN1YWwgKi9cblx0cHJlc2V0UGxheSgpIHtcblx0XHR0aGlzLmNvdW50ZG93bi5pbm5lckhUTUwgPSAnaW4uLi48YnI+PHNwYW4gY2xhc3M9XCJjb3VudGVyXCI+JyArIHRoaXMuY291bnRlciArICc8L3NwYW4+Jztcblx0XHRzZXRUaW1lb3V0KCgpID0+IHRoaXMucHVzaFRvUGxheSgpLCA2MDApO1xuXHR9XG5cblx0LyogRXZlbnQgdG8gc3RhcnQgZ2FtZSAqL1xuXHRwdXNoVG9QbGF5KCkge1xuXHRcdGV2ZW50TWFuYWdlci5kaXNwYXRjaChFdmVudE1hbmFnZXIuQ0hBTkdFX1NUQVRFLCB7J2RhdGEnOlN0YXRlTWFuYWdlci5QTEFZSU5HfSk7XG5cdH1cbn1cbmV4cG9ydCBsZXQgcmVwbGF5Q291bnQgPSBuZXcgUmVwbGF5Q291bnQoKTtcbiIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBFdmVudE1hbmFnZXIsIHtldmVudE1hbmFnZXJ9IGZyb20gJy4vRXZlbnRNYW5hZ2VyLmpzJztcbmltcG9ydCBTdGF0ZU1hbmFnZXIgZnJvbSAnLi9zdGF0ZU1hbmFnZXInO1xuaW1wb3J0IHtnYW1lVGltZXJVdGlsc30gZnJvbSAnLi9nYW1lVGltZXJVdGlscyc7XG5cbi8qIFNpbmdsZXRvbiB0byBtYW5hZ2UgREIgaW50ZXJhY3Rpb25zLCBwYXJzaW5nIGFuZCBkaXNwbGF5IG9mIHJlc3VsdHMgKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3VsdHNNYW5hZ2VyIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5yZXN1bHRzVVJMID0gJ2h0dHBzOi8vY2FtcGFpZ25zLmFiZXJkZWVuc3RhbmRhcmQuY29tL0FTSS1jYXBhYmlsaXRpZXMvZ2FtZWZhY2UvbGVhZGVyYm9hcmQuanNvbic7XG5cdFx0Ly8gdGhpcy5yZXN1bHRzVVJMID0gJy9sZWFkZXJib2FyZC5qc29uJztcblx0XHR0aGlzLnNjb3JlID0gMDtcblx0XHR0aGlzLnBsYXllck5hbWU7XG5cdFx0dGhpcy5wbGF5ZXJFbWFpbDtcblxuXHRcdHRoaXMuc3VibWl0Q2FjaGU7XG5cblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIChldnQpID0+IHtcblx0XHRcdGlmIChldnQuZGF0YSA9PT0gRXZlbnRNYW5hZ2VyLlNFTkRfREFUQSkge1xuXHRcdFx0XHR0aGlzLnBsYXllck5hbWUgPSBldnQudGhpc1BsYXllck5hbWU7XG5cdFx0XHRcdHRoaXMucGxheWVyRW1haWwgPSBldnQudGhpc1BsYXllckVtYWlsO1xuXHRcdFx0XHR0aGlzLmltcHJvdmVkU2NvcmUgPSBmYWxzZTtcblx0XHRcdFx0Ly8gdGhpcy5zZW5kUmVzdWx0KGV2dCk7XG5cdFx0XHRcdHRoaXMuc3VibWl0Q2FjaGUgPSBldnQ7XG5cdFx0XHRcdHRoaXMucHJlRmV0Y2hTY29yZXMoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKFN0YXRlTWFuYWdlci5TQ09SRSwgKGV2dCkgPT4ge1xuXHRcdFx0dGhpcy5zY29yZSA9IGV2dC5yYXc7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCdzY29yZSAodGltZSkgZm9yIERCJywgZXZ0LnJhdyk7XG5cdFx0fSk7XG5cblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5FVkVOVF9OQU1FLCAoZXZ0KSA9PiB7XG5cdFx0XHRpZiAoZXZ0ID09PSBTdGF0ZU1hbmFnZXIuRVhURVJOQUwpIHtcblx0XHRcdFx0dGhpcy5yZXN1bHRzVVJMID0gJ2h0dHBzOi8vY2FtcGFpZ25zLmFiZXJkZWVuc3RhbmRhcmQuY29tL0FTSS1jYXBhYmlsaXRpZXMvZ2FtZWZhY2UvbGVhZGVyYm9hcmQtcGxzYS5qc29uJztcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMucmVzdWx0RmllbGRzO1xuXHRcdHRoaXMucmVzdWx0REJFbnRyaWVzID0gW107XG5cdFx0dGhpcy5ncmFiRE9NKCk7XG5cdH1cblxuXHQvLyBHYXRoZXIgYW5kIGhvbGQgYSByZWZlcmVuY2UgdG8gbGVhZGVyYm9hcmQgZmllbGRzLCByZWFkeSBmb3IgcG9wdWxhdGluZ1xuXHRncmFiRE9NKCkge1xuXHRcdHRoaXMucmVzdWx0RmllbGRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyLXJlc3VsdCcpKTtcblx0fVxuXG5cdC8qIEJlZm9yZSBzdWJtaXR0aW5nIHdlIG5lZWQgdG8gZ3JhYiBleGlzdGluZyBzY29yZXMgYW5kIGNoZWNrIGN1cnJlbnQgc2NvcmUgaXNuJ3QgbG93ZXJcblx0XHQuLi5iZWNhdXNlIG5vIGZhY2lsaXR5IGZvciB0aGlzIG9uIHRoZSBzZXJ2ZXIgKi9cblx0cHJlRmV0Y2hTY29yZXMoKSB7XG5cdFx0Ly8gZ3JhYiByZXN1bHRzIGZyb20gREJcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMucmVzdWx0c1VSTCk7XG5cdFx0bGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHRoaXMucmVzdWx0c1VSTCk7XG5cdFx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnanNvbic7XG5cdFx0cmVxdWVzdC5vbmxvYWQgPSAoZXZ0KSA9PiB7XG5cdFx0XHRpZiAoZXZ0LnNyY0VsZW1lbnQuc3RhdHVzID49IDIwMCAmJiBldnQuc3JjRWxlbWVudC5zdGF0dXMgPCA0MDApIHtcblx0XHRcdFx0Ly8gb24gc3VjY2Vzcy4uLlxuXHRcdFx0XHR0aGlzLnBhcnNlUHJlRmV0Y2hEYXRhKGV2dC5zcmNFbGVtZW50LnJlc3BvbnNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIFdlIHJlYWNoZWQgb3VyIHRhcmdldCBzZXJ2ZXIsIGJ1dCBpdCByZXR1cm5lZCBhbiBlcnJvclxuXHRcdFx0XHR0aGlzLmhhbmRsZURCRXJyb3IoZXZ0LnNyY0VsZW1lbnQucmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmVxdWVzdC5vbmVycm9yID0gKCkgPT4ge1xuXHRcdFx0Ly8gVGhlcmUgd2FzIGEgY29ubmVjdGlvbiBlcnJvciBvZiBzb21lIHNvcnRcblx0XHRcdHRoaXMuaGFuZGxlREJFcnJvcigpO1xuXHRcdH07XG5cdFx0cmVxdWVzdC5zZW5kKCk7XG5cdH1cblxuXHQvKiBCcmluZyBiYWNrIHNjb3JlIGRhdGEgdG8gY2hlY2sgaWYgbmV3IHNjb3JlIGlzIGJldHRlciAqL1xuXHRwYXJzZVByZUZldGNoRGF0YShyZXNwKSB7XG5cdFx0LyogRG8gZnVsbCBwYXJzZSBvZiBkYXRhLCBzbyB3ZSBjYW4gd3JpdGUgbGVhZGVyYm9hcmQgaWYgc2NvcmUgaXMgTk9UIGJldHRlciAqL1xuXHRcdGxldCBpbXByb3ZlZFNjb3JlID0gZmFsc2U7XG5cdFx0bGV0IG5ld1VzZXIgPSB0cnVlO1xuXHRcdHRoaXMucmVzdWx0REJFbnRyaWVzLmxlbmd0aCA9IDA7XG5cdFx0aWYgKHR5cGVvZiByZXNwID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmVzcCA9IEpTT04ucGFyc2UocmVzcCk7XG5cdFx0fVxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCByZXNwLmVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IGRhdCA9IHt9O1xuXHRcdFx0ZGF0Lm5hbWUgPSByZXNwLmVsZW1lbnRzW2luZGV4XS5maWVsZFZhbHVlc1s0XS52YWx1ZTtcblx0XHRcdGRhdC5zY29yZSA9IE51bWJlcihyZXNwLmVsZW1lbnRzW2luZGV4XS5maWVsZFZhbHVlc1szXS52YWx1ZSk7XG5cdFx0XHRkYXQudWlkID0gcmVzcC5lbGVtZW50c1tpbmRleF0udW5pcXVlQ29kZTtcblx0XHRcdHRoaXMucmVzdWx0REJFbnRyaWVzLnB1c2goZGF0KTtcblxuXHRcdFx0LyogSWYgREIgVUlEIChlbWFpbCkgPT0gcGxheWVyLCBjaGVjayBzY29yZSAqL1xuXHRcdFx0aWYgKHJlc3AuZWxlbWVudHNbaW5kZXhdLmZpZWxkVmFsdWVzWzBdLnZhbHVlID09PSB0aGlzLnBsYXllckVtYWlsKSB7XG5cdFx0XHRcdG5ld1VzZXIgPSBmYWxzZTtcblx0XHRcdFx0aWYgKGRhdC5zY29yZSA+IHRoaXMuc2NvcmUpIHtcblx0XHRcdFx0XHRpbXByb3ZlZFNjb3JlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qIElmIGN1cnJlbnQgc2NvcmUgaXMgYmV0dGVyIChzbWFsbGVyKSwgc3VibWl0IGl0XG5cdFx0XHRvdGhlcndpc2Ugd3JpdGUgYW5kIGxvYWQgbGVhZGVyYm9hcmQgKi9cblx0XHRpZiAoaW1wcm92ZWRTY29yZSB8fCBuZXdVc2VyKSB7XG5cdFx0XHQvKiBTZW5kIHNjb3JlIHRvIERCLlxuXHRcdFx0XHRUaGlzIHdpbGwgYWxzbyB0cmlnZ2VyIHJlLWxvYWQgb2Ygc2NvcmVzLlxuXHRcdFx0XHRDb3VsZCBlYXNpbHkgYmUgaW1wcm92ZWQuIEp1c3QgcnVuIGNvbXBhcmlzb24gb24gdmFsdWVzIHRvIHdyaXRlIHRvIGxlYWRlcmJvYXJkLFxuXHRcdFx0XHRhbmQgaW5zZXJ0IHRoaXMgdXNlciBpZiByZXF1aXJlZCwgYW5kIG9ubHkgc2VuZCBzY29yZSBpZiB0aGVyZSBpcyBpbXByb3ZlbWVudCwgd2l0aG91dCByZS1wYXJzaW5nLlxuXHRcdFx0XHRCdXQgbmVlZGVkIHN1cGVyIGZhc3QgZml4LlxuXHRcdFx0XHRJIGFtIHNvIHNvcnJ5LiAqL1xuXHRcdFx0LyogTmljayBzaG91bGQgbmV2ZXIgYmUgc29ycnkuIEhlIGlzIHdvbmRlcmZ1bCAqL1xuXHRcdFx0dGhpcy5zZW5kUmVzdWx0KHRoaXMuc3VibWl0Q2FjaGUpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIEVuc3VyZSByZXN1bHRzIGFyZSBzb3J0ZWQgbnVtZXJpY2FsbHlcblx0XHRcdHRoaXMuc29ydEJ5S2V5KHRoaXMucmVzdWx0REJFbnRyaWVzLCAnc2NvcmUnKTtcblxuXHRcdFx0Ly8gV3JpdGUgcmVzdWx0cyB0byBsZWFkZXJib2FyZFxuXHRcdFx0dGhpcy53cml0ZVJlc3VsdHMoKTtcblxuXHRcdFx0Ly8gQnJvYWRjYXN0IGxlYWRlcmJvYXJkIHJlYWR5IGV2ZW50XG5cdFx0XHRldmVudE1hbmFnZXIuZGlzcGF0Y2goRXZlbnRNYW5hZ2VyLkNIQU5HRV9TVEFURSwgeydkYXRhJzogU3RhdGVNYW5hZ2VyLkxFQURFUkJPQVJEfSk7XG5cdFx0fVxuXG5cblx0fVxuXG5cdHNlbmRSZXN1bHQoZXZ0KSB7XG5cdFx0Ly8gc2VuZCByZXN1bHQgdG8gREIgLSBldnQuc3VibWl0RGF0YTtcblx0XHQvL2NvbnNvbGUubG9nKCdkYXRhIHNlbnQgdmlhIGFwaSAtICcsIGV2dC5zdWJtaXREYXRhKTtcblx0XHRsZXQgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHJlcXVlc3Qub3BlbignUE9TVCcsICdodHRwczovL3MxOTExNjAyMzA3LnQuZWxvcXVhLmNvbS9lL2YyJyk7XG5cdFx0cmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04Jyk7XG5cdFx0cmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCAoKSA9PiB7dGhpcy5sb2FkU2NvcmVUYWJsZSgpO30sIDUwMCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocmVxdWVzdC5zdGF0dXMgIT09IDIwMCkge1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmVxdWVzdC5zZW5kKGV2dC5zdWJtaXREYXRhKTtcblx0fVxuXG5cdC8qIExvYWQgaW4gcmVzdWx0cyAqL1xuXHRsb2FkU2NvcmVUYWJsZSgpIHtcblx0XHQvLyBncmFiIHJlc3VsdHMgZnJvbSBEQlxuXHRcdGxldCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCB0aGlzLnJlc3VsdHNVUkwpO1xuXHRcdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuXHRcdHJlcXVlc3Qub25sb2FkID0gKGV2dCkgPT4ge1xuXHRcdFx0aWYgKGV2dC5zcmNFbGVtZW50LnN0YXR1cyA+PSAyMDAgJiYgZXZ0LnNyY0VsZW1lbnQuc3RhdHVzIDwgNDAwKSB7XG5cdFx0XHRcdC8vIG9uIHN1Y2Nlc3MuLi5cblx0XHRcdFx0dGhpcy5wYXJzZURhdGEoZXZ0LnNyY0VsZW1lbnQucmVzcG9uc2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gV2UgcmVhY2hlZCBvdXIgdGFyZ2V0IHNlcnZlciwgYnV0IGl0IHJldHVybmVkIGFuIGVycm9yXG5cdFx0XHRcdHRoaXMuaGFuZGxlREJFcnJvcihldnQuc3JjRWxlbWVudC5yZXNwb25zZSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XG5cdFx0XHQvLyBUaGVyZSB3YXMgYSBjb25uZWN0aW9uIGVycm9yIG9mIHNvbWUgc29ydFxuXHRcdFx0dGhpcy5oYW5kbGVEQkVycm9yKCk7XG5cdFx0fTtcblx0XHRyZXF1ZXN0LnNlbmQoJ3Njb3JlPScgKyB0aGlzLnNjb3JlKTtcblx0fVxuXG5cdGhhbmRsZURCRXJyb3IoZXJyID0gJycpIHtcblx0XHQvLyBEbyBzb21ldGhpbmcgaW50ZXJmYWN5IHRvIHNob3cgdGhlIGVycm9yXG5cdFx0Y29uc29sZS5sb2coJ0Vycm9yLi4uJywgZXJyKTtcblx0fVxuXG5cdHBhcnNlRGF0YShyZXNwKSB7XG5cdFx0Ly8gcGFyc2Ugc2NvcmUgZGF0YVxuXHRcdHRoaXMucmVzdWx0REJFbnRyaWVzLmxlbmd0aCA9IDA7XG5cdFx0aWYgKHR5cGVvZiByZXNwID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmVzcCA9IEpTT04ucGFyc2UocmVzcCk7XG5cdFx0fVxuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCByZXNwLmVsZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuXHRcdFx0bGV0IGRhdCA9IHt9O1xuXHRcdFx0ZGF0Lm5hbWUgPSByZXNwLmVsZW1lbnRzW2luZGV4XS5maWVsZFZhbHVlc1s0XS52YWx1ZTtcblx0XHRcdGRhdC5zY29yZSA9IE51bWJlcihyZXNwLmVsZW1lbnRzW2luZGV4XS5maWVsZFZhbHVlc1szXS52YWx1ZSk7XG5cdFx0XHRkYXQudWlkID0gcmVzcC5lbGVtZW50c1tpbmRleF0udW5pcXVlQ29kZTtcblx0XHRcdHRoaXMucmVzdWx0REJFbnRyaWVzLnB1c2goZGF0KTtcblx0XHR9XG5cdFx0Ly8gRW5zdXJlIHJlc3VsdHMgYXJlIHNvcnRlZCBudW1lcmljYWxseVxuXHRcdHRoaXMuc29ydEJ5S2V5KHRoaXMucmVzdWx0REJFbnRyaWVzLCAnc2NvcmUnKTtcblxuXHRcdC8vIFdyaXRlIHJlc3VsdHMgdG8gbGVhZGVyYm9hcmRcblx0XHR0aGlzLndyaXRlUmVzdWx0cygpO1xuXG5cdFx0Ly8gQnJvYWRjYXN0IGxlYWRlcmJvYXJkIHJlYWR5IGV2ZW50XG5cdFx0ZXZlbnRNYW5hZ2VyLmRpc3BhdGNoKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIHsnZGF0YSc6IFN0YXRlTWFuYWdlci5MRUFERVJCT0FSRH0pO1xuXHR9XG5cblx0c29ydEJ5S2V5KGFycmF5LCBrZXkpIHtcblx0XHRyZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRsZXQgeCA9IGFba2V5XTtcblx0XHRcdGxldCB5ID0gYltrZXldO1xuXHRcdFx0cmV0dXJuICgoeCA8IHkpID8gLTEgOiAoKHggPiB5KSA/IDEgOiAwKSk7XG5cdFx0fSk7XG5cdH1cblxuXHR3cml0ZVJlc3VsdHMoKSB7XG5cdFx0bGV0IGxvb3AgPSAodGhpcy5yZXN1bHREQkVudHJpZXMubGVuZ3RoID49IDEwKSA/IDEwIDogdGhpcy5yZXN1bHREQkVudHJpZXMubGVuZ3RoO1xuXHRcdGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsb29wOyBpbmRleCsrKSB7XG5cdFx0XHRjb25zdCBsZWFkZXIgPSB0aGlzLnJlc3VsdERCRW50cmllc1tpbmRleF07XG5cdFx0XHR0aGlzLnJlc3VsdEZpZWxkc1tpbmRleF0ucXVlcnlTZWxlY3RvcignLnBsYXllci1uYW1lIHAnKS5pbm5lckhUTUwgPSBsZWFkZXIubmFtZS5zdWJzdHJpbmcoMCwyMCk7IC8vIGxlYWRlci5maXJzdE5hbWUgKyAnICcgKyBsZWFkZXIubGFzdE5hbWU7XG5cdFx0XHR0aGlzLnJlc3VsdEZpZWxkc1tpbmRleF0ucXVlcnlTZWxlY3RvcignLnBsYXllci1zY29yZSBwJykuaW5uZXJIVE1MID0gZ2FtZVRpbWVyVXRpbHMucmVwb3J0TU1TU1RIKGxlYWRlci5zY29yZSk7XG5cdFx0fVxuXG5cdFx0Ly8gTm93IHBvcHVsYXRlIHBsYXllciBzY29yZSBpbiB1bmlxdWUgZmllbGRcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcueW91ci1zY29yZSAucGxheWVyLW5hbWUgcCcpLmlubmVySFRNTCA9IHRoaXMucGxheWVyTmFtZS5zdWJzdHJpbmcoMCwyMCk7XG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnlvdXItc2NvcmUgLnBsYXllci1zY29yZSBwJykuaW5uZXJIVE1MID0gZ2FtZVRpbWVyVXRpbHMucmVwb3J0TU1TU1RIKHRoaXMuc2NvcmUpO1xuXHR9XG59XG5leHBvcnQgbGV0IHJlc3VsdHNNYW5hZ2VyID0gbmV3IFJlc3VsdHNNYW5hZ2VyKCk7XG4iLCJpbXBvcnQgQXVkaW9TcHJpdGUgZnJvbSAnLi9hdWRpb1Nwcml0ZSc7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIsIHtldmVudE1hbmFnZXJ9IGZyb20gJy4vRXZlbnRNYW5hZ2VyLmpzJztcclxuaW1wb3J0IFN0YXRlTWFuYWdlciBmcm9tICcuL3N0YXRlTWFuYWdlcic7XHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKiBDcmVhdGVzIGFuZCBjb250cm9scyB0aGUgcGxheWJhY2sgb2YgYXVkaW8gZnJhZ21lbnRzIChhdWRpb1Nwcml0ZXMpIHdpdGhpbiB0aGUgZ2FtZSAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU0ZYTWFuYWdlciB7XHJcblx0c3RhdGljIGdldCBBVE1PUygpIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxuXHRzdGF0aWMgZ2V0IENMSUNLKCkge1xyXG5cdFx0cmV0dXJuIDE7XHJcblx0fVxyXG5cdHN0YXRpYyBnZXQgQ09VTlRET1dOKCkge1xyXG5cdFx0cmV0dXJuIDI7XHJcblx0fVxyXG5cdHN0YXRpYyBnZXQgVEFBX0RBQSgpIHtcclxuXHRcdHJldHVybiAzO1xyXG5cdH1cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG5cdFx0bGV0IEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcclxuXHJcblx0XHR0aGlzLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcblx0XHR0aGlzLm11dGVkID0gZmFsc2U7XHJcblx0XHR0aGlzLmNvbnRleHQgPSB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLmF1ZGlvU3ByaXRlcyA9IFtdO1xyXG5cdFx0dGhpcy5qdXN0VG9nZ2xlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5qdXN0VG9nZ2xlZFRpbWVyID0gbnVsbDtcclxuXHRcdHRoaXMuY2hlY2tBdmFpbGFibGUoKTtcclxuXHJcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5CVVRUT05fQ0xJQ0tFRCwgKCkgPT4ge3RoaXMucGxheVNGWChTRlhNYW5hZ2VyLkNMSUNLKTt9KTtcclxuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkNPVU5URE9XTiwgKCkgPT4ge3RoaXMucGxheVNGWChTRlhNYW5hZ2VyLkNPVU5URE9XTik7fSk7XHJcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIChldnQpID0+IHtcclxuXHRcdFx0c3dpdGNoIChldnQuZGF0YSkge1xyXG5cdFx0XHRcdGNhc2UgU3RhdGVNYW5hZ2VyLlZJREVPOlxyXG5cdFx0XHRcdGNhc2UgU3RhdGVNYW5hZ2VyLlBMQVlfQUdBSU46XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlTRlgoU0ZYTWFuYWdlci5BVE1PUyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuQ09VTlRET1dOOlxyXG5cdFx0XHRcdFx0dGhpcy5wbGF5U0ZYKFNGWE1hbmFnZXIuQ09VTlRET1dOKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5XSU5ORVI6XHJcblx0XHRcdFx0XHR0aGlzLmtpbGxBbGwoKTtcclxuXHRcdFx0XHRcdHRoaXMucGxheVNGWChTRlhNYW5hZ2VyLlRBQV9EQUEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgRXZlbnRNYW5hZ2VyLk1VVEVfVE9HR0xFOlxyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVPbk9mZigpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkVWRU5UX05BTUUsIChldnQpID0+IHtcclxuXHRcdFx0aWYgKGV2dCA9PT0gU3RhdGVNYW5hZ2VyLkVYVEVSTkFMKSB7XHJcblx0XHRcdFx0dGhpcy5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMua2lsbEFsbCgpO1xyXG5cdFx0XHRcdHRoaXMuaGlkZUF1ZGlvVUkoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjaGVja0F2YWlsYWJsZSgpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHdpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XHJcblx0XHRcdHRoaXMuY29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XHJcblx0XHRcdHRoaXMuaXNBdmFpbGFibGUgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmdlbmVyYXRlKCk7XHJcblx0XHR9IGNhdGNoIChldnQpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1dlYiBBdWRpbyBBUEkgZXJyb3I6JywgZXZ0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNBdmFpbGFibGUpIHtcclxuXHRcdFx0dGhpcy5oaWRlQXVkaW9VSSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGlkZUF1ZGlvVUkoKSB7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vcHRpb24tYnV0dG9ucyAubXV0ZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0fVxyXG5cclxuXHQvKiBDcmVhdGUgQXVkaW9TcHJpdGVzLCByZWFkeSBmb3IgdXNlLiAqL1xyXG5cdGdlbmVyYXRlKCkge1xyXG5cdFx0Ly9cdFx0XHRcdFx0XHRcdFx0XHRcdGlkLCBcdFx0XHRcdFx0c3JjLCBcdFx0XHRcdFx0c3ByaXRlTGVuZ3RoLFx0c3RhcnRQb2ludCwgXHRsb29wLCBcdGF1ZGlvTGVhZCxcdHZvbHVtZSwgbXV0ZWRcclxuXHRcdHRoaXMuYXVkaW9TcHJpdGVzLnB1c2gobmV3IEF1ZGlvU3ByaXRlKFNGWE1hbmFnZXIuQVRNT1MsXHRcdCdodHRwczovL2NhbXBhaWducy5hYmVyZGVlbnN0YW5kYXJkLmNvbS9BU0ktY2FwYWJpbGl0aWVzL2dhbWVmYWNlL2F1ZGlvL2F1ZGlvU3ByaXRlJyxcdDIxLjcsXHRcdFx0MCxcdFx0XHRcdHRydWUsXHRcdDAsXHRcdC4xLFx0XHR0aGlzLm11dGVkICkpO1xyXG5cdFx0dGhpcy5hdWRpb1Nwcml0ZXMucHVzaChuZXcgQXVkaW9TcHJpdGUoU0ZYTWFuYWdlci5DTElDSyxcdFx0J2h0dHBzOi8vY2FtcGFpZ25zLmFiZXJkZWVuc3RhbmRhcmQuY29tL0FTSS1jYXBhYmlsaXRpZXMvZ2FtZWZhY2UvYXVkaW8vYXVkaW9TcHJpdGUnLFx0MC4xLFx0XHRcdDIxLjgsXHRcdFx0ZmFsc2UsXHRcdDAsXHRcdC4yLFx0XHR0aGlzLm11dGVkICkpO1xyXG5cdFx0dGhpcy5hdWRpb1Nwcml0ZXMucHVzaChuZXcgQXVkaW9TcHJpdGUoU0ZYTWFuYWdlci5DT1VOVERPV04sXHQnaHR0cHM6Ly9jYW1wYWlnbnMuYWJlcmRlZW5zdGFuZGFyZC5jb20vQVNJLWNhcGFiaWxpdGllcy9nYW1lZmFjZS9hdWRpby9hdWRpb1Nwcml0ZScsXHQzLjUsXHRcdFx0MjMuMSxcdFx0XHRmYWxzZSxcdFx0MCxcdFx0LjUsXHRcdHRoaXMubXV0ZWQgKSk7XHJcblx0XHR0aGlzLmF1ZGlvU3ByaXRlcy5wdXNoKG5ldyBBdWRpb1Nwcml0ZShTRlhNYW5hZ2VyLlRBQV9EQUEsXHRcdCdodHRwczovL2NhbXBhaWducy5hYmVyZGVlbnN0YW5kYXJkLmNvbS9BU0ktY2FwYWJpbGl0aWVzL2dhbWVmYWNlL2F1ZGlvL2F1ZGlvU3ByaXRlJyxcdDIuNSwgXHRcdFx0MjYuNSxcdFx0XHRmYWxzZSxcdFx0MCxcdFx0MSxcdFx0dGhpcy5tdXRlZCApKTtcclxuXHR9XHJcblxyXG5cdC8qIENhbGwgYXVkaW9zcHJpdGUgdG8gcGxheSAqL1xyXG5cdHBsYXlTRlgoaWQpIHtcclxuXHRcdGlmICghdGhpcy5pc0F2YWlsYWJsZSkgeyByZXR1cm47IH1cclxuXHRcdHRoaXMuYXVkaW9TcHJpdGVzW2lkXS5wbGF5KCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVPbk9mZigpIHtcclxuXHRcdGlmICh0aGlzLmp1c3RUb2dnbGVkKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm11dGVkID0gIXRoaXMubXV0ZWQ7XHJcblx0XHRmb3IgKGxldCBsb29wID0gdGhpcy5hdWRpb1Nwcml0ZXMubGVuZ3RoLCBpdGVyYXRvciA9IDA7IGl0ZXJhdG9yIDwgbG9vcDsgaXRlcmF0b3IrKykge1xyXG5cdFx0XHR0aGlzLmF1ZGlvU3ByaXRlc1tpdGVyYXRvcl0ubXV0ZSh0aGlzLm11dGVkKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmp1c3RUb2dnbGVkID0gdHJ1ZTtcclxuXHRcdHNldFRpbWVvdXQoICgpID0+IHRoaXMuanVzdFRvZ2dsZWQgPSBmYWxzZSwgNTAwKTtcclxuXHR9XHJcblxyXG5cdGNoYW5nZVZvbHVtZShpZCwgdmFsdWUpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRoaXMuYXVkaW9TcHJpdGVzW2lkXS5jaGFuZ2VWb2x1bWUodGhpcy5hdWRpb1Nwcml0ZXNbaWRdLnZvbHVtZSArPSB2YWx1ZSk7XHJcblx0XHR9IGNhdGNoIChldnQpIHtcclxuXHRcdFx0Ly8gdGhyb3cgbmV3IEVycm9yKCdTRlhNYW5hZ2VyLmNoYW5nZVZvbHVtZSgpJywgZXZ0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGtpbGxBbGwoKSB7XHJcblx0XHRmb3IgKGxldCBsb29wID0gdGhpcy5hdWRpb1Nwcml0ZXMubGVuZ3RoLCBpdGVyYXRvciA9IDA7IGl0ZXJhdG9yIDwgbG9vcDsgaXRlcmF0b3IrKykge1xyXG5cdFx0XHR0aGlzLmF1ZGlvU3ByaXRlc1tpdGVyYXRvcl0uc3RvcCgpO1xyXG5cdFx0XHR0aGlzLmF1ZGlvU3ByaXRlc1tpdGVyYXRvcl0udm9sdW1lID0gdGhpcy5hdWRpb1Nwcml0ZXNbaXRlcmF0b3JdLnJlc2V0Vm9sdW1lO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZW5kR2FtZSgpIHtcclxuXHRcdHRoaXMua2lsbEFsbCgpO1xyXG5cdFx0dGhpcy5wbGF5U0ZYKHRoaXMuQk9JTkcpO1xyXG5cdH1cclxufVxyXG5leHBvcnQgbGV0IHNmeE1hbmFnZXIgPSBuZXcgU0ZYTWFuYWdlcigpO1xyXG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyLCB7ZXZlbnRNYW5hZ2VyfSBmcm9tICcuL0V2ZW50TWFuYWdlci5qcyc7XG5cbi8qIEhvbGRzIHN0YXRlIG9mIGdhbWUuXG5cdENvbnRyb2xzIERPTSBlbGVtZW50cyBhY2NvcmRpbmdseSAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdGVNYW5hZ2VyIHtcblx0c3RhdGljIGdldCBXRUxDT01FKCkge1xuXHRcdHJldHVybiAnd2VsY29tZSc7XG5cdH1cblx0c3RhdGljIGdldCBIT1dfVE8oKSB7XG5cdFx0cmV0dXJuICdob3cgdG8gcGxheSc7XG5cdH1cblx0c3RhdGljIGdldCBWSURFTygpIHtcblx0XHRyZXR1cm4gJ3ZpZGVvJztcblx0fVxuXHRzdGF0aWMgZ2V0IENPVU5URE9XTigpIHtcblx0XHRyZXR1cm4gJ2NvdW50ZG93bic7XG5cdH1cblx0c3RhdGljIGdldCBQTEFZSU5HKCkge1xuXHRcdHJldHVybiAncGxheWluZyc7XG5cdH1cblx0c3RhdGljIGdldCBSSUdIVF9CVVRfV1JPTkcoKSB7XG5cdFx0cmV0dXJuICd3cm9uZyBvcmRlcic7XG5cdH1cblx0c3RhdGljIGdldCBQTEFZX0FHQUlOKCkge1xuXHRcdHJldHVybiAncmVzZXQgYW5kIHBsYXknO1xuXHR9XG5cdHN0YXRpYyBnZXQgV0lOTkVSKCkge1xuXHRcdHJldHVybiAnd2lubmVyJztcblx0fVxuXHRzdGF0aWMgZ2V0IFNDT1JFKCkge1xuXHRcdHJldHVybiAnc2NvcmUnO1xuXHR9XG5cdHN0YXRpYyBnZXQgTEVBREVSQk9BUkQoKSB7XG5cdFx0cmV0dXJuICdsZWFkZXJib2FyZCc7XG5cdH1cblx0c3RhdGljIGdldCBUTkMoKSB7XG5cdFx0cmV0dXJuICdUbkNzJztcblx0fVxuXHRzdGF0aWMgZ2V0IEJBQ0soKSB7XG5cdFx0cmV0dXJuICdyZXR1cm4gZnJvbSBUbkNzJztcblx0fVxuXHRzdGF0aWMgZ2V0IE9SSUVOVEFUSU9OX1dBUk5JTkcoKSB7XG5cdFx0cmV0dXJuICdvcmllbnRhdGlvbiB3YXJuaW5nJztcblx0fVxuXHRzdGF0aWMgZ2V0IEVYVEVSTkFMKCkge1xuXHRcdHJldHVybiAnZXh0ZXJuYWwgZ2FtZSc7XG5cdH1cblx0c3RhdGljIGdldCBJTlRFUk5BTCgpIHtcblx0XHRyZXR1cm4gJ2ludGVybmFsIGdhbWUnO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5zdGF0ZSA9IFN0YXRlTWFuYWdlci5XRUxDT01FO1xuXHRcdHRoaXMuY2FjaGVkU3RhdGU7XG5cblx0XHR0aGlzLnVpUGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVpLXBhbmVscycpO1xuXHRcdHRoaXMud2VsY29tZVBhbmVsO1xuXHRcdHRoaXMuaG93VG9QYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51aS1wYW5lbC5ob3ctdG8nKTtcblx0XHR0aGlzLnZpZGVvUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudWktcGFuZWwudmlkZW8nKTtcblx0XHR0aGlzLndpbm5lclBhbmVsO1xuXHRcdHRoaXMucGxheWVyU2NvcmU7XG5cdFx0dGhpcy5sZWFkZXJQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51aS1wYW5lbC5sZWFkZXItYm9hcmQnKTtcblx0XHR0aGlzLmNvdW50RG93blBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVpLXBhbmVsLmNvdW50LWRvd24nKTtcblx0XHR0aGlzLnRuY1BhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRuYycpO1xuXHRcdHRoaXMucmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1vcHRpb24tYnV0dG9ucyAucmVzZXQnKTtcblxuXHRcdHRoaXMucmlnaHRXcm9uZ01lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS1wYW5lbHMnKTtcblxuXHRcdHRoaXMud2lubmVyRGVsYXk7XG5cblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5DSEFOR0VfU1RBVEUsIChldnQpID0+IHsgdGhpcy5jaGFuZ2VTdGF0ZShldnQuZGF0YSk7IH0pO1xuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoU3RhdGVNYW5hZ2VyLlNDT1JFLCAoZXZ0KSA9PiB7IHRoaXMucGxheWVyU2NvcmUuaW5uZXJIVE1MID0gZXZ0LmRhdGE7IH0pO1xuXHRcdGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoRXZlbnRNYW5hZ2VyLkVWRU5UX05BTUUsIChldnQpID0+IHRoaXMuc2V0R2FtZVR5cGUoZXZ0LmRhdGEpKTtcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKEV2ZW50TWFuYWdlci5QSU5fVVBEQVRFLCAoKSA9PiB0aGlzLmNsZWFyUmlnaHRCdXRXcm9uZygpKTtcblx0XHRldmVudE1hbmFnZXIuc3Vic2NyaWJlKFN0YXRlTWFuYWdlci5SSUdIVF9CVVRfV1JPTkcsIChldnQpID0+IHRoaXMuc2hvd1JpZ2h0QnV0V3JvbmcoZXZ0LmRhdGEpKTtcblx0fVxuXG5cdC8qIFNldHMgdmFyaWFibGUgZG9tIGVsZW1lbnRzIGZvciB1c2UsIGJhc2VkIG9uIElOVEVSTkFMIC8gRVhURVJOQUwgZ2FtZVxuXHRcdFRoaXMgcmVtb3ZlcyBuZWVkIGZvciBsb2dpYyBvbiBwYWdlL3N0YXRlIHN3YXAgKi9cblx0c2V0R2FtZVR5cGUoZ2FtZVR5cGUpIHtcblx0XHRpZiAoZ2FtZVR5cGUgPT09IFN0YXRlTWFuYWdlci5FWFRFUk5BTCkge1xuXHRcdFx0dGhpcy5wbGF5ZXJTY29yZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy55b3VyLXNjb3JlLWV4dGVybmFsJyk7XG5cdFx0XHR0aGlzLnRuY1BhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRuYy1leHRlcm5hbCcpO1xuXHRcdFx0dGhpcy53ZWxjb21lUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudWktcGFuZWwud2VsY29tZS1leHRlcm5hbCcpO1xuXHRcdFx0dGhpcy53aW5uZXJQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51aS1wYW5lbC53aW5uZXItZXh0ZXJuYWwnKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLnBsYXllclNjb3JlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnlvdXItc2NvcmUnKTtcblx0XHRcdHRoaXMudG5jUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG5jJyk7XG5cdFx0XHR0aGlzLndlbGNvbWVQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51aS1wYW5lbC53ZWxjb21lJyk7XG5cdFx0XHR0aGlzLndpbm5lclBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVpLXBhbmVsLndpbm5lcicpO1xuXHRcdH1cblxuXHRcdHRoaXMuYWxsVGhlUGFuZWxzID0gW1xuXHRcdFx0dGhpcy53ZWxjb21lUGFuZWwsXG5cdFx0XHR0aGlzLmhvd1RvUGFuZWwsXG5cdFx0XHR0aGlzLnZpZGVvUGFuZWwsXG5cdFx0XHR0aGlzLndpbm5lclBhbmVsLFxuXHRcdFx0dGhpcy5sZWFkZXJQYW5lbCxcblx0XHRcdHRoaXMuY291bnREb3duUGFuZWwsXG5cdFx0XHR0aGlzLnRuY1BhbmVsXG5cdFx0XTtcblx0fVxuXG5cdGNoYW5nZVN0YXRlKHN0YXRlKSB7XG5cdFx0aWYgKHN0YXRlID09PSBTdGF0ZU1hbmFnZXIuVE5DKSB7XG5cdFx0XHR0aGlzLmNhY2hlZFN0YXRlID0gdGhpcy5zdGF0ZTtcblx0XHR9XG5cdFx0dGhpcy5zdGF0ZSA9IHN0YXRlO1xuXHRcdHRoaXMudXBkYXRlRE9NKHN0YXRlKTtcblx0fVxuXG5cdGNsb3NlQWxsUGFuZWxzKCkge1xuXHRcdGZvciAobGV0IGxvb3AgPSB0aGlzLmFsbFRoZVBhbmVscy5sZW5ndGgsIGluZGV4ID0gMDsgaW5kZXggPCBsb29wOyBpbmRleCsrKSB7XG5cdFx0XHR0aGlzLmFsbFRoZVBhbmVsc1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdH1cblx0XHR0aGlzLnVpUGFuZWxzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpLXRvcCcpO1xuXHRcdHRoaXMuY2xlYXJSaWdodEJ1dFdyb25nKCk7XG5cdH1cblxuXHRzaG93UmlnaHRCdXRXcm9uZyhudW1zKSB7XG5cdFx0dGhpcy5yaWdodFdyb25nTWVzc2FnZS5xdWVyeVNlbGVjdG9yKCcua2V5LXN0YWNrJykuaW5uZXJIVE1MID0gJyA8YnI+KCcgKyBudW1zICsgJyknO1xuXHRcdHRoaXMucmlnaHRXcm9uZ01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuXHR9XG5cdGNsZWFyUmlnaHRCdXRXcm9uZygpIHtcblx0XHR0aGlzLnJpZ2h0V3JvbmdNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcblx0fVxuXG5cdC8vIENyZWF0ZSByYW5kb20gcGxhY2VtZW50IGFuZCBvcmRlciBmb3Igc3VidHJhY3RpdmUgZmlsdGVyc1xuXHR1cGRhdGVET00oKSB7XG5cdFx0c3dpdGNoICh0aGlzLnN0YXRlKSB7XG5cdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5XRUxDT01FOlxuXHRcdFx0XHR0aGlzLnVpUGFuZWxzLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcblx0XHRcdFx0dGhpcy53ZWxjb21lUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuSE9XX1RPOlxuXHRcdFx0XHR0aGlzLmNsb3NlQWxsUGFuZWxzKCk7XG5cdFx0XHRcdHRoaXMuaG93VG9QYW5lbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5WSURFTzpcblx0XHRcdFx0dGhpcy5jbG9zZUFsbFBhbmVscygpO1xuXHRcdFx0XHR0aGlzLnZpZGVvUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuUExBWUlORzpcblx0XHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1ncmlkJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9jay13cmFwcGVyJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdHRoaXMucmVzZXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cdFx0XHRcdHRoaXMudWlQYW5lbHMuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdFx0XHR0aGlzLmNsb3NlQWxsUGFuZWxzKCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5QTEFZX0FHQUlOOlxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy53aW5uZXJEZWxheSk7XG5cdFx0XHRcdHRoaXMuY2xvc2VBbGxQYW5lbHMoKTtcblx0XHRcdFx0dGhpcy5yZXNldEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcblx0XHRcdFx0dGhpcy51aVBhbmVscy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG5cdFx0XHRcdHRoaXMuY291bnREb3duUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuXHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudWktcGFuZWwubGVhZGVyLWJvYXJkJykuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuV0lOTkVSOlxuXHRcdFx0XHR0aGlzLnNldFdpbm5lcigpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuTEVBREVSQk9BUkQ6XG5cdFx0XHRcdHRoaXMuY2xvc2VBbGxQYW5lbHMoKTtcblx0XHRcdFx0dGhpcy5sZWFkZXJQYW5lbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG5cdFx0XHRcdC8vIGNhbGwgREIgZXRjXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5UTkM6XG5cdFx0XHRcdHRoaXMudG5jUGFuZWwuY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBTdGF0ZU1hbmFnZXIuQkFDSzpcblx0XHRcdFx0dGhpcy50bmNQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG5cdFx0XHRcdHRoaXMuY2hhbmdlU3RhdGUodGhpcy5jYWNoZWRTdGF0ZSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFN0YXRlTWFuYWdlci5PUklFTlRBVElPTl9XQVJOSU5HOlxuXHRcdFx0XHQvLyBwYXVzZSBnYW1lIGlmIHN0YXRlID09IHBsYXlpbmdcblx0XHRcdFx0Ly8gc2hvdyBvcmllbnRhdGlvbiBvdmVybGF5XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8qIFNlcGFyYXRlIG1ldGhvZCB0byBtYWtlIHRpbWVvdXQgZGVsYXkgc2ltcGxlciBhbmQgbW9yZSB0cmFuc3BhcmVudCAqL1xuXHRzZXRXaW5uZXIoKSB7XG5cdFx0dGhpcy5jbGVhclJpZ2h0QnV0V3JvbmcoKTtcblx0XHR0aGlzLndpbm5lckRlbGF5ID0gc2V0VGltZW91dCggKCkgPT4ge1xuXHRcdFx0dGhpcy51aVBhbmVscy5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG5cdFx0XHR0aGlzLnVpUGFuZWxzLmNsYXNzTGlzdC5hZGQoJ2hpLXRvcCcpO1xuXHRcdFx0dGhpcy53aW5uZXJQYW5lbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG5cdFx0fSwgMTIwMCk7XG5cdH1cbn1cbmV4cG9ydCBsZXQgc3RhdGVNYW5hZ2VyID0gbmV3IFN0YXRlTWFuYWdlcigpO1xuIl19
