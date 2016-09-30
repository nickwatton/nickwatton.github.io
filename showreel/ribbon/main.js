/*

_   smoother ribbon
_e  Delay to the mouse follow - uses followDelayFactor - default = 0.1
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

        frameCount=0, fps=60, fpsInterval, startTime, now, then, elapsed,

        prevX=width*.5, prevY=height*.5, mouseX=prevX, mouseY=prevY, curX, curY, nextX, nextY,
        followDelayFactor=.1, dx, dy, // Mouse follow delay
        lineAngleRadians, ribbonWidth, 

        ptA={x:0, y:0}, ptB={x:0, y:0}, 
        tempPtA, tempPtB, 
        upPointsHistory=[], downPointsHistory=[], maxHistory=50, minHistory=3,

        repaintColour="rgba(255, 255, 255, .2)", ribbonColour="#dd3399", ribbonEdgeColour="#000",

        drawEdgePoints=false,
        constrastingStroke=true,

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
        ctx.fillStyle = repaintColour;
        ctx.strokeStyle = constrastingStroke ? ribbonEdgeColour : ribbonColour;
        fpsCounter = new realUtils.FPS();
    }

    function update(){
        if( upPointsHistory.push({x:ptA.x, y:ptA.y}) > maxHistory){
            upPointsHistory.shift();
        }
        if( downPointsHistory.push({x:ptB.x, y:ptB.y}) > maxHistory){
            downPointsHistory.shift();
        }
    }

    function draw(){
        // overpaint / slow erase
        ctx.fillStyle = repaintColour;
        ctx.fillRect(0, 0, width, height);

        dx = (mouseX-prevX) * followDelayFactor;
        dy = (mouseY-prevY) * followDelayFactor;
        ribbonWidth = Math.sqrt(dx*dx + dy*dy);

        nextX = prevX+dx;
        nextY = prevY+dy;

        if(ribbonWidth > 0){
            ctx.fillStyle = ribbonColour;

            lineAngleRadians = Math.atan2(dy, dx);
            // points either side of line
            tempPtA = rotate_point(nextX, nextY-ribbonWidth, nextX, nextY, lineAngleRadians);
            ptA.x = tempPtA.x;
            ptA.y = tempPtA.y;
            tempPtB = rotate_point(nextX, nextY+ribbonWidth, nextX, nextY, lineAngleRadians);
            ptB.x = tempPtB.x;
            ptB.y = tempPtB.y;

            if(upPointsHistory.length > minHistory){
                var loopLength = upPointsHistory.length-1;
                ctx.beginPath();
                ctx.moveTo(upPointsHistory[0].x,upPointsHistory[0].y);
                for(var i=0; i<loopLength; i+=1){
                    ctx.lineTo(upPointsHistory[i].x,upPointsHistory[i].y);
                }
                ctx.lineTo(downPointsHistory[loopLength].x,downPointsHistory[loopLength].y);
                for(var i=loopLength; i>=0; i-=1){
                    ctx.lineTo(downPointsHistory[i].x,downPointsHistory[i].y);
                }
                ctx.stroke();
                ctx.fill();

                if(drawEdgePoints){
                    drawDot(ptA.x, ptA.y);
                    drawDot(ptB.x, ptB.y);
                }
            }
            prevX = nextX;
            prevY = nextY;
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
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            update();
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