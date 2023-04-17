<template>
  <div class="video-list">
    <div v-for="video in videos" :key="video.id" class="video-item">
      <q-img :src="video.thumbnail" alt="Video Thumbnail" tag="img"/>
      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <div class="video-metadata">
          <span class="upload-date">{{ video.uploadDate }}</span>
          <span class="video-length">{{ video.length }}</span>
        </div>
      </div>
      <div class="video-actions">
        <button class="like-btn">点赞</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

export interface Params {
  user_id: number
}

const props = defineProps<Params>()

const videos = ref([
  {
    id: 1,
    thumbnail: 'https://picsum.photos/id/1018/300/200',
    title: 'Awesome Video 1',
    uploadDate: '2022-01-01',
    length: '10:00',
  },
  {
    id: 2,
    thumbnail: 'https://picsum.photos/id/1025/300/200',
    title: 'Awesome Video 2',
    uploadDate: '2022-02-01',
    length: '12:00',
  },
  {
    id: 3,
    thumbnail: 'https://picsum.photos/id/1037/300/200',
    title: 'Awesome Video 3',
    uploadDate: '2022-03-01',
    length: '15:00',
  },
  {
    id: 4,
    thumbnail: 'https://picsum.photos/id/1055/300/200',
    title: 'Awesome Video 4',
    uploadDate: '2022-04-01',
    length: '8:00',
  }, {
    id: 6,
    thumbnail: 'https://picsum.photos/id/1062/300/200',
    title: 'Awesome Video 5',
    uploadDate: '2022-05-01',
    length: '6:00',
  },
  {
    id: 7,
    thumbnail: 'https://picsum.photos/id/1071/300/200',
    title: 'Awesome Video 6',
    uploadDate: '2022-06-01',
    length: '11:00',
  },
])
</script>
