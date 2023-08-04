<template>
  <div>
    <q-form @submit.prevent="handleSubmit">
      <div class="row no-wrap">
        <div class="col-3 con-left">
          <div class="row justify-between">
            <div class="">
              <q-btn
                label="커테고리추가"
                class="q-mr-sm"
                @click="addCategory"
              ></q-btn>
              <q-btn label="구분선추가"></q-btn>
            </div>

            <q-btn label="삭제"></q-btn>
          </div>
          <!-- sortable -->
          <q-list bordered separator class="q-mt-lg">
            <Sortable
              :list="categories"
              :itemKey="(element) => element.id"
              tag="div"
              :options="sortableOptions"
              @choose="(event) => console.log(event)"
              class="first-level"
              @move="checkMove"
              @start="dragging = true"
              @end="dragging = false"
            >
              <template #item="{ element }">
                <!-- <div>{{ index }} {{ element.label }}</div> -->

                <q-expansion-item
                  :label="element.label"
                  expand-icon-toggle
                  icon="drag_indicator"
                  class="shit"
                >
                  <q-list>
                    <!-- 서브커테고리 드래그 & 드롭해야함 -->
                    <q-list separator bordered class="q-ml-md q-mr-md q-mb-lg">
                      <Sortable
                        :list="element.children"
                        :itemKey="(child) => child.id"
                        tag="div"
                        :options="sortableOptions"
                        @start="dragging = true"
                        @end="dragging = false"
                        @update="onUpdate"
                      >
                        <template #item="{ element: child }">
                          <q-item :key="child.id" clickable>
                            <q-item-section class="">{{
                              child.label
                            }}</q-item-section>
                          </q-item>
                        </template>
                      </Sortable>
                    </q-list>
                    <!-- 서브커테고리 드래그 & 드롭해야함 -->
                  </q-list>
                </q-expansion-item>
              </template>
            </Sortable>
          </q-list>
          <!-- sortable -->
        </div>
        <div class="col-6 con-right">
          <!-- 커테고리 복제 -->
          <div class="row q-ml-lg" style="margin-top: 60px">
            <div class="col-6">
              <div class="">
                <q-input
                  v-model="category_name"
                  outlined
                  label="커테고리명을 적어주세요."
                ></q-input>
              </div>
            </div>

            <!-- 커테고리 복제 -->
          </div>
        </div>
      </div>

      <br />
      <q-btn type="submit">등록</q-btn>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Sortable } from 'sortablejs-vue3';

const category_name = ref('');
// const parent_id = ref('');
const dragging = ref(false);

const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)',
]);

function addCategory() {
  const newCategory = {
    label: '커테고리',
    icon: 'restaurant_menu',
    children: [], // 새로운 배열 추가
  };

  categories.value.push(newCategory);
}
function dragEnd() {
  dragging.value = false;
  console.log(dragging.value);
  console.log(categories.value);
}

function handleSubmit() {
  console.log('aaaa');
}
function checkMove() {
  console.log('움직인다');
}

function dragUpdate() {
  console.log('updated categories', categories.value);
}

const categories = ref([
  {
    label: '커테고리 1-1',
    icon: 'drag_indicator',
    children: [
      {
        label: '커테고리 2-1',
        icon: 'restaurant_menu',
      },
      {
        label: '커테고리 2-2',
        icon: 'room_service',
        disabled: true,
      },
      {
        label: '커테고리 2-3',
        icon: 'photo',
      },
    ],
  },

  {
    label: '커테고리 1-2',
    icon: 'restaurant_menu',
    children: [
      {
        label: '커테고리 2-1',
        icon: 'restaurant_menu',
      },
      {
        label: '커테고리 2-2',
        icon: 'room_service',
        disabled: true,
      },
      {
        label: '커테고리 2-3',
        icon: 'photo',
      },
    ],
  },
]);

function onUpdate(e) {
  console.log('updated categories', categories.value);
  console.log('nested categories', e.nestedCategories);
}
// onUpdate: (e) => {

//   },

const sortableOptions = {
  scrollSensitivity: 12,
  scrollSpeed: 10,
  animation: 150,
  delay: 0,
  easing: 'cubic-bezier(1, 0, 0, 1)',
  group: 'nested',
  dataIdAttr: 'data-id',
  group: 'sorting',
  sort: true,

  // ghostClass: 'sortable-ghost', // Class name for the drop placeholder
  // chosenClass: 'sortable-chosen', // Class name for the chosen item
  // dragClass: '.q-item__section--avatar', // Class name for the dragging item
  //draggable: '.q-item__section--avatar', // Specifies which items inside the element should be draggable
};

watch(
  categories.value,
  (newCategories) => {
    // Update the nested categories
    console.log(newCategories);
    for (const category of newCategories) {
      category.nestedCategories = [];
    }
  },
  { deep: true }
);
</script>
