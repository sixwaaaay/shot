<template>
  <q-page padding>
      <q-header class="bg-white text-grey-8 shadow-2">
        <q-toolbar>
          <!--        back -->
          <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>

          <q-toolbar-title>关注</q-toolbar-title>
        </q-toolbar>
      </q-header>
    <div >
      <div v-for="follower in following" :key="follower.id" class="flex">
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
import {useRoute, useRouter} from "vue-router";
import {Configuration, DefaultApi, FollowActionRequest, GetFollowingsRequest, User} from "src/api";
import {api} from "boot/axios";
import {onMounted, ref} from "vue";
import {useProfileStore} from "stores/profile";
import {client} from "boot/defaultapi";
import {useWrapStore} from "stores/wrap";

const route = useRoute()
let user_id = route.query.user_id ?? "0"

// if user_id is not string, covert it to string
if (typeof user_id !== "string") {
  user_id = user_id.toString()
}
const following = ref([] as User[]);
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
const wrap = new useWrapStore()
onMounted(async () => {
  let req: GetFollowingsRequest = {
    limit: 10, token: "0",
    user_id: user_id.toString()
  }
  const res = await service.getFollowing(req, profileStore.getBearerToken);
  const data = res.data
  if (data.users){
    wrap.wrapImagePrefix(data.users)
  }
  if (data.users) {
    following.value = data.users
  }
});


const router = useRouter();
const profileStore = useProfileStore();
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
    following.value = following.value.map((item) => {
      if (item.id === user_id) {
        item.is_follow = true
      }
      return item
    })
  }
  catch (e) {
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
    following.value = following.value.map((item) => {
      if (item.id === user_id) {
        item.is_follow = false
      }
      return item
    })
  }
  catch (e) {
    console.log(e)
  }
}
</script>
