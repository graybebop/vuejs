// @/stores/template.ts

import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

const formDataMaker = (template) => {
  const formData = new FormData();
  formData.append('title', template.title);
  formData.append('summary', template.summary);
  formData.append('category_id', template.category_id);
  formData.append('category_name', template.category_name);
  formData.append('content', template.content);
  formData.append('status', template.status);
  formData.append('price', template.price);

  //수정모드에서 id 필요
  if (template.id) {
    formData.append('_method', 'PUT');
    formData.append('id', template.id);

    // image_order 배열 내 요소를 formData에 추가합니다.
    const imageOrder = template.orders || [];
    imageOrder.forEach((item) => {
      formData.append('image_orders[]', `${item.id}:${item.order}`);

      console.log('이미지순서 : ', `${item.id}:${item.order}`);
    });

    console.log('이미지 추가 : ', template.photo);

    const photoFiles = Array.from(template.photo);
    console.log('valid : ', photoFiles);
    // Add only files which are not empty
    const validFiles = photoFiles.filter((file) => file.size > 0);

    validFiles.forEach((file) => {
      console.log('valid : ', file);
      formData.append('photo[]', file);
    });
  } else {
    const photoFiles = Array.from(template.photo[0]);

    // Add only files which are not empty
    const validFiles = photoFiles.filter((file) => file.size > 0);

    validFiles.forEach((file) => {
      formData.append('photo[]', file);
    });
  }

  return formData;
};

export const useTemplateStore = defineStore('template', {
  state: () => ({
    listData: [],
    detailData: [],
    loadingState: false,
    dialogState: false,
    pageLoadingState: false,
    deleteState: false,
    category: [],
    uploadImages: [],
    thumbnailImages: [],
  }),
  getters: {
    getDetailData(state) {
      return state.detailData;
    },
  },
  actions: {
    async fetchTemplateList() {
      this.loadingState = true;
      try {
        const response = await api.get('/api/template/list');
        this.loadingState = false;
        this.listData = response.data.json;
      } catch (error) {
        this.loadingState = false;
        console.log(error);
      }
    },

    async fetchTemplateData(id: any) {
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

          formData.append('id', id);
          const response = await api.get('/api/template/edit/' + id);

          if (response.data.message === 'success') {
            this.detailData = response.data.json;
            this.category = response.data.categories[0].children;
            this.pageLoadingState = true;

            //console.log(this.category[0].children);
          }

          this.pageLoadingState = false;
        } catch (error) {
          console.log('pageLoadingState : ', error);
          this.pageLoadingState = false;
        }
      }
    },

    async addTemplate(template: any) {
      this.pageLoadingState = true;

      const formData = formDataMaker(template);

      try {
        const response = await api.post('/api/template/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.message === 'success') {
          this.pageLoadingState = false;
          console.log(response.data);
          alert('등록했습니다.');
        } else {
          this.pageLoadingState = false;
          alert(`등록하는데 문제가 발생했습니다. \n${response.data}`);
        }
      } catch (error) {
        this.pageLoadingState = false;

        console.log(error);
      }
    },

    async updateTemplate(template: any) {
      this.pageLoadingState = true;

      const formData = formDataMaker(template);

      try {
        const response = await api.post('/api/template/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.message === 'success') {
          this.pageLoadingState = false;
          this.detailData = response.data.json;
          alert('수정했습니다.');
        } else {
          this.pageLoadingState = false;
          alert(`수정했하는데 문제가 발생했습니다. \n${response.data}`);
        }

        console.log(response);
      } catch (error) {
        this.pageLoadingState = false;

        console.log(error);
      }
    },

    async deleteTemplate(id: any) {
      try {
        this.loadingState = true;
        const formData = new FormData();
        formData.append('id', id);

        const response = await api.post('/api/template/destroy', formData);

        if (response.data.message === 'success') {
          this.loadingState = false;

          this.fetchTemplateList();
          console.log(response.data.image);
        }
      } catch (error) {
        console.log(error);

        this.loadingState = false;
      }
    },

    async upladImage(file: any) {
      this.pageLoadingState = true;

      const formData = new FormData();

      const photoFiles = Array.from(file);
      const validFiles = photoFiles.filter((file) => file.size > 0);
      validFiles.forEach((file) => {
        formData.append('photos[]', file);
      });

      try {
        const response = await api.post('/api/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.message === 'success') {
          this.uploadImages = await response.data.json;
          this.pageLoadingState = false;
        } else {
          this.pageLoadingState = false;
        }
      } catch (error) {
        this.pageLoadingState = false;

        console.log(error);
      }
    },

    async deleteImage(id: any) {
      this.pageLoadingState = true;

      const formData = new FormData();
      formData.append('id', id);

      try {
        const response = await api.post('/api/upload/delete', formData);

        if (response.data.message === 'success') {
          this.pageLoadingState = false;
        } else {
          this.pageLoadingState = false;
        }
        console.log(this.detailData);
      } catch (error) {
        this.pageLoadingState = false;

        console.log(error);
      }
    },
  },
});
