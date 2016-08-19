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
	function runSequencer() {
		var ticks = 0,
		timeline = {},
		timelineID = 0,
		timelineStopped = false,

		rollingTime = 0,

		tA = get("textContent"),
		t1 = get("c1"),
		t2 = get("c2"),
		t3 = get("c3"),
		t4 = get("c4"),
		objs = [get("sp-bag"), // 0
				get("sp-battery"), // 1
				get("sp-camera"), // 2
				get("sp-cards"), // 3
				get("sp-coin1"), // 4
				get("sp-coin2"), // 5
				get("sp-coin3"), // 6
				get("sp-coin4"), // 7
				get("sp-cookie"), // 8
				get("sp-diary"), // 9
				get("sp-glasses"), // 10
				get("sp-pen"), // 11
				get("sp-phone"), // 12
				get("sp-photos"), // 13
				get("sp-plane"), // 14
				get("sp-prints"), // 15
				get("sp-sim")]; // 16

        function buildTimeline(){

			addToTimeline(	{id:t1, time:rollingTime+=.1, duration:.5, props:{alpha:1}} );

			addToTimeline(	{id:objs[2], time:rollingTime+=.5, duration:.9, from:true, props:{x:-30, y:-350, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[2], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[15], time:rollingTime+=.6, duration:.6, from:true, props:{y:-124, ease:easeOutSine}} );
			addToTimeline(	{id:objs[15], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[9], time:rollingTime+=.3, duration:.6, from:true, props:{y:133, ease:easeOutSine}} );
			addToTimeline(	{id:objs[9], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[12], time:rollingTime+=.2, duration:.7, from:true, props:{y:280, scaleX:3, scaleY:3, ease:easeInSine}} );
			addToTimeline(	{id:objs[12], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[16], time:rollingTime+=.1, duration:.7, from:true, props:{y:180, scaleX:3, scaleY:3, ease:easeInSine}} );
			addToTimeline(	{id:objs[16], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[0], time:rollingTime, duration:.8, from:true, props:{x:-102, y:10, rotation:-10}} );
			addToTimeline(	{id:objs[0], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[8], time:rollingTime+=.2, duration:.4, from:true, props:{x:-102, y:-200, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[8], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[3], time:rollingTime, duration:.8, from:true, props:{x:85}} );
			addToTimeline(	{id:objs[3], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[11], time:rollingTime, duration:.7, from:true, props:{y:-105, scaleX:2.5, scaleY:2.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[11], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[1], time:rollingTime+=.4, duration:.7, from:true, props:{y:-260, scaleX:2.5, scaleY:2.5, rotation:-30, ease:easeInSine}} );
			addToTimeline(	{id:objs[1], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[5], time:rollingTime+=.4, duration:.5, from:true, props:{x:-30, y:-120, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[5], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[7], time:rollingTime+=.1, duration:.5, from:true, props:{x:30, y:-120, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[7], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[4], time:rollingTime+=.1, duration:.4, from:true, props:{x:-20, y:-50, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[4], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[6], time:rollingTime+=.1, duration:.4, from:true, props:{x:20, y:-50, scaleX:3.5, scaleY:3.5, ease:easeInSine}} );
			addToTimeline(	{id:objs[6], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[14], time:rollingTime, duration:.6, from:true, props:{y:-68, rotation:-10, rotation:-30, ease:easeOutSine}} );
			addToTimeline(	{id:objs[14], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[13], time:rollingTime, duration:.8, from:true, props:{x:208}} );
			addToTimeline(	{id:objs[13], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );

			addToTimeline(	{id:objs[10], time:rollingTime, duration:.9, from:true, props:{x:130, y:90, scaleX:2.5, scaleY:2.5, rotation:30, ease:easeInSine}} );
			addToTimeline(	{id:objs[10], time:rollingTime, duration:.1, from:true, props:{alpha:0}} );


			addToTimeline(	{id:t1, time:rollingTime+=1.2, duration:.75, props:{alpha:0}} );

			addToTimeline(	{id:t2, time:rollingTime+=.9, duration:.75, props:{alpha:1}} );

			addToTimeline(	{id:t2, time:rollingTime+=4, duration:.5, props:{alpha:0}} );

			addToTimeline(	{id:t3, time:rollingTime+=.4, duration:.75, props:{alpha:1}} );

			addToTimeline(	{id:t4, time:rollingTime+=.75, duration:.75, props:{alpha:1}} );

		}

		function runTimeline(){
			var key, i, obj, elements, tempElement, el;
			for(key in timeline){
				obj = timeline[key];
				if(obj.inQ && ticks >= obj.time && !timelineStopped)
				{
					elements=[].concat(obj.id);
					for(i=0; i<elements.length; i++)
					{
						tempElement = elements[i],
						el = typeof tempElement === 'string' ? get(tempElement) : tempElement;
						showElement(el);
						obj.from ? TweenLite.from(el, obj.duration, obj.props) : TweenLite.to(el, obj.duration, obj.props);
						obj.inQ = false;

						if(obj.stopHere === true) timelineStopped = true;
					}
				}
			}
			ticks += 1/60; // Running at 60fps, convert to seconds(-ish)
		}

		function addToTimeline(obj){
			obj.inQ = true;
			obj.timelineID = timelineID++;
			timeline[obj.timelineID] = obj;
		}

		/* Set display property for (array of) DOM element(s) to none */
		function hideElement(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++)
				t[l].style.display="none";
		}

		/* Set display property for (array of) DOM element(s) to block */
		function showElement(el){
			var t=[].concat(el);
			for(var l=0;l<t.length;l++)
				t[l].style.display="block";
		}

		function animate(){
	    	runTimeline();
			requestAnimFrame(animate);
	    }

		buildTimeline();
	    var delay = setTimeout(animate, 10);
    }

	/* Helper */
	function get(id) {
		return document.getElementById(id);
	}

	/***
	*	TWEENING
	*	Source	http://robertpenner.com/easing/penner_chapter7_tweening.pdf
	*			https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
	*	t	- time/count - Needs to increment
	*	b	- start
	*	c	- end
	*	d	- duration
	*	Available methods:
	*		Linear:			easeLinear (Power0)
	*		Sinusoidal:		easeInSine, easeOutSine, easeInOutSine
	*		Quadratic:		easeInQuad, easeOutQuad, easeInOutQuad (Power1)
	*		Exponential:	easeInExpo, easeOutExpo, easeInOutExpo
	*		Back:			easeInBack, easeOutBack, easeInOutBack
	*		Bounce:			easeOutBounce
	*	Greensock use friendly "Power" names, used here for familiarity. See https://goo.gl/1YnpDp.
	***/
	var PI = Math.PI,
	halfPI = PI/2,
	backSwing = 1.5, //1.70158

	easeLinear = function (t, b, c, d) {
    	return c*t/d + b;
	},
	easePower0 = easeLinear,

	easeInSine = function (t, b, c, d) {
		return c * (1 - Math.cos(t/d * (halfPI))) + b;
	},
	easeOutSine = function (t, b, c, d) {
		return c * Math.sin(t/d * (halfPI)) + b;
	},
	easeInOutSine = function (t, b, c, d) {
		return c/2 * (1 - Math.cos(PI*t/d)) + b;
	},

	easeInQuad = function (t, b, c, d) {
	    return c*(t/=d)*t + b;
	},
	easeOutQuad = function (t, b, c, d) {
	    return -c * (t/=d)*(t-2) + b;
	},
	easeInOutQuad = function (t, b, c, d) {
	    if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInPower1 = easeInQuad,
	easeOutPower1 = easeInOutQuad,
	easeOutPower1 = easeInOutQuad,

	easeInExpo = function (t, b, c, d) {
	    return c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo = function (t, b, c, d) {
	    return c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo = function (t, b, c, d) {
	    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},

	easeInBack = function (t, b, c, d, s) {
		if (s == undefined) s = backSwing;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack = function (t, b, c, d, s) {
		if (s == undefined) s = backSwing;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack = function (t, b, c, d, s) {
		if (s == undefined) s = backSwing;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},

	easeOutBounce = function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	};
	/*** TWEENING END ***/

	/* Kick off when page ready */
	window.onload = function() {
		enablerInitHandler();
	};
}());