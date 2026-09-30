<script setup>
defineProps({ active: { type: String, default: 'discover' } });
defineEmits(['navigate']);
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const items = [
  { id: 'home', label: '首页', icon: '/assets/tabbar/tnh.png', selectedIcon: '/assets/tabbar/tsh.png' },
  { id: 'discover', label: '自提', icon: '/assets/tabbar/tnz.png', selectedIcon: '/assets/tabbar/tsz.png' },
  { id: 'campus', label: '校园', icon: '/assets/tabbar/tnc.png', selectedIcon: '/assets/tabbar/tsc.png' },
  { id: 'friends', label: '好友', icon: '/assets/tabbar/friend.png', selectedIcon: '/assets/tabbar/friend-active.png' },
  { id: 'profile', label: '我的', icon: '/assets/tabbar/tnm.png', selectedIcon: '/assets/tabbar/tsm.png' },
];
</script>
<template>
  <nav class="bottom-nav">
    <button v-for="item in items" :key="item.id" :class="['nav-item', { active: active === item.id, disabled: item.disabled }]" :disabled="item.disabled" @click="!item.disabled && $emit('navigate', item.id)">
      <img :src="asset(active === item.id ? item.selectedIcon : item.icon)" alt="" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
