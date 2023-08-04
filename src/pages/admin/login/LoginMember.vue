<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">마이리얼팁 관리자 - 로그인</div>
              <div class="row justify-center items-center">
                처음 방문 이신가요?
                <q-btn
                  label="회원가입"
                  to="/admin/signup"
                  flat
                  class="q-pa-sm"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="login">
              <q-input
                filled
                v-model="user_email"
                label="이메일"
                clearable
                lazy-rules
                type="email"
                autocomplete="user_email"
                :rules="[(val) => !!val || '필수항목 입니다.']"
              />

              <q-input
                v-model="current_password"
                autocomplete="current-password"
                filled
                label="비밀번호"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => val.length >= 8 || '필수항목 입니다.']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row justify-center">
                <q-btn label="로그인" type="submit" color="primary" />
              </div>

              <div class="row justify-end items-center">
                <q-btn flat label=" 비밀번호찾기" to="/admin/findpd"></q-btn>
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

const user_email = ref('');
const current_password = ref('');
const isPwd = ref(true);

const loadingHandler = inject('loadingHandler');
const login = async () => {
  if (
    !storeAuth.isAuthenicated &&
    user_email.value !== '' &&
    /\S+@\S+.\S+/.test(user_email.value) &&
    current_password.value !== '' &&
    current_password.value.length >= 8
  ) {
    const userInfo = {
      email: user_email.value,
      password: current_password.value,
    };
    await storeAuth.login(userInfo);
  }
};

const storeAuth = useAuthStore();

watch(
  () => storeAuth.loginState,
  function () {
    if (storeAuth.loginState) {
      loadingHandler.showLoading();
    } else {
      loadingHandler.hideLoading();
    }
  }
);
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
