<template>
  <div>
    <q-form>
      <div class="row no-wrap">
        <div class="col-3 con-left">
          <div class="row justify-between">
            <div class="">
              <q-btn label="커테고리추가" class="q-mr-sm"></q-btn>
              <q-btn label="구분선추가"></q-btn>
            </div>

            <q-btn label="삭제"></q-btn>
          </div>
          <!-- sortable -->
          <q-list
            bordered
            separator
            class="q-mt-lg"
            v-for="(category, index) in categories"
            :key="index"
          >
            <q-expansion-item
              :label="category.category"
              expand-icon-toggle
              icon="drag_indicator"
              class="shit"
              default-opened
            >
              <q-list
                separator
                bordered
                class="q-ml-md q-mr-md q-mb-lg"
                v-for="(subcategory, j) in category.children"
                :key="j"
              >
                <q-item
                  :key="subcategory.id"
                  clickable
                  @click="
                    editCategory(
                      subcategory.id,
                      subcategory.category,
                      subcategory.label
                    )
                  "
                >
                  <q-item-section class="">{{
                    subcategory.category
                  }}</q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
          <!-- sortable -->
        </div>
        <div class="col-6 con-right">
          <!-- 커테고리 복제 -->
          <div class="row q-ml-lg" style="margin-top: 60px">
            <div class="col-12">수정할 이름으로 변경해주세요</div>
            <div class="col-6">
              <div class="row">
                <q-input
                  v-model="category_name"
                  outlined
                  label="커테고리명"
                  class="col"
                ></q-input>
                <q-input
                  v-model="category_label"
                  outlined
                  label="커테고리 라벨"
                  class="col"
                ></q-input>
                <q-btn
                  color="primary"
                  icon="edit"
                  label="수정"
                  @click="updateCategory()"
                />
              </div>
            </div>
            <!-- 커테고리 복제 -->
          </div>
        </div>
      </div>

      <br />
    </q-form>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, inject, watch, onMounted } from 'vue';

import { usecategoryStore } from 'src/stores/category/category';
const loadingHandler = inject<{
  showLoading: () => void;
  hideLoading: () => void;
}>('loadingHandler');

const categoryStore = usecategoryStore();
const category_id: Ref<string> = ref('');
const category_name: Ref<string> = ref('');
const category_label: Ref<string> = ref('');
const categories: Ref<string[]> = ref([]);

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

function editCategory(id: string, cat: string, name: string): void {
  category_id.value = id;
  category_name.value = cat;
  category_label.value = name;
}

function updateCategory(): void {
  let category = {
    id: category_id.value,
    category: category_name.value,
    label: category_label.value,
  };
  categoryStore.updateCategory(category);
  console.log('updateCategory : ', category);
}
onMounted(async () => {
  await categoryStore.fetchCategoryList();

  categories.value = categoryStore.listData;
});
</script>
