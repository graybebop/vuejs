<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { provide } from 'vue';
import loadingHandler from 'src/utils/loadingHandler';
import dialogComponent from 'src/utils/dialogComponent';

export default defineComponent({
  name: 'App',
  setup() {
    const { showLoading, hideLoading, showSpinnerGear } = loadingHandler();
    provide('loadingHandler', { showLoading, hideLoading, showSpinnerGear });

    const { confirmDialog } = dialogComponent();
    provide('dialogComponent', { confirmDialog });
  },
});
</script>
