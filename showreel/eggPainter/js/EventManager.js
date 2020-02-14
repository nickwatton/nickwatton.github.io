/* Singleton Event dispatcher */
export default class EventManager {
	constructor() {
		this.subscribers = {};
	}
	subscribe(event, handler){
		if(this.subscribers[event]){
			this.subscribers[event].push(handler);
		}
		else{
			this.subscribers[event] = [handler];
		}
	}
	dispatch(event, data=null){
		if(this.subscribers[event]){
			this.subscribers[event].forEach(function(handler){
				handler(data);
			});
		}
	}
}
export let eventManager = new EventManager();