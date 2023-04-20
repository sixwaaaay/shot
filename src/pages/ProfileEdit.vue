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
    <!-- content -->
    <q-header class="bg-white text-grey-8 q-py-xs">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="close" @click="$router.push('/home')"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div style="text-align: center;" class="q-pa-lg bg-white text-grey-8">
      <div class="text-h5 q-mb-md">修改个人资料</div>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md q-pa-lg">
      <q-input v-model="name" label="昵称" outlined filled clearable lazy-rules name="name"
               :rules="[val => val.length > 0 || '请输入昵称']"/>
      <q-input v-model="bio" label="简介" outlined filled clearable lazy-rules name="bio"
               :rules="[val => val.length > 0 || '请输入简介']"/>
      <q-file v-model="avatar" label="头像" outlined filled clearable accept="image/*" name="avatar"/>
      <q-file v-model="background" label="背景" outlined filled clearable accept="image/*" name="bg"/>

      <div class="row justify-center">
        <q-btn type="submit" color="primary" class="q-px-lg" label="确认"/>
        <!-- reset -->
        <q-btn type="reset" color="primary" flat label="重置" class="q-ml-sm" @click="reset"/>
      </div>
    </q-form>

  </q-page>
</template>

<script setup lang="ts">
import {api} from "boot/axios";
import {ref} from 'vue';
import {useProfileStore} from "stores/profile";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {User} from "src/api";
import {useWrapStore} from "stores/wrap";

const name = ref('')
const bio = ref('')
const avatar = ref(null)
const background = ref(null)

const profileStore = useProfileStore()
const router = useRouter()
name.value = profileStore.user.name
bio.value = profileStore.user.bio ? profileStore.user.bio : ''

const reset = () => {
  name.value = profileStore.user.name
  bio.value = profileStore.user.bio ? profileStore.user.bio : ''
  avatar.value = null
  background.value = null
}
const wrap = new useWrapStore()
const onSubmit = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  try {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": profileStore.getBearerToken,
      }
    };
    const resp = await api.patch(
      'http://localhost:9090/users',
      formData,
      config
    )
    console.log(resp.data)
    const data = resp.data.profile
    // parse as User
    const user: User = {
      name: data.name,
      bio: data?.bio,
      avatar_url: data?.avatar_url,
      id: data.id
    }
    wrap.wrapImagePrefix([user])
    console.log(data)
    profileStore.setUser(
      {
        ...user,
      }
    )
    await router.replace('/profile')
  } catch (error) {
    console.error(error)
    const $q = useQuasar()
    $q.dialog({
      title: '错误',
      message: "修改失败",
    })
  }
}
</script>
