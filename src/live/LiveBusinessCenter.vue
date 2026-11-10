<script>
export const meta = {
  id: 'businesscenter',
  label: '商业中心',
  note: '楼层与店铺分类',
  group: '校园觅食',
  tab: 'discover',
  order: 2,
};
</script>

<!--
  现版 · 商业中心（校园觅食 tab 的第二格）
  对应 quick-pick-main/pages/list/list.vue（头部 + 三个 tab）
        + components/DiningBrowser/DiningBrowser.vue（kind="business"，源码里 商业中心 真正的渲染者）
        + pagesLog/businesscenter/businesscenter.vue（同名老页面，已无入口；它的「按地区/按类型」就是
          DiningBrowser 的「分区侧栏 + 品类 chip」，这里按线上实际在用的 DiningBrowser 复刻）
  结构：吸顶头部（校园觅食 + 副标题 + 搜索框 + 三个 tab，商业中心高亮）
        → 地点行（商业中心⌄ + 「逛逛校园好店」）→ 品类 chips
        → 分区侧栏（178rpx）+ 右侧店铺卡列表（图 132rpx + 店名 / 星级 / 品类·位置 / 营业时间）。
  尺寸照抄源码 rpx：1rpx = 0.52px。数据取线上默认态（全部 + 全部品类，老潼关等 5 家）。
  刻意简化：下拉选择器、下拉刷新、无限加载（静态稿一次性铺满），侧栏不做独立滚动。
-->
<script setup>
import { liveAsset } from './asset.js';

const tabs = [
  { key: 'stall', label: '桥苑小摊' },
  { key: 'business', label: '商业中心' },
  { key: 'canteen', label: '饭堂' },
];
const activeTab = 'business';

/* DiningBrowser：parents[0].name + venue-hint */
const venue = '商业中心';
const venueHint = '逛逛校园好店';

/* getStoreClassificationList() 的分类，默认选「全部」 */
const types = ['主食', '饮品', '小吃', '粉面'];
const activeType = '';

/* getDiningZones()：分区侧栏，默认「全部」 */
const zones = [
  '全部',
  '大厅左',
  '大厅中',
  '大厅右',
  '大厅前',
  '大厅后',
  '京东一路',
  '小博联区',
  '大博联区',
  '古茗附近',
  '猪大哈区',
];
const activeZone = '全部';

/* getDiningStores()：评分 / 人数 / 分类·位置 / 营业时间，和 ref-mall.jpg 一致 */
const stores = [
  {
    id: 's1',
    name: '老潼关肉夹馍',
    rating: '9.3',
    ratingCount: 50,
    type: '主食',
    place: '天桥附近二楼',
    hours: '08:00–23:59',
    image: '/assets/source-fidelity/commercial/01-laotongguan.jpg',
  },
  {
    id: 's2',
    name: '老上海馄饨铺',
    rating: '8.8',
    ratingCount: 165,
    type: '主食',
    place: '大厅中',
    hours: '全天营业',
    image: '/assets/source-fidelity/commercial/02-laoshanghai.jpg',
  },
  {
    id: 's3',
    name: '功夫小茗',
    rating: '8.7',
    ratingCount: 71,
    type: '饮品',
    place: '大厅中',
    hours: '全天营业',
    image: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg',
  },
  {
    id: 's4',
    name: '韩国风味',
    rating: '8.9',
    ratingCount: 143,
    type: '主食',
    place: '大厅中',
    hours: '08:00–20:00',
    image: '/assets/source-fidelity/commercial/04-korean-flavor.jpg',
  },
  {
    id: 's5',
    name: 'Come On潮味',
    rating: '8.7',
    ratingCount: 79,
    type: '主食',
    place: '大厅中',
    hours: '全天营业',
    image: '/assets/source-fidelity/commercial/05-come-on.jpg',
  },
];
</script>

