<script>
export const meta = { id: 'searchstore', label: '搜索', note: '搜店铺 / 小摊 / 饭堂', group: '首页', tab: '', order: 5 };
</script>

<!--
  现版 · 搜索（对应 quick-pick-main/pagesLog/searchstore/searchstore.vue）
  结构：顶部返回栏「搜索」（源码是原生导航栏，pages.json 里 navigationBarTitleText「搜索」）
        → 白色搜索头：uni-search-bar 胶囊输入框 + 「搜索」→ 校区 / 搜索范围说明
        → 类型 tab（全部 / 商业中心 / 小摊 / 饭堂 / 图书馆，选中紫色下划线）
        → 结果列表：封面 + 名称 + 类型角标 + 位置 + 摘要 + 评分 / 「周X菜谱 ›」/「查看空间与设施 ›」
        → 列表尾部「已展示 N 条匹配」。
  尺寸照抄源码 rpx，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；
  uni-search-bar 内部量的是 px（box 高 36px、圆角 radius=100、图标 18px、文字 14px），照抄 uni-search-bar.vue。
  静态稿只做「输入「猪脚饭」后已出结果」的终态：源码空查询时是 history / suggestions 那块 .idle，
  这一屏没铺（图书馆类型的卡也一样，搜「白板」才会出现）；loading / error / 空结果 / 查看更多都没做。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 校区取自 getCampusListAll()，这里用入口默认校区 */
const campusName = '大学城校区';

/* 类型 tab = utils/campus-search.js 的 SEARCH_TYPES */
const types = [
  { id: 'all', label: '全部' },
  { id: 'store', label: '商业中心' },
  { id: 'stall', label: '小摊' },
  { id: 'canteen', label: '饭堂' },
  { id: 'library', label: '图书馆' },
];
const activeType = 'all';

/* 输入框里的关键词（源码 input / query，normalizeQuery 后就是「猪脚饭」） */
const keyword = '猪脚饭';

/* 结果卡片：字段对齐 searchCampus() 返回的 items
   （id / name / type / locationName / summary / image / rating / ratingCount / targetType / weekday） */
const results = [
  {
    id: 'stall-1',
    type: 'stall',
    targetType: 'stall',
    name: '林胡子猪脚饭',
    image: '/assets/source-fidelity/stalls/linhuzi.jpeg',
    locationName: '学4门 · 小摊集中区',
    summary: '猪脚饭 · 牛腩饭 · 卤味，饭点要排队',
    rating: 4.6,
    ratingCount: 12,
  },
  {
    id: 'store-1',
    type: 'store',
    targetType: 'store',
    name: '隆江猪脚饭',
    image: '/assets/source-fidelity/commercial/04-korean-flavor.jpg',
    locationName: '商业中心 · 天桥附近二楼',
    summary: '招牌猪脚饭 · 例汤 · 青菜',
    rating: 4.9,
    ratingCount: 50,
  },
  {
    id: 'store-2',
    type: 'store',
    targetType: 'store',
    name: '猪大哈猪脚饭',
    image: '/assets/source-fidelity/commercial/01-laotongguan.jpg',
    locationName: '商业中心 · 猪大哈区',
    summary: '猪脚饭 · 卤蛋 · 例汤，份量足',
    rating: 4.7,
    ratingCount: 63,
  },
  {
    id: 'canteen-1',
    type: 'canteen',
    targetType: 'canteen',
    name: '猪脚饭',
    image: '',
    locationName: '菊苑二楼 · 3 号档',
    summary: '今日供应，12 元一份，配例汤',
    rating: 0,
    weekday: 3,
  },
  {
    id: 'canteen-2',
    type: 'canteen',
    targetType: 'canteen',
    name: '猪脚饭',
    image: '/assets/source-fidelity/commercial/02-laoshanghai.jpg',
    locationName: '兰苑二楼 · 7 号档',
    summary: '今日供应，13 元一份',
    rating: 0,
    weekday: 1,
  },
];

/* 源码 typeLabel()：类型 id → 中文，兜底「校园地点」 */
const typeLabel = (type) => types.find((item) => item.id === type)?.label || '校园地点';
const weekdayLabel = (weekday) => `周${'一二三四五'[weekday - 1] || ''}菜谱`;
</script>

