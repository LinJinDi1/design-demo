<!--
  手机外壳：所有场景页面都套在它里面。
  结构 = 状态栏（绝对定位，高 46px，内容区要留出这段高度）+ 可滚动内容区（页面在这里）+ 底部导航。
  detail / secondary 为 true 时隐藏底栏（详情页和二级页用自己的底栏）。
-->
<script setup>
import StatusBar from './StatusBar.vue';
import BottomNav from './BottomNav.vue';
defineProps({ active: String, detail: Boolean, secondary: Boolean, design: String });
defineEmits(['navigate']);
</script>
<template>
  <div class="phone"><StatusBar /><main class="phone-content"><slot /></main><BottomNav v-if="!detail && !secondary" :active="active" :design="design" @navigate="$emit('navigate', $event)" /></div>
</template>
