/*

_   initial setup

*/

(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var wrapper, canvas, ctx, width=500, height=500, Tau=Math.PI*2,
        frameCount=0, fps=30, fpsInterval, startTime, now, then, elapsed,
        maxXY=80,

        TO_RADIANS = Math.PI / 180,
        deg=0, rotationChangeRate=.0031,
        radians = deg * TO_RADIANS,

        colour='#777',

        countX=1, initX=0, stepX=.07*.5,
        countY=1, initY=0, stepY=.05*.5,
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
        ctx.translate(width*.5, height*.5);

        fpsCounter = new realUtils.FPS();
    }
 
    function update(){
        deg += rotationChangeRate;
        radians = deg * TO_RADIANS;

        countX += stepX;
        countY += stepY;
        ptX = Math.sin(countX) * range;
        ptY = Math.sin(countY) * range;
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