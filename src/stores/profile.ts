import {defineStore} from 'pinia';

import {User} from "src/api";

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: {} as User,
    token: ''
  }),

  getters: {
    getBearerToken: (state) => {
      return state.token ? 'Bearer ' + state.token : '';
    }
  },

  actions: {
    setUser(user: User) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("profile/isLoggedIn", "true");
    },
    logout() {
      this.user = {} as User;
      this.token = '';
      localStorage.setItem("profile/isLoggedIn", "false");
    }
  }
});
