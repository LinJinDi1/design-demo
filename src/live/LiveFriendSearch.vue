<script>
export const meta = { id: 'friend-search', label: '寻找认识的人', note: '搜索并加好友', group: '社交', tab: '', order: 6 };
</script>

<!--
  现版 · 寻找认识的人（对应 quick-pick-main/pagesLog/friendsearch/friendsearch.vue，293 行）
  入口：好友页的搜索条「寻找认识的人」→ navigateTo('/pagesLog/friendsearch/friendsearch')。
  结果行点进去是 pagesLog/friendDetail/friendDetail（另一个「好友动态页」），本页只画搜索态 + 结果列表。

  结构：44px 返回栏（pages.json navigationBarTitleText「寻找认识的人」）
        → 白色搜索头：uni-search-bar 胶囊（radius 5 / 高 36px / 占 85% 宽）+「搜索」
        → 结果列表：头像 + 昵称 + 「收藏数 / 评分数」两个灰 chip，每行 100rpx、底边 1rpx #efefef。

  单位：rpx 走 calc(var(--u) * N)（1rpx = 0.52px）；这一屏源码用 vh（.header 9vh / .body 91vh）和 rem
  （0.6rem / 0.7rem），按 webview 默认 16px 基准写成 9.6px / 11.2px；1vh 取「888 - 46 状态栏 - 44 返回栏」的 7.98px。
  静态稿简化：源码 search_dis 为 true 时的「可能想认识的人」分支（含关注按钮）、空态空页（empty-vue）、
  搜索/关注请求都没做 —— 只做「已输入关键词并出结果」这一屏。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 输入框里的关键词（源码 searchtxt，点「搜索」后 search_dis = false） */
const keyword = 'bluefox';

/* 结果字段对齐 search_1({ searchKeyword, pageNumber, pageSize }) 返回的 users：
   userId / name / avatar / collectNumber / markNumber */
const results = [
  {
    userId: 'QUICK36328162',
    name: 'メbluefox',
    avatar: '/assets/panda.svg',
    collectNumber: 13,
    markNumber: 14,
  },
  {
    userId: 'QUICK62765708',
    name: '乄bluefox',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    collectNumber: 7,
    markNumber: 3,
  },
  {
    userId: 'QUICK51024466',
    name: 'bluefox523',
    avatar: '/assets/panda.svg',
    collectNumber: 21,
    markNumber: 9,
  },
  {
    userId: 'QUICK90076112',
    name: 'BlueFox_99',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    collectNumber: 2,
    markNumber: 0,
  },
  {
    userId: 'QUICK07260312',
    name: '蓝小狐',
    avatar: '/assets/panda.svg',
    collectNumber: 5,
    markNumber: 4,
  },
];
</script>

<template>
  <div class="live-page live-fs">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 寻找认识的人） -->
    <header class="fs-nav live-sticky-head">
      <button class="fs-nav-back" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="fs-nav-title">寻找认识的人</h1>
    </header>

    <!-- 源码 .header / .headersearch：9vh 白底，搜索栏 85% 宽 + 右侧「搜索」 -->
    <div class="fs-header">
      <div class="fs-bar-wrap">
        <!-- uni-search-bar：外层 padding 10px，胶囊本体 36px、radius=5、#F8F8F8 -->
        <div class="fs-bar">
          <span class="fs-bar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.4" stroke="#c0c4cc" stroke-width="1.9" />
              <path d="m15.7 15.7 4.3 4.3" stroke="#c0c4cc" stroke-width="1.9" stroke-linecap="round" />
            </svg>
          </span>
          <span class="fs-bar-text">{{ keyword }}</span>
          <span class="fs-bar-clear" role="button" aria-label="清空">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.6" fill="#c0c4cc" />
              <path d="m9.4 9.4 5.2 5.2M14.6 9.4l-5.2 5.2" stroke="#fff" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </span>
        </div>
      </div>
      <span class="fs-submit">搜索</span>
    </div>

    <!-- 源码 .body：白底、91vh、可滚动，padding-bottom 100rpx -->
    <div class="fs-body">
      <div v-for="item in results" :key="item.userId" class="fs-row">
        <div class="fs-avatar-cell">
          <img class="fs-avatar" :src="liveAsset(item.avatar)" alt="" />
        </div>
        <div class="fs-name-cell">
          <div class="fs-name">{{ item.name }}</div>
          <div class="fs-meta">
            <span class="fs-chip">收藏数：{{ item.collectNumber }}</span>
            <span class="fs-chip">评分数：{{ item.markNumber }}</span>
          </div>
        </div>
        <div class="fs-spacer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码是白底整页（.header + .body 都是 #fff），没有底栏留白 */
