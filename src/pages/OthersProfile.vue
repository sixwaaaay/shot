<!--
  - Copyright (c) 2023 sixwaaaay.
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -     http://www.apache.org/licenses/LICENSE-2.
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <q-page padding style="max-width: 100vh">
    <q-header class="bg-white text-black">
      <q-toolbar>
        <!--        a button to open the drawer-->
        <q-btn dense flat round icon="arrow_back" @click="$router.go(-1)"/>
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
      </q-list>
    </q-drawer>
    <q-item class="q-ma-sm">
      <q-item-section avatar>
        <q-avatar size="100px" class="q-mr-sm">
          <img :src="user.avatar_url" alt="avatar">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">{{ user.name }}</q-item-label>
        <q-item-label caption class="text-grey-8">{{ user.bio }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-tabs v-model="tab" align="justify" class="bg-white text-brown-7">
      <q-tab name="works" icon="movie"/>
      <q-tab name="likes" icon="favorite"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="works">
        <works :user_id="user.id"/>
      </q-tab-panel>
      <q-tab-panel name="likes">
        <likes :user_id="user.id"/>
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
import {Configuration, DefaultApi, User} from "src/api";
import {api} from "boot/axios";
import {useWrapStore} from "stores/wrap";

const router = useRouter()
const {id, name, avatar} = router.currentRoute.value.query

const profileStore = useProfileStore();
const user = ref({
  id: id,
  name: name,
  avatar_url: avatar
} as User)
const tab = ref('works')
const drawer = ref(false)

const wrap = new useWrapStore()
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
onMounted(async () => {
    const response = await service.getUser(user.value.id, profileStore.getBearerToken)
    if (response.data !== undefined) {
      wrap.wrapImagePrefix([response.data])
      user.value = response.data
    }
  }
)

</script>
<style>


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
