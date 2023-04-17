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
      <q-input v-model="model.name" label="昵称" outlined filled clearable lazy-rules name="name"
               :rules="[val => val.length > 0 || '请输入昵称']"/>
      <q-input v-model="model.bio" label="简介" outlined filled clearable lazy-rules name="bio"
               :rules="[val => val.length > 0 || '请输入简介']"/>
      <!--      <q-file v-model="coverImage" label="封面" outlined filled clearable accept="image/*" name="coverImage"/>-->
      <q-file v-model="model.avatar" label="头像" outlined filled clearable accept="image/*" name="avatar"/>
      <q-file v-model="model.background" label="背景" outlined filled clearable accept="image/*" name="bg"/>

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

const model = {
  name: '',
  bio: '',
  avatar: null,
  background: null
}

const profileStore = useProfileStore()
const router = useRouter()
model.name = profileStore.user.name
model.bio = profileStore.user.bio ? profileStore.user.bio : ''

const reset = () => {
  model.name = profileStore.user.name
  model.bio = profileStore.user.bio ? profileStore.user.bio : ''
  model.avatar = null
  model.background = null
}

const onSubmit = async (event: { preventDefault: () => void; target: HTMLFormElement | undefined; }) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  try {
    let config = {headers: {'Content-Type': 'multipart/form-data'}};
    const resp = await api.patch(
      'http://localhost:8080/user',
      formData,
      config
    )
    await router.replace('/profile')
  } catch (error) {
    const $q = useQuasar()
    $q.notify({
      message: '修改失败',
      color: 'negative',
      position: 'top',
      timeout: 1000
    })
  }
}
</script>
