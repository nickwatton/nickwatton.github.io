import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';
import EggPainterBackground from '../js/EggPainterBackground.js';
import EggLayer from '../js/EggLayer.js';
import EggFullTextureLayer from '../js/EggFullTextureLayer.js';

export default class EggPainter {
	constructor(canvas, ctx, ctxThumb) {
		this.EDIT = 'editLayer';
		this.NO_TOOL = 'no tool selected';
		this.STAMP = 'stamp';
		this.runningAs = this.NO_TOOL;
		
		this.canvas = canvas;
		this.ctx = ctx;
		this.layers = [];
		this.layerCount = 0;
		this.activeLayer = null;
		this.mouseMoveWatcher;
		this.bg = new EggPainterBackground(ctx);
		this.textureOut = document.querySelector('#egg-texture');
		
		this.textureThumbCTX = ctxThumb;
		
		this.startX;
		this.startY;
		
		this.textureFlag = document.querySelector('#texture-flag');
		this.forceChangeEvent = new Event('change');
		
		// Add watchers for mouse up / down
		this.mouseUpWatcher = this.handleMouseUp.bind(this);
		this.canvas.addEventListener('mouseup', this.mouseUpWatcher );
		
		// Add watchers for mouse out/in
		this.mouseOutWatcher = this.handleMouseOut.bind(this);
		this.mouseInWatcher = this.handleMouseIn.bind(this);
		this.canvas.addEventListener('mouseout', this.mouseOutWatcher );
		this.canvas.addEventListener('mouseenter', this.mouseInWatcher );
		
		eventManager.subscribe(eventNames.SELECT_STAMP, (e) => this.selectStamp(e) );
		eventManager.subscribe(eventNames.STAMP_COLOUR_CHANGE, () => {
			if(this.activeLayer != null){
				this.activeLayer.updateColour();
			}
		} );
		eventManager.subscribe(eventNames.UNDO, (e) => this.undoLayer(e) );
		eventManager.subscribe(eventNames.INVALIDATE_STAGE, () => this.invalidate() );
		
		eventManager.subscribe(eventNames.IMAGE_LAYER_UPLOADED, (e) => this.stampFromUpload(e) );
		eventManager.subscribe(eventNames.RESET, () => this.reset() );
	}
	handleMouseOut(){
		if(this.activeLayer === null) return;
		this.pauseStamp();
		this.draw();
	}
	handleMouseIn(){
		if(this.activeLayer === null) return;
		this.unpauseStamp();
		this.draw();
	}
	handleMouseUp(e){
		if(this.activeLayer === null) return;
		this.addLayer(this.activeLayer.img, e.offsetX, e.offsetY, true);
	}
	
	startStamp(){
		this.runningAs = this.STAMP;
		this.mouseMoveWatcher = this.update.bind(this);
		this.canvas.addEventListener('mousemove', this.mouseMoveWatcher );
	}
	pauseStamp(){
		this.activeLayer.active = false;
	}
	unpauseStamp(){
		this.activeLayer.active = true;
	}
	selectStamp(src){
		// This creates a stamp - follows mouse, but does not have history
		if(this.runningAs != this.STAMP){
			this.startStamp();
		}
		let newLayer = new EggLayer('CurrentStamp', this, src, 0, 0);
		this.activeLayer = newLayer;
		this.pauseStamp();
	}
	
	stampFromUpload(src){
		// console.log('stampFromUpload');
		let newLayer = new EggFullTextureLayer(this.layerCount, this, src, globalVariables.width * .5, globalVariables.height * .5, true);
		this.layers.push(newLayer);
		this.layerCount++;
		eventManager.dispatch(eventNames.INVALIDATE_UNDO, this.layers.length);
		
		// this.saveToImage();
	}
	
	addLayer(src, x, y, cloned=false){
		// This creates a stamp on the egg, with a layer in history for undo
		let newLayer = new EggLayer(this.layerCount, this, src, x, y, cloned);
		this.layers.push(newLayer);
		this.layerCount++;
		eventManager.dispatch(eventNames.INVALIDATE_UNDO, this.layers.length);
		
		this.saveToImage();
	}
	undoLayer(e){
		this.layers.pop();
		this.draw();
		eventManager.dispatch(eventNames.INVALIDATE_UNDO, this.layers.length);
		
		this.saveToImage();
	}
	reset(){
		this.layers.length = 0;
		this.invalidate();
	}
	
	saveToImage(){
		// Draw painter canvas to image for 3D egg
		this.textureOut.src = this.canvas.toDataURL();
		// Draw painter canvas to thumb for save
		this.textureThumbCTX.drawImage(this.canvas, 0, 0, globalVariables.thumbSize, globalVariables.thumbSize);
		this.textureFlag.dispatchEvent(this.forceChangeEvent);
	}
	
	update(e){
		if(this.activeLayer === null) return;
		this.activeLayer.update(e.offsetX, e.offsetY);
		this.draw();
	}
	invalidate(){
		this.draw();
		this.saveToImage();
	}
	draw(){
		// Clear main canvas
		this.canvas.width = globalVariables.width;
		
		// Draw background
		this.bg.draw();
		
		// Draw stamped layers
		for(let i = 0; i < this.layers.length; i++){
			if(this.layers[i].active){
				this.layers[i].drawWrapped(this.ctx);
			}
		}
		
		// Draw active stamp - ie the current tool
		if(this.activeLayer != null && this.activeLayer.active){
			this.activeLayer.drawWrapped(this.ctx);
		}
	}
}