<template>
  <div class="live-page live-businesscenter">
    <!-- list.vue 的吸顶头部：标题 / 副标题 / 搜索 / 三 tab（文案与源码逐字一致） -->
    <header class="bc-head live-sticky-head">
      <div class="tab-section-header">
        <div class="bc-title tab-section-title">校园觅食</div>
        <div class="tab-section-subtitle">先选地方，再慢慢挑</div>
      </div>

      <div class="bc-search tab-search-entry">
        <svg class="bc-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.4" stroke="#a39bad" stroke-width="1.9" />
          <path d="m15.6 15.6 4.6 4.6" stroke="#a39bad" stroke-width="1.9" stroke-linecap="round" />
        </svg>
        <span>搜店铺、小摊或饭堂</span>
      </div>

      <div class="bc-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="bc-tab"
          :class="{ active: tab.key === activeTab }"
        >
          {{ tab.label }}
        </div>
      </div>
    </header>

    <!-- DiningBrowser：筛选区 -->
    <div class="bc-filters">
      <div class="bc-venue">
        <div class="bc-venue-pick">
          <span class="bc-venue-name">{{ venue }}</span>
          <span class="bc-chevron"></span>
        </div>
        <span class="bc-venue-hint">{{ venueHint }}</span>
      </div>

      <div class="bc-filter-line">
        <span class="bc-filter-label">品类</span>
        <div class="bc-filter-scroll">
          <div class="bc-chips">
            <div class="bc-chip" :class="{ active: !activeType }">全部</div>
            <div
              v-for="type in types"
              :key="type"
              class="bc-chip"
              :class="{ active: activeType === type }"
            >
              {{ type }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DiningBrowser：分区侧栏 + 店铺卡列表 -->
    <div class="bc-browser">
      <div class="bc-zones">
        <div class="bc-zone-label">分区</div>
        <div
          v-for="zone in zones"
          :key="zone"
          class="bc-zone"
          :class="{ active: activeZone === zone }"
        >
          {{ zone }}
        </div>
      </div>

      <div class="bc-main">
        <div class="bc-results">
          <article v-for="store in stores" :key="store.id" class="bc-store">
            <img class="bc-photo" :src="liveAsset(store.image)" alt="" />
            <div class="bc-content">
              <span class="bc-name">{{ store.name }}</span>
              <div class="bc-rating">
                <span class="bc-score">★ {{ store.rating }}</span>
                <span class="bc-count">{{ store.ratingCount }} 人评过</span>
              </div>
              <span class="bc-location">{{ store.type }} · {{ store.place }}</span>
              <span class="bc-hours">{{ store.hours }}</span>
            </div>
          </article>
        </div>
        <div class="bc-bottom">已经到底啦</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-businesscenter {
  background: #f6f7fa;
}

/* ---------- 吸顶头部（和 LiveList 的 list-header 同一套数字） ---------- */
.bc-head {
  padding-top: calc(var(--u) * 4);
  background: #ffffff;
}
.bc-title {
  min-height: 32px;
}
.live-businesscenter .bc-search {
  height: calc(var(--u) * 78);
  margin: 0 calc(var(--u) * 28);
  border: 1px solid #eeebf3;
  border-radius: calc(var(--u) * 18);
  background: #f8f7fa;
}
.bc-search-icon {
  flex-shrink: 0;
  width: calc(var(--u) * 30);
  height: calc(var(--u) * 30);
}
.bc-tabs {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--u) * 28);
  margin-top: calc(var(--u) * 18);
  padding: 0 calc(var(--u) * 28);
}
.bc-tab {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 22) 0;
  color: #aaa4b5;
  font-size: calc(var(--u) * 30);
  text-align: center;
}
.bc-tab.active {
  color: #7153bf;
  font-weight: 600;
}
.bc-tab.active::after {
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

/* ---------- .dining-filters ---------- */
.bc-filters {
  flex-shrink: 0;
  padding: calc(var(--u) * 12) calc(var(--u) * 28) calc(var(--u) * 22);
  background: #ffffff;
  border-bottom: 1px solid #eeedf5;
}
.bc-venue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
  margin-bottom: calc(var(--u) * 18);
}
.bc-venue-pick {
  display: flex;
  align-items: center;
  min-height: calc(var(--u) * 60);
  gap: calc(var(--u) * 12);
}
.bc-venue-name {
  color: #323343;
  font-size: calc(var(--u) * 31);
  font-weight: 600;
  line-height: 1.4;
}
.bc-chevron {
  display: flex;
  width: calc(var(--u) * 36);
  height: calc(var(--u) * 36);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f1f8;
}
.bc-chevron::before {
  content: '';
  width: calc(var(--u) * 10);
  height: calc(var(--u) * 10);
  margin-top: calc(var(--u) * -5);
  border-right: calc(var(--u) * 3) solid #9793ac;
  border-bottom: calc(var(--u) * 3) solid #9793ac;
  transform: rotate(45deg);
}
.bc-venue-hint {
  flex-shrink: 0;
  color: #aaa8b8;
  font-size: calc(var(--u) * 21);
}
.bc-filter-line {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 18);
  margin-top: calc(var(--u) * 12);
}
.bc-filter-label {
  flex-shrink: 0;
  color: #9795a6;
  font-size: calc(var(--u) * 23);
}
.bc-filter-scroll {
  flex: 1;
  width: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.bc-filter-scroll::-webkit-scrollbar {
  display: none;
}
.bc-chips {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
}
.bc-chip {
  flex-shrink: 0;
  padding: calc(var(--u) * 12) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 12);
  background: #f7f7fa;
  color: #797588;
  font-size: calc(var(--u) * 24);
  line-height: 1.4;
}
.bc-chip.active {
  background: #efebff;
  color: #6a5acd;
  font-weight: 600;
}

