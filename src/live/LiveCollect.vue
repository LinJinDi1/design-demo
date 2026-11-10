<script>
export const meta = { id: 'collectstore', label: '我的收藏', note: '收藏的店铺', group: '个人', tab: '', order: 2 };
</script>

<!--
  现版 · 我的收藏（对应 quick-pick-main/pagesLog/collectstore/collectstore.vue + styles/favorites.scss）
  结构：原生导航栏（44px 返回 + 我的收藏）→ 吸顶头部（喜欢的都在这里 + 地图入口 + 店铺/图书馆/小摊三个 tab）
        → 数量行（共 N 个收藏 + 管理）→ 收藏卡片列表 → 底部一句话。
  collectstore 是从「我的」navigateTo 进来的二级页：没有 tabBar，只有原生导航栏
  （pages.json: navigationBarTitleText = 我的收藏、navigationBarBackgroundColor = #ffffff），自己画一条。
  原生栏 44px + 源码吸顶的 .saved-top，所以后者吸在 top: 90px（46px 状态栏 + 44px 导航栏）下面。
  所有尺寸照抄源码的 rpx 数字（favorites.scss 里的变量直接抄进 scoped 样式），用 calc(var(--u) * N) 换算。
  卡片直接用小程序源码里的 components/FavoriteCard/FavoriteCard.vue（它自己是 scoped、不发请求），
  图片传 liveAsset 出来的路径。静态稿只画「店铺」这一屏的浏览态：搜索/骨架屏/空态/管理模式/删除都没做。
-->
<script setup>
import FavoriteCard from '@app/components/FavoriteCard/FavoriteCard.vue';
import { liveAsset } from './asset.js';

/* 源码 categories：店铺 / 图书馆 / 小摊，默认 active='store' */
const categories = [
  { key: 'store', label: '店铺' },
  { key: 'library', label: '图书馆' },
  { key: 'stall', label: '小摊' },
];

/* tab 上的数字来自 states[key].items.length（三个分类各自加载完才显示） */
const counts = { store: 4, library: 2, stall: 3 };

/* 卡片数据对齐 utils/favorites.js 的 collectionCard(item, 'store')：
   name / image / label / meta（摊位分类 · 位置）/ hours / score / reviewCount */
const items = [
  {
    id: 'fav-01',
    name: '潮汕牛肉饭',
    image: liveAsset('/assets/original-pages/favorites/01.png'),
    label: '店铺',
    meta: '商业中心 · 二楼 12 号',
    hours: '10:30 – 22:00',
    score: '4.6',
    reviewCount: 128,
  },
  {
    id: 'fav-02',
    name: '禾香园',
    image: liveAsset('/assets/original-pages/favorites/02.png'),
    label: '店铺',
    meta: '商业中心 · 一楼档口',
    hours: '07:00 – 21:30',
    score: '4.3',
    reviewCount: 64,
  },
  {
    id: 'fav-03',
    name: '猪大哈干蒸排骨饭',
    image: liveAsset('/assets/original-pages/favorites/03.png'),
    label: '店铺',
    meta: '桥苑小摊 · 学 4 门',
    hours: '11:00 – 22:30',
    score: '4.8',
    reviewCount: 37,
  },
  {
    id: 'fav-04',
    name: '鲍汁黄焖鸡',
    image: liveAsset('/assets/original-pages/favorites/04.png'),
    label: '店铺',
    meta: '商业中心 · 三楼 8 号',
    hours: '10:00 – 21:00',
    score: '4.1',
    reviewCount: 92,
  },
];
</script>

