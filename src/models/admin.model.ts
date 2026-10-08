import type { UserType } from "@/utils"
import BaseDocument, { type DocumentData } from "./baseDocument"

export default class Admin extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public email: string = "",
		public name: string = "",
		public user_type: UserType = "admin",
	) {
		super()
	}

	static readonly collectionName = "admins"

	protected static documentConverter(id: string, data: DocumentData): Admin {
		return new Admin(
			id,
			data.email,
			data.name,
			"admin",
		)
	}

	static async get(id: string): Promise<Admin | null> {
		return super.get(id) as Promise<Admin | null>
	}
}