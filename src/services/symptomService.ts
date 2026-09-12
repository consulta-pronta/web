import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore"
import { getUserRef } from "./userService"
import { SYMPTOM_COLLECTION, symptomFromDocument, type SymptomData } from "@/models/symptomModel"

const getSymptomCollection = (userUid: string) => {
	return collection(getUserRef(userUid), SYMPTOM_COLLECTION)
}

const getHistoricCollection = (userUid: string, uid: string) => {
	return collection(getSymptomRef(userUid, uid), "historic")
}

const getSymptomRef = (userUid: string, uid: string) => {
	return doc(getUserRef(userUid), SYMPTOM_COLLECTION, uid)
}

export const createSymptom = async (userUid: string, data: SymptomData) => {
	data.created_at = serverTimestamp()
	const docRef = doc(getSymptomCollection(userUid))

	await setDoc(docRef, data)
	return docRef.id
}

export const getSymptom = async (userUid: string, uid: string) => {
	const symptomDoc = await getDoc(getSymptomRef(userUid, uid))
	const symptom = symptomFromDocument(symptomDoc)

	symptom.historic = await getAllSymptoms(userUid, uid)

	return symptom
}

export const getAllSymptoms = async (userUid: string, uid?: string) => {
	const querySnap = await getDocs(
		uid ? getHistoricCollection(userUid, uid) : getSymptomCollection(userUid),
	)
	const documents = querySnap.docs.map((document) => symptomFromDocument(document))

	return documents ?? {}
}

export const updateSymptom = async (
	userUid: string,
	uid: string,
	data: SymptomData,
	generic = false,
) => {
	if (generic) {
		await updateDoc(getSymptomRef(userUid, uid), data)
		return
	}

	const newHistoricDoc = doc(getHistoricCollection(userUid, uid))
	data.created_at = serverTimestamp()
	await setDoc(newHistoricDoc, data)
}

export const deleteSymptom = async (userUid: string, uid: string) => {
	await deleteDoc(getSymptomRef(userUid, uid))
}
