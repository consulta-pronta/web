import { serverTimestamp, type Timestamp } from "firebase/firestore"
import BaseDocument, {
	type CollectionScope,
} from "./baseDocument"
import User from "./user.model"

export type MedicationRoute = "Oral" | "Sublingual" | "Externo" | "Inalatorio" | "Retal" | "Oftalmico" | "Oftologico"
export type MedicationDoseUnit = "Miligrama" | "Grama" | "Micrograma" | "Mililitro" | "Unidade_Internacional" | "Tablete"
export type MedicationFrenquencyUnit = "Minuto" | "Hora" | "Dia" | "Semana" | "Mes"

export default class Medication extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public title: string = "",
		public route: MedicationRoute = "Oral",
		public dose_value: number = 0,
		public dose_unit: MedicationDoseUnit = "Miligrama",
		public frequency_value: number = 0,
		public frequency_unit: MedicationFrenquencyUnit = "Hora",
		public duration_days: number = 0,
		public custom_instructions: string = "",
		public notes: string = "",
		public taken_dates: Record<string, boolean> = {},
		public registered_in: Timestamp | null = null,

	) {
		super()
	}

	static readonly collectionName = "Medication"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Medications requires scope.userId")
		}
		return User.resolvePath(userId, this.collectionName)
	}

	protected static documentConverter(id: string, data: Record<string, undefined>): Medication {
		return new Medication(
			id,
			data.title,
			data.dose_value,
			data.dose_unit,
			data.frequency_value,
			data.frequency_unit,
			data.duration_days,
			data.custom_instructions,
			data.notes,
			data.taken_dates,
			data.registered_in,
		)
	}

	toMap(): Record<string, unknown> {
		return {
			title: this.title,
			dose_value: this.dose_value,
			dose_unit: this.dose_unit,
			frequency_value: this.frequency_value,
			frequency_unit: this.frequency_unit,
			duration_days: this.duration_days,
			custom_instructions: this.custom_instructions,
			notes: this.notes,
			taken_dates: this.taken_dates,
			registered_in: serverTimestamp(),
		}
	}
}
