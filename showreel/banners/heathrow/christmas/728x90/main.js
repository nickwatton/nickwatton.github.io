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
		Enabler.setProfileId(1065022);
	    var devDynamicContent = {};

	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport= [{}];
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0]._id = 0;
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Unique_ID = 1;
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Reporting_Label = "Heathrow_OnAirport";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy1 = "Pick up those last minute surprises";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy2 = "At sensational Heathrow prices";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy3 = "With free gift-wrapping in terminal before you fly";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy4 = "For those final festive touches";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].CTA = "Shop Christmas at Heathrow";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy1_mob = "Last minute gift ideas at great prices";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy2_mob = "With free gift-wrapping";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy3_mob = "For those final festive touches before you fly";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy4_mob = "";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].CTA_mob = "Shop Christmas at Heathrow";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Exit_URL = {};
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Exit_URL.Url = "http://your.heathrow.com/";
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Default = true;
	    devDynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Active = true;
	    Enabler.setDevDynamicContent(devDynamicContent);

	    /* Apply dynamic content */
		get("copy_1").innerHTML = dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy1;
		get("copy_2").innerHTML = dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy2;
		get("copy_3").innerHTML = dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy3;
		get("copy_4").innerHTML = dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Copy4;
		get("ctaCopy").innerHTML = dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].CTA;

		function addExit(){
			Enabler.exit("Heathrow_OnAirport");
		}

		function clickHandler(){
			 Enabler.exitOverride(dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Reporting_Label, dynamicContent.Heathrow_Christmas_2015_dynamic_feed_OnAirport[0].Exit_URL.Url);
		}

		// IE8 ready click handlers
		var clickArea = get("clickArea");
		if (clickArea.addEventListener){ clickArea.addEventListener("click", clickHandler, false); }
		else { clickArea.attachEvent("onclick", clickHandler); }

		/* Data ready. Play banner */
		runSequencer();
	}

	/* Animation sequencer outwith the spritesheet */
	function runSequencer(){
		var startTime = Date.now(),
		ticks = 0,
		running = false,
		seqCnt = 0,
		bgF1 = get("bgF1"),
		bgF2 = get("bgF2"),
		t1 = get("copy_1"),
		t2 = get("copy_2"),
		t3 = get("copy_3"),
		t4 = get("copy_4"),
		cta = get("ctaCopy"),
		tc = get("tc"),
		glitter = get("glitter"),

		/** Fast plays through then stops animation on a particular view to help styling.
			testState - case at which to stop.
			NB - delayed tweens prior to the desired view may not fire
		**/
		layoutTesting = false,
		testState = 5,
		allowResetSection = true,

		hideElement = function(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++) t[l].style.display="none";
		},
		showElement = function(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++) t[l].style.display="block";
		},
		readyToRun = function(t){ return layoutTesting || (ticks > t) ? true : false; },
		incrementSequence = function(){ layoutTesting && seqCnt===testState ? running=false : seqCnt++; allowResetSection=true; },
		resetSectionCount = function(){ allowResetSection=false; },	// reset count for animation within a section/case

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
						showElement([bgF1, t1, glitter]); // reveal - display is none for IE8
						TweenLite.to(bgF1, 1.5, {alpha:1, ease: Sine.easeIn});
						TweenLite.to([t1, glitter], 1.5, {alpha:1});
						incrementSequence();
					}
					break;
				case 1: // clearing screen 1
					if(readyToRun(3))
					{
						TweenLite.to(t1, .5, {alpha:0, onComplete:hideElement, onCompleteParams:[get("screen_1")]});
						incrementSequence();
					}
					break;
				case 2:
					if(readyToRun(4.5))
					{
						showElement(t2); // reveal - display is none for IE8
						TweenLite.to(t2, 1.5, {alpha:1});
						incrementSequence();
					}
					break;
				case 3: // clearing screen 2
					if(readyToRun(8.5))
					{
						TweenLite.to([t2], 1, {alpha:0, onComplete:hideElement, onCompleteParams:[t2]});
						incrementSequence();
					}
					break;
				case 4:
					if(readyToRun(10))
					{
						showElement([t3]); // reveal - display is none for IE8
						TweenLite.to([t3], 1, {alpha:1});
						incrementSequence();
					}
					break;
				case 5: // clearing screen 3 pt1
					if(readyToRun(14))
					{
						TweenLite.to([bgF1, t3], .5, {alpha:0, onComplete:hideElement, onCompleteParams:[bgF1, t3]}); // clear, then hide for IE8
						incrementSequence();
					}
					break;
				case 6:
					if(readyToRun(15))
					{
						showElement([bgF2, t4]); // reveal - display is none for IE8
						TweenLite.to([bgF2, t4], .5, {alpha:1, ease: Sine.easeIn});
						incrementSequence();
					}
					break;
				case 7:
					if(readyToRun(16))
					{
						showElement([cta, tc]); // reveal - display is none for IE8
						TweenLite.to([cta, tc], .75, {alpha:1});
						incrementSequence();
					}
					break;
				case 8:
				 	running = false;
			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
		}
		function animate()
	    {
	    	if(running)
				sequencer();
			requestAnimFrame(animate);
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
		if (Enabler.isInitialized()) {
			enablerInitHandler();
		} else {
			Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler);
		}
	};
}());