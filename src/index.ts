import { User } from "./models/User";

const user = User.buildUser({
	id: 1,
	name: "new name",
	age: 20,
});

console.log(user.getAll());
