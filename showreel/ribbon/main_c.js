
/*

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
        repaintColour="rgba(255, 255, 255, 0.05)",
        prevX=width*.5, prevY=height*.5, mouseX=prevX, mouseY=prevY,
        curX, curY, lineAngleRadians, ribbonWidth, ptA={x:0, y:0}, ptB={x:0, y:0}, tempPt,
        dx, dy, len,

        drawMousePath=false,

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
        ctx.strokeStyle = "#cccccc";

        for(var i=0; i<numPts; i+=1){
            allPts.push({x:Math.round(Math.random()*width), y:Math.round(Math.random()*height)});
        }

        // fpsCounter = new realUtils.FPS();
    }

    function update(){
        //
    }

    function draw(){

        // overpaint
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

            ctx.fillStyle = "rgb(255, 0, 0)";
            // https://gist.github.com/conorbuck/2606166
            lineAngleRadians = Math.atan2(dy, dx);


            tempPt = rotate_point(mouseX, mouseY-ribbonWidth, mouseX, mouseY, lineAngleRadians);
            ptA.x = tempPt.x;
            ptA.y = tempPt.y;

            tempPt = rotate_point(mouseX, mouseY+ribbonWidth, mouseX, mouseY, lineAngleRadians);
            ptB.x = tempPt.x;
            ptB.y = tempPt.y;

            drawDot(ptA.x, ptA.y);
            drawDot(ptB.x, ptB.y);



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
        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;
        // if enough time has elapsed, draw the next frame
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