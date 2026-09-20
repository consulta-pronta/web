<script setup lang="ts">
import BaseInput from '@/components/bases/BaseInput.vue'
import BaseSelect from '@/components/bases/BaseSelect.vue'
import BaseButton from '@/components/bases/BaseButton.vue'
</script>

<template>
	<form @submit.prevent class="flex flex-col gap-4 z-48">
		<label>
			<p>Data de nascimento</p>
			<BaseInput
				type="date"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Endereço</p>
			<BaseInput
				type="text"
				placeholder="Digite seu endereço"
				theme="light"
				required
			/>
		</label>

		<label>
			<p>Gênero</p>
			<BaseSelect>

			</BaseSelect>
		</label>

		<BaseButton type="submit" theme="accent" class="m-auto px-10" :state="buttonState">
			Confirmar
		</BaseButton>
	</form>
</template>
