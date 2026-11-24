import { serverTimestamp, Timestamp } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type QueryOptions,
} from "./baseDocument"
import User from "./user.model"

export type AppointmentMotivation = "Rotina" | "Sintomas" | "Prevenção" | "Entrega de exames" | "Complicações ou condições crônicas"
export type AppointmentStatus = "solicitado_paciente" | "solicitado_profissional" | "confirmado"

export default class Appointment extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public details: string = "",
		public motivation: AppointmentMotivation = "Rotina",
		public hospital: string = "",
		public date: Timestamp | null = null,
		public status: AppointmentStatus = "solicitado_paciente",
		public created_at: Timestamp | null = null,
	) {
		super()
	}

	static readonly collectionName = "consultation"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Appointment requires scope.userId")
		}
		return User.resolvePath(userId, this.collectionName)
	}

	protected static documentConverter(id: string, data: Record<string, undefined>): Appointment {
		return new Appointment(
			id,
			data.details,
			data.motivation,
			data.hospital,
			data.date,
			data.status,
			data.created_at,
		)
	}

	toMap(): Record<string, unknown> {
		return {
			details: this.details.trim(),
			motivation: this.motivation,
			hospital: this.hospital.trim(),
			date: this.date,
			status: this.status,
			created_at: serverTimestamp(),
		}
	}

	static async get(id: string, options: CollectionOptions = {}) {
		return super.get(id, options) as Promise<Appointment | null>
	}

	static async getAll(options: QueryOptions = {}) {
		return super.getAll(options) as Promise<Appointment[]>
	}

	static async set(data: Record<string, unknown>, options: CollectionOptions = {}) {
		return super.set(data, options)
	}
}
