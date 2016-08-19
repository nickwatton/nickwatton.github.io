(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, context, width=680, height=500, Tau=Math.PI*2,
        systems=[],

        drawAttractRepel=false;

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
        Object.defineProperty(this, 'populationManager', {writable:true} );
        Object.defineProperty(this, 'width', { value:100, writable:true });
        Object.defineProperty(this, 'height', { value:100, writable:true });
        Object.defineProperty(this, 'friction', { value:.9, writable:true });
        Object.defineProperty(this, 'gravity', { value:0, writable:true });
        Object.defineProperty(this, 'maxSpeed', { value:10, writable:true });
        Object.defineProperty(this, 'wander', { value:.7, writable:true });
        Object.defineProperty(this, 'wanderMod', { value:this.wander*.5, writable:true });
        Object.defineProperty(this, 'gridSize', { value:10, writable:true });
        Object.defineProperty(this, 'attractPts', { value:[], writable:true });
        Object.defineProperty(this, 'repelPts', { value:[], writable:true });
        Object.defineProperty(this, 'particles', { value:[], writable:true });
        Object.defineProperty(this, 'numParticles', { value:50, writable:true });
        Object.defineProperty(this, 'scalar', { value:1, writable:true });
        Object.defineProperty(this, 'colour', { value:'rgba(255, 190, 21, .6)', writable:true });
        Object.defineProperty(this, 'x', { value:0, writable:true });
        Object.defineProperty(this, 'y', { value:0, writable:true });
    }
    ParticleSystem.prototype.setWidth = function(value){ this.width = value; }
    ParticleSystem.prototype.setHeight = function(value){ this.height = value; }
    ParticleSystem.prototype.setFriction = function(value){ this.friction = value; }
    ParticleSystem.prototype.setGravity = function(value){ this.gravity = value; }
    ParticleSystem.prototype.setMaxSpeed = function(value){ this.maxSpeed = value; }
    ParticleSystem.prototype.setWander = function(value){ this.wander = value; this.wanderMod = value*.5 }
    ParticleSystem.prototype.setHeight = function(value){ this.height = value; }
    ParticleSystem.prototype.setColour = function(value){ this.colour = value; }
    ParticleSystem.prototype.setNumParticles = function(value){ this.numParticles = value; }
    ParticleSystem.prototype.setGridSize = function(value){ this.gridSize = value; }

    ParticleSystem.prototype.setPopulationManager = function(value){
        this.populationManager = value;
        this.populationManager.parentSystem = this;
        this.populationManager.width = this.width;
        this.populationManager.height = this.height;
        this.populationManager.setGridSize(this.gridSize);
    }

    ParticleSystem.prototype.addAttractPt = function(value){
        this.attractPts.push(value);
    }
    ParticleSystem.prototype.addRepelPt = function(value){
        this.repelPts.push(value);
    }

    ParticleSystem.prototype.generate = function(){
        for(var i=0; i<this.numParticles; i++){
            var p = new Particle("p"+i, Math.ceil(Math.random()*this.width) + this.x, Math.ceil(Math.random()*this.height) + this.y, this);
            this.particles.push(p);
        }
        this.populationManager.refresh();
    }

    ParticleSystem.prototype.update = function(){
        // Loop through all particles and update 
        var particle;
        for(var i=0; i<this.numParticles; i++){
            particle = this.particles[i];
            this.populationManager.setPopulationDensity(particle);
            particle.pUpdate();
        }
        this.populationManager.refresh();
    }

    var PopulationDensityManager = function(){
        Object.defineProperty(this, 'gridSize', { value:10, writable:true });
        Object.defineProperty(this, 'numCells', { value:this.gridSize*this.gridSize , writable:true });
        Object.defineProperty(this, 'populationLookup', { value:[], writable:true });                             // REFACTOR TO populationLookup
        Object.defineProperty(this, 'xLookup', { value:[], writable:true });
        Object.defineProperty(this, 'yLookup', { value:[], writable:true });
        Object.defineProperty(this, 'width', { value:100, writable:true });
        Object.defineProperty(this, 'height', { value:100, writable:true });
        Object.defineProperty(this, 'parentSystem', { value:null, writable:true });
    }

    PopulationDensityManager.prototype.setGridSize = function(value){ 
        this.gridSize = value;
        this.numCells = value * value;
        this.initalisePopulationLookup();
        this.buildCoordinateLookup();
    }

    /* set initial poulation for each cell */
    PopulationDensityManager.prototype.initalisePopulationLookup = function(){
        for(var i=0; i<this.numCells; i++){
            this.populationLookup[i] = 0;
        }
    }

    /* populate lookup tables - pixel position mapped to grid cell */
    PopulationDensityManager.prototype.buildCoordinateLookup = function(){
        var cellW = Math.round(this.width / this.gridSize),
        cellH = Math.round(this.height / this.gridSize),
        loopEnd;
        for(var loopStart=0, i=0; i<this.gridSize; i++){
            loopEnd = loopStart + cellW;
            for(var j=loopStart; j<loopEnd; j++){
                this.xLookup[j] = i;
            }
            loopStart += cellW;
        }
        for(var loopStart=0, i=0; i<this.gridSize; i++){
            loopEnd = loopStart + cellH;
            for(var j=loopStart; j<loopEnd; j++){
                this.yLookup[j] = i;
            }
            loopStart += cellH;
        }
    }

    /* Creates a linear lookup array */
    PopulationDensityManager.prototype.setPopulationDensity = function(obj){
        var populationCount = this.populationLookup[obj.cellID];
        obj.densityScore = populationCount;
    }

    /** Updates populations of each grid cell:
        If a particle has moved to new cell, adjust old and new cell counts 
    */
    PopulationDensityManager.prototype.refresh = function(){
        var particle, cellID;
        for(var loop=this.parentSystem.particles.length, i=0; i<loop; i++){
            particle = this.parentSystem.particles[i];
            cellID = this.getGridCell(particle.x, particle.y);
            if(cellID != particle.cellID){
                this.populationLookup[particle.cellID] -= 1;
                this.populationLookup[cellID] += 1;
                particle.cellID = cellID;
            }
        }
    }

    PopulationDensityManager.prototype.getGridCell = function(x, y){
        return this.getGridCellX(x) + (this.getGridCellY(y) * this.gridSize);
    }

    PopulationDensityManager.prototype.getGridCellX = function(x){
        return this.xLookup[Math.ceil(x)];
    }

    PopulationDensityManager.prototype.getGridCellY = function(y){
        return this.yLookup[Math.ceil(y)];
    }

    var Particle = function(id, x, y, parentSystem){
        Object.defineProperty(this, 'width', { value:parentSystem.width, writable:true });
        Object.defineProperty(this, 'height', { value:parentSystem.height, writable:true });
        Object.defineProperty(this, 'id', { value:id, writable:true });
        Object.defineProperty(this, 'cellID', { value:parentSystem.populationManager.getGridCell(x, y), writable:true });
        Object.defineProperty(this, 'x', { value:x, writable:true });
        Object.defineProperty(this, 'y', { value:y, writable:true });
        Object.defineProperty(this, 'vx', { value:Math.random()*2 - 1, writable:true });
        Object.defineProperty(this, 'vy', { value:Math.random()*2 - 1, writable:true });
        Object.defineProperty(this, 'densityScore', { value:1, writable:true });
        Object.defineProperty(this, 'parentSystem', { value:parentSystem, writable:true });
        return this;
    }

    Particle.prototype.pUpdate = function(){
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
        
        // randomise movement slightly
        this.vx += Math.random() * this.parentSystem.wander - this.parentSystem.wanderMod;
        this.vy += Math.random() * this.parentSystem.wander - this.parentSystem.wanderMod;

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
        if(this.x>this.parentSystem.x + this.parentSystem.width || this.x < this.parentSystem.x){ this.vx *= -1; }
        if(this.y>this.parentSystem.y + this.parentSystem.height || this.y < this.parentSystem.y){ this.vy *= -1; }
    }


    function get(id) {
        return document.getElementById(id);
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
        wrapper = get("wrapper");
        canvas =  createCanvas("canvas", width, height);
        wrapper.appendChild(canvas);
        context = canvas.getContext("2d");

        /* Define new ParticleSystem and set values */
        var system1 = new ParticleSystem('pSys1');
        systems.push(system1);

        system1.setWidth(580);
        system1.setHeight(300);
        system1.setMaxSpeed(3);
        system1.scalar = .3;
        system1.setGridSize(20);
        system1.x = 170;
        system1.y = 50;
        system1.setNumParticles(100);

        /* Dedfine new PopulationManager, assign to ParticleSystem which passes relevant properties / triggers set-up */
        var populationManager1 = new PopulationDensityManager();
        system1.setPopulationManager(populationManager1);

        system1.attractPts.push({x:420, y:90, force:100});
        system1.repelPts.push({x:420, y:90, force:4, minDist:20});
        system1.attractPts.push({x:300, y:190, force:100});
        system1.repelPts.push({x:300, y:190, force:4, minDist:20});
        system1.attractPts.push({x:500, y:210, force:100});
        system1.repelPts.push({x:500, y:210, force:4, minDist:20});

        system1.setNumParticles(50);
        system1.generate();

        var system2 = new ParticleSystem('pSys2');
        systems.push(system2);
        system2.setWidth(width);
        system2.setHeight(height);
        system2.scalar = .1;
        system2.colour = '#ff0000';
        system2.setGridSize(20);
        var populationManager2 = new PopulationDensityManager();
        system2.setPopulationManager(populationManager2);
        system2.setNumParticles(200);
        system2.generate();
    }

    function update()
    {
        for(var i=0; i<systems.length; i++){
            systems[i].update();
        }
    }

    function draw()
    {
        context.save();
        var system;
        for(var i=0; i<systems.length; i++){
            system = systems[i];
            context.fillStyle = system.colour;
            var particle;
            for(var j=0; j<system.numParticles; j+=1) {
                particle = system.particles[j];
                context.beginPath();
                if(particle.densityScore > 0){
                    context.arc(particle.x, particle.y, particle.densityScore * system.scalar, 0, Tau, false);
                }
                context.fill();
            }

            if(drawAttractRepel){
                context.fillStyle = "rgba(255, 50, 120, .25)";
                for(var loop=system.attractPts.length, j=0; j<loop; j++){
                    var pt = system.attractPts[j];
                    context.beginPath();
                    context.arc(pt.x, pt.y, pt.force*.2, 0, Tau, false);
                    context.fill();
                }
                context.fillStyle = "rgba(50, 255, 120, .2)";
                for(var loop=system.repelPts.length, j=0; j<loop; j++){
                    var pt = system.repelPts[j];
                    context.beginPath();
                    context.arc(pt.x, pt.y, pt.minDist, 0, Tau, false);
                    context.fill();
                }
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