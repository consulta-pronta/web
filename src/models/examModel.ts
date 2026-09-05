import type { Timestamp } from "firebase/firestore"

export type ExamCategory = "laboratorial" | "imagem" | "funcional" | "preventivo"
export type ExamStatus = "solicitado" | "triagem" | "liberado" | "pendente"

export type Exam = {
	id: string
	name: string
	category: ExamCategory
	type: string
	place: string
	date: Timestamp
	status: ExamStatus
}

export type ExamData = {
	name?: string
	category?: ExamCategory
	type?: string
	place?: string
	date?: Timestamp
	status?: ExamStatus
}
