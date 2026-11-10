<script>
export const meta = { id: 'follows', label: '关注', note: '我关注的人', group: '社交', tab: '', order: 7 };
</script>

<!--
  现版 · 关注（对应 quick-pick-main/pageuser/followlist/followlist.vue）
  入口：「我的」页统计里的「关注」数字 → /pageuser/followlist/followlist（uni.navigateTo 二级页）。
  结构：原生导航栏（44px 返回 + 关注）→ 关注列表。
  源码这一屏只有一个 scroll-view，每条 .evefollow 是 140rpx 高、左右 30rpx 内边距、1rpx #e9e9e9 底边线，
  奇数行 #fcfcfc / 偶数行 #ffffff 斑马纹；左侧头像区固定 15% 宽（100rpx 圆头像），
  中间 name 32rpx/700 + followTime 24rpx，右侧 140rpx 操作区里 120rpx×56rpx 的胶囊按钮。
  getFollowlist() 给每条都标 isFollowed: true，所以按钮一律是灰底「已关注」（紫底的「关注」是取消关注后的态）。
  pages.json: navigationBarTitleText = 关注、navigationBarBackgroundColor = #ffffff，设计台上自己画一条 44px 吸顶栏。
  所有尺寸照抄源码 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  静态稿：只画列表本身，没有下拉刷新、空态（Empty.vue）和关注 / 取消关注的接口调用；
  「我的」页统计写的是关注 23，这里放 12 条（够铺满一屏，静态稿不滚动到第 13 条）。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 字段对齐 socialServer.getFollowList() 的项：followedId / followedName / followedAvatar / followTime */
const follows = [
  {
    followedId: 'QUICK36328162',
    followedName: 'メbluefox',
    followedAvatar: '/assets/panda.svg',
    followTime: '2025-09-22 10:08',
  },
  {
    followedId: 'QUICK07260312',
    followedName: '微信用户111111111111111',
    followedAvatar: '/assets/reference-screens/ref-friends.jpg',
    followTime: '2025-09-24 19:36',
  },
  {
    followedId: 'QUICK62765708',
    followedName: 'Yilena',
    followedAvatar: '/assets/reference-screens/ref-profile.jpg',
    followTime: '2025-09-26 08:52',
  },
  {
    followedId: 'QUICK36320164',
    followedName: '阿岚不吃香菜',
    followedAvatar: null,
    followTime: '2025-09-28 21:04',
  },
  {
    followedId: 'QUICK38120904',
    followedName: '小胖橘',
    followedAvatar: null,
    followTime: '2025-09-30 12:17',
  },
  {
    followedId: 'QUICK55271038',
    followedName: '柠檬气泡水',
    followedAvatar: null,
    followTime: '2025-10-02 17:45',
  },
  {
    followedId: 'QUICK41387620',
    followedName: '拾光',
    followedAvatar: '/assets/reference-screens/ref-friends.jpg',
    followTime: '2025-10-03 09:31',
  },
  {
    followedId: 'QUICK29018475',
    followedName: '夜跑协会小刘',
    followedAvatar: null,
    followTime: '2025-10-05 22:09',
  },
  {
    followedId: 'QUICK61730928',
    followedName: '微信用户',
    followedAvatar: '/assets/reference-screens/ref-profile.jpg',
    followTime: '2025-10-07 13:26',
  },
  {
    followedId: 'QUICK58402196',
    followedName: '一笼小笼包',
    followedAvatar: null,
    followTime: '2025-10-08 07:58',
  },
  {
    followedId: 'QUICK10573842',
    followedName: '陈同学',
    followedAvatar: '/assets/panda.svg',
    followTime: '2025-10-09 16:40',
  },
  {
    followedId: 'QUICK92840517',
    followedName: '饭点观察员',
    followedAvatar: null,
    followTime: '2025-10-10 20:12',
  },
];

/* 源码 getFollowlist() 里每条都补了 isFollowed: true */
const followedState = true;
</script>

