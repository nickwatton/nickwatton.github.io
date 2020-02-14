import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import EggPainter from '../js/EggPainter.js';
import EggPainterUI from '../js/EggPainterUI.js';
import EggConnection from '../js/EggConnection.js';

import ImageUploader from '../js/ImageUploader.js';
 
(function(){
	'use strict';
	const paintCanvas = document.querySelector('#stage');
	const previewCanvas = document.querySelector('#preview canvas');
	const paintCtx = paintCanvas.getContext('2d');
	const previewCtx = previewCanvas.getContext('2d');
	const eggPainterUI = new EggPainterUI();
	
	const textureThumbCanvas = document.querySelector('#texture-thumb');
	const textureThumbCTX = textureThumbCanvas.getContext('2d');
	textureThumbCanvas.width = textureThumbCanvas.height = globalVariables.thumbSize;
	
	
	const system = new EggPainter(paintCanvas, paintCtx, textureThumbCTX);
	const eggConnection = new EggConnection(paintCanvas, document.querySelector('#output-preview'), textureThumbCanvas, document.querySelector('#preview-thumb'));
	
	const imageUploader = new ImageUploader(paintCanvas, paintCtx);
	
	paintCanvas.width = globalVariables.width;
	paintCanvas.height = globalVariables.height;
	
	system.draw();
	
}());