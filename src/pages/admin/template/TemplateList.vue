<template>
  <q-table
    flat
    bordered
    title="템플릿리스트"
    :rows="templateStore.listData"
    :columns="columns"
    selection="multiple"
    row-key="id"
    v-model:selected="selected"
    :loading="loading"
    no-data-label="등록된 데이터가 없습니다."
    :pagination="initialPagination"
  >
    <template v-slot:body-cell-created_at="props">
      <q-td :props="props">
        {{ fdate(props.row.created_at) }}
      </q-td>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          round
          color="primary"
          icon="mode_edit"
          @click="edit(props.row.id)"
        />
        <q-btn
          round
          color="purple"
          glossy
          icon="delete"
          class="q-ml-sm"
          @click="confirmDelete(props.row.id)"
        />
      </q-td>
    </template>
  </q-table>
  <!-- 수정 / 상세  -->
</template>

<script setup>
import { ref, onMounted, computed, watch, inject } from 'vue';
import { useTemplateStore } from 'src/stores/templates/template';
import { formatDate } from 'src/utils/CommonUtils';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const dialogComponent = inject('dialogComponent');
const $q = useQuasar();

const templateStore = useTemplateStore();
const selected = ref([]);
const fdate = formatDate;
const router = useRouter();

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
};

onMounted(() => {
  templateStore.fetchTemplateList();
});

function edit(id) {
  router.push({
    path: '/admin/template/show',
    query: { id: id },
  });
}

//리스트 로딩
const loading = computed(() => {
  return templateStore.loadingState;
});

//페이지 로딩
watch(
  () => templateStore.loadingState,
  function () {
    if (templateStore.loadingState) {
      console.log('데이터 로딩중');
    } else {
      console.log('데이터 로드 완료', templateStore.loadingState);
    }
  }
);

function confirmDelete(id) {
  dialogComponent.confirmDialog(
    '삭제 확인',
    '정말로 삭제 하시겠습니까?',
    '확인',
    '취소',
    {
      func: (action, id) => {
        if (action) {
          templateStore.deleteTemplate(id);
        }
      },
      action: false,
      opt: id,
    }
  );
}

const columns = [
  {
    name: 'id',
    align: 'center',
    label: '아이디',
    field: 'id',
    sortable: false,
  },
  {
    name: 'category',
    align: 'center',
    label: '분야',
    field: 'category',
    sortable: true,
  },
  {
    name: 'title',
    align: 'center',
    label: '제목',
    field: 'title',
    sortable: true,
  },

  {
    name: 'created_at',
    align: 'center',
    label: '등록일',
    field: 'created_at',
    sortable: false,
  },

  {
    name: 'actions',
    align: 'center',
    label: '수정',
    field: 'actions',
    sortable: false,
  },
];
</script>
