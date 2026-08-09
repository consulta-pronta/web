<script setup lang="ts">
interface Props {
    text: string
}

const props = defineProps<Props>()
</script>

<template>
    <button type="submit" class="bg-accent px-5 rounded-md w-125.75 h-11 flex items-center justify-center text-textDark cursor-pointer">
        {{ props.text }}
    </button>
</template>
