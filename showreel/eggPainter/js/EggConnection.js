import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';

export default class EggConnection {
	constructor(canvas_texture, canvas_preview, canvas_textureThumb, canvas_previewThumb) {
		this.canvas_texture = canvas_texture;
		this.canvas_preview = canvas_preview;
		this.textureBlob;
		this.previewBlob;
		
		this.canvas_textureThumb = canvas_textureThumb;
		this.canvas_previewThumb = canvas_previewThumb;
		this.textureThumbBlob;
		this.previewThumbBlob;
		
		this.POST = 'POST';
		this.PUT = 'PUT';
		this.method = this.POST;
		this.currentID = '';
		
		eventManager.subscribe(eventNames.SAVE, () => {
			this.clearBlobs();
			this.blobTheTexture();
		} );
		
		eventManager.subscribe(eventNames.RESET, () => this.reset() );
	}
	
	reset(){
		this.method = this.POST;
		this.currentID = '';
	}
	
	clearBlobs(){
		this.textureBlob = null;
		this.previewBlob = null;
		this.textureThumbBlob = null;
		this.previewThumbBlob = null;
	}
	
	blobTheTexture(){
		this.canvas_texture.toBlob( (blob) => {
			let newImg = document.createElement('img'),
			url = URL.createObjectURL(blob);
			newImg.onload = () => {
				// Save the texture blob
				this.textureBlob = blob;
				// console.log('A - blobbed');
				this.blobTheTextureThumb();
			};
			newImg.src = url;
		});
	}
	blobTheTextureThumb(){
		this.canvas_textureThumb.toBlob( (blob) => {
			let newImg = document.createElement('img'),
			url = URL.createObjectURL(blob);
			newImg.onload = () => {
				// Save the texture-thumb blob
				this.textureThumbBlob = blob;
				// console.log('B - blobbed');
				this.blobThePreview();
			};
			newImg.src = url;
		});
	}
	blobThePreview(){
		this.canvas_preview.toBlob( (blob) => { 
			let newImg = document.createElement('img'),
			url = URL.createObjectURL(blob);
			newImg.onload = () => {
				// Save the preview blob
				this.previewBlob = blob;
				// console.log('C - blobbed');
				this.blobThePreviewThumb();
			};
			newImg.src = url;
		});
	}
	blobThePreviewThumb(){
		this.canvas_previewThumb.toBlob( (blob) => {
			let newImg = document.createElement('img'),
			url = URL.createObjectURL(blob);
			newImg.onload = () => {
				// Save the preview-thumb blob
				this.previewThumbBlob = blob;
				// console.log('D - blobbed');
				this.sendBlobsToDB();
			};
			newImg.src = url;
		});
	}
	
	sendBlobsToDB(){
		let formdata = new FormData();
		formdata.append('author', 'Nick Watton');
		formdata.append('description', 'Painter tests');
		formdata.append('title', 'Oeuf Getting close');
		formdata.append('textureImage', this.textureBlob, 'texture.png');
		formdata.append('previewImage', this.previewBlob, 'egg.png');
		formdata.append('textureThumb', this.textureThumbBlob, 'texture-thumb.png');
		formdata.append('previewThumb', this.previewThumbBlob, 'egg-thumb.png');
		
		let apiRequestTail = (this.method === this.POST) ? '/api/egg' : '/api/egg/' + this.currentID;
		let requestOptions = {
			method: this.method,
			body: formdata,
			redirect: 'follow'
		};

		fetch(globalVariables.API_URL + apiRequestTail, requestOptions)
			.then(response => response.text())
			.then(result => { 
					console.log('done', result);
					let data = JSON.parse(result);
					if(data.status === 'success' && this.method === this.POST){
						this.method = this.PUT;
						this.currentID = data.data.id;
					}})
			.catch(error => console.log('error', error));
	}
}