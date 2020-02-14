import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';

export default class EggFullTextureLayer {
	constructor(id, parent, src) {
		this.width = globalVariables.width;
		this.height = globalVariables.height;
		this.active = true;
		this.id = 'layer' + id;
		this.canvas = this.createCanvas(this.id, this.width, this.height);
		this.ctx = this.canvas.getContext('2d');
		this.offsetX = 0;
		this.offsetY = 0;
		this.parent = parent;
		
		this.drawImg(src);
	}
	
	drawImg(img){
		this.ctx.drawImage(img,		0, 0, img.width, img.height,		0, 0, this.width, this.height);
		// Shouldn't need this pause, but seems do. Unhappy.
		setTimeout( () => {this.parent.invalidate();}, 10 );
	}
	updateColour(){
		return;
	}
	update(){
		return;
	}
	drawWrapped(ctx){
		ctx.drawImage(this.canvas,		0, 0, this.width, this.height,		0, 0, this.width, this.height);
	}
	createCanvas(id='ctx', w, h){
		let c = document.createElement('canvas');
		c.id = id;
		c.height = h;
		c.width = w;
		return c;
	}
}