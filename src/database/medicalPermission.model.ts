import { serverTimestamp, type Timestamp } from "firebase/firestore"
import BaseDocument, { type CollectionScope, type DocumentData, type FormData } from "./baseDocument"
import User from "./user.model"
import Professional from "./professional.model"

export type MedicalPermissions = {
	read_records: boolean
	prescribe_medications: boolean
	request_exam: boolean
	request_appointments: boolean
}

export type MedicalAccessStatus = "active" | "revoked"

export default class MedicalPermission extends BaseDocument {
	constructor(
		public readonly id: string = "", // id of professional
		// public readonly patient_id: string = "",
		public status: MedicalAccessStatus = "revoked",
		public permissions: MedicalPermissions = {
			read_records: false,
			prescribe_medications: false,
			request_exam: false,
			request_appointments: false,
		},
		public created_at: Timestamp | null = null,
		public granted_at: Timestamp | null = null,
		public revoked_at: Timestamp | null = null,
	) {
		super()
	}

	static readonly collectionName = "medicalPermissions"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const patientId = scope?.patientId
		if (!patientId) {
			throw new Error("MedicalPermission requires scope.userId")
		}
		return User.resolvePath(patientId, this.collectionName)
	}

	protected static documentConverter(id: string, data: DocumentData): MedicalPermission {
		return new MedicalPermission(
			id,
			data.status,
			data.permissions,
			data.created_at,
			data.granted_at,
			data.revoked_at,
		)
	}

	toMap(): FormData {
		return {
			status: this.status,
			permissions: this.permissions,
			created_at: serverTimestamp(),
			granted_at: this.status === "active" ? serverTimestamp() : null,
		}
	}

	grant() { this.status = "active" }
	revoke() { this.status = "revoked" }
	toggleAcess() { this.status = this.canAcess() ? "revoked" : "active" }
	canAcess() { return this.status === "active" }

	async getProfessional() {
		return await Professional.get(this.id)
	}
}