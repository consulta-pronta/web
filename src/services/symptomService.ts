import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc, type FieldValue, type Timestamp } from "firebase/firestore"
import { getUserRef } from "./userService"


export type Symptom = {
	readonly uid: string
	title: string
	description: string
	date_time: Timestamp
	place: string
	intensity: number
	created_at: Timestamp
}

export type SymptomData = {
	title?: string
	description?: string
	date_time?: Timestamp
	place?: string
	intensity?: number
	created_at?: FieldValue
}


const getSymptomCollectionFromUserRef = (userUid: string) => {
	return collection(getUserRef(userUid), "symptom")
}

const getSymptomFromUserRef = (userUid: string) => {
	return doc(getSymptomCollectionFromUserRef(userUid))
}

const getSymptomRef = (userUid: string, uid: string) => {
	return doc(getUserRef(userUid), "symptom", uid)
}


export const createSymptom = async (userUid: string, data: SymptomData) => {
	data.created_at = serverTimestamp()
	const docRef = getSymptomFromUserRef(userUid)

	await setDoc(docRef, data)
	return docRef.id
}

export const getSymptom = async (userUid: string, uid: string) => {
	const symptomSnap = await getDoc(getSymptomRef(userUid, uid))
	
	return symptomSnap.data() as Symptom ?? {}
}

export const getAllSymptoms = async (userUid: string) => {
	const querySnap = await getDocs(getSymptomCollectionFromUserRef(userUid))
	const documents = querySnap.docs.map(document => ({
		uid: document.id,
		...document.data()
	} as Symptom))

	return documents ?? {}
}

export const updateSymptom = async (userUid: string, uid: string, data: SymptomData) => {
	await updateDoc(getSymptomRef(userUid, uid), data)
}

export const deleteSymptom = async (userUid: string, uid: string) => {
	await deleteDoc(getSymptomRef(userUid, uid))
}
