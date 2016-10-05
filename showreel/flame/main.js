/*

_   initial setup

*/

(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=500, height=250, Tau=Math.PI*2,
        canvasImage,

        readRow=0, drawRow=readRow+1, readData, drawPixelData,
        
        factorA = {factor:0, count:0, start:.53, end:1, duration:height-4}, 
        // var factorB=1/(factorA.factor*.8), factorC=2.6;
        factorB, factorBAMod=.795, factorC=2.79,
        center,

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
            center=width*.5 +2;
            context.drawImage(img, 0, 0, img.width, img.height);

            that.original = that.getData();
            startAnimating(fps);
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
        if(factorA.count < factorA.duration){
            factorA.factor = easeInQuad(factorA.count++, factorA.start, factorA.end, factorA.duration);
            factorB=1/(factorA.factor*factorBAMod);
        }
    }

    function draw(){
        var rgb0,rgb1,rgb2;
        // Read pixels, one at a time
        for(var j, i=0; i<width; i+=1){
            if(i < center){
                rgb0 = getPixel(i-1, readRow);
                rgb1 = getPixel(i,   readRow);

                drawPixelData.data[0] = (rgb0[0]*factorA.factor  +  rgb1[0]*factorB ) / factorC;
                drawPixelData.data[1] = (rgb0[1]*factorA.factor  +  rgb1[1]*factorB ) / factorC;
                drawPixelData.data[2] = (rgb0[2]*factorA.factor  +  rgb1[2]*factorB ) / factorC;
            }
            else{
                rgb0 = getPixel(i, readRow);
                rgb1 = getPixel(i+1,   readRow);

                drawPixelData.data[0] = (rgb0[0]*factorB  +  rgb1[0]*factorA.factor ) / factorC;
                drawPixelData.data[1] = (rgb0[1]*factorB  +  rgb1[1]*factorA.factor ) / factorC;
                drawPixelData.data[2] = (rgb0[2]*factorB  +  rgb1[2]*factorA.factor ) / factorC;
            }

            drawPixelData.data[3] = 255;
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
    //startAnimating(fps);



    /***
        *   TWEENING
        *   Source  http://robertpenner.com/easing/penner_chapter7_tweening.pdf
        *           https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
        *   t   - time/count - Needs to increment
        *   b   - start
        *   c   - end
        *   d   - duration
        *   Available methods:
        *       Linear:         easeLinear (Power0)
        *       Sinusoidal:     easeInSine, easeOutSine, easeInOutSine
        *       Quadratic:      easeInQuad, easeOutQuad, easeInOutQuad (Power1)
        *       Exponential:    easeInExpo, easeOutExpo, easeInOutExpo
        *       Back:           easeInBack, easeOutBack, easeInOutBack
        *       Bounce:         easeOutBounce
        *   Greensock use friendly "Power" names, used here for familiarity. See https://goo.gl/1YnpDp.
        ***/
        var PI = Math.PI,
        halfPI = PI/2,
        backSwing = 1.5, //1.70158

        easeLinear = function (t, b, c, d) {
            return c*t/d + b;
        },

        easeInSine = function (t, b, c, d) {
            return c * (1 - Math.cos(t/d * (halfPI))) + b;
        },
        easeOutSine = function (t, b, c, d) {
            return c * Math.sin(t/d * (halfPI)) + b;
        },
        easeInOutSine = function (t, b, c, d) {
            return c/2 * (1 - Math.cos(PI*t/d)) + b;
        },

        easeInQuad = function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad = function (t, b, c, d) {
            return -c * (t/=d)*(t-2) + b;
        },
        easeInOutQuad = function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },

        easeInExpo = function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo = function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo = function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },

        easeInBack = function (t, b, c, d, s) {
            if (s == undefined) s = backSwing;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack = function (t, b, c, d, s) {
            if (s == undefined) s = backSwing;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack = function (t, b, c, d, s) {
            if (s == undefined) s = backSwing;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        easeOutBounce = function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        };
        /*** TWEENING END ***/

}());