(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, context, width=680, height=500, Tau=Math.PI*2,
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
        Object.defineProperty(this, 'colour', { value:'rgba(255, 190, 21, 1)', writable:true });
        Object.defineProperty(this, 'x', { value:0, writable:true });
        Object.defineProperty(this, 'y', { value:0, writable:true });
    }

    ParticleSystem.prototype.addAttractPt = function(value){
        this.attractPts.push(value);
    }
    ParticleSystem.prototype.addRepelPt = function(value){
        this.repelPts.push(value);
    }

    ParticleSystem.prototype.generate = function(){
        var that = this;
        var slowBuild = setInterval( function(){
            var p = new Particle("p", (that.width*.5)+that.x, that.height + that.y, that);
            p.yOrigin = p.height - 163 - (Math.random()*20 - 10);
            p.xOrigin = p.xOrigin + (Math.random()*40 - 20);
            p.radius = Math.random() * 3 + 2;
            that.particles.push(p);
            if(that.particles.length === that.numParticles){
                clearTimeout(slowBuild);
            }
        }, 20 );
    }

    ParticleSystem.prototype.update = function(){
        // Loop through all particles and update 
        var particle;
        for(var loop=this.particles.length, i=0; i<loop; i++){
            particle = this.particles[i];
           
            particle.update();
        }
    }

    var Particle = function(id, x, y, parentSystem){
        Object.defineProperty(this, 'width', { value:parentSystem.width, writable:true });
        Object.defineProperty(this, 'height', { value:parentSystem.height, writable:true });
        Object.defineProperty(this, 'radius', { value:3, writable:true });
        Object.defineProperty(this, 'id', { value:id, writable:true });
        Object.defineProperty(this, 'xOrigin', { value:x, writable:true });
        Object.defineProperty(this, 'yOrigin', { value:y, writable:true });
        Object.defineProperty(this, 'x', { value:x, writable:true });
        Object.defineProperty(this, 'y', { value:y, writable:true });
        Object.defineProperty(this, 'vx', { value:this.genVX(), writable:true });
        Object.defineProperty(this, 'vy', { value:this.genVY(), writable:true });
        Object.defineProperty(this, 'parentSystem', { value:parentSystem, writable:true });
        Object.defineProperty(this, 'spreadX', { value:this.parentSystem.spreadX, writable:true });
        Object.defineProperty(this, 'spreadY', { value:this.parentSystem.spreadY, writable:true });
        return this;
    }

    Particle.prototype.update = function(){
        // Attract
        for(var loop=this.parentSystem.attractPts.length, i=0; i<loop; i++){
            var attractPt = this.parentSystem.attractPts[i],
            dx = attractPt.x - this.x,
            dy = attractPt.y - this.y,
            distSQ = dx*dx + dy*dy,
            dist = Math.sqrt(distSQ),
            force = attractPt.force / distSQ;
            this.vx += force * dx / dist;
            this.vy += force * dy / dist;
        }

        // Repel
        for(var loop=this.parentSystem.repelPts.length, i=0; i<loop; i++){
            var repelPt = this.parentSystem.repelPts[i],
            dx = repelPt.x - this.x,
            dy = repelPt.y - this.y,
            distSQ = dx*dx + dy*dy,
            dist = Math.sqrt(distSQ);
            if (dist < repelPt.minDist) {
                var tx = repelPt.x - repelPt.minDist * dx / dist,
                ty = repelPt.y - repelPt.minDist * dy / dist;
                this.vx += (tx - this.x) * repelPt.force;
                this.vy += (ty - this.y) * repelPt.force;
            }
        }

        // apply gavity and friction
        this.vy += this.parentSystem.gravity;
        this.vx *= this.parentSystem.friction;
        this.vy *= this.parentSystem.friction;

        // constrain to speed bounds
        var speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        if (speed > this.parentSystem.maxSpeed) {
            this.vx = this.parentSystem.maxSpeed * this.vx / speed;
            this.vy = this.parentSystem.maxSpeed * this.vy / speed;
        }

        // update position
        this.x += this.vx;
        this.y += this.vy;

        // constrain to xy bounds
        if(this.x>this.parentSystem.x + this.parentSystem.width || this.x < this.parentSystem.x){ this.recycle; }
        if(this.y>this.parentSystem.y + this.parentSystem.height){ this.recycle(); }
    }

    Particle.prototype.genVX = function(){
        return Math.random()*this.spreadX - (this.spreadX*.5);
    }
    Particle.prototype.genVY = function(){
        return (Math.random()*5 + 10)*-1;
    }

    Particle.prototype.recycle = function(){
        this.x = this.xOrigin;
        this.y = this.yOrigin;

        this.vx = this.genVX();
        this.vy = this.genVY();
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

        /* Define new ParticleSystem and set values */
        var system1 = new ParticleSystem('pSys1');
        systems.push(system1);

        system1.width = width;
        system1.height = height;
        system1.numParticles = 100;
        system1.spreadX = 4;
        system1.generate();

        var system2 = new ParticleSystem('pSys2');
        systems.push(system2);
        system2.width = width;
        system2.height = height;
        system2.numParticles = 80;
        system2.colour = '#dd3333';
        system2.maxSpeed = 12;
        system2.spreadX = 8;
        system2.generate();

        var system3 = new ParticleSystem('pSys2');
        systems.push(system3);
        system3.width = width;
        system3.height = height;
        system3.numParticles = 50;
        system3.colour = '#DB6E00';
        system3.maxSpeed = 10;
        system3.spreadX = 20;
        system3.generate();

        var system4 = new ParticleSystem('pSys2');
        systems.push(system4);
        system4.width = width;
        system4.height = height;
        system4.numParticles = 3;
        system4.colour = '#333333';
        system4.maxSpeed = 20;
        system4.spreadX = 20;
        system4.generate();

        fps = new realUtils.FPS();
    }

    function update()
    {
        for(var i=0; i<systems.length; i++){
            systems[i].update();
        }
        fps.update();
    }

    function draw()
    {
        context.save();
        var system;
        for(var i=0; i<systems.length; i++){
            system = systems[i];
            context.fillStyle = system.colour;
            for(var particle, loop=system.particles.length, j=0; j<loop; j+=1) {
                particle = system.particles[j];
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Tau, false);
                context.fill();
            }
        }
        context.restore();
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