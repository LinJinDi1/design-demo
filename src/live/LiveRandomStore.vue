<script>
export const meta = { id: 'randomstore', label: '校园饭点签', note: '随机抽一家', group: '首页', tab: '', order: 3 };
</script>

<!--
  现版 · 校园饭点签（对应 quick-pick-main/pagesLog/randomstore/randomstore.vue）
  结构：标题区（校园饭点签 / 今天吃哪家？/ 拿不定主意，就抽一家。）→ 筛选卡（想去哪里 / 口味横滑 / 避开休息中的店）
        → 抽签结果（第 1 抽 + 店铺卡）→ 操作（再抽一家 / 抽三家 / 优先避开今天抽过的店）→ 今天抽过的签。
  尺寸照抄源码 rpx（1rpx = 0.52px）。静态稿停在「已抽中」态：源码里的洗签动画（paper-ticket 三张 + 最长 1100ms 等待）
  和「抽三家」/空手/错误三种分支都没画，只留单张结果卡。
  二级页（uni.navigateTo 打开，不是 tabBar 页）：顶部补一条 44px 原生导航栏，底部不再给玻璃胶囊留白。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 来源标签：utils/random-food.js 的 FOOD_SOURCES（all / store / canteen / stall） */
const sources = ['全校随心', '商中店铺', '饭堂店铺', '校园小摊'];

const tastes = ['粉面', '盖饭', '小吃', '饮品', '甜品'];

/* 抽签结果：字段对齐 drawRandomFood() 的 items（id / type / name / locationName / businessLabel / rating / reason） */
const result = {
  name: '恭喜小明',
  image: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg',
  sourceLabel: '商中店铺',
  locationName: '商业中心 2F · 明厨现炒',
  businessLabel: '营业中',
  rating: '4.6',
  ratingCount: 128,
  reason: '今天还没抽到过它，窗口出餐快',
};

const history = [
  { name: '老通馆', sourceLabel: '商中店铺' },
  { name: '徐豆豆', sourceLabel: '校园小摊' },
];
</script>

<template>
  <div class="live-page live-rs">
    <!-- 小程序原生导航栏（pages.json：navigationBarTitleText = 校园饭点签、白底），二级页没有底部 tabBar -->
    <header class="rs-nav">
      <button class="rs-back" aria-label="返回">
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
      <span class="rs-nav-title">校园饭点签</span>
      <span class="rs-nav-gap"></span>
    </header>

    <div class="rs-intro">
      <div class="rs-eyebrow">校园饭点签</div>
      <div class="rs-title">今天吃哪家？</div>
      <div class="rs-intro-copy">拿不定主意，就抽一家。</div>
    </div>

    <div class="rs-filters">
      <div class="rs-filter-label">想去哪里</div>
      <div class="rs-source-row">
        <button
          v-for="(source, index) in sources"
          :key="source"
          class="rs-source-chip"
          :class="{ selected: index === 0 }"
        >
          {{ source }}
        </button>
      </div>

      <div class="rs-taste-scroll">
        <div class="rs-taste-row">
          <button class="rs-taste-chip selected">不挑口味</button>
          <button v-for="taste in tastes" :key="taste" class="rs-taste-chip">{{ taste }}</button>
        </div>
      </div>

      <div class="rs-availability">
        <div class="rs-availability-copy">
          <div class="rs-availability-title">避开休息中的店</div>
          <div class="rs-availability-note">时间不明确的店会标注待确认</div>
        </div>
        <div class="rs-switch" role="switch" aria-checked="true" aria-label="避开休息中的店">
          <span class="rs-switch-knob"></span>
        </div>
      </div>
    </div>

    <div class="rs-results">
      <div class="rs-result-heading">
        <div class="rs-result-copy">
          <div class="rs-eyebrow">抽签结果</div>
          <div class="rs-result-title">抽到这家</div>
        </div>
        <span class="rs-draw-count">第 1 抽</span>
      </div>

      <div class="rs-food-card">
        <div class="rs-food-image-wrap">
          <img class="rs-food-image" :src="liveAsset(result.image)" alt="" />
          <span class="rs-source-badge">{{ result.sourceLabel }}</span>
        </div>
        <div class="rs-food-body">
          <div class="rs-food-name">{{ result.name }}</div>
          <div class="rs-food-location">{{ result.locationName }}</div>
          <div class="rs-food-meta">
            <span class="rs-business-label">{{ result.businessLabel }}</span>
            <span class="rs-rating">★ {{ result.rating }} · {{ result.ratingCount }} 人评</span>
          </div>
          <div class="rs-reason">{{ result.reason }}</div>
          <button class="rs-go-button">就这家，查看详情 ↗</button>
        </div>
      </div>
    </div>

    <div class="rs-actions">
      <button class="rs-draw-button">再抽一家 ↻</button>
      <button class="rs-compare-button">抽三家，我来选</button>
      <div class="rs-action-note">优先避开今天抽过的店</div>
    </div>

    <div class="rs-history">
      <div class="rs-history-heading">
        <span>今天抽过的签</span>
        <span class="rs-history-count">{{ history.length }} 家</span>
      </div>
      <div class="rs-history-scroll">
        <div class="rs-history-row">
          <button v-for="card in history" :key="card.name" class="rs-history-chip">
            <span>{{ card.name }}</span>
            <span class="rs-history-source">{{ card.sourceLabel }} ↗</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .food-page：底色 #f8f7fb，padding 36rpx 28rpx 40rpx(+安全区)。
   现版画布顶部先让出 46px 状态栏；二级页没有玻璃底栏，底部只留源码那 40rpx。
   源码的 36rpx 顶部内边距并进了 .rs-intro，好让导航栏能横向出满画布。 */
