<!--
  现版 · 自提（校园觅食 / 小摊列表）
  对应 quick-pick-main/pages/list/list.vue + components/StallList/StallList.vue
        + components/StallCard/StallCard.vue（含 StallLiveStatus compact / tip 标签）
  结构：吸顶头部（标题 + 副标题 + 搜索框 + 三个 tab）
        → 品类 / 位置筛选 chips → 数量 + 排序 → 小摊卡片列表 → 到底提示。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  文案与示例数据取自源码默认态：全部分类 / 全部位置 / 最热，列表为桥苑小摊 5 家。
-->
<script setup>
/*
 * 卡片不再手抄：直接 import 小程序源码里的 StallCard +
 * 它自己的 StallLiveStatus / tip 子组件，尺寸与结构 100% 同源。
 * rpx 由 vite.config.js 的 postcss 插件统一换成 calc(var(--u) * N)。
 */
import { computed } from 'vue';
import StallCard from '@app/components/StallCard/StallCard.vue';
import { liveAsset } from './asset.js';

/* list.vue 的 tabs，默认选中「桥苑小摊」 */
const tabs = [
  { key: 'stall', label: '桥苑小摊' },
  { key: 'business', label: '商业中心' },
  { key: 'canteen', label: '饭堂' },
];

/* StallList 里由接口拉取的分类 / 位置，这里按线上默认态写死 */
const classifications = ['全部分类', '主食', '饮品', '小吃', '粉面'];
const locations = ['全部位置', '工行门', '学4门'];

const sortOptions = [
  { value: 'hot', name: '最热', active: true },
  { value: 'latest', name: '最新', active: false },
];

/* normalizeStall() 之后的字段形状，数据来自线上小摊（徐豆豆 / 全记 / 林胡子…） */
const stalls = [
  {
    id: '1',
    name: '徐豆豆',
    type: '饮品',
    ratingText: '4.2',
    ratingUsersCount: 4,
    avgPriceText: '10',
    tags: ['糖水', '甜品'],
    locationText: '工行门 · 工行门附近',
    timeText: '11:00 ~ 22:30',
    favoriteUsersCount: 0,
    liveStatus: { displayText: '最近还没人确认', evidence: '最近还没有新的反馈' },
    image: '/assets/source-fidelity/stalls/xudoudou.jpeg',
  },
  {
    id: '2',
    name: '全记',
    type: '主食',
    ratingText: '4.3',
    ratingUsersCount: 2,
    avgPriceText: '10',
    tags: ['炒粉', '主食'],
    locationText: '工行门 · 工行门附近',
    timeText: '11:00 ~ 22:30',
    favoriteUsersCount: 1,
    liveStatus: { displayText: '最近还没人确认', evidence: '最近还没有新的反馈' },
    image: '/assets/source-fidelity/stalls/quanji.jpeg',
  },
  {
    id: '3',
    name: '林胡子猪脚饭',
    type: '主食',
    ratingText: '5.0',
    ratingUsersCount: 1,
    avgPriceText: '15',
    tags: ['主食', '猪脚饭', '牛腩饭'],
    locationText: '学4门 · 学4门附近',
    timeText: '11:00 ~ 22:30',
    favoriteUsersCount: 3,
    liveStatus: { displayText: '最近还没人确认', evidence: '最近还没有新的反馈' },
    image: '/assets/source-fidelity/stalls/linhuzi.jpeg',
  },
  {
    id: '4',
    name: '夜宵炒面王',
    type: '粉面',
    ratingText: '4.1',
    ratingUsersCount: 7,
    avgPriceText: '11',
    tags: ['炒面', '夜宵'],
    locationText: '工行门 · 工行门附近',
    timeText: '19:00 ~ 01:00',
    favoriteUsersCount: 2,
    liveStatus: { displayText: '最近有新反馈', evidence: '3 人看到在营业' },
    image: '/assets/source-fidelity/commercial/05-come-on.jpg',
  },
  {
    id: '5',
    name: '老潼关肉夹馍',
    type: '小吃',
    ratingText: '4.5',
    ratingUsersCount: 6,
    avgPriceText: '12',
    tags: ['肉夹馍', '小吃'],
    locationText: '学4门 · 学4门附近',
    timeText: '11:00 ~ 21:30',
    favoriteUsersCount: 4,
    liveStatus: { displayText: '最近还没人确认', evidence: '最近还没有新的反馈' },
    image: '/assets/source-fidelity/commercial/01-laotongguan.jpg',
  },
];

