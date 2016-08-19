
(function () {
	'use strict';

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, element) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	/* DoubleClick dynamic data */
	var enablerInitHandler = function () {


		function disclaimerClick() {
			if (disclaimerOpen) {
				disclaimerOpen = false;
				TweenLite.to(get("infoClick"), 0, { x: 0, y: 0 });
				hideFullDisclaimer();
			}
			else {
				disclaimerOpen = true;
				TweenLite.to(get("infoClick"), 0, { x: 230, y: -222 });
				showFullDisclaimer()
			}
		}

		function showFullDisclaimer(event) {
			var elem = get("disclaimer");
			elem.style.display = "block";
		}
		function hideFullDisclaimer() {
			var elem = get("disclaimer");
			elem.style.display = "none";
		}

		var disclaimerOpen = false;

		var infoClick = get('infoClick');
		if (infoClick.addEventListener) {
			infoClick.addEventListener("click", disclaimerClick, false);
		}
		else {
			infoClick.attachEvent("onclick", disclaimerClick);
		}

		/* Data ready. Play banner */
		runSequencer();
	}

	/* Animation sequencer outwith the spritesheet */
	function runSequencer() {
		var ticks = 0,
		running = false,
		seqCnt = 0,
		tA = get("textContent"),
		t1 = get("c1"),
		t2 = get("c2"),
		t3 = get("c3"),
		t4 = get("c4"),
		objs = [get("compass"),		// 0
				get("ipad"),		// 1
				get("teaCup"),		// 2
				get("football"),	// 3
				get("glasses"),		// 4
				get("journal"),		// 5
				get("phone"),      // 6
				get("sim"),		// 7
				get("plate"),		// 8
				get("cookie"),		// 9
				get("businesscards"),		// 10
				get("photos"),   // 11
				get("chopstick1"),        // 13
				get("chopstick2")],      // 14

		/** Fast plays through then stops animation on a particular view to help styling.
			testState - case at which to stop.
			NB - delayed tweens prior to the desired view may not fire
		**/
		layoutTesting = false,
		testState = 5,

		showElement = function (el) { el.style.display = "block"; },
		hideElement = function (el) { el.style.display = "none"; },
		readyToRun = function (t) { return layoutTesting || (ticks > t) ? true : false; },
		incrementSequence = function () { layoutTesting && seqCnt === testState ? clearInterval(sequencer) : seqCnt++; },

		sequencer = function () {
			switch (seqCnt) {
				/**	Each case is a scene change
					This can be a build, a clear, or both.
					The number in the if statement is time seconds.
						This is intended to give a readable view of the animation as a whole.
						ie - case 2 might be (4) which is 4 seconds into the animation >> these events should happen
					Each case should include the incrementSequence(); call
				**/
				case 0:
					if (readyToRun(0.3)) {

						//compass
						showElement(objs[0]);
						TweenLite.from(objs[0], .9, { scaleX: 2.5, scaleY: 2.5, y: -320, rotation: 30, delay: .1, ease: Power1.easeIn });	// DROPS
						TweenLite.from(objs[0], .1, { alpha: 0 });

						// ipad
						showElement(objs[1]);
						TweenLite.from(objs[1], .5, { x: -100, delay: .7, });
						TweenLite.from(objs[1], .1, { alpha: 0 });

						// teacup
						showElement(objs[2]);
						TweenLite.from(objs[2], .9, { x: 100, delay: 1.3, });
						TweenLite.from(objs[2], .1, { alpha: 0 });

					   // football
						showElement(objs[3]);
						TweenLite.from(objs[3], .5, { x: -150, delay: 1, });
						TweenLite.from(objs[3], .1, { alpha: 0 });

						//glasses
						showElement(objs[4]);
						TweenLite.from(objs[4], .9, { scaleX: 2.5, scaleY: 2.5, y: -240, rotation: 30, delay: 1, ease: Power1.easeIn });	// DROPS
						TweenLite.from(objs[4], .1, { alpha: 0 });

						// journal
						showElement(objs[5]);
						TweenLite.from(objs[5], .9, { y: 150, delay: 1, });
						TweenLite.from(objs[5], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 1:
					if (readyToRun(2.2)) {

						// phone
						showElement(objs[6]);
						TweenLite.from(objs[6], .6, { scaleX: 1.5, scaleY: 1.5, y: -280, ease: Power1.easeIn });	// DROPS
						TweenLite.from(objs[6], .1, { alpha: 0 });

						 // sim
						showElement(objs[7]);
						TweenLite.from(objs[7], .8, { scaleX: 2.5, scaleY: 2.5, y: -400, rotation: 20, delay: .3, ease: Power1.easeIn });
						TweenLite.from(objs[7], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 2:
					if (readyToRun(2.7)) {

						//plate
						showElement(objs[8]);
						TweenLite.from(objs[8], .5, { y: -150, });
						TweenLite.from(objs[8], .1, { alpha: 0 });

						//cookie
						showElement(objs[9]);
						TweenLite.from(objs[9], .9, { scaleX: 2.5, scaleY: 2.5, y: -320, rotation: 30, delay: .3, ease: Power1.easeIn });	// DROPS
						TweenLite.from(objs[9], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 3:
					if (readyToRun(3)) {

						//buisness cards
						showElement(objs[10]);
						TweenLite.from(objs[10], .6, { y: 200, });
						TweenLite.from(objs[10], .1, { alpha: 0 });


						//photos
						showElement(objs[11]);
						TweenLite.from(objs[11], .5, { y: -150, });
						TweenLite.from(objs[11], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 4:
					if (readyToRun(3.8)) {
						// chopstick 1
		                showElement(objs[12]);
		                TweenLite.from(objs[12], .8, { scaleX: 1.5, scaleY: 1.5, x: 120, y: -205, rotation: -30, });	// DROPS
		                TweenLite.from(objs[12], .1, { alpha: 0 });

		                // chopstick 2
		                showElement(objs[13]);
		                TweenLite.from(objs[13], .8, { scaleX: 1.5, scaleY: 1.5, x: -120, y: -205, rotation: 30, });	// DROPS
		                TweenLite.from(objs[13], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 5:
					if (readyToRun(5.4)) {
						showElement(tA);
						TweenLite.to(tA, 0, { alpha: 1 });
						TweenLite.from(tA, 1, { y: 170 });
						incrementSequence();
					}
					break;
				case 6:
					if (readyToRun(7.1)) {
						showElement(t1);
						TweenLite.to(t1, .75, { alpha: 1 });
						incrementSequence();
					}
					break;
				case 7:
					if (readyToRun(8)) {
						showElement(t2);
						TweenLite.to(t2, .75, { alpha: 1 });
						incrementSequence();
					}
					break;
				case 8: // clear
					if (readyToRun(12)) {
						TweenLite.to(t2, .5, { alpha: 0 });
						incrementSequence();
					}
					break;
				case 9:
					if (readyToRun(12.5)) {
						hideElement(t2);
						showElement(t3);
						showElement(t4);
						TweenLite.to(t3, .75, { alpha: 1 });
						TweenLite.to(t4, .75, { alpha: 1, delay: .5 });
						incrementSequence();
					}
					break;
				case 10:
					running = false;
			}
			ticks += 1 / 60; // Running at 60fps, convert to seconds(-ish)
		}
		function animate() {
			if (running) {
				sequencer();
				requestAnimFrame(animate);
			}
		}
		running = true;
		var delay = setTimeout(animate, 10);
	}

	/* Helper */
	function get(id) {
		return document.getElementById(id);
	}

	/* Kick off when page ready */
	window.onload = function () {
		enablerInitHandler();
	};
}());