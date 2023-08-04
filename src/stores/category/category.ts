import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface CategoryData {
  listData: any[];
  detailData: any[];
  categoryData: any[];
  loadingState: boolean;
  dialogState: boolean;
  pageLoadingState: boolean;
  deleteState: boolean;
  uploadImages: any[];
}

interface Category {
  id: string;
  category: string;
  label: string;
}

export const usecategoryStore = defineStore('category', {
  state: (): CategoryData => ({
    listData: [],
    detailData: [],
    categoryData: [],
    loadingState: false,
    dialogState: false,
    pageLoadingState: false,
    deleteState: false,
    uploadImages: [],
  }),
  getters: {
    getDetailData(state: CategoryData) {
      return state.detailData;
    },
  },
  actions: {
    async fetchCategoryList() {
      this.pageLoadingState = true;
      try {
        const response = await api.get('/api/category/list');
        this.pageLoadingState = false;
        this.listData = response.data.json;
        console.log(response.data.json);
      } catch (error) {
        this.pageLoadingState = false;
        console.log(error);
        return false;
      }
    },

    async fetchFilteredCategory() {
      this.pageLoadingState = true;
      try {
        const response = await api.get('/api/category/template');
        this.pageLoadingState = false;
        // this.listData = response.data.category;
        console.log(response.data.category[0].children);
        this.categoryData = response.data.category[0].children;
        return this.categoryData;
      } catch (error) {
        this.pageLoadingState = false;
        console.log(error);
        return false;
      }
    },

    async updateCategory(category: Category) {
      this.pageLoadingState = true;
      if (
        sessionStorage.getItem('access_token') &&
        sessionStorage.getItem('access_token') !== 'undefined'
      ) {
        try {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${sessionStorage.getItem('access_token')}`;

          const formData = new FormData();
          formData.append('category', category.category);
          formData.append('label', category.label);
          formData.append('id', category.id);
          formData.append('_method', 'PUT');
          const response = await api.post('/api/category/update', formData);

          console.log(response);

          this.pageLoadingState = false;
        } catch (error) {
          console.log('pageLoadingState : ', error);
          this.pageLoadingState = false;
        }
      }
    },
  },
});
