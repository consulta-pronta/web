<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true
    },
})
</script>
<template>
    <button type="submit" class="bg-accent px-5 rounded-md w-125.75 h-11 flex items-center justify-center text-textDark cursor-pointer">
        {{ text }}
    </button>
</template>
