<script setup>
import IconSymbol from './IconSymbol.vue';
defineProps({ shop: { type: Object, required: true }, cyan: Boolean });
defineEmits(['open']);
</script>
<template>
  <article class="shop-card" @click="$emit('open')">
    <div class="shop-photo" :style="{ background: shop.color }"><span>{{ shop.emoji }}</span><span class="image-chip">新店</span></div>
    <div class="shop-copy"><div class="row title-row"><h3>{{ shop.name }}</h3><IconSymbol name="heart" :size="22" /></div><p>{{ shop.category }}</p><div class="rating"><IconSymbol name="star" :size="14" /> <strong>{{ shop.score }}</strong><span>月售 200+</span></div><div class="row meta"><span>{{ shop.wait }}</span><span>{{ shop.distance }}</span></div></div>
  </article>
</template>