.live-rs {
  padding: 46px calc(var(--u) * 28) calc(var(--u) * 40);
  background: #f8f7fb;
  color: #403167;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.rs-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  margin: 0 calc(var(--u) * -28);
  background: #fff;
}
.rs-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.rs-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

.rs-intro {
  padding: calc(var(--u) * 44) calc(var(--u) * 8) calc(var(--u) * 30);
}
.rs-eyebrow {
  color: #898095;
  font-size: calc(var(--u) * 22);
  line-height: 1.6;
}
.rs-title {
  margin-top: calc(var(--u) * 12);
  font-size: calc(var(--u) * 62);
  font-weight: 800;
  letter-spacing: calc(var(--u) * -2);
  line-height: 1.25;
}
.rs-intro-copy {
  margin-top: calc(var(--u) * 10);
  color: #898095;
  font-size: calc(var(--u) * 27);
}

/* ---------- 筛选卡 ---------- */
.rs-filters {
  padding: calc(var(--u) * 28);
  border-radius: calc(var(--u) * 36);
  background: #fff;
}
.rs-filter-label {
  margin-bottom: calc(var(--u) * 20);
  font-size: calc(var(--u) * 24);
  font-weight: 600;
}
.rs-source-row {
  display: flex;
  flex-wrap: wrap;
  margin: calc(var(--u) * -6);
}
.rs-source-chip {
  flex: 1;
  min-width: calc(var(--u) * 120);
  margin: calc(var(--u) * 6);
  padding: 0 calc(var(--u) * 10);
  border-radius: calc(var(--u) * 20);
  background: #f8f7fb;
  color: #666;
  font-size: calc(var(--u) * 23);
  line-height: calc(var(--u) * 70);
  text-align: center;
}
.rs-source-chip.selected {
  background: #6a5acd;
  color: #fff;
}
.rs-taste-scroll {
  overflow-x: auto;
  margin-top: calc(var(--u) * 20);
  scrollbar-width: none;
  white-space: nowrap;
}
.rs-taste-scroll::-webkit-scrollbar {
  display: none;
}
.rs-taste-row {
  display: inline-flex;
  padding-bottom: calc(var(--u) * 4);
}
.rs-taste-chip {
  flex-shrink: 0;
  margin: 0 calc(var(--u) * 12) 0 0;
  padding: 0 calc(var(--u) * 22);
  border: calc(var(--u) * 2) solid #f0f0f0;
  border-radius: calc(var(--u) * 999);
  background: #fff;
  color: #898095;
  font-size: calc(var(--u) * 23);
  line-height: calc(var(--u) * 58);
  white-space: nowrap;
}
.rs-taste-chip.selected {
  border-color: #6a5acd;
  background: #f0f0ff;
  color: #403167;
}
.rs-availability {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: calc(var(--u) * 24);
  padding-top: calc(var(--u) * 22);
  border-top: calc(var(--u) * 2) solid #f8f7fb;
}
.rs-availability-title {
  font-size: calc(var(--u) * 24);
  font-weight: 600;
}
.rs-availability-note {
  margin-top: calc(var(--u) * 6);
  color: #999;
  font-size: calc(var(--u) * 20);
}
/* 小程序 <switch color="#6a5acd">：52×32px 的胶囊 */
.rs-switch {
  display: flex;
  flex-shrink: 0;
  box-sizing: border-box;
  width: calc(var(--u) * 100);
  height: calc(var(--u) * 60);
  align-items: center;
  justify-content: flex-end;
  padding: calc(var(--u) * 4);
  border-radius: calc(var(--u) * 999);
  background: #6a5acd;
}
.rs-switch-knob {
  width: calc(var(--u) * 52);
  height: calc(var(--u) * 52);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* ---------- 抽签结果 ---------- */
.rs-result-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--u) * 30) calc(var(--u) * 8) calc(var(--u) * 20);
}
.rs-result-title {
  margin-top: calc(var(--u) * 6);
  font-size: calc(var(--u) * 31);
  font-weight: 700;
}
.rs-draw-count {
  flex-shrink: 0;
  margin-left: calc(var(--u) * 12);
  color: #898095;
  font-size: calc(var(--u) * 22);
}
.rs-food-card {
  overflow: hidden;
  margin-bottom: calc(var(--u) * 20);
  border-radius: calc(var(--u) * 36);
  background: #fff;
}
.rs-food-image-wrap {
  position: relative;
  height: calc(var(--u) * 270);
  background: #f0f0ff;
}
.rs-food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rs-source-badge {
  position: absolute;
  top: calc(var(--u) * 20);
  left: calc(var(--u) * 20);
  padding: calc(var(--u) * 10) calc(var(--u) * 18);
  border-radius: calc(var(--u) * 999);
  background: #f8f7fb;
  color: #403167;
  font-size: calc(var(--u) * 22);
}
.rs-food-body {
  padding: calc(var(--u) * 28);
}
.rs-food-name {
  color: #403167;
  font-size: calc(var(--u) * 36);
  font-weight: 700;
  line-height: 1.4;
  word-break: break-all;
}
.rs-food-location {
  margin-top: calc(var(--u) * 10);
  color: #898095;
  font-size: calc(var(--u) * 24);
  line-height: 1.5;
}
.rs-food-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: calc(var(--u) * 16);
  font-size: calc(var(--u) * 21);
  line-height: 1.8;
}
.rs-business-label {
  padding: calc(var(--u) * 4) calc(var(--u) * 12);
  border-radius: calc(var(--u) * 12);
  background: #f8f7fb;
}
.rs-rating {
  margin-left: calc(var(--u) * 12);
  color: #898095;
}
.rs-reason {
  margin-top: calc(var(--u) * 20);
  font-size: calc(var(--u) * 26);
  font-weight: 600;
}
.rs-go-button {
  display: block;
  width: 100%;
  margin-top: calc(var(--u) * 24);
  border-radius: calc(var(--u) * 24);
  background: #6a5acd;
  color: #fff;
  font-size: calc(var(--u) * 28);
  font-weight: 700;
  line-height: calc(var(--u) * 86);
  text-align: center;
}

