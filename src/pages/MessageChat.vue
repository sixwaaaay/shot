<template>
  <q-page padding>
    <q-header
      class="bg-white text-black"
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="handleBack"
        />
        <q-toolbar-title>{{ name }}</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- content -->
    <div class="chat">
      <div v-for="(message, index) in messages" :key="index"
           :class="{ 'message': true, 'sent': message.type === 'sent', 'received': message.type === 'received' }">
        <img class="avatar" :src="message.avatar" alt="avatar">
        <div class="content">
          <div class="header">
            <span class="username">{{ message.username }}</span>
            <span class="time">{{ message.time }}</span>
          </div>
          <div class="body">{{ message.text }}</div>
        </div>
      </div>
    </div>
    <q-footer class="bg-white text-black" elevated>
      <q-toolbar>
        <q-input
          v-model="message"
          filled
          placeholder="Type a message"
          class="q-px-md"
          @keyup.enter="sendMessage"
        />
        <q-btn
          flat
          round
          dense
          icon="send"
          @click="sendMessage"
        />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
// get query params
// id ,name
const {id, name} = router.currentRoute.value.query
const handleBack = () => {
  router.back()
}
const message = ref('')
const sendMessage = () => {
  console.log(message.value)
  message.value = ''
}
const messages = ref([
  {
    type: 'received',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    username: 'Alice',
    text: 'Hello, how are you?',
    time: '10:00 AM',
  },
  {
    type: 'sent',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    username: 'Bob',
    text: 'I\'m fine, thanks!',
    time: '10:02 AM',
  },
  {
    type: 'received',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    username: 'Alice',
    text: 'That\'s good to hear!',
    time: '10:03 AM',
  },
]);

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

.sent {
  justify-content: flex-start;
  flex-direction: row-reverse;
  background-color: #DCF8C6;
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
