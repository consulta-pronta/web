import {
	serverTimestamp,
	where,
	type DocumentSnapshot,
	type Timestamp,
} from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type DocumentData,
	type FormData,
	type QueryOptions,
} from "./baseDocument"
import User from "./user.model"
import Professional from "./professional.model"
import Patient from "./patient.model"

export type MedicalPermissions = {
	read_records: boolean
	prescribe_medications: boolean
	request_exam: boolean
	request_appointments: boolean
}

export type MedicalAccessStatus = "pending" | "active" | "revoked"

export default class MedicalPermission extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public readonly patient_id: string = "",
		public readonly professional_id: string = "",
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
			throw new Error("MedicalPermission requires scope.patientId")
		}
		return User.resolvePath(patientId, this.collectionName)
	}

	protected static documentConverter(
		id: string,
		data: DocumentData,
		snapshot: DocumentSnapshot,
	): MedicalPermission {
		return new MedicalPermission(
			id,
			snapshot.ref.parent.parent?.id,
			data.professional_id,
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
			professional_id: this.professional_id,
			permissions: this.permissions,
			created_at: serverTimestamp(),
			granted_at: this.status === "active" ? serverTimestamp() : null,
			revoked_at: this.status === "revoked" ? serverTimestamp() : null,
		}
	}

	static async createRequest(professionalId: string, patientId: string) {
		const options = { scope: { patientId } }

		const existingRequest = await this.get(professionalId, options)
		if (existingRequest) { return false }

		const request = new MedicalPermission(professionalId, patientId, "pending")
		await this.set(request.toMap(), { scope: {
			patientId, id: professionalId
		}})
		return true
	}
	
	static async get(id: string, options: CollectionOptions = {}) {
		return super.get(id, options) as Promise<MedicalPermission | null>
	}

	static async getAllFromCollectionGroup(options?: QueryOptions) {
		return await super.getAllFromCollectionGroup(options) as MedicalPermission[]
	}

	static async getAllForProfessional(professionalId: string) {
		const permissions = await this.getAllFromCollectionGroup({
			constraints: [
				where("professional_id", "==", professionalId),
			]
		})
		return permissions
	}
	
	grant() { this.status = "active" }
	revoke() { this.status = "revoked" }
	toggleAcess() { this.status = this.canAcess() ? "revoked" : "active" }
	canAcess() { return this.status === "active" }
	isPending() { return this.status === "pending" }

	async acceptRequest() {
		if (!this.isPending()) {
			return
		}

		await MedicalPermission.update(
			this.id,
			{
				status: <MedicalAccessStatus>"active",
				granted_at: serverTimestamp(),
				revoked_at: null,
			},
			{ scope: { patientId: this.patient_id } },
		)
	}	

	async getPatient() { return await Patient.get(this.patient_id) }
	async getProfessional() { return await Professional.get(this.id) }
}