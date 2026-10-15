<script setup lang="ts">
import { computed, ref, watch } from "vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton, { type ButtonState } from "@/components/bases/BaseButton.vue"
import BaseSelect from "@/components/bases/BaseSelect.vue"
import { useAuthStore } from "@/stores/authStore.ts"
import Symptom from "@/database/symptom.model"
import { toInputValue } from "@feelinglovelynow/datetime-local"
import { Timestamp } from "firebase/firestore"
import { symptomPlaces } from "@/utils"

const props = defineProps<{
	symptomId?: string
}>()

const authStore = useAuthStore()

const buttonState = ref<ButtonState>("enabled")
const symptomData = ref(new Symptom())

const dateTimeInput = computed({
	get: () =>
		symptomData.value.date_time
			? toInputValue(symptomData.value.date_time.toDate())
			: "",
	set: (value) => {
		symptomData.value.date_time = value ? Timestamp.fromDate(new Date(value)) : null
	},
})
const placeInput = computed({
	get: () => symptomData.value.place ?? "",
	set: (value) => {
		symptomData.value.place = symptomPlaces.find((place) => place === value) ?? null
	},
})


const registrarSintoma = async () => {
	buttonState.value = "sync"

	if (authStore.user) {
		const id = authStore.user.uid
		const data = symptomData.value.toMap()

		const options = { scope: { userId: id } }
		if (props.symptomId) {
			await Symptom.update(props.symptomId, data, options)
		} else {
			await Symptom.set(data, options)
		}
		emit("handled-submit", true)
	} else {
		emit("handled-submit", false)
	}

	buttonState.value = "enabled"
}

watch(
	() => props.symptomId,
	async (newId) => {
		if (!newId) {
			symptomData.value = new Symptom()
			return
		}

		const symptom = await Symptom.get(newId, {
			scope: { userId: authStore.user!.uid },
		})
		if (symptom) {
			symptomData.value = symptom
		}
		
	},
)


const emit = defineEmits(["handled-submit"])
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
					v-model="dateTimeInput"
					type="datetime-local"
					theme="light"
					class="grow"
				/>
			</fieldset>
		</label>

		<label>
			<p>Em qual parte do corpo?</p>

			<BaseSelect
				v-model="placeInput"
				icon="location_on"
				theme="light"
				defaultValue="Localização"
				required
			>
				<template v-for="value in symptomPlaces" :key="value">
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
			{{ symptomId ? "Atualizar Sintoma" : "Registrar Sintoma" }}
		</BaseButton>
	</form>
</template>

<style scoped>
@reference "@/assets/main.css";

p {
	@apply text-textLight;
}
</style>
