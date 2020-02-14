/* Singleton Event names */
export default class EventNames {
	constructor() {
		this.SELECT_STAMP = 'selectStamp';
		this.ADD_LAYER = 'addLayer';
		
		this.STAMP_COLOUR_CHANGE = 'stampColourChange';
		this.IMAGE_LAYER_UPLOADED = 'image layer uploaded';
		
		this.BG_COLOUR_CHANGE = 'bgColourChange';
		this.BG_COLOUR_UPDATED = 'bgColourUpdated';
		this.BG_TOGGLE = 'toggle background style';
		
		this.INVALIDATE_STAGE = 'invalidate main canvas';
		
		this.UNDO = 'undo';
		this.INVALIDATE_UNDO = 'invalidate undo';
		
		this.SAVE = 'save';
		this.RESET = 'rset';
	}
}
export let eventNames = new EventNames();