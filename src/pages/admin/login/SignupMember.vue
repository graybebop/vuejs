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
                마이리얼팁 관리자 - 회원가입
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
              v-model="dummy"
              @submit.prevent="signup"
            >
              <q-input
                filled
                v-model="name"
                label="이름"
                clearable
                lazy-rules
                type="name"
                hint="이름"
                :rules="[(val) => !!val || '필수항목 입니다.']"
              />
              <q-input
                filled
                v-model="email"
                label="이메일"
                clearable
                lazy-rules
                type="email"
                hint="이메일"
                :rules="[
                  (val) => !!val || '이메일을 입력하세요',
                  (val) => /.+@.+/.test(val) || '올바른 이메일 형식이 아닙니다',
                ]"
                required
              />

              <q-input
                v-model="password"
                filled
                :type="isPwd ? 'password' : 'text'"
                :rules="[
                  (val) => !!val || '비밀번호를 입력하세요',
                  (val) => val.length >= 8 || '비밀번호는 8자 이상 입력하세요',
                ]"
                required
                hint="비밀번호"
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
                  (val) => val === password || '비밀번호가 일치하지 않습니다',
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
                <q-btn
                  label="확인"
                  color="primary"
                  type="submit"
                  :disabled="!valid"
                />
                <q-btn
                  outline
                  label="취소"
                  type="button"
                  class="q-ml-sm"
                  style="color: #999999"
                />
              </div>
              <div class="row justify-end items-center">
                <q-btn flat label="로그인" to="/admin/login"></q-btn>|
                <q-btn flat label="비밀번호찾기" to="/admin/findpd"></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, inject, computed } from 'vue';
import { useMemberStore } from 'src/stores/member';

const showToast = inject('loadingHandler');

const name = ref('');
const dummy = ref(null);
const password = ref('');
const repassword = ref('');
const email = ref('');
const isPwd = ref(true);
const isPwdRe = ref(true);
const valid = ref(false);
const storeMember = useMemberStore();

watch([email, password, name, repassword], () => {
  if (
    email.value !== '' &&
    /\S+@\S+.\S+/.test(email.value) &&
    name.value !== '' &&
    password.value !== '' &&
    password.value.length >= 8 &&
    password.value === repassword.value
  ) {
    valid.value = true;
  } else {
    valid.value = false;
  }
});

const showLoadingState = computed(() => {
  return storeMember.showLoadingState;
});
const signupMsg = computed(() => {
  return storeMember.signupMsg;
});

watch([showLoadingState, signupMsg], function () {
  showToast.showSpinnerGear(storeMember.signupMsg.text);

  console.log(storeMember.signupMsg.text);
});

const signup = async () => {
  // 필드 유효성 검사로 valid 값 업데이트

  if (valid.value) {
    // 필드 유효성 검사 후, useMemberStore의 register 함수 호출
    const userInfo = {
      email: email.value,
      password: password.value,
      name: name.value,
    };

    await storeMember.signup(userInfo);
  }
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
