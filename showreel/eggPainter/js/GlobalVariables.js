import {eventManager} from '../js/EventManager.js';

/* Singleton Global Variables */
export default class GlobalVariables {
	constructor() {
		this.size = 512; // 512
		this.height = this.size;
		this.width = this.size;
		
		this.thumbSize = 128; // 256
		
		this.currentStampColour = '#292929';
		
		this.bgFlatColour = '#ffffec'; //'#5bc5ac';
		this.bgGradColour1 = '#baa377';
		this.bgGradColour2 = '#9d9799';
		
		this.bgTypeFlat = 'flat';
		this.bgTypeGrad = 'gradient';
		
		this.API_URL = 'https://project-egg.azurewebsites.net';
	}
}
export let globalVariables = new GlobalVariables();