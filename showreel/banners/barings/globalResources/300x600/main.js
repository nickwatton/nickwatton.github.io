(function(){
	// 'use strict';

	 window.requestAnimFrame = (function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

	/* DoubleClick dynamic data */
	var enablerInitHandler = function() {

		function disclaimerClick(){
			if(disclaimerOpen){
				disclaimerOpen = false;
				TweenLite.to(get("infoClick"), 0, {x:0, y:0});
				hideFullDisclaimer();
			}
			else{
				disclaimerOpen = true;
				TweenLite.to(get("infoClick"), 0, {x:230, y:-547});
				showFullDisclaimer()
			}
		}

		function showFullDisclaimer(){
			var elem = get("disclaimer");
			elem.style.display="block";
		}
		function hideFullDisclaimer(){
			var elem = get("disclaimer");
			elem.style.display="none";
		}

		var disclaimerOpen = false;


		var infoClick = get('infoClick');
		if (infoClick.addEventListener)
		    infoClick.addEventListener("click", disclaimerClick, false);
		else
		    infoClick.attachEvent("onclick", disclaimerClick);

		/* Data ready. Play banner */
		runSequencer();
	}

	/* Animation sequencer outwith the spritesheet */
	function runSequencer(){
		var ticks = 0,
		running = false,
		seqCnt = 0,
		tA = get("textContent"),
		t1 = get("c1"),
		t2 = get("c2"),
		t3 = get("c3"),
		t4 = get("c4"),
		objs = [get("bag"), // 0
				get("beans"), // 1
				get("bins"), // 2
				get("clipboard"), // 3
				get("coal"), // 4
				get("glasses"), // 5
				get("gps"), // 6
				get("hat"), // 7
				get("pencil"), // 8
				get("photos"), // 9
                get("beanbag"), // 10
                get("maps"), // 11
                get("cards")], // 12

		/** Fast plays through then stops animation on a particular view to help styling.
			testState - case at which to stop.
			NB - delayed tweens prior to the desired view may not fire
		**/
		layoutTesting = false,
		testState = 5,

		hideElement = function(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++) t[l].style.display="none";
		},
		showElement = function(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++) t[l].style.display="block";
		},
		readyToRun = function(t){ return layoutTesting || (ticks > t) ? true : false; },
		incrementSequence = function(){ layoutTesting && seqCnt===testState ? clearInterval(sequencer) : seqCnt++; },

		sequencer = function()
		{
		    switch (seqCnt) {
		        /**	Each case is a scene change
					This can be a build, a clear, or both.
					The number in the if statement is time seconds.
						This is intended to give a readable view of the animation as a whole.
						ie - case 2 might be (4) which is 4 seconds into the animation >> these events should happen
					Each case should include the incrementSequence(); call
				**/
		        case 0:
		            if (readyToRun(0.04)) {
		                //show headline
		                showElement(t1);
		                TweenLite.to(t1, .95, { alpha: 1 });
		                incrementSequence();
		            }
		            break;

				case 1:
		            if (readyToRun(0.6)) {
						showElement([objs[7], objs[11], objs[0]]);

		                // hat DROPS
		                TweenLite.from(objs[7], .5, { y:-330, scaleX:2.5, scaleY:2.5, ease:Power1.easeIn, ease:Power1.easeIn });
		                TweenLite.from(objs[7], .1, { alpha:0 });

		                // bag
		                TweenLite.from(objs[0], .8, { x:80, y:20, rotation:-10, delay:.1 });
		                TweenLite.from(objs[0], .1, { alpha:0, delay:.1 });

		                // map
		                TweenLite.from(objs[11], .5, { x:80, y:-10, delay:.5 });
		                TweenLite.from(objs[11], .1, { alpha:0, delay:.5 });

		                incrementSequence();
		            }
		            break;
		        case 2:
		            if (readyToRun(1.3)) {
						showElement([objs[5], objs[3], objs[8], objs[6]]);

		                // glasses DROP
		                TweenLite.from(objs[5], .6, { y:-190, scaleX:2.5, scaleY:2.5, ease:Power1.easeIn });
		                TweenLite.from(objs[5], .1, { alpha:0 });

		                // clipboard
		                TweenLite.from(objs[3], 1.3, { x:-10, y:125, delay:.2 });
		                TweenLite.from(objs[3], .1, { alpha:0, delay:.2 });

		                // pencil
		                TweenLite.from(objs[8], .75, { y:100, ease:Power1.easeOut, delay:.8 });
		                TweenLite.from(objs[8], .1, { alpha:0, delay:.8 });

		                // gps DROP
		                TweenLite.from(objs[6], .5, { x:150, y:10, scaleX:2.5, scaleY:2.5, ease:Power1.easeIn, ease:Power1.easeIn, delay:.5 });
		                TweenLite.from(objs[6], .1, { alpha:0, delay:.5 });

		                incrementSequence();
		            }
		            break;
		        case 3:
		            if (readyToRun(2)) {
						showElement([objs[9], objs[2], objs[10], objs[1]]);

		                // photos
		                TweenLite.from(objs[9], .6, { x:-50, y:-10, rotation:20, ease:Power1.easeOut });
		                TweenLite.from(objs[9], .1, { alpha:0 });

		                // bins DROP
		                TweenLite.from(objs[2], 1, { x:-5, y:180, scaleX:2.5, scaleY:2.5, ease:Power1.easeIn, delay:.2});
		                TweenLite.from(objs[2], .1, { alpha:0, delay:.2 });

		                // beanbag
		                TweenLite.from(objs[10], .6, { y:-60, ease:Power1.easeIn, delay:.1});
		                TweenLite.from(objs[10], .1, { alpha:0, delay:.1 });

		                // beans
		                TweenLite.from(objs[1], .3, { y:-70, delay:.7});
		                TweenLite.from(objs[1], .1, { alpha:0, delay:.7 });

		                incrementSequence();
		            }
		            break;
		        case 4:
		            if (readyToRun(2.9)) {
						showElement([objs[4], objs[12]]);

		                // coal DROP
		                TweenLite.from(objs[4], .6, { x:-120, y:-10, rotation:-20, scaleX:2.5, scaleY:2.5, ease:Power1.easeIn });
		                TweenLite.from(objs[4], .1, { alpha:0 });

		                // cards
		                TweenLite.from(objs[12], .8, { x:40, rotation:10, ease:Power1.easeOut, delay:.2 });
		                TweenLite.from(objs[12], .1, { alpha:0, delay:.2 });
		                incrementSequence();
		                // running = false;
		            }
		            break;

		        case 5:
		            if (readyToRun(4.4)) {
		                // Clear headline
		                TweenLite.to(t1, .75, { alpha: 0, onComplete: function () { hideElement(t1) } });
		                incrementSequence();
		            }
		            break;
		        case 6:
		            if (readyToRun(5.4)) {
		                //headline 2
		                showElement(t2);
		                TweenLite.to(t2, .75, { alpha: 1 });
		                incrementSequence();
		            }
		            break;
		        case 7: // clear
		            if (readyToRun(11)) {
		                TweenLite.to(t2, .5, { alpha: 0 });
		                incrementSequence();
		            }
		            break;
		        case 8:
		            if (readyToRun(11.4)) {
		                hideElement(t2);
		                showElement(t3);
		                showElement(t4);
		                TweenLite.to(t3, .75, { alpha: 1 });
		                TweenLite.to(t4, .75, { alpha: 1, delay: .5 });
		                incrementSequence();
		            }
		            break;
		        case 9:
		            running = false;
		    }
		    ticks += 1 / 60; // Running at 60fps, convert to seconds(-ish)
		}
		function animate()
	    {
	    	if(running){
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
	window.onload = function() {
		enablerInitHandler();
	};
}());