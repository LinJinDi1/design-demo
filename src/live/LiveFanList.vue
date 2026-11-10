<script>
export const meta = { id: 'fans', label: '粉丝', note: '关注我的人', group: '社交', tab: '', order: 8 };
</script>

<!--
  现版 · 粉丝（对应 quick-pick-main/pageuser/fanlist/fanlist.vue）
  入口：「我的」页统计里的「粉丝」数字 → /pageuser/fanlist/fanlist（uni.navigateTo 二级页）。
  结构：原生导航栏（44px 返回 + 粉丝）→ 粉丝列表。
  源码 .body（scroll-view）是整屏白底，每条 .fan-item 是 24rpx / 30rpx 内边距、1rpx #eeeeee 底边线：
  左侧 100rpx 圆头像（2rpx #e0e0e0 描边 + 0 4rpx 8rpx 投影），中间高度 100rpx 的 info 区
  里是 name 32rpx/700 + 「关注时间 关注了你」24rpx，右侧 120rpx×56rpx 胶囊按钮（未回关 #887bfe 底白字 / 已回关 #f5f5f5 底 #999）。
  按钮文案来自 getFans() + checkFollow()：互相关注 / 回关。
  pages.json: navigationBarTitleText = 粉丝、navigationBarBackgroundColor = #ffffff，设计台上自己画一条 44px 吸顶栏。
  所有尺寸照抄源码 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  静态稿：只画列表本身，没有下拉刷新、空态（Empty.vue）、回关确认弹窗和接口调用。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 源码 data.type：默认 true 才显示「关注了你」那一行，只有 ?type=log 进来才隐藏 */
const showFollowTime = true;

/* 字段对齐 socialServer.getFans() 的项：followerId / followerName / followerAvatar / followTime，
   isFollowed 是 checkFollow() 的结果（true = 互相关注） */
const fans = [
  {
    followerId: 'QUICK07260312',
    followerName: '微信用户111111111111111',
    followerAvatar: '/assets/reference-screens/ref-friends.jpg',
    followTime: '2025-10-09 19:22',
    isFollowed: true,
  },
  {
    followerId: 'QUICK62765708',
    followerName: 'Yilena',
    followerAvatar: '/assets/reference-screens/ref-profile.jpg',
    followTime: '2025-10-10 08:15',
    isFollowed: true,
  },
  {
    followerId: 'QUICK36328162',
    followerName: 'メbluefox',
    followerAvatar: '/assets/panda.svg',
    followTime: '2025-10-10 21:40',
    isFollowed: true,
  },
  {
    followerId: 'QUICK41387620',
    followerName: '拾光',
    followerAvatar: null,
    followTime: '2025-10-11 10:02',
    isFollowed: false,
  },
  {
    followerId: 'QUICK55271038',
    followerName: '柠檬气泡水',
    followerAvatar: null,
    followTime: '2025-10-11 20:16',
    isFollowed: false,
  },
];
</script>

<template>
  <div class="live-page live-fans">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 粉丝） -->
    <header class="fn-nav live-sticky-head">
      <button class="fn-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="fn-nav-title">粉丝</h1>
    </header>

    <!-- 源码 .body：整屏白底，每条 .fan-item 用 1rpx #eeeeee 分隔 -->
    <div class="fn-list">
      <div v-for="item in fans" :key="item.followerId" class="fn-item">
        <!-- .avatar-area：100rpx 圆头像，右侧留 30rpx -->
        <div class="fn-avatar-area">
          <img
            v-if="item.followerAvatar"
            class="fn-avatar"
            :src="liveAsset(item.followerAvatar)"
            alt=""
          />
          <div v-else class="fn-avatar fn-avatar--empty">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4.2" fill="#aaa4bc" />
              <path d="M12 13.6c-4.2 0-7 2.7-7.6 6.6h15.2c-.6-3.9-3.4-6.6-7.6-6.6Z" fill="#aaa4bc" />
            </svg>
          </div>
        </div>

        <!-- .info-area：高 100rpx，左昵称 / 时间，右回关按钮 -->
        <div class="fn-info">
          <div class="fn-name-wrap">
            <div class="fn-name">{{ item.followerName }}</div>
            <div v-if="showFollowTime" class="fn-time">{{ item.followTime }} 关注了你</div>
          </div>

          <div class="fn-follow-action">
            <div class="fn-btn" :class="{ 'fn-btn--followed': item.isFollowed }">
              {{ item.isFollowed ? '互相关注' : '回关' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .page（#f7f7f7）被 .body 的整屏白底盖住，二级页没有底栏，直接铺到画布底边 ---------- */
.live-fans {
  box-sizing: border-box;
  min-height: 888px;
  padding: 46px 0 0;
  background: #fff;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.fn-nav {
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
.fn-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fn-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .fan-item：整行白底、24rpx / 30rpx 内边距、1rpx #eeeeee 底边线 ---------- */
.fn-item {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: calc(var(--u) * 24) calc(var(--u) * 30);
  border-bottom: 1px solid #eee;
}

/* ---------- .avatar-area / .avatar ---------- */
.fn-avatar-area {
  flex-shrink: 0;
  margin-right: calc(var(--u) * 30);
}
.fn-avatar {
  width: calc(var(--u) * 100);
  height: calc(var(--u) * 100);
  box-sizing: border-box;
  border: calc(var(--u) * 2) solid #e0e0e0;
  border-radius: 50%;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 8) rgba(0, 0, 0, 0.05);
  object-fit: cover;
}
.fn-avatar--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f1f8;
}

/* ---------- .info-area：高 100rpx，两端对齐 ---------- */
.fn-info {
  display: flex;
  height: calc(var(--u) * 100);
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
}
.fn-name-wrap {
  display: flex;
  min-width: 0;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
}
.fn-name {
  margin-bottom: calc(var(--u) * 4);
  overflow: hidden;
  color: #333;
  font-size: calc(var(--u) * 32);
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fn-time {
  overflow: hidden;
  color: #999;
  font-size: calc(var(--u) * 24);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- .follow-action / .follow-btn ---------- */
.fn-follow-action {
  flex-shrink: 0;
  margin-left: calc(var(--u) * 20);
}
.fn-btn {
  width: calc(var(--u) * 120);
  height: calc(var(--u) * 56);
  box-sizing: border-box;
  border: 1px solid #887bfe;
  border-radius: calc(var(--u) * 28);
  background-color: #887bfe;
  color: #fff;
  font-size: calc(var(--u) * 24);
  font-weight: 500;
  line-height: calc(var(--u) * 56);
  text-align: center;
}
/* .follow-btn.is-followed：已互相关注 */
.fn-btn--followed {
  border-color: #e0e0e0;
  background-color: #f5f5f5;
  color: #999;
}
</style>
