<template>
  <div>
    Props Test
    <div>
      <prop-test :menu-props="menuArr"></prop-test>
    </div>
  </div>
  <div>
    <h1>{{ message }}</h1>
    <button @click="updateMessage">Update message</button>
  </div>
  <div>Menu</div>
  <ul>
    <li v-for="(menu, index) in menuArr" :key="index">
      <a>{{ index }} - {{ menu.category }} </a>

      <ul v-if="menu.children">
        <li v-for="(submenu, index) in menu.children" :key="index">
          <a>{{ index }} - {{ submenu.category }}</a>
        </li>
      </ul>
    </li>
  </ul>
  <div>
    세로메뉴
    <q-expansion-item
      group="somegroup"
      icon="event_note"
      :label="menu.category"
      v-for="(menu, index) in menuArr"
      :key="index"
    >
      <q-card class="submenu" v-if="menu.children">
        <q-card-section>
          <!-- submenu -->
          <q-list dense bordered padding class="rounded-borders">
            <q-item
              clickable
              v-ripple
              v-for="(submenu, index) in menu.children"
              :key="index"
            >
              <q-item-section> {{ submenu.category }} </q-item-section>
            </q-item>
          </q-list>

          <!-- submenu -->
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>

  <div class="">
    <div class="">가로메뉴</div>
    <q-btn
      outline
      :label="menu.category"
      style="width: 280px"
      v-for="(menu, index) in menuArr"
      :key="index"
    >
      <q-menu fit>
        <q-list
          style="min-width: 100px"
          v-for="(submenu, index) in menu.children"
          :key="index"
        >
          <q-item clickable>
            <q-item-section>{{ submenu.category }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
} from 'vue';
import PropTest from './PropsTest.vue';

interface Menu {
  category: string;
  label: string;
  children?: Submenu[];
}

interface Submenu {
  id: number;
  category: string;
  label: string;
  created_at?: string;
}

const menuArr = ref<Menu[]>([
  {
    category: '솔루션',
    label: 'solutuon',
    children: [
      {
        id: 114,
        category: '게시판',
        label: 'board',
        created_at: '2023-06-25 21:15:13',
      },
      {
        id: 115,
        category: '플러그인',
        label: 'plugin',
        created_at: '2023-06-25 21:15:11',
      },
    ],
  },
  {
    category: '템플릿',
    label: 'template',
    children: [
      {
        id: 111,
        category: '갤러리',
        label: 'gallery',
        created_at: '2023-06-25 21:15:05',
      },
      {
        id: 112,
        category: '기타',
        label: 'etc',
        created_at: '2023-06-25 21:15:04',
      },
      {
        id: 110,
        category: '비즈니스',
        label: 'business',
        created_at: '2023-06-25 21:15:03',
      },
    ],
  },
]);

onMounted(() => {
  console.log(menuArr.value);
  console.log('Unmounted');
});

const message = ref('Hello Vue 3!');

const updateMessage = () => {
  message.value = 'Message updated';
};

onBeforeMount(() => {
  console.log('Before Mount');
});

onMounted(() => {
  console.log('Mounted');
});

onBeforeUpdate(() => {
  console.log('Before Update');
});

onUpdated(() => {
  console.log('Updated');
});

onBeforeUnmount(() => {
  console.log('Before Unmount');
});
</script>
