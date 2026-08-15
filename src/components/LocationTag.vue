<script setup lang="ts">
interface Props {
	localizacao?: string
}

const props = withDefaults(defineProps<Props>(), {
	localizacao: 'Costas',
})
</script>

<template>
    <div class="flex items-center text-primarydark bg-accent rounded-md w-fit p-1">
        <span class="material-symbols-rounded text-[12px]! mr-1">
            location_on
        </span>

        <p class="text-[12px]">
            {{ props.localizacao }}
        </p>
    </div>
</template>
