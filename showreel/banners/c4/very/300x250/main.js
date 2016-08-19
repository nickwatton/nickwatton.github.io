(function(){
	'use strict';

	 window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    Date.now = Date.now || function() { return +new Date; }; // IE8 protection

	function clickHandler(e) {
		window.open("http://www.very.co.uk/", "_blank");
		// window.open(window.clickThruURL, "_blank");
	}

	var init = function() {
		/* All ready. Play banner */
		var clickArea = get('bg-exit');
		if (clickArea.addEventListener)
		    clickArea.addEventListener("click", clickHandler, false);
		else
		    clickArea.attachEvent("onclick", clickHandler);
		runSequencer();
	}

	/* Animation sequencer outwith the spritesheet */
	function runSequencer(){
		var ticks = 0,
		animTicks = 0,
		running = false,
		seqCnt = 0,
		loopCount = 0,
		allowLoopCheck = true,
		allowResetSection = true,
		cpy1 = get("t1"),
		cpy2 = get("t2"),
		bg2 = get("bg2"),
		cta = get("cta"),

		hideElement = function(el){ el.style.display="none"; },
		showElement = function(el){ el.style.display="block"; },
		readyToRun = function(t){ return (ticks > t) ? true : false; },			// Check if time is correct to allow section code to run
		incrementSequence = function(){ seqCnt++; allowResetSection=true; },			// Push sequence to next section
		resetSectionCount = function(){ animTicks = 0; allowResetSection=false; },	// reset count for animation within a section/case

		sequencer = function()
		{
			switch(seqCnt)
			{
				// Reveal frame 1
				case 0:
					if(readyToRun(0.25))
					{
						if(allowResetSection){
							resetSectionCount();
							showElement(bg2);
						}
						animTicks <= 45 ? bg2.style.opacity = (animTicks/45) : incrementSequence();
					}
					break;
				case 1:
					if(readyToRun(1))
					{
						if(allowResetSection){
							resetSectionCount();
							showElement(cpy1);
						}
						animTicks <= 45 ? cpy1.style.opacity = (animTicks/45) : incrementSequence();
					}
					break;

				// Clear previous
				case 2:
					if(readyToRun(4))
					{
						if(allowResetSection){ resetSectionCount(); }
						if(animTicks <= 30){
							cpy1.style.opacity = 1-(animTicks/30);
						}
						else{
							hideElement(cpy1);
							incrementSequence();
						}
					}
					break;

				// Reveal frame 2
				case 3:
					if(readyToRun(5))
					{
						if(allowResetSection){
							resetSectionCount();
							showElement(cpy2);
						}
						animTicks <= 45 ? cpy2.style.opacity = (animTicks/45) : incrementSequence();
					}
					break;
				case 4:
					if(readyToRun(6.25))
					{
						if(allowResetSection){
							resetSectionCount();
							showElement(cta);
						}
						if(animTicks <= 45){
							cta.style.opacity = (animTicks/45);

							if(animTicks <= 20)
								cta.style.top = (20-animTicks) + "px" ;
						}
						else{incrementSequence();}
					}
					break;

				// Check if need to loop. Reset & restart or stop
				case 5:
					if(readyToRun(12)){
						if(allowLoopCheck){
							loopCount++;
							allowLoopCheck = false;
						}
						if(loopCount < 3){
							if(allowResetSection){ resetSectionCount(); }
							if(animTicks <= 30){
								t2.style.opacity = 1-(animTicks/30);
								cta.style.opacity = 1-(animTicks/30);
							}
							else{
								// reset, so next sequence will be first
								hideElement(t1);
								hideElement(cta);
								allowResetSection=true;
								allowLoopCheck = true;
								ticks = 0;
								animTicks = 0;
								seqCnt = 1;
							}
						}
						else{
							running = false;
						}
					}
					break;

			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
			animTicks++;
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
		init();
	};

}());