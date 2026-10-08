import { getDoc, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore"
import BaseDocument, { type DocumentData, type FormData } from "./baseDocument"
import type { UserType } from "@/utils"
import Admin from "./admin.model"
import Patient from "./patient.model"
import Professional from "./professional.model"

export type { UserType } from "@/utils"

export default class User extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public email: string = "",
		public name: string = "",
		public phone: string = "",
		public cpf: string = "",
		public user_type: UserType = "patient",
		public created_at: Timestamp | null = null,
	) {
		super()
	}

	static readonly collectionName = "users"

	protected static documentConverter(id: string, data: DocumentData): User {
		return new User(
			id,
			data.email,
			data.name,
			data.phone,
			data.cpf,
			data.user_type,
			data.created_at,
		)
	}

	static async get(id: string): Promise<User | Patient | Professional | Admin | null> {
		const snapshot = await getDoc(this.ref(id))
		if (snapshot.exists()) {
			switch (snapshot.data().user_type) {
				case "patient": {
					return Patient.fromDocument(snapshot) as Patient
				}
				case "professional": {
					return Professional.fromDocument(snapshot) as Professional
				}
				default:
					return this.fromDocument(snapshot) as User
			}
		}

		return Admin.get(id)
	}

	static async create(id: string, data: FormData) {
		await setDoc(this.ref(id), {
			...data,
			created_at: serverTimestamp(),
		})
	}

	toMap(): FormData {
		return {
			email: this.email,
			name: this.name,
			phone: this.phone,
			cpf: this.cpf,
			user_type: this.user_type,
			created_at: serverTimestamp(),
		}
	}
}
