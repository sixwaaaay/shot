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
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated class="bg-white text-grey-8 q-py-xs">
      <q-tabs switch-indicator>
        <q-route-tab to="/home" replace label="首页" />
        <q-route-tab to="/edit/video" label="发布" replace />
        <q-route-tab to="/inbox" replace label="消息" />
        <q-route-tab to="/profile" replace label="我的" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>
