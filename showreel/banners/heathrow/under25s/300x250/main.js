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

	var vid = get('bgVideo'),
	videoVisible = false,
	videoContainer = get('video_container'),
	videoComp;

	/* DoubleClick dynamic data */
	var enablerInitHandler = function() {

		function clickHandler(){
		}

		// IE8 ready click handlers
		var clickArea = get("container");
		if (clickArea.addEventListener){ clickArea.addEventListener("click", clickHandler, false); }
		else { clickArea.attachEvent("onclick", clickHandler); }

		buildVideo();
	}


	function buildVideo(){
		var vid = get('bgVideo'),
		supportWebM = vid.canPlayType('video/webm;'),
		useWebM = supportWebM === "probably" || supportWebM === "maybe";
		get("bgVideo").addEventListener('loadeddata', function(){ startSequencer(); }, false);
		vid.src = "BA" + (useWebM ? ".webm" : '.mp4');
		vid.load();
	}

	/* Animation sequencer outwith the spritesheet */
	function startSequencer(){
		var ticks = 0,

		timeline = {},
		timelineID = 0,
		timelineStopped = false,

		t1 = get("copy_1"),
		t2 = get("copy_2"),
		t3 = get("copy_3"),
		t4 = get("copy_4"),
		quote = get("quote"),
		cta = get("cta_btn"),
		logo1 = get("logo_1"),
		logo2 = get("logo_2"),
		logo3 = get("travellers_logo"),
		purple = get("purple_background"),
		line = get("divider"),
		terms = get("terms");

		/* To stop on a frame, add stopHere:true, to the addToTimeline object */
		function buildTimeline(){
			addToTimeline(	{id:[logo1],
							time:.1,
							duration:.5,
							props:{alpha:1, ease:easeInSine}} );

			addToTimeline(	{id:[t1, quote],
							time:.6,
							duration:.5,
							props:{alpha:1, ease:easeInSine}} );

			addToTimeline(	{id:[logo1,t1, quote],
							time:2.6,
							duration:.5,
							props:{alpha:0, ease:easeInSine}} );

			addToTimeline(	{id:[t2, terms],
							time:3.1,
							duration:.5,
							props:{alpha:1, ease:easeInSine}} );

			addToTimeline(	{id:[t2],
							time:5.6,
							duration:.5,
							props:{alpha:0, ease:easeInSine}} );

			addToTimeline(	{id:[t3],
							time:6.1,
							duration:.5,
							props:{alpha:1, ease:easeInSine}} );

			addToTimeline(	{id:[t3, terms],
							time:9.1,
							duration:.5,
							props:{alpha:0, ease:easeInSine}} );

			addToTimeline(	{id:[logo3],
							time:9.5,
							duration:0,
							props:{scale:4}} );

			addToTimeline(	{id:[logo3],
							time:9.6,
							duration:.5,
							props:{alpha:1, scale:1, ease:easeInSine}} );

			addToTimeline(	{id:[logo3],
							time:11.6,
							duration:.5,
							props:{alpha:0, ease:easeInSine}} );

			addToTimeline(	{id:[purple],
							time:12.1,
							duration:1,
							props:{alpha:.7}} );

			addToTimeline(	{id:[logo2, t4, line],
							time:12.1,
							duration:1,
							props:{alpha:1, ease:easeInSine}} );

			addToTimeline(	{id:[cta],
							time:13.1,
							duration:.5,
							props:{alpha:1, ease:easeInSine}} );
		}

		function runTimeline(){


			if(vid.currentTime <= 0){
				return;
			}
			if(!videoVisible){
				vid.style.display="block";
				TweenLite.to(vid, .5, {alpha:1});
				//vidContainer.style.display="block";
				//TweenLite.to(vidContainer, .5, {alpha:1});
				videoVisible = true;
			}

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

	window.mobilecheck = function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	/* Kick off when page ready */
	window.onload = function() {
		enablerInitHandler();
	};

	/* TWEENING */
	var PI = Math.PI,
	halfPI = PI/2,
	easeInSine = function (t, b, c, d) {
		return c * (1 - Math.cos(t/d * (halfPI))) + b;
	},
	easeOutSine = function (t, b, c, d) {
		return c * Math.sin(t/d * (halfPI)) + b;
	};

}());