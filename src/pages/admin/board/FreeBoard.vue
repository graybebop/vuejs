<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="게시판"
      :rows="rows"
      :columns="columns"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      row-key="category"
      v-model:selected="selected"
    >
    </q-table>
    <div class="q-py-md row no-wrap justify-end">
      <q-btn
        size="16px"
        class="q-px-lg q-py-xs"
        color="black"
        label="글쓰기"
        to="/admin/board/create"
      />
    </div>

    <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->
  </div>
</template>

<script>
import { ref } from 'vue';

const columns = [
  {
    name: 'category',
    align: 'center',
    label: '분류',
    field: 'category',
    sortable: false,
  },
  {
    name: 'title',
    align: 'center',
    label: '제목',
    field: 'title',
    sortable: true,
  },
  {
    name: 'date',
    align: 'center',
    label: '등록일',
    field: 'date',
    sortable: false,
  },
];

const rows = [
  {
    category: 'freeboard1',
    title: '제목아 들어간다.2',
    date: '2023-06-12',
  },
  {
    category: 'freeboard2',
    title: '제목아 들어간다.2',
    date: '2023-06-12',
  },
  {
    category: 'freeboard3',
    title: '제목아 들어간다.4',
    date: '2023-06-12',
  },
];

export default {
  setup() {
    const selected = ref([]);

    return {
      selected,
      columns,
      rows,

      getSelectedString() {
        return selected.value.length === 0
          ? ''
          : `${selected.value.length} record${
              selected.value.length > 1 ? 's' : ''
            } selected of ${rows.length}`;
      },
    };
  },
};
</script>
