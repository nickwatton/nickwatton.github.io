(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, context, width, height, 
    starCanvas, starContext,
    Tau=Math.PI*2, PI180=Math.PI/180,
    systems=[];

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
        Object.defineProperty(this, 'orbitalRadius',    { value:vo.orbitalRadius, writable:true });
        Object.defineProperty(this, 'parentSystem',     { value:vo.parentSystem, writable:true });
        Object.defineProperty(this, 'parentBody',       { value:vo.parentBody, writable:true });
        Object.defineProperty(this, 'isRing',           { value:false, writable:true });
        Object.defineProperty(this, 'ringWidth',        { value:0, writable:true });
        this.setSpeedFactor(1);
        this.orbitalRadius = vo.orbitalRadius * 0.0000006;
        if(vo.isRing){
            this.isRing = vo.isRing;
            this.ringWidth = vo.ringWidth;
        }
        return this;
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

        setupEvents();
        resizeCanvas();

        /* Define new PlanetarySystem and set values */
        var system1 = new PlanetarySystem('pSys1');
        systems.push(system1);
        system1.x = width * .5;
        system1.y = height * .5;

        system1.addBody({id:'sun',      diameter:5,     degrees:0,      speed:1,        colour:'#FDFE1D',   orbitalRadius:0,    parentBody:null});

        system1.addBody({id:'mercury',  diameter:5,     degrees:120,      speed:88,       colour:'#dddddd',   orbitalRadius:57950000,  parentBody:'sun'});

        system1.addBody({id:'venus',    diameter:6,     degrees:180,      speed:225,      colour:'#F6C866',   orbitalRadius:108110000,  parentBody:'sun'});

        system1.addBody({id:'earth',    diameter:7,     degrees:-10,    speed:365,      colour:'#88B2E9',   orbitalRadius:149570000,  parentBody:'sun'});
        system1.addBody({id:'moon',     diameter:2,     degrees:0,     speed:28,       colour:'#FFFFFF',   orbitalRadius:384403*50,   parentBody:'earth'});

        system1.addBody({id:'mars',     diameter:3,     degrees:190,    speed:687,      colour:'#D95E23',   orbitalRadius:227840000,   parentBody:'sun'});
        system1.addBody({id:'phobos',   diameter:1,     degrees:0,      speed:.4,       colour:'#D95E23',   orbitalRadius:9408*1000,   parentBody:'mars'});
        system1.addBody({id:'deimos',   diameter:1,     degrees:0,      speed:1.3,      colour:'#D95E23',   orbitalRadius:23457*650,   parentBody:'mars'});

        system1.addBody({id:'jupiter',  diameter:40,    degrees:180,    speed:4343.5,   colour:'#FCE6C1',   orbitalRadius:778140000,   parentBody:'sun'});
        system1.addBody({id:'io',       diameter:2,     degrees:158,     speed:1.8,      colour:'#FCE6C1',   orbitalRadius:421700*200,   parentBody:'jupiter'});
        system1.addBody({id:'europa',   diameter:2,     degrees:66,     speed:3.5,      colour:'#FCE6C1',   orbitalRadius:671034*150,   parentBody:'jupiter'});
        system1.addBody({id:'ganymede', diameter:3,     degrees:2,     speed:7.2,      colour:'#FCE6C1',   orbitalRadius:1070412*130,   parentBody:'jupiter'});
        system1.addBody({id:'callisto', diameter:2.5,   degrees:251,     speed:16.7,     colour:'#FCE6C1',   orbitalRadius:1880000*90,   parentBody:'jupiter'});

        system1.addBody({id:'saturn',   diameter:30,    degrees:170,    speed:10767.5,  colour:'#FBEFA2',   orbitalRadius:342700000,   parentBody:'sun'});
        system1.addBody({id:'Tethys',   diameter:1,     degrees:0,    speed:2,        colour:'#FBEFA2',   orbitalRadius:295000*237,   parentBody:'saturn'});
        system1.addBody({id:'Dione',    diameter:1,     degrees:55,    speed:2.7,      colour:'#FBEFA2',   orbitalRadius:377000*215,   parentBody:'saturn'});
        system1.addBody({id:'Rhea',     diameter:1.5,   degrees:164,    speed:4.5,      colour:'#FBEFA2',   orbitalRadius:527000*200,   parentBody:'saturn'});
        system1.addBody({id:'Titan',    diameter:2.2,   degrees:260,    speed:16,       colour:'#FBEFA2',   orbitalRadius:1221860*110,   parentBody:'saturn'});
        system1.addBody({id:'Iapetus',  diameter:1,     degrees:12,    speed:79,       colour:'#FBEFA2',   orbitalRadius:3560000*45,   parentBody:'saturn'});
        system1.addBody({id:'ring1',    diameter:32.5,    degrees:1,      speed:1,        colour:'rgba(255,255,255,.3)',   orbitalRadius:0,   parentBody:'saturn', isRing:true, ringWidth:3});
        system1.addBody({id:'ring2',    diameter:35.7,    degrees:1,      speed:1,        colour:'rgba(255,255,255,.5)',   orbitalRadius:0,   parentBody:'saturn', isRing:true, ringWidth:4});
        system1.addBody({id:'ring3',    diameter:40,    degrees:1,      speed:1,        colour:'rgba(255,255,255,.3)',   orbitalRadius:0,   parentBody:'saturn', isRing:true, ringWidth:3});
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

        drawStars();
    }

    function update(){
        for(var loop=systems.length, i=0; i<loop; i++){
            systems[i].update();
        }
    }

    function drawStars(){
        var numStars = 500, sX, sY, sM, sC, rC,
        starColours=['#777777', '#2C55B5', '#8D0202'];
        starContext.fillStyle = '#000000';
        starContext.rect(0,0,width,height);
        starContext.fill();

        for(var i=0; i<numStars; i+=1){
            sX = Math.random()*width;
            sY = Math.random()*height;
            sM = Math.random()*.2 + .5;

            rC = Math.random()*100;
            if(rC < 70){
                sC = 0;
            }else if(rC < 90){
                sC = 1;
            }else{
                sC = 2;
            }

            starContext.beginPath();
            starContext.arc(sX, sY, sM, 0, Tau, false);
            starContext.fillStyle = starColours[sC];
            starContext.fill();
        }
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

    function animate(){
        context.clearRect(0, 0, width, height);
        update();
        draw();
        
        if(!testSlow){
            requestAnimFrame(animate);
        }
    }
    init();
    
    var testSlow = false;
    if(testSlow){
        var w = setInterval(function(){
            animate();
        },(1000/30));
    }
    else{
        animate();
    }
}());