<!--
  StallCard 的占位实现。
  只在「design-demo 和 quick-pick-main 不在同一个目录」时启用：
  vite.config.js 发现 ../quick-pick-main 不存在，就把 @app 指到这里，
  保证项目仍然能跑起来（现版页面里的卡片会显示成这个提示块）。
-->
<template>
  <div class="app-stub-card">
    <div class="app-stub-thumb">
      <img v-if="stall.image" :src="stall.image" alt="" />
    </div>
    <div class="app-stub-body">
      <strong>{{ stall.name || '小摊卡片' }}</strong>
      <p>原生 StallCard 未加载：没找到 quick-pick-main 源码目录</p>
      <small>把 quick-pick-main 放到 design-demo 同级，或设置 QK_APP_ROOT</small>
    </div>
  </div>
</template>

<script setup>
defineProps({ stall: { type: Object, default: () => ({}) }, index: { type: Number, default: 0 } });
</script>

<style scoped>
.app-stub-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px dashed #d9d6f5;
  border-radius: 8px;
  background: #faf9ff;
}
.app-stub-thumb {
  flex-shrink: 0;
  width: 99px;
  height: 139px;
  overflow: hidden;
  border-radius: 6px;
  background: #f0eef7;
}
.app-stub-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.app-stub-body strong {
  display: block;
  color: #322b3e;
  font-size: 15px;
}
.app-stub-body p {
  margin: 6px 0 0;
  color: #7153bf;
  font-size: 12px;
}
.app-stub-body small {
  display: block;
  margin-top: 4px;
  color: #9993ab;
  font-size: 11px;
}
</style>
