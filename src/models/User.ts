import { Attributes } from "./Attributes";
import { CallBack, Eventing } from "./Eventing";
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
}
