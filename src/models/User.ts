import { AxiosResponse } from "axios";
import { Attributes } from "./Attributes";
import { Eventing } from "./Eventing";
import { Sync } from "./Sync";

interface UserProps {
	id?: number;
	name?: string;
	age?: number;
}

export class User {
	events: Eventing;
	sync: Sync<UserProps>;
	attributes: Attributes<UserProps>;

	constructor(attrs: UserProps) {
		this.events = new Eventing();
		this.sync = new Sync<UserProps>("http://localhost:3000/users");
		this.attributes = new Attributes<UserProps>(attrs);
	}

	get on() {
		return this.events.on;
	}

	get trigger() {
		return this.events.trigger;
	}

	get get() {
		return this.attributes.get;
	}

	set(update: UserProps): void {
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
