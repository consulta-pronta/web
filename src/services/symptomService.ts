import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore"
import { getUserRef } from "./userService"
import {
	extractDataFromSymptom,
	SYMPTOM_COLLECTION,
	symptomFromDocument,
	type SymptomData,
} from "@/models/symptomModel"

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

export const getSymptom = async (userUid: string, uid: string, deep = true) => {
	const symptomDoc = await getDoc(getSymptomRef(userUid, uid))
	const symptom = symptomFromDocument(symptomDoc)
	if (deep) {
		symptom.historic = await getAllSymptoms(userUid, uid)
	}

	return symptom
}

export const getAllSymptoms = async (userUid: string, uid?: string) => {
	const collectionRef = uid ? getHistoricCollection(userUid, uid) : getSymptomCollection(userUid)
	const querySnap = await getDocs(query(collectionRef, orderBy("date_time", "desc")))
	const documents = querySnap.docs.map((document) => symptomFromDocument(document))

	return documents ?? {}
}

export const updateSymptom = async (
	userUid: string,
	uid: string,
	data: SymptomData,
	hotfix = false,
) => {
	if (hotfix) {
		await updateDoc(getSymptomRef(userUid, uid), data)
		return
	}

	const previousSymptom = await getSymptom(userUid, uid, false)

	const newHistoricDoc = doc(getHistoricCollection(userUid, uid))
	await setDoc(newHistoricDoc, extractDataFromSymptom(previousSymptom))

	updateSymptom(userUid, uid, data, true)
}

export const deleteSymptom = async (userUid: string, uid: string) => {
	await deleteDoc(getSymptomRef(userUid, uid))
}
