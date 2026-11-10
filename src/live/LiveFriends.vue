<script>
export const meta = { id: 'friends', label: '好友', note: '消息 + 好友列表', group: '社交', tab: 'friends', order: 1 };
</script>

<!--
  现版 · 好友（对应 quick-pick-main/pagesFriend/index/index.vue）
  结构：吸顶「好友 / 朋友、消息和新的认识」→ 搜索入口「寻找认识的人」
        → 消息宫格（4 个入口 + 未读角标 + 清除未读）→ 我的好友列表
        → 认识新同学（friendCard 推荐行）。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；
  uni-icons 的 size 在小程序里是 px，这里直接保留 px，并换成同形状内联 SVG。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 消息入口：label / icon 着色 / 未读数量都来自源码 messageEntries */
const messageEntries = [
  {
    type: 'like',
    label: '收到的赞',
    color: '#df7479',
    count: 12,
    paths: [
      { d: 'M12 20.2 4.9 13.1a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.2Z', mode: 'stroke' },
    ],
  },
  {
    type: 'follow',
    label: '新增关注',
    color: '#628ead',
    count: 3,
    paths: [
      { d: 'M10 4.3a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Z', mode: 'fill' },
      { d: 'M4.2 19.5c.6-3.5 3.1-5.9 6.8-5.9s6.2 2.4 6.8 5.9H4.2Z', mode: 'fill' },
      { d: 'M18.6 6.4v6.2M15.5 9.5h6.2', mode: 'stroke' },
    ],
  },
  {
    type: 'reply',
    label: '新的回复',
    color: '#65947d',
    count: 2,
    paths: [
      { d: 'M6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7l-4.2 3.1v-3.1H6.4A2.4 2.4 0 0 1 4 13.6V6.4A2.4 2.4 0 0 1 6.4 4Z', mode: 'stroke' },
    ],
  },
  {
    type: 'system',
    label: '系统通知',
    color: '#77737e',
    count: 1,
    paths: [
      { d: 'M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z', mode: 'stroke' },
      { d: 'M10.1 18.1a2 2 0 0 0 3.8 0', mode: 'stroke' },
    ],
  },
];

/* 未读总数：源码 unreadCount = messageEntries.reduce(...) */
const unreadCount = messageEntries.reduce((total, entry) => total + entry.count, 0);

/* 我的好友：字段对齐 getFriendList() 的 friendUserList（name / briefIntroduction / avatar） */
const friends = [
  {
    userId: 'QUICK07260312',
    name: '微信用户111111111111111',
    briefIntroduction: '此处无声胜有声',
    avatar: '/assets/reference-screens/ref-friends.jpg',
  },
  {
    userId: 'QUICK62765708',
    name: '微信用户',
    briefIntroduction: '~！ @测试',
    avatar: null,
  },
  {
    userId: 'QUICK36320164',
    name: 'Yilena',
    briefIntroduction: '保持热爱',
    avatar: '/assets/panda.svg',
  },
  {
    userId: 'QUICK36328162',
    name: 'メbluefox',
    briefIntroduction: '',
    avatar: '/assets/reference-screens/ref-friends.jpg',
  },
];

/* 认识新同学：maybeFollow() 返回项的 name / type / followFName，理由文案照 friendCard.vue 的映射 */
const recommendations = [
  {
    userId: 'QUICK07260312',
    name: '微信用户',
    type: 0,
    followFName: '',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    followed: true,
  },
  {
    userId: 'QUICK36328162',
    name: '微信用户',
    type: 1,
    followFName: 'Yilena',
    avatar: '/assets/panda.svg',
    followed: false,
  },
  {
    userId: 'QUICK62765708',
    name: 'Yilena',
    type: 3,
    followFName: '',
    avatar: null,
    followed: false,
  },
];

const recommendationReason = (item) => {
  const reasons = {
    0: '已关注你',
    1: item.followFName ? `${item.followFName}也关注了 TA` : '你关注的人也关注了 TA',
    2: '为你推荐',
    3: '庆快开发团队',
  };
  return reasons[item.type] || '为你推荐';
};
</script>

