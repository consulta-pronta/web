import { db } from "@/config/firebase"
import { collection, doc, DocumentSnapshot, getDoc, getDocs } from "firebase/firestore"

export default abstract class BaseDocument {
	readonly id: string = ""

	static readonly collectionName: string = ""

	static get collection() {
		return collection(db, this.collectionName)
	}
	getCollectionName() {
		const constructor = this.constructor as typeof BaseDocument
		return constructor.collectionName
	}
	static get emptyRef() {
		return doc(this.collection)
	}
	static ref(id: string) {
		return doc(this.collection, id)
	}

	static fromDocument<T extends BaseDocument>(doc: DocumentSnapshot) {
		if (!doc.exists()) {
			return null
		}
		return this.documentConverter(doc.id, doc.data()) as T
	}
	protected static documentConverter(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		data: Record<string, undefined>,
	): BaseDocument {
		throw new Error("implement this >:(")
	}

	toMap(): Record<string, unknown> {
		throw new Error("implement this >:(")
	}

	static async get(id: string) {
		const snapshot = await getDoc(this.ref(id))
		return this.fromDocument(snapshot)
	}

	static async getAll() {
		const snapshot = await getDocs(this.collection)
		const documents = snapshot.docs
			.map((doc) => this.fromDocument(doc))
			.filter((item) => item !== null)
		return documents
	}
}

export class User extends BaseDocument {
	constructor(public readonly id: string = "") {
		super()
	}

	static readonly collectionName = "users"

	static getCollectionPath(path: string, id: string) {
		return `${User.collectionName}/${id}/${path}`
	}
}
