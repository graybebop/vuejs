<template>
  <q-form class="q-pa-md bg-white q-mt-md" @submit.prevent="updateTemplate()">
    <div class="q-gutter-md">
      <q-input v-model="title" label="제목" />
      <div class="row no-wrap justify-between content-stretch">
        <div class="col">
          <div class="row">
            <div class="col">
              {{ categoryName }}
            </div>
            <div class="col">
              <q-select
                v-model="categoryName"
                lablel="수정할 분류를 선택하세요."
                :options="optionCategory"
                map-options
                behavior="menu"
                emit-value
                class="q-ml-lg"
                @update:model-value="getOption($event)"
              />
            </div>
          </div>
        </div>
        <div class="col q-ml-md">
          <q-input v-model="price" label="가격" type="number" />
        </div>
      </div>

      <Sortable
        :list="photo"
        :itemKey="(element) => element.id"
        tag="div"
        :options="sortableOptions"
        @choose="(event) => console.log(event)"
        @end="updateThumbsOrder"
        class="row q-gutter-sm thumbnail-wrapper"
      >
        <template #item="{ element, index }">
          <div
            :key="element.id"
            class="thumbnail order"
            style="width: 250px; height: auto"
            :data-index="index"
            :data-filename="element.file_name"
            :data-id="element.id"
          >
            <q-card class="my-card" flat bordered>
              <q-img
                :src="`${baseUrl}/images/thumbnail/thumb_${element.file_name}`"
                loading="lazy"
                spinner-color="white"
                height="auto"
                style="max-width: 250px"
              >
                <div class="absolute-bottom">
                  <div class="text-sm">{{ element.id }} : {{ index }}</div>
                </div>
              </q-img>

              <q-card-actions align="right">
                <q-btn flat @click="deleteImage(element.id, index)">삭제</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </Sortable>

      <div class="">
        <q-uploader
          url="http://localhost:4444/upload"
          label="스와이프 이미지"
          multiple
          style="max-width: 100%"
          flat
          bordered
          color="purple"
          @added="file_selected"
        />
      </div>
      <q-input v-model="summary" autogrow type="textarea" label="요약" />
      <q-editor
        :rules="[(val) => !!val || '필수입력']"
        label=""
        v-model="content"
        min-height="25rem"
        class="q-mt-lg"
        :dense="$q.screen.lt.md"
        :definitions="definitions"
        :toolbar="[
          [
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify'],
            },
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify'],
            },
          ],
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['token', 'hr', 'link', 'custom_btn'],
          ['print', 'fullscreen'],

          [
            {
              label: $q.lang.editor.formatting,
              icon: $q.iconSet.editor.formatting,
              list: 'no-icons',
              options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
            },
            {
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7',
              ],
            },
            {
              label: $q.lang.editor.defaultFont,
              icon: $q.iconSet.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'default_font',
                'arial',
                'arial_black',
                'comic_sans',
                'courier_new',
                'impact',
                'lucida_grande',
                'times_new_roman',
                'verdana',
              ],
            },
            'removeFormat',
          ],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

          ['undo', 'redo'],
          ['insert_img'],
          ['viewsource'],
        ]"
        :fonts="{
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana',
        }"
      />
      <div class="row no-wrap justify-center">
        <q-btn
          label="수정"
          type="submit"
          color="primary"
          class="q-px-lg q-py-xs"
        />
        <q-btn
          label="취소"
          type="reset"
          color="primary"
          class="q-ml-sm q-px-lg q-py-xs"
          flat
          to="/admin/template/list"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref, watch, inject } from 'vue';
import { useTemplateStore } from 'src/stores/templates/template';

import { useRoute } from 'vue-router';
import { Sortable } from 'sortablejs-vue3';

const loadingHandler = inject('loadingHandler');

const route = useRoute();

const optionCategory = ref([]);
const summary = ref(null);
const title = ref(null);
const content = ref('');
const category = ref('');
const categoryName = ref('');
const categoryId = ref('');
const categoryValue = ref([]);
const price = ref(null);
const templateInfo = ref({});
const templateStore = useTemplateStore();

const photo = ref([]);
const addMorePhoto = ref([]);
const baseUrl = ref('http://127.0.0.1:8000');
const detailData = ref({});
const image_order = ref([]);

