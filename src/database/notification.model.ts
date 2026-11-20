import { orderBy, serverTimestamp, Timestamp, type DocumentSnapshot } from "firebase/firestore"
import BaseDocument, { type CollectionScope, type DocumentData } from "./baseDocument"
import User from "./user.model"
import { toBrazilianLocaleDate } from "@/utils"

export default class Notification extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public title: string = "",
		public description: string = "",
		public created_at: Timestamp | null = null,
		public accessed: boolean = false,
		public notification_type: string = "",
		public notification_scope: string = "",
		public data: Record<string, string> = {},
		public user_id: string = "",
	) {
		super()
	}

	static readonly collectionName = "notifications"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId

		if (!userId) {
			throw new Error("Notifications requires scope.userId")
		}

		return User.resolvePath(userId, this.collectionName)
	}

	protected static documentConverter(
		id: string,
		data: DocumentData,
		snapshot?: DocumentSnapshot,
	): Notification {
		return new Notification(
			id,
			data.title ?? "",
			data.description ?? "",
			data.created_at ?? null,
			data.accessed ?? false,
			data.notification_type ?? "",
			data.notification_scope ?? "",
			data.data ?? {},
			snapshot?.ref.parent.parent?.id ?? "",
		)
	}

	toMap(): Record<string, unknown> {
		return {
			title: this.title,
			description: this.description,
			accessed: this.accessed,
			notification_type: this.notification_type,
			notification_scope: this.notification_scope,
			created_at: this.created_at ?? serverTimestamp(),
			data: this.data,
		}
	}

	static async getAllForUser(userId: string) {
		return (await this.getAll({
			scope: { userId },
			constraints: [orderBy("created_at", "desc")],
		})) as Notification[]
	}

	static async markAllAsAccessed(notifications: Notification[]) {
		const unread = notifications.filter((notification) => !notification.accessed)

		await Promise.all(unread.map((notification) => notification.markAsAccessed()))
	}

	async markAsAccessed() {
		await Notification.update(this.id, { accessed: true }, { scope: { userId: this.user_id } })

		this.accessed = true
	}

	async deleteNotification() {
		await Notification.delete(this.id, { scope: { userId: this.user_id } })
	}

	getCreatedAtString() {
		return toBrazilianLocaleDate(this.created_at?.toDate())
	}
}
