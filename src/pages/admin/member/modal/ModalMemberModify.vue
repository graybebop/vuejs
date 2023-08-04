<template>
  <q-dialog v-model="dialogState" persistent>
    <q-card
      style="
        max-width: 761px;
        width: 100%;

        background-color: #fff;
      "
    >
      <q-card-section>
        <div class="text-h6">회원정보수정</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="row justify-between q-mb-md">
          <q-input
            outlined
            label="이메일"
            v-model="email"
            class="q-mb-sm col"
          />
          <q-input
            outlined
            label="이름"
            v-model="name"
            class="q-mb-sm q-ml-sm col"
          />
        </div>

        <q-select
          outlined
          v-model="roleSelected"
          :options="optionsRole"
          label="권한"
          class="q-mb-md"
        />
        <q-input outlined v-model="created_at" label="등록일" />
      </q-card-section>
      <q-separator />

      <q-card-actions align="center" class="q-pa-md">
        <q-btn
          outline
          class="q-pa-sm"
          style="color: #999"
          label="취소"
          @click="store.dialogState = false"
        />
        <q-btn
          label="수정"
          class="q-pa-md"
          color="primary"
          @click="confirmModify"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, defineProps, watch, inject } from 'vue';
import { useMemberStore } from 'src/stores/member';
import { formatDate } from 'src/utils/CommonUtils';

const dialogComponent = inject('dialogComponent');

const props = defineProps(['selectedUser']);
const store = useMemberStore();

const email = ref(null);
const name = ref(null);
const created_at = ref(null);
const roleSelected = ref(null);
const roleValue = ref(null);
const userId = ref(null);
const fdate = formatDate;

const dialogState = computed(() => {
  return store.dialogState;
});

watch(
  () => props.selectedUser,
  function () {
    email.value = props.selectedUser?.email ?? '';
    roleSelected.value =
      props.selectedUser?.role === 'admin' ? '관리자' : '사용자';
    name.value = props.selectedUser?.name;
    created_at.value = fdate(props.selectedUser?.created_at);
    userId.value = props.selectedUser?.id;
  }
);

watch(
  () => roleSelected.value,
  function () {
    roleSelected.value === '관리자'
      ? (roleValue.value = 'admin')
      : (roleValue.value = 'user');

    console.log(roleValue.value);
  }
);

function confirmModify() {
  let modUser = [];

  dialogComponent.confirmDialog(
    '회원정보수정 확인',
    '정말로 수정 하시겠습니까?',
    '확인',
    '취소',
    {
      func: (action, id) => {
        if (action) {
          modUser = {
            email: email.value,
            name: name.value,
            id: id,
            created_at: created_at.value,
            role: roleValue.value,
          };
          store.updateUser(modUser);
        }
      },
      action: false,
      opt: userId.value,
    }
  );
}

const optionsRole = ['관리자', '사용자'];
</script>
