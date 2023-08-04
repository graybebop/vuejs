<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
          class="q-pb-lg"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                마이리얼팁 관리자 - 비밀번호 변경
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="resetPassword">
              <q-input
                v-model="current_password"
                filled
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => !!val || '비밀번호를 입력하세요',
                  (val) => val.length >= 8 || '비밀번호는 8자 이상 입력하세요',
                ]"
                required
                hint="새로운 비밀번호"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="repassword"
                filled
                :type="isPwdRe ? 'password' : 'text'"
                :rules="[
                  (val) => !!val || '비밀번호 확인을 입력하세요',
                  (val) =>
                    val === current_password || '비밀번호가 일치하지 않습니다',
                ]"
                hint="비밀번호확인"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwdRe ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdRe = !isPwdRe"
                  />
                </template>
              </q-input>

              <div class="row justify-center">
                <q-btn label="비밀번호변경" type="submit" color="primary" />
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

const current_password = ref('');
const repassword = ref('');
const isPwd = ref(true);
const isPwdRe = ref(true);

const loadingHandler = inject('loadingHandler');
const resetPassword = async () => {
  if (
    !storeAuth.isAuthenicated &&
    current_password.value !== '' &&
    current_password.value.length >= 8
  ) {
    const userInfo = {
      password: current_password.value,
    };
    //await storeAuth.login(userInfo);
  }
};

const storeAuth = useAuthStore();

// watch(
//   () => storeAuth.loginState,
//   function () {
//     if (storeAuth.loginState) {
//       loadingHandler.showLoading();
//     } else {
//       loadingHandler.hideLoading();
//     }
//   }
// );
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
