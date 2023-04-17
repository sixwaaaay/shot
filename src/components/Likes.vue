<template>
  <div class="video-list">
    <div v-for="video in videos" :key="video.id" class="video-item">
      <q-img :src="video.cover_url" alt="Video Thumbnail" tag="img"/>
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <div class="video-metadata">
          <span class="upload-date">{{ video.upload_time }}</span>
          <span class="video-length">{{ video.description }}</span>
        </div>
      </div>
      <div class="video-actions">
        <button class="like-btn">点赞</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Configuration, DefaultApi, GetUserVideosRequest, Video} from "src/api";
import {useProfileStore} from "stores/profile";
import {onMounted, ref} from "vue";
import {api} from "boot/axios";

export interface UserParams {
  user_id: number
}

const profileStore = useProfileStore();
const props = defineProps<UserParams>()

const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))

const videos = ref([] as Video[])
const user_id = props.user_id ?? 0;
// user_id need to be changed to the parameter passed as props
onMounted(async () => {
  let req: GetUserVideosRequest = {
    user_id: user_id,
    token: 0,
  }
  const res = await service.getLikedVideos(req, profileStore.getBearerToken)
  const data = res.data
  videos.value = data.videos ?? []
})
</script>
