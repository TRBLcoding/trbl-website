export class User {
	constructor(
		public id: number,
		public auth_id: string,
		public email: string,
		public role: "User" | "Admin",
		public firstName: string,
		public lastName: string,
	) { }

	isAdmin() {
		return this.role === 'Admin'
	}

	toString() {
		return `User(${this.auth_id}, ${this.email}, ${this.role})`
	}
}
