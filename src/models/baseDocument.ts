import { db } from "@/config/firebase";
import { collection, DocumentSnapshot } from "firebase/firestore";

export abstract class BaseDocument {
	readonly id: string = ""

	static readonly collectionName: string = ""
	
	static get collection() {
		return collection(db, this.collectionName)
	}
	getCollectionName() {
		const constructor = this.constructor as typeof BaseDocument;
		return constructor.collectionName;
	}

	static fromDocument<T extends BaseDocument>(doc: DocumentSnapshot) {
		if (!doc.exists()) { return null }
		return this.documentConverter(doc.id, doc.data()) as T
	}
	protected static documentConverter(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		data: Record<string, undefined>
	): BaseDocument {
		throw new Error("implement this >:(")
	}

	toMap(): Record<string, unknown> {
		throw new Error("implement this >:(")
	}
}



export class User extends BaseDocument {
	constructor(
		public readonly id: string = "",
	) { super() }

	static readonly collectionName = "users"

	static getCollectionPath(path: string) {
		return `${User.collectionName}/${path}`
	}
}
