import { serverTimestamp, Timestamp, where, type DocumentSnapshot } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type DocumentData,
	type QueryOptions,
} from "./baseDocument"
import User from "./user.model"
import { DATE_NOT_PROVIDED, toBrazilianLocaleDate } from "@/utils"

export type MedicationRoute =
	"oral" | "sublingual" | "externo" | "inalatorio" | "retal" | "oftalmico" | "oftologico"

export type MedicationDoseUnit =
	"miligrama" | "grama" | "micrograma" | "mililitro" | "unidade_internacional" | "tablete"

export type MedicationFrequencyUnit = "minuto" | "hora" | "dia" | "semana" | "mes"

export const doseUnitLabels: Record<MedicationDoseUnit, string> = {
	miligrama: "mg",
	grama: "g",
	micrograma: "mcg",
	mililitro: "ml",
	unidade_internacional: "UI",
	tablete: "tablete(s)",
}

export const frequencyUnitLabels: Record<MedicationFrequencyUnit, string> = {
	minuto: "minutos",
	hora: "horas",
	dia: "dias",
	semana: "semanas",
	mes: "meses",
}

export default class Medication extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public name: string = "",
		public route: MedicationRoute = "oral",
		public dose_value: number = 0,
		public dose_unit: MedicationDoseUnit = "miligrama",
		public frequency_value: number = 0,
		public frequency_unit: MedicationFrequencyUnit = "hora",
		public duration_days: number = 0,
		public start_at: Timestamp | null = null,
		public custom_instructions: string = "",
		public notes: string = "",
		public taken_dates: Record<string, boolean> = {},
		public registered_in: Timestamp | null = null,
		public last_taken_at: Timestamp | null = null,
		public patient_id: string = "",
		public prescribed_by: string = "",
	) {
		super()
	}

	static readonly collectionName = "medications"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId

		if (!userId) {
			throw new Error("Medications requires scope.userId")
		}

		return User.resolvePath(userId, this.collectionName)
	}

	protected static documentConverter(
		id: string,
		data: DocumentData,
		snapshot?: DocumentSnapshot,
	): Medication {
		return new Medication(
			id,
			data.name,
			data.route,
			data.dose_value,
			data.dose_unit,
			data.frequency_value,
			data.frequency_unit,
			data.duration_days,
			data.start_at,
			data.custom_instructions,
			data.notes,
			data.taken_dates ?? {},
			data.registered_in,
			data.last_taken_at ?? null,
			snapshot?.ref.parent.parent?.id ?? "",
			data.prescribed_by ?? "",
		)
	}

	toMap(): Record<string, unknown> {
		return {
			name: this.name,
			route: this.route,
			dose_value: this.dose_value,
			dose_unit: this.dose_unit,
			frequency_value: this.frequency_value,
			frequency_unit: this.frequency_unit,
			duration_days: this.duration_days,
			start_at: this.start_at,
			custom_instructions: this.custom_instructions,
			notes: this.notes,
			taken_dates: this.taken_dates,
			registered_in: this.registered_in ?? serverTimestamp(),
			last_taken_at: this.last_taken_at,
			prescribed_by: this.prescribed_by,
		}
	}

	static async prescribe(patientId: string, professionalId: string, medication: Medication) {
		medication.prescribed_by = professionalId

		return await this.set(medication.toMap(), { scope: { userId: patientId } })
	}

	static async getAllForProfessional(professionalId: string) {
		return await this.getAllFromCollectionGroup({
			constraints: [where("prescribed_by", "==", professionalId)],
		})
	}

	static async getAllFromCollectionGroup(options?: QueryOptions) {
		return (await super.getAllFromCollectionGroup(options)) as Medication[]
	}

	async deletePrescription() {
		await Medication.delete(this.id, { scope: { userId: this.patient_id } })
	}

	async updateDose(doseKey: string, taken: boolean, options: CollectionOptions = {}) {
		await Medication.update(
			this.id,
			{
				[`taken_dates.${doseKey}`]: taken,
			},
			options,
		)
	}

	async markTaken(taken: boolean, options: CollectionOptions = {}) {
		await Medication.update(this.id, { last_taken_at: taken ? Timestamp.now() : null }, options)
	}

	getDoseString() {
		const doseUnit =
			this.dose_value > 1
				? this.dose_unit === "unidade_internacional"
					? "unidades_internacionais"
					: this.dose_unit + "s"
				: this.dose_unit
		return `${this.dose_value} ${doseUnit.replace("_", " ")}`
	}

	getFrequencyString() {
		const frequencyUnit =
			this.frequency_value > 1
				? this.frequency_unit === "mes"
					? "meses"
					: this.frequency_unit + "s"
				: this.frequency_unit
		return `${this.frequency_value} ${frequencyUnit}`
	}

	private static addFrequency(
		date: Date,
		frequencyUnit: MedicationFrequencyUnit,
		frequencyValue: number,
	): Date {
		const next = new Date(date)

		switch (frequencyUnit) {
			case "minuto":
				next.setMinutes(next.getMinutes() + frequencyValue)
				break
			case "hora":
				next.setHours(next.getHours() + frequencyValue)
				break
			case "dia":
				next.setDate(next.getDate() + frequencyValue)
				break
			case "semana":
				next.setDate(next.getDate() + frequencyValue * 7)
				break
			case "mes":
				next.setMonth(next.getMonth() + frequencyValue)
				break
		}

		return next
	}

	private static formatDateKey(date: Date): string {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const day = String(date.getDate()).padStart(2, "0")
		const hours = String(date.getHours()).padStart(2, "0")
		const minutes = String(date.getMinutes()).padStart(2, "0")

		return `${year}-${month}-${day}T${hours}:${minutes}`
	}

	getSchedule(selectedDate: string) {
		if (!this.start_at || this.frequency_value <= 0) {
			return []
		}

		const start = this.start_at.toDate()
		const end = new Date(start)
		end.setDate(end.getDate() + this.duration_days)

		const doses: { key: string; time: string; taken: boolean }[] = []
		let current = new Date(start)

		while (current < end) {
			const key = Medication.formatDateKey(current)

			if (key.startsWith(selectedDate)) {
				doses.push({
					key,
					time: current.toLocaleTimeString("pt-BR", {
						hour: "2-digit",
						minute: "2-digit",
					}),
					taken: this.taken_dates?.[key] ?? false,
				})
			}

			current = Medication.addFrequency(current, this.frequency_unit, this.frequency_value)
		}

		return doses
	}

	getNextDoseTime(): Date | null {
		if (!this.last_taken_at) return null

		return Medication.addFrequency(
			this.last_taken_at.toDate(),
			this.frequency_unit,
			this.frequency_value,
		)
	}

	isTaken(now: number): boolean {
		const next = this.getNextDoseTime()

		return next !== null && now < next.getTime()
	}

	getEndDate(): Date | null {
		if (!this.start_at) {
			return null
		}

		const end = new Date(this.start_at.toDate())
		end.setDate(end.getDate() + this.duration_days)

		return end
	}

	getPeriodString() {
		const end = this.getEndDate()
		if (!this.start_at || !end) {
			return DATE_NOT_PROVIDED
		}

		const lastDay = new Date(end)
		lastDay.setDate(lastDay.getDate() - 1)

		const startString = toBrazilianLocaleDate(this.start_at.toDate())
		const lastDayString = toBrazilianLocaleDate(lastDay)

		return `${startString} até ${lastDayString}`
	}

	isTreatmentOver(now: number): boolean {
		const end = this.getEndDate()

		return end !== null && now >= end.getTime()
	}
}
