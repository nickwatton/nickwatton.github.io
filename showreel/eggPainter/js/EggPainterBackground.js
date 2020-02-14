import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';

export default class EggPainterBackground {
	constructor(ctx) {
		this.ctx = ctx;
		this.setGradColours();
		this.usingGradient = false;
		
		this.setFillType(globalVariables.bgTypeFlat);
		
		eventManager.subscribe(eventNames.BG_COLOUR_CHANGE, (e) => {
			if(e === globalVariables.bgTypeGrad){
				this.setGradColours();
			}
			this.setFillType(e);
		} );
		
		eventManager.subscribe(eventNames.BG_TOGGLE, (e) => this.setFillType(e ? globalVariables.bgTypeGrad : globalVariables.bgTypeFlat) );
	}
	setGradColours(){
		this.gradient = this.ctx.createLinearGradient(0, 0, 0, globalVariables.height);
		this.gradient.addColorStop(0, globalVariables.bgGradColour1);
		this.gradient.addColorStop(1, globalVariables.bgGradColour2);
	}
	setFillType(e){
		this.usingGradient = (e === globalVariables.bgTypeGrad) ? true : false;
		this.draw();
		eventManager.dispatch(eventNames.INVALIDATE_STAGE);
	}
	draw(){
		this.ctx.fillStyle = (this.usingGradient) ? this.gradient : globalVariables.bgFlatColour;
		this.ctx.fillRect(0, 0, globalVariables.width, globalVariables.height);
	}
}