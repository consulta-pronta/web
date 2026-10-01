import { serverTimestamp, type Timestamp } from "firebase/firestore"
import BaseDocument from "./baseDocument"
import { User } from "./baseDocument"
import { auth } from "@/config/firebase"

export default class Report extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public title: string = "",
		public professionals: string[] = [],
		public period_start: Timestamp | null = null,
		public period_end: Timestamp | null = null,
		public created_at: Timestamp | null = null,
	) {
		super()
	}

	static readonly collectionName: string = User.getCollectionPath(
		"reports",
		auth.currentUser!.uid,
	)

	protected static documentConverter(id: string, data: Record<string, undefined>): Report {
		return new Report(
			id,
			data.title,
			data.professionals,
			data.period_start,
			data.period_end,
			data.created_at,
		)
	}

	toMap(): Record<string, unknown> {
		return {
			title: this.title,
			professionals: this.professionals,
			period_start: this.period_start,
			period_end: this.period_end,
			created_at: serverTimestamp(),
		}
	}

	static async get(id: string) {
		return super.get(id) as Promise<Report | null>
	}

	static async getAll() {
		return super.getAll() as Promise<Report[]>
	}
}
