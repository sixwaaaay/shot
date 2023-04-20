<template>
  <div class="video-list">
    <div v-for="video in videos" :key="video.id" class="video-item">
      <q-img :src="video.cover_url" alt="Video Thumbnail" tag="img"/>
      <!--      <div class="video-info">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-metadata">
                <span class="upload-date">{{ video.upload_time }}</span>
                <span class="video-length">{{ video.description }}</span>
              </div>
            </div>-->
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <div class="video-metadata">
          <!--          <span class="upload-date">{{ new Date(parseInt(video.upload_time)).toDateString() }}</span>-->
          <!--          <span class="video-length">{{ video.duration }}</span>-->
        </div>
      </div>
      <div class="video-actions">
        <q-btn dense flat round icon="favorite" v-if="video.is_liked ?? false" color="red"
               @click="unlike(video.id ?? '0')"/>
        <q-btn dense flat round icon="favorite_border" v-else @click="like(video.id ?? '0')"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Configuration,
  DefaultApi,
  GetLikedVideosRequest,
  LikeVideoRequest,
  Video
} from "src/api";
import {useProfileStore} from "stores/profile";
import {onMounted, ref} from "vue";
import {api} from "boot/axios";
import {useWrapStore} from "stores/wrap";

export interface UserParams {
  user_id: string
}

const profileStore = useProfileStore();
const props = defineProps<UserParams>()

const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
const like = async (video_id: string) => {
  const req: LikeVideoRequest = {
    video_id: video_id,
    action: 1
  }
  let response = await service.likeVideo(profileStore.getBearerToken, req);
  console.log(response)
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
  try {
    let response = await service.likeVideo(profileStore.getBearerToken, req);
    console.log(response)
    videos.value = videos.value.filter((video) => video.id !== video_id)
  } catch (e) {
    console.log(e)
  }
}
const videos = ref([] as Video[])
const user_id = props.user_id ?? "0"
let wrapStore = new useWrapStore();
// user_id need to be changed to the parameter passed as props
onMounted(async () => {
  let req: GetLikedVideosRequest = {
    user_id: user_id,
    token: "0",
  }
  const res = await service.getLikedVideos(req, profileStore.getBearerToken)
  const data = res.data
  if (data.videos !== undefined) {
    wrapStore.wrapVideoPrefix(data.videos)
  }
  videos.value = data.videos ?? []
})
</script>