<template>
  <div class="live-page live-friends">
    <!-- 好友 tab 头部：源码 .friend-nav 吸顶（top 0），这里让 .live-sticky-head 卡在 46px 状态栏下 -->
    <header class="live-sticky-head friend-nav tab-section-header">
      <div class="tab-section-title tab-page-heading">好友</div>
      <div class="tab-section-subtitle">朋友、消息和新的认识</div>
    </header>

    <div class="page-content">
      <!-- 搜索入口：tab-search-entry 打底，.friend-search 覆盖成白底方角卡片 -->
      <div class="friend-search tab-search-entry">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.6" cy="10.6" r="6.1" stroke="#96939f" stroke-width="1.8" />
          <path d="m15.2 15.2 4.3 4.3" stroke="#96939f" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <span>寻找认识的人</span>
      </div>

      <section class="section message-section">
        <div class="section-header">
          <div class="heading-group">
            <span class="section-title">消息</span>
            <span class="section-caption">{{ unreadCount }} 条未读</span>
          </div>
          <button class="text-action">清除未读</button>
        </div>
        <div class="message-grid">
          <div v-for="entry in messageEntries" :key="entry.type" class="message-entry">
            <div class="message-icon" :class="'message-icon--' + entry.type">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  v-for="(item, index) in entry.paths"
                  :key="index"
                  :d="item.d"
                  :fill="item.mode === 'fill' ? entry.color : 'none'"
                  :stroke="item.mode === 'stroke' ? entry.color : 'none'"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span v-if="entry.count > 0" class="unread-badge">
                {{ entry.count > 99 ? '99+' : entry.count }}
              </span>
            </div>
            <span class="message-label">{{ entry.label }}</span>
          </div>
        </div>
      </section>

      <section class="section friends-section">
        <div class="section-header friends-header">
          <div class="heading-group">
            <span class="section-title">我的好友</span>
            <span class="friend-count">{{ friends.length }}</span>
          </div>
          <div class="friends-hint">
            <div class="friend-refresh" role="button" aria-label="刷新好友列表">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.5 14.8a9 9 0 1 1-2.1-9.4L23 10" stroke="#96939f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M23 4v6h-6" stroke="#96939f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <span class="section-caption">互相关注，成为好友</span>
          </div>
        </div>
        <div class="friend-list">
          <div v-for="item in friends" :key="item.userId" class="friend-row">
            <img
              v-if="item.avatar"
              class="friend-avatar"
              :src="liveAsset(item.avatar)"
              alt=""
            />
            <div v-else class="friend-avatar avatar-placeholder">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4.2" fill="#aaa4bc" />
                <path d="M12 13.6c-4.2 0-7 2.7-7.6 6.6h15.2c-.6-3.9-3.4-6.6-7.6-6.6Z" fill="#aaa4bc" />
              </svg>
            </div>
            <div class="friend-info">
              <span class="friend-name">{{ item.name || '微信用户' }}</span>
              <span class="friend-bio">{{ item.briefIntroduction || '还没有填写个性签名' }}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9.5 5 7 7-7 7" stroke="#c5c2ce" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      <section class="section recommend-section">
        <div class="section-header">
          <span class="section-title">认识新同学</span>
          <button class="text-action refresh-action">
            <span class="recommend-refresh-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.5 14.8a9 9 0 1 1-2.1-9.4L23 10" stroke="#6a5acd" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M23 4v6h-6" stroke="#6a5acd" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>换一批</span>
          </button>
        </div>
        <div class="recommend-list">
          <div v-for="item in recommendations" :key="item.userId" class="link-card">
            <img
              v-if="item.avatar"
              class="link-card__avatar"
              :src="liveAsset(item.avatar)"
              alt=""
            />
            <div v-else class="link-card__avatar avatar-placeholder">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4.2" fill="#aaa4bc" />
                <path d="M12 13.6c-4.2 0-7 2.7-7.6 6.6h15.2c-.6-3.9-3.4-6.6-7.6-6.6Z" fill="#aaa4bc" />
              </svg>
            </div>
            <div class="link-card__info">
              <span class="link-card__name">{{ item.name }}</span>
              <span class="link-card__reason" :class="{ 'is-fan': item.type === 0 }">
                {{ recommendationReason(item) }}
              </span>
            </div>
            <div class="link-card__follow-btn" :class="{ 'is-followed': item.followed }">
              <span v-if="!item.followed" class="follow-plus">+</span>
              <span>{{ item.followed ? '已关注' : '关注' }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 头部 ---------- */
.live-friends .tab-page-heading {
  min-height: 32px;
}

/* ---------- 页面内容：源码 .page-content ---------- */
.live-friends .page-content {
  padding: 0 calc(var(--u) * 28) calc(var(--u) * 40);
}
.live-friends .friend-search {
  height: calc(var(--u) * 78);
  margin-bottom: calc(var(--u) * 20);
  border: 1px solid #eeebf3;
  border-radius: calc(var(--u) * 18);
  background: #fff;
}

/* ---------- 通用卡片：源码 .section ---------- */
.live-friends .section {
  margin-bottom: calc(var(--u) * 20);
  padding: calc(var(--u) * 26) calc(var(--u) * 28);
  border-radius: calc(var(--u) * 20);
  background: #fff;
}
.live-friends .section-header,
.live-friends .heading-group {
  display: flex;
  align-items: center;
}
.live-friends .section-header {
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.live-friends .heading-group {
  min-width: 0;
  gap: calc(var(--u) * 12);
}
.live-friends .section-title {
  flex-shrink: 0;
  font-size: calc(var(--u) * 30);
  font-weight: 600;
  line-height: calc(var(--u) * 44);
}
.live-friends .section-caption {
  color: #96939f;
  font-size: calc(var(--u) * 22);
}
.live-friends .text-action {
  flex-shrink: 0;
  padding: calc(var(--u) * 8) 0 calc(var(--u) * 8) calc(var(--u) * 16);
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
}

/* ---------- 消息宫格 ---------- */
.live-friends .message-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: calc(var(--u) * 26) calc(var(--u) * -12) 0;
}
.live-friends .message-entry {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 16);
  padding-bottom: calc(var(--u) * 4);
}
.live-friends .message-icon {
  position: relative;
  display: flex;
  width: calc(var(--u) * 80);
  height: calc(var(--u) * 80);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 24);
  background: #fbf0f0;
}
.live-friends .message-icon--follow {
  background: #eef4f7;
}
.live-friends .message-icon--reply {
  background: #edf5f0;
}
.live-friends .message-icon--system {
  background: #f1f1f3;
}
.live-friends .message-label {
  color: #504b5e;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 34);
  white-space: nowrap;
}
.live-friends .unread-badge {
  position: absolute;
  top: calc(var(--u) * -6);
  right: calc(var(--u) * -10);
  box-sizing: border-box;
  min-width: calc(var(--u) * 30);
  height: calc(var(--u) * 30);
  padding: 0 calc(var(--u) * 8);
  border: calc(var(--u) * 3) solid #fff;
  border-radius: calc(var(--u) * 20);
  background: #ef716c;
  color: #fff;
  font-size: calc(var(--u) * 18);
  line-height: calc(var(--u) * 24);
  text-align: center;
}

