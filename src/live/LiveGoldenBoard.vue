<script>
export const meta = { id: 'goldenboard', label: '庆快金榜', note: '店铺人气榜', group: '首页', tab: '', order: 2 };
</script>

<!--
  现版 · 庆快金榜（对应 quick-pick-main/pagesLog/goldenboard/goldenboard.vue
  + components/GoldenBoard/GoldenBoard.vue）
  结构：金榜头部（标题 / 说明 / 勋章）→ 类型切换（店铺 / 小摊）→ 指标切换（人气 / 收藏 / 口碑）
        → 说明行 → 前三名领奖台 → 第 4 名起的榜单行 → 已展示全部上榜记录。
  二级页（uni.navigateTo 打开，不是 tabBar 页）：顶部自绘一条 44px 原生导航栏，底部没有玻璃胶囊。
  尺寸照抄源码 rpx（1rpx = 0.52px）；GoldenBoard 在 mounted 里发请求，静态稿按「人气榜 · 店铺」这一态写死数据。
-->
<script setup>
import { liveAsset } from './asset.js';

const dimensions = [
  { key: 'store', label: '店铺' },
  { key: 'stall', label: '小摊' },
];

const metrics = [
  { key: 'popularity', label: '人气榜' },
  { key: 'favorite', label: '收藏榜' },
  { key: 'rating', label: '口碑榜' },
];

/* 榜单数据：字段对齐 getDiscoveryRank() 的 items（sort / name / locationName / metricValue / thumbnail） */
const items = [
  { sort: 1, name: '老通馆', location: '商业中心 1F', value: 1286, image: '/assets/source-fidelity/commercial/01-laotongguan.jpg' },
  { sort: 2, name: '老上海馄饨', location: '商业中心 1F', value: 964, image: '/assets/source-fidelity/commercial/02-laoshanghai.jpg' },
  { sort: 3, name: '恭喜小明', location: '商业中心 2F', value: 803, image: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg' },
  { sort: 4, name: '韩味轩', location: '商业中心 2F', value: 617, image: '/assets/source-fidelity/commercial/04-korean-flavor.jpg' },
  { sort: 5, name: '加油炸鸡', location: '商业中心 1F', value: 492, image: '/assets/source-fidelity/commercial/05-come-on.jpg' },
];

const podium = items.slice(0, 3);
const rows = items.slice(3);
/* metricLabel 是「次浏览」，源码 replace(/^次/, '') 后只留单位 */
const unit = '浏览';
</script>

<template>
  <div class="live-page live-gb">
    <!-- 小程序原生导航栏（pages.json：navigationBarTitleText = 庆快金榜、白底），二级页没有底部 tabBar -->
    <header class="gb-nav">
      <button class="gb-back" aria-label="返回">
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
      <span class="gb-nav-title">庆快金榜</span>
      <span class="gb-nav-gap"></span>
    </header>

    <div class="gb-page-hero">
      <div class="gb-hero-heading">
        <div class="gb-hero-copy">
          <span class="gb-hero-title">庆快金榜</span>
          <span class="gb-hero-description">按浏览、收藏和评分分别排名</span>
        </div>
        <img class="gb-hero-emblem" :src="liveAsset('/assets/live/home/rank.svg')" alt="" />
      </div>
    </div>

    <div class="gb-board">
      <div class="gb-controls">
        <div class="gb-dimensions" role="tablist" aria-label="榜单类型">
          <div
            v-for="(tab, index) in dimensions"
            :key="tab.key"
            class="gb-dimension"
            :class="{ active: index === 0 }"
            role="tab"
            :aria-selected="index === 0"
          >
            {{ tab.label }}
          </div>
        </div>
        <div class="gb-metrics" role="tablist" aria-label="排序方式">
          <span
            v-for="(tab, index) in metrics"
            :key="tab.key"
            class="gb-metric"
            :class="{ selected: index === 0 }"
            role="tab"
            :aria-selected="index === 0"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>

      <div class="gb-caption">
        <span>按店铺本周浏览排序</span>
        <span class="gb-caption-scope">每次展示 10 名</span>
      </div>

      <div class="gb-rank-list">
        <div class="gb-top-three">
          <div
            v-for="item in podium"
            :key="item.name"
            class="gb-podium"
            :class="'gb-podium-' + item.sort"
          >
            <div class="gb-podium-photo-wrap">
              <img class="gb-podium-photo" :src="liveAsset(item.image)" alt="" />
              <span class="gb-podium-rank" :class="'gb-rank-' + item.sort">{{ item.sort }}</span>
            </div>
            <span class="gb-podium-name">{{ item.name }}</span>
            <span class="gb-podium-value"
              >{{ item.value }}<span class="gb-podium-unit">{{ unit }}</span></span
            >
          </div>
        </div>

        <div v-for="item in rows" :key="item.name" class="gb-row">
          <span class="gb-row-rank">{{ item.sort }}</span>
          <img class="gb-row-photo" :src="liveAsset(item.image)" alt="" />
          <div class="gb-row-info">
            <span class="gb-row-name">{{ item.name }}</span>
            <span class="gb-row-location">{{ item.location }}</span>
          </div>
          <div class="gb-row-value">
            <span>{{ item.value }}</span>
            <span class="gb-row-unit">{{ unit }}</span>
          </div>
        </div>

        <div class="gb-list-end">已展示全部上榜记录</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .board-page 是白底、padding-bottom 48rpx；这里同时把外壳给玻璃底栏留的 190rpx 收掉 */
.live-gb {
  padding-bottom: calc(var(--u) * 48);
  background: #fff;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.gb-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #fff;
}
.gb-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.gb-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

.gb-page-hero {
  padding: calc(var(--u) * 22) calc(var(--u) * 32) calc(var(--u) * 14);
  background: #fff;
}
.gb-hero-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 24);
}
.gb-hero-copy {
  flex: 1;
  min-width: 0;
}
.gb-hero-title {
  display: block;
  color: #35312c;
  font-size: calc(var(--u) * 36);
  font-weight: 650;
  line-height: 1.4;
}
.gb-hero-description {
  display: block;
  margin-top: calc(var(--u) * 8);
  color: #8b8780;
  font-size: calc(var(--u) * 23);
  line-height: 1.6;
}
.gb-hero-emblem {
  flex-shrink: 0;
  width: calc(var(--u) * 80);
  height: calc(var(--u) * 80);
}