/* ---------- 操作 ---------- */
.rs-actions {
  margin-top: calc(var(--u) * 28);
}
.rs-draw-button {
  display: block;
  width: 100%;
  border-radius: calc(var(--u) * 28);
  background: #6a5acd;
  color: #fff;
  font-size: calc(var(--u) * 32);
  font-weight: 700;
  line-height: calc(var(--u) * 98);
  text-align: center;
}
.rs-compare-button {
  display: block;
  width: 100%;
  margin-top: calc(var(--u) * 14);
  border: calc(var(--u) * 2) solid #d9d6f5;
  border-radius: calc(var(--u) * 28);
  color: #403167;
  font-size: calc(var(--u) * 27);
  line-height: calc(var(--u) * 86);
  text-align: center;
}
.rs-action-note {
  margin-top: calc(var(--u) * 18);
  color: #999;
  font-size: calc(var(--u) * 21);
  text-align: center;
}

/* ---------- 今天抽过的签 ---------- */
.rs-history {
  margin-top: calc(var(--u) * 40);
  padding-top: calc(var(--u) * 26);
  border-top: calc(var(--u) * 2) solid #e0e0e0;
}
.rs-history-heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: calc(var(--u) * 20);
  font-size: calc(var(--u) * 26);
  font-weight: 600;
}
.rs-history-count {
  color: #999;
  font-size: calc(var(--u) * 22);
  font-weight: 400;
}
.rs-history-scroll {
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}
.rs-history-scroll::-webkit-scrollbar {
  display: none;
}
.rs-history-row {
  display: inline-flex;
}
.rs-history-chip {
  display: flex;
  flex-shrink: 0;
  max-width: calc(var(--u) * 320);
  flex-direction: column;
  align-items: flex-start;
  margin: 0 calc(var(--u) * 14) 0 0;
  padding: calc(var(--u) * 18) calc(var(--u) * 24);
  border-radius: calc(var(--u) * 22);
  background: #fff;
  color: #403167;
  font-size: calc(var(--u) * 24);
  line-height: 1.5;
  white-space: normal;
}
.rs-history-source {
  margin-top: calc(var(--u) * 6);
  color: #999;
  font-size: calc(var(--u) * 20);
}
</style>
