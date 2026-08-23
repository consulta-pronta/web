import { createSymptom, type SymptomData } from "@/services/symptomService"
import { Timestamp } from "firebase/firestore"
import { defineStore } from "pinia"
import { ref } from "vue"


export const useSymptomStore = defineStore("symptom", () => {
	const title = ref("")
	const description = ref("")
	const date_time = ref(new Date().toISOString())
	const place = ref("")
	const intensity = ref(0)


	const submitForm = async (userUid: string) => {
		const uid = await createSymptom(userUid, {
			title: title.value,
			description: description.value,
			date_time: Timestamp.fromDate(new Date(date_time.value)),
			place: place.value,
			intensity: intensity.value as number,
		} as SymptomData);

		console.log(`Successfuly created symptom of id ${uid}`)
	}


	return {
		title, description, date_time, place, intensity,
		submitForm
	}
})