<template>
  <div class="live-page live-collect">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 我的收藏） -->
    <header class="cl-nav live-sticky-head">
      <button class="cl-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="cl-nav-title">我的收藏</h1>
    </header>

    <!-- .saved-top：源码是 sticky 吸顶、白底、左右 -24rpx 出血 -->
    <div class="cl-top">
      <div class="cl-intro">
        <span class="cl-subtitle">喜欢的，都在这里</span>
        <div class="cl-action">
          <!-- uni-icons type="map" size="16" color="#6a5acd"，图标库里没有 map，按同形状画内联 SVG -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M9.4 3.8 3.6 6.2v14l5.8-2.4 5.2 2.4 5.8-2.4v-14L14.6 6.2 9.4 3.8Z"
              stroke="#6a5acd"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path d="M9.4 3.8v14M14.6 6.2v14" stroke="#6a5acd" stroke-width="1.7" />
          </svg>
          <span>地图</span>
        </div>
      </div>

      <div class="cl-tabs">
        <div
          v-for="tab in categories"
          :key="tab.key"
          class="cl-tab"
          :class="{ 'cl-tab--active': tab.key === 'store' }"
        >
          <span>{{ tab.label }}</span>
          <span class="cl-tab-count">{{ counts[tab.key] }}</span>
        </div>
      </div>
    </div>

    <div class="cl-summary">
      <span>共 {{ items.length }} 个收藏</span>
      <div class="cl-summary-action">管理</div>
    </div>

    <div class="cl-results">
      <FavoriteCard v-for="item in items" :key="item.id" :item="item" />
      <div class="cl-footer">把喜欢留住，下次再来</div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .saved-page：横向 24rpx 内边距，头部再负回去出血；二级页没有底栏，底部留 40rpx ---------- */
.live-collect {
  min-height: 888px;
  padding: 46px calc(var(--u) * 24) calc(var(--u) * 40);
  background: #f7f7fb;
  color: #34313f;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.cl-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  /* 根节点有 24rpx 横向内边距，导航栏要铺满整屏，所以负回去 */
  margin: 0 calc(var(--u) * -24);
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.cl-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.cl-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .saved-top：吸在导航栏（46px + 44px）下面 ---------- */
.cl-top {
  position: sticky;
  top: 90px;
  z-index: 3;
  margin: 0 calc(var(--u) * -24);
  padding: calc(var(--u) * 22) calc(var(--u) * 28) calc(var(--u) * 20);
  border-bottom: 1px solid #efedf5;
  background: #fff;
}
.cl-intro {
  display: flex;
  min-height: calc(var(--u) * 42);
  align-items: center;
  justify-content: space-between;
  margin-bottom: calc(var(--u) * 22);
}
.cl-subtitle {
  color: #9892a6;
  font-size: calc(var(--u) * 23);
}
.cl-action {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  padding: calc(var(--u) * 8) 0 calc(var(--u) * 8) calc(var(--u) * 18);
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
}
.cl-tabs {
  display: flex;
  padding: calc(var(--u) * 7);
  border-radius: calc(var(--u) * 20);
  background: #f5f3fa;
}
.cl-tab {
  display: flex;
  min-height: calc(var(--u) * 64);
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 7);
  border-radius: calc(var(--u) * 16);
  color: #9992a9;
  font-size: calc(var(--u) * 26);
}
.cl-tab--active {
  background: #fff;
  box-shadow: 0 calc(var(--u) * 3) calc(var(--u) * 9) rgba(55, 39, 98, 0.05);
  color: #6a5acd;
  font-weight: 600;
}
.cl-tab-count {
  font-size: calc(var(--u) * 20);
  font-weight: 400;
  opacity: 0.7;
}

/* ---------- .saved-summary ---------- */
.cl-summary {
  display: flex;
  min-height: calc(var(--u) * 84);
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--u) * 4);
  color: #9690a3;
  font-size: calc(var(--u) * 23);
}
.cl-summary-action {
  padding: calc(var(--u) * 18) 0 calc(var(--u) * 18) calc(var(--u) * 24);
  color: #6a5acd;
}

/* ---------- .saved-footer ---------- */
.cl-footer {
  padding: calc(var(--u) * 26) calc(var(--u) * 10);
  color: #b1abba;
  font-size: calc(var(--u) * 22);
  text-align: center;
}
</style>
