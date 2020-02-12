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

	function clickHandler(e) {
		window.open(window.clickThruURL, "_blank");
	}

	var init = function() {
		/* All ready. Play banner */
		var clickArea = get('bg-exit');
		if (clickArea.addEventListener)
		    clickArea.addEventListener("click", clickHandler, false);
		else
		    clickArea.attachEvent("onclick", clickHandler);
		runAnimation();
	}

	function runAnimation(){
		var ticks = 0,
		renderQ = {},
		timeline = {},
		timelineID = 0,
		timelineStopped = false,
		rollingTime = 0,
		running = true,
		looping = false;

		function buildAnimation(){
			addToTimeline( {id:pegi, time:rollingTime+=.1, alpha:1, duration:.5 } );
			addToTimeline( {id:t1, time:rollingTime+=.5, alpha:1, duration:.5 } );
			addToTimeline( {id:t1, time:rollingTime+=3, alpha:-1, duration:.5 } );
			addToTimeline( {id:t2, time:rollingTime+=.5, alpha:1, duration:.5 } );

			addToTimeline( {id:s6, time:rollingTime+=3, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s7, time:rollingTime+=.1, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s5, time:rollingTime+=.1, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s9, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s8, time:rollingTime+=.1, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s3, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s4, time:rollingTime+=.1, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );

			addToTimeline( {id:t2, time:rollingTime, alpha:-1, duration:.5 } );

			addToTimeline( {id:s13, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s12, time:rollingTime+=.1, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s10, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s2, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s11, time:rollingTime+=.05, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );

			addToTimeline( {id:brand, time:rollingTime, alpha:1, duration:.5 } );
			addToTimeline( {id:cta, time:rollingTime + .5, alpha:1, duration:.5 } );

			addToTimeline( {id:s15, time:rollingTime, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s1, time:rollingTime+=.05, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );
			addToTimeline( {id:s14, time:rollingTime+=.05, sLeft:0, left:-300, duration:.25, ease:easeOutSine } );

			addToTimeline( {id:t3, time:rollingTime+=1.5, alpha:1, duration:.5 } );
		}

		function addToTimeline(obj){
			var elements=[].concat(obj.id),
			tObj, tempElement, domElement, i;
			for(i=0; i<elements.length; i++){
				tObj = Object.create(obj);
				tempElement = elements[i];
				domElement = typeof tempElement === 'string' ? get(tempElement) : tempElement;
				tObj.domElement = domElement;
				tObj.id = (typeof tempElement != 'string') ? tempElement.id : tempElement;
				tObj.inQ = true;
				tObj.timelineID = timelineID++;
				timeline[tObj.timelineID] = tObj;
			}
		}

		function runTimeline(){
			for(var key in timeline){
				var obj = timeline[key];
				if(obj.inQ && ticks >= obj.time && !timelineStopped){
					showElement(get(obj.id));
					addRenderQ(obj);
					obj.inQ = false;
					if(obj.stopHere === true) timelineStopped = true;
				}
			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
		}

		function addRenderQ(obj){
			obj.count = 0;
			obj.duration = Math.round(60*obj.duration);
			if(obj.alpha){ obj.sAlpha = Number(window.getComputedStyle(obj.domElement).opacity); }
			if(obj.ease == undefined) obj.ease = easeInSine;
			if(obj.override === false){ obj.id = obj.id + Date.now();}
			renderQ[obj.id] = obj;
		}

		function runRenderQ(){
			for(var key in renderQ){
				var obj = renderQ[key],
				domElement = obj.domElement;
				if(obj.left){ domElement.style.left = obj.ease(obj.count, obj.sLeft, obj.left, obj.duration) + "px"; }
				if(obj.top){ domElement.style.top = obj.ease(obj.count, obj.sTop, obj.top, obj.duration) + "px"; }
				if(obj.alpha != undefined){ domElement.style.opacity = obj.ease(obj.count, obj.sAlpha, obj.alpha, obj.duration); }
				obj.count++;
				if(obj.count > obj.duration){ removeRenderQ(obj); }
			}
		}

		function removeRenderQ(obj){
			if(obj.callback){ obj.callback(obj.domElement); }
			var key = obj.id;
			delete renderQ[key];
			key = obj.timelineID;
			if(!looping) delete timeline[key];
			if(Object.size(timeline) <= 0) running = false;
		}

		function hideElement(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++)
				t[l].style.display="none";
		}

		function showElement(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++)
				t[l].style.display="block";
		}

		var PI = Math.PI,
		halfPI = PI/2,

		easeLinear = function (t, b, c, d) {
	    	return c*t/d + b;
		},
		easeInSine = function (t, b, c, d) {
			return c * (1 - Math.cos(t/d * (halfPI))) + b;
		},
		easeOutSine = function (t, b, c, d) {
			return c * Math.sin(t/d * (halfPI)) + b;
		},
		easeInOutSine = function (t, b, c, d) {
			return c/2 * (1 - Math.cos(PI*t/d)) + b;
		};

		function animate()
	    {
	    	if(running){
				runTimeline();
				runRenderQ();
				requestAnimFrame(animate);
			}
	    }
	    buildAnimation();
	    animate();
	}

	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	function get(id) {
		return document.getElementById(id);
	}

	window.onload = function() {
		init();
	};
}());