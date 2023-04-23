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
  <div class="bg-white text-black" style="height: 40vh">
    <div class="text-h5 q-mb-md text-center q-py-xs absolute-top bg-white">
      <p>评论</p>
    </div>
    <div class="chat" style="margin-top: 45px">

      <div v-for="(comment, index) in comments" :key="index"
           class="message received">
        <img class="avatar" :src="comment.user?.avatar_url" alt="avatar">
        <div class="content">
          <div class="header flex">
            <span class="username">{{ comment.user?.name }}</span>
            <span class="time">{{ covertDate(comment.create_at) }}</span>
          </div>
          <div class="body">{{ comment.content }}</div>
        </div>
      </div>
    </div>

    <div class="flex fixed-bottom bg-white">
      <q-input
        v-model="message"
        filled
        placeholder="输入评论"
        class="q-px-md"
        @keyup.enter="sendComment"
      />
      <q-space/>
      <q-btn
        flat
        round
        dense
        icon="send"
        @click="sendComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {Comment, CommentActionReq, CommentListReq} from "src/api";
import {client} from "boot/defaultapi";
import {useProfileStore} from "stores/profile";
import {useWrapStore} from "stores/wrap";
import {useNotification} from "@kyvg/vue3-notification";

export interface CommentProps {
  video_id: string
}

const props = defineProps<CommentProps>()
const router = useRouter()
console.log(props)
const message = ref('')
const covertDate = (date: string) => {
  const timestamp = parseInt(date);
  const d = new Date(timestamp*1000);
  return d.toLocaleString();
}
const comments = ref([] as Comment[])
const profileStore = useProfileStore()
const wrap = new useWrapStore()
onMounted(async () => {
  let req: CommentListReq = {
    video_id: props.video_id
  }
  let response = await client.getComments(req, profileStore.getBearerToken);
  console.log(response)
  if (response.data !== undefined && response.data.comment_list !== undefined) {
    wrap.wrapCommentPrefix(response.data.comment_list)
  }
  if (response.data !== undefined && response.data.comment_list !== undefined) {
    comments.value = response.data.comment_list
  }
});
const dataFormatter = (timestamp: number) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now.getTime() - date.getTime()
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前'
  } else if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
  } else {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}

const sendComment = async () => {
  // console.log(message.value)
  // message.value = ''
  const req: CommentActionReq = {
    video_id: props.video_id,
    action: 1,
    comment_text: message.value
  }
  if (message.value === '') {
    const notify  = useNotification()
    notify.notify(
      {
        type: "warn",
        title: "似乎没有输入内容哦！",
      }
    )
    return
  }
  if (profileStore.getBearerToken === '') {
    await router.push('/sign/in')
    return
  }
  let resp = await client.createComment(profileStore.getBearerToken, req);
  console.log(resp)
  if (resp.status !== 200) {

    notify.notify(
      {
        type: "error",
        title: "啊哦，好像出现了一些意料之外的问题，我们正在努力修复中！",
      }
    )
  }
  if (resp.data !== undefined && resp.data.comment !== undefined) {
    wrap.wrapCommentPrefix([resp.data.comment])
  }
  if (resp.data !== undefined && resp.data.comment !== undefined) {
    comments.value.push(resp.data.comment)
  }
  message.value = ''
}

</script>
<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
}

.received {
  justify-content: flex-start;
  background-color: #FFFFFF;
}

.sent .avatar {
  margin-left: 10px;
}

.received .avatar {
  margin-right: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 5px;
  width: 100%;
}

.username {
  font-weight: bold;
}

.time {
  color: #888888;
  text-align: right;
}

.body {
  white-space: pre-wrap;
}
</style>
