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
                 :class="{ 'message': true, 'sent': message.from_user_id === profileStore.user.id, 'received': message.from_user_id !== profileStore.user.id }">
                <!--                <img class="avatar" :src="message.avatar" alt="avatar">-->
                <img v-if="message.from_user_id === profileStore.user.id" class="avatar"
                     :src="profileStore.user.avatar_url" alt="avatar">
                <img v-else class="avatar" :src="avatar" alt="avatar">
                <div class="content">
                    <div class="header" v-if="message.from_user_id === profileStore.user.id">
                        <span class="time">{{ covertDate(message.create_time) }}</span>
                        <span class="username">{{ message.from_user_id === profileStore.user.id ? '我' : name }}</span>
                    </div>
                    <div class="header" v-else>
                        <span class="username">{{ message.from_user_id === profileStore.user.id ? '我' : name }}</span>
                        <span class="time">{{ covertDate(message.create_time) }}</span>
                    </div>
                    <div class="body">{{ message.content }}</div>
                </div>
            </div>
        </div>
        <q-footer class="bg-white text-black" elevated>
            <q-toolbar>
                <q-input
                    v-model="message"

                    placeholder=""
                    class="full-width"
                    @keyup.enter="sendMessage"
                />
                <q-btn
                    flat
                    round
                    dense
                    class="q-px-sm"
                    icon="send"
                    @click="sendMessage"
                />
            </q-toolbar>
        </q-footer>
    </q-page>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {GetMessagesRequest, Message, SendMessageRequest} from "src/api";
import {useProfileStore} from "stores/profile";
import {client} from "boot/defaultapi";

const router = useRouter()
// get query params
// id ,name
const {id, name, avatar} = router.currentRoute.value.query
const handleBack = () => {
    router.back()
}
const message = ref('')

const covertDate = (date: string) => {
    const timestamp = parseInt(date);
    const d = new Date(timestamp);
    return d.toLocaleString();
}
const sendMessage = async () => {
    try {
        const req: SendMessageRequest = {
            to_user_id: id as string,
            content: message.value,
            action_type: 1,
        }
        const response = await client.sendMessage(profileStore.getBearerToken, req);
        console.log(response);
        messages.value.push({
            content: message.value,
            create_time: new Date().getTime().toString(),
            from_user_id: profileStore.user.id,
            to_user_id: id as string,
            id: new Date().getTime().toString(),
        })
    } catch (e) {
        console.log(e);
    } finally {
        message.value = '';
    }
}

const messages = ref([] as Message[])

const profileStore = useProfileStore();

onMounted(async () => {
    try {
        const req: GetMessagesRequest = {
            to_user_id: id as string,
        }
        const response = await client.getMessages(profileStore.getBearerToken, req);
        if (response.data.message_list !== undefined) {
            messages.value = response.data.message_list
        }
    } catch (e) {
        console.log(e);
    }
})

/*const messages = ref([
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
]);*/

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
