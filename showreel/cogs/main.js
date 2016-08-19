(function(){
    'use strict';

    /*  Using a constant for 2xPI is a good process saver.
        It is called Tau because: http://tauday.com */
    var i, j, wrapper, canvas, ctx, width=500, height=500, allCogs=[],
    TO_RADIANS = Math.PI / 180;

    function get(id) {
        return document.getElementById(id);
    }

    function createCanvas(id, w, h){
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.id = id;
        return canvas;
    }

    function Cog(vo) {
        // Values from vo
        Object.defineProperty(this, 'id', { value: vo.id, writable: true });
        Object.defineProperty(this, 'colour', { value: vo.colour, writable: true });
        Object.defineProperty(this, 'initStep', { value: vo.initStep, writable: true });
        Object.defineProperty(this, 'numTeeth', { value: vo.numTeeth, writable: true });
        Object.defineProperty(this, 'radiusCentre', { value: vo.radiusCentre, writable: true });
        Object.defineProperty(this, 'radiusInner', { value: vo.radiusInner, writable: true });
        Object.defineProperty(this, 'radiusOuter', { value: vo.radiusOuter, writable: true });
        Object.defineProperty(this, 'speed', { value: vo.speed, writable: true });
        Object.defineProperty(this, 'pt', { value:vo.pt, writable: true });
        Object.defineProperty(this, 'width', { value:vo.radiusOuter*2, writable: true });
        Object.defineProperty(this, 'x', { value:vo.pt.x+(this.width*.5), writable: true });
        Object.defineProperty(this, 'y', { value:vo.pt.y+(this.width*.5), writable: true });
        Object.defineProperty(this, 'origin', { value:{x:vo.pt.x, y:vo.pt.y}, writable: true });
        // Values calculated
        Object.defineProperty(this, 'degreeStep', { value: 360 / (this.numTeeth * 2), writable: true });
        Object.defineProperty(this, 'image', { value: null, writable: true });
        // Register for updated vars
        Object.defineProperty(this, 'degrees', { value: 0, writable: true });
        Object.defineProperty(this, 'currentRotation', { value: vo.initStep, writable: true });
    }

    Cog.prototype.init = function(){
        // build graphics
        this.setPt(this.radiusInner, 0, false);
        ctx.fillStyle = this.colour;
        ctx.beginPath();
        ctx.moveTo(this.pt.x,this.pt.y);

        for (var i=0; i<this.numTeeth; i++){
            this.degrees += this.degreeStep;
            this.setPt(this.radiusInner, this.degrees);
            this.setPt(this.radiusOuter, this.degrees);
            this.degrees += this.degreeStep;
            this.setPt(this.radiusOuter, this.degrees);
            this.setPt(this.radiusInner, this.degrees);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // draw a wee circle to show middle
        ctx.moveTo(this.radiusOuter + this.radiusCentre,this.radiusOuter + this.radiusCentre);
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.arc(this.radiusOuter, this.radiusOuter, this.radiusCentre, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();

        // Capture an image for reuse, then clear up
        var imageData = ctx.getImageData(0, 0, this.width, this.width);
        var dataURL = imgDataToDataURL(imageData, this.width);
        this.image = new Image();
        this.image.src = dataURL;
        ctx.clearRect(0, 0, this.width, this.width);
        // 
        this.currentRotation = this.speed * this.initStep;

        this.update();
    }

    Cog.prototype.setPt = function(radius, deg, draw=true){
        var radians = deg * TO_RADIANS;
        this.pt.x = (radius * Math.cos(radians)) + this.radiusOuter;
        this.pt.y = (radius * Math.sin(radians)) + this.radiusOuter;
        if(draw){
            ctx.lineTo(this.pt.x, this.pt.y);
        }
    }

    Cog.prototype.update = function(){
        this.currentRotation += this.speed;
    }

    function imgDataToDataURL(imgData, width) {
        var c = document.createElement('canvas');
        c.width = c.height = width;
        c.getContext('2d').putImageData(imgData,0,0); 
        return c.toDataURL();
    }

    // Value Object - holds default values, easy to overwrite when making new object
    function CogVO(){
        Object.defineProperty(this, 'id', { value: "cog", writable: true });
        Object.defineProperty(this, 'colour', { value: "#ff3366", writable: true });
        Object.defineProperty(this, 'initStep', { value: 0, writable: true });
        Object.defineProperty(this, 'numTeeth', { value: 10, writable: true });
        Object.defineProperty(this, 'radiusCentre', { value: 3, writable: true });
        Object.defineProperty(this, 'edgeRadiusInner', { value: 50, writable: true });
        Object.defineProperty(this, 'edgeRadiusOuter', { value: 55, writable: true });
        Object.defineProperty(this, 'speed', { value: 2, writable: true });
        Object.defineProperty(this, 'pt', { x:0, y:0, writable: true });
    }

    // Helper - avoids lots of VOs in the creation section
    function getVO(id="cog", colour="#ff0000", teeth=10, inner=50, outer=55, speed=2, initStep=1, pt={x:0,y:0}){
        var cVO = new CogVO();
        cVO.id = id;
        cVO.initStep = initStep;
        cVO.numTeeth = teeth;
        cVO.radiusInner = inner;
        cVO.radiusOuter = outer;
        cVO.speed = speed;
        cVO.pt = pt;
        cVO.colour = colour;
        return cVO;
    }

    function initCogs(){
        allCogs.push(new Cog(getVO("id1", "#669966", 8, 15, 20, .037, 10, {x:98, y:230})));
        allCogs.push(new Cog(getVO("id2", "#ff7777", 16, 30, 35, -.0189, 10, {x:150, y:230})));
        allCogs.push(new Cog(getVO("id3", "#FF4444", 10, 20, 24, .03, 1, {x:202, y:250})));
        allCogs.push(new Cog(getVO("id4", "#FF6633", 28, 50, 55, .0105, 10, {x:150, y:144})));
        allCogs.push(new Cog(getVO("id5", "#5555FF", 60, 117, 120, -.005, 1, {x:330, y:310})));

        for(i=0;i<allCogs.length;i++){
            allCogs[i].init();
        }
    }

    function update(){
        for(i=0;i<allCogs.length;i++){
            allCogs[i].update();
        }
    }

  /*
  Thanks to http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
  for rotating images in canvas
  */
    function draw(){
        var cogT;
        for(i=0;i<allCogs.length;i++){
            cogT = allCogs[i];
            ctx.save();
            ctx.translate(cogT.origin.x, cogT.origin.y);
            ctx.rotate(cogT.currentRotation);
            ctx.drawImage(cogT.image, -cogT.radiusOuter, -cogT.radiusOuter);
            ctx.restore();
        }
    }

    function animate(){
        ctx.clearRect(0, 0, width, height);
        update();
        draw();
    }

    wrapper = get("wrapper");
    canvas =  createCanvas("canvas", width, height);
    ctx = canvas.getContext("2d");
    wrapper.appendChild(canvas);

    initCogs();
    var w = setInterval(function(){
        animate()
    },(1000/15));

}());