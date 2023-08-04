// @/stores/auth.ts
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenicated: false, // 로그인 여부
    user: {}, // 사용자 정보
    accessToken: null, // AccessToken
    router: useRouter(),
    loginState: false,
    logoutState: false,
    findPassword: false,
    showLoadingState: false,
    MSG_RESET_PASSWORD: '로딩중',
  }),
  getters: {
    getLoggedIn(state) {
      return state.isAuthenicated;
    },

    getUserInfo(state) {
      return state.user;
    },

    getLogoutState(state) {
      return state.logoutState;
    },

    getLoginState(state) {
      return state.loginState;
    },
  },
  actions: {
    async logout() {
      if (
        sessionStorage.getItem('access_token') &&
        sessionStorage.getItem('access_token') !== 'undefined'
      ) {
        try {
          this.logoutState = true;
          await api.get('/sanctum/csrf-cookie').then(() => {
            api.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${sessionStorage.getItem('access_token')}`;
            api
              .post('/api/logout')
              .then((response) => {
                console.log(response);

                // 성공적으로 로그아웃했을 경우
                if (response.data.message === 'success') {
                  sessionStorage.removeItem('access_token');
                  this.isAuthenicated = false; // 로그아웃 상태로 변경
                  this.logoutState = false;

                  this.router.push({ path: '/admin/login' });
                }
              })
              .catch((error) => {
                console.log(error);
                this.logoutState = false;
              });
          });
        } catch (error) {
          console.log('auth : ', error);
        }
        this.logoutState = false;
      }
    },
    // 유효한 인증 토큰이 있다면, API를 호출하고 사용자 정보를 출력합니다.
    async fetchUserInfo() {
      if (
        sessionStorage.getItem('access_token') &&
        sessionStorage.getItem('access_token') !== 'undefined'
      ) {
        try {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${sessionStorage.getItem('access_token')}`;
          const response = await api.get('/api/user');

          this.user = response.data;
        } catch (error) {
          console.log('auth : ', error);
        }
      }
    },

    async hasAuth() {
      if (sessionStorage.getItem('access_token')) {
        this.isAuthenicated = true;
      } else {
        try {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${sessionStorage.getItem('access_token')}`;

          const response = await api.get('/api/user', {
            validateStatus: function (status) {
              // `status`가 401인 경우에도 오류로 간주하지 않음.
              return status === 401 || (status >= 200 && status < 300);
            },
          });

          if (response.status === 401) {
            console.log('Unauthorized'); // 또는 적절한 메시지 출력
          } else {
            this.user = response.data;

            this.isAuthenicated = true;
          }
        } catch (error) {
          console.log('hasAuth error:', error);
          this.isAuthenicated = false;
        }
      }
      console.log('18', this.isAuthenicated);
      return this.isAuthenicated;
    },
    async login(user: any) {
      if (this.isAuthenicated) {
        console.log('로그인 되어 있습니다.');
      } else {
        this.loginState = true;
        console.log('showLoadingState:', this.loginState);

        await api.get('/sanctum/csrf-cookie').then(() => {
          const formData = new FormData();
          formData.append('email', user.email);
          formData.append('password', user.password);

          api
            .post('/api/login', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'X-Requested-With': 'XMLHttpRequest',
              },
            })
            .then((response) => {
              this.loginState = false;

              const { data } = response;
              console.log(data.message, 'user : ', data.user);
              this.user = data.user;

              // AccessToken 저장
              const accessToken = data.access_token;
              sessionStorage.setItem('access_token', accessToken);
              this.accessToken = accessToken;

              // 사용자 정보 저장
              this.user = data.user;

              // 로그인 처리

              // 성공적인 응답을 받으면 /admin/member로 이동
              if (data.message === 'success') {
                this.isAuthenicated = true;
                this.router.push({ path: '/admin/member' });
              } else if (data.message === 'fail') {
                this.isAuthenicated = false;
                alert(
                  '이메일과 비밀번호가 일치하지 않습니다. 다시 확인해주세요.'
                );
              }
            })
            .catch((error) => {
              console.log('서버 에러: ', error.response.data.message);

              this.loginState = false;
              if (
                error.response.status === 422 ||
                error.response.status === 401
              ) {
                // 서버에서 받은 메시지를 출력하거나 사용자에게 알리기
                alert(error.response.data.message);
              } else {
                alert('서버에서 오류가 발생했습니다. 다시 시도해 주세요.');
              }
            });
        });
      }
    },

    async resetPassword(email: any) {
      this.findPassword = true;

      await api.get('/sanctum/csrf-cookie').then(() => {
        const formData = new FormData();
        formData.append('email', email);

        api
          .post('/api/password/email', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-Requested-With': 'XMLHttpRequest',
            },
          })
          .then((response) => {
            this.findPassword = false;
            console.log(response.data.message);
            this.MSG_RESET_PASSWORD = response.data.message;
          })
          .catch((error) => {
            this.MSG_RESET_PASSWORD = error.message;

            return false;
          });
      });
    },
  },
});
