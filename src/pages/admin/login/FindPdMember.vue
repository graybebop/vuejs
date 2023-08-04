<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                마이리얼팁 관리자 - 비밀번호찾기
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="sendRequst()">
              <q-input
                filled
                v-model="email"
                label="이메일"
                clearable
                lazy-rules
                type="email"
                :rules="[(val) => !!val || '필수항목 입니다.']"
              />

              <div class="row justify-center">
                <q-btn label="메일보내기" type="submit" color="primary" />
              </div>

              <div class="row justify-end items-center">
                <q-btn flat label="로그인" to="/admin/login"></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useAuthStore } from 'src/stores/auth';

const showToast = inject('loadingHandler');

const email = ref('');
const storeAuth = useAuthStore();

function sendRequst() {
  storeAuth.resetPassword(email.value);
}

watch(
  () => storeAuth.findPassword,
  () => {
    showToast.showSpinnerGear(storeAuth.MSG_RESET_PASSWORD);
  }
);
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
