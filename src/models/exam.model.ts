import { serverTimestamp, Timestamp } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type QueryOptions,
	User,
} from "./baseDocument"

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

	static readonly collectionName = "exams"
		
	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Exam requires scope.userId")
		}
		return User.resolvePath(userId, this.collectionName)
	}

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

	static async get(id: string, options: CollectionOptions = {}) {
		return super.get(id, options) as Promise<Exam | null>
	}

	static async getAll(options: QueryOptions = {}) {
		return super.getAll(options) as Promise<Exam[]>
	}

	static async set(data: Record<string, unknown>, options: CollectionOptions = {}) {
		return super.set(data, options)
	}
}