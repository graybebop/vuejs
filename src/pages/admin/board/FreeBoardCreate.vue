<template>
  <q-form class="q-pa-md bg-white q-mt-md">
    <div class="q-gutter-md">
      <q-input v-model="title" label="제목" />
      <q-select
        v-model="category"
        label="분류"
        :options="stringOptions"
        behavior="menu"
      />
      <!-- <q-input v-model="content" type="textarea" label="내용" /> -->
      <q-editor v-model="content" min-height="25rem" class="q-mt-lg" />
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
        />
      </div>
    </div>
  </q-form>
</template>

<script>
//import { useQuasar } from 'quasar';
import { ref } from 'vue';
const stringOptions = ['자유게시판', '갤러리'];

export default {
  setup() {
    // const $q = useQuasar();

    const title = ref(null);
    const content = ref('What you see is <b>what</b> you get.');
    const options = ref(stringOptions);
    const category = ref(null);

    return {
      title,
      content,
      options,
      stringOptions,
      category,

      // onSubmit() {
      //   if (accept.value !== true) {
      //     $q.notify({
      //       color: 'red-5',
      //       textColor: 'white',
      //       icon: 'warning',
      //       message: 'You need to accept the license and terms first',
      //     });
      //   } else {
      //     $q.notify({
      //       color: 'green-4',
      //       textColor: 'white',
      //       icon: 'cloud_done',
      //       message: 'Submitted',
      //     });
      //   }
      // },

      // onReset() {
      //   name.value = null;
      //   age.value = null;
      //   accept.value = false;
      // },
    };
  },
};
</script>
