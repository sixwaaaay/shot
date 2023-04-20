import {defineStore} from 'pinia';

import {User} from "src/api";

export const useProfileStore = defineStore('profile', {
  state: () => {
    const token = localStorage.getItem("profile/token") || '';
    const userStr = localStorage.getItem("profile/user") || '{}';
    const user = JSON.parse(userStr) as User;
    return {
      user: user,
      token: token,
    }
  },

  getters: {
    getBearerToken: (state) => {
      return state.token ? 'Bearer ' + state.token : '';
    },
    getAvatarUrl: (state) => {
      return state.user.avatar_url;
    }
  },

  actions: {
    setUser(user: User) {
      // this.user = user;
      if (user.avatar_url !== null && user.avatar_url !== undefined) {
        // this.user.avatar_url = user.avatar_url;
        // response.data.avatar_url = "http://localhost:9001/images/" + response.data.avatar_url
        this.user.avatar_url = user.avatar_url;
      }
      // bio
      if (user.bio !== null && user.bio !== undefined) {
        this.user.bio = user.bio;
      }
      // email
      if (user.bg_url !== null && user.bg_url !== undefined) {
        this.user.bg_url = user.bg_url;
      }
      if (user.id !== null && user.id !== undefined) {
        this.user.id = user.id;
      }
      if (user.name !== null && user.name !== undefined) {
        this.user.name = user.name;
      }
    },
    setTokenAndUser(token: string, user: User) {
      this.setToken(token);
      this.setUser(user);
      localStorage.setItem("profile/user", JSON.stringify(user));
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("profile/isLoggedIn", "true");
      localStorage.setItem("profile/token", token);
    },
    logout() {
      this.user = {} as User;
      this.token = '';
      localStorage.setItem("profile/isLoggedIn", "false");
      localStorage.setItem("profile/token", '');
      localStorage.setItem("profile/user", '{}');
    }
  }
});
