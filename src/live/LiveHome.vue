<script>
export const meta = { id: 'home', label: '首页', note: '去哪吃 + 猜你喜欢', group: '首页', tab: 'home', order: 1 };
</script>

<!--
  现版 · 首页（对应 quick-pick-main/pages/homepage/homepage.vue）
  结构：品牌顶栏 → 去哪吃（3 项）→ 快捷入口（3 项）→ 庆快金榜 + 新店报到 → 猜你喜欢双列瀑布。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
-->
<script setup>
/* 新店报到直接用小程序源码里的 components/hot/hot.vue（含它在内的 scroll-view 横滑） */
import HotVue from '@app/components/hot/hot.vue';
import { liveAsset } from './asset.js';

const entries = [
  { id: 'stalls', label: '桥苑小摊', icon: '/assets/live/home/stall.svg' },
  { id: 'business', label: '商业中心', icon: '/assets/live/home/business.svg' },
  { id: 'canteen', label: '庆园饭堂', icon: '/assets/live/home/canteen.svg' },
];

const shortcuts = [
  { id: 'friends', label: '好友发现', icon: '/assets/live/home/friends.svg', badge: 3 },
  { id: 'collections', label: '我的收藏', icon: '/assets/live/home/saved.svg' },
  { id: 'random', label: '今天吃哪家', icon: '/assets/live/home/meal.svg' },
];

/* hot.vue 的 props：text 是标题，hscorestore 是新店数组（name / image / storeId） */
const newStores = [
  { storeId: 'h1', name: '黄师傅', image: liveAsset('/assets/source-fidelity/featured/huang-shifu.jpg') },
  { storeId: 'h2', name: '全记', image: liveAsset('/assets/source-fidelity/stalls/quanji.jpeg') },
  { storeId: 'h3', name: '林胡子猪脚饭', image: liveAsset('/assets/source-fidelity/stalls/linhuzi.jpeg') },
];

const feedTabs = ['全部推荐', '商业中心', '街边小摊'];

const feedCards = [
  {
    name: '徐豆豆',
    location: '工行门',
    rating: '★ 4.2',
    count: '4 人评过',
    type: '街边小摊',
    stall: true,
    image: '/assets/source-fidelity/stalls/xudoudou.jpeg',
  },
  {
    name: '黄师傅',
    location: '大厅右',
    rating: '评分待更新',
    count: '389 人评过',
    type: '校园店铺',
    stall: false,
    image: '/assets/source-fidelity/featured/huang-shifu.jpg',
  },
  {
    name: '全记',
    location: '工行门',
    rating: '★ 4.3',
    count: '2 人评过',
    type: '街边小摊',
    stall: true,
    image: '/assets/source-fidelity/stalls/quanji.jpeg',
  },
  {
    name: '林胡子猪脚饭',
    location: '学4门',
    rating: '★ 5.0',
    count: '1 人评过',
    type: '街边小摊',
    stall: true,
    image: '/assets/source-fidelity/stalls/linhuzi.jpeg',
  },
];
</script>

