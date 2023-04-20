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
  <div style="height: 100%;">

    <video autoplay loop playsinline :src="item.video.video_url"
           style="width: 100%; height: 100%; object-fit: cover; position: relative; top: 0; left: 0; z-index: -1;">
    </video>

    <div class="absolute-bottom-right  q-pa-md">
      <div class="inline " style="flex-direction: column; display: flex; align-items: center">


        <q-avatar size="60px" class="q-mb-lg">
          <img :src="item.video.author?.avatar_url" alt=""/>
        </q-avatar>
        <q-btn flat round color="white" icon="add" size="xl" v-if="!item.video.author?.is_follow ?? false"
               @click="follow(<string>item.video.author?.id)"/>
        <q-btn flat round color="red" icon="done" size="xl" v-else @click="unfollow(<string>item.video.author?.id)"/>
        <q-btn flat round color="red" icon="favorite" size="xl" v-if="item.video.is_liked ?? false"
               @click="unlike(item.video.id)"/>
        <q-btn flat round color="white" icon="favorite_border" size="xl" v-else @click="like(item.video.id)"/>


        <q-btn round flat icon="comment" color="white" @click="open" size="xl"/>

        <q-btn round flat icon="share" color="white" size="xl"/>


      </div>
    </div>
    <q-dialog v-model="dialog" position="bottom" class="text-white">
      <comments :video_id="item.video.id"/>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {Configuration, DefaultApi, FollowActionRequest, LikeVideoRequest, Video} from "src/api";
import {useProfileStore} from "stores/profile";
import {api} from "boot/axios";
import {ref} from "vue";
import Comments from "components/Comments.vue";
import {useRouter} from "vue-router";

export interface VideoProps {
  video: Video
}

const item = defineProps<VideoProps>();
const profileStore = useProfileStore();
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))

const router = useRouter()
const like = async (video_id: string) => {
  const token = profileStore.getBearerToken
  if (!token || token === '') {
    await router.push('/sign/in')
    return
  }
  const req: LikeVideoRequest = {
    video_id: video_id,
    action: 1
  }
  let response = await service.likeVideo(profileStore.getBearerToken, req);
  console.log(response)
  item.video.is_liked = true
}
const unlike = async (video_id: string) => {
  // if token is empty, then it route to login page
  const token = profileStore.getBearerToken
  if (!token || token === '') {
    await router.push('/sign/in')
    return
  }
  const req: LikeVideoRequest = {
    video_id: video_id,
    action: 2
  }
  let response = await service.likeVideo(profileStore.getBearerToken, req);
  console.log(response)
  item.video.is_liked = false
}
const dialog = ref(false)
const open = () => {
  dialog.value = true
}

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
  let response = await service.followAction(profileStore.getBearerToken, req);
  console.log(response)
  // item.video.author.is_follow = true
  if (item.video.author) {
    item.video.author.is_follow = true
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
  let response = await service.followAction(profileStore.getBearerToken, req);
  console.log(response)
  // item.video.author.is_follow = false
  if (item.video.author) {
    item.video.author.is_follow = false
  }
}
</script>
