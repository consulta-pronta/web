import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavbarStore = defineStore("navbar", () => {
	const malfermita = ref(true)

	const malfermi = () => {
		malfermita.value = !malfermita.value
	}

	return { malfermita, malfermi }
})
