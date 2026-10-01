<script setup lang="ts">
// import type { Patient } from "@/models/symptomModel"
// import { getPatient } from "@/services/symptomService"
import { useAuthStore } from "@/stores/authStore"
import { ref, watch } from "vue"

const patientId = defineModel<string>()
const isFetching = defineModel<boolean>("isFetching")

const authStore = useAuthStore()

const list = ref<unknown[]>()

// watch(patientId, async (value) => {
// 	list.value = []

// 	if (!value) {
// 		return
// 	}

// 	isFetching.value = true

// 	const patient = await getPatient(authStore.user!.uid, value)
// 	list.value = [patient]
// 	if (patient.historic) {
// 		list.value = list.value.concat(patient.historic)
// 	}

// 	isFetching.value = false
// })
</script>

<template>
	<ul
		class="flex flex-col gap-4"
		:class="false ? 'h-full justify-center items-center' : ''"
	>
		<span v-if="false" class="material-symbols-rounded animate-spin text-accent w-fit">
			sync
		</span>
		<article
			class="bg-surface text-textDark p-3 rounded-xl"
		>
			<div class="relative">
				<section>
					<h2 class="text-xl font-bold">{{ "Nomeeeeeeeeeee" }}</h2>
				</section>

				<section class="text-sm italic">
					<p>Telefone: {{ "(99) 99999-9999" }}</p>
					<p>E-mail: {{ "email@email.com" }}</p>
				</section>
			</div>
		</article>
	</ul>
</template>
