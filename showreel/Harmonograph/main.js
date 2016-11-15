/*

_   initial setup

*/

(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=500, height=500, Tau=Math.PI*2,
        frameCount=0, fps=30, fpsInterval, startTime, now, then, elapsed,
        maxXY=180,

        TO_RADIANS = Math.PI / 180,
        deg=0, rotationChangeRate=0,
        radians = deg * TO_RADIANS,

        rateOfDecay=.002,
        minimumDecayedRange=maxXY*.5,

        colour='#777',

        countX=1, initX=0, stepX=.07*.5,
        countY=1, initY=0, stepY=.06*.5,
        range = maxXY,
        ptX=initX, ptY=initY, ptR=.5,


        running=true,
        fpsCounter;

    // Polyfill methods
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
    Date.now = Date.now || function() { return +new Date; };
    // Polyfill methods - End

    function createCanvas(id, w, h){
        var tCanvas = document.createElement("canvas");
        tCanvas.width = w;
        tCanvas.height = h;
        tCanvas.id = id;
        return tCanvas;
    }

    function init(){
        wrapper = document.getElementById("wrapper");
        canvas =  createCanvas("canvas", width, height);
        wrapper.appendChild(canvas);
        ctx = canvas.getContext("2d");
        ctx.fillStyle = colour;
        ctx.translate((width-(range*2))*.5, (height-(range*2))*.5);

        fpsCounter = new realUtils.FPS();
    }
 
    function update(){
        deg += rotationChangeRate;
        radians = deg * TO_RADIANS;

        range -= rateOfDecay;

        countX += stepX;
        countY += stepY;
        ptX = Math.sin(countX) * range;
        ptY = Math.sin(countY) * range;

        if(range < minimumDecayedRange){
            fpsCounter.stop();
            running = false;
        }
    }

    function draw(){
        ctx.rotate(radians);
        ctx.beginPath();
        ctx.arc(maxXY+ptX, maxXY+ptY, ptR, 0, Tau, false);
        // ctx.arc(10, 10, ptR, 0, Tau, false);
        ctx.fill();
        // console.log(ptX,ptY)
    }

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    function animate(){
        fpsCounter.update();
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            update();
            draw();
        }
        if(running){
            fpsCounter.update();
            requestAnimFrame(animate);
        }
    }

    function setUpEvents(){
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        canvas.addEventListener('mousemove', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            mouseX = mousePos.x;
            mouseY = mousePos.y;
        }, false);
    }

    init();
    // setUpEvents();
    startAnimating(fps);

}());