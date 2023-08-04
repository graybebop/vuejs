import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

export const useMemberStore = defineStore('member', {
  state: () => ({
    users: [],
    loadingState: false,
    dialogState: false,
    showLoadingState: false,
    deleteState: false,
    router: useRouter(),

    //로그인관련변수
    loggedIn: false, // 로그인 여부
    user: null, // 사용자 정보
    accessToken: null, // AccessToken
    signupMsg: {},
  }),
  getters: {
    getUsers(state) {
      return state.users;
    },

    getSignMsg(state) {
      return state.signupMsg;
    },
  },

  actions: {
    async fetchUsers() {
      this.loadingState = true;
      try {
        const response = await api.get('/api/member');
        this.users = response.data.json;
        this.loadingState = false;
      } catch (error) {
        console.log(error);
        this.loadingState = false;
      }
    },

    async updateUser(user: any) {
      // this.showLoadingState = true;

      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('id', user.id);
      formData.append('email', user.email);
      formData.append('name', user.name);
      formData.append('role', user.role);

      api
        .post('/api/member/' + user.id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.message === 'success') {
            this.dialogState = false;
            this.fetchUsers();
            //this.showLoadingState = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.dialogState = true;
    },

    async deleteUser(id) {
      if (this.deleteState) {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        formData.append('id', id);
        // await api.get('/sanctum/csrf-cookie');

        await api
          .post('/api/member/' + id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log(response);
            if (response.data.message === 'success') {
              this.fetchUsers();
              this.deleteState = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.deleteState = false;
          });
      }
    },

    async signup(users: any) {
      const formData = new FormData();
      formData.append('email', users.email);
      formData.append('name', users.name);
      formData.append('password', users.password);
      this.showLoadingState = true;
      this.signupMsg = { text: '로딩중' };

      await api
        .post('/api/register/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('response data message:', response.data.message); // 추가된 코드

          if (response.data.message == 'success') {
            this.router.push({ path: '/admin/login' });
          } else if (response.data.message == 'fail') {
            console.log(response.data.text);
          }
          this.showLoadingState = false;
          this.signupMsg = {
            mwssage: response.data.message,
            text: response.data.text,
          };
        })
        .catch((error) => {
          this.signupMsg = {
            text: error.message,
          };
        });
    },
  },
});
