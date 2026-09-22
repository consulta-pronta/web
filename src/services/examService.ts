import type { Exam, ExamData } from "@/models/examModel"
import { getUserRef } from "./userService"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"

const EXAM_COLLECTION = "exams"

const getExamCollection = (patientID: string) => {
	return collection(getUserRef(patientID), EXAM_COLLECTION)
}

export const createExam = async (patientID: string, data: ExamData) => {
	const examDocument = doc(getExamCollection(patientID))
	await setDoc(examDocument, data)

	const exam = {
		id: examDocument.id,
		...data,
	} as Exam
	return exam
}

export const getExams = async (patientID: string) => {
	const snapshot = await getDocs(getExamCollection(patientID))
	const exams = snapshot.docs.map((document) => {
		return {
			id: document.id,
			...document.data(),
		} as Exam
	})

	return exams ?? []
}