<template>
  <div class="live-page live-home">
    <header class="home-header">
      <div class="brand-row">
        <img class="brand-logo" :src="liveAsset('/assets/qingkuai.ico')" alt="庆快校园" />
        <div class="brand-copy">
          <strong class="brand-name">庆快校园</strong>
          <span class="brand-note">吃饭、闲逛、找朋友</span>
        </div>
        <button class="header-notice" aria-label="查看校园通知">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z" stroke="#655d70" stroke-width="1.6" stroke-linejoin="round" />
            <path d="M10 18.2a2 2 0 0 0 4 0" stroke="#655d70" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <i class="header-notice-dot"></i>
        </button>
      </div>
    </header>

    <div class="home-body">
      <section class="home-primary">
        <div class="home-section-heading"><h2 class="home-section-title">去哪吃</h2></div>
        <div class="primary-grid">
          <button v-for="item in entries" :key="item.id" class="primary-entry">
            <span class="primary-icon"><img :src="liveAsset(item.icon)" alt="" /></span>
            <span class="primary-label">{{ item.label }}</span>
          </button>
        </div>
      </section>

      <div class="home-shortcuts">
        <button v-for="item in shortcuts" :key="item.id" class="home-shortcut">
          <span class="shortcut-icon"><img class="shortcut-image" :src="liveAsset(item.icon)" alt="" /></span>
          <span class="shortcut-label">{{ item.label }}</span>
          <span v-if="item.badge" class="shortcut-badge">{{ item.badge }}</span>
        </button>
      </div>

      <div class="re-card">
        <button class="gold-entry">
          <img class="entry-emblem" :src="liveAsset('/assets/live/home/rank.svg')" alt="" />
          <span class="entry-content">
            <span class="entry-title">庆快金榜</span>
            <span class="entry-description">看看大家最近常去、常收藏的店</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m9 5 7 7-7 7" stroke="#9b92ad" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="re-card_new">
          <!-- 原生 hot.vue：标题 + 横滑新店卡，尺寸与源码同源 -->
          <HotVue text="新店报到" :hscorestore="newStores" />
        </div>
      </div>

      <section class="discovery-feed">
        <div class="feed-heading">
          <h2 class="feed-title">猜你喜欢</h2>
          <span class="feed-subtitle">不知道吃什么，就从这里逛</span>
        </div>
        <div class="feed-tabs">
          <button v-for="(tab, index) in feedTabs" :key="tab" class="feed-tab" :class="{ active: index === 0 }">
            {{ tab }}
          </button>
        </div>
        <div class="feed-grid">
          <article v-for="card in feedCards" :key="card.name" class="food-card">
            <div class="food-cover">
              <img class="food-image" :src="liveAsset(card.image)" alt="" />
              <span class="food-type" :class="{ stall: card.stall }">{{ card.type }}</span>
            </div>
            <div class="food-content">
              <span class="food-name">{{ card.name }}</span>
              <span class="food-location">{{ card.location }}</span>
              <div class="food-bottom">
                <span class="food-rating">{{ card.rating }}</span>
                <span class="food-count">{{ card.count }}</span>
              </div>
            </div>
          </article>
        </div>
        <div class="feed-state">
          <span class="feed-end-line"></span>
          <span>已经到底了</span>
          <span class="feed-end-line"></span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-header {
  position: sticky;
  top: 46px;
  z-index: 12;
  box-sizing: border-box;
  padding: 0 calc(var(--u) * 28);
  background: rgba(255, 255, 255, 0.98);
}
.brand-row {
  display: flex;
  min-height: 32px;
  align-items: center;
  box-sizing: border-box;
}
.brand-logo {
  flex-shrink: 0;
  width: calc(var(--u) * 58);
  height: calc(var(--u) * 58);
  margin-right: calc(var(--u) * 16);
  border-radius: calc(var(--u) * 16);
}
.brand-copy {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 2);
}
.brand-name {
  color: var(--live-ink-2);
  font-size: calc(var(--u) * 34);
  font-weight: 650;
  line-height: calc(var(--u) * 42);
  letter-spacing: calc(var(--u) * 1);
}
.brand-note {
  color: var(--live-muted);
  font-size: calc(var(--u) * 19);
  line-height: calc(var(--u) * 26);
}
.header-notice {
  position: relative;
  display: flex;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  margin-left: auto;
  align-items: center;
  justify-content: center;
}
.header-notice img,
.header-notice svg {
  width: calc(var(--u) * 40);
  height: calc(var(--u) * 40);
}
.header-notice-dot {
  position: absolute;
  top: calc(var(--u) * 10);
  right: calc(var(--u) * 9);
  width: calc(var(--u) * 12);
  height: calc(var(--u) * 12);
  border: calc(var(--u) * 3) solid #fff;
  border-radius: 50%;
  background: var(--live-accent-soft);
}
.home-body {
  box-sizing: border-box;
  width: 100%;
  padding-top: calc(var(--u) * 12);
}
.home-primary {
  padding: calc(var(--u) * 22) calc(var(--u) * 28) calc(var(--u) * 8);
  background: #fff;
}
.home-section-heading {
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 18);
  margin-bottom: calc(var(--u) * 24);
}
.home-section-title {
  font-size: calc(var(--u) * 32);
  font-weight: 650;
}
.primary-grid,
.home-shortcuts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.primary-grid {
  gap: calc(var(--u) * 8);
}
.primary-entry {
  display: flex;
  min-width: 0;
  min-height: calc(var(--u) * 166);
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.primary-icon {
  display: flex;
  width: calc(var(--u) * 98);
  height: calc(var(--u) * 98);
  align-items: center;
  justify-content: center;
}
.primary-icon img {
  width: calc(var(--u) * 96);
  height: calc(var(--u) * 96);
  object-fit: contain;
}
.primary-label {
  margin-top: calc(var(--u) * 12);
  color: var(--live-ink-4);
  font-size: calc(var(--u) * 25);
  font-weight: 550;
  white-space: nowrap;
}
.home-shortcuts {
  margin: 0;
  padding: 0 calc(var(--u) * 28) calc(var(--u) * 20);
  background: #fff;
}
.home-shortcut {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: calc(var(--u) * 112);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.shortcut-icon {
  display: flex;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  align-items: center;
  justify-content: center;
}
.shortcut-image {
  width: calc(var(--u) * 62);
  height: calc(var(--u) * 62);
  object-fit: contain;
}
.shortcut-label {
  margin-top: calc(var(--u) * 8);
  color: var(--live-ink-5);
  font-size: calc(var(--u) * 23);
  line-height: calc(var(--u) * 32);
  white-space: nowrap;
}
.shortcut-badge {
  position: absolute;
  top: 0;
  left: calc(50% + var(--u) * 12);
  min-width: calc(var(--u) * 28);
  padding: 0 calc(var(--u) * 7);
  border: calc(var(--u) * 3) solid #fff;
  border-radius: calc(var(--u) * 30);
  background: var(--live-badge);
  color: #fff;
  font-size: calc(var(--u) * 18);
  line-height: calc(var(--u) * 26);
  text-align: center;
}
.re-card {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 12);
  padding: calc(var(--u) * 12) calc(var(--u) * 28) 0;
}
.gold-entry {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 18);
  padding: calc(var(--u) * 20) 0 calc(var(--u) * 22);
  border-bottom: 1px solid #eee9df;
}
.entry-emblem {
  flex-shrink: 0;
  width: calc(var(--u) * 82);
  height: calc(var(--u) * 82);
}
.entry-content {
  flex: 1;
  min-width: 0;
}
.entry-title,
.entry-description {
  display: block;
}
.entry-title {
  color: #55462f;
  font-size: calc(var(--u) * 29);
  font-weight: 600;
  line-height: calc(var(--u) * 40);
}
.entry-description {
  margin-top: calc(var(--u) * 4);
  color: #8c829c;
  font-size: calc(var(--u) * 21);
  line-height: calc(var(--u) * 30);
}
.re-card_new {
  overflow: hidden;
  border-radius: calc(var(--u) * 22);
  background: #fff;
}
.discovery-feed {
  margin-top: calc(var(--u) * 16);
  padding: calc(var(--u) * 30) calc(var(--u) * 28) calc(var(--u) * 12);
  background: #fff;
}
.feed-heading {
  display: flex;
  align-items: center;
}
.feed-title {
  color: #29262e;
  font-size: calc(var(--u) * 35);
  font-weight: 750;
}
.feed-subtitle {
  margin-left: calc(var(--u) * 18);
  color: #a5a0ac;
  font-size: calc(var(--u) * 21);
}
.feed-tabs {
  display: inline-flex;
  gap: calc(var(--u) * 6);
  margin: calc(var(--u) * 24) 0 calc(var(--u) * 22);
  padding: calc(var(--u) * 5);
  border-radius: calc(var(--u) * 16);
  background: #f5f4f8;
}
.feed-tab {
  padding: calc(var(--u) * 10) calc(var(--u) * 22);
  border-radius: calc(var(--u) * 12);
  color: #8e8797;
  font-size: calc(var(--u) * 23);
  line-height: calc(var(--u) * 32);
}
.feed-tab.active {
  background: #fff;
  color: var(--live-primary);
  font-weight: 600;
}
.feed-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: calc(var(--u) * 18);
}
.food-card {
  overflow: hidden;
  border-radius: calc(var(--u) * 18);
  background: #faf9fb;
}
.food-cover {
  position: relative;
  height: calc(var(--u) * 226);
  background: #f0eaf4;
}
.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.food-type {
  position: absolute;
  bottom: calc(var(--u) * 12);
  left: calc(var(--u) * 12);
  padding: calc(var(--u) * 5) calc(var(--u) * 13);
  border-radius: calc(var(--u) * 8);
  background: rgba(52, 49, 61, 0.72);
  color: #fff;
  font-size: calc(var(--u) * 19);
}
.food-type.stall {
  background: rgba(163, 85, 41, 0.85);
}
.food-content {
  padding: calc(var(--u) * 19) calc(var(--u) * 18) calc(var(--u) * 21);
}
.food-name {
  display: block;
  overflow: hidden;
  color: #35303c;
  font-size: calc(var(--u) * 29);
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.food-location {
  display: block;
  overflow: hidden;
  margin-top: calc(var(--u) * 10);
  color: #aaa1b0;
  font-size: calc(var(--u) * 22);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.food-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: calc(var(--u) * 17);
}
.food-rating {
  color: var(--live-warm);
  font-size: calc(var(--u) * 23);
  font-weight: 600;
}
.food-count {
  color: #b4aeba;
  font-size: calc(var(--u) * 19);
}
.feed-state {
  display: flex;
  min-height: calc(var(--u) * 100);
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 16);
  box-sizing: border-box;
  padding: calc(var(--u) * 24) calc(var(--u) * 10);
  color: #9b95a5;
  font-size: calc(var(--u) * 23);
  line-height: calc(var(--u) * 32);
}
.feed-end-line {
  width: calc(var(--u) * 50);
  height: 1px;
  background: #e8e5ed;
}
</style>