/* ---------- .browser-body：分区侧栏 + 列表 ---------- */
.bc-browser {
  display: flex;
  align-items: stretch;
  background: #f7f6fa;
}

/* .zone-sidebar */
.bc-zones {
  width: calc(var(--u) * 178);
  flex-shrink: 0;
  border-right: 1px solid #ebe7f2;
  background: #f3f1f8;
}
.bc-zone-label {
  padding: calc(var(--u) * 26) calc(var(--u) * 22) calc(var(--u) * 12);
  color: #a19aac;
  font-size: calc(var(--u) * 21);
}
.bc-zone {
  position: relative;
  display: flex;
  min-height: calc(var(--u) * 88);
  box-sizing: border-box;
  align-items: center;
  padding: calc(var(--u) * 18) calc(var(--u) * 20) calc(var(--u) * 18) calc(var(--u) * 26);
  color: #797287;
  font-size: calc(var(--u) * 25);
  line-height: 1.4;
}
.bc-zone.active {
  background: #ffffff;
  color: #6a5acd;
  font-weight: 600;
}
.bc-zone.active::before {
  content: '';
  position: absolute;
  top: calc(var(--u) * 25);
  bottom: calc(var(--u) * 25);
  left: 0;
  width: calc(var(--u) * 6);
  border-radius: 0 calc(var(--u) * 6) calc(var(--u) * 6) 0;
  background: #8b78dc;
}

/* .store-results / .with-sidebar .store-results */
.bc-main {
  flex: 1;
  min-width: 0;
  background: #f7f6fa;
}
.bc-results {
  padding: calc(var(--u) * 18) calc(var(--u) * 16) 0;
}

/* .dining-store（.with-sidebar 变体：图 132rpx、padding 18rpx） */
.bc-store {
  display: flex;
  gap: calc(var(--u) * 16);
  margin-bottom: calc(var(--u) * 18);
  padding: calc(var(--u) * 18);
  border: 1px solid #ececf3;
  border-radius: calc(var(--u) * 22);
  background: #ffffff;
}
.bc-photo {
  width: calc(var(--u) * 132);
  height: calc(var(--u) * 132);
  flex-shrink: 0;
  border-radius: calc(var(--u) * 16);
  object-fit: cover;
  background: #f3f0f8;
}
.bc-content {
  min-width: 0;
  flex: 1;
}
.bc-name {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #33313e;
  font-size: calc(var(--u) * 29);
  font-weight: 600;
  line-height: 1.4;
}
.bc-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--u) * 14);
  margin-top: calc(var(--u) * 12);
}
.bc-score {
  color: #d18950;
  font-size: calc(var(--u) * 25);
  font-weight: 600;
}
.bc-count {
  color: #aaa5b5;
  font-size: calc(var(--u) * 20);
}
.bc-location,
.bc-hours {
  display: block;
  overflow: hidden;
  margin-top: calc(var(--u) * 9);
  color: #8e899d;
  font-size: calc(var(--u) * 22);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bc-hours {
  color: #a8a3b2;
  font-size: calc(var(--u) * 21);
}

/* .list-bottom */
.bc-bottom {
  padding: calc(var(--u) * 24) calc(var(--u) * 26) calc(var(--u) * 40);
  color: #aaa5b5;
  font-size: calc(var(--u) * 22);
  line-height: 1.6;
  text-align: center;
}
</style>
