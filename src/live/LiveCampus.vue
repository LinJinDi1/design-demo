<!--
  现版 · 校园 tab（对应 quick-pick-main/pages/campus/campus.vue）
  结构：校园标题 + 副标题 → 轮播第一屏（引言 / 作者 / 底部指示点见下方说明）
        → 校园服务（图书馆 / 大学体验课 / 庆快画廊）。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；
  uni-icons 的 size="28" 是 px，按源码原样写 28px。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 轮播六条文案来自 shareImageList，静态稿只画第一屏。
   底图直接用线上截屏（campus-scene.jpg）：这张素材就是轮播第一屏的真实渲染，
   引言 / 作者 / 底部指示点 / 上下压暗渐变都已经烧录在画面里，
   再叠一套 .quote / .author / .dots 会重影，所以这里只放一张图，
   尺寸（350rpx 高、16rpx 圆角、28rpx 边距）仍按源码。 */
const banner = {
  image: '/assets/screenshot-crops/campus-scene.jpg',
};

const services = [
  {
    id: 'library',
    name: '图书馆',
    desc: '看实景、桌椅与设施，找到合适的学习空间',
    icon: '/assets/live/campus/tushuguan.png',
  },
  {
    /* 源码这里是 <uni-icons type="calendar">，没有图片，模板里画内联 SVG */
    id: 'daike',
    name: '大学体验课',
    desc: '没空去的课，找人替你去上一次，扫码加微信',
  },
  {
    id: 'gallery',
    name: '庆快画廊',
    desc: '正在准备中，敬请期待',
    icon: '/assets/live/campus/star.png',
    badge: '开发中',
  },
];
</script>

<template>
  <div class="live-page live-campus">
    <!-- 对应 tab-header.scss：标题行留出胶囊高度与右侧胶囊宽度 -->
    <div class="tab-section-header">
      <div class="tab-section-title tab-page-heading">校园</div>
      <div class="tab-section-subtitle">校园日常，发现身边的美好</div>
    </div>

    <!-- 轮播：源码是 swiper + uni-swiper-dot 六屏，静态稿只画第一屏 -->
    <div class="lunbo">
      <div class="swiper-box">
        <img class="swiper-image" :src="liveAsset(banner.image)" alt="校园实景与寄语" />
      </div>
    </div>

    <div class="pagebody">
      <div class="service-section">
        <div class="section-title">校园服务</div>

        <div class="service-card-grid">
          <div
            v-for="service in services"
            :key="service.id"
            class="service-card"
            :class="{ 'gallery-pending': service.badge }"
          >
            <div class="service-icon-wrap">
              <img
                v-if="service.icon"
                class="service-icon"
                :src="liveAsset(service.icon)"
                alt=""
              />
              <!-- uni-icons type="calendar" size="28" color="#0697a7" -->
              <svg
                v-else
                class="service-icon-glyph"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3.2"
                  y="5.6"
                  width="21.6"
                  height="19.2"
                  rx="3.6"
                  stroke="#0697a7"
                  stroke-width="1.6"
                />
                <path d="M3.2 11.2h21.6" stroke="#0697a7" stroke-width="1.6" />
                <path
                  d="M9.2 3.4v4.2M18.8 3.4v4.2"
                  stroke="#0697a7"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <circle cx="9.6" cy="16.6" r="1.15" fill="#0697a7" />
                <circle cx="14" cy="16.6" r="1.15" fill="#0697a7" />
                <circle cx="18.4" cy="16.6" r="1.15" fill="#0697a7" />
              </svg>
            </div>
            <div class="service-name">{{ service.name }}</div>
            <div v-if="service.badge" class="development-badge">{{ service.badge }}</div>
            <div class="service-desc">{{ service.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .page ---------- */
.live-campus {
  background-color: #f8f9fb;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

/* 标题行：minHeight = 胶囊高度（32px），paddingRight = 胶囊右侧留白 */
.tab-page-heading {
  min-height: 32px;
  padding-right: 100px;
}

/* ---------- .lunbo / .swiper-box ---------- */
.lunbo {
  position: relative;
  height: calc(var(--u) * 350);
  margin: 0 calc(var(--u) * 28) calc(var(--u) * 24);
  overflow: hidden;
  border-radius: calc(var(--u) * 16);
  background: #eeebf6;
}
.swiper-box {
  position: relative;
  width: 100%;
  height: calc(var(--u) * 350);
  margin: 0 auto;
  overflow: hidden;
  border-radius: calc(var(--u) * 16);
}
.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- .pagebody / .service-section ---------- */
.pagebody {
  box-sizing: border-box;
  width: 100%;
  padding: 0 calc(var(--u) * 30);
}
.service-section {
  margin-bottom: calc(var(--u) * 40);
}
.section-title {
  margin-bottom: calc(var(--u) * 20);
  padding-left: calc(var(--u) * 10);
  color: #333;
  font-size: calc(var(--u) * 34);
  font-weight: bold;
}

/* ---------- .service-card ---------- */
.service-card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--u) * 20);
}
.service-card {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  /* 源码是固定的 height: 200rpx；画廊卡片多一行「开发中」徽章会被压出卡片外，
     静态稿改成 min-height 让第三张自然长高，其余卡片仍是 200rpx */
  min-height: calc(var(--u) * 200);
  /* design-demo 的全局 .service-card（原版/Wise 校园页）会漏进来 height/gap/margin，
     这里显式盖掉，保证和源码的盒模型一致 */
  height: auto;
  gap: 0;
  margin-bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: calc(var(--u) * 20) 0;
  border-radius: calc(var(--u) * 16);
  background-color: #ffffff;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 12) rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}
.service-card:active {
  transform: scale(0.98);
}
.gallery-pending {
  position: relative;
}
.service-icon-wrap {
  display: flex;
  width: calc(var(--u) * 80);
  height: calc(var(--u) * 80);
  flex: none;
  align-items: center;
  justify-content: center;
  margin-bottom: calc(var(--u) * 10);
  border-radius: 50%;
  background-color: #f0f5ff;
}
.service-icon {
  width: calc(var(--u) * 50);
  height: calc(var(--u) * 50);
}
.service-icon-glyph {
  width: 28px;
  height: 28px;
}
.service-name {
  color: #333;
  font-size: calc(var(--u) * 28);
  font-weight: 600;
  line-height: 1.2;
}
.development-badge {
  margin: calc(var(--u) * 10) 0;
  padding: calc(var(--u) * 4) calc(var(--u) * 16);
  border-radius: calc(var(--u) * 20);
  background: #f1edfb;
  color: #8b79bc;
  font-size: calc(var(--u) * 22);
}
.service-desc {
  margin-top: calc(var(--u) * 5);
  color: #999;
  font-size: calc(var(--u) * 20);
}
</style>