//에디터 이미지 첨부 삽입시 필요 ---- Start
const contentPhoto = ref([]);
const definitions = {
  insert_img: {
    tip: '사진첨부',
    icon: 'camera',
    label: '이미지',
    handler: insertImg,
  },
};

async function insertImg() {
  const input = document.createElement('input');
  input.type = 'file';
  input.setAttribute('multiple', '');
  input.accept = '.png, .jpg';

  input.onchange = (_) => {
    const files = Array.from(input.files);
    templateStore.upladImage(files);
  };
  input.click();
}

watch(
  () => templateStore.uploadImages,
  function () {
    contentPhoto.value = templateStore.uploadImages;

    contentPhoto.value.forEach((photo) => {
      content.value += `<div><img style="max-width: 600px;" src="${baseUrl.value}/images/detail/${photo.imagePath}" /></div>`;
    });
  }
);

//에디터 삽입시 필요 ---- End

// watch(
//   () => templateStore.detailData,
//   async function () {
//     title.value = templateStore.detailData.template_name;
//     content.value = templateStore.detailData.content;
//     summary.value = templateStore.detailData.summary;
//     price.value = templateStore.detailData.price;
//   }
// );

// watch(
//   () => optionCategory,
//   function () {
//     category.value = optionCategory;
//     consolog(category.value);
//   }
// );

//페이지 로딩
watch(
  () => templateStore.pageLoadingState,
  function () {
    if (templateStore.pageLoadingState) {
      loadingHandler.showLoading();
    } else {
      loadingHandler.hideLoading();
    }
  }
);

//페이지 로딩
// watch(
//   () => category.value,
//   function () {
//     categoryId.value = category.value.id;
//     categoryName.value = category.value.category;
//   }
// );

function file_selected(files) {
  addMorePhoto.value = files;
}

function updateTemplate() {
  templateInfo.value = {
    title: title.value,
    content: content.value,
    category_name: categoryName.value,
    category_id: categoryId.value,
    summary: summary.value,
    price: price.value,
    status: 'active',
    photo: addMorePhoto.value,
    id: route.query.id,
    orders: image_order.value,
  };

  templateStore.updateTemplate(templateInfo.value);
}

const sortableOptions = {
  scrollSensitivity: 12,
  scrollSpeed: 10,
  animation: 150,
  delay: 0,
  easing: 'cubic-bezier(1, 0, 0, 1)',
  ghostClass: 'sortable-ghost', // Class name for the drop placeholder
  chosenClass: 'sortable-chosen', // Class name for the chosen item
  dragClass: 'sortable-drag', // Class name for the dragging item
  draggable: '.thumbnail', // Specifies which items inside the element should be draggable
};
function updateThumbsOrder(event) {
  const newIndex = event.newIndex;
  const oldIndex = event.oldIndex;

  // 업데이트된 요소들의 data-index 속성 업데이트
  const thumbnailListEl = event.from;
  const thumbnailItemListEls = thumbnailListEl.querySelectorAll('.thumbnail');
  const start = Math.min(oldIndex, newIndex);
  const end = Math.max(oldIndex, newIndex);
  for (let i = start; i <= end; i++) {
    const thumbnailEl = thumbnailItemListEls[i];
    if (thumbnailEl) {
      thumbnailEl.setAttribute('data-index', i);
      image_order.value.push({
        id: thumbnailEl.getAttribute('data-id'),
        order: thumbnailEl.getAttribute('data-index'),
      });
    }
  }

  console.log(image_order.value);
}

onMounted(async () => {
  await templateStore.fetchTemplateData(route.query.id);

  detailData.value = templateStore.detailData;
  categoryName.value = detailData.value.category;
  price.value = detailData.value.templates[0].price;
  title.value = detailData.value.templates[0].template_name;
  summary.value = detailData.value.templates[0].summary;
  content.value = detailData.value.templates[0].content;
  photo.value = detailData.value.images;
  optionCategory.value = templateStore.category;

  categoryId.value = detailData.value.category_id;
});

function deleteImage(id, arr_start) {
  // console.log(photo.value);
  photo.value.splice(arr_start, 1);
  templateStore.deleteImage(id);
}

function getOption($event) {
  console.log($event);
  categoryName.value = $event.category;
  categoryId.value = $event.id;
}
</script>
