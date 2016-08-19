(function() {
    'use strict';

    /* Easel and animation variables */
    var stage,
    bg_container,
    cross1, cross2, cross3, cCol="#999",bCol="#c67b0c", dotPattern=[1,3],
    fps = 30,
    mathPI = Math.PI,
    width = 400,
    height = 400,
    myDegrees = 1,
    myStep = 1,
    myRadius = 100, innerRadius=5,
    center = (width-(myRadius*2)),
    i, x, y;

    window.onload = function() {
        initEasel();
        setUpTicker();
        setupAnimationElements();
        setUpClicks();
        update();
    };

    function setUpClicks(){
        var more = get("more").addEventListener("click", function(){myStep+=1}, false),
        less = get("less").addEventListener("click", function(){myStep-=1}, false);
    }

    //create canvas element and set up stage for create
    function initEasel() {
        var target = get("wrapper");
        target.appendChild(createCanvas("canvas", width, height));
        stage = new createjs.Stage("canvas");
    }

    function setUpTicker() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(fps);
        createjs.Ticker.addEventListener("tick", update);
    }

    function setupAnimationElements() {
        bg_container = new createjs.Container();

        var bgGrfx = new createjs.Shape();
        bgGrfx.graphics.s(bCol).dc(0,0,myRadius);

        cross1 = new createjs.Shape();
        cross1.graphics.s(cCol).dc(0,0,innerRadius);
        cross1.graphics.sd(dotPattern,0).s(cCol).mt(0,myRadius).lt(0,-myRadius).es();
        cross1.graphics.sd(dotPattern,0).s(cCol).mt(myRadius,0).lt(-myRadius,0).es();

        cross2 = new createjs.Shape();
        cross2.graphics.s(cCol).dc(0,0,innerRadius);
        cross2.graphics.sd(dotPattern,0).s(cCol).mt(0,myRadius).lt(0,-myRadius).es();
        cross2.graphics.sd(dotPattern,0).s(cCol).mt(myRadius,0).lt(-myRadius,0).es();

        cross3 = new createjs.Shape();
        cross3.graphics.s(cCol).dc(0,0,innerRadius);
        cross3.graphics.sd(dotPattern,0).s(cCol).mt(0,myRadius).lt(0,-myRadius).es();
        cross3.graphics.sd(dotPattern,0).s(cCol).mt(myRadius,0).lt(-myRadius,0).es();

        bg_container.x = bg_container.y = center;

        bg_container.addChild(bgGrfx);
        bg_container.addChild(cross1);
        bg_container.addChild(cross2);
        bg_container.addChild(cross3);
        stage.addChild(bg_container);
    }

    function update() {
        // calculate
        x = myRadius * Math.cos((myDegrees * mathPI) / 180);
        y = myRadius * Math.sin((myDegrees * mathPI) / 180);

        // move
        cross3.x = cross2.x = x;
        cross3.y = cross1.y = y;
        cross3.rotation = myDegrees;

        // increment
        myDegrees += myStep;

        stage.update();
    }

    /* Helper  functions */
    function createCanvas(id, w, h) {
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.id = id;
        return canvas;
    }

    function get(id) {
        return document.getElementById(id);
    }
}());
