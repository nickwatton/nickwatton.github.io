(function() {
    'use strict';

    /* Easel and animation variables */
    var stage, queue,
    container, textContainer, matte, amFilter, runMask=false,

    backAnimContainer, jumboContainer, jumboBg, clouds, clouds2,
    paperContainer, paperPlane, paperShadow, whiteBg, jumbo,
    fps = 30,

    /* DOM elements */
    headline = get("header_dynamic_txt"),
    headline_whole = get("header"),
    subHeadline = get("subHeader"),
    center1 = get("potential"),
    center2 = get("delivered"),
    cta = get("cta_copy"),
    ctaBtn = get("cta_btn"),
    termsHeader = get("terms_header"),
    importantInformation = get("importantInformation"),
    termscontent = get("terms"),

    running = false,
    width = 298,
    height = 164,
    gradFillCols = ["#dce5f4","#FFF","#FFF","#dce5f4"], gradFillRatios = [0,.3,.6,1],
    gradFillCols_Sky = ["#1c2445","#1e315b","#193c6c","#0b548d","#196da4","#448ebd","#66abad"], gradFillRatios_Sky = [0,.59,.66,.75,.81,.89,1],
    maskStart = 75,
    matteVO = {
        // matte
        mW:width,
        mH:328,
        // image
        iW:width,
        iH:height
    },
    maskVO = {
        y:0,
        yEnd: -height
    },
    cloudVO = {
        cloud1Y:128,
        cloud2Y:142,
        cloud1Step:.2,
        cloud2Step:.5
    },
    jumboVO = {
        cStartX:120,
        cStartY:-80,
        cEndX:165,
        cEndY:79,
        scaleStart:4,
        scaleEnd:.55,

        yEnd:0, // dynamically changed for float tween
        floatMin:19,
        floatVariance:10
    },
    paperVO = {
        planeStartX:40,
        planeStartY:85,
        shadowOpeningX:30,
        shadowOpeningY:85,

        plane2ndX:45,
        plane2ndY:25,

        planeUpY:40,
        planeDownY:47,
        startScale:.45,
        smallScale:.4,

        shadowAlpha:.3,
        shadowAlphaLow:.2,

        shadowUpX:46,
        shadowDownX:42,
        shadowUpY:54,
        shadowDownY:60
    },

    /* DoubleClick dynamic data */
    enablerInitHandler = function() {

        function clickHandler(){
        }
        function disclaimerOpen(){
            get("overlay").style.display = 'block';
        }
        function disclaimerClose(){
            get("overlay").style.display = 'none';
        }

        // IE8 ready click handlers
        var clickArea = get("clickArea");
        if (clickArea.addEventListener){ clickArea.addEventListener("click", clickHandler, false); }
        else { clickArea.attachEvent("onclick", clickHandler); }

        var clickArea2 = get("importantInformation");
        if (clickArea2.addEventListener){ clickArea2.addEventListener("click", disclaimerOpen, false); }
        else { clickArea2.attachEvent("onclick", disclaimerOpen); }

        var clickArea3 = get("close_overlay");
        if (clickArea3.addEventListener){ clickArea3.addEventListener("click", disclaimerClose, false); }
        else { clickArea3.attachEvent("onclick", disclaimerClose); }

        /* Data ready. Play banner */
        var div = document.createElement("div");
        div.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
        var isIeLessThan9 = (div.getElementsByTagName("i").length == 1);
        if (!isIeLessThan9) {
            initEasel();
            preLoad();
        }
    };

    window.onload = function() {
        enablerInitHandler();
    };

    //create canvas element and set up stage for create
    function initEasel() {
        var target = get("wrapper");
        target.appendChild(createCanvas("canvas", width, height));
        stage = new createjs.Stage("canvas");
    }

    function preLoad() {
        queue = new createjs.LoadQueue(false);
        queue.on("complete", preloadComplete, this);
        queue.loadManifest([
        {
            id: "paperPlane",
            src: "paperPlaneNew.png"
        },
        {
            id: "paperShadow",
            src: "paperShadow.png"
        },
        {
            id: "jumbo",
            src: "jumbo.png"
        },
        {
            id: "clouds",
            src: "looping-cloud-strip.png"
        } ]);
        queue.load();
    }

    function preloadComplete(event) {
        setupAnimationElements();
        setUpMask();
        running = !running;

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(fps);
        createjs.Ticker.addEventListener("tick", animationSequencer);

        if (running) { update(); }
    }

    function setupAnimationElements() {
        paperContainer = new createjs.Container();
        paperPlane = new createjs.Bitmap( queue.getResult("paperPlane", true) );
        paperShadow = new createjs.Bitmap( queue.getResult("paperShadow", true) );

        whiteBg = new createjs.Shape();
        whiteBg.graphics.lf(gradFillCols, gradFillRatios, 0, 0, 0, height).dr(0, 0, width, height); // Using tinyAPI http://goo.gl/oMK7vL
        whiteBg.cache(0,0,width, height);

        paperContainer.addChild(whiteBg);
        paperContainer.addChild(paperShadow);
        paperContainer.addChild(paperPlane);

        backAnimContainer = new createjs.Container();
        jumboContainer = new createjs.Container();

        jumboBg = new createjs.Shape();
        jumboBg.graphics.lf(gradFillCols_Sky, gradFillRatios_Sky, 0, 0, 0, height).dr(0, 0, width, height); // Using tinyAPI http://goo.gl/oMK7vL
        jumboBg.cache(0,0,width, height);

        jumbo = new createjs.Bitmap( queue.getResult("jumbo", true) );
        clouds = new createjs.Bitmap( queue.getResult("clouds", true) );
        clouds2 = new createjs.Bitmap( queue.getResult("clouds", true) );
        jumboContainer.addChild(jumbo);
        backAnimContainer.addChild(jumboBg);
        backAnimContainer.addChild(clouds);
        backAnimContainer.addChild(clouds2);
        backAnimContainer.addChild(jumboContainer);

        paperPlane.alpha = paperShadow.alpha = 0;
        paperPlane.scaleX = paperPlane.scaleY = paperShadow.scaleX = paperShadow.scaleY = paperVO.startScale;
        paperShadow.x = paperVO.shadowOpeningX;
        paperShadow.y = paperVO.shadowOpeningY;
        paperPlane.x = paperVO.planeStartX;
        paperPlane.y = paperVO.planeStartY;

        backAnimContainer.alpha = 0;
        jumboContainer.scaleX = jumboContainer.scaleY = jumboVO.scaleStart;
        jumboContainer.x = jumboVO.cStartX;
        jumboContainer.y = jumboVO.cStartY;
        // jumboBg.x = -2;
        jumbo.scaleX = jumbo.scaleY = .7;
        jumbo.y = 50;
        clouds.y = cloudVO.cloud1Y;
        clouds2.y = cloudVO.cloud2Y;
        clouds2.x = -100;

        clouds.alpha = .5;
        clouds2.alpha = .75;

        whiteBg.alpha = 0;
        TweenLite.to(whiteBg, .25, {alpha:1, ease:easeInQuad});
    }

    function setUpMask() {
        container = new createjs.Container();
        container.addChild(paperContainer);

        // Draw the matte - easier to change size than external graphic
        matte = new createjs.Shape();
        matte.graphics.f("red").mt(0,0).lt(matteVO.mW,0).lt(matteVO.mW,matteVO.iH).lt(0,matteVO.mH).lt(0,0).cp(); // Using tinyAPI http://goo.gl/oMK7vL
        matte.cache(0,0,matteVO.mW,matteVO.mH);
        // Make an alpha mask object
        amFilter = new createjs.AlphaMaskFilter(matte.cacheCanvas);

        container.filters = [amFilter];
        container.cache(0, 0, matteVO.iW, matteVO.iH);

        stage.addChild(backAnimContainer);
        stage.addChild(container);

        container.x = 0;
        container.y = 0;
        stage.update();
    }

    function animationSequencer(){
        switch(createjs.Ticker.getTicks())
        {
            case 1:
                paperPlaneFloatUp();
                break;

            case 8:
                TweenLite.to(paperShadow, .75, {x:paperVO.shadowOpeningX, y:paperVO.shadowOpeningY, scaleX:paperVO.startScale+.1, scaleY:paperVO.startScale+.2, alpha:paperVO.shadowAlpha, ease:easeInOutQuad, override:true});
                TweenLite.to(paperPlane, .75, {alpha:1, ease:easeInOutQuad, override:false});
                TweenLite.to(paperPlane, 2, {y:paperVO.planeStartY-20, ease:easeInOutQuad, override:false});
                TweenLite.to(center1, .75, {alpha:1, ease:easeInQuad, delay:.75});
                break;

            case maskStart-1:
                TweenLite.to(backAnimContainer, 0, {alpha:1});
                break;

            /* Reveal back animation */
            case maskStart:
                runMask = true;
                TweenLite.to(maskVO, .75, {y:maskVO.yEnd, ease:easeOutQuad});
                TweenLite.to(paperShadow, .75, {x:paperVO.shadowDownX, y:paperVO.shadowUpY, scaleX:paperVO.smallScale, scaleY:paperVO.smallScale, ease:easeOutQuad, override:true});
                TweenLite.to(paperPlane, .75, {x:paperVO.plane2ndX, y:paperVO.plane2ndY, scaleX:paperVO.smallScale, scaleY:paperVO.smallScale, ease:easeOutQuad, onComplete:paperPlaneFloatUp, override:true});

                TweenLite.to(center1, .75, {x:-144, ease:easeOutQuad});
                TweenLite.to(center2, .75, {alpha:1, ease:easeOutQuad, delay:1});

                TweenLite.to(jumboContainer, 4, {x:jumboVO.cEndX, y:jumboVO.cEndY, scaleX:jumboVO.scaleEnd, scaleY:jumboVO.scaleEnd});
                TweenLite.to([headline_whole, subHeadline, ctaBtn], .75, {alpha:1, ease:easeInQuad, delay:4});

                jumboFloat();

                createjs.Ticker.removeEventListener("tick", animationSequencer);
                createjs.Ticker.addEventListener("tick", update);
                return;
                break;
        }
        update();
    }

    /* START -- Recursive animations */
    /* Jumbo */
    function jumboFloat(){
        jumboVO.yEnd = Math.round(Math.random()*jumboVO.floatVariance)+jumboVO.floatMin;
        TweenLite.to(jumbo, 2, {y:jumboVO.yEnd, ease:easeInOutQuad, onComplete:jumboFloat});
    }

    /* Paper plane */
    function paperPlaneFloatUp(){
        TweenLite.to(paperShadow, 3, {x:paperVO.shadowUpX, y:paperVO.shadowUpY, alpha:paperVO.shadowAlphaLow, scaleX:paperVO.smallScale+.1, scaleY:paperVO.smallScale+.2, ease:easeInOutQuad, override:true});
        TweenLite.to(paperPlane, 3, {y:paperVO.planeUpY, ease:easeInOutQuad, onComplete:paperPlaneFloatDown, override:false});
    }
    function paperPlaneFloatDown(){
        TweenLite.to(paperShadow, 3, {x:paperVO.shadowDownX, y:paperVO.shadowDownY, alpha:paperVO.shadowAlpha, scaleX:paperVO.smallScale, scaleY:paperVO.smallScale, ease:easeInOutQuad, override:true});
        TweenLite.to(paperPlane, 3, {y:paperVO.planeDownY, ease:easeInOutQuad, onComplete:paperPlaneFloatUp, override:false});
    }

    function update() {
        if (running) {
            /* Boolean ensures only called during mask animation */
            if(runMask){
                if(maskVO.y > maskVO.yEnd)
                    moveMaskOverImage(maskVO.y);
                else
                    runMask = false;
            }
            /* Constant cloud movement */
            clouds.x = (clouds.x < -495) ? 0 : clouds.x - cloudVO.cloud1Step;
            clouds2.x = (clouds2.x < -495) ? 0 : clouds2.x - cloudVO.cloud2Step;

            container.updateCache();
            stage.update();
        }
    }

    function moveMaskOverImage(pos) {
        container.y = pos;
        paperContainer.y = -container.y-1;
        container.cache(0, 0, matteVO.mW, matteVO.mH);
        container.updateCache();
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

    /***
        *   TWEENING
        *   Source  http://robertpenner.com/easing/penner_chapter7_tweening.pdf
        *           https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
        *   t   - time/count - Needs to increment
        *   b   - start
        *   c   - end
        *   d   - duration
        ***/
        var easeLinear = function (t, b, c, d) {
            return c*t/d + b;
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
        }
}());
