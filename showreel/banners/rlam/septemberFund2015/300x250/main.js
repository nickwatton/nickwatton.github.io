(function(){
	'use strict';

	var init = function() {

		function addExit(){
			// Enabler.exit("RLAM September");
		}

		function clickHandler(){
			 // Enabler.exit(dynamicContent[0].Reporting_Label, dynamicContent[0].Exit_URL.Url);
		}

		function showFullDisclaimer(){
			var elem = get("disclaimer");
			elem.style.display="block";
			TweenLite.to(elem, 0, {scaleX:0, x:elem.offsetWidth*.5});
			TweenLite.to(elem, .1, {scaleX:1, x:0});
		}
		function hideFullDisclaimer(){
			var elem = get("disclaimer");
			TweenLite.to(elem, .1, {scaleX:0, x:elem.offsetWidth>>1, onComplete:function(){elem.style.display="none";}});
		}

		get("dynamicContent").onclick = clickHandler;
		// get("logo").onclick = clickHandler;
		get("footer").onclick = showFullDisclaimer;
		get("closer").onclick = hideFullDisclaimer;
		// window.onclick = clickHandler;

		/* Data ready. Play banner */
		runSequencer();
	}

	/* Animation sequencer outwith the spritesheet */
	function runSequencer(){
		var ticks = 0,
		running = false,
		seqCnt = 0,
		bgF1 = get("bgF1"),
		t1 = get("copy_1"),
		t2 = get("copy_2"),
		p1 = get("p1"),
		p2 = get("p2"),
		gilbert = get("gilbert"),

		spriteSheetRunning = false,

		/** Fast plays through then stops animation on a particular view to help styling.
			testState - case at which to stop.
			NB - This is a rough helper, and may result in scrambled screens. Delayed tweens prior to the desired view may not fire **/
		layoutTesting = false,
		testState = 4,

		hideElement = function(el){ el.style.display="none"; },
		showElement = function(el){ el.style.display="block"; },
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
						showElement(get("screen_1"));
						showElement(t1);
						showElement(t2);
						TweenLite.to(t1, .25, {alpha:1});
						incrementSequence();
					}
					break;
				case 1:
					if(readyToRun(0.5))
					{
						runMagAnimation();
						incrementSequence();
					}
					break;
				case 2:
					if(readyToRun(4.5))
					{
						TweenLite.to([get("magAnim"), t1], .5, {alpha:0});
						TweenLite.to(t2, 1, {alpha:1, delay:.5});
						runGilbert();
						incrementSequence();
					}
					break;
				case 3:
					if(readyToRun(11))
					{
						TweenLite.to(gilbert, 1, {x:0, y:-10, scaleX:.4, scaleY:.4});
						TweenLite.to(get("magAnimWrapper"), .5, {css:{borderBottomColor:'#6d3583', height:"92px"}});
						TweenLite.to([t1, t2], .5, {alpha:0});
						incrementSequence();
					}
					break;
				case 4:
					if(readyToRun(11.5))
					{
						hideElement(get("screen_1"));
						showElement(get("screen_2"));
						TweenLite.from(get("screen_2"), 1, {alpha:0, scaleY:0, y:-65, onComplete:function(){showElement(get("p0"))}});
						TweenLite.to(get("p0"), .5, {alpha:1, delay:1});
						showElement(get("p1"));
						TweenLite.to(p1, 1.5, {alpha:1, delay:1.25});
						incrementSequence();
				 		// running = false;
					}
					break;
				case 5:
					if(readyToRun(18))
					{
						revealFinalFrame();
						//incrementSequence();
				 		running = false;
					}
					break;
				case 6:
				 	running = false;
			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
		}

		function revealFinalFrame(){
			TweenLite.to(p1, 1, {x:-p1.offsetWidth});
			showElement(get("p2"));
			TweenLite.to(p2, 0, {alpha:1,x:p2.offsetWidth});
			TweenLite.to(p2, 1, {x:0});
		}

		TweenLite.to(get("disclaimer"), 0, {alpha:1});

		/* Set up animation elements for creative size */
		TweenLite.to(gilbert, 0, {scaleX:.5, scaleY:.5, x:55});
		TweenLite.to(get("magAnim"), 0, {scaleX:.8, scaleY:.8, x:-100, y:-26});

		/* tween animation */
		function runMagAnimation()
		{
			var magGlass = get("magGlass"),
				incomeText = get("incomeText");
			TweenLite.to(magGlass, 0, {alpha:0, y:5});
			TweenLite.to(incomeText, 0, {alpha:0, x:-50, y:4});

			TweenLite.to(magGlass, .25, {alpha:1, onComplete:function(){incomeText.style.opacity=1;} });
			TweenLite.to(magGlass, 1, {x:165, ease:Power1.easeOut});
			TweenLite.to(magGlass, 1, {scaleX:1.7, scaleY:1.7, x:239, y:20, ease:Power1.easeInOut, delay:1.5});
			TweenLite.to(incomeText, 1, {scaleX:1.5, scaleY:1.5, x:-50, y:0, ease:Power1.easeInOut, delay:1.5});
		}

		function runGilbert(){
			showElement(gilbert);
			TweenLite.to(gilbert, .5, {alpha:1});
			// TweenLite.to(gilbert, .5, {x:0, y:-10, scaleX:.4, scaleY:.4, delay:7}); // ENABLE WHEN TESTING
			startSpriteSheet("gilbert", 186, 4, 230, 430, 24);
		}

		/* Spritesheet control */
		function startSpriteSheet(domObj, frames, sheetWidth, frameHeight, frameWidth, tFPS){
			spriteSheetRunning = true;
			runSpriteSheet(domObj, frames, sheetWidth, frameHeight, frameWidth, tFPS);
		}
		function runSpriteSheet(domObj, frames, sheetWidth, frameHeight, frameWidth, tFPS){
			var item=get(domObj),
			counter=0,// Counter for the number of items per row
			frameCount=0,// Keeping track of the number of frames
			endFrame=frames-1,
			sheetHeight=frameHeight,
			rowHeight=0,// Set the height for the row we are cycling
			sheetWidth=sheetWidth,// how many images accross
			xPos=0,// set xpos of background image
			containerWidth=frameWidth,//item.offsetWidth,
			fps=1000/tFPS,
			animate=setInterval(function(){
				counter++;
				frameCount++;
				xPos = counter * containerWidth;// Set the xPosition of background image
				if ( counter && (counter % sheetWidth === 0)) {// Drop down a row when column count reached
					rowHeight=rowHeight+sheetHeight;
					counter=0;
					xPos=0;
				}
				// Apply styles to image
				item.style.backgroundPosition = "-"+xPos+"px -"+rowHeight+"px ";
				if(frameCount >= endFrame){
					clearInterval(animate);
					spriteSheetRunning = false;
				}
			}, fps);  // 47:21fps // 41=24fps -ish
		}

		function animate()
	    {
	    	if(running){
				sequencer();
				requestAnimationFrame(animate);
			}
	    }

	    running = true;
	    var delay = setTimeout(animate, 10);

	    // TESTING CALLS
		// runMagAnimation();
		// runGilbert()
	}

	/* Helper */
	function get(id) {
		return document.getElementById(id);
	}

	/* Kick off when page ready */
	init();
}());