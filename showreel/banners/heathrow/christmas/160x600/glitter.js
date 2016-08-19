(function(){
    'use strict';

    var i,j, width, height, particle, numParticles=0, allParticles=[], delay,
    fade=false, fadeCount, sprites = [0,6,13,20], spritesheets=[], canvasData=[],
    flickerSpeed = 200, // speed of flicker between frames. EG 7:fast  50:slower
    modulus, nowMilliseconds, pCount, randX, randY,
    colours={},

    /*svg*/
    datauri = "data:image/svg+xml,%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20preserveAspectRatio%3D%22none%22%20x%3D%220px%22%20y%3D%220px%22%20width%3D%2227px%22%20height%3D%227px%22%20viewBox%3D%220%200%2027%207%22%3E%0A%3Cdefs%3E%0A%3Cg%20id%3D%22Layer0_0_FILL%22%3E%0A%3Cpath%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%220.3333333333333333%22%20stroke%3D%22none%22%20d%3D%22%0AM%208%205%0AL%209%205%209%204%208%204%208%205%0AM%208%202%0AL%208%203%209%203%209%202%208%202%0AM%2011%205%0AL%2011%204%2010%204%2010%205%2011%205%0AM%2011%203%0AL%2011%202%2010%202%2010%203%2011%203%0AM%2014%203%0AL%2013%203%2013%204%2014%204%2014%203%0AM%2016%205%0AL%2016%204%2015%204%2015%205%2016%205%0AM%2017%206%0AL%2016%206%2016%207%2017%207%2017%206%0AM%2017%204%0AL%2017%205%2018%205%2018%204%2017%204%0AM%2016%203%0AL%2016%202%2015%202%2015%203%2016%203%0AM%2017%201%0AL%2017%200%2016%200%2016%201%2017%201%0AM%2018%203%0AL%2018%202%2017%202%2017%203%2018%203%0AM%2020%203%0AL%2019%203%2019%204%2020%204%2020%203%0AM%2024%205%0AL%2024%206%2025%206%2025%205%2024%205%0AM%2022%205%0AL%2022%204%2021%204%2021%205%2022%205%0AM%2022%205%0AL%2022%206%2023%206%2023%205%2022%205%0AM%2022%203%0AL%2022%202%2021%202%2021%203%2022%203%0AM%2023%202%0AL%2023%201%2022%201%2022%202%2023%202%0AM%2024%202%0AL%2025%202%2025%201%2024%201%2024%202%0AM%2026%205%0AL%2026%204%2025%204%2025%205%2026%205%0AM%2026%203%0AL%2026%202%2025%202%2025%203%2026%203%0AM%203%204%0AL%203%203%202%203%202%204%203%204%0AM%203%204%0AL%203%205%204%205%204%204%203%204%0AM%203%203%0AL%204%203%204%202%203%202%203%203%0AM%205%203%0AL%204%203%204%204%205%204%205%203%20Z%22%2F%3E%0A%0A%3Cpath%20fill%3D%22%23FFFFFF%22%20stroke%3D%22none%22%20d%3D%22%0AM%2012%203%0AL%2011%203%2010%203%2010%202%2010%201%209%201%209%202%209%203%208%203%207%203%207%204%208%204%209%204%209%205%209%206%2010%206%2010%205%2010%204%2011%204%2012%204%2012%203%0AM%2019%203%0AL%2018%203%2017%203%2017%202%2017%201%2016%201%2016%202%2016%203%2015%203%2014%203%2014%204%2015%204%2016%204%2016%205%2016%206%2017%206%2017%205%2017%204%2018%204%2019%204%2019%203%0AM%2027%203%0AL%2026%203%2025%203%2025%202%2024%202%2024%201%2024%200%2023%200%2023%201%2023%202%2022%202%2022%203%2021%203%2020%203%2020%204%2021%204%2022%204%2022%205%2023%205%2023%206%2023%207%2024%207%2024%206%2024%205%2025%205%2025%204%2026%204%2027%204%2027%203%0AM%204%203%0AL%203%203%203%204%204%204%204%203%20Z%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fdefs%3E%0A%0A%3Cg%20transform%3D%22matrix%28%201%2C%200%2C%200%2C%201%2C%200%2C0%29%20%22%3E%0A%3Cuse%20xlink%3Ahref%3D%22%23Layer0_0_FILL%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A";

    /* Create data for each desired particle canvas */
    canvasData.push({
        wrapper: get("g1"),
        colours: ["fff"],
        numParticles: 20,
        width: 140,
        height: 47,
        speed: .1
    });

    canvasData.push({
        wrapper: get("glitter"),
        colours: ["fff"],
        numParticles: 30,
        width: 160,
        height: 180,
        speed: .1
    });

    for(i=0; i<canvasData.length; i++){
        var tCanvas = createCanvas("canvas"+i, canvasData[i].width, canvasData[i].height);
        canvasData[i].wrapper.appendChild(tCanvas);
        var tContext = tCanvas.getContext("2d");
        canvasData[i].context = tContext;
        numParticles += canvasData[i].numParticles;
        for(j=0; j<canvasData[i].colours.length; j++)
            colours[canvasData[i].colours[j]] = canvasData[i].colours[j];
    }

    for(var key in colours){
        var spritesheet = new Image(),
        dURI = datauri.split("FFFFFF").join(colours[key]);
        spritesheet.src = dURI;
        spritesheets[colours[key]] = spritesheet;
    }

    initparticles();

    // wrapper.addEventListener("click", clickHandler, false);

    function initparticles(){
        for(j=0; j<canvasData.length; j++)
            for(i=0; i<canvasData[j].numParticles; i++)
                allParticles.push(makeParticle(canvasData[j].height, canvasData[j].width, canvasData[j].colours, canvasData[j].speed));
    }

    function makeParticle(h, w, c, s){
        var _p = {}
        _p.position= {
          x: Math.floor(Math.random()*w),
          y: Math.floor(Math.random()*h)
        },
        _p.style = sprites[ Math.floor(Math.random()*sprites.length) ],
        _p.delta = {
          x: Math.floor(Math.random() * 1000) - 500,
          y: Math.floor(Math.random() * 1000) - 500
        },
        _p.speed = s,
        _p.size = parseFloat((Math.random()*2).toFixed(2)),
        _p.opacity = Math.random(),
        _p.sheet = c[Math.floor(Math.random()*c.length)];
        return _p;
    }

    function updateparticle(){
        pCount = 0;

        for(j=0; j<canvasData.length; j++){
            var width = canvasData[j].width;
            var height = canvasData[j].height;

            for(i=0; i<canvasData[j].numParticles; i++)
            {
                particle = allParticles[pCount++];

                // Add random movement with vertical bias
                randX = ( Math.random() > Math.random()*2 );
                randY = ( Math.random() > Math.random()*3 );

                if( randX )  particle.position.x += ((particle.delta.x * particle.speed) / 1500);
                if( !randY ) particle.position.y -= ((particle.delta.y * particle.speed) / 800);

                // Keep particle within view
                if( particle.position.x > width ) { particle.position.x = -7; }
                else if ( particle.position.x < -7 ) { particle.position.x = width; }

                // If particles leave edge, wrap horizontal with vertical replacement
                if( particle.position.y > height ) {
                  particle.position.y = -7;
                  particle.position.x = Math.floor(Math.random()*width);
                } else if ( particle.position.y < -7 ) {
                  particle.position.y = height;
                  particle.position.x = Math.floor(Math.random()*width);
                }

                // Fade particlep faster going out
                particle.opacity -= fade ? 0.01 : 0.005;
                if( particle.opacity <= 0 ) particle.opacity = (fade) ? 0 : 1;
            }
        }
    }

    function drawparticles(){
        nowMilliseconds = Date.now();
        pCount = 0;

        for(j=0; j<canvasData.length; j++){
            canvasData[j].context.clearRect( 0, 0, canvasData[j].width, canvasData[j].height );
            canvasData[j].context.save();

            for(i=0; i<canvasData[j].numParticles; i++){
                particle = allParticles[pCount++];
                modulus = Math.floor(Math.random()*flickerSpeed);
                if( nowMilliseconds % modulus === 0 ) { particle.style = sprites[ Math.floor(Math.random()*4) ]; }
                canvasData[j].context.globalAlpha = particle.opacity;
                canvasData[j].context.drawImage(spritesheets[particle.sheet], particle.style, 0, 7, 7, particle.position.x, particle.position.y, 7, 7);
            }
            canvasData[j].context.restore();
        }
    }

    function animate(){
        updateparticle();
        drawparticles();

        if(fade){
            if(--fadeCount >= 0) requestAnimFrame(animate);
        }
        else requestAnimFrame(animate);
    }
    delay = setTimeout(animate, 60);

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

    function createCanvas(id, w, h){
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.id = id;
        return canvas;
    }

    function clickHandler(){
        fadeCount = 100;
        fade = true;
    }

    function get(id){
        return document.getElementById(id);
    }

}());