
/*

_a  Static. Point-2-point angle and perpendicular line generation/rotaion calculations

*/



(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=680, height=500, Tau=Math.PI*2,
        numPts=5, allPts=[], baseRadius=5,
        frameCount=0, fps=3, fpsInterval, startTime, now, then, elapsed,
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
        ctx.fillStyle = "#ffdddd";
        ctx.strokeStyle = "#e0e0e0";

        for(var i=0; i<numPts; i+=1){
            allPts.push({x:Math.round(Math.random()*width), y:Math.round(Math.random()*height)});
        }

        // fpsCounter = new realUtils.FPS();
    }

    function update(){
        //
    }

    function draw(){
        // ctx.save();
        ctx.clearRect(0, 0, width, height);

        // mark the line start
        drawDot(allPts[0].x,allPts[0].y, baseRadius);

        // draw line
        ctx.beginPath();
        ctx.moveTo(allPts[0].x,allPts[0].y);
        for(var i=1; i<numPts; i+=1){
            ctx.lineTo(allPts[i].x,allPts[i].y);
        }
        ctx.stroke();

        // calculate pints to draw ribbon around
        var curX, curY, lineAngleRadians, ribbonWidth=15, ptA={x:0, y:0}, ptB={x:0, y:0}, tempPt;
        for(var i=1; i<numPts; i+=1){
            curX = allPts[i].x;
            curY = allPts[i].y;

            // https://gist.github.com/conorbuck/2606166
            lineAngleRadians = Math.atan2(curY-allPts[i-1].y, curX-allPts[i-1].x);

            tempPt = rotate_point(curX, curY-ribbonWidth, curX, curY, lineAngleRadians);
            ptA.x = tempPt.x;
            ptA.y = tempPt.y;

            tempPt = rotate_point(curX, curY+ribbonWidth, curX, curY, lineAngleRadians);
            ptB.x = tempPt.x;
            ptB.y = tempPt.y;

            drawDot(ptA.x, ptA.y, 3);
            drawDot(ptB.x, ptB.y, 3);

            ctx.beginPath();
            ctx.moveTo(ptA.x , ptA.y );
            ctx.lineTo(ptB.x , ptB.y );
            ctx.stroke();
        }
        // ctx.restore();
    }

    function rotate_point(pointX, pointY, originX, originY, radians) {
        // http://www.felixeve.co.uk/how-to-rotate-a-point-around-an-origin-with-javascript/
        return {
            x: Math.cos(radians) * (pointX-originX) - Math.sin(radians) * (pointY-originY) + originX,
            y: Math.sin(radians) * (pointX-originX) + Math.cos(radians) * (pointY-originY) + originY
        };
    }

    function drawDot(x,y,radius=5){
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

    init();
    startAnimating(fps);

}());