export type CallBack = () => void;

export class Eventing {
	events: {
		[key: string]: CallBack[];
	};
	constructor() {
		this.events = {};
	}

	on(eventName: string, callBack: CallBack): void {
		if (this.events[eventName]) {
			this.events[eventName].push(callBack);
		} else {
			this.events[eventName] = [callBack];
		}
	}

	trigger(eventName: string): void {
		const handlers = this.events[eventName];
		if (!handlers || handlers.length === 0) return;
		handlers.forEach((callback) => {
			callback();
		});
	}
}
