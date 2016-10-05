/*

*/

(function(){
    'use strict';

    var canvasDiv=document.getElementById("wrapper"),
    optionList = [  {value: "main.js",      text:"More sculpting control"},
                    {value: "main_b.js",    text:"Tweening used to sculpt the flame"},
                    {value: "main_a.js",    text:"First run. Grows linear sided flame."}],
    currentValue = optionList[0].value,
    headingCopy="Explore development phases:",
    warningCopy="Warning - old scripts still run after switching - performance will probably suffer!";

    function init(){
        createList();
    }

    function createList(){
        var myDiv = document.getElementById("selectList"),
        selectList = document.createElement("select"),
        selectH3 = document.createElement("h3"),
        warning = document.createElement("p");
        selectH3.innerHTML = headingCopy;
        warning.innerHTML = warningCopy;
        selectList.id = "mySelect";
        myDiv.appendChild(selectH3);
        myDiv.appendChild(warning);
        myDiv.appendChild(selectList);
        for (var i = 0; i < optionList.length; i++) {
            var option = document.createElement("option");
            option.value =optionList[i].value;
            option.text = optionList[i].text;
            selectList.appendChild(option);
        }
        selectList.addEventListener('change', handleSelect);
    }

    function handleSelect(evt){
        removeOldCanvas();
        replacejscssfile(currentValue, evt.target.value, "js");
        currentValue = evt.target.value;
    }

    function removeOldCanvas(){
        canvasDiv.innerHTML  = "";
    }


    function createjscssfile(filename, filetype){
        if (filetype=="js"){ //if filename is a external JavaScript file
            var fileref=document.createElement('script')
            fileref.setAttribute("type","text/javascript")
            fileref.setAttribute("src", filename)
        }
        else if (filetype=="css"){ //if filename is an external CSS file
            var fileref=document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", filename)
        }
        return fileref;
    }
     
    function replacejscssfile(oldfilename, newfilename, filetype){
        var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; //determine element type to create nodelist using
        var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; //determine corresponding attribute to test for
        var allsuspects=document.getElementsByTagName(targetelement);
        for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
                var newelement=createjscssfile(newfilename, filetype);
                allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
            }
        }
    }

    init();

}());