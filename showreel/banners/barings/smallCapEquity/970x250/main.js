(function(){
	'use strict';

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
				TweenLite.to(get("infoClick"), 0, {x:-105, y:-194});
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
				get("coinHK"),      // 12
		        get("piston"),      // 13
                get("designpaper"), // 14
		        get("tape"),        // 15
                get("cork")],        // 16

		/** Fast plays through then stops animation on a particular view to help styling.
			testState - case at which to stop.
			NB - delayed tweens prior to the desired view may not fire
		**/
		layoutTesting = false,
		testState = 5,

		showElement = function(el){ el.style.display="block"; },
		hideElement = function(el){ el.style.display="none"; },
		readyToRun = function(t){ return layoutTesting || (ticks > t) ? true : false; },
		incrementSequence = function(){ layoutTesting && seqCnt===testState ? clearInterval(sequencer) : seqCnt++; },

		sequencer = function()
		{
			switch(seqCnt)
			{
				/**	Each case is a scene change
					This can be a build, a clear, or both.
					The number in the if statement is time seconds.
						This is intended to give a readable view of the animation as a whole.
						ie - case 2 might be (4) which is 4 seconds into the animation >> these events should happen
					Each case should include the incrementSequence(); call
				**/
				case 0:
					if(readyToRun(0.04))
					{
				
					    //show headline
						showElement(t1);
						TweenLite.to(t1, .95, { alpha: 1 });

						incrementSequence();
					}
					break;
			    case 1:
			        if (readyToRun(1)) {
			            // design paper
			            showElement(objs[14]);
			            TweenLite.from(objs[14], .8, { y: 211 });
			            TweenLite.from(objs[14], .1, { alpha: 0 });


			            // mask
			            showElement(objs[6]);
			            TweenLite.from(objs[6], .9, { scaleX: 2.5, scaleY: 2.5, x: 100, y: -395, rotation: 10, ease: Power1.easeIn });	// DROPS
			            TweenLite.from(objs[6], .1, { alpha: 0 });

			            // keys
			            showElement(objs[5]);
			            TweenLite.from(objs[5], .9, { scaleX: 2.5, scaleY: 2.5, x: -50, y: -240, rotation: 30, delay: .1, ease: Power1.easeIn });	// DROPS
			            TweenLite.from(objs[5], .1, { alpha: 0, delay: .1 });

			            //show headline
			            showElement(t1);
			            TweenLite.to(t1, .95, { alpha: 1 });

			            incrementSequence();
			        }
			        break;
				case 2:
					if(readyToRun(1.7))
					{
					    // paper
					    showElement(objs[7]);
					    TweenLite.from(objs[7], .5, { x: -97, y: -138});
					    TweenLite.from(objs[7], .1, { alpha: 0 });

					    // piston
					    showElement(objs[13]);
					    TweenLite.from(objs[13], .6, { x: 0, y: 92, ease: Power1.easeIn });
					    TweenLite.from(objs[13], .1, { alpha: 0 });

					    // corkscrew
					    showElement(objs[3]);
					    TweenLite.from(objs[3], .6, { scaleX: 2.5, scaleY: 2.5, y: -190, rotation: 30, ease: Power1.easeIn });	// DROPS
					    TweenLite.from(objs[3], .1, { alpha: 0 });

					    // cork
					    showElement(objs[16]);
					    TweenLite.from(objs[16], .6, { scaleX: 2.5, scaleY: 2.5, y: -170, rotation: 30, delay: .3, ease: Power1.easeIn });	// DROPS
					    TweenLite.from(objs[16], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 3:
					if(readyToRun(1.9))
					{
					    // tablet
					    showElement(objs[10]);
					    TweenLite.from(objs[10], .8, { scaleX: 2.5, scaleY: 2.5, x: 80, y: -180, rotation: 30, delay: .1 });
					    TweenLite.from(objs[10], .1, { alpha: 0 });

					    // tape
						showElement(objs[15]);
						TweenLite.from(objs[15], .4, { x: -30, y: 60, rotation:10 });
						TweenLite.from(objs[15], .1, { alpha: 0 });

					    // photos
						showElement(objs[9]);
						TweenLite.from(objs[9], 0.7, { x: -10, y: 30, rotation: 10 });
						TweenLite.from(objs[9], .1, { alpha: 0 });

						incrementSequence();
					}
					break;
				case 4:
					if(readyToRun(2.3))
					{
					    // wallet
					    showElement(objs[11]);
					    TweenLite.from(objs[11], .5, { y: 61 });
					    TweenLite.from(objs[11], .1, { alpha: 0 });

					    // phone
					    showElement(objs[8]);
					    TweenLite.from(objs[8], .8, { scaleX: 2.5, scaleY: 2.5, x: -20, y: -190, ease: Power1.easeIn });
					    TweenLite.from(objs[8], .1, { alpha: 0, delay: .1 });

						incrementSequence();
					}
				case 5:
					if(readyToRun(2.7))
					{				
						// biro
						showElement(objs[0]);
						TweenLite.from(objs[0], .5, { x:-118,  delay:.3});
						TweenLite.from(objs[0], .1, { alpha: 0, delay: .3 });

					    // coffee
						showElement(objs[4]);
						TweenLite.from(objs[4], .5, { scaleX: 2, scaleY: 2, x: -20, y: -100, ease: Power1.easeIn });		// DROPS
						TweenLite.from(objs[4], .1, { alpha: 0 });

					    //// coin
						//showElement(objs[2]);
						//TweenLite.from(objs[2], .5, {
						//    scaleX: 3, scaleY: 3, x: 5, y: -206, delay: .2, ease: Power1.easeIn
						//});	// DROPS
					    //TweenLite.from(objs[2], .1, { alpha: 0, delay: .3 });

					    // coinHK
						showElement(objs[12]);
						TweenLite.from(objs[12], .5, { scaleX: 3, scaleY: 3, x: 5, y: -206, delay: .2, ease: Power1.easeIn });
						TweenLite.from(objs[12], .1, { alpha: 0, delay: .3 });
 
						incrementSequence();
					}
				case 6:
					if(readyToRun(2.9))
					{
						incrementSequence();
					}			
				case 7:
					if(readyToRun(4.4))
					{
					    // Clear headline
					    TweenLite.to(t1, .75, { alpha: 0, onComplete: function () { hideElement(t1) } });

						incrementSequence();
					}
					break;
				case 8:
					if(readyToRun(5.4))
					{
					    //headline 2
					    showElement(t2);
					    TweenLite.to(t2, .75, { alpha: 1 });

						incrementSequence();
					}
					break;
				case 9: // clear
					if(readyToRun(11))
					{
						TweenLite.to(t2, .5, {alpha:0});
						incrementSequence();
					}
					break;
				case 10:
					if(readyToRun(11.4))
					{
						hideElement(t2);
						showElement(t3);
						showElement(t4);
						TweenLite.to(t3, .75, {alpha:1});
						TweenLite.to(t4, .75, {alpha:1, delay:.5});
						incrementSequence();
					}
					break;
				case 11:
				 	running = false;
			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
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