<template>
  <div class="live-page live-search">
    <!-- 源码是原生导航栏（白底 + 标题「搜索」），这里补一条 44px 的白底返回栏 -->
    <header class="ss-nav live-sticky-head">
      <button class="ss-nav-back" aria-label="返回">
        <uni-icons type="left" :size="22" color="#34313f" />
      </button>
      <h1 class="ss-nav-title">搜索</h1>
    </header>

    <!-- 源码 .search-header：输入行 + 校区/范围行 + 类型 tab -->
    <div class="ss-header">
      <div class="ss-input-row">
        <div class="ss-bar">
          <span class="ss-bar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.4" stroke="#c0c4cc" stroke-width="1.9" />
              <path d="m15.7 15.7 4.3 4.3" stroke="#c0c4cc" stroke-width="1.9" stroke-linecap="round" />
            </svg>
          </span>
          <span class="ss-bar-text">{{ keyword }}</span>
        </div>
        <span class="ss-submit">搜索</span>
      </div>

      <div class="ss-scope-row">
        <span class="ss-campus">{{ campusName }} ▾</span>
        <span>名称 · 菜品 · 位置 · 设施</span>
      </div>

      <div class="ss-type-scroll">
        <div class="ss-types">
          <div
            v-for="tab in types"
            :key="tab.id"
            class="ss-type"
            :class="{ active: tab.id === activeType }"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 源码 .results：结果卡片 + 尾部计数 -->
    <div class="ss-results">
      <div v-for="item in results" :key="item.id" class="ss-card">
        <img
          v-if="item.image && item.image !== 'noimage'"
          class="ss-cover"
          :src="liveAsset(item.image)"
          alt=""
        />
        <div v-else class="ss-cover ss-cover-empty" :class="item.type">{{ typeLabel(item.type) }}</div>
        <div class="ss-card-body">
          <div class="ss-name-row">
            <span class="ss-name">{{ item.name }}</span>
            <span class="ss-badge" :class="item.type">{{ typeLabel(item.type) }}</span>
          </div>
          <div v-if="item.locationName" class="ss-location">{{ item.locationName }}</div>
          <div v-if="item.summary" class="ss-summary">{{ item.summary }}</div>
          <div v-if="Number(item.rating) > 0" class="ss-rating">
            ★ {{ Number(item.rating).toFixed(1)
            }}<span v-if="item.ratingCount"> · {{ item.ratingCount }}人评分</span>
          </div>
          <div v-else-if="item.type === 'library'" class="ss-detail-link">查看空间与设施 ›</div>
          <div v-else-if="item.targetType === 'canteen'" class="ss-detail-link">
            {{ item.weekday ? weekdayLabel(item.weekday) : '查看饭堂' }} ›
          </div>
        </div>
      </div>
      <div class="ss-end">已展示 {{ results.length }} 条匹配</div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .search-page：min-height 100vh、#f7f7fa 底、padding-bottom 40rpx。
   tab 为空的二级页外壳是 .phone-content--plain（不给底栏留 78px），所以 100% 就是整屏 */
.live-search {
  box-sizing: border-box;
  min-height: 100%;
  padding-bottom: calc(var(--u) * 40);
  background: #f7f7fa;
  color: #363342;
}

