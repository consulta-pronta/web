import { serverTimestamp, Timestamp } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type QueryOptions,
} from "./baseDocument"
import User from "./user.model"

export type NotificationType = "acesso" | "aviso" | "alteracao" | "solicitacao"
export type NotificationScope = "consulta" | "medicamento" | "relatorio"

export default class Notification extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public title: string = "",
		public description: string = "",
		public accessed: boolean = false,
		public notification_type: NotificationType = "acesso",
		public notification_scope: NotificationScope = "consulta",
		public created_at: Timestamp | null = null,
		public data: Map<string, string> = new Map(),
	) {
		super()
	}

	static readonly collectionName = "notifications"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Notification requires scope.userId")
		}
		return User.resolvePath(userId, this.collectionName)
	}

	protected static documentConverter(id: string, data: Record<string, undefined>): Notification {
		return new Notification(
			id,
			data.title,
			data.description,
			data.accessed,
			data.notification_type,
			data.notification_scope,
			data.created_at,
			data.data,
		)
	}

	toMap(): Record<string, unknown> {
		return {
			title: this.title.trim(),
			description: this.description.trim(),
			accessed: this.accessed,
			notification_type: this.notification_type,
			notification_scope: this.notification_scope,
			created_at: serverTimestamp(),
			data: this.data,
		}
	}

	static async get(id: string, options: CollectionOptions = {}) {
		return super.get(id, options) as Promise<Notification | null>
	}

	static async getAll(options: QueryOptions = {}) {
		return super.getAll(options) as Promise<Notification[]>
	}

	static async set(data: Record<string, unknown>, options: CollectionOptions = {}) {
		return super.set(data, options)
	}
}
