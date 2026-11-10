<script>
export const meta = {
  id: 'feedback-detail',
  label: '反馈详情',
  note: '处理进度',
  group: '个人',
  tab: '',
  order: 10,
};
</script>

<!--
  现版 · 反馈详情（对应 quick-pick-main/pagesLog/feeddetail/feeddetail.vue，63 行）
  入口：pagesLog/Myfeed/Myfeed.vue 的反馈行（gotoFeedDetail 把 item 塞进 globalData.feed 再 navigateTo）
  源码只有两段：一行 message（.page 里内联 style：display:flex / padding 20rpx / margin-bottom 1vh）
              + 最多 3 张图（.img 100vw 居中，每个 margin-top 30rpx，<image mode="aspectFit">）。
  也就是说这页没有状态、没有处理进度条——标题「详情」来自 pages.json，整页就是「问题描述 + 附件截图」。
  尺寸照抄源码：1rpx = 0.52px。两个 vh/vw 老问题照旧换算：1vh → 798px 的 1%（≈8px），100vw → 100%。
  <image mode="aspectFit"> 只设了 width:100%，小程序 image 的默认高度是 240px，
  所以每张图是 390×240 的居中留白框（截图竖图会两侧留白）——这是源码的真实表现，没有改成 height:auto。
  刻意简化：message 直接取 LiveFeedback 里那条「食堂三楼取餐窗口」，附件用同一组两张图，
  让「提交反馈 → 反馈详情」前后是同一条反馈。
-->
<script setup>
import { liveAsset } from './asset.js';

/* getApp().globalData.feed：字段 image1 / image2 / image3，空串不入列表 */
const message =
  '食堂三楼的取餐窗口最近关得太早，17:40 之后基本买不到饭，希望能延长到 19:30，给晚自习的同学留一点时间。';

const images = [
  '/assets/source-fidelity/commercial/01-laotongguan.jpg',
  '/assets/source-fidelity/commercial/04-korean-flavor.jpg',
];
</script>

<template>
  <div class="live-page live-feeddetail">
    <!-- 原生导航栏（pages.json: 详情 / #fff） -->
    <header class="fbd-nav">
      <button class="fbd-back" type="button" aria-label="返回">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m14.6 5.4-7 6.6 7 6.6"
            stroke="#1a1a1a"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span class="fbd-nav-title">详情</span>
      <span class="fbd-nav-gap"></span>
    </header>

    <!-- .page：白底、可滚 -->
    <div class="fbd-page">
      <div class="fbd-message">{{ message }}</div>

      <div v-for="(image, index) in images" :key="index" class="fbd-img">
        <img class="fbd-shot" :src="liveAsset(image)" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page：100vw / 100vh / #fff / overflow-y scroll；二级页没有底栏，底部不留白 */
.live-feeddetail {
  min-height: 888px;
  padding-bottom: 0;
  background: #fff;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.fbd-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #fff;
}
.fbd-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fbd-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}
.fbd-nav-gap {
  display: block;
  width: 44px;
}

.fbd-page {
  min-height: calc(888px - 90px);
  background: #fff;
}

/* 源码内联 style="display:flex; padding:20rpx; margin-bottom:1vh"，字号沿用页面默认 16px */
.fbd-message {
  display: flex;
  margin-bottom: calc((888px - 90px) * 0.01);
  padding: calc(var(--u) * 20);
  font-size: 16px;
}

/* .img：100vw 居中，margin-top 30rpx */
.fbd-img {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: calc(var(--u) * 30);
}
/* .img image { width: 100% } + mode="aspectFit"：高度保持小程序 image 默认的 240px */
.fbd-shot {
  width: 100%;
  height: 240px;
  object-fit: contain;
}
</style>
