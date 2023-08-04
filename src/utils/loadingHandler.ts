import { useQuasar } from 'quasar';
import { QSpinnerGears } from 'quasar';
import { Ref } from 'vue';

export default function () {
  const $q = useQuasar();

  function showLoading(): void {
    $q.loading.show({
      message: '데이터 로딩중...',
    });
  }

  function hideLoading(): void {
    $q.loading.hide();
  }

  function showSpinnerGear(msg: Ref<string>): void {
    $q.notify({
      spinner: QSpinnerGears,
      message: msg.value,
    });
  }

  return {
    showLoading,
    hideLoading,
    showSpinnerGear,
  };
}
