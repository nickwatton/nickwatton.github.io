(function(){

	// Inject script to switch unsupported SVG images in IE8
	function load_svg_switch_script() {
		var url = 'svg-injector.min.js';
		var script = document.createElement('script');
		script.onreadystatechange = function() {
			//once the script is loaded, run the callback
        	if (script.readyState === 'loaded')
        	    SVGInjector(document.getElementById('logo'));
    	}; 

    	//create the script and add it to the DOM
    	script.src = url;
    	document.getElementsByTagName('head')[0].appendChild(script);
	}

	//Switch svg images to png fallback
	load_svg_switch_script();
}());