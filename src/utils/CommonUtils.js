import { useQuasar } from 'quasar';

export function formatDate(isoDate) {
  const date = new Date(isoDate); // ISO 포맷의 문자열을 Date 객체로 변환합니다.

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // 시간을 오전/오후로 표시하기 위해 처리합니다.
  const ampm = hours < 12 ? 'AM' : 'PM';
  const twelveHours = hours % 12 || 12;
  const formattedTime = `${twelveHours}:${minutes} ${ampm}`;

  const formattedDate = `${year}-${month}-${day} ${formattedTime}`;

  return formattedDate;
}

export function confirmDialog(title, msssage, labek_ok, label_cancel, data) {
  const $q = useQuasar();
  $q.dialog({
    title: title,
    message: msssage,
    cancel: true,
    persistent: true,
    ok: {
      push: false,
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
    console.log('OK버튼 클릭', data);
  });
}
