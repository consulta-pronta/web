import type { BloodType, UserType } from "@/utils"
import User from "./user.model"
import { serverTimestamp, type DocumentData, type Timestamp } from "firebase/firestore"
import type { FormData } from "./baseDocument"

export type PatientData = {
	weight: number
	height: number
	blood_type: BloodType
}

export default class Patient extends User {
	constructor(
		public readonly id: string = "",
		public email: string = "",
		public name: string = "",
		public phone: string = "",
		public cpf: string = "",
		public user_type: UserType = "patient",
		public patient_data: PatientData | null = null,
		public created_at: Timestamp | null = null,
	) {
		super()
	}

	protected static documentConverter(id: string, data: DocumentData): Patient {
		return new Patient(
			id,
			data.email,
			data.name,
			data.phone,
			data.cpf,
			"patient",
			this.getPatientData(data),
			data.created_at,
		)
	}

	private static getPatientData(data: DocumentData): PatientData {
		return data.patient_data ?? <PatientData>{
			weight: data.data_paciente.peso,
			height: data.data_paciente.altura,
			blood_type: data.data_paciente.tipo_sanguineo,
		}
	}

	toMap(): FormData {
		return {
			email: this.email,
			name: this.name,
			phone: this.phone,
			cpf: this.cpf,
			user_type: this.user_type,
			patient_data: this.patient_data,
			created_at: serverTimestamp(),
		}
	}
}
