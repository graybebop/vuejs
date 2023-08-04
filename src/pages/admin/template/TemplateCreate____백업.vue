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
            v-model="category"
            label="분류"
            :options="optionCategory"
            behavior="menu"
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
          label="업로드 이미지"
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
import { ref, watch, inject } from 'vue';
import { useTemplateStore } from 'src/stores/templates/template';
const optionCategory = ['business', 'gallery', 'etc'];
const summary = ref(null);
const title = ref(null);
const content = ref('');
const category = ref(optionCategory[0]);
const price = ref(null);
const templateInfo = ref({});
const templateStore = useTemplateStore();
const photo = ref([]);
const contentPhoto = ref([]);
const baseUrl = ref('http://127.0.0.1:8000');

const loadingHandler = inject('loadingHandler');

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
  () => optionCategory,
  function () {
    category.value = optionCategory;
  }
);

watch(
  () => templateStore.uploadImages,
  function () {
    contentPhoto.value = templateStore.uploadImages;

    contentPhoto.value.forEach((photo) => {
      content.value += `<div><img style="max-width: 600px;" src="${baseUrl.value}/images/detail/${photo.imagePath}" /></div>`;
    });
  }
);

function file_selected(files) {
  photo.value.push(files);
}
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
function addTemplate() {
  templateInfo.value = {
    title: title.value,
    content: content.value,
    category: category.value,
    summary: summary.value,
    price: price.value,
    status: 'active',
    photo: photo.value,
  };

  templateStore.addTemplate(templateInfo.value);
}
</script>
