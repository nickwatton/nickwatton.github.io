(function(){
    'use strict';

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

    var width=document.getElementById("animationWrapper").offsetWidth,
    d1 = document.getElementById("d1"),
    d2 = document.getElementById("d2"),
    rNbWidth = d1.offsetWidth,
    maxX = width - rNbWidth,
    d1X = 0, d2X = 0,
    frameCount=0, fps=30, fpsInterval, startTime, now, then, elapsed;

    function drawNative(){
        d1.style.left = (d1X+=1)+"px";
        if(d1X>maxX)d1X=0;
    }

    function drawTrottled(){
        d2.style.left = (d2X+=1)+"px";
        if(d2X>maxX)d2X=0;
    }

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    function animate(){
        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;
        drawNative();
        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            drawTrottled();
        }
        requestAnimFrame(animate);
    }
    startAnimating(fps);

}());