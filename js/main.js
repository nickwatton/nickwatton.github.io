$(function () {
    //"use strict";
	var jobPopWindow, thisWindow = $( window ), $alljobs = $('#allJobs'), $viewAll = $('#viewAll'), $menuAbout = $('#about'), $root = $('html,body'), jobs = [], filterLinks, jobHtml = '', thumbHtml, linksHtml, awardsHtml, i, j, heroLink, heroTitle;
    
    thisWindow.on('focus', handleFocus);

    filterLinks =  [...document.querySelectorAll('.workFilter')];
    for(let i = 0; i < filterLinks.length; i++){
		filterLinks[i].addEventListener('click', (evt) => { evt.preventDefault();  invalidateMenu(evt.target)});
	}

    function invalidateMenu(target){
        // console.log(target.dataSet.id)
        for(let i = 0; i < filterLinks.length; i++){
            if(filterLinks[i] === target){
                filterLinks[i].classList.add('active');
                buildFilteredJobs(Number(target.getAttribute('data-id')));
            }
            else {
                filterLinks[i].classList.remove('active');
            }
        }
    }
    
	function setJobItemListeners() {
        $('.job').fadeTo(0, 0);
        $('.thumb').load(function (e) {
            $(this).parent().animate({opacity:.5}, 1000);
        });
        $('.job').mouseenter(function (e) {$(this).animate({opacity:1}, 100);});
        $('.job').mouseleave(function (e) {$(this).animate({opacity:.5}, 250);});
        $('.job').on({'touchstart' : function(e){$(this).animate({opacity:1}, 100);} });
        $('.job').on({'touchend' : function(e){$(this).animate({opacity:.5}, 250);} });
		$('.viewFull').click(function (e) {
			createGalleryPage($(this).attr('data_id'));
        });
	}
	
	function walkLinksArray(data) {
		var arr = [], obj, i, j;
		for (j = 0; j < data.length; j += 1) {
			obj = {};
			for (i in data[j]) { obj[i] = data[j][i]; }
			arr.push(obj);
		}
		return arr;
	}
	
	function safeEncode(s) {
		// http://goo.gl/0oSwl in comments
		return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
	}
    
    function dataReady() { setJobItemListeners(); }
	
	function gatherData(filter) {
		var job = {};
		$.getJSON('data/osy.json', function () { /* handle below .success({...}) */ })
            .error(function (e) { $('#results').html("Error loading data: " + e.statusText); })
            .complete(function () { /*dataReady();*/ })
            .success(function (json) {
                for (i = 0; i < json.work.length; i += 1) {
                    job = {
                        agency:			safeEncode(json.work[i].agency),
                        awards:			json.work[i].awards !== undefined ? walkLinksArray(json.work[i].awards) : [],
                        client:			safeEncode(json.work[i].client),
                        copy1:			safeEncode(json.work[i].copy1),
                        copy2:			safeEncode(json.work[i].copy2),
                        dateStr:		safeEncode(json.work[i].date),         // For display
                        dateNum:		1000000 - Number(safeEncode(json.work[i].date)),  // For sorting
                        filter:			json.work[i].filter,
                        job:			safeEncode(json.work[i].job),
                        images:			json.work[i].images !== undefined ? walkLinksArray(json.work[i].images) : [],
                        links:			json.work[i].links !== undefined ? walkLinksArray(json.work[i].links) : [],
                        rank:			json.work[i].rank,
                        tech:			safeEncode(json.work[i].tech),
                        thumb:			safeEncode(json.work[i].thumb)
                    };
                    jobs.push(job);
                }
                buildFilteredJobs(filter);
            });
	}
    
    function buildFilteredJobs(filter) {
        // ADD WORK TO THE SYSTEM
		var allWorkHtml = '', showInList;
        for (i = 0; i < jobs.length; i += 1) 
        {
            showInList = false;
            for(j = 0; j < jobs[i].filter.length; j +=1) {
                if(jobs[i].filter[j] === filter)
                {
                    showInList = true;
                    break;
                }
            }
            if (showInList === true)
            {
                jobHtml = '';
                thumbHtml = '';
                thumbHtml = jobs[i].thumb === '' ? '' : '<img class="viewFull thumb" data_id="' + i + '" title="View full details" src="images/thumb/' + jobs[i].thumb + '">';
                jobHtml +=	'<div class="job">';
                jobHtml +=	'<div class="client">' + jobs[i].client + '</div>' +
                            '<div class="title">' + jobs[i].job + '</div>' +
                            '<div class="agency">@' + jobs[i].agency + '</div>' +
                            thumbHtml +
                            '<div class="viewFull" data_id=' + i + '>View full details</div>' +
                            '</div>';
                allWorkHtml += jobHtml;
            }
        }
        $alljobs.empty();
        $alljobs.html(allWorkHtml);
        
        setJobItemListeners();
    }
	
	function createGalleryPage(id) {
        
        jobHtml = '';
        linksHtml = '';
        heroLink = '';
        heroTitle = '';
        awardsHtml = '';
        
        jobHtml += "<head><meta name='viewport' content='width=device-width, initial-scale=1'><link href='http://fonts.googleapis.com/css?family=Oxygen:400,700' rel='stylesheet' type='text/css'><link href='css/styles.css' rel='stylesheet' type='text/css'><script src='js/jquery-1.10.2.min.js'></script><script type='text/javascript'>function closeMe(){window.close();}</script><!-- Google Analytics includes --><script type='text/javascript'>var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-31746588-1']);_gaq.push(['_trackPageview']);(function() {var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();</script></head>";
        
//        LINKS
        if(jobs[id].links.length > 0)
        {
            linksHtml = '<div class="detailsHead">Links:</div><div class="links"><ul>';
            for (j = 0; j < jobs[id].links.length; j += 1) {
                if (jobs[id].links[j].hero) { 
                    heroLink = jobs[id].links[j].url;
                    heroTitle = jobs[id].links[j].copy;
                }
                linksHtml += '<li><a href="' + jobs[id].links[j].url + '" target="_blank">' + jobs[id].links[j].copy + '</a></li>';
            }
            linksHtml += '</ul></div>';
        }
        
//        HERO LINK
        if (heroLink !== '') {
            thumbHtml = jobs[id].thumb === '' ? '' : '<a href="' + heroLink + '" target="_blank" title="' + heroTitle + '"><img data_id="' + id + '" class="thumb" src="images/thumb/' + jobs[id].thumb + '"></a>';
        } else {
            thumbHtml = jobs[id].thumb === '' ? '' : '<img data_id="' + id + '" class="thumb" src="images/thumb/' + jobs[id].thumb + '">';
        }
        
//        AWARDS
        if(jobs[id].awards.length > 0)
        {
            awardsHtml = '<div class="detailsHead">Awards:</div><div class="techDetails"><ul>';
            for (j = 0; j < jobs[id].awards.length; j += 1) {
                if(jobs[id].awards[j].url != '') {
                    awardsHtml += '<li><a href="' + jobs[id].awards[j].url + '" target="_blank">' + jobs[id].awards[j].copy + '</a></li>';
                } else {
                    awardsHtml += '<li>' + jobs[id].awards[j].copy + '</li>';
                }
            }
            awardsHtml += '</ul></div>';
        }
        
//        CREATE THE PAGE
        jobHtml +=	'<div id="jobDetails" class="jobPop">' + 
            '<div class="popClose"><a href="javascript:closeMe();" title="close">X</a></div>' +
            '<div class="client">' + jobs[id].client + '</div>' +
            '<div class="title">' + jobs[id].job + '</div>' +
            '<div class="agency">@' + jobs[id].agency + '</div>' +
            thumbHtml +
            '<div class="description">' + addBreaks(jobs[id].copy1) + '</div>' +
            '<div class="description">' + addBreaks(jobs[id].copy2) + '</div>' +
            '<div class="dateString">' + jobs[id].dateStr.substr(4,2) + '.' + jobs[id].dateStr.substr(0,4) + '</div>' +
            linksHtml +
            '<div class="detailsHead">Technical Details:</div>' +
            '<div class="techDetails">' + addBreaks(jobs[id].tech) + '</div>' +
            awardsHtml +
            '</div></div>';
        
//        OPEN & POPULATE PAGE
        jobPopWindow = window.open("", "jobPop");
        jobPopWindow.document.write(jobHtml);
        jobPopWindow.document.title = jobs[id].job;
	}
    
    function addBreaks(st) {
        return st.split('|').join('<br />');
    }
    
    function handleFocus(){
        if(jobPopWindow != null){
            jobPopWindow.closeMe();
        }
    }
    
    let section = 1, sectionTarget;
    if(window.location.hash) {
        let hsh = Number(window.location.hash.substr(1,1));
        const regex = /^([0-8])$/gm;
        if(regex.test(hsh)){
            section = hsh;
        }
        for(let i = 0; i < filterLinks.length; i++){
            if(Number(filterLinks[i].getAttribute('data-id')) === section){
                invalidateMenu(filterLinks[i])
            }
        }
    }
    gatherData(section);
	
});