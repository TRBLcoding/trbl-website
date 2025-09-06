export class User {
	constructor(
		public id: string,
		public email: string,
		public role: string,
	) { }

	toString() {
		return `User(${this.id}, ${this.email}, ${this.role})`
	}
}