<template>
  <div class="live-page live-follows">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 关注） -->
    <header class="fl-nav live-sticky-head">
      <button class="fl-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="fl-nav-title">关注</h1>
    </header>

    <!-- 源码 .body（scroll-view）：每行 140rpx 高，奇偶斑马纹 -->
    <div class="fl-list">
      <div
        v-for="(item, index) in follows"
        :key="item.followedId"
        class="fl-row"
        :class="index % 2 === 0 ? 'fl-row--even' : 'fl-row--odd'"
      >
        <!-- .ava：固定 15% 宽，头像 100rpx 圆形（2rpx #e0e0e0 描边 + 轻投影） -->
        <div class="fl-ava">
          <img
            v-if="item.followedAvatar"
            class="fl-avatar"
            :src="liveAsset(item.followedAvatar)"
            alt=""
          />
          <div v-else class="fl-avatar fl-avatar--empty">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4.2" fill="#aaa4bc" />
              <path d="M12 13.6c-4.2 0-7 2.7-7.6 6.6h15.2c-.6-3.9-3.4-6.6-7.6-6.6Z" fill="#aaa4bc" />
            </svg>
          </div>
        </div>

        <!-- .msg → .name-wrapper：昵称 + 「关注时间 关注」 -->
        <div class="fl-msg">
          <div class="fl-name-wrap">
            <div class="fl-name">{{ item.followedName }}</div>
            <div class="fl-time">{{ item.followTime }} 关注</div>
          </div>
        </div>

        <!-- .action-btn：140rpx 操作区，120rpx×56rpx 胶囊按钮 -->
        <div class="fl-action">
          <div class="fl-btn" :class="{ 'fl-btn--followed': followedState }">
            {{ followedState ? '已关注' : '关注' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .page：100vw × 100vh 的 #f7f7f7 底，二级页没有底栏，内容直接贴到画布底边 ---------- */
.live-follows {
  box-sizing: border-box;
  min-height: 888px;
  padding: 46px 0 0;
  background: #f7f7f7;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.fl-nav {
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
.fl-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fl-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- 列表行：源码 .evefollow.flrow ---------- */
.fl-row {
  display: flex;
  width: 100%;
  height: calc(var(--u) * 140);
  box-sizing: border-box;
  padding: 0 calc(var(--u) * 30);
  border-bottom: 1px solid #e9e9e9;
}
.fl-row--even {
  background-color: #fff;
}
.fl-row--odd {
  background-color: #fcfcfc;
}

/* ---------- .ava：15% 宽、整行高、居中 ---------- */
.fl-ava {
  display: flex;
  width: 15%;
  height: 100%;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}
.fl-avatar {
  width: calc(var(--u) * 100);
  height: calc(var(--u) * 100);
  box-sizing: border-box;
  border: calc(var(--u) * 2) solid #e0e0e0;
  border-radius: 50%;
  box-shadow: 0 calc(var(--u) * 2) calc(var(--u) * 6) rgba(0, 0, 0, 0.05);
  object-fit: cover;
}
.fl-avatar--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f1f8;
}

/* ---------- .msg：占满中间，左侧再留 30rpx ---------- */
.fl-msg {
  display: flex;
  height: 100%;
  flex-grow: 1;
  align-items: center;
  padding-left: calc(var(--u) * 30);
  overflow: hidden;
}
.fl-name-wrap {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}
.fl-name {
  margin-bottom: calc(var(--u) * 4);
  overflow: hidden;
  color: #333;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: calc(var(--u) * 32);
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fl-time {
  overflow: hidden;
  color: #999;
  font-size: calc(var(--u) * 24);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- .action-btn / .follow-btn ---------- */
.fl-action {
  display: flex;
  width: calc(var(--u) * 140);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}
.fl-btn {
  display: flex;
  width: calc(var(--u) * 120);
  height: calc(var(--u) * 56);
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: calc(var(--u) * 28);
  background-color: #887bfe;
  color: #f8f8f8;
  font-size: calc(var(--u) * 24);
  font-weight: 500;
}
/* .follow-btn.followed：已关注态（源码里每条都直接被标成已关注） */
.fl-btn--followed {
  border-color: #ccc;
  background-color: #f8f8f8;
  color: #999;
}
</style>