/* ---------- GoldenBoard ---------- */
.gb-board {
  position: relative;
  padding: 0 calc(var(--u) * 28);
  color: #3e374a;
}
.gb-dimensions {
  display: flex;
  padding: calc(var(--u) * 6);
  border-radius: calc(var(--u) * 18);
  background: #f5f5f6;
}
.gb-dimension {
  flex: 1;
  box-sizing: border-box;
  padding: calc(var(--u) * 21) 0;
  border-radius: calc(var(--u) * 14);
  color: #a099af;
  font-size: calc(var(--u) * 27);
  line-height: calc(var(--u) * 36);
  text-align: center;
}
.gb-dimension.active {
  background: #fff;
  color: #353239;
  font-weight: 600;
  box-shadow: 0 calc(var(--u) * 2) calc(var(--u) * 8) rgba(40, 36, 45, 0.04);
}
.gb-metrics {
  display: flex;
  margin-top: calc(var(--u) * 12);
  border-bottom: 1px solid #f0edf5;
}
.gb-metric {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 24) 0;
  color: #a099af;
  font-size: calc(var(--u) * 25);
  line-height: calc(var(--u) * 36);
  text-align: center;
}
.gb-metric.selected {
  color: #3d3831;
  font-weight: 600;
}
.gb-metric.selected::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(var(--u) * 32);
  height: calc(var(--u) * 5);
  margin-left: calc(var(--u) * -16);
  border-radius: calc(var(--u) * 4);
  background: #c69a4b;
}
.gb-caption {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--u) * 20);
  padding: calc(var(--u) * 22) calc(var(--u) * 2) calc(var(--u) * 8);
  color: #a49aaf;
  font-size: calc(var(--u) * 21);
  line-height: calc(var(--u) * 32);
}
.gb-caption-scope {
  flex-shrink: 0;
  color: #b5adbf;
}

