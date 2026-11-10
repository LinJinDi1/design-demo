<script>
export const meta = { id: 'friend-detail', label: '好友详情', note: '好友列表点进来', group: '社交', tab: '', order: 5 };
</script>

<!--
  现版 · 好友详情（对应 quick-pick-main/pageuser/FriendDetail/FriendDetail.vue，439 行）
  入口：pagesFriend/index/index.vue 好友行 → navigateTo('/pageuser/FriendDetail/FriendDetail')，
        数据是列表行的 item 塞进 getApp().globalData.MateDetail。
  注意：pagesLog/friendDetail/friendDetail.vue 是另一个「好友动态页」（friendsearch 结果跳那里），不是这一页。

  结构：44px 返回栏 → 35vh 顶部大图 → 白色圆角资料板（相对上移 8vh，min-height 70vh）
        → 右上磨砂「设置」钮 → 头像（上浮出板子）+ 昵称 + 性别符号
        → 关注/粉丝 → 个性签名 → 用龄 / 收藏数（带箭头）/ 评分数 → 板底「未关注」渐变按钮。

  单位：这一屏用 vh / rpx 混排（不是纯 rpx）。源码 .page 是 100vh、navigationStyle 是 custom（没有原生栏），
  本页自己画了 44px 返回栏，所以 1vh 取「888 - 46 状态栏 - 44 返回栏」的 7.98px，rpx 仍走 calc(var(--u) * N)。
  静态稿简化：popup 背景选择、uni.$showModal 关注弹窗 / toast 都没做（isfollow 固定 0 → 按钮「未关注」）；
  body 的远端背景图（源码 inline background-image）没复刻，只留源码的 background-color:#fff；
  顶部大图源码是 COS 上的「绿野」实拍，这里用同色调的内联 SVG 风景代替。
  刻意偏差：源码此页原生栏是空的、靠 .back 悬浮圆钮返回；按二级页约定统一改成 44px 吸顶返回栏，那个圆钮没画。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 资料字段对齐 getApp().globalData.MateDetail（好友列表行的 friendUserList 项）：
   avatar / name / sex / follow / fan / briefIntroduction / useTime / collectNumber / markNumber。
   用与「好友」「用户主页」两页同一个 Yilena，跨页数据保持一致 */
const mate = {
  name: 'Yilena',
  sex: '女',
  avatar: '/assets/panda.svg',
  follow: 23,
  fan: 5,
  briefIntroduction: '保持热爱',
  useTime: 2,
  collectNumber: 13,
  markNumber: 14,
};

/* 源码 getISfollow()：0 = 未关注，1 = 已关注（按钮文案跟着变） */
const isfollow = 0;
</script>

