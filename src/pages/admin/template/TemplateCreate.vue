<template>
  <q-form class="q-pa-md bg-white q-mt-md" @submit.prevent="addTemplate()">
    <div class="q-gutter-md">
      <q-input
        ref="titleRef"
        v-model="title"
        label="제목"
        :rules="[(val) => !!val || '필수입력']"
      />
      <div class="row no-wrap justify-between content-stretch">
        <div class="col">
          <q-select
            v-model="categoryName"
            label="분류"
            :options="optionCategory"
            behavior="menu"
            @update:model-value="getOption($event)"
          />
        </div>
        <div class="col q-ml-md">
          <q-input
            v-model="price"
            label="가격"
            type="number"
            :rules="[(val) => !!val || '필수입력']"
          />
        </div>
      </div>
      <div class="">
        <q-uploader
          url="http://localhost:4444/upload"
          label="스와이프 이미지"
          multiple
          style="max-width: 400px"
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
          label="등록"
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
import { ref, watch, inject, onMounted } from 'vue';
import { useTemplateStore } from 'src/stores/templates/template';

import { usecategoryStore } from 'src/stores/category/category';

const optionCategory = ref([]);
const categoryName = ref('');
const categoryId = ref('');
const categoryStore = usecategoryStore();

const summary = ref(null);
const title = ref(null);
const content = ref('');

const price = ref(null);
const templateInfo = ref({});

const photo = ref([]);

const templateStore = useTemplateStore();
const loadingHandler = inject('loadingHandler');

const baseUrl = ref('http://127.0.0.1:8000'); //에디터에 이미지가 들어가면 url까지 따라 들어가야 함 --> Vue문제

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

watch(
  () => categoryStore.categoryData,
  function () {
    optionCategory.value = categoryStore.categoryData;
  }
);

function file_selected(files) {
  photo.value.push(files);
}
//페이지 로딩시 프리로더 --- Start
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
//페이지 로딩시 프리로더 --- End

//글등록
function addTemplate() {
  templateInfo.value = {
    title: title.value,
    content: content.value,
    category_id: categoryId.value,
    category_name: categoryName.value,
    summary: summary.value,
    price: price.value,
    status: 'active',
    photo: photo.value,
  };

  templateStore.addTemplate(templateInfo.value);
}

function getOption($event) {
  console.log($event);
  categoryName.value = $event.category;
  categoryId.value = $event.id;
}

onMounted(async () => {
  await categoryStore.fetchFilteredCategory();

  optionCategory.value = categoryStore.categoryData;
  console.log(optionCategory.value);
});
</script>
