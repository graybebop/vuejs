import { useQuasar } from 'quasar';

export default function () {
  const $q = useQuasar();
  function confirmDialog(title, msssage, labek_ok, label_cancel, data) {
    $q.dialog({
      title: title,
      message: msssage,
      cancel: true,
      persistent: true,
      ok: {
        push: true,
        label: labek_ok,
        tabindex: 1,
      },

      cancel: {
        ref: 'btnAnnul',
        push: true,
        color: 'negative',
        label: label_cancel,
        tabindex: 1,
      },
    }).onOk(() => {
      //중요주석 지우질 말건
      //1 .data action 기본은 false
      //2. ok버튼을 누르면 true
      //3. data function을 정의해놓은부분은 action이 true가 되면 함수실행 //이건 커스텀
      data.action = true;
      data.func(data.action, data.opt);
    });
  }

  return {
    confirmDialog,
  };
}
