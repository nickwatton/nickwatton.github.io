
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
		objs = [get("biro"),		// 0
				get("cards"),		// 1
				get("coin"),		// 2
				get("corkscrew"),	// 3
				get("coffee"),		// 4
				get("keys"),		// 5
				get("mask"),		// 6
				get("paper"),		// 7
				get("phone"),		// 8
				get("photos"),		// 9
				get("tablet"),		// 10
				get("wallet"),		// 11
				get("designpaper"), // 12
                get("piston"),      // 13
                get("cork"),        // 14
                get("bolt1"),       // 15
                get("bolt2"),       // 16
                get("bolt3"),       // 17
                get("tape")],       // 18

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
		            if (readyToRun(0.6)) {
		                // design paper
		                showElement(objs[12]);
		                TweenLite.from(objs[12], .8, { y: 140 });
		                TweenLite.from(objs[12], .1, { alpha: 0 });


		                // mask
		                showElement(objs[6]);
		                TweenLite.from(objs[6], 1, { scaleX: 2.5, scaleY: 2.5, x: 40, y: -285, rotation: 10, ease: Power1.easeIn });	// DROPS
		                TweenLite.from(objs[6], .1, { alpha: 0 });

		                // keys
		                showElement(objs[5]);
		                TweenLite.from(objs[5], .9, { scaleX: 2.5, scaleY: 2.5, x: -20, rotation: 30, y: -210, delay: .5, ease: Power1.easeIn });	// DROPS
		                TweenLite.from(objs[5], .1, { alpha: 0, delay: .1 });

		                incrementSequence();
		            }
		            break;
		        case 1:
		            if (readyToRun(1.7)) {
		                // paper
		                showElement(objs[7]);
		                TweenLite.from(objs[7], .5, { x: -97, y: -138 });
		                TweenLite.from(objs[7], .1, { alpha: 0 });

		                // piston
		                showElement(objs[13]);
		                TweenLite.from(objs[13], .6, { x: 50, y: 0, ease: Power1.easeIn });
		                TweenLite.from(objs[13], .1, { alpha: 0 });

		                // corkscrew
		                showElement(objs[3]);
		                TweenLite.from(objs[3], .6, { scaleX: 2.5, scaleY: 2.5, y: -110, rotation: 30, ease: Power1.easeIn });	// DROPS
		                TweenLite.from(objs[3], .1, { alpha: 0 });

		                // cork
		                showElement(objs[14]);
		                TweenLite.from(objs[14], .6, { scaleX: 2.5, scaleY: 2.5, y: 170, delay: .3, ease: Power1.easeIn });	// DROPS
		                TweenLite.from(objs[14], .1, { alpha: 0 });

		                // bolt1
		                showElement(objs[15]);
		                TweenLite.from(objs[15], .6, { x: 60, delay: .5, ease: Power1.easeIn });
		                TweenLite.from(objs[15], .1, { alpha: 0 });

		                // bolt2
		                showElement(objs[16]);
		                TweenLite.from(objs[16], .6, { x: 60, delay: .8, ease: Power1.easeIn });
		                TweenLite.from(objs[16], .1, { alpha: 0 });

		                // bolt3
		                showElement(objs[17]);
		                TweenLite.from(objs[17], .6, { x: 60, delay: 1.2, ease: Power1.easeIn });
		                TweenLite.from(objs[17], .1, { alpha: 0 });

		                incrementSequence();
		            }
		            break;
		        case 2:
		            if (readyToRun(2.4)) {
		                // tablet
		                showElement(objs[10]);
		                TweenLite.from(objs[10], .8, { scaleX: 2.5, scaleY: 2.5, x: -80, y: 180, rotation: -30, delay: .1 });
		                TweenLite.from(objs[10], .1, { alpha: 0 });

		                // tape
		                showElement(objs[18]);
		                TweenLite.from(objs[18], .5, { x: -50, y: 50, rotation: 10 });
		                TweenLite.from(objs[18], .1, { alpha: 0 });

		                // photos
		                showElement(objs[9]);
		                TweenLite.from(objs[9], 0.5, { x: 30, y: -100, rotation: -20 });
		                TweenLite.from(objs[9], .1, { alpha: 0 });

		                incrementSequence();
		            }
		            break;
		        case 3:
		            if (readyToRun(2.8)) {

		                // wallet
		                showElement(objs[11]);
		                TweenLite.from(objs[11], .5, { y: 61 });
		                TweenLite.from(objs[11], .1, { alpha: 0 });

		                // phone
		                showElement(objs[8]);
		                TweenLite.from(objs[8], .8, { scaleX: 2.5, scaleY: 2.5, x: -20, y: -90, ease: Power1.easeIn });
		                TweenLite.from(objs[8], .1, { alpha: 0, delay: .1 });

		                incrementSequence();
		            }
		            break;
		        case 4:
		            if (readyToRun(3.4)) {
		                // biro
		                showElement(objs[0]);
		                TweenLite.from(objs[0], .5, { x: -118, delay: .3 });
		                TweenLite.from(objs[0], .1, { alpha: 0, delay: .3 });

		                // cards
		                showElement(objs[1]);
		                TweenLite.from(objs[1], .5, { y: 40 });
		                TweenLite.from(objs[1], .1, { alpha: 0 });

		                // coffee
		                showElement(objs[4]);
		                TweenLite.from(objs[4], .5, { scaleX: 2, scaleY: 2, x: -20, y: 76, ease: Power1.easeIn });		// DROPS
		                TweenLite.from(objs[4], .1, { alpha: 0 });

		                // coin
		                showElement(objs[2]);
		                TweenLite.from(objs[2], .5, { scaleX: 3, scaleY: 3, x: 5, y: -60, delay: .1, ease: Power1.easeIn });	// DROPS
		                TweenLite.from(objs[2], .1, { alpha: 0, delay: .3 });

		                incrementSequence();
		            }
		            break;
		        case 5:
		            if (readyToRun(5)) {
		                showElement(tA);
		                TweenLite.to(tA, 0, { alpha: 1 });
		                TweenLite.from(tA, 1, { y: 170 });
		                incrementSequence();
		            }
		            break;
		        case 6:
		            if (readyToRun(6.7)) {
		                showElement(t1);
		                TweenLite.to(t1, .75, { alpha: 1 });
		                incrementSequence();
		            }
		            break;
		        case 7:
		            if (readyToRun(7.6)) {
		                showElement(t2);
		                TweenLite.to(t2, .75, { alpha: 1 });
		                incrementSequence();
		            }
		            break;
		        case 8: // clear
		            if (readyToRun(11.6)) {
		                TweenLite.to(t2, .5, { alpha: 0 });
		                incrementSequence();
		            }
		            break;
		        case 9:
		            if (readyToRun(12.1)) {
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