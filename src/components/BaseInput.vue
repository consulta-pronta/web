<script setup lang="ts">
interface Props {
    placeholder: string
}

const props = defineProps<Props>()
</script>

<template>
    <input type="text" :placeholder="props.placeholder" class="bg-primaryBlue px-5 rounded-md w-125.75 h-11.75 flex items-center text-textlight placeholder:text-textlight outline-none">
</template>