/* StallCard 的 tagPalette，按 tag 下标取色 */
const tagPalette = ['#ffe1de', '#ffe9d6', '#fff1d0', '#ffeef2'];
/* 交给原生 StallCard 的 props：字段名要对齐 normalizeStall() 之后的形状 */
const stallCards = computed(() =>
  stalls.map((stall) => ({
    ...stall,
    image: liveAsset(stall.image),
    thumbnail: liveAsset(stall.image),
    storeClassificationName: stall.type,
    favorited: stall.favoriteUsersCount > 0,
    isPaused: false,
    liveStatus: {
      displayText: stall.liveStatus.displayText,
      evidenceText: stall.liveStatus.evidence,
    },
  })),
);
</script>

<template>
  <div class="live-page live-list">
    <!-- list.vue：吸顶的标题 + 搜索 + 三个 tab（类名加 list- 前缀避开设计台原版样式） -->
    <header class="list-header live-sticky-head">
      <div class="tab-section-header">
        <div class="list-title tab-section-title">校园觅食</div>
        <div class="tab-section-subtitle">先选地方，再慢慢挑</div>
      </div>

      <div class="list-search tab-search-entry">
        <svg class="list-search__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.4" stroke="#a39bad" stroke-width="1.9" />
          <path d="m15.6 15.6 4.6 4.6" stroke="#a39bad" stroke-width="1.9" stroke-linecap="round" />
        </svg>
        <span>搜店铺、小摊或饭堂</span>
      </div>

      <div class="list-tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          class="list-tab"
          :class="{ active: index === 0 }"
        >
          {{ tab.label }}
        </div>
      </div>
    </header>

    <!-- StallList.vue：品类 / 位置筛选 -->
    <div class="stall-list-wrap">
      <div class="sl-filter-panel">
        <div class="sl-filter-line">
          <span class="sl-filter-label">品类</span>
          <div class="sl-filter-scroll">
            <div class="sl-filter-row">
              <div
                v-for="(item, index) in classifications"
                :key="item"
                class="sl-tab"
                :class="{ 'sl-tab--active': index === 0 }"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div class="sl-filter-line sl-filter-line--location">
          <span class="sl-filter-label">位置</span>
          <div class="sl-filter-scroll">
            <div class="sl-filter-row">
              <div
                v-for="(item, index) in locations"
                :key="item"
                class="sl-tab sl-tab--location"
                :class="{ 'sl-tab--active': index === 0 }"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数量 + 排序 -->
      <div class="sl-section-toolbar">
        <div class="sl-count-group">
          <span class="sl-tip-count">共 132 家</span>
          <span class="sl-loaded-count">已展示 {{ stalls.length }} 家</span>
        </div>
        <div class="sl-sort-switch">
          <div
            v-for="option in sortOptions"
            :key="option.value"
            class="sl-sort-option"
            :class="{ 'sl-sort-option--active': option.active }"
          >
            {{ option.name }}
          </div>
        </div>
      </div>

      <div class="sl-list">
        <!-- 原生 StallCard：封面 / 评分胶囊 / tip 标签 / 现场状态 / 位置时间收藏，全部来自源码 -->
        <StallCard v-for="stall in stallCards" :key="stall.id" :stall="stall" />
      </div>

      <div class="sl-page-footer">
        <span>已经逛完啦 · 好味道等你再来</span>
      </div>
      <div class="sl-bottom-space"></div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 页面根：小程序 page 白底，列表区 $color-bg-page ---------- */
.live-list {
  background: #f8f8f8;
}

