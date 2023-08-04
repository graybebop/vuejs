<template>
  <div>
    <h1>{{ props.title }}</h1>
    <p>{{ props.message }}</p>
  </div>

  <button @click="emitClickEvent">Click me to emit an event</button>
</template>

<script setup lang="ts">
//import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
  message: string;
}>();

// const { title, message } = props;

//Emit Test

const emit = defineEmits<{
  (event: 'click'): void;
}>();

function emitClickEvent() {
  emit('click');
}
</script>
