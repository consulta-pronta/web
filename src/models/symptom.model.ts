import { runTransaction, serverTimestamp, Timestamp } from "firebase/firestore"
import { orderBy, where } from "firebase/firestore"
import BaseDocument, {
	type CollectionOptions,
	type CollectionScope,
	type FormData,
	type QueryOptions,
} from "./baseDocument"
import { db } from "@/config/firebase"
import User from "./user.model"

export type SymptomOptions = CollectionOptions & {
	deep?: boolean
}

export type SymptomQueryOptions = QueryOptions & {
	symptomId?: string
}

export default class Symptom extends BaseDocument {
	constructor(
		public readonly id: string = "",
		public title: string = "",
		public description: string = "",
		public date_time: Timestamp | null = null,
		public place: string = "",
		public intensity: number = 0,
		public created_at: Timestamp | null = null,
		public historic: Symptom[] | null = null,
	) {
		super()
	}

	static readonly collectionName = "symptom"
	static readonly historicCollectionName = "historic"

	protected static getCollectionPath(scope?: CollectionScope): string {
		const userId = scope?.userId
		if (!userId) {
			throw new Error("Symptom requires scope.userId")
		}
		const symptomId = scope?.symptomId
		if (!symptomId) {
			return User.resolvePath(userId, this.collectionName)
		}

		return this.resolvePath(symptomId, this.historicCollectionName)
	}

	protected static documentConverter(id: string, data: Record<string, undefined>): Symptom {
		return new Symptom(
			id,
			data.title,
			data.description,
			data.date_time,
			data.place,
			data.intensity,
			data.created_at,
		)
	}

	toMap(): FormData {
		return {
			title: this.title,
			description: this.description,
			date_time: this.date_time,
			place: this.place,
			intensity: this.intensity,
			created_at: serverTimestamp(),
		}
	}

	static async get(id: string, options: SymptomOptions = {}): Promise<Symptom | null> {
		const symptom = (await super.get(id, options)) as Symptom | null
		if (symptom && options.deep) {
			symptom.historic = await this.getAll({
				scope: options.scope,
				symptomId: id,
			})
		}
		return symptom
	}

	static async getAll(options: SymptomQueryOptions = {}): Promise<Symptom[]> {
		if (!options.constraints) {
			options.constraints = [orderBy("date_time", "desc")]
		}
		return super.getAll(options) as Promise<Symptom[]>
	}

	static async getBetween(
		start: Timestamp,
		end: Timestamp,
		userId: string,
		deep = false,
	): Promise<Symptom[]> {
		const parentSymptoms = await this.getAll({
			scope: { userId },
			constraints: [
				where("date_time", ">=", start),
				where("date_time", "<=", end),
				orderBy("date_time", "desc"),
			],
		})

		if (!deep) {
			return parentSymptoms
		}

		const historicSymptoms = await Promise.all(
			parentSymptoms.map((symptom) =>
				this.getAll({ scope: { userId: userId, symptomId: symptom.id } }),
			),
		)

		return [...parentSymptoms, ...historicSymptoms.flat()]
			.filter((item) => item.date_time !== null)
			.sort((a, b) => b.date_time!.toMillis() - a.date_time!.toMillis())
	}

	static async set(data: FormData, options: CollectionOptions = {}) {
		return super.set(data, options)
	}

	static async update(id: string, data: FormData, options: CollectionOptions = {}) {
		const previous = await this.get(id, options)
		if (!previous) {
			throw new Error(`Symptom ${id} was not found`)
		}

		const previousData = previous.toMap()
		previousData.created_at = previous.created_at

		const historicRef = this.ref(id, {
			scope: { userId: id, symptomId: previous.id },
		})
		await runTransaction(db, async (transaction) => {
			transaction.set(historicRef, data)
			transaction.update(this.ref(id, options), data)
		})
	}

	static async delete(id: string, options: CollectionOptions = {}) {
		this.delete(id, options)
	}
}
