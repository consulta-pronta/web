<script setup lang="ts">
import { ref, watch } from "vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import { useAuthStore } from "@/stores/authStore.ts"
import {
	createSymptom,
	updateSymptom,
	type Symptom,
	type SymptomData,
} from "@/services/symptomService"
import { toInputValue } from "@feelinglovelynow/datetime-local"
import { Timestamp } from "firebase/firestore"

const props = defineProps<{
	symptom?: Symptom | null
}>()

const authStore = useAuthStore()

const buttonState = ref<ButtonState>("enabled")
const symptomData = ref({
	title: "",
	description: "",
	date_time: "",
	place: "",
	intensity: 0,

	loadFrom(symptom: Symptom) {
		this.title = symptom.title
		this.description = symptom.description
		this.date_time = toInputValue(symptom.date_time.toDate())
		this.place = symptom.place
		this.intensity = symptom.intensity
	},

	clear() {
		this.title = ""
		this.description = ""
		this.date_time = ""
		this.place = ""
		this.intensity = 0
	},
})

const emit = defineEmits(["handled-submit"])

const locais = ["Abdomen", "Barriga", "Cabeça", "Costas", "Olhos", "Pés", "Pescoço"]

const registrarSintoma = async () => {
	buttonState.value = "sync"

	if (authStore.user) {
		const id = authStore.user.uid
		const { title, description, date_time, place, intensity } = symptomData.value
		const data: SymptomData = {
			title,
			description,
			date_time: Timestamp.fromDate(new Date(date_time)),
			place,
			intensity,
		}

		if (props.symptom) {
			await updateSymptom(id, props.symptom.id, data)
		} else {
			await createSymptom(id, data)
		}
		emit("handled-submit", true)
	} else {
		emit("handled-submit", false)
	}

	buttonState.value = "enabled"
}

watch(
	() => props.symptom,
	(value) => {
		if (value) {
			symptomData.value.loadFrom(value)
		} else {
			symptomData.value.clear()
		}
	},
)
</script>

<template>
	<form @submit.prevent="registrarSintoma" class="flex flex-col gap-4 z-48">
		<label>
			<!-- <span class="text-red-400">*</span> -->
			<p>O que você está sentindo?</p>
			<BaseInput
				v-model="symptomData.title"
				type="text"
				placeholder="Resuma seus sintomas"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Explique com mais detalhes</p>
			<BaseInput
				v-model="symptomData.description"
				name="descricao"
				placeholder="Descreva seus sintomas com mais detalhes"
				bgColor="textLight"
				textColor="primaryDark"
			/>
		</label>

		<label>
			<p>Quando começou?</p>
			<fieldset class="flex gap-4 w-full">
				<BaseInput
					v-model="symptomData.date_time"
					type="datetime-local"
					theme="light"
					class="grow"
				/>
			</fieldset>
		</label>

		<label>
			<p>Em qual parte do corpo?</p>

			<BaseSelect
				v-model="symptomData.place"
				icon="location_on"
				theme="light"
				defaultValue="Localização"
				required
			>
				<template v-for="value in locais" :key="value">
					<option :value="value">{{ value }}</option>
				</template>
			</BaseSelect>
		</label>

		<label>
			<p>Qual a intensidade do sintoma?</p>
			<div class="flex flex-row gap-4 text-textLight w-full">
				1
				<input
					v-model="symptomData.intensity"
					type="range"
					min="1"
					max="10"
					step="1"
					class="accent-accent grow"
				/>
				10
			</div>
		</label>

		<label v-if="false">
			<p>Foto</p>
			<div class="flex flex-col items-center justify-center w-full h-full">
				<label
					for="arquivo"
					class="w-full h-[70%] border border-dashed border-surface flex flex-col items-center justify-center cursor-pointer"
				>
					<span class="material-symbols-rounded text-textLight"> photo_camera </span>
					<p class="text-textLight text-sm text-medium">Tirar foto ou enviar anexo</p>
				</label>
				<input
					id="arquivo"
					name="arquivo"
					type="file"
					accept=".jpg,.jpeg,.png,.pdf"
					class="hidden"
				/>
			</div>
		</label>
		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			{{ symptom ? "Atualizar Sintoma" : "Registrar Sintoma" }}
		</BaseButton>
	</form>
</template>

<style scoped>
@reference "@/assets/main.css";

p {
	@apply text-textLight;
}
</style>
