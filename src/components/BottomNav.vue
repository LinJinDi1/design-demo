<!--
  底部导航：原版 / Wise 是五栏位图图标；V5 改成参考稿的四栏（首页 / 交友 / 校园 / 我的）
  点击后把 item.id 抛给 App.vue 的 selectScene 切换场景。
  V5 四个 tab 用的是内联 SVG 图标，描边色随选中态在 绿 #14866E / 灰 #A3A9AE 之间切换。
-->
<script setup>
import { computed } from 'vue';
const props = defineProps({
  active: { type: String, default: 'discover' },
  design: { type: String, default: 'original' },
});
defineEmits(['navigate']);
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const isV5 = computed(() => props.design === 'v5');

// 原版 / Wise 五栏：自提那一栏 id 是 discover，App.vue 里会换成 stalls
const classicItems = [
  { id: 'home', label: '首页', icon: '/assets/tabbar/tnh.png', selectedIcon: '/assets/tabbar/tsh.png' },
  { id: 'discover', label: '自提', icon: '/assets/tabbar/tnz.png', selectedIcon: '/assets/tabbar/tsz.png' },
  { id: 'campus', label: '校园', icon: '/assets/tabbar/tnc.png', selectedIcon: '/assets/tabbar/tsc.png' },
  { id: 'friends', label: '好友', icon: '/assets/tabbar/friend.png', selectedIcon: '/assets/tabbar/friend-active.png' },
  { id: 'profile', label: '我的', icon: '/assets/tabbar/tnm.png', selectedIcon: '/assets/tabbar/tsm.png' },
];

// V5 四栏：图标是内联 SVG，描边用 currentColor，由外层 .v5-tab.on 控制颜色
const v5Items = [
  { id: 'home', label: '首页', svg: '<path d="M4 11l8-7 8 7v9h-5.5v-5.5h-5V20H4v-9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' },
  { id: 'friends', label: '交友', svg: '<circle cx="10" cy="9.5" r="3.2" stroke="currentColor" stroke-width="1.8"/><path d="M4 20c.8-3 3.2-4.8 6-4.8s5.2 1.8 6 4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16.8 6.7a3.2 3.2 0 0 1 0 5.6M18.3 15.6c1.8.8 3.1 2.3 3.6 4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' },
  { id: 'campus', label: '校园', svg: '<path d="M12 4 2.5 9l9.5 5 9.5-5L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.5 11.6V16c0 1.7 2.6 3 5.5 3s5.5-1.3 5.5-3v-4.4M21.5 9.5V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' },
  { id: 'profile', label: '我的', svg: '<circle cx="12" cy="8.5" r="3.8" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 20.5c1-3.8 3.8-6 6.5-6s5.5 2.2 6.5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' },
];
</script>
<template>
  <nav :class="['bottom-nav', { 'v5-tabbar': isV5 }]">
    <template v-if="isV5">
      <button v-for="item in v5Items" :key="item.id" :class="['v5-tab', { on: active === item.id }]" @click="$emit('navigate', item.id)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" v-html="item.svg"></svg>
        <span>{{ item.label }}</span>
      </button>
    </template>
    <template v-else>
      <button v-for="item in classicItems" :key="item.id" :class="['nav-item', { active: active === item.id, disabled: item.disabled }]" :disabled="item.disabled" @click="!item.disabled && $emit('navigate', item.id)">
        <img :src="asset(active === item.id ? item.selectedIcon : item.icon)" alt="" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </nav>
</template>
