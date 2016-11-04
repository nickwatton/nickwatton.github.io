(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, context, width, height, 
    starCanvas, starContext,
    dancingPlanet1,dancingPlanet2,
    speedFactor = 200,
    orbitalScalingFactor=0.000002,
    Tau=Math.PI*2, PI180=Math.PI/180,
    systems=[];

    var optionList = [  {value: "3,2,0.000002,200",  text:"Earth & Venus"},
                        {value: "3,1,0.000002,200",  text:"Earth & Mercury"},
                        {value: "3,4,0.0000015,250",  text:"Earth & Mars"},
                        {value: "3,5,0.0000005,1000",  text:"Earth & Jupiter"},
                        {value: "5,6,0.0000004,2000",  text:"Jupiter & Saturn"}],
    currentSelectValue = [2,3,0.000002,200],
    dancingPlanet1 = currentSelectValue[0], 
    dancingPlanet2 = currentSelectValue[1], 
    orbitalScalingFactor = currentSelectValue[2],
    speedFactor = currentSelectValue[3];

    function createList(){
        var myDiv = document.getElementById("selectList"),
        selectList = document.createElement("select");
        selectList.id = "mySelect";
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
        currentSelectValue = evt.target.value.split(",");
        dancingPlanet1 = currentSelectValue[0];
        dancingPlanet2 = currentSelectValue[1];
        orbitalScalingFactor=currentSelectValue[2];
        speedFactor = currentSelectValue[3];

        // setorbitalRadius
        var system = systems[0];
        var planetaryBody;
        for(var loop=system.numBodies, j=0; j<loop; j+=1) {
            system.allBodies[j].setorbitalRadius();
            system.allBodies[j].setSpeedFactor(speedFactor);
        }

        clearStarCanvas();
        // console.log(currentSelectValue,dancingPlanet1,dancingPlanet2,orbitalScalingFactor);
    }

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

    var PlanetarySystem = function(id='pSys'){
        Object.defineProperty(this, 'id',               { value:id, writable:true} );
        Object.defineProperty(this, 'x',                { value:0, writable:true });
        Object.defineProperty(this, 'y',                { value:0, writable:true });
        Object.defineProperty(this, 'allBodies',        { value:[], writable:true });
        Object.defineProperty(this, 'allBodiesLookup',  { value:{}, writable:true });    // fast id lookup for children
        Object.defineProperty(this, 'numBodies',        { value:0, writable:true });
    }

    PlanetarySystem.prototype.addBody = function(vo) {
        vo.parentSystem = this;
        vo.parentBody = vo.parentBody === null ? this : this.allBodiesLookup[vo.parentBody];
        var body = new PlanetaryBody(vo);
        body.update();
        this.allBodies.push(body);
        this.allBodiesLookup[vo.id] = body;
        this.numBodies += 1;
    }

    PlanetarySystem.prototype.setSpeedFactor = function(value){
        var body;
        for(var i=0; i<this.numBodies; i++){
            body = this.allBodies[i];
            body.setSpeedFactor(value);
        }
    }

    PlanetarySystem.prototype.update = function(){
        var body;
        for(var i=0; i<this.numBodies; i++){
            body = this.allBodies[i];
            body.update();
        }
    }

    var PlanetaryBody = function(vo){
        Object.defineProperty(this, 'id',               { value:vo.id, writable:true} );
        Object.defineProperty(this, 'diameter',         { value:vo.diameter, writable:true });
        Object.defineProperty(this, 'colour',           { value:vo.colour, writable:true });
        Object.defineProperty(this, 'x',                { value:0, writable:true });
        Object.defineProperty(this, 'y',                { value:0, writable:true });
        Object.defineProperty(this, 'vx',               { value:0, writable:true });
        Object.defineProperty(this, 'vy',               { value:0, writable:true });
        Object.defineProperty(this, 'degrees',          { value:vo.degrees, writable:true });
        Object.defineProperty(this, 'speedBase',        { value:vo.speed, writable:true });
        Object.defineProperty(this, 'speedFactor',      { value:0, writable:true });
        Object.defineProperty(this, 'speed',            { value:0 , writable:true });
        Object.defineProperty(this, 'orbitalRadiusBase',{ value:vo.orbitalRadius, writable:true });
        Object.defineProperty(this, 'orbitalRadius',    { value:vo.orbitalRadius, writable:true });
        Object.defineProperty(this, 'parentSystem',     { value:vo.parentSystem, writable:true });
        Object.defineProperty(this, 'parentBody',       { value:vo.parentBody, writable:true });
        Object.defineProperty(this, 'isRing',           { value:false, writable:true });
        Object.defineProperty(this, 'ringWidth',        { value:0, writable:true });
        this.setSpeedFactor(speedFactor);
        this.orbitalRadius = vo.orbitalRadius * orbitalScalingFactor;
        if(vo.isRing){
            this.isRing = vo.isRing;
            this.ringWidth = vo.ringWidth;
        }
        return this;
    }

    PlanetaryBody.prototype.setorbitalRadius = function(){
        console.log(this.id, this.orbitalRadius);
        this.orbitalRadius = this.orbitalRadiusBase * orbitalScalingFactor;
        console.log(this.id, this.orbitalRadius);
    }

    PlanetaryBody.prototype.setSpeedFactor = function(value){
        this.speedFactor = value;
        this.speed = this.speedFactor / this.speedBase;
    }

    PlanetaryBody.prototype.update = function(){
        var angle = this.degrees * PI180;
        this.degrees += this.speed;
        this.vx = this.orbitalRadius * Math.cos(angle);
        this.vy = this.orbitalRadius * Math.sin(angle);
        // update position
        if(this.parentBody != null){
            this.x = this.vx + this.parentBody.x;
            this.y = this.vy + this.parentBody.y;
        }
    }

    function createCanvas(id, w, h){
        var tCanvas = document.createElement("canvas");
        tCanvas.width = w;
        tCanvas.height = h;
        tCanvas.id = id;
        return tCanvas;
    }

    function init(){
        wrapper = document.getElementById("wrapper");
        starCanvas = createCanvas("starCanvas", width, height);
        document.getElementById("stars").appendChild(starCanvas);
        starContext = starCanvas.getContext("2d");

        canvas = createCanvas("canvas", width, height);
        wrapper.appendChild(canvas);
        context = canvas.getContext("2d");

        createList();

        setupEvents();
        resizeCanvas();

        /* Define new PlanetarySystem and set values */
        var system1 = new PlanetarySystem('pSys1');
        systems.push(system1);
        system1.x = width * .5;
        system1.y = height * .5;

        // system1.addBody({id:'sun',      diameter:10,     degrees:0,    speed:1,        colour:'#FDFE1D',   orbitalRadius:0,          parentBody:null});
        system1.addBody({id:'sun',      diameter:10,    degrees:0,      speed:1,        colour:'#241c04',   orbitalRadius:0,          parentBody:null});
        system1.addBody({id:'mercury',  diameter:5,     degrees:270,    speed:88,       colour:'#dddddd',   orbitalRadius:57950000,  parentBody:'sun'});
        system1.addBody({id:'venus',    diameter:2,     degrees:270,    speed:225,      colour:'#F6C866',   orbitalRadius:108110000,  parentBody:'sun'});
        system1.addBody({id:'earth',    diameter:2,     degrees:270,    speed:365,      colour:'#88B2E9',   orbitalRadius:149570000,  parentBody:'sun'});
        system1.addBody({id:'mars',     diameter:3,     degrees:270,    speed:687,      colour:'#D95E23',   orbitalRadius:227840000,   parentBody:'sun'});
        system1.addBody({id:'jupiter',  diameter:40,    degrees:270,    speed:4343.5,   colour:'#FCE6C1',   orbitalRadius:778140000,   parentBody:'sun'});
        system1.addBody({id:'saturn',   diameter:30,    degrees:270,    speed:10767.5,  colour:'#FBEFA2',   orbitalRadius:342700000,   parentBody:'sun'});
    }

    function setupEvents(){
        window.onresize = resizeCanvas;
    }

    function resizeCanvas(){
        var rect = wrapper.getBoundingClientRect();
        width = window.innerWidth;
        height = window.innerHeight - rect.top -2;
        canvas.width = starCanvas.width = width;
        canvas.height = starCanvas.height = height;
        for(var i=0; i<systems.length; i++){
            systems[i].x = width * .5;
            systems[i].y = height * .5;
        }

        starContext.fillStyle = '#000000';
        starContext.strokeStyle = '#fff';
        starContext.lineWidth = .05;
        clearStarCanvas();
    }

    function clearStarCanvas(){
        starContext.rect(0,0,width,height);
        starContext.fill();
    }

    function update(){
        for(var loop=systems.length, i=0; i<loop; i++){
            systems[i].update();
        }
    }

    function drawconnections(){
        starContext.beginPath();
        starContext.moveTo(systems[0].allBodies[dancingPlanet1].x, systems[0].allBodies[dancingPlanet1].y);
        starContext.lineTo(systems[0].allBodies[dancingPlanet2].x, systems[0].allBodies[dancingPlanet2].y);
        starContext.stroke();
    }

    function draw(){
        context.save();
        var system;
        for(var i=0; i<systems.length; i++){
            system = systems[i];
            var planetaryBody;
            for(var loop=system.numBodies, j=0; j<loop; j+=1) {
                planetaryBody = system.allBodies[j];
                context.beginPath();
                context.arc(planetaryBody.x, planetaryBody.y, planetaryBody.diameter, 0, Tau, false);
                if(planetaryBody.isRing){
                    context.strokeStyle = planetaryBody.colour;
                    context.lineWidth = planetaryBody.ringWidth;
                    context.stroke();
                }
                else{
                    context.fillStyle = planetaryBody.colour;
                    context.fill();
                }
                
            }
        }
        context.restore();
    }

    var daysCount=0;
    function animate(){
        context.clearRect(0, 0, width, height);
        update();
        // draw();
        drawconnections();
        requestAnimFrame(animate);
    }
    init();
    animate();
}());