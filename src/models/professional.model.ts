import type { FederalUnit, UserType } from "@/utils"
import User from "./user.model"
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	setDoc,
	type DocumentData,
	type Timestamp,
} from "firebase/firestore"
import type { FormData } from "./baseDocument"
import { db } from "@/config/firebase"

export type ProfessionalData = {
	crm: string
	uf: FederalUnit
	operation_area: string
}

export default class Professional extends User {
	constructor(
		public readonly id: string = "",
		public email: string = "",
		public name: string = "",
		public phone: string = "",
		public cpf: string = "",
		public user_type: UserType = "professional",
		public professional_data: ProfessionalData | null = null,
		public created_at: Timestamp | null = null,
	) {
		super()
	}

	static readonly requestsCollectionName = "signupRequests"

	static get requestCollection() {
		return collection(db, this.requestsCollectionName)
	}

	static emptyRequestRef() {
		return doc(this.requestCollection)
	}

	static requestRef(id: string) {
		return doc(this.requestCollection, id)
	}

	protected static documentConverter(id: string, data: DocumentData): Professional {
		return new Professional(
			id,
			data.email,
			data.name,
			data.phone,
			data.cpf,
			"professional",
			this.getProfessionalData(data),
			data.created_at,
		)
	}

	private static getProfessionalData(data: DocumentData): ProfessionalData {
		return (
			data.professional_data ??
			<ProfessionalData>{
				crm: data.data_profissional.crm,
				uf: data.data_profissional.uf,
				operation_area: data.data_profissional.local_atuacao,
			}
		)
	}

	toMap(): FormData {
		return {
			email: this.email,
			name: this.name,
			phone: this.phone,
			cpf: this.cpf,
			user_type: this.user_type,
			professional_data: this.professional_data,
			created_at: serverTimestamp(),
		}
	}

	static async createRequest(id: string, data: FormData) {
		await setDoc(this.requestRef(id), data)
		return id
	}

	static async getRequest(id: string) {
		const snapshot = await getDoc(this.requestRef(id))
		return this.fromDocument(snapshot) as Professional | null
	}

	static async getRequests() {
		const snapshot = await getDocs(this.requestCollection)
		return snapshot.docs
			.map((document) => this.fromDocument(document) as Professional)
			.filter((request) => request !== null)
	}

	static async deleteRequest(id: string) {
		await deleteDoc(this.requestRef(id))
	}
}
