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
    <q-header
      class="bg-white text-black text-center"
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="() => $router.go(-1)"
        />
        <q-toolbar-title>消息</q-toolbar-title>
      </q-toolbar>
    </q-header>


    <div>
      <div v-for="friend in friends" :key="friend.id" @click="handleClick(friend.id, friend.name,<string>friend.avatar_url)" class="friend-item">
        <img :src="friend.avatar_url" alt="avatar" class="avatar">
        <div class="friend-info">
          <div class="friend-name">{{ friend.name }}</div>
          <div class="friend-message">{{ friend.bio }}</div>
        </div>
        <div class="message-time">{{ friend.videos_posted }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
import {GetFriendsRequest, User} from "src/api";
import {useProfileStore} from "stores/profile";
import {client} from "boot/defaultapi";
import {useWrapStore} from "stores/wrap";

/*const friends = ref([*/
/*  {*/
/*    id: 1,*/
/*    name: '小明',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小明',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 2,*/
/*    name: '小红',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小红',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 3,*/
/*    name: '小刚',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小刚',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 4,*/
/*    name: '小李',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小李',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 5,*/
/*    name: '小王',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小王',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 6,*/
/*    name: '小张',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小张',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 7,*/
/*    name: '小赵',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小赵',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 8,*/
/*    name: '小钱',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小钱',*/
/*    lastMessageTime: '昨天'*/
/*  },*/
/*  {*/
/*    id: 9,*/
/*    name: '小孙',*/
/*    avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',*/
/*    lastMessage: '你好，我是小孙',*/
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 10,
//     name: '小周',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小周',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 11,
//     name: '小吴',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小吴',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 12,
//     name: '小郑',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小郑',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 13,
//     name: '小王',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小王',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 14,
//     name: '小李',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小李',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 15,
//     name: '小张',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小张',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 16,
//     name: '小赵',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小赵',
//     lastMessageTime: '昨天'
//   },
//   {
//     id: 17,
//     name: '小孙',
//     avatar: 'https://avatars.githubusercontent.com/u/1680273?v=4',
//     lastMessage: '你好，我是小孙',
//     lastMessageTime: '昨天'
//   }])
const friends = ref([] as User[])
const router = useRouter()
const handleClick = (friend: string, name: string, avatar: string) => {
  router.push({path: '/plain/chat', query: {id: friend, name: name, avatar: avatar}})
}
const profileStore = useProfileStore();
const wrap = new useWrapStore()
onMounted(async () => {
    const req: GetFriendsRequest = {
        limit: 20,
        token: '0'
    }
    const res = await client.getFriends(profileStore.getBearerToken, req)
    console.log(res)
    if (res.data.users !== undefined) {
        wrap.wrapImagePrefix(res.data.users)
        friends.value = res.data.users
    }
})
</script>
<style>
.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.friend-info {
  flex-grow: 1;
}

.friend-name {
  font-size: 16px;
  font-weight: bold;
}

.friend-message {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}

.message-time {
  font-size: 12px;
  color: #888;
  margin-left: 10px;
}
</style>
