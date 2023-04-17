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
  this is the register page

  the user can register with email and password
  and he can choose his username
 -->


  <q-page padding class="items-center justify-center">
    <!-- content -->

    <!--
      a header to say “注册您的账号”
      a short description to say the user principle "请遵守用户协议，注册您的账号，您可以使用邮箱和密码登录"
      there should be a short space between the header and the description
      so that the user can read the description clearly
     -->

    <q-header class="bg-white text-grey-8 q-py-xs">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="arrow_back" @click="$router.push('/home')"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="q-pa-lg" style="text-align: center;">
      <div class="text-h5 q-mb-md">注册您的账号</div>
      <div class="text-caption q-mb-md">欢迎加入我们！</div>
    </div>

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pa-lg">
      <q-input filled unelevated v-model="model.username" label="用户名" lazy-rules
               :rules="[val => val && val.length > 0 || '请输入用户名']"/>

      <q-input filled v-model="model.email" label="邮箱" lazy-rules
               :rules="[val => val && val.length > 0 || '请输入邮箱']"/>

      <q-input filled v-model="model.password" label="密码" lazy-rules
               :rules="[val => val && val.length > 0 || '请输入密码']"
               type="password"/>

      <div class="row justify-center">
        <q-btn label=" 注 册 " type="submit" color="primary" class="q-px-lg"/>
        <q-btn label=" 重 置 " type="reset" color="primary" flat class="q-px-lg"/>
      </div>
    </q-form>

    <q-btn label="已经有账号了？请点击登录。" color="primary" flat to="/sign/in" class="q-mt-md"/>

  </q-page>
</template>

<script setup lang="ts">

import {reactive} from 'vue';
import {Configuration, DefaultApi, RegisterRequest, User} from "src/api";
import {api} from "boot/axios";
import {useRouter} from "vue-router";
import {useProfileStore} from "stores/profile";
import {useQuasar} from "quasar";

const model = reactive({
  email: '',
  password: '',
  username: ''
})
const router = useRouter()
const profileStore = useProfileStore()

const onSubmit = async () => {
  let signUpData: RegisterRequest = {
    email: model.email,
    password: model.password,
    name: model.username
  }
  const service = new DefaultApi(new Configuration({basePath: api.defaults.baseURL}))
  try {
    const res = await service.register(signUpData)
    if (res.status !== 200) {
      throw new Error("注册失败")
    }
    if (res.data.account === undefined) {
      throw new Error("注册失败")
    }
    if (res.data.token === undefined) {
      throw new Error("注册失败")
    }
    const data = res.data;
    const user: User = data.account!;
    profileStore.setUser(user)
    profileStore.setToken(data.token!)
    await router.replace('/home');
  } catch (e) {
    const $q = useQuasar()
    $q.notify({
      message: "注册失败",
      color: 'negative',
      position: 'top',
      timeout: 1000
    })
  }
}


const onReset = () => {
  model.email = ''
  model.password = ''
  model.username = ''
}

</script>
