/*

_c   Gradient colour
_b   Draw lines between points in two systems
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
        resolution = 200,
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
        Object.defineProperty(this, 'smooth', { value:true, writable:true });
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

        for(i=0; i<loop; i++){
            px = this.radius * Math.cos(theta);
            pz = this.radius * Math.sin(theta) + this.depthOffset;
            py = this.y + (this.smooth ? 0 : (Math.random()*10-5));
            theta += step;
            var p = new Particle("p", px, py, pz, this);
            p.step = step*.05;
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

        var gradient = context.createLinearGradient(150,0,500,0);
        gradient.addColorStop(.2,"rgba(0,173,0,.5)");
        gradient.addColorStop(.7,"rgba(173,0,0,.5)");
        gradient.addColorStop(.95,"rgba(0,0,173,.5)");

        // context.strokeStyle = "rgba(0,173,0,.5)";
        context.strokeStyle = gradient;
        context.lineWidth = 2;

        /* Define new ParticleSystems and set values */
        var system1 = new ParticleSystem('pSys1');
        systems.push(system1);
        system1.width = width;
        system1.height = height;
        system1.numParticles = resolution;
        system1.radius = 150;
        system1.y = 200;
        system1.depthOffset = -130;
        system1.fov = -400;
        system1.generate();

        var system2 = new ParticleSystem('pSys2');
        systems.push(system2);
        system2.width = width;
        system2.height = height;
        system2.numParticles = resolution;
        system2.smooth = false;
        system2.radius = 152;
        system2.y = 130;
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
        var system1 = systems[0], system2 = systems[1],
        particle1, particle2, 
        scale1, scale2,
        x2d_1, y2d_1,
        x2d_2, y2d_2,
        i, j;

        for(var loop=system1.particles.length, j=0; j<loop; j+=1) {
            particle1 = system1.particles[j];
            particle2 = system2.particles[j];

            scale1 = system1.fov/(system1.fov+particle1.z);
            scale2 = system2.fov/(system2.fov+particle2.z);

            x2d_1 = (particle1.x * scale1) + halfWidth; 
            y2d_1 = (particle1.y * scale1) + halfHeight; 

            x2d_2 = (particle2.x * scale2) + halfWidth; 
            y2d_2 = (particle2.y * scale2) + halfHeight;

            if(scale1 >= 0){
                context.beginPath();
                context.moveTo(x2d_1, y2d_1);
                context.lineTo(x2d_2, y2d_2);
                context.stroke();
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
    init();
    animate();

}());