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
  <q-page>
      <!--    <q-header class="bg-white text-grey-8 q-py-xs">-->

      <!--      <q-toolbar>-->
      <!--        <q-toolbar-title>-->
      <!--          <q-input v-model="search" dense rounded outlined placeholder="搜索" @keyup.enter="searchVideos">-->
      <!--            <template v-slot:append>-->
      <!--              <q-icon name="search" class="cursor-pointer" @click="searchVideos" />-->
      <!--            </template>-->
      <!--          </q-input>-->
      <!--        </q-toolbar-title>-->
      <!--      </q-toolbar>-->

      <!--    </q-header>-->
      <q-header class="bg-white text-grey-8 q-py-xs">
        <q-toolbar>
          <!--        a button to open the drawer-->
          <!--        <q-btn dense flat round icon="account_circle" to="/edit/profile"/>-->
          <q-space/>
          <q-btn dense flat round icon="menu" to="/profile"/>
        </q-toolbar>
    </q-header>
    <swiper :modules="modules" :slides-per-view="1" navigation :pagination="{ clickable: true }" direction="vertical"
            :scrollbar="{ draggable: true }" style="height: calc(100vh - 100px )" :virtual="true"
            @transition-end="onSlideChange"
    >
      <!--    @active-index-change="onSlideChange" -->
      <swiper-slide v-for="(video, index) in videos" :key="video.id" :virtualIndex="index"
                    style="height: 100%;" lazy>

        <sharing-video :video="video" :id="index" :active_id="activeId"/>
      </swiper-slide>
    </swiper>

  </q-page>
</template>

<script setup lang="ts">
import {
  Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation, A11y, Virtual
  // Virtual, Mousewheel, Parallax, FreeMode, Grid, Manipulation, Controller, History, HashNavigation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCards, EffectCreative, Thumbs
} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {onMounted, ref} from 'vue';
import {Configuration, DefaultApi, GetRecentVideosRequest, Video} from "src/api";
import {api} from "boot/axios";
import {useProfileStore} from "stores/profile";
import {useWrapStore} from "stores/wrap";
import SharingVideo from "components/SharingVideo.vue";
import {useNotification} from "@kyvg/vue3-notification";

const modules = [Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation, A11y, Virtual]
const videos = ref([] as Video[])
const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
const profileStore = useProfileStore();
let wrapStore = new useWrapStore();

const refresh = async () => {
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
  const notify = useNotification()
  notify.notify({
    type: "success",
    title: "已经刷新了~",
  })
}
const activeId = ref(0)
let pre = 0
const onSlideChange = (slide: { activeIndex: number; realIndex: string; }) => {
  console.log(slide)
  console.log("current index: " + slide.activeIndex, "real index: " + slide.realIndex)
  activeId.value = slide.activeIndex
  // console.log(videos.value.length)
  if (pre === 0 && slide.activeIndex === 0) {
    refresh()
  } else if (pre === videos.value.length - 1 && slide.activeIndex == videos.value.length - 1) {
    append()
  }
  pre = activeId.value
}

const append = async () => {
// token 取已有的id的最大值
  const token = videos.value.map(v => v.id).reduce((a, b) => a!! > b!! ? a : b)
  console.log(token)
  console.log(videos.value.map(v => v.id))
  let req: GetRecentVideosRequest = {
    token: token!!,
  }
  const res = await service.getRecentVideos(req, profileStore.getBearerToken)
  console.log(res)
  const notify = useNotification()
  if (res.status != 200){
    notify.notify({
      type: "error",
      title: "啊哦，好像出现了一些意料之外的问题，我们正在努力修复中！",
    })
  }else if (res.data === undefined || res.data.videos === undefined || res.data.videos.length === 0) {
    notify.notify({
      type: "success",
      title: "没有更多了",
    })
  } else {
    const v = res.data.videos
    wrapStore.wrapVideoPrefix(v)
    videos.value = videos.value.concat(v)
  }
}
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
