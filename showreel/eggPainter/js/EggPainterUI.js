import {globalVariables} from '../js/GlobalVariables.js';
import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';

export default class EggPainterUI {
	constructor() {
		this.colourPickerStamp = document.querySelector('#stamp-colour-picker');
		this.stampButtons = [...document.querySelectorAll('.stamp')];
		
		this.colourPickerFlatBG = document.querySelector('#bg-colour-picker');
		this.colourPickerGrad1 = document.querySelector('#bg-grad1-colour-picker');
		this.colourPickerGrad2 = document.querySelector('#bg-grad2-colour-picker');
		
		this.backgroundToggle = document.querySelector('#background-toggle');
		
		this.save = document.querySelector('.button-save');
		this.undo = document.querySelector('.button-undo');
		this.reset = document.querySelector('.button-restart');
		
		this.hookUpUI();
		
		eventManager.subscribe(eventNames.INVALIDATE_UNDO, (e) => this.invalidateUndo(e) );
	}
	
	hookUpUI(){
		this.colourPickerStamp.value = globalVariables.currentStampColour;
		document.querySelector('label[for="stamp-colour-picker"]').style.backgroundColor = globalVariables.currentStampColour;
		
		document.querySelector('label[for="bg-colour-picker"]').style.backgroundColor = globalVariables.bgFlatColour;
		document.querySelector('label[for="bg-grad1-colour-picker"]').style.backgroundColor = globalVariables.bgGradColour1;
		document.querySelector('label[for="bg-grad2-colour-picker"]').style.backgroundColor = globalVariables.bgGradColour2;
		
		// Grab all stamp buttons, used to switch stamp
		for(let i=0; i<this.stampButtons.length; i++){
			this.stampButtons[i].addEventListener('click', (e) => this.handleStampSelect(e) );
		}
		
		// Colour picker for stamp
		this.colourPickerStamp.addEventListener('change', (e) => {
			globalVariables.currentStampColour = e.target.value;
			eventManager.dispatch(eventNames.STAMP_COLOUR_CHANGE, null);
			e.target.parentElement.style.backgroundColor = e.target.value;
		});
		
		// Colour pickers for backgrounds
		this.colourPickerFlatBG.addEventListener('change', (e) => this.updateBackground(e));
		this.colourPickerGrad1.addEventListener('change', (e) => this.updateBackground(e));
		this.colourPickerGrad2.addEventListener('change', (e) => this.updateBackground(e));
		
		// Toggle for flat / gradient background
		this.backgroundToggle.addEventListener('change', (e) => eventManager.dispatch(eventNames.BG_TOGGLE, e.target.checked) );
		
		// Undo stamp
		this.undo.addEventListener('click', (e) => eventManager.dispatch(eventNames.UNDO) );
		
		// Save texture and preview
		this.save.addEventListener('click', (e) => eventManager.dispatch(eventNames.SAVE) );
		
		// Reset
		this.reset.addEventListener('click', (e) => eventManager.dispatch(eventNames.RESET) );
	}
	
	handleStampSelect(e){
		for(let i=0; i<this.stampButtons.length; i++){
			let stamp = this.stampButtons[i];
			if(stamp === e.target){
				stamp.classList.add('picked');
			}
			else{
				stamp.classList.remove('picked');
			}
		}
		eventManager.dispatch(eventNames.SELECT_STAMP, e.target.src)
	}
	
	invalidateUndo(val){
		this.undo.disabled = val === 0 ? true : false;
	}
	updateBackground(e){
		let bgType;
		switch(e.target.id){
			case 'bg-colour-picker':
				globalVariables.bgFlatColour = e.target.value;
				bgType = globalVariables.bgTypeFlat;
				break;
			case 'bg-grad1-colour-picker':
				globalVariables.bgGradColour1 = e.target.value;
				bgType = globalVariables.bgTypeGrad;
				break;
			case 'bg-grad2-colour-picker':
				globalVariables.bgGradColour2 = e.target.value;
				bgType = globalVariables.bgTypeGrad;
				break;
		}
		this.pushImplicitBackgroundTypeChange(bgType === globalVariables.bgTypeGrad ? true : false);
		e.target.parentElement.style.backgroundColor = e.target.value;
		eventManager.dispatch(eventNames.BG_COLOUR_CHANGE, bgType);
	}
	pushImplicitBackgroundTypeChange(bool){
		this.backgroundToggle.checked = bool;
	}
}