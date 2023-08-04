<template>
  <div class="flex justify-center">
    <div class="w-4/12 mr-2">
      <nested-draggable :tasks="categories" />
    </div>
    <rawDisplay class="w-64" :value="categories" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import nestedDraggable from './NestedDaggable.vue';
import rawDisplay from './rawDisplay.vue';
export default defineComponent({
  name: 'nested-example',
  display: 'Nested',
  order: 15,
  components: {
    rawDisplay,
    nestedDraggable,
  },
});
</script>
<script setup>
import { usecategoryStore } from 'src/stores/category/category';
import { ref, onMounted, inject, watch } from 'vue';
const loadingHandler = inject('loadingHandler');

const categoryStore = usecategoryStore();

//페이지 로딩
watch(
  () => categoryStore.pageLoadingState,
  function () {
    if (categoryStore.pageLoadingState) {
      loadingHandler.showLoading();
    } else {
      loadingHandler.hideLoading();
    }
  }
);

const categories = ref([]);

onMounted(async () => {
  await categoryStore.fetchCategoryList();

  categories.value = categoryStore.listData;
  console.log(categoryStore.listData);
});
</script>
<style scoped></style>
