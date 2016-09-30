
/*

_d  Filling ribbon. Options to draw endpoints and center line.
_c  Drawing endpoints on perpendicular lines to define ribbon edge
_b  Path drawing with follow mouse
_a  Static. Point-2-point angle and perpendicular line generation/rotaion calculations

*/



(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=680, height=500, Tau=Math.PI*2,
        numPts=5, allPts=[], baseRadius=5,
        frameCount=0, fps=30, fpsInterval, startTime, now, then, elapsed,
        prevX=width*.5, prevY=height*.5, mouseX=prevX, mouseY=prevY,
        curX, curY, lineAngleRadians, ribbonWidth, ptA={x:0, y:0}, ptB={x:0, y:0}, tempPtA, tempPtB, prevTempPtA={x:0,y:0}, prevTempPtB={x:0,y:0},
        dx, dy, len,

        repaintColour="rgba(255, 255, 255, 0.1)", ribbonColour="#dd3399",

        drawMousePath=false, drawEdgePoints=false,

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
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = ribbonColour;

        for(var i=0; i<numPts; i+=1){
            allPts.push({x:Math.round(Math.random()*width), y:Math.round(Math.random()*height)});
        }

        fpsCounter = new realUtils.FPS();
    }

    function update(){
        //
    }

    function draw(){
        // overpaint / slow erase
        ctx.fillStyle = repaintColour;
        ctx.fillRect(0, 0, width, height);

        dx = mouseX-prevX;
        dy = mouseY-prevY;
        len = Math.sqrt(dx*dx + dy*dy);

        if(len > 0){
            ribbonWidth = len;

            if(drawMousePath){
                ctx.beginPath();
                ctx.moveTo(prevX,prevY);
                ctx.lineTo(mouseX,mouseY);
                ctx.stroke();
            }

            ctx.fillStyle = ribbonColour;
            // https://gist.github.com/conorbuck/2606166
            lineAngleRadians = Math.atan2(dy, dx);

            tempPtA = rotate_point(mouseX, mouseY-ribbonWidth, mouseX, mouseY, lineAngleRadians);
            ptA.x = tempPtA.x;
            ptA.y = tempPtA.y;

            tempPtB = rotate_point(mouseX, mouseY+ribbonWidth, mouseX, mouseY, lineAngleRadians);
            ptB.x = tempPtB.x;
            ptB.y = tempPtB.y;

            ctx.beginPath();
            ctx.moveTo(prevTempPtA.x,prevTempPtA.y);
            ctx.lineTo(tempPtA.x,tempPtA.y);
            ctx.lineTo(tempPtB.x,tempPtB.y);
            ctx.lineTo(prevTempPtB.x,prevTempPtB.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


            if(drawEdgePoints){
                drawDot(ptA.x, ptA.y);
                drawDot(ptB.x, ptB.y);
            }

            prevTempPtA = tempPtA;
            prevTempPtB = tempPtB;
            prevX = mouseX;
            prevY = mouseY;
        }
        
    }

    function rotate_point(pointX, pointY, originX, originY, radians) {
        // http://www.felixeve.co.uk/how-to-rotate-a-point-around-an-origin-with-javascript/
        return {
            x: Math.cos(radians) * (pointX-originX) - Math.sin(radians) * (pointY-originY) + originX,
            y: Math.sin(radians) * (pointX-originX) + Math.cos(radians) * (pointY-originY) + originY
        };
    }

    function drawDot(x,y,radius=1){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Tau, false);
        // ctx.closePath();
        ctx.fill();
    }

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    function animate(){
        fpsCounter.update();
        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;
        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            draw();
        }
        requestAnimFrame(animate);
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
    setUpEvents();
    startAnimating(fps);

}());