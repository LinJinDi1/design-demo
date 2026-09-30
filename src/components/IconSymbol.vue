<script setup>
defineProps({ name: { type: String, required: true }, size: { type: Number, default: 22 } });
const icons = { home: '⌂', bag: '▰', campus: '◆', friends: '♧', profile: '●', search: '⌕', pin: '⌖', star: '★', back: '‹', more: '•••', heart: '♡', message: '◌', gift: '♙', arrow: '›', bell: '♢', filter: '≡', users: '♙', sun: '☀', moon: '◐' };
const productIcons = new Set(['likes', 'followers', 'replies', 'system', 'shop', 'checkin', 'feedback', 'notice', 'contact', 'map', 'gift']);
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
</script>
<template>
  <img v-if="productIcons.has(name)" class="symbol product-symbol" :src="asset(`/assets/product-icons/${name}.${name === 'gift' ? 'svg' : 'png'}`)" :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true">
  <span v-else class="symbol" :style="{ fontSize: size + 'px' }" aria-hidden="true">{{ icons[name] || name }}</span>
</template>
