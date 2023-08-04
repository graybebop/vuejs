<template>
  <q-layout
    view="hHh Lpr lff"
    container
    style="height: 100vh"
    class="app-layout header-layout"
  >
    <q-header dense :style="appHeader">
      <q-toolbar>
        <q-toolbar-title
          :style="
            miniState === false ? 'visiblity:hidden' : 'visiblity:visible'
          "
        >
        </q-toolbar-title>
        <q-space />
        <div class="">
          반갑습니다.
          {{ authStore.getUserInfo.role === 'admin' ? '관리자' : '사용자' }}
          님

          <q-btn flat round dense icon="person">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column items-center">
                  <q-avatar size="72px">
                    <img
                      src="https://i.pinimg.com/originals/de/11/88/de1188e449bd79852ad8f8827d00e40c.jpg"
                    />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ authStore.getUserInfo.name }}
                  </div>

                  <q-btn
                    color="primary"
                    label="로그아웃"
                    push
                    size="sm"
                    v-close-popup
                    flat
                    @click="handleLogout()"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="drawer"
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
      :width="270"
      :breakpoint="500"
      class="app-sidebar"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <!-- Menu -->
        <div class="logo-area">관리자</div>
        <q-list bordered class="gnb">
          <q-expansion-item
            group="somegroup"
            icon="person"
            label="회원관리"
            default-opened
          >
            <q-card class="submenu">
              <q-card-section>
                <!-- submenu -->
                <q-list dense bordered padding class="rounded-borders">
                  <q-item clickable v-ripple to="/admin/member">
                    <q-item-section> 회원목록 </q-item-section>
                  </q-item>
                </q-list>

                <!-- submenu -->
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="event_note"
            label="홈페이지템플릿"
          >
            <q-card class="submenu">
              <q-card-section>
                <!-- submenu -->
                <q-list dense bordered padding class="rounded-borders">
                  <q-item clickable v-ripple to="/admin/template/list">
                    <q-item-section> 목록 </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                  <q-item clickable v-ripple to="/admin/template/create">
                    <q-item-section> 등록 </q-item-section>
                  </q-item>
                </q-list>

                <!-- submenu -->
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="shopping_cart"
            label="커테고리"
          >
            <q-card class="submenu">
              <q-card-section>
                <!-- submenu -->
                <q-list dense bordered padding class="rounded-borders">
                  <q-item clickable v-ripple to="/admin/category/create">
                    <q-item-section> 등록 </q-item-section>
                  </q-item>
                   <q-item clickable v-ripple to="/admin/category/list">
                    <q-item-section> 목록 </q-item-section>
                  </q-item>
                </q-list>

                <!-- submenu -->
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-item
            clickable
            v-ripple
            :active="link === 'settings'"
            @click="link = 'settings'"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              <q-item-label @click="handleLogout()">로그아웃</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Menu -->
      </q-scroll-area>

      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="q-px-lg q-py-md">
        <div class="q-pa-lg bg-white">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch, inject, computed } from 'vue';
import { useAuthStore } from 'src/stores/auth';
const loadingHandler = inject('loadingHandler');
const dialogComponent = inject('dialogComponent');

const miniState = ref(false);

const authStore = useAuthStore();

const drawer = ref(false);
const link = ref('inbox');
const drawerClick = (e) => {
  // if in "mini" state and user
  // click on drawer, we switch it to "normal" mode
  if (miniState.value) {
    miniState.value = false;

    // notice we have registered an event with capture flag;
    // we need to stop further propagation as this click is
    // intended for switching drawer to "normal" mode only
    e.stopPropagation();
  }
};

watch([authStore.getUserInfo], () => {
  authStore.getUserInfo;
});

//computed를 활용한 logoutState

watch(
  () => authStore.getLogoutState,
  () => {
    if (authStore.getLogoutState) {
      loadingHandler.showLoading();
    } else {
      loadingHandler.hideLoading();
    }
  }
);
function handleLogout() {
  dialogComponent.confirmDialog(
    '로그아웃',
    '로그아웃 하시겠습니까?',
    '확인',
    '취소',
    {
      func: (action) => {
        if (action) {
          console.log(action);
          authStore.logout();
        }
      },
      action: false,
    }
  );
}

const appHeader = ref('left:300px;');

watch(
  () => miniState.value,
  () => {
    console.log(drawer.value);
    if (miniState.value) {
      appHeader.value = 'left:60px';

      document.querySelector('.logo-area').textContent = '';
      document.querySelector('.logo-area').style.height = '14px';
    } else {
      appHeader.value = 'left:300px';
      document.querySelector('.logo-area').textContent = '관리자';
      document.querySelector('.logo-area').style.height = '70px';
    }
  }
);

onMounted(async () => {
  await authStore.fetchUserInfo();
  console.log(miniState.value);
});
</script>

<style lang="scss">
.toolbar-title {
  //visibility: hidden;
}
.q-toolbar {
  height: 61px;
}

.header-layout .q-btn--dense.q-btn--round {
  border-radius: 10px;
}
</style>
