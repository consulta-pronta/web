import { DocumentSnapshot, type FieldValue, type Timestamp } from "firebase/firestore"

export const SYMPTOM_COLLECTION = "symptom"

export type Symptom = {
	id: string
	title: string
	description: string
	date_time: Timestamp
	place: string
	intensity: number
	created_at: Timestamp
	historic?: Symptom[]
}

export type SymptomData = {
	title?: string
	description?: string
	date_time?: Timestamp
	place?: string
	intensity?: number
	created_at?: FieldValue
}

export const symptomFromDocument = (doc: DocumentSnapshot) => {
	return { id: doc.id, ...doc.data() } as Symptom
}

export const extractDataFromSymptom = (symptom: Symptom) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { id, historic, ...data } = symptom

	return data
}
