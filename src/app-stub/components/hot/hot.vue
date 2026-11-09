<!--
  hot.vue（新店报到）的占位实现。
  只在「design-demo 和 quick-pick-main 不在同一个目录」时启用，见 vite.config.js 的 HAS_APP。
-->
<template>
  <div class="app-stub-hot">
    <div class="app-stub-hot-title">
      <strong>{{ text }}</strong>
      <span>{{ hscorestore.length }} 家新店</span>
    </div>
    <div class="app-stub-hot-list">
      <div v-for="store in hscorestore" :key="store.storeId || store.name" class="app-stub-hot-card">
        <img v-if="store.image" :src="store.image" alt="" />
        <span>{{ store.name }}</span>
      </div>
    </div>
    <p>原生 hot.vue 未加载：没找到 quick-pick-main 源码目录</p>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '新店报到' },
  hscorestore: { type: Array, default: () => [] },
});
</script>

<style scoped>
.app-stub-hot {
  padding: 12px 12px 8px;
}
.app-stub-hot-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: #35303e;
  font-size: 15px;
  font-weight: 600;
}
.app-stub-hot-title span {
  color: #aaa4b0;
  font-size: 11px;
  font-weight: 400;
}
.app-stub-hot-list {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  overflow-x: auto;
}
.app-stub-hot-card {
  flex-shrink: 0;
  width: 112px;
  overflow: hidden;
  border: 1px dashed #d9d6f5;
  border-radius: 9px;
}
.app-stub-hot-card img {
  width: 100%;
  height: 78px;
  object-fit: cover;
}
.app-stub-hot-card span {
  display: block;
  padding: 8px;
  color: #4a4352;
  font-size: 12px;
}
.app-stub-hot p {
  margin: 8px 0 0;
  color: #7153bf;
  font-size: 11px;
}
</style>
