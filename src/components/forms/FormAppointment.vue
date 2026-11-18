<script setup lang="ts">
import BaseSelect from "@/components/bases/BaseSelect.vue"
import BaseInput from "@/components/bases/BaseInput.vue"
import BaseButton from "../bases/BaseButton.vue"

const pacientes = ["Cláudio Silva", "Joana Neto", "Ronald Jr."]


</script>

<template>
	<form
		class="flex flex-col place-items-center relative gap-2 *:w-full"
	>
		<label>
			<p>Em qual parte do corpo?</p>

			<BaseSelect
				icon="location_on"
				theme="light"
				defaultValue="Localização"
				required
			>
				<template v-for="value in pacientes" :key="value">
					<option :value="value">{{ value }}</option>
				</template>
			</BaseSelect>
		</label>

		<p>Digite a motivação da consulta</p>
		<BaseInput
			placeholder="Ex.: Consulta de Verificação"
			icon="content_paste"
		/>

		<div class="w-full grid grid-cols-2 gap-2">
			<p>Data:</p>
			<p>Hora:</p>

			<BaseInput type="date" theme="light"/>
			<BaseInput type="time" theme="light"/>
		</div>

		<br>

		<BaseButton type="submit" theme="accent">
			Enviar Proposta
		</BaseButton>
	</form>
</template>
