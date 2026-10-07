import { serverTimestamp, Timestamp } from "firebase/firestore"
import BaseDocument, { User } from "./baseDocument"
import { auth } from "@/config/firebase"

export type ExamCategory = "laboratorial" | "imagem" | "funcional" | "preventivo"
export type ExamStatus = "solicitado" | "triagem" | "liberado" | "pendente"

export default class Exam extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public name: string = "",
		public category: ExamCategory = "laboratorial",
		public type: string = "",
		public place: string = "",
		public date: Timestamp | null = null,
		public status: ExamStatus = "solicitado",
		public created_at: Timestamp | null = null
	) {
		super()
	}

	static readonly collectionName: string = User.getCollectionPath(
		"exams",
		auth.currentUser!.uid
	)

	protected static documentConverter(id: string, data: Record<string, undefined>): Exam {
		return new Exam(
			id,
			data.name,
			data.category,
			data.type,
			data.place,
			data.date,
			data.status,
			data.created_at,
		)
	}

	toMap(): Record<string, unknown> {
		return {
			name: this.name,
			category: this.category,
			type: this.type,
			place: this.place,
			date: this.date,
			status: this.status,
			created_at: serverTimestamp(),
		}
	}

	static async get(id: string) {
		return super.get(id) as Promise<Exam | null>
	}

	static async getAll() {
		return super.getAll() as Promise<Exam[]>
	}

	static async set(data: Record<string, unknown>) {
		return super.set(data)
	}
}