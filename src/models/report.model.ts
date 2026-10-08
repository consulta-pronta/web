import { serverTimestamp, type Timestamp } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type QueryOptions,
} from "./baseDocument"
import User from "./user.model"

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

	static readonly collectionName = "reports"
	
	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Report requires scope.userId")
		}
		return User.resolvePath(userId, this.collectionName)
	}

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

	static async get(id: string, options: CollectionOptions = {}) {
		return super.get(id, options) as Promise<Report | null>
	}

	static async getAll(options: QueryOptions = {}) {
		return super.getAll(options) as Promise<Report[]>
	}
}
