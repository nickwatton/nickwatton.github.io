import {globalVariables} from '../js/GlobalVariables.js';

export default class EggLayer {
	constructor(id, parent, src, x=0, y=0, cloned=false) {
		this.width = globalVariables.width;
		this.height = globalVariables.height;
		
		this.active = true;
		this.id = 'layer' + id;
		this.canvas = this.createCanvas(this.id, this.width, this.height);
		this.ctx = this.canvas.getContext('2d');
		this.offsetX = x;
		this.offsetY = y;
		this.parent = parent;
		this.src = src;
		
		if(cloned){
			this.img = src;
			this.drawImg(this.img);
		}
		else{
			this.img = new Image();
			this.img.crossOrigin = 'anonymous';
			this.loadImg(src);
		}
	}
	loadImg(src){
		this.img.onload = () => this.drawImg(this.img);
		this.img.crossOrigin = 'anonymous';
		this.img.src = src;
	}
	drawImg(img){
		/* Image is dragged from top-left, 
		but should feel like it's from the center, 
		so we sample it in this weird way. */
		let iW = img.width,
			iH = img.height;
		this.ctx.drawImage(img,		0, 0, iW/2, iH/2,			this.width/2, this.height/2, this.width/2, this.height/2); // TL
		this.ctx.drawImage(img,		iW/2, 0, iW/2, iH/2,		0, this.height/2, this.width/2, this.height/2); // TR
		this.ctx.drawImage(img,		iW/2, iH/2, iW/2, iH/2,		0, 0, this.width/2, this.height/2); // BR
		this.ctx.drawImage(img,		0, iH/2, iW/2, iH/2,		this.width/2, 0, this.width/2, this.height/2); // BL

		/* Apply color to stamp source */
		this.ctx.globalCompositeOperation = 'source-atop';
		this.ctx.fillStyle = globalVariables.currentStampColour;
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.parent.draw();
	}
	updateColour(){
		this.drawImg(this.img);
	}
	update(offsetX, offsetY){
		this.offsetX = offsetX % globalVariables.width;
		this.offsetY = offsetY % globalVariables.height;
	}
	drawWrapped(ctx){
		/* SOURCE
			TL | TR
			-------
			BL | BR
			~
			ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
		*/
		ctx.save();
		ctx.drawImage(this.canvas, 
						 0, 0, this.width - this.offsetX, this.height - this.offsetY, 
						 this.offsetX, this.offsetY, this.width - this.offsetX, this.height - this.offsetY); // TL

		ctx.drawImage(this.canvas, 
						 this.width - this.offsetX, 0, this.offsetX, this.height - this.offsetY, 
						 0, this.offsetY, this.offsetX, this.height - this.offsetY); // TR

		ctx.drawImage(this.canvas, 
						 this.width - this.offsetX, this.height - this.offsetY, this.offsetX, this.height, 
						 0, 0, this.offsetX, this.height); // BR

		ctx.drawImage(this.canvas, 
						 0, this.height - this.offsetY, this.width - this.offsetX, this.height, 
						 this.offsetX, 0, this.width - this.offsetX, this.height); // BL
	}
	createCanvas(id='ctx', w, h){
		let c = document.createElement('canvas');
		c.id = id;
		c.height = h;
		c.width = w;
		return c;
	}
}