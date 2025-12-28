import type { Database } from "$lib/supabase/database.types"
import type { Session } from "@supabase/supabase-js"

export type UserRole = Database['public']['Enums']['Role']

export type UserJSON = Database['public']['Tables']['users']['Row']

/**
 * Domain model representing a user.
 * 
 * Saved in the users table.
 */
export class User {
	constructor(
		public id: number,
		public auth_id: string,
		public email: string,
		public role: UserRole,
		public firstName: string,
		public lastName: string,
	) { }

	static fromJSON(json: UserJSON) {
		return new User(
			json.id,
			json.auth_id,
			json.email,
			json.role,
			json.first_name,
			json.last_name
		)
	}

	isAdmin() {
		return this.role === 'Admin'
	}

	// Creates a shallow copy of the user, useful for updating the store
	clone() {
		return new User(this.id, this.auth_id, this.email, this.role, this.firstName, this.lastName)
	}
}
