<template>
  <div class="bg-white">
    <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
      <li v-for="el in tasks" :key="el.parent_category">
        <p>{{ el.category }}</p>
        <nested-draggable
          :tasks="el.parent_category"
          class="bg-gray-100 pl-5"
        />
      </li>
    </draggable>
  </div>
</template>
<script>
import { VueDraggableNext } from 'vue-draggable-next';
export default {
  props: {
    tasks: {
      required: true,
      type: Array,
    },
  },
  components: {
    draggable: VueDraggableNext,
  },
  name: 'nested-draggable',
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
