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
  <q-page >
    <swiper :modules="modules" :slides-per-view="1" navigation :pagination="{ clickable: true }" direction="vertical"
            :scrollbar="{ draggable: true }" style="height: calc(100vh - 100px )">

      <q-header class="bg-white text-grey-8 q-py-xs">

        <q-toolbar>
          <q-toolbar-title>
            <q-input v-model="search" dense rounded outlined placeholder="搜索" @keyup.enter="searchVideos">
              <template v-slot:append>
                <q-icon name="search" class="cursor-pointer" @click="searchVideos" />
              </template>
            </q-input>
          </q-toolbar-title>
        </q-toolbar>

      </q-header>


      <swiper-slide v-for="(video, index) in videos" :key="video.id" :virtualIndex="index"
                    style="height: 100%;" lazy>

        <sharing-video :video="video" />
      </swiper-slide>
    </swiper>
  </q-page>
</template>

<script setup lang="ts">
import {
  Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation, A11y,Virtual
  // Virtual, Mousewheel, Parallax, FreeMode, Grid, Manipulation, Controller, History, HashNavigation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCards, EffectCreative, Thumbs
} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import {onMounted, ref} from 'vue';
import {Configuration, DefaultApi, GetRecentVideosRequest, Video} from "src/api";
import {api} from "boot/axios";
import {useProfileStore} from "stores/profile";
import {useWrapStore} from "stores/wrap";
import SharingVideo from "components/SharingVideo.vue";

const modules = [Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation, A11y,Virtual]
const videos = ref([] as Video[])
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
const profileStore = useProfileStore();
let wrapStore = new useWrapStore();
onMounted(async () => {
  let req: GetRecentVideosRequest = {
    token: "0",
  }
  const res = await service.getRecentVideos(req, profileStore.getBearerToken)
  const data = res.data
  console.log(data)
  const v = data.videos ?? []
  wrapStore.wrapVideoPrefix(v)

  // sort by id
  v.sort((a, b) => {
    return a.id!! < b.id!! ? 1 : -1
  })
  videos.value = v
  console.log(videos.value)
})

const search = ref("")
const searchVideos = async () => {
}
</script>

