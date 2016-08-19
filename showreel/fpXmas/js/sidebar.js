$(document).ready(function(){

	s = {
		target: $("#sidebar"),
		html: $("html"),
		toggleButton: $("#js-open_sidebar")
	};

	init = function(){
		s.toggleButton.bind('click', openSidebar);
	}

	openSidebar = function(e){
		e.preventDefault();
		e.stopPropagation();

		if(Modernizr.csstransitions){
			s.html.addClass("sidebarIsOpen");
		} else {
			s.target.css("left","0");
		}

		s.toggleButton.bind('click', closeSidebar);
		$(window).bind('click', function(e){
				if( e && $(e.target).parent("[href^=mailto]").length < 1 ){
					e.preventDefault();
					closeSidebar();
				}
			}
		);
	}.bind(this)

	closeSidebar = function(e){

		if(Modernizr.csstransitions){
			s.html.addClass("sidebarIsOpen");
		} else {
			s.target.css("left","-17em");
		}

		s.html.removeClass("sidebarIsOpen");
		s.toggleButton.bind('click', openSidebar);	
	}.bind(this)

	init();
})
