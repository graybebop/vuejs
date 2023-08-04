<template>
  <prop-test
    :title="appTitle"
    :message="appMessage"
    @click="handleClickEvent()"
  ></prop-test>
</template>

<script lang="ts" setup>
import PropTest from './PropsTest.vue';
import { onMounted, Ref, ref } from 'vue';

const appTitle: Ref<string> = ref('This is the app title');
const appMessage: Ref<string> = ref('This is the app message');

function getText<T>(text: T): T {
  return text;
}

function logText<T>(text: T): T {
  return text;
}

function testArray<T>(text: T[]): T[] {
  console.log(text.length); // 제네릭 타입이 배열이기 때문에 `length`를 허용합니다.
  return text;
}

function handleClickEvent() {
  console.log('Click event received in ParentPage.vue');
}
onMounted(() => {
  console.log(getText('hello'));
  console.log(getText(12));
  console.log(getText(true));
  console.log(logText('this is a test log text'));

  const myText: string = logText<string>('Hello!');

  const myNumber: number = logText<number>(42);

  console.log(myText);
  console.log(myNumber);

  const myArr: string[] = testArray<string>(['Dog', 'Bird']);
  console.log(myArr.length);
});
</script>
