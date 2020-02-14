




/*




UNUSED - we are dropping visual layers / history




*/







import {eventManager} from '../js/EventManager.js';
import {eventNames} from '../js/EventNames.js';

export default class StampLayerTemplate {
	constructor() {
		this.historyList = document.querySelector('#history-list');
	}
	createHistoryItem(id, src){
		let layerName = 'layer' + id;
		
		let itemWrapper = document.createElement('p');
		let check = document.createElement('input');
		let radio = document.createElement('input');
		let spanWrapper = document.createElement('span');

		let radioLab = document.createElement('label');
		let checkLab = document.createElement('label');
		let img = document.createElement('img');

		img.classList.add('layer');
		img.setAttribute('src', src);

		check.classList.add('layerToggle', 'visible-layer');
		check.setAttribute('type', 'checkbox');
		check.setAttribute('id', 'vis-'+layerName);
		check.setAttribute('name', layerName);
		check.setAttribute('data-level', id);
		checkLab.setAttribute('for', 'vis-'+layerName);
		check.checked = true;
		checkLab.classList.add('visible-toggle');

		radio.classList.add('layerSelect', 'history-item');
		radio.setAttribute('id', layerName);
		radio.setAttribute('type', 'radio');
		radio.setAttribute('name', 'activeLayer');
		radio.setAttribute('value', id);
		radioLab.setAttribute('for', layerName);
		radio.checked = true;
		radioLab.appendChild(img);

		itemWrapper.appendChild(check);
		itemWrapper.appendChild(radio);
		itemWrapper.appendChild(spanWrapper);
		spanWrapper.appendChild(radioLab);
		spanWrapper.appendChild(checkLab);

		check.addEventListener('click', (e) => {
			eventManager.dispatch(eventNames.TOGGLE_LAYER, {level:Number(e.target.dataset.level), active:e.target.checked});
		});
		radio.addEventListener('change', (e) => {
			eventManager.dispatch(eventNames.SET_ACTIVE_LAYER, document.querySelector('input[name="activeLayer"]:checked').value);
		});

		this.historyList.appendChild(itemWrapper);
	}
}