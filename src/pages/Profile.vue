<!--
  ~ Copyright (c) 2023 sixwaaaay.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~     http://www.apache.org/licenses/LICENSE-2.
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <q-page padding style="max-width: 100vh">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <!--        a button to open the drawer-->
        <q-btn dense flat round icon="account_circle" to="/edit/profile"/>
        <q-space/>
        <q-btn dense flat round icon="menu" @click="drawer = true"/>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" show-if-above bordered side="right">
      <q-list>
        <q-item clickable @click="$router.push(
          {
            path: '/plain/followers',
            query: {user_id: user.id}
          }
        )">
          <q-item-section avatar>
            <q-icon name="people"/>
          </q-item-section>
          <q-item-section>粉丝</q-item-section>
        </q-item>
        <q-item clickable @click="$router.push(
          {
            path: '/plain/following',
            query: {user_id: user.id}
          }
        )">
          <q-item-section avatar>
            <q-icon name="people"/>
          </q-item-section>
          <q-item-section>关注</q-item-section>
        </q-item>


        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>
          <q-item-section>退出登陆</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!--    <div class="profile-header">-->
    <!--      <img :src="avatar_url" alt="avatar" class="avatar">
          <q-card class="profile-info">
            <q-card-section>
              <div class="name">{{ user.name }}</div>
              <div class="bio">{{ user.bio }}</div>
            </q-card-section>
          </q-card>-->

    <!--      <q-card style="width: 100%;">-->
    <q-item class="q-ma-sm">
      <q-item-section avatar>
        <q-avatar size="100px" class="q-mr-sm">
          <img :src="avatar_url" alt="avatar">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">{{ user.name }}</q-item-label>
        <q-item-label caption class="text-grey-8">{{ user.bio }}</q-item-label>
      </q-item-section>
    </q-item>
    <!--      </q-card>-->

    <!--      <div class="user-stats">
            <div class="stat">
              <span class="stat-label">粉丝量</span>
              <span class="stat-value">{{ user.followers }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">获赞量</span>
              <span class="stat-value">{{ user.likes_received }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">关注量</span>
              <span class="stat-value">{{ user.following }}</span>
            </div>
          </div>-->
    <!--    </div>-->

    <q-tabs v-model="tab" align="justify" class="bg-white text-brown-7">
      <q-tab name="works" icon="movie"/>
      <q-tab name="likes" icon="favorite"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="works">
        <works :user_id="profileStore.user.id"/>
      </q-tab-panel>
      <q-tab-panel name="likes">
        <likes :user_id="profileStore.user.id"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import {useProfileStore} from "stores/profile";
import {onMounted, ref} from "vue";
import Likes from "components/Likes.vue";
import Works from "components/Works.vue";
import {useRouter} from "vue-router";
import {Configuration, DefaultApi} from "src/api";
import {api} from "boot/axios";
import {useWrapStore} from "stores/wrap";

const profileStore = useProfileStore();
const user = profileStore.user;
const tab = ref('works')
const drawer = ref(false)
const avatar_url = ref(user.avatar_url || '')
const router = useRouter();
const logout = () => {
  profileStore.logout();
  router.replace('/home')
}
const wrap  = new useWrapStore()
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
onMounted(async () => {
    console.log(profileStore.user)
    const response = await service.getUser(profileStore.user.id, profileStore.getBearerToken);
    wrap.wrapImagePrefix([response.data])
    profileStore.setUser(response.data)
    avatar_url.value = response.data.avatar_url || ''
  }
)

</script>
<style>
.user-profile {
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.profile-header img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-stats {
  display: flex;
}

.stat {
}

.stat-label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}


.video-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
}

.video-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.video-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-info {
  padding: 2px;
}

.video-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
}

.video-metadata {
  display: flex;
  margin-top: 8px;
  font-size: 14px;
  color: #999;
}

.video-metadata span {
  margin-right: 8px;
}

.like-btn {
  background-color: #00bfff;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>
