/*

_   initial setup

*/

(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=500, height=250, Tau=Math.PI*2,
        canvasImage,
        frameCount=0, fps=30, fpsInterval, startTime, now, then, elapsed,
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

    function CanvasImage(canvas, src) {
        // load image in canvas
        var context = canvas.getContext('2d');
        var img = new Image();
        var that = this;
        img.onload = function(){
            canvas.width = img.width;
            width = canvas.width;
            // canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            // remember the original pixels
            that.original = that.getData();
            draw();
        };
        img.src = src;

        // cache these
        this.context = context;
        this.image = img;
    }

    CanvasImage.prototype.getData = function() {
        return this.context.getImageData(0, 0, this.image.width, this.image.height);
    };

    CanvasImage.prototype.setData = function(data) {
        return this.context.putImageData(data, 0, 0);
    };

    CanvasImage.prototype.reset = function() {
        this.setData(this.original);
    }

    function getPixel(x,y){
        var pixelNum = y*width + x,
        imageData = ctx.getImageData(x, y, 1, 1);
        return imageData.data;
    }
    function putPixel(imgData,x,y){
        ctx.putImageData(imgData,x,y);
    }

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

        drawPixelData=ctx.createImageData(1,1)

        canvasImage = new CanvasImage(canvas, "seed_wide.png");

        fpsCounter = new realUtils.FPS();
    }

    function update(){
        if(readRow < height-2){
            readRow += 1;
            drawRow += 1;
        }
        else{
            running=false;
            fpsCounter.stop(); // Doesn't work
        }
    }

    var readRow=0, drawRow=readRow+1, readData, drawPixelData;
    function draw(){
        var rgb0,rgb1,rgb2;
        var factorA=.65, factorB=1/(factorA*.8), factorC=2.6;
        // Read pixels, one at a time
        for(var j, i=0; i<width; i+=1){
            if(i < width*.5){
                rgb0 = getPixel(i-1, readRow);
                rgb1 = getPixel(i,   readRow);
            // rgb2 = getPixel(i+1, readRow);

                drawPixelData.data[0] = (rgb0[0]*factorA  +  rgb1[0]*factorB ) / factorC;
                drawPixelData.data[1] = (rgb0[1]*factorA  +  rgb1[1]*factorB ) / factorC;
                drawPixelData.data[2] = (rgb0[2]*factorA  +  rgb1[2]*factorB ) / factorC;
            }
            else{
                rgb0 = getPixel(i, readRow);
                rgb1 = getPixel(i+1,   readRow);
            // rgb2 = getPixel(i-1, readRow);

                drawPixelData.data[0] = (rgb0[0]*factorB  +  rgb1[0]*factorA ) / factorC;
                drawPixelData.data[1] = (rgb0[1]*factorB  +  rgb1[1]*factorA ) / factorC;
                drawPixelData.data[2] = (rgb0[2]*factorB  +  rgb1[2]*factorA ) / factorC;
            }

            drawPixelData.data[3] = 255;
            // }
            putPixel(drawPixelData, i,drawRow)
        }
        
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
            draw();
            update();
        }
        if(running){
            console.log("f")
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