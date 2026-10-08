import { db } from "@/config/firebase"
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	type DocumentSnapshot,
	type QueryConstraint,
} from "firebase/firestore"

export type DocumentData = Record<string, undefined>
export type FormData = Record<string, unknown>
export type CollectionScope = Record<string, string>

export type CollectionOptions = {
	scope?: CollectionScope
}

export type QueryOptions = CollectionOptions & {
	constraints?: QueryConstraint[]
}

export default abstract class BaseDocument {
	readonly id: string = ""

	static readonly collectionName: string = ""

	getCollectionName() {
		const constructor = this.constructor as typeof BaseDocument
		return constructor.collectionName
	}

	static resolvePath(thisId: string, nextCollection: string, scope: CollectionScope = {}) {
		return [this.getCollectionPath(scope), thisId, nextCollection].join("/")
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected static getCollectionPath(scope?: CollectionScope) {
		return this.collectionName
	}

	static collection(options: CollectionOptions = {}) {
		return collection(db, this.getCollectionPath(options.scope))
	}

	static emptyRef(options: CollectionOptions = {}) {
		return doc(this.collection(options))
	}

	static ref(id: string, options: CollectionOptions = {}) {
		return doc(this.collection(options), id)
	}

	static fromDocument<T extends BaseDocument>(doc: DocumentSnapshot) {
		if (!doc.exists()) {
			return null
		}
		return this.documentConverter(doc.id, doc.data()) as T
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected static documentConverter(id: string, data: DocumentData): BaseDocument {
		throw new Error("implement this >:(")
	}

	toMap(): FormData {
		throw new Error("implement this >:(")
	}

	static async get(id: string, options: CollectionOptions = {}) {
		const snapshot = await getDoc(this.ref(id, options))
		return this.fromDocument(snapshot)
	}

	static async getAll(options: QueryOptions = {}) {
		const collectionQuery = query(this.collection(options), ...(options.constraints ?? []))
		const snapshot = await getDocs(collectionQuery)

		const documents = snapshot.docs
			.map((doc) => this.fromDocument(doc))
			.filter((item) => item !== null)
		return documents
	}

	static async set(data: FormData, options: CollectionOptions = {}) {
		const doc = this.emptyRef(options)
		await setDoc(doc, data)
		return doc.id
	}

	static async update(id: string, data: FormData, options: CollectionOptions = {}) {
		await updateDoc(this.ref(id, options), data)
	}

	static async delete(id: string, options: CollectionOptions = {}) {
		await deleteDoc(this.ref(id, options))
	}
}