/* ---------- 我的好友 ---------- */
.live-friends .friends-section {
  padding-bottom: calc(var(--u) * 8);
}
.live-friends .friends-header {
  margin-bottom: calc(var(--u) * 12);
}
.live-friends .friends-hint {
  display: flex;
  align-items: center;
}
.live-friends .friend-refresh {
  display: flex;
  width: calc(var(--u) * 48);
  height: calc(var(--u) * 48);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}
.live-friends .friend-count {
  color: #8d80bd;
  font-size: calc(var(--u) * 24);
}
.live-friends .friend-row {
  /* round3.css 里给原版好友页写过 .friend-row{height:76px}，源码没有固定行高，这里按内容撑开 */
  height: auto;
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 20);
  padding: calc(var(--u) * 24) 0;
}
.live-friends .friend-row + .friend-row {
  border-top: 1px solid #f3f2f6;
}
.live-friends .friend-avatar {
  width: calc(var(--u) * 88);
  height: calc(var(--u) * 88);
  flex-shrink: 0;
  border-radius: 50%;
  background: #f3f1f8;
  object-fit: cover;
}
.live-friends .avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}
.live-friends .friend-info {
  flex: 1;
  min-width: 0;
}
.live-friends .friend-name,
.live-friends .friend-bio {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.live-friends .friend-name {
  font-size: calc(var(--u) * 28);
  font-weight: 500;
  line-height: calc(var(--u) * 40);
}
.live-friends .friend-bio {
  margin-top: calc(var(--u) * 6);
  color: #96939f;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 34);
}

/* ---------- 认识新同学（friendCard 行） ---------- */
.live-friends .refresh-action {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
}
.live-friends .recommend-refresh-icon {
  display: flex;
  width: calc(var(--u) * 28);
  height: calc(var(--u) * 28);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}
.live-friends .recommend-list {
  margin-top: calc(var(--u) * 12);
}
.live-friends .link-card {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 20);
  padding: calc(var(--u) * 22) 0;
}
.live-friends .link-card + .link-card {
  border-top: 1px solid #f3f2f6;
}
.live-friends .link-card__avatar {
  width: calc(var(--u) * 88);
  height: calc(var(--u) * 88);
  flex-shrink: 0;
  border-radius: 50%;
  background: #f3f1f8;
  object-fit: cover;
}
.live-friends .link-card__info {
  flex: 1;
  min-width: 0;
}
.live-friends .link-card__name,
.live-friends .link-card__reason {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.live-friends .link-card__name {
  color: #292633;
  font-size: calc(var(--u) * 28);
  font-weight: 500;
  line-height: calc(var(--u) * 40);
}
.live-friends .link-card__reason {
  margin-top: calc(var(--u) * 6);
  color: #96939f;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 34);
}
.live-friends .link-card__reason.is-fan {
  color: #8b7ac5;
}
.live-friends .link-card__follow-btn {
  display: flex;
  box-sizing: border-box;
  min-width: calc(var(--u) * 132);
  height: calc(var(--u) * 60);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 6);
  padding: 0 calc(var(--u) * 20);
  border: 1px solid #e8e1f8;
  border-radius: calc(var(--u) * 32);
  background: #f1edfc;
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
  font-weight: 500;
}
.live-friends .follow-plus {
  font-size: calc(var(--u) * 30);
  line-height: 1;
}
.live-friends .link-card__follow-btn.is-followed {
  border-color: #efedf4;
  background: #f5f4f8;
  color: #96939f;
}
</style>
