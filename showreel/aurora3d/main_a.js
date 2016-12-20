/*

_a   circling rings in 3d space

*/

(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, context, width=680, height=500,
        Tau=Math.PI*2, PI180=Math.PI/180,
        halfHeight = height *.5,
        halfWidth = width *.5,
        systems=[],

        fps;

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

    /* REQUIRED - populationManager before particles */
    var ParticleSystem = function(id='pSys'){
        Object.defineProperty(this, 'id', { value:id, writable:true} );
        Object.defineProperty(this, 'width', { value:100, writable:true });
        Object.defineProperty(this, 'height', { value:100, writable:true });
        Object.defineProperty(this, 'friction', { value:.999, writable:true });
        Object.defineProperty(this, 'gravity', { value:.5, writable:true });
        Object.defineProperty(this, 'maxSpeed', { value:20, writable:true });
        Object.defineProperty(this, 'attractPts', { value:[], writable:true });
        Object.defineProperty(this, 'repelPts', { value:[], writable:true });
        Object.defineProperty(this, 'particles', { value:[], writable:true });
        Object.defineProperty(this, 'numParticles', { value:50, writable:true });
        Object.defineProperty(this, 'spreadX', { value:4, writable:true });
        Object.defineProperty(this, 'spreadY', { value:5, writable:true });
        Object.defineProperty(this, 'radius', { value:200, writable:true });
        Object.defineProperty(this, 'colour', { value:'rgba(255, 190, 21, 1)', writable:true });
        Object.defineProperty(this, 'fov', { value:-150, writable:true });
        Object.defineProperty(this, 'x', { value:0, writable:true });
        Object.defineProperty(this, 'y', { value:0, writable:true });
        Object.defineProperty(this, 'z', { value:0, writable:true });
        Object.defineProperty(this, 'depthOffset', { value:0, writable:true });
    }

    ParticleSystem.prototype.addAttractPt = function(value){
        this.attractPts.push(value);
    }
    ParticleSystem.prototype.addRepelPt = function(value){
        this.repelPts.push(value);
    }

    ParticleSystem.prototype.generate = function(fast=true){
        this.fastStart();
    }

    ParticleSystem.prototype.fastStart = function(){
        var theta = 0, radians,
        step = (360/(this.numParticles)*PI180),
        loop=this.numParticles,
        i,px,py,pz;

        for(i=0; i<=loop; i++){
            px = this.radius * Math.cos(theta);
            pz = this.radius * Math.sin(theta) + this.depthOffset;
            py = this.y;// + (Math.random()*60-30);
            theta += step;
            var p = new Particle("p", px, py, pz, this);
            p.step = step*.005;
            p.theta = theta;
            this.particles.push(p);
        }
    }

    ParticleSystem.prototype.update = function(){
        // Loop through all particles and update 
        var particle;
        for(var loop=this.particles.length, i=0; i<loop; i++){
            particle = this.particles[i];
            particle.update();
        }
    }

    var Particle = function(id, x, y, z, parentSystem){
        Object.defineProperty(this, 'width', { value:parentSystem.width, writable:true });
        Object.defineProperty(this, 'height', { value:parentSystem.height, writable:true });
        Object.defineProperty(this, 'radius', { value:1.5, writable:true });
        Object.defineProperty(this, 'id', { value:id, writable:true });
        Object.defineProperty(this, 'xOrigin', { value:x, writable:true });
        Object.defineProperty(this, 'yOrigin', { value:y, writable:true });
        Object.defineProperty(this, 'zOrigin', { value:x, writable:true });
        Object.defineProperty(this, 'x', { value:x, writable:true });
        Object.defineProperty(this, 'y', { value:y, writable:true });
        Object.defineProperty(this, 'z', { value:z, writable:true });
        Object.defineProperty(this, 'step', { value:0, writable:true });
        Object.defineProperty(this, 'theta', { value:0, writable:true });
        Object.defineProperty(this, 'parentSystem', { value:parentSystem, writable:true });
        return this;
    }

    Particle.prototype.update = function(){
        this.theta += this.step;
        this.x = this.parentSystem.radius * Math.cos(this.theta);
        this.z = this.parentSystem.radius * Math.sin(this.theta) + this.parentSystem.depthOffset;
    }

    function createCanvas(id, w, h){
        var tCanvas = document.createElement("canvas");
        tCanvas.width = w;
        tCanvas.height = h;
        tCanvas.id = id;
        return tCanvas;
    }

    function init()
    {
        wrapper = document.getElementById("wrapper");
        canvas =  createCanvas("canvas", width, height);
        wrapper.appendChild(canvas);
        context = canvas.getContext("2d");

        /* Define new ParticleSystems and set values */
        var system1 = new ParticleSystem('pSys1');
        systems.push(system1);
        system1.width = width;
        system1.height = height;
        system1.colour = "#0000ff";
        system1.numParticles = 100;
        system1.y = 200;
        system1.depthOffset = -120;
        system1.fov = -400;
        system1.generate();

        var system2 = new ParticleSystem('pSys2');
        systems.push(system2);
        system2.width = width;
        system2.height = height;
        system2.numParticles = 100;
        system2.colour = "#ff0000";
        system2.y = 40;
        system2.depthOffset = -90;
        system2.fov = -300;
        system2.generate();
    }

    function setupEvents(){
        window.onresize = resizeCanvas;
    }

    function resizeCanvas(){
        var rect = wrapper.getBoundingClientRect();
        width = window.innerWidth;
        height = window.innerHeight - rect.top -2;
        halfWidth = canvas.width * .5;
        halfHeight = canvas.height * .5;
        /*canvas.width = width;
        canvas.height = height;
        for(var i=0; i<systems.length; i++){
            systems[i].x = width * .5;
            systems[i].y = height * .5;
        }*/
    }

    function update()
    {
        for(var i=0; i<systems.length; i+=1){
            systems[i].update();
        }
    }

    function draw()
    {
        var system,
        particle, scale, i, j, x2d, y2d;

        for(var i=0; i<systems.length; i+=1){
            system = systems[i];
            context.fillStyle = system.colour;

            for(var loop=system.particles.length, j=0; j<loop; j+=1) {
                particle = system.particles[j];

                scale = system.fov/(system.fov+particle.z); 
                x2d = (particle.x * scale) + halfWidth; 
                y2d = (particle.y * scale) + halfHeight; 

                if(scale >= 0){
                    context.beginPath();
                    context.arc(x2d, y2d, particle.radius * scale, 0, Tau, false);
                    context.fill();
                }
            }

        }
    }

    function animate()
    {
        context.clearRect(0, 0, width, height);
        update();
        draw();
        requestAnimFrame(animate);
    }
    document.body.className = "";
    init();
    animate();
    // draw();

}());
