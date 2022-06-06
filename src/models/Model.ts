import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
	set(value: T): void;
	getAll(): T;
	get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
	fetch(id: number): AxiosPromise;
	save(data: T): AxiosPromise;
}

interface Events {
	on(eventName: string, callBack: () => void): void;
	trigger(eventName: string): void;
}

interface HasId {
	id?: number;
}

export class Model<T extends HasId> {
	constructor(
		private attributes: ModelAttributes<T>,
		private events: Events,
		private sync: Sync<T>
	) {}

	on = this.events.on; //this can not be done if events was initilialized outisde the construcor inline with the type definations

	trigger = this.events.trigger;

	get = this.attributes.get;

	getAll = this.attributes.getAll;

	set(update: T): void {
		this.attributes.set(update);
		this.events.trigger("change");
	}

	fetch(): void {
		const id = this.get("id");
		if (typeof id !== "number") {
			throw new Error("can not fetch without id");
		}
		this.sync.fetch(id).then((response: AxiosResponse): void => {
			this.set(response.data); //as we need to trigger the change event
		});
	}

	save = async (): Promise<void> => {
		try {
			await this.sync.save(this.attributes.getAll());
			this.trigger("save");
		} catch (error) {
			this.trigger("error");
			console.error(error);
		}
	};
}
