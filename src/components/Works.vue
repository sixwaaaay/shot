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
  <div class="video-list">
    <div v-for="video in videos" :key="video.id" class="video-item">
      <q-img :src="video.cover_url" alt="Video Thumbnail" tag="img"/>
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <div class="video-metadata">
          <!--          <span class="upload-date">{{ new Date(parseInt(video.upload_time)).toDateString() }}</span>-->
<!--          <span class="video-length">{{ video.duration }}</span>-->
        </div>
      </div>
      <div class="video-actions">
<!--        like button-->
        <q-btn dense flat round icon="favorite" v-if="video.is_liked ?? false" color="red" @click="unlike(video.id ?? '0')"/>
        <q-btn dense flat round icon="favorite_border" v-else @click="like(video.id ?? '0')"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Configuration, DefaultApi, GetUserVideosRequest, LikeVideoRequest, Video} from "src/api";
import {api} from "boot/axios";
import {useProfileStore} from "stores/profile";
import {useWrapStore} from "stores/wrap";

export interface Params {
  user_id: string
}

const profileStore = useProfileStore();
const props = defineProps<Params>()
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
const videos = ref([] as Video[])
const user_id = props.user_id ?? "0"


const like = async (video_id: string) => {
  const req: LikeVideoRequest = {
    video_id: video_id,
    action: 1
  }
  let response = await service.likeVideo(profileStore.getBearerToken, req);
  if (response.status !== 200) {
    console.log(response.data)
    return
  }
  videos.value = videos.value.map((video) => {
    if (video.id === video_id) {
      video.is_liked = true
    }
    return video
  })
}
const unlike = async (video_id: string) => {
  const req: LikeVideoRequest = {
    video_id: video_id,
    action: 2
  }
  let response = await service.likeVideo(profileStore.getBearerToken, req);
  if (response.status !== 200) {
    console.log(response.data)
    return
  }
  videos.value = videos.value.map((video) => {
    if (video.id === video_id) {
      video.is_liked = false
    }
    return video
  })
}
const wrapStore = new useWrapStore();
onMounted(async () => {
  let req: GetUserVideosRequest = {
    user_id: user_id,
    token: "0",
  }
  const res = await service.getUserVideos(req, profileStore.getBearerToken)
  const data = res.data
  if (data.videos !== undefined) {
    wrapStore.wrapVideoPrefix(data.videos)
  }
  videos.value = data.videos ?? []
})
</script>
