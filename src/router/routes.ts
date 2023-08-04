import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { RouteLocationNormalized } from 'vue-router';

/***********************************************
 * 로그인시에만 이용 가능한 페이지들인 경우 처리함수
 * *********************************************/

async function goToLoginIfNotAuthenticated(to, from, next) {
  //const store = useMemberStore();
  //console.log(to, '----[ beforeEnterHandler ]-------------');
  // const authStore = useAuthStore();

  // console.log(
  //   'goToLoginIfNotAuthenticated authStore.isAuthenicated : ',
  //   authStore.getLoggedIn
  // );
  // if (authStore.isAuthenicated === false) {
  //   //   authStore.isAuthenicated = await authStore.hasAuth();
  //   // console.log(await authStore.hasAuth());
  //   return next('/admin/login');
  // }

  // if (authStore.isAuthenicated && to.path === '/') {
  //   console.log('>>> 메인화면으로 보냄 main = ');
  //   return next('/admin/member');
  // }

  next();
}

async function normalBeforeEnter(to, from, next) {
  const authStore = useAuthStore();
  authStore.isAuthenicated = await authStore.hasAuth();

  console.log(authStore.isAuthenicated);

  // if (authStore.isAuthenicated === false) {
  //   return next('/admin/login');
  // }

  next();
}

const routes: RouteRecordRaw[] = [
  {
    name: 'layout',
    path: '/layout',
    //레이아웃을 Header, Sidebar로 나눠서 페이지 작업을 한다.
    component: () => import('src/pages/front/layout/LayoutPage.vue'),
    children: [
      {
        name: 'layout-test',
        path: '/layout/test',
        component: () => import('src/pages/admin/member/MemberList.vue'),
      },
    ],
  },
  {
    name: 'home',
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        name: 'index-page',
        path: '',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/member/MemberList.vue'),
      },
      {
        name: 'admin-board',
        path: '/admin/board',
        beforeEnter: goToLoginIfNotAuthenticated,
        meta: { authRequired: true },
        component: () => import('src/pages/admin/board/FreeBoard.vue'),
      },
      {
        name: 'admin-board-cerate',
        path: '/admin/board/create',
        beforeEnter: goToLoginIfNotAuthenticated,
        meta: { authRequired: true },
        component: () => import('src/pages/admin/board/FreeBoardCreate.vue'),
      },
      {
        name: 'admin-member-list',
        path: '/admin/member',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/member/MemberList.vue'),
      },
      //템플릿
      {
        name: 'Admin-Template-Create',
        path: '/admin/template/create',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/template/TemplateCreate.vue'),
      },
      {
        name: 'Admin-Template-Edit',
        path: '/admin/template/show',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/template/TemplateShow.vue'),
      },

      {
        name: 'Admin-Template-List',
        path: '/admin/template/list',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/template/TemplateList.vue'),
      },

      {
        name: 'Admin-Create-Category',
        path: '/admin/category/create',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () =>
          import('src/pages/admin/category/CategoryCreate___create.vue'),
      },

      {
        name: 'Admin-Category-List',
        path: '/admin/category/list',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/admin/category/CategoryList.vue'),
      },
    ],
  },
  {
    name: 'admin-login',
    path: '/admin/login',

    beforeEnter: normalBeforeEnter,
    meta: { authRequired: false },
    component: () => import('src/pages/admin/login/LoginMember.vue'),
  },
  {
    name: 'admin-find-password',
    path: '/admin/findpd',
    beforeEnter: normalBeforeEnter,
    meta: { authRequired: false },
    component: () => import('src/pages/admin/login/FindPdMember.vue'),
  },
  {
    name: 'admin-register',
    path: '/admin/signup',
    beforeEnter: normalBeforeEnter,

    meta: { authRequired: false },
    component: () => import('src/pages/admin/login/SignupMember.vue'),
  },
  {
    name: 'admin-confirm-pd',
    path: '/admin/confirm-pd',
    beforeEnter: normalBeforeEnter,

    meta: { authRequired: false },
    component: () => import('src/pages/admin/login/ConfirmPassword.vue'),
  },
  //front
  {
    name: 'front',
    path: '/front',
    component: () => import('layouts/FrontLayout.vue'),

    children: [
      {
        name: 'gnb',
        path: '/front/gnb',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/front/GnbNavigation.vue'),
      },
      {
        name: 'props',
        path: '/front/props',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/front/props/ParentPage.vue'),
      },

      {
        name: 'dice',
        path: '/front/dice',
        beforeEnter: goToLoginIfNotAuthenticated,
        component: () => import('src/pages/front/game/dice/DiceGame.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/admin/:catchAll(.*)*',
    beforeEnter: normalBeforeEnter,
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
