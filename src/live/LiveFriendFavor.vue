<script>
export const meta = { id: 'friend-favor', label: '好友发现', note: '首页「好友发现」入口', group: '社交', tab: '', order: 4 };
</script>

<!--
  现版 · 好友发现（对应 quick-pick-main/pageuser/FriendFavor/FriendFavor.vue + styles/favorites.scss）
  入口：首页快捷入口 HOME_ENTRIES 里的 friends → /pageuser/FriendFavor/FriendFavor。
  结构：原生导航栏（44px 返回 + 好友发现）→ 吸顶头部（跟着认识的人，发现好味道 + 消息设置 + 三个分类 tab）
        → 说明行（关注的人收藏的店铺 + 刷新）→ 收藏卡片列表 → 底部一句话。
  pages.json: navigationBarTitleText = 好友发现、navigationBarBackgroundColor = #ffffff，
  设计台上没有原生栏，自己画一条；源码 .saved-top 是 sticky top:0，这里吸在 46px 状态栏 + 44px 导航栏下面（top: 90px）。
  所有尺寸照抄源码 rpx 数字（favorites.scss 的变量值直接抄进 scoped 样式），用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  卡片直接用小程序源码里的 components/FavoriteCard/FavoriteCard.vue（scoped、不发请求），图片传 liveAsset 出来的路径。
  静态稿只画默认的「关注收藏」这一屏：好友收藏 / 好友推荐 两个分类、消息设置入口和骨架屏 / 空态 / 错误态没做。
-->
<script setup>
import FavoriteCard from '@app/components/FavoriteCard/FavoriteCard.vue';
import { liveAsset } from './asset.js';

/* 源码 categories，active 默认落在 following（关注收藏） */
const categories = [
  { key: 'following', label: '关注收藏' },
  { key: 'friends', label: '好友收藏' },
  { key: 'recommendations', label: '好友推荐' },
];
const active = 'following';

/* 源码 categoryDescription[active] */
const categoryDescription = '关注的人收藏的店铺';

/* 卡片数据对齐 utils/favorites.js 的 friendFavoriteCard(item)：
   name / image / score / note（note = 「某某、某某收藏了这里」） */
const items = [
  {
    id: 'ff-01',
    name: '老潼关肉夹馍',
    image: liveAsset('/assets/source-fidelity/commercial/01-laotongguan.jpg'),
    score: '4.7',
    note: 'Yilena、メbluefox、微信用户等收藏了这里',
  },
  {
    id: 'ff-02',
    name: '老上海馄饨铺',
    image: liveAsset('/assets/source-fidelity/commercial/02-laoshanghai.jpg'),
    score: '4.5',
    note: 'Yilena、メbluefox收藏了这里',
  },
  {
    id: 'ff-03',
    name: '功夫小茗',
    image: liveAsset('/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg'),
    score: '4.6',
    note: 'メbluefox收藏了这里',
  },
  {
    id: 'ff-04',
    name: 'Come On潮味',
    image: liveAsset('/assets/source-fidelity/commercial/05-come-on.jpg'),
    score: '4.4',
    note: '微信用户111111111111111、Yilena等收藏了这里',
  },
  {
    id: 'ff-05',
    name: '韩国风味',
    image: liveAsset('/assets/source-fidelity/commercial/04-korean-flavor.jpg'),
    score: '4.3',
    note: 'Yilena、小胖橘等收藏了这里',
  },
  {
    id: 'ff-06',
    name: '黄师傅',
    image: liveAsset('/assets/source-fidelity/featured/huang-shifu.jpg'),
    score: '4.8',
    note: 'メbluefox、拾光收藏了这里',
  },
];
</script>

<template>
  <div class="live-page live-friend-favor">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 好友发现） -->
    <header class="ff-nav live-sticky-head">
      <button class="ff-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="ff-nav-title">好友发现</h1>
    </header>

    <!-- .saved-top：白底、左右 -24rpx 出血、底部 1rpx 分隔线，吸在导航栏下面 -->
    <div class="ff-top">
      <div class="ff-intro">
        <span class="ff-subtitle">跟着认识的人，发现好味道</span>
        <!-- 源码 v-if="active === 'recommendations'"：只有好友推荐分类才有这个消息设置入口 -->
        <div v-if="active === 'recommendations'" class="ff-action">
          <uni-icons type="gear" size="16" color="#6a5acd" />
          <span>消息设置</span>
        </div>
      </div>

      <div class="ff-tabs">
        <div
          v-for="tab in categories"
          :key="tab.key"
          class="ff-tab"
          :class="{ 'ff-tab--active': tab.key === active }"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- .saved-summary：分类说明 + 刷新（源码 v-if="current.items.length"） -->
    <div class="ff-summary">
      <span>{{ categoryDescription }}</span>
      <div class="ff-summary-action">刷新</div>
    </div>

    <!-- .saved-results：friendFavoriteCard 卡片 + .saved-footer 一句话 -->
    <div class="ff-results">
      <FavoriteCard v-for="item in items" :key="item.id" :item="item" />
      <div class="ff-footer">下一顿，可以从这里开始</div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .saved-page：min-height 100vh、横向 24rpx、白底吸顶头部再负回去出血；二级页底部留 40rpx ---------- */
.live-friend-favor {
  box-sizing: border-box;
  min-height: 888px;
  padding: 46px calc(var(--u) * 24) calc(var(--u) * 40);
  background: #f7f7fb;
  color: #34313f;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.ff-nav {
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
.ff-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ff-nav-title {
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
.ff-top {
  position: sticky;
  top: 90px;
  z-index: 3;
  margin: 0 calc(var(--u) * -24);
  padding: calc(var(--u) * 22) calc(var(--u) * 28) calc(var(--u) * 20);
  border-bottom: 1px solid #efedf5;
  background: #fff;
}
.ff-intro {
  display: flex;
  min-height: calc(var(--u) * 42);
  align-items: center;
  justify-content: space-between;
  margin-bottom: calc(var(--u) * 22);
}
.ff-subtitle {
  color: #9892a6;
  font-size: calc(var(--u) * 23);
}
.ff-action {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  padding: calc(var(--u) * 8) 0 calc(var(--u) * 8) calc(var(--u) * 18);
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
}
.ff-tabs {
  display: flex;
  padding: calc(var(--u) * 7);
  border-radius: calc(var(--u) * 20);
  background: #f5f3fa;
}
.ff-tab {
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
.ff-tab--active {
  background: #fff;
  box-shadow: 0 calc(var(--u) * 3) calc(var(--u) * 9) rgba(55, 39, 98, 0.05);
  color: #6a5acd;
  font-weight: 600;
}

/* ---------- .saved-summary ---------- */
.ff-summary {
  display: flex;
  min-height: calc(var(--u) * 84);
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--u) * 4);
  color: #9690a3;
  font-size: calc(var(--u) * 23);
}
.ff-summary-action {
  padding: calc(var(--u) * 18) 0 calc(var(--u) * 18) calc(var(--u) * 24);
  color: #6a5acd;
}

/* ---------- .saved-footer ---------- */
.ff-footer {
  padding: calc(var(--u) * 26) calc(var(--u) * 10);
  color: #b1abba;
  font-size: calc(var(--u) * 22);
  text-align: center;
}
</style>
