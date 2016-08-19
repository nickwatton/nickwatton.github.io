$(function() {
    var fps=25, points=[], i, j, delay, canvasData='', savedData, point, ptCnt=0, tgetPt, currPt={x:0,y:0}, dx,dy, tolerance=1, speed=.05, numCells, cellW=6, pSize=2, rows=60, cols=120, text, canvas, context, width, height, bounce=-1, PI2=Math.PI*2, drawBG=false;
	
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
	
	canvas = $("#canvasMap")[0];
    width = canvas.width;
    height = canvas.height;
	numCells = rows * cols;
    context = canvas.getContext("2d");
	context.font = "8pt Arial";
	context.textAlign = "center";
	
	// build grid
	for (i = 0; i < numCells; i += 1){points.push({x:(cellW * (i % cols)) + (cellW >> 1), y:(cellW * Math.floor(i / cols)) + (cellW >> 1)});}
    
    function increaseCount(){
		ptCnt+=1;
		if(ptCnt >= sites.length){
			ptCnt = 0;
		}
	}
	
	function drawGrid(){
		context.fillStyle = "rgb(180, 200, 255)";
		for(i = 0; i < numCells; i+=1) {
        	context.beginPath();
            point = points[i];
			context.fillRect(point.x, point.y, pSize*2, pSize*2);
        }
	}
	
	function drawMap(){
		context.fillStyle = "rgb(180, 180, 180)";
		for(i = 0; i < wps.length; i+=1) {
			context.beginPath();
            point = points[wps[i]];
			context.fillRect(point.x, point.y, pSize*2, pSize*2);
        }
		canvasData = context.getImageData(0, 0, width, height);
	}
	
	function setData(){
		currPt.x = points[sites[ptCnt]].x;
		currPt.y = points[sites[ptCnt]].y;
		var tCnt = ptCnt+1;
		if(tCnt >= sites.length){tCnt = 0;}
		tgetPt = points[sites[tCnt]];
		text = info[tCnt];
	}
    
    function update() {
		dx=tgetPt.x - currPt.x;
		dy=tgetPt.y - currPt.y;
		currPt.x += dx * speed;
		currPt.y += dy * speed;
		if(Math.abs(dx) < tolerance && Math.abs(dy) < tolerance)
		{
			increaseCount();
			setData();
		}
	}
	
	function draw(){
        context.clearRect(0, 0, width, height);
		
		if(drawBG){drawGrid();}
		pasteGrid();
		drawText();
		drawParticle();
    }
	
	function pasteGrid(){
		context.putImageData(canvasData, 0, 0);
	}
	
	function drawParticle(){
		context.fillStyle = "rgb(250, 0, 0)";
		setShadow(2,5,0.5,255,0,0);
		context.beginPath();
        context.arc(currPt.x, currPt.y, pSize+2, 0, PI2, false);
        context.fill();
		//setShadow(0,0,0,0,0,0);
	}
	
	function drawText(){
		context.fillStyle = "rgb(0, 0, 0)";
		setShadow(1,2,0.5,0,0,0);
		context.fillText(text, width/2, height - 10);
		//setShadow(0,0,0,0,0,0);
	}
	
	function setShadow(offset, sBlur, alpha, r, g, b){
		context.shadowOffsetX = offset;
		context.shadowOffsetY = offset;
		context.shadowColor = "rgba("+r+","+g+","+b+","+alpha+")";
		context.shadowBlur = sBlur;
	}
	
	function animate() {
		requestAnimFrame(animate);
		update();
		draw();
	}
	
	setData();
	drawGrid();
	drawMap();
	delay = setTimeout(animate, 10);
});
