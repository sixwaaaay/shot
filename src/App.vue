<!--
  ~ Copyright (c) 2023 sixwaaaay.
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~     http://www.apache.org/licenses/LICENSE-2.
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <router-view/>
  <notifications position="top center"/>
</template>

<script setup lang="ts">

</script>
<style>
.vue-notification {
  border-radius: 4px;
  margin: 0 5px 5px;
  padding: 1rem;
  /*font-size: 12px;*/
  color: #ffffff;
  background: #44a4fc;
  border-left: 0 solid #187fe7;
  font-size: 1rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal;
}

.vue-notification.success {
  background: #625b71;
  border-left-color: #42a85f;
}

.vue-notification.warn {
  background: #f2b8b5;
  border-left-color: #f48a06;
}

.vue-notification.error {
  background: #b3261e;
  border-left-color: #b82e24;
}
</style>
