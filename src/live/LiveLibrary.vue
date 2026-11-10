<script>
export const meta = { id: 'ic', label: '图书馆', note: '空间与座位', group: '校园', tab: '', order: 5 };
</script>

<!--
  现版 · 图书馆（对应 quick-pick-main/pagesLog/ic/ic.vue）
  结构：原生导航栏（44px 返回 + 图书馆）→ 引导头（eyebrow / 标题 / 描述 / 三个类型 tab）
        → 筛选面板（校区 + 分区下拉 / 搜索框 / 人数 chip）
        → 结果标题 + 提示 → 空间卡片列表（实景封面 / 楼层徽章 / 张数 / 名称 / 容量 / 位置 / 简介 / 设施 / 底部评分）。
  ic 是校园页 navigateTo 进来的二级页：没有 tabBar，只有原生导航栏（pages.json:
  navigationBarTitleText = 图书馆、navigationBarBackgroundColor = #ffffff），
  设计台上没有原生栏，所以自己画一条 44px 吸顶栏，标题 + 返回。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  静态稿：只画「研讨室」这一屏（tab=0、不限人数、搜索框空），加载态 / 空态 / 失败重试那几个分支没做。
  封面素材只有一张 campus-scene.jpg（原图正中有烧录的引言字样），所以放大裁到画面左上角
  那一条（树 + 教学楼），避开文字；没有实景照片的空间照源码的 photo-placeholder 分支画
  （▤ 字符换成 library.png 图标）。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 源码里是 ['研讨室', '自习座位', '我的收藏'] 三个写死的 tab，默认选中第 0 个 */
const tabs = ['研讨室', '自习座位', '我的收藏'];

/* 源码 capacities：不限人数 / 至少 4 / 6 / 8 人，默认 0 */
const capacities = [
  { label: '不限人数', value: 0 },
  { label: '至少 4 人', value: 4 },
  { label: '至少 6 人', value: 6 },
  { label: '至少 8 人', value: 8 },
];

/* 空间卡片：字段对齐 server/library.js 的空间记录
   （name / seatCount / locationDescription / tableDescription / facilitiesDescription / envScore / envScoreCount） */
const spaces = [
  {
    id: 'space-508',
    name: '研讨室（508）',
    photo: '/assets/screenshot-crops/campus-scene.jpg',
    photoCount: 3,
    floor: '5F',
    seatCount: 8,
    location: '黄埔分馆 5F · 电梯左手第一间',
    summary: '长桌八座，靠窗一整面落地窗，下午有光，适合小组开题和带电脑的长时间讨论。',
    facilities: '投影 · 白板 · 8 个插座 · 独立空调',
    score: '环境 8.6 / 10 · 12 人评价',
  },
  {
    id: 'space-b1-24',
    name: '自习座位 B1-24',
    floor: 'B1',
    seatCount: 2,
    location: '黄埔分馆 B1 · 自习区东侧靠墙',
    summary: '单人隔断座位，配台灯与插座，安静但容易被占，建议早一点来。',
    facilities: '台灯 · 插座',
    score: '环境 8.1 / 10 · 6 人评价',
  },
  {
    id: 'space-416',
    name: '冥想室（416）',
    floor: '4F',
    seatCount: 4,
    location: '黄埔分馆 4F · 报告厅东侧',
    summary: '靠着一整排书架，暖光灯，四面都是书，说话要小声一点。',
    facilities: '圆桌 · 台灯',
    score: '暂无环境评价',
  },
];
</script>

