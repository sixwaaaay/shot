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
  <!--
    this is the login page
    user can login by his email and password
   -->
  <q-page padding class="items-center justify-center">

    <q-header class="bg-white text-grey-8 q-py-xs">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="arrow_back" @click="$router.push('/home')"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>


    <div class="q-pa-lg" style="text-align: center;">
      <div class="text-h5 q-mb-md">登陆</div>
      <div class="text-caption q-mb-md">欢迎回来！</div>
      <div class="text-caption q-mb-md">请输入您的用户名和密码。</div>
    </div>


    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pa-lg">
      <q-input outlined filled v-model="model.email" label="邮箱" lazy-rules
               :rules="[val => val && val.length > 0 || '请输入邮箱']"/>

      <q-input outlined filled v-model="model.password" label="密码" lazy-rules
               :rules="[val => val && val.length > 0 || '请输入密码']" type="password"/>

      <div class="row justify-center">
        <q-btn unelevated label=" 登 录 " type="submit" color="primary" class="q-px-lg"/>
        <q-btn unelevated outlined label=" 重 置 " type="reset" color="primary" flat class="q-ml-sm q-px-lg"/>
      </div>
      <div>
        <q-btn dense rounded outlined label="第一次使用？请点击注册。" color="primary" flat to="/sign/up" class="q-mt-md"/>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">

import {useRouter} from 'vue-router'

import {reactive} from 'vue';
import {Configuration, DefaultApi, LoginRequest, User} from "src/api";
import {api} from "boot/axios";
import {useProfileStore} from "stores/profile";
import {useNotification} from "@kyvg/vue3-notification";

const router = useRouter()

const model = reactive({
  email: '',
  password: ''
})

const profileStore = useProfileStore()
const onSubmit = async () => {
  try {
    let loginRequest: LoginRequest = {
      email: model.email,
      password: model.password
    }
    const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
    const res = await service.login(loginRequest);
    if (res.status !== 200) {
      throw new Error("登录失败")
    }
    if (res.data.account === undefined) {
      throw new Error("登录失败")
    }
    if (res.data.token === undefined) {
      throw new Error("登录失败")
    }
    console.log(res.data)
    const data = res.data;
    const user: User = data.account!;
    profileStore.setUser(user)
    profileStore.setToken(data.token!)
    profileStore.setTokenAndUser(data.token!, user)
    await router.replace('/home');
  } catch (error) {
    const notify  = useNotification()
    notify.notify(
      {
        type: "error",
        title: "咦？密码错了吗？您可以再试试其他密码哦！",
      }
    )
  }
}

const onReset = () => {
  model.email = ''
  model.password = ''
}

</script>