/* ---------- 吸顶头部（对应 .pickup-header） ---------- */
.list-header {
  /* 源码 paddingTop 取胶囊按钮顶部（约状态栏下 2px），这里留 4rpx 补齐 */
  padding-top: calc(var(--u) * 4);
  background: #fff;
}
.list-title {
  /* 源码 minHeight = 胶囊高度 32px，右侧留出胶囊位置 */
  min-height: 32px;
}
.live-list .list-search {
  height: calc(var(--u) * 78);
  margin: 0 calc(var(--u) * 28);
  border: 1px solid #eeebf3;
  border-radius: calc(var(--u) * 18);
  background: #f8f7fa;
}
.list-search__icon {
  flex-shrink: 0;
  width: calc(var(--u) * 30);
  height: calc(var(--u) * 30);
}
.list-tabs {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--u) * 28);
  margin-top: calc(var(--u) * 18);
  padding: 0 calc(var(--u) * 28);
}
.list-tab {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 22) 0;
  color: #aaa4b5;
  font-size: calc(var(--u) * 30);
  text-align: center;
}
.list-tab.active {
  color: #7153bf;
  font-weight: 600;
}
.list-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(var(--u) * 38);
  height: calc(var(--u) * 5);
  margin-left: calc(var(--u) * -19);
  border-radius: calc(var(--u) * 5);
  background: #8f75d4;
}

/* ---------- 列表区（stall-list-wrap） ---------- */
.stall-list-wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  background: #f8f8f8;
}

/* ---------- 品类 / 位置筛选 ---------- */
.sl-filter-panel {
  padding: calc(var(--u) * 14) 0;
  background: #fff;
  border-bottom: 1px solid #eeedf5;
}
.sl-filter-line {
  display: flex;
  align-items: center;
  padding: calc(var(--u) * 4) 0 calc(var(--u) * 4) calc(var(--u) * 24);
}
.sl-filter-line--location {
  margin-top: calc(var(--u) * 8);
}
.sl-filter-label {
  flex-shrink: 0;
  width: calc(var(--u) * 48);
  margin-right: calc(var(--u) * 12);
  color: #aaa7b8;
  font-size: calc(var(--u) * 22);
  white-space: nowrap;
}
.sl-filter-scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.sl-filter-scroll::-webkit-scrollbar {
  display: none;
}
.sl-filter-row {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 10);
  padding-right: calc(var(--u) * 24);
}
.sl-tab {
  flex-shrink: 0;
  padding: calc(var(--u) * 12) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 14);
  background: #f6f5f9;
  color: #6d697d;
  font-size: calc(var(--u) * 25);
  line-height: 1.4;
}
.sl-tab--active {
  background: #eeebff;
  color: #6953d4;
  font-weight: 600;
}
.sl-tab--location {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--u) * 56);
  box-sizing: border-box;
  padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border: 1px solid #eeedf5;
  border-radius: calc(var(--u) * 28);
  background: #f7f6fa;
  font-size: calc(var(--u) * 24);
}
.sl-tab--location.sl-tab--active {
  background: #f1effb;
  border-color: #e5dff9;
}

/* ---------- 数量 + 排序 ---------- */
.sl-section-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: calc(var(--u) * 76);
  box-sizing: border-box;
  padding: calc(var(--u) * 12) calc(var(--u) * 24) calc(var(--u) * 8);
}
.sl-count-group {
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 14);
}
.sl-tip-count {
  color: #999999;
  font-size: calc(var(--u) * 24);
}
.sl-loaded-count {
  color: #b0acbc;
  font-size: calc(var(--u) * 20);
}
.sl-sort-switch {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 4);
  padding: calc(var(--u) * 5);
  border-radius: calc(var(--u) * 14);
  background: #eeedf4;
}
.sl-sort-option {
  position: relative;
  padding: calc(var(--u) * 9) calc(var(--u) * 22);
  border-radius: calc(var(--u) * 10);
  color: #999999;
  font-size: calc(var(--u) * 24);
}
.sl-sort-option::after {
  content: '';
  position: absolute;
  right: 20%;
  bottom: calc(var(--u) * 2);
  left: 20%;
  height: calc(var(--u) * 4);
  border-radius: calc(var(--u) * 4);
  background-color: transparent;
}
.sl-sort-option--active {
  background: #fff;
  color: var(--live-primary);
  font-weight: 600;
}
.sl-sort-option--active::after {
  background-color: var(--live-primary);
}

/* ---------- 卡片列表 ---------- */
.sl-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 16);
  padding: 0 calc(var(--u) * 20) calc(var(--u) * 12);
}
/* ---------- 列表底部 ---------- */
.sl-page-footer {
  display: flex;
  min-height: calc(var(--u) * 96);
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 12);
  color: #aaa5b6;
  font-size: calc(var(--u) * 22);
}
.sl-bottom-space {
  height: calc(var(--u) * 40);
}
</style>