<template>
  <div class="live-page live-library">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 图书馆） -->
    <header class="lib-nav live-sticky-head">
      <button class="lib-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="lib-nav-title">图书馆</h1>
    </header>

    <!-- 引导头：源码 .guide-hero 的渐变底 + 三个类型 tab -->
    <header class="lib-hero">
      <span class="lib-eyebrow">LIBRARY GUIDE</span>
      <div class="lib-hero-title">先看看，再选个好位置</div>
      <div class="lib-hero-desc">实景、桌椅、设施，一起看清楚。</div>
      <div class="lib-type-tabs">
        <div
          v-for="(label, index) in tabs"
          :key="label"
          class="lib-type-tab"
          :class="{ 'lib-type-tab--active': index === 0 }"
        >
          {{ label }}
        </div>
      </div>
    </header>

    <!-- 筛选面板：两个 picker + 搜索 + 人数 chip -->
    <div class="lib-filter">
      <div class="lib-picker-row">
        <div class="lib-picker"><span class="lib-picker-value">黄埔校区 ▾</span></div>
        <div class="lib-picker"><span class="lib-picker-value">黄埔分馆（B1）栋 ▾</span></div>
      </div>
      <div class="lib-search-row">
        <span class="lib-search-icon">⌕</span>
        <input class="lib-search-input" type="text" placeholder="搜房间名、位置或设施" />
      </div>
      <div class="lib-capacity-row">
        <div
          v-for="item in capacities"
          :key="item.value"
          class="lib-chip"
          :class="{ 'lib-chip--selected': item.value === 0 }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div class="lib-results-heading">
      <span>看看空间的样子</span>
      <span class="lib-count">{{ spaces.length }} 个空间</span>
    </div>
    <div class="lib-notice">这里展示空间资料与同学反馈，实时空位和预约结果请以图书馆系统为准。</div>

    <div class="lib-space-list">
      <article v-for="space in spaces" :key="space.id" class="lib-space-card">
        <div class="lib-cover">
          <img v-if="space.photo" class="lib-cover-image" :src="liveAsset(space.photo)" alt="" />
          <div v-else class="lib-photo-placeholder">
            <img class="lib-placeholder-icon" :src="liveAsset('/assets/library.png')" alt="" />
            <span>实景照片待补充</span>
          </div>
          <span v-if="space.photo" class="lib-photo-count">{{ space.photoCount }} 张实景</span>
          <span v-if="space.floor" class="lib-floor-badge">{{ space.floor }}</span>
        </div>

        <div class="lib-card-content">
          <div class="lib-card-heading">
            <span class="lib-space-name">{{ space.name }}</span>
            <span class="lib-capacity">{{
              space.seatCount ? space.seatCount + ' 人容量' : '人数待补充'
            }}</span>
          </div>
          <div class="lib-location">{{ space.location || '具体位置待补充' }}</div>
          <div class="lib-summary">{{ space.summary || '桌椅布局与空间介绍待补充' }}</div>
          <div v-if="space.facilities" class="lib-facilities">{{ space.facilities }}</div>
          <div class="lib-card-footer">
            <span>{{ space.score }}</span>
            <span class="lib-detail-link">看实景与详情 →</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .library-page：二级页没有底栏，底部只留源码的 36rpx ---------- */
.live-library {
  min-height: 888px;
  padding: 46px 0 0;
  background: #f5f6fa;
  color: #282b3d;
}
.lib-space-list {
  padding: 0 calc(var(--u) * 28) calc(var(--u) * 36);
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.lib-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.lib-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.lib-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .guide-hero ---------- */
.lib-hero {
  padding: calc(var(--u) * 40) calc(var(--u) * 32) 0;
  background: linear-gradient(135deg, #efedff, #f2f6ff);
}
.lib-eyebrow {
  color: #77729d;
  font-size: calc(var(--u) * 20);
  letter-spacing: calc(var(--u) * 4);
}
.lib-hero-title {
  margin: calc(var(--u) * 14) 0;
  font-size: calc(var(--u) * 42);
  font-weight: 700;
}
.lib-hero-desc {
  color: #777a90;
  font-size: calc(var(--u) * 26);
}
.lib-type-tabs {
  display: flex;
  margin-top: calc(var(--u) * 32);
}
.lib-type-tab {
  flex: 1;
  padding: calc(var(--u) * 24) 0;
  border-bottom: calc(var(--u) * 5) solid transparent;
  color: #78798b;
  font-size: calc(var(--u) * 28);
  text-align: center;
}
.lib-type-tab--active {
  border-bottom-color: #7865d5;
  color: #6955c5;
  font-weight: 600;
}

/* ---------- .filter-panel ---------- */
.lib-filter {
  margin: calc(var(--u) * 24) calc(var(--u) * 28);
  padding: calc(var(--u) * 24);
  border-radius: calc(var(--u) * 24);
  background: #fff;
}
.lib-picker-row {
  display: flex;
  gap: calc(var(--u) * 20);
  padding-bottom: calc(var(--u) * 24);
}
.lib-picker {
  flex: 1;
  min-width: 0;
}
.lib-picker-value {
  display: block;
  overflow: hidden;
  font-size: calc(var(--u) * 26);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lib-search-row {
  display: flex;
  align-items: center;
  padding: calc(var(--u) * 18);
  border-radius: calc(var(--u) * 16);
  background: #f5f6fa;
}
.lib-search-icon {
  margin-right: calc(var(--u) * 14);
  color: #777a90;
  font-size: calc(var(--u) * 36);
  line-height: 1;
}
.lib-search-input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: calc(var(--u) * 26);
  outline: none;
}
.lib-search-input::placeholder {
  color: #a5a7b5;
}
.lib-capacity-row {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--u) * 12);
  margin-top: calc(var(--u) * 22);
}
.lib-chip {
  padding: calc(var(--u) * 12) calc(var(--u) * 16);
  border-radius: calc(var(--u) * 12);
  background: #f5f6fa;
  color: #747789;
  font-size: calc(var(--u) * 22);
}
.lib-chip--selected {
  background: #eee9ff;
  color: #6955c5;
}

