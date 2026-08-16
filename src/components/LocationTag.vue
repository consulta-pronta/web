<script setup lang="ts">
interface Props {
	localizacao?: string
	bgcolor?: string
	textcolor?: string
}

const props = withDefaults(defineProps<Props>(), {
	localizacao: 'Costas',
	bgColor: 'accent',
	textcolor: 'primarydark',
})
</script>

<template>
    <div :class="[`flex items-center text-${props.textcolor} bg-${props.bgcolor} rounded-md w-fit p-1`]">
        <span class="material-symbols-rounded text-[12px]! mr-1">
            location_on
        </span>

        <p class="text-[12px]">
            {{ props.localizacao }}
        </p>
    </div>
</template>
