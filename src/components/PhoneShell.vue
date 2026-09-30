<script setup>
import StatusBar from './StatusBar.vue';
import BottomNav from './BottomNav.vue';
defineProps({ active: String, detail: Boolean, secondary: Boolean });
defineEmits(['navigate']);
</script>
<template>
  <div class="phone"><StatusBar /><main class="phone-content"><slot /></main><BottomNav v-if="!detail && !secondary" :active="active" @navigate="$emit('navigate', $event)" /></div>
</template>
