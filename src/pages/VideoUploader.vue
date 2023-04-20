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
  <q-page padding class="items-center justify-center">
    <q-header class="bg-white text-grey-8 q-py-xs">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="close" @click="$router.replace('/home') "/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div style="text-align: center;" class="q-pa-lg bg-white text-grey-8">
      <div class="text-h5 q-mb-md">上传视频</div>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md q-pa-lg">
      <q-input v-model="title" label="标题" outlined filled clearable lazy-rules name="title"
               :rules="[val => val.length > 0 || '请输入标题']"/>
      <q-input v-model="description" label="描述" outlined filled clearable lazy-rules name="description"
               :rules="[val => val.length > 0 || '请输入描述']"/>
      <!--      <q-input v-model="category" label="分类" outlined filled clearable lazy-rules name="category"-->
      <!--               :rules="[val => val.length > 0 || '请输入分类']"/>-->
      <q-select v-model="category" label="分类" outlined filled clearable lazy-rules name="category"
                :options="['动画', '音乐', '舞蹈', '游戏', '科技', '生活', '鬼畜', '时尚', '娱乐', '电影', '电视剧', '纪录片', '影视杂谈', '影视剪辑' ]"/>
      <q-input label="标签" outlined filled lazy-rules v-model="tagInput">
        <q-btn type="button" color="primary" flat label="添加标签" class="q-ml-sm" @click="addTag"/>
      </q-input>

      <div>
        <div v-for="(tag, index) in tags" :key="index" style="flex-direction: row">
          {{ tag }}
          <!--            <button type="button" @click="removeTag(index)">x</button>-->
          <q-btn icon="close" color="negative" flat @click="removeTag(index)"/>
        </div>
      </div>
      <q-file v-model="coverImage" label="封面" outlined filled clearable accept="image/*" name="coverImage"/>
      <q-file v-model="video" label="视频" outlined filled clearable accept="video/*" name="video"/>


      <div class="row justify-center">
        <q-btn type="submit" color="primary" class="q-px-lg" label="确认"/>
        <!-- reset -->

        <q-btn type="reset" color="primary" flat label="重置" class="q-ml-sm"/>
      </div>
    </q-form>


  </q-page>
</template>

<script setup lang="ts">

import {api} from "boot/axios";
import {ref} from 'vue';
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {Configuration, DefaultApi} from "src/api";
import {useProfileStore} from "stores/profile";

const title = ref('')
const description = ref('')
const category = ref('')
const tags = ref([] as string[])
const coverImage = ref({} as Blob)
const video = ref({} as Blob)
const tagInput = ref('')
const addTag = () => {
  let value = tagInput.value;
  if (value === '') {
    return
  }
  tags.value.push(value)
  tagInput.value = ''
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}
const router = useRouter()
const profileStore = useProfileStore()
const onSubmit = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  console.log(formData)
  const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
  try {
    let response = await service.uploadVideo(
      profileStore.getBearerToken,
      title.value,
      description.value,
      video.value,
      coverImage.value,
    );
    console.log(response)
    await router.replace('/home')
  } catch (error) {
    console.log(error)
    const $q = useQuasar()
    $q.notify({
      message: '上传失败',
      color: 'negative',
      position: 'top',
      timeout: 1000
    })
  }
}

</script>