.live-fs {
  /* (888 - 46 状态栏 - 44 返回栏) / 100 */
  --fs-vh: 7.98px;
  padding-bottom: 0;
  background: #fff;
  color: #333;
}

/* ---------- 返回栏（替代原生导航栏，和 LiveNotice / LiveSearchStore 同一套尺寸） ---------- */
.live-fs .fs-nav {
  display: flex;
  box-sizing: border-box;
  height: 44px;
  align-items: center;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.live-fs .fs-nav-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.live-fs .fs-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- 搜索头：源码 .header（9vh）/.headersearch / .search1 ---------- */
.live-fs .fs-header {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--fs-vh) * 9);
  align-items: center;
  background-color: #fff;
}
.live-fs .fs-bar-wrap {
  width: 85%;
  flex-shrink: 0;
}
/* .uni-searchbar 的 10px 内边距 */
.live-fs .fs-bar {
  display: flex;
  box-sizing: border-box;
  height: 36px;
  align-items: center;
  margin: 10px;
  overflow: hidden;
  border-radius: 5px;
  background: #f8f8f8;
}
.live-fs .fs-bar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}
.live-fs .fs-bar-text {
  flex: 1;
  margin-top: 1px;
  margin-left: 5px;
  overflow: hidden;
  color: #333;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.live-fs .fs-bar-clear {
  display: flex;
  align-items: center;
  padding-left: 8px;
  line-height: 24px;
  cursor: pointer;
}
/* 源码 .search1：高度 / 行高都是 9vh，字号跟着页面默认 16px */
.live-fs .fs-submit {
  height: calc(var(--fs-vh) * 9);
  flex-shrink: 0;
  color: #000;
  font-size: 16px;
  line-height: calc(var(--fs-vh) * 9);
  white-space: nowrap;
}

/* ---------- 结果区：源码 .body ---------- */
.live-fs .fs-body {
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--fs-vh) * 91);
  padding-bottom: calc(var(--u) * 100);
  overflow-y: auto;
  background-color: #fff;
  scrollbar-width: none;
}
.live-fs .fs-body::-webkit-scrollbar {
  display: none;
}

/* ---------- 结果行：源码 .evepossiblefriend（100rpx 高 + 1rpx 底边） ---------- */
.live-fs .fs-row {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--u) * 100);
  background-color: #fff;
  border-bottom: 1px solid #efefef;
}
/* .evepossiblefriendimage：15% 宽 + 40rpx 左内边距，图 80rpx 圆头像、1rpx 描边 */
.live-fs .fs-avatar-cell {
  display: flex;
  box-sizing: border-box;
  width: 15%;
  flex-shrink: 0;
  align-items: center;
  padding-left: calc(var(--u) * 40);
}
.live-fs .fs-avatar {
  width: calc(var(--u) * 80);
  height: calc(var(--u) * 80);
  flex-shrink: 0;
  border: 1px solid #e7e7e7;
  border-radius: calc(var(--u) * 50);
  background: #f3f1f8;
  object-fit: cover;
}
/* .evepossiblefriendname：40% 宽 + 20rpx 左内边距，字号 0.7rem */
.live-fs .fs-name-cell {
  box-sizing: border-box;
  width: 40%;
  height: 100%;
  padding-left: calc(var(--u) * 20);
  font-size: 11.2px;
}
.live-fs .fs-name {
  display: flex;
  width: 100%;
  height: calc(var(--u) * 50);
  align-items: center;
  overflow: hidden;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 第二行 36rpx 高、0.6rem，两个灰 chip（margin-left 10rpx、padding 1rpx 10rpx） */
.live-fs .fs-meta {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(var(--u) * 36);
  font-size: 9.6px;
}
.live-fs .fs-chip {
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: calc(var(--u) * 10);
  padding: 1px calc(var(--u) * 10);
  background-color: #f1f1f1;
  color: #868686;
  white-space: nowrap;
}
/* 源码里结果行右侧留了 15% 的空白占位 */
.live-fs .fs-spacer {
  width: 15%;
  height: 100%;
}
</style>
