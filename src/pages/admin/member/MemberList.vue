<template>
  <q-table
    flat
    bordered
    title="회원목록"
    :rows="users"
    :columns="columns"
    selection="multiple"
    row-key="name"
    v-model:selected="selected"
    :loading="loading"
    no-data-label="등록된 데이터가 없습니다."
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template v-slot:body-cell-created_at="props">
      <q-td :props="props">
        {{ fdate(props.row.created_at) }}
      </q-td>
    </template>
    <template v-slot:body-cell-role="props">
      <q-td :props="props">
        {{ props.row.role === 'admin' ? '관리자' : '사용자' }}
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          round
          color="primary"
          icon="mode_edit"
          @click="showUser(props.row)"
        />
        <q-btn
          round
          color="purple"
          glossy
          icon="delete"
          @click="confirmDelete(props.row.id)"
          class="q-ml-sm"
        />
      </q-td>
    </template>
  </q-table>
  <!-- 수정 / 상세  -->
  <!-- <modal-member-modify :users="selectedUser" /> -->
  <component :is="ModalMemberModifyComponent" :selectedUser="selectedUser" />
  <!-- 수정 / 상세  -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useMemberStore } from 'src/stores/member';
import { formatDate } from 'src/utils/CommonUtils';
import { useQuasar } from 'quasar';
import { inject } from 'vue';

const loadingHandler = inject('loadingHandler');
const dialogComponent = inject('dialogComponent');

const $q = useQuasar();

const store = useMemberStore();
const fdate = formatDate;

const email = ref(null);
const name = ref(null);
const created_at = ref(null);
const roleSelected = ref(null);
const userId = ref(null);

const selected = ref([]);

const selectedUser = ref([null]);

const users = computed(() => {
  return store.getUsers;
});

const loading = computed(() => {
  return store.loadingState;
});

//데이터 로딩
const listLoadingState = computed(() => store.showLoadingState);

watch(
  () => listLoadingState,
  function () {
    loadingHandler.showLoading();
  }
);

const showUser = (row) => {
  userId.value = row.id;
  email.value = row.email;
  name.value = row.name;
  created_at.value = fdate(row.created_at);

  if (row.role === 'admin') {
    roleSelected.value = '관리자';
  } else {
    roleSelected.value = '사용자';
  }

  selectedUser.value = row;

  store.dialogState = true;
  $q.loading.hide();
};

onMounted(() => {
  store.fetchUsers();
});

function confirmDelete(id) {
  dialogComponent.confirmDialog(
    '회원삭제 확인',
    '정말로 삭제 하시겠습니까?',
    '확인',
    '취소',
    {
      func: (action, id) => {
        if (action) {
          console.log(store, id);
          store.deleteState = true;
          store.deleteUser(id);
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
    name: 'name',
    align: 'center',
    label: '이름',
    field: 'name',
    sortable: true,
  },
  {
    name: 'email',
    align: 'center',
    label: '이메일',
    field: 'email',
    sortable: false,
  },
  {
    name: 'role',
    align: 'center',
    label: '권한',
    field: 'role',
    sortable: false,
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

<script>
import ModalMemberModifyComponent from 'src/pages/admin/member/modal/ModalMemberModify.vue'; // Dialog 플러그인 컴포넌트 불러오기
export default {
  components: {
    ModalMemberModifyComponent,
  },
};
</script>