/* 前三名：横向出血到页面两边（源码 margin: 22rpx -28rpx 12rpx） */
.gb-top-three {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: calc(var(--u) * 12);
  margin: calc(var(--u) * 22) calc(var(--u) * -28) calc(var(--u) * 12);
  padding: calc(var(--u) * 28) calc(var(--u) * 20) calc(var(--u) * 30);
  border-bottom: 1px solid #eee9df;
  background: #fffaf0;
}
.gb-podium {
  display: flex;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--u) * 14) calc(var(--u) * 6) calc(var(--u) * 10);
}
.gb-podium-1 {
  order: 2;
  padding-top: 0;
}
.gb-podium-2 {
  order: 1;
}
.gb-podium-3 {
  order: 3;
}
.gb-podium-photo-wrap {
  position: relative;
  width: calc(var(--u) * 116);
  height: calc(var(--u) * 116);
}
.gb-podium-1 .gb-podium-photo-wrap {
  width: calc(var(--u) * 142);
  height: calc(var(--u) * 142);
}
.gb-podium-photo {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: calc(var(--u) * 5) solid #fff;
  border-radius: 50%;
  box-shadow: 0 calc(var(--u) * 3) calc(var(--u) * 12) rgba(101, 77, 34, 0.1);
  object-fit: cover;
}
.gb-podium-rank {
  position: absolute;
  right: calc(var(--u) * -2);
  bottom: calc(var(--u) * -2);
  display: flex;
  width: calc(var(--u) * 38);
  height: calc(var(--u) * 38);
  align-items: center;
  justify-content: center;
  border: calc(var(--u) * 3) solid #fff;
  border-radius: 50%;
  font-size: calc(var(--u) * 22);
  font-weight: 700;
}
.gb-podium-name {
  overflow: hidden;
  width: 100%;
  margin-top: calc(var(--u) * 14);
  color: #403a34;
  font-size: calc(var(--u) * 26);
  font-weight: 600;
  line-height: calc(var(--u) * 36);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gb-podium-1 .gb-podium-name {
  font-size: calc(var(--u) * 29);
}
.gb-podium-value {
  margin-top: calc(var(--u) * 6);
  color: #ad7a27;
  font-size: calc(var(--u) * 25);
  font-weight: 600;
}
.gb-podium-unit {
  margin-left: calc(var(--u) * 5);
  color: #ab9d87;
  font-size: calc(var(--u) * 18);
  font-weight: 400;
}
.gb-rank-1 {
  background: #fbf3e3;
  color: #b68c43;
}
.gb-rank-2 {
  background: #f2f0f7;
  color: #9290a6;
}
.gb-rank-3 {
  background: #f8eee8;
  color: #b28c74;
}

/* 第 4 名起 */
.gb-row {
  display: flex;
  min-height: calc(var(--u) * 148);
  box-sizing: border-box;
  align-items: center;
  gap: calc(var(--u) * 16);
  padding: calc(var(--u) * 24) 0;
  border-bottom: 1px solid #f2eff6;
}
.gb-row-rank {
  flex-shrink: 0;
  width: calc(var(--u) * 34);
  height: calc(var(--u) * 38);
  border-radius: calc(var(--u) * 10);
  color: #aaa0b5;
  font-size: calc(var(--u) * 25);
  font-weight: 600;
  line-height: calc(var(--u) * 38);
  text-align: center;
}
.gb-row-photo {
  flex-shrink: 0;
  width: calc(var(--u) * 100);
  height: calc(var(--u) * 100);
  border-radius: calc(var(--u) * 16);
  object-fit: cover;
}
.gb-row-info {
  flex: 1;
  min-width: 0;
}
.gb-row-name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: calc(var(--u) * 27);
  font-weight: 600;
  line-height: 1.45;
}
.gb-row-location {
  display: block;
  overflow: hidden;
  margin-top: calc(var(--u) * 10);
  color: #aaa0b4;
  font-size: calc(var(--u) * 21);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gb-row-value {
  flex-shrink: 0;
  width: calc(var(--u) * 118);
  color: #826536;
  font-size: calc(var(--u) * 29);
  font-weight: 600;
  text-align: right;
}
.gb-row-unit {
  display: block;
  margin-top: calc(var(--u) * 8);
  color: #aaa0b4;
  font-size: calc(var(--u) * 18);
  font-weight: 400;
  line-height: calc(var(--u) * 26);
}
.gb-list-end {
  padding: calc(var(--u) * 30) calc(var(--u) * 12);
  color: #a091b1;
  font-size: calc(var(--u) * 22);
  text-align: center;
}
</style>
