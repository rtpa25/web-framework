import axios from "axios";
import { Eventing } from "./Eventing";

export class Collection<T, K> {
	models: T[] = [];
	events: Eventing = new Eventing();
	constructor(public rootUrl: string, public deserialize: (json: K) => T) {}

	get on() {
		return this.events.on;
	}

	get trigger() {
		return this.events.trigger;
	}

	fetch = async (): Promise<void> => {
		const data = await (await axios.get(this.rootUrl)).data;
		data.forEach((value: K) => {
			const user = this.deserialize(value);
			this.models.push(user);
		});

		this.trigger("change");
	};
}
