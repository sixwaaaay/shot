/*
 * Copyright (c) 2023 sixwaaaay.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/home',
        component: () => import('pages/Home.vue'),
      },
      {
        path: '/friends',
        component: () => import('pages/Friends.vue'),
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/inbox',
        component: () => import('pages/Inbox.vue'),
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: '/profile',
        component: () => import('pages/Profile.vue'),
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: '',
        redirect: '/home',
      }
      ],
  },
  {
    path: '/sign',
    name: 'Sign',
    component: () => import('layouts/Sign.vue'),
    children: [
      {
        path: 'in',
        component: () => import('pages/SignIn.vue'),
      },
      {
        path: 'up',
        component: () => import('pages/SignUp.vue'),
      }
      // catch all redirect to /sign/in
      ,
      {
        path: ':catchAll(.*)*',
        redirect: '/sign/in',
      }
    ]
  },
  {
    path: '/plain',
    component: () => import('layouts/Plain.vue'),
    children: [
      {
        path: 'chat',
        component: () => import('pages/MessageChat.vue'),
      },
      {
        path: 'followers',
        component: () => import('pages/Followers.vue'),
      },
      {
        path: 'following',
        component: () => import('pages/Followings.vue'),
      },
      {
        path:'profile',
        component: () => import('pages/OthersProfile.vue'),
      }
    ]
  },
  {
    path: '/edit',
    component: () => import('layouts/Edit.vue'),
    children: [
      {
        path: 'video',
        component: () => import('pages/VideoUploader.vue'),
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: 'profile',
        component: () => import('pages/ProfileEdit.vue'),
        meta: {
          requiresAuth: true,
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