/* ---------- 返回栏（替代原生导航栏，和 LiveNotice 的 .nt-nav 同一套尺寸） ---------- */
.live-search .ss-nav {
  display: flex;
  box-sizing: border-box;
  height: 44px;
  align-items: center;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.live-search .ss-nav-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.live-search .ss-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- 搜索头：源码 .search-header padding: 4rpx 24rpx 0 ---------- */
.live-search .ss-header {
  padding: calc(var(--u) * 4) calc(var(--u) * 24) 0;
  background: #fff;
}
.live-search .ss-input-row {
  display: flex;
  align-items: center;
}
/* uni-search-bar 的 .uni-searchbar 自带 10px 内边距，胶囊本体高 36px、radius=100 */
.live-search .ss-bar {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  height: 36px;
  flex: 1;
  align-items: center;
  margin: 10px;
  overflow: hidden;
  border-radius: 100px;
  background: #f8f8f8;
}
.live-search .ss-bar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}
.live-search .ss-bar-text {
  flex: 1;
  margin-top: 1px;
  margin-left: 5px;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 源码 .submit：padding 20rpx 12rpx、28rpx、600、#7358ce */
.live-search .ss-submit {
  padding: calc(var(--u) * 20) calc(var(--u) * 12);
  color: #7358ce;
  font-size: calc(var(--u) * 28);
  font-weight: 600;
}

/* ---------- 校区 / 范围：源码 .scope-row ---------- */
.live-search .ss-scope-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--u) * 8) calc(var(--u) * 12) calc(var(--u) * 20);
  color: #9993a5;
  font-size: calc(var(--u) * 23);
}
.live-search .ss-campus {
  color: #7358ce;
  font-weight: 600;
}

/* ---------- 类型 tab：源码 .type-scroll / .types / .type ---------- */
.live-search .ss-type-scroll {
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.live-search .ss-type-scroll::-webkit-scrollbar {
  display: none;
}
.live-search .ss-types {
  display: flex;
  justify-content: space-between;
}
.live-search .ss-type {
  padding: calc(var(--u) * 20) calc(var(--u) * 14);
  border-bottom: calc(var(--u) * 5) solid transparent;
  color: #9993a5;
  font-size: calc(var(--u) * 27);
}
.live-search .ss-type.active {
  border-bottom-color: #8c70df;
  color: #7055c8;
  font-weight: 600;
}

/* ---------- 结果列表：源码 .results / .result-card ---------- */
.live-search .ss-results {
  padding: calc(var(--u) * 24);
}
.live-search .ss-card {
  display: flex;
  margin-bottom: calc(var(--u) * 18);
  padding: calc(var(--u) * 20);
  border-radius: calc(var(--u) * 20);
  background: #fff;
}
.live-search .ss-cover {
  width: calc(var(--u) * 136);
  height: calc(var(--u) * 146);
  flex-shrink: 0;
  margin-right: calc(var(--u) * 22);
  border-radius: calc(var(--u) * 12);
  object-fit: cover;
}
.live-search .ss-cover-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0ecfa;
  color: #8b77be;
  font-size: calc(var(--u) * 25);
}
.live-search .ss-card-body {
  flex: 1;
  min-width: 0;
}
.live-search .ss-name-row {
  display: flex;
  align-items: flex-start;
  gap: calc(var(--u) * 12);
}
.live-search .ss-name {
  flex: 1;
  font-size: calc(var(--u) * 30);
  font-weight: 600;
  line-height: 1.4;
}
.live-search .ss-badge {
  flex-shrink: 0;
  padding: calc(var(--u) * 4) calc(var(--u) * 10);
  border-radius: calc(var(--u) * 8);
  background: #f0ecfa;
  color: #8065c4;
  font-size: calc(var(--u) * 20);
}
.live-search .ss-badge.stall {
  background: #fff0e6;
  color: #c98654;
}
.live-search .ss-badge.canteen {
  background: #eaf4ee;
  color: #629b79;
}
.live-search .ss-location {
  margin-top: calc(var(--u) * 10);
  color: #918798;
  font-size: calc(var(--u) * 23);
}
.live-search .ss-summary {
  display: -webkit-box;
  margin-top: calc(var(--u) * 9);
  overflow: hidden;
  color: #9c96a4;
  font-size: calc(var(--u) * 24);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.live-search .ss-rating {
  margin-top: calc(var(--u) * 12);
  color: #f28c55;
  font-size: calc(var(--u) * 24);
}
.live-search .ss-rating span {
  color: #aaa4af;
  font-size: calc(var(--u) * 22);
}
.live-search .ss-detail-link {
  margin-top: calc(var(--u) * 12);
  color: #9888b5;
  font-size: calc(var(--u) * 22);
}
/* 源码 .state.end */
.live-search .ss-end {
  padding: calc(var(--u) * 25);
  color: #aaa3b1;
  font-size: calc(var(--u) * 23);
  text-align: center;
}
</style>
