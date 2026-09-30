<script setup lang="ts">
defineProps<{
	nome: string
	quantidade: string
	periodo: string
	consumo: string
}>()
</script>

<template>
	<tr class="border-t border-primarydark">
		<td class="px-4 py-3 font-bold flex justify-center items-center relative m-1.5">
			<span class="material-symbols-rounded text-primarydark absolute left-3 text-base!">
				medication
			</span>

			{{ nome }}
		</td>

		<td class="px-4 py-3">
			{{ quantidade }}
		</td>

		<td class="px-4 py-3">
			{{ periodo }}
		</td>

		<td class="px-4 py-3">
			{{ consumo }}
		</td>

		<td class="px-4 py-3">
			<input
				type="checkbox"
				class="h-4 w-4 appearance-none rounded border border-background bg-transparent checked:bg-background checked:border-background"
			/>
		</td>
	</tr>
</template>
