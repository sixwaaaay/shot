<template>
  <div class="bg-white text-black" style="height: 40vh">
    <div class="text-h5 q-mb-md text-center q-py-xs">
      <p>评论</p>
    </div>
    <div class="chat">

      <div v-for="(comment, index) in comments" :key="index"
           :class="{ 'message': true, 'received': true }">
        <img class="avatar" :src="comment.user?.avatar_url" alt="avatar">
        <div class="content">
          <div class="header">
            <span class="username">{{ comment.user?.name }}</span>
            <span class="time">{{ comment.create_at }}</span>
          </div>
          <div class="body">{{ comment.content }}</div>
        </div>
      </div>
    </div>

    <div class="flex">
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

export interface CommentProps {
  video_id: string
}

const props = defineProps<CommentProps>()
const router = useRouter()
console.log(props)
const message = ref('')

const comments = ref([] as Comment[])
const profileStore = useProfileStore()
onMounted(async () => {
  let req: CommentListReq = {
    video_id: props.video_id
  }
  let response = await client.getComments(req, profileStore.getBearerToken);
  console.log(response)
  comments.value = response.data.comment_list || []
})
const sendComment = async () => {
  // console.log(message.value)
  // message.value = ''
  const req: CommentActionReq = {
    video_id: props.video_id,
    action: 1,
    comment_text: message.value
  }
  let resp = await client.createComment(profileStore.getBearerToken, req);
  console.log(resp)
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 5px;
}

.username {
  font-weight: bold;
}

.time {
  color: #888888;
}

.body {
  white-space: pre-wrap;
}
</style>
