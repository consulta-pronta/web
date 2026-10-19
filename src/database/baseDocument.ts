import { db } from "@/database/firebase"
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	and,
	collectionGroup,
	query,
	setDoc,
	updateDoc,
	type DocumentSnapshot,
	type QueryCompositeFilterConstraint,
	type QueryConstraint,
	type Query,
} from "firebase/firestore"

export type DocumentData = Record<string, undefined>
export type FormData = Record<string, unknown>
export type CollectionScope = Record<string, string>

export type CollectionOptions = {
	scope?: CollectionScope
}

export type QueryOptions = CollectionOptions & {
	constraints?: QueryConstraint[]
	compositeConstraints?: QueryCompositeFilterConstraint[]
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

	static collectionGroup() {
		return collectionGroup(db, this.collectionName)
	}

	static emptyRef(options: CollectionOptions = {}) {
		return doc(this.collection(options))
	}

	static ref(id: string, options: CollectionOptions = {}) {
		return doc(this.collection(options), id)
	}

	static fromDocument<T extends BaseDocument>(snapshot: DocumentSnapshot) {
		if (!snapshot.exists()) {
			return null
		}
		return this.documentConverter(snapshot.id, snapshot.data(), snapshot) as T
	}
	
	protected static documentConverter(
		id: string,
		data: DocumentData,
		snapshot?: DocumentSnapshot,
	): BaseDocument {
		// apenas para sumir o erro
		console.log(id, data, snapshot)
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
		return this.getAllFromQuery(this.collection(options), options)
	}

	static async getAllFromCollectionGroup(options: QueryOptions = {}) {
		return this.getAllFromQuery(this.collectionGroup(), options)
	}

	private static async getAllFromQuery(target: Query, options: QueryOptions) {
		const collectionQuery = query(target, ...(options.constraints ?? []))
		const compositeConstraints = options.compositeConstraints ?? []
		const constrainedQuery =
			compositeConstraints.length > 0
				? query(collectionQuery, and(...compositeConstraints))
				: collectionQuery
		const snapshot = await getDocs(constrainedQuery)
		const documents = snapshot.docs
			.map((doc) => this.fromDocument(doc))
			.filter((item) => item !== null)
		return documents
	}

	static async set(data: FormData, options: CollectionOptions = {}) {
		const existingId = options.scope?.id
		const doc = (existingId)
			? this.ref(existingId, options)
			: this.emptyRef(options)
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
