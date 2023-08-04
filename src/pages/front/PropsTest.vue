<template>
  <div>{{ props.menuProps }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// //import { defineProps } from 'vue';
const props = defineProps({
  menuProps: Object,
});

onMounted(() => {
  const menus: Array[] = props.menuProps.map(
    (prop) => prop.category === '솔루션'
  );

  console.log('menus : ', menus);
});
</script>
