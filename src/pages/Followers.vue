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
  <q-page padding>
    <q-header class="bg-white text-grey-8 shadow-2">
      <q-toolbar>
        <!--        back -->
        <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>

        <q-toolbar-title>粉丝</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div >
      <div v-for="follower in followers" :key="follower.id" class="flex">
        <q-avatar size="60px" class="q-mr-lg">
          <img :src="follower.avatar_url" alt=""/>
        </q-avatar>
        <div class="details">
          <div class="name">{{ follower.name }}</div>
          <div class="bio">{{ follower.bio }}</div>
        </div>
        <q-space/>
        <div class="actions">
          <!--          <button v-if="!follower.is_follow" @click="follow(follower.id)">Follow</button>-->
          <!--          <button v-else disabled>Following</button>-->
          <q-btn flat round color="black" icon="add" size="xl" v-if="!follower.is_follow" @click="follow(follower.id)"/>
          <q-btn flat round color="red" icon="done" size="xl" v-else @click="unfollow(follower.id)"/>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {FollowActionRequest, GetFollowersRequest, User} from "src/api";
import {useRoute, useRouter} from "vue-router";
import {client} from "boot/defaultapi";
import {useProfileStore} from "stores/profile";
import {useWrapStore} from "stores/wrap";
const router = useRouter();
const profileStore = useProfileStore();
const followers = ref([] as User[]);
const follow = async (user_id: string) => {
  const token = profileStore.getBearerToken
  if (!token || token === '') {
    await router.push('/sign/in')
    return
  }
  const req: FollowActionRequest = {
    user_id: user_id,
    action: 1
  }
  let response = await client.followAction(profileStore.getBearerToken, req);
  console.log(response)
  try {
    followers.value = followers.value.map((follower) => {
      if (follower.id === user_id) {
        follower.is_follow = true
      }
      return follower
    })
  } catch (e) {
    console.log(e)
  }
}

const unfollow = async (user_id: string) => {
  const token = profileStore.getBearerToken
  if (!token || token === '') {
    await router.push('/sign/in')
    return
  }
  const req: FollowActionRequest = {
    user_id: user_id,
    action: 2
  }
  let response = await client.followAction(profileStore.getBearerToken, req);
  console.log(response)
  try {
    followers.value = followers.value.map((follower) => {
      if (follower.id === user_id) {
        follower.is_follow = false
      }
      return follower
    })
  } catch (e) {
    console.log(e)
  }
}
const route = useRoute()
console.log(route.query)
let user_id = route.query.user_id ?? "0"
// if user_id is not string, covert it to string
if (typeof user_id !== "string") {
  user_id = user_id.toString()
}
const wrap = new useWrapStore()
onMounted(async () => {
  let req: GetFollowersRequest = {
    user_id: user_id.toString(),
  }
  const res = await client.getFollowers(req, profileStore.getBearerToken)
  const data = res.data
  console.log("followers", data)
  if (data.users){
    wrap.wrapImagePrefix(data.users)
  }
  if (data.users) {
    followers.value = data.users
  }
});
</script>
<style scoped>
/*.followers {
  display: flex;
  flex-direction: column;
}

.follower {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
}*/

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-weight: bold;
}

/*.actions button {*/
/*  padding: 8px 16px;*/
/*  border-radius: 4px;*/
/*  background-color: #2196f3;*/
/*  color: #fff;*/
/*  border: none;*/
/*  cursor: pointer;*/
/*  transition: background-color 0.2s;*/
/*}*/

.actions button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.actions button:hover {
  background-color: #0d8bf2;
}
</style>