<template>
  <div class="live-page live-fd">
    <!-- 原生导航栏（pages.json 这一条标题是空的；按二级页约定给一条 44px 返回栏） -->
    <header class="fd-nav live-sticky-head">
      <button class="fd-nav-back" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="fd-nav-title">好友详情</h1>
    </header>

    <!-- 源码 .bg：100vw × 35vh，图片 object-fit: cover -->
    <div class="fd-bg">
      <svg class="fd-scene" viewBox="0 0 390 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="fd-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#cde8f5" />
            <stop offset="1" stop-color="#f0f7e8" />
          </linearGradient>
          <radialGradient id="fd-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#fff6cf" stop-opacity="0.9" />
            <stop offset="0.55" stop-color="#fff6cf" stop-opacity="0.4" />
            <stop offset="1" stop-color="#fff6cf" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="fd-field" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#a5cc93" />
            <stop offset="1" stop-color="#74ab6b" />
          </linearGradient>
        </defs>
        <rect width="390" height="280" fill="url(#fd-sky)" />
        <circle cx="300" cy="72" r="78" fill="url(#fd-sun)" />
        <circle cx="300" cy="72" r="26" fill="#fdf3c4" />
        <path d="M-10 156c56-30 104-6 148-24 44-18 82-30 128-12 38 15 74 26 134 18v150H-10Z" fill="#c6ddb6" />
        <path d="M-10 182c62-22 104 6 152-8 48-14 96-22 150-4 32 10 64 12 108 6v112H-10Z" fill="#aace9a" />
        <rect y="196" width="390" height="84" fill="url(#fd-field)" />
        <path d="M50 211v-26M338 212v-24" stroke="#7d8f66" stroke-width="7" stroke-linecap="round" />
        <g fill="#5c9557">
          <ellipse cx="50" cy="158" rx="30" ry="27" />
          <ellipse cx="28" cy="172" rx="20" ry="16" />
          <ellipse cx="72" cy="170" rx="21" ry="17" />
        </g>
        <g fill="#518c4f">
          <ellipse cx="338" cy="164" rx="27" ry="24" />
          <ellipse cx="318" cy="178" rx="18" ry="14" />
          <ellipse cx="358" cy="176" rx="19" ry="15" />
        </g>
        <g stroke="#57894f" stroke-width="3.5" stroke-linecap="round" opacity="0.7">
          <path d="M120 206c3-8 7-8 11 0M186 210c3-8 7-8 11 0M262 204c3-8 7-8 11 0" />
        </g>
        <g stroke="#8fa8b8" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.75">
          <path d="M178 58c5-6 10-6 15 0M196 66c5-6 10-6 15 0" />
        </g>
      </svg>
    </div>

    <!-- 源码 .body：上移 8vh（relative + top:-8vh）、min-height 70vh、40rpx 上圆角 + 上投影 + 30rpx 40rpx 内边距 -->
    <div class="fd-body">
      <!-- 源码 .grid-item：磨砂药丸，top -5% / right 2%，里面 50rpx 的设置图标 -->
      <div class="fd-gear" role="button" aria-label="选择好友页面背景">
        <img class="fd-gear-icon" :src="liveAsset('/assets/settings.png')" alt="" />
      </div>

      <!-- 源码 .usermsg：padding-top 100rpx，头像绝对定位压在板子上沿 -->
      <div class="fd-user">
        <img class="fd-avatar" :src="liveAsset(mate.avatar)" alt="" />
        <div class="fd-username">
          <span class="fd-name">{{ mate.name }}</span>
          <span class="fd-sex" :class="mate.sex === '男' ? 'is-male' : 'is-female'">
            {{ mate.sex === '男' ? '♂' : '♀' }}
          </span>
        </div>
      </div>

      <!-- 源码 .usermsg1：padding 0 20rpx -->
      <div class="fd-info">
        <div class="fd-stats">关注 : {{ mate.follow || 0 }} | 粉丝 : {{ mate.fan || 0 }}</div>

        <div v-if="mate.briefIntroduction" class="fd-sign">
          <span class="fd-sign-label">个性签名：</span>
          <span class="fd-sign-text">{{ mate.briefIntroduction || '暂无描述' }}</span>
        </div>

        <!-- 源码 .user-info-list：三行 24rpx 上下内边距 + 1px 底边线 -->
        <div class="fd-rows">
          <div class="fd-row">
            <span>用 龄：{{ mate.useTime || 0 }} 年</span>
          </div>
          <div class="fd-row fd-row-collect">
            <span>收藏数：{{ mate.collectNumber || 0 }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9.4 4.6 7.2 7.4-7.2 7.4" stroke="#8b8b8b" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="fd-row">
            <span>评分数：{{ mate.markNumber || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 源码 .follow：绝对定位，距板底 80rpx、左右 40rpx -->
      <div class="fd-follow">
        <button class="fd-follow-btn" :class="{ 'is-followed': isfollow === 1 }">
          {{ isfollow === 1 ? '已关注' : '未关注' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page：100vw × 100vh、白底。本页没有底栏，也不用给底栏留白 */
.live-fd {
  /* (888 - 46 状态栏 - 44 返回栏) / 100 */
  --fd-vh: 7.98px;
  padding-bottom: 0;
  background: #fff;
  color: #333;
}

/* ---------- 返回栏（替代原生导航栏，和 LiveNotice / LiveSearchStore 同一套尺寸） ---------- */
.live-fd .fd-nav {
  display: flex;
  box-sizing: border-box;
  height: 44px;
  align-items: center;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.live-fd .fd-nav-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.live-fd .fd-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- 顶部大图：源码 .bg（35vh，overflow hidden） ---------- */
.live-fd .fd-bg {
  width: 100%;
  height: calc(var(--fd-vh) * 35);
  overflow: hidden;
}
.live-fd .fd-scene {
  display: block;
  width: 100%;
  height: 100%;
}

/* ---------- 资料板：源码 .body ----------
   源码写的是 position: relative + top: -8vh（视觉上移，但 8vh 的空白仍占着布局，页面因此可以多滚一点）。
   这里换成正的负 margin-top，视觉完全一致，但不再在最后留 8vh 空滚动区 */
.live-fd .fd-body {
  position: relative;
  margin-top: calc(var(--fd-vh) * -8);
  box-sizing: border-box;
  width: 100%;
  min-height: calc(var(--fd-vh) * 70);
  padding: calc(var(--u) * 30) calc(var(--u) * 40);
  border-radius: calc(var(--u) * 40) calc(var(--u) * 40) 0 0;
  background-color: #fff;
  box-shadow: 0 calc(var(--u) * -10) calc(var(--u) * 20) rgba(0, 0, 0, 0.05);
}

/* 源码 .grid-item：top -5%（相对资料板高度）、right 2%，padding 用的 --spacing-unit 在小程序里没定义 → 实际为 0 */
.live-fd .fd-gear {
  position: absolute;
  top: -5%;
  right: 2%;
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 10);
  padding: 0;
  border-radius: calc(var(--u) * 16);
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
}
.live-fd .fd-gear-icon {
  width: calc(var(--u) * 50);
  height: calc(var(--u) * 50);
}

/* ---------- 头像 + 昵称：源码 .usermsg / .usermsg image / .username / .name / .al ---------- */
.live-fd .fd-user {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(var(--u) * 100);
}
.live-fd .fd-avatar {
  position: absolute;
  top: calc(var(--u) * -80);
  width: calc(var(--u) * 160);
  height: calc(var(--u) * 160);
  border: calc(var(--u) * 6) solid #fff;
  border-radius: 50%;
  background: #f3f1f8;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 12) rgba(0, 0, 0, 0.1);
  object-fit: cover;
}
.live-fd .fd-username {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 15);
  margin-top: calc(var(--u) * 20);
}
.live-fd .fd-name {
  color: #333;
  font-size: calc(var(--u) * 44);
  font-weight: bold;
  line-height: 1.4;
}
.live-fd .fd-sex {
  font-size: calc(var(--u) * 28);
  font-weight: bold;
  line-height: 1.4;
}
.live-fd .fd-sex.is-male {
  color: #2467c7;
}
.live-fd .fd-sex.is-female {
  color: #f65684;
}

/* ---------- 资料：源码 .usermsg1 / .usermsg1-item1 / .personalizedSignature* / .user-info-list ---------- */
.live-fd .fd-info {
  margin-top: calc(var(--u) * 40);
  padding: 0 calc(var(--u) * 20);
}
.live-fd .fd-stats {
  margin-bottom: calc(var(--u) * 30);
  color: #8c9199;
  font-size: calc(var(--u) * 26);
  font-weight: 500;
  text-align: center;
}
/* 源码这一行是 inline 的 margin-top:10px / 0.8rem / #7b7f86，两个 span 各自盖回 28rpx */
.live-fd .fd-sign {
  display: flex;
  margin-top: 10px;
  color: #7b7f86;
  font-size: 12.8px;
}
.live-fd .fd-sign-label {
  flex-shrink: 0;
  color: #888;
  font-size: calc(var(--u) * 28);
}
.live-fd .fd-sign-text {
  color: #333;
  font-size: calc(var(--u) * 28);
  font-weight: 500;
  word-break: break-word;
}
.live-fd .fd-rows {
  margin-top: calc(var(--u) * 40);
  border-top: 1px solid #f0f0f0;
}
.live-fd .fd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--u) * 24) 0;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: calc(var(--u) * 28);
}

/* ---------- 关注按钮：源码 .follow / .follow-button / .isfollow ---------- */
.live-fd .fd-follow {
  position: absolute;
  bottom: calc(var(--u) * 80);
  left: calc(var(--u) * 40);
  width: calc(100% - calc(var(--u) * 80));
}
.live-fd .fd-follow-btn {
  width: 100%;
  height: calc(var(--u) * 80);
  border-radius: calc(var(--u) * 40);
  background-image: linear-gradient(to right, #6a5acd, #9370db);
  box-shadow: 0 calc(var(--u) * 8) calc(var(--u) * 20) rgba(106, 90, 205, 0.3);
  color: #fff;
  font-size: calc(var(--u) * 32);
  font-weight: bold;
  line-height: calc(var(--u) * 80);
  text-align: center;
  cursor: pointer;
}
.live-fd .fd-follow-btn.is-followed {
  background-image: linear-gradient(to right, #b0b0b0, #c0c0c0);
  box-shadow: none;
  color: #555;
}
</style>
