import {eventNames} from '../js/EventNames.js';
import {eventManager} from '../js/EventManager.js';

export default class ImageUploader {
	constructor() {
		// this.canvas = canvas;
		// this.ctx = ctx;
		this.dropZone = document.querySelector('.upload-zone');
		this.dropZone.addEventListener('dragover', (evt) => { evt.preventDefault(); });
		this.dropZone.addEventListener('drop', (evt) => this.handleDrop(evt));
	}
	
	handleDrop(evt){
		evt.preventDefault();
		let files = evt.dataTransfer.files;
		if (files.length > 0) {
			let file = files[0];
			if (typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = (evt) => this.fileLoaded(evt);
				reader.onerror = this.fileLoadError;
				reader.onabort = this.fileLoadError;
				reader.fileName = file.name;
				reader.readAsDataURL(file);
			}
			else{
				// console.log('Unsupported file (' + file.name +') ignored');
			}
		}
	}
	
	fileLoaded(evt){
        let img = new Image();
		img.crossOrigin = 'anonymous';
		
		// img.onload = () => this.ctx.drawImage(img, 0, 0, 512, 512);
		img.onload = () => eventManager.dispatch(eventNames.IMAGE_LAYER_UPLOADED, img);
        img.src = evt.target.result;
		
		// this.ctx.drawImage(img, 0, 0, 512, 512)
		// eventManager.dispatch(eventNames.IMAGE_LAYER_UPLOADED, img);
    }
	
	fileLoadError(evt){
		console.log(evt);
    }
}