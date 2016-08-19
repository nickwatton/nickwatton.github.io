$(function () {

    var i, j, canvas, stage, cW=43, cH=62, showingDay,
        canvasSnow, context, width, height, snow, numSnow=60, allSnow=[], PI2=Math.PI*2,
        shutterSheet, shutterData, shutterStart, shutterOpening, shutterClosing, shutterStates=[], startShutterSet=[], shutterOpeningSet=[], shutterClosedSet=[], shutterSets=[], 
        face, faceList=[], 
        vo, allVOs=[], placementTable=[], cols=8, 
        voices,
		clickLock=false,
        facade, londonEye, shardLights,
		santa, flame,
        minHand, hrHand,
        cloudSml, cloudBig,
        baubleON, baubleOFF, instructions,
        deerHead, deerBody, deerRunning=false,
        bulb, bulbPts_x, bulbPts_y, bulbPts_r, bulbRed, bulbToggle=false,
        timer, timerCount=0, sequenceTimer, sequenceCount=0;
	
	// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
	
    // Check canvas exists and set up if available
    if ($("canvas").length > 0)
    {
        canvas = $("#canvas")[0];
        stage = new createjs.Stage(canvas);
        
        setUpSpriteSheet();
        initAudio();
        
        canvasSnow = $("#snow")[0];
        context = canvasSnow.getContext("2d");
        width = canvasSnow.width;
        height = canvasSnow.height;
        createSnow();
        
        canvasSnow.addEventListener('click', handleClick);
        
        createjs.Ticker.addEventListener('tick', stage);
        timer = setInterval(function(){ doTimedAnim() }, 1000);
    }
    //setBackground();
    
    
    function setUpSpriteSheet()
    {
        shutterData = {
            "animations": {
                "startOpen": {
                    "frames": [0],
                    "next": "doOpen"
                },
                "doOpen": {
                    "frames": [1,2,3,4,5,6,7,8,9],
                    "next": "isOpen"
                },
                "isOpen": 9,
                
                "doClose": {
                    "frames": [9,8,7,6,5,4,3,2,1],
                    "next": "isClosed"
                },
                "isClosed": 0,
                
                "redBulb": {
                    "frames": [40,41],
                    "next": "yellowBulb",
                    speed: .25
                },
                "yellowBulb": {
                    "frames": [41,40],
                    "next": "redBulb",
                    speed: .25
                },
                "shardLights": {
                    "frames": [44,45,46,47],
                    speed: .01
                },
                "flames": {
                    "frames": [52,53],
                    speed: 1
                },
            },
            "framerate": 12,
            //"images": ["images/spriteSheet_0.png", "images/spriteSheet_1.png"],
            "images": ["images/spriteSheet.png"],
            "frames": [
    [612, 425, 48, 68, 0, 0, 0],
    [660, 425, 48, 68, 0, 0, 0],
    [51, 874, 48, 64, 0, 0, -4],
    [841, 425, 48, 64, 0, 0, -4],
    [99, 874, 48, 64, 0, 0, -4],
    [889, 425, 48, 64, 0, 0, -4],
    [937, 425, 48, 64, 0, 0, -4],
    [147, 874, 48, 64, 0, 0, -4],
    [3, 874, 48, 64, 0, 0, -4],
    [406, 938, 48, 17, 0, 0, -51],
    [293, 938, 41, 59, 0, 17, 53],
    [253, 938, 40, 59, 0, 16, 53],
    [708, 425, 49, 66, 0, 21, 60],
    [749, 874, 54, 62, 0, 23, 56],
    [156, 938, 43, 60, 0, 19, 54],
    [239, 874, 43, 64, 0, 18, 58],
    [334, 938, 42, 56, 0, 18, 50],
    [803, 874, 43, 62, 0, 18, 56],
    [799, 425, 42, 65, 0, 18, 59],
    [694, 874, 55, 62, 0, 24, 56],
    [457, 874, 44, 63, 0, 19, 57],
    [610, 874, 42, 62, 0, 18, 56],
    [757, 425, 42, 65, 0, 19, 59],
    [846, 874, 56, 61, 0, 27, 55],
    [413, 874, 44, 63, 0, 19, 57],
    [117, 938, 39, 60, 0, 16, 54],
    [902, 874, 41, 61, 0, 17, 55],
    [652, 874, 42, 62, 0, 17, 56],
    [369, 874, 44, 63, 0, 19, 57],
    [195, 874, 44, 64, 0, 18, 58],
    [199, 938, 54, 59, 0, 25, 53],
    [327, 874, 42, 63, 0, 17, 57],
    [282, 874, 45, 63, 0, 20, 57],
    [943, 874, 56, 61, 0, 27, 55],
    [507, 425, 78, 75, 0, 0, -2],
    [501, 874, 109, 63, 0, 53, 39],
    [1013, 762, 8, 13, 0, 1, 6],
    [1014, 3, 7, 15, 0, 1, 9],
    [182, 425, 256, 255, 0, 126, 125],
    [3, 3, 889, 422, 0, -29, -4],
    [1006, 425, 16, 21, 0, 4, 13],
    [999, 874, 16, 21, 0, 4, 13],
    [842, 762, 171, 90, 0, -3, -3],
    [3, 938, 114, 61, 0, -6, -3],
    [985, 425, 21, 64, 0, -2, -7],
    [961, 3, 26, 69, 0, -2, -2],
    [585, 425, 27, 69, 0, -1, -2],
    [987, 3, 27, 69, 0, -1, -2],
    [3, 762, 839, 112, 0, -11, -10],
    [438, 425, 69, 78, 0, 0, 0],
    [892, 3, 69, 78, 0, 0, 0],
    [3, 425, 179, 337, 0, -2, -2],
    [376, 938, 30, 22, 0, 0, 0],
    [454, 938, 29, 16, 0, -1, -3]
            ]
        }
        shutterSheet = new createjs.SpriteSheet(shutterData);
        
        addBackgroundElements();
        addWindowsAndFaces();
        addLightrope();
		addInstructions();
    }
    
    function doTimedAnim()
    {
        timerCount++;
        if (timerCount % 10 == 0)    
			moveDeer();
        if (timerCount % 30 == 0)    
			setClockTime();
        //if (timerCount % 60 == 0)    
			//setBackground();
    }
    
    function doAnimationQ()
    {
		// Switch values based on 1 second intervals (1000 in timer declaration)
        sequenceCount++;
		switch(sequenceCount)
		{
			case 8:
				if(shutterStates[0] === -1)
                    openShutterGroup(0);
                else
                    toggleShutterGroup(0);
				break;
			case 19:
				if(shutterStates[1] === -1)
                    openShutterGroup(1);
                else
                    toggleShutterGroup(1);
				break;
			case 30:
				if(shutterStates[2] === -1)
                    openShutterGroup(2);
                else
                    toggleShutterGroup(2);
				break;
			case 41:
				if(shutterStates[3] === -1)
                    openShutterGroup(3);
                else
                    toggleShutterGroup(3);
				break;
			case 52:
				if(shutterStates[4] === -1)
                    openShutterGroup(4);
                else
                    toggleShutterGroup(4);
				break;
			case 64:
				flySanta();
				break;
		}
    }
	
	function resetAnimationQ()
	{
		for(j = 0; j < 5; j += 1)
			toggleShutterGroup(j);
		
		TweenMax.to(instructions, 1, {alpha:1, delay:.5});
		toggleBauble(false);
		clearInterval(sequenceTimer);
		sequenceCount = 0;
		clickLock = false;
	}
	
	function startAnimationQ()
	{
		clickLock = true;
		TweenMax.to(instructions, 1, {alpha:0});
		toggleBauble(true);
		voices.play('v0');
		sequenceTimer = setInterval(function(){ doAnimationQ() }, 1000);
	}
    
    function addWindowsAndFaces()
    {
		placementTable = [0,1,1,2,1,0,3,2,  3,4,0,2,0,3,2,1,  1,2,0,1,4,2,0,4];
        for(i=0; i<24; i+=1)
        {
            vo = getVo(i);
            face = new createjs.Sprite(shutterSheet, 10 + i);
            face.stop();
            face.x = vo.x + 20;
            face.y = vo.y + 52;
            face.scaleX = face.scaleY = .75;face.rotation = -5;
			TweenMax.to(face, 1, {rotation:5, repeat:-1, yoyo:true, ease:Linear.easeNone});
            stage.addChild(face);
            
            shutterStart = new createjs.Sprite(shutterSheet, 'isClosed');
            shutterOpening = new createjs.Sprite(shutterSheet, 'startOpen');
            shutterClosing = new createjs.Sprite(shutterSheet, 'doClose');
            shutterStart.x = shutterOpening.x = shutterClosing.x = vo.x;
            shutterStart.y = shutterOpening.y = shutterClosing.y = vo.y;
            stage.addChild(shutterStart);
            
            faceList.push(face);
            startShutterSet.push(shutterStart);
            shutterOpeningSet.push(shutterOpening);
            shutterClosedSet.push(shutterClosing);
            shutterStates.push(-1);
            allVOs.push(vo);
        }
		shutterSets.push([0,5,10,22,12,18]);	// Ref to placementTable - all the '0's
		shutterSets.push([1,2,4,15,16,19]);		// Ref to placementTable - all the '1's
		shutterSets.push([3,7,11,14,17,21]);	// Ref to placementTable - all the '2's
		shutterSets.push([6,8,13]);				// Ref to placementTable - all the '3's
		shutterSets.push([9,20,23]);			// Ref to placementTable - all the '3's
		
        placementTable.length = 0;
    }
    
    function getVo(id)
    {
        return {arrayPos:id, clickID:id, clickSet:placementTable[id], x:309 + (56.3 * (id % cols)), y:302 + (68 * Math.floor(id / cols))};
    }
    
    function addBackgroundElements()
    {
        // Clouds
        cloudSml = new createjs.Sprite(shutterSheet, 43);
        cloudBig = new createjs.Sprite(shutterSheet, 42);
        cloudSml.x = 887;
        cloudSml.y = 90;
        cloudBig.x = 227;
        cloudBig.y = 44;
        cloudSml.stop(); 
        cloudBig.stop();
        stage.addChild(cloudSml); stage.addChild(cloudBig);
        TweenMax.to(cloudBig, 200, { x:1200, ease:Linear.easeNone } );
        TweenMax.to(cloudSml, 260, { x:-120, ease:Linear.easeNone } );
        
        // London Eye
        londonEye = new createjs.Sprite(shutterSheet, 38);
        londonEye.x = 605;
        londonEye.y = 265;
        londonEye.stop();
        spinWheel();
        stage.addChild(londonEye);
        
        // Elizabeth Tower clock
        minHand = new createjs.Sprite(shutterSheet, 37);
        hrHand = new createjs.Sprite(shutterSheet, 36);
        minHand.x = hrHand.x = 105;
        minHand.y = hrHand.y = 274;
        minHand.stop(); hrHand.stop();
        setClockTime();
        stage.addChild(minHand); stage.addChild(hrHand);
        
        // Add Building
        facade = new createjs.Sprite(shutterSheet, 39);
        facade.x = 29;//120;
        facade.y = 224;
        facade.stop();
        stage.addChild(facade);
        
        // Reindeer
        deerHead = new createjs.Sprite(shutterSheet, 35);
        deerBody = new createjs.Sprite(shutterSheet, 34);
        deerHead.x = 880;
        deerHead.y = 550;
        deerBody.x = deerHead.x + 4;
        deerBody.y = deerHead.y - 8;
        deerHead.stop(); deerBody.stop();
        stage.addChild(deerBody); stage.addChild(deerHead);
        
        // Shard lights
        shardLights = new createjs.Sprite(shutterSheet, 'shardLights');
        shardLights.x = 275;
        shardLights.y = 161;
        stage.addChild(shardLights);
        
        // Santa
        santa = new createjs.Sprite(shutterSheet, 48);
        santa.x = 1050;
        santa.y = 10;
        santa.stop();
        stage.addChild(santa);
		
		flame = new createjs.Sprite(shutterSheet, 'flames');
        flame.x = santa.x + 142;
        flame.y = santa.y + 81;
        stage.addChild(flame);
		
		// Bauble
		baubleON = new createjs.Sprite(shutterSheet, 49);
		baubleOFF = new createjs.Sprite(shutterSheet, 50);
        baubleON.x = baubleOFF.x = 747;
        baubleON.y = baubleOFF.y = 568;
        baubleON.stop(); baubleOFF.stop();
        stage.addChild(baubleON);
    }
    
    function addLightrope()
    {
        bulbPts_x = [655,659,672,687,700,720,726,747,757,769,774,791,799,834,836,854,864];
        bulbPts_y = [260,271,273,276,263,260,292,308,328,342,357,369,385,396,401,397,399];
        bulbPts_r = [24, -164, 23, 175, -31, 74, -160, 78, -154, 83, -169, 80, -180, 76, -172, -156, 150];
        bulbRed = [false,true,true,false,false,true,false,true,true,false,true,false,false,true,false,false,true];
        
        for (i = 0; i < bulbPts_x.length; i++)
        {
            new createjs.Sprite(shutterSheet, 'isClosed');
            bulb = new createjs.Sprite(shutterSheet, (bulbRed[i] === true) ? 'redBulb' : 'yellowBulb');
            bulb.x = bulbPts_x[i];
            bulb.y = bulbPts_y[i];
            bulb.rotation = bulbPts_r[i];
            bulb.scaleX = bulb.scaleY = .7;
            stage.addChild(bulb);
        }
        bulbPts_x.length = bulbPts_y.length = bulbPts_r.length = bulbRed.length = 0;
    }
	
	function addInstructions()
	{
		instructions = new createjs.Sprite(shutterSheet, 51);
        instructions.x = 834;
        instructions.y = 186;
        instructions.stop();
        stage.addChild(instructions);
	}
    
    function openShutterGroup(id)
    {
        shutterStates[id] = true;
        for(i = 0; i < shutterSets[id].length; i += 1)
        {
            stage.removeChild( startShutterSet[shutterSets[id][i]] );
            stage.addChild( shutterOpeningSet[shutterSets[id][i]] );
            TweenMax.to(faceList[shutterSets[id][i]], .5, {delay:.5, scaleX:1, scaleY:1});
        }
		//if(firstClick)
		//{
			//firstClick = false; 
			//voices.play('nub');
		//}
    }
    
    function toggleShutterGroup(id)
    {
        if(shutterStates[id] === true)
        {
            for(i = 0; i < shutterSets[id].length; i += 1)
            {
                stage.removeChild( shutterOpeningSet[shutterSets[id][i]] );
                stage.addChild( shutterClosedSet[shutterSets[id][i]] );
                TweenMax.to(faceList[shutterSets[id][i]], .3, {scaleX:.75, scaleY:.75});
            }
        }
        else
        {
            for(i = 0; i < shutterSets[id].length; i += 1)
            {
                stage.removeChild( shutterClosedSet[shutterSets[id][i]] );
                stage.addChild( shutterOpeningSet[shutterSets[id][i]] );
                TweenMax.to(faceList[shutterSets[id][i]], .3, {delay:.1, scaleX:1, scaleY:1});
            }
        }
        shutterStates[id] = !shutterStates[id];
    }
	
	function toggleBauble(inPlay)
	{
		if(inPlay)
		{
			stage.removeChild(baubleON);
			stage.addChild(baubleOFF);
		}
		else
		{
			stage.removeChild(baubleOFF);
			stage.addChild(baubleON);
		}
	}
    
    function moveDeer() 
    {
        if (!deerRunning)
        {
            deerRunning = true;
            TweenMax.to(deerHead, 1, { rotation: 45 } );
            TweenMax.to(deerHead, .3, { rotation: -55, delay:1, ease:Back.easeOut } );
            TweenMax.to(deerHead, 1, { rotation: 0, delay:1.3, ease:Elastic.easeOut, onComplete:function() { deerRunning = false; }} );
        }
    }
    
    function spinWheel()
    {
        TweenMax.to(londonEye, 150, { rotation:londonEye.rotation - 360, ease:Linear.easeNone, onComplete:spinWheel } );
    }
    
    function flySanta()
    {
        santa.x = 1050;
        santa.y = 10;
        TweenMax.to(santa, 1, {x:120, ease:Sine.easeOut, onUpdate:setFlame });
        TweenMax.to(santa, .5, {y:110, ease:Sine.easeOut});
        TweenMax.to(santa, 1, {y:105, ease:Sine.easeOut, delay:1, onUpdate:setFlame, repeat:7, yoyo:true});
        TweenMax.to(santa, .75, {x:-900, y:50, ease:Sine.easeIn, delay:8.5, onUpdate:setFlame});
    }

	function setFlame()
	{
		flame.x = santa.x + 142;
        flame.y = santa.y + 81;
	}
    
    // **** AUDIO METHODS *****
    function initAudio() 
	{
		voices = new Howl({
            urls: ['sounds/audioSprite.mp3','sounds/audioSprite.ogg'],
            loop: false,
			onend: function() 
			{
				resetAnimationQ();
			},
            sprite:
			{
                v0: [0, 74000]
            }
        });
	}
    
//         **** SNOW METHODS *****
    function createSnow()
	{
		for(i = 0; i < numSnow; i += 1)
		{
            snow = {};
            makeSnowflake(snow, Math.random() * height - 10);
            allSnow.push(snow);
        }
	}
    
	function makeSnowflake(flake, initY)
	{
		flake.x = Math.random() * width;
        flake.y = initY;
        flake.ax = Math.random() * 4 + 2;
        flake.vx = Math.random() * .2 + .1;
        flake.vy = Math.random() * 1.5 + .2;
        flake.radius = 3 * flake.vy;
	}
	
	function updateSnow()
	{
        for(i = 0; i < numSnow; i += 1)
		{
            snow = allSnow[i];
			snow.x += Math.sin(snow.ax += .01) * .5;
            snow.y += snow.vy;
            if(snow.x > width || snow.x < 0 || snow.y > height) 
				makeSnowflake(snow, 0);
        }
	}
	
	function drawSnow()
	{
		context.save();
		context.fillStyle = "rgba(255, 255, 255, .75)";
        for(i = 0; i < numSnow; i += 1) {
            snow = allSnow[i];
            context.beginPath();
            context.arc(snow.x, snow.y, snow.radius, 0, PI2, false);
            context.fill();
        }
		context.restore();
	}
	
    // GENERAL METHODS
    function handleClick(event)
    {
        var cPt = calculateClickPt(event);
		if(!clickLock)
		{
			if (cPt.x >= 746 && cPt.x < 816 && cPt.y >= 568 && cPt.y < 638)
				startAnimationQ();
		}
        if(cPt.x >= 867 && cPt.x <= 957 && cPt.y >= 524 && cPt.y <= 614)
            moveDeer();
		else if (cPt.x >= 81 && cPt.x < 161 && cPt.y >= 541 && cPt.y < 621)
			window.open("http://fpcreative.com");
		else if (cPt.x >= 597 && cPt.x < 637 && cPt.y >= 529 && cPt.y < 569)
			window.open("http://www.facebook.com/sharer.php?u=http://xmas.fpcreative.com");
		else if (cPt.x >= 642 && cPt.x < 682 && cPt.y >= 527 && cPt.y < 567)
			window.open("https://plus.google.com/share?url=http%3A%2F%2Fxmas.fpcreative.com%2F");
		else if (cPt.x >= 684 && cPt.x < 724 && cPt.y >= 522 && cPt.y < 562)
			window.open("https://twitter.com/share?url=http%3A%2F%2Fxmas.fpcreative.com%2F&text=The%20%40FPCreative%20team%20take%20to%20the%20microphones%20to%20wish%20everyone%20a%20very%20Merry%20Christmas");
    }
    
    function calculateClickPt(event)
	{
        var target;
        if (!event) 
            event = window.event;
        if (event.target) 
            target = event.target;
        else 
            if (event.srcElement) 
                target = event.srcElement;
        if (target.nodeType == 3) 
            target = target.parentNode;
        return { x: event.pageX - $(target).offset().left,  y: event.pageY - $(target).offset().top };
    }
    
    function setClockTime()
	{
        var tm = new Date();
        minHand.rotation = tm.getMinutes() * 6;
        hrHand.rotation = tm.getHours() * 30 + tm.getMinutes() * .5;
    }
    
    function setBackground()
	{
        // Sun- rise/set reference http://goo.gl/PgXTMw
        var currHours = new Date().getHours();
        if(currHours >= 8 && currHours <= 16)
            changeBG(true);
        else
            changeBG(false);
    }
    
    function changeBG(isDay)
    {
        if(showingDay != isDay)
        {
            // change canvas background image
            $('#canvasWrapper').css({'background-image': isDay ? 'url(images/DAY.jpg)' : 'url(images/NIGHT.jpg)', 'background-repeat': 'no-repeat'});
            // change body background image
            $("body").css({'background-image': isDay ? 'url(reference/ASSETS/Background_Day.jpg)' : 'url(reference/ASSETS/Background_Night.jpg)', 'background-repeat': 'repeat-x'})
            showingDay = isDay;
        }
    }
    
	function animate() 
	{
        context.clearRect(0, 0, width, height);
		updateSnow();
		drawSnow();
		requestAnimFrame(animate);
	}
    
	delay = setTimeout(animate, 10);
});