/* ---------- .results-heading / .notice ---------- */
.lib-results-heading {
  display: flex;
  justify-content: space-between;
  margin: calc(var(--u) * 32) calc(var(--u) * 32) calc(var(--u) * 12);
  font-size: calc(var(--u) * 30);
  font-weight: 600;
}
.lib-count {
  color: #9193a3;
  font-size: calc(var(--u) * 24);
  font-weight: 400;
}
.lib-notice {
  margin: 0 calc(var(--u) * 32) calc(var(--u) * 24);
  color: #9698a6;
  font-size: calc(var(--u) * 22);
  line-height: 1.7;
}

/* ---------- .space-card ---------- */
.lib-space-card {
  margin-bottom: calc(var(--u) * 28);
  overflow: hidden;
  border-radius: calc(var(--u) * 24);
  background: #fff;
  box-shadow: 0 calc(var(--u) * 8) calc(var(--u) * 24) #29244206;
}
.lib-cover {
  position: relative;
  height: calc(var(--u) * 330);
  overflow: hidden;
  background: #eceef5;
}
/* 源码是 <image mode="aspectFill">；素材只有一张带字的校园截屏，
   这里用 object-fit: cover + 2.5 倍缩放把画面左上角那条（树 + 教学楼）裁出来，避开正中的引言文字 */
.lib-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
  transform: scale(2.5);
  transform-origin: left top;
}
.lib-photo-placeholder {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9b9eb1;
  font-size: calc(var(--u) * 24);
}
.lib-placeholder-icon {
  width: calc(var(--u) * 70);
  height: calc(var(--u) * 70);
  margin-bottom: calc(var(--u) * 16);
}
.lib-photo-count,
.lib-floor-badge {
  position: absolute;
  padding: calc(var(--u) * 8) calc(var(--u) * 16);
  border-radius: calc(var(--u) * 12);
  font-size: calc(var(--u) * 22);
}
.lib-photo-count {
  right: calc(var(--u) * 20);
  bottom: calc(var(--u) * 20);
  background: #24233899;
  color: #fff;
}
.lib-floor-badge {
  top: calc(var(--u) * 20);
  left: calc(var(--u) * 20);
  background: #fffffff0;
  color: #5e5485;
}
.lib-card-content {
  padding: calc(var(--u) * 26);
}
.lib-card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.lib-space-name {
  overflow-wrap: anywhere;
  font-size: calc(var(--u) * 34);
  font-weight: 600;
}
.lib-capacity {
  flex-shrink: 0;
  color: #7462b5;
  font-size: calc(var(--u) * 23);
}
.lib-location {
  margin: calc(var(--u) * 12) 0;
  color: #9698a6;
  font-size: calc(var(--u) * 24);
}
.lib-summary,
.lib-facilities {
  display: -webkit-box;
  overflow: hidden;
  font-size: calc(var(--u) * 26);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.lib-facilities {
  margin-top: calc(var(--u) * 12);
  color: #7a7e90;
  font-size: calc(var(--u) * 24);
}
.lib-card-footer {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--u) * 14);
  margin-top: calc(var(--u) * 22);
  padding-top: calc(var(--u) * 20);
  border-top: 1px solid #f0f1f6;
  color: #9999a8;
  font-size: calc(var(--u) * 22);
}
.lib-detail-link {
  flex-shrink: 0;
  color: #7965c4;
}
</style>
