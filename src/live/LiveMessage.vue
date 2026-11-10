<script>
export const meta = { id: 'message', label: '消息中心', note: '赞 / 回复 / 关注 / 系统', group: '社交', tab: '', order: 2 };
</script>

<!--
  现版 · 消息中心（对应 quick-pick-main/pageuser/message/message.vue）
  结构：顶部返回栏「消息中心」（源码是原生导航栏，见 pages.json 的 navigationBarTitleText）
        → 四个消息 tab（图标 + 未读角标 + 选中紫底 / 紫色下划线）
        → 消息面板（标题 + 条数 + 清空列表）→ 消息行（头像 / 昵称 / 时间 / 说明 / 引用块）
        → 列表尾部「已显示全部消息」。
  尺寸照抄源码 rpx，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；uni-icons 的 size 是 px，保留 px。
  源码是 uni.navigateTo 打开的二级页（不是 tabBar 页），所以 meta.tab 留空：
  外壳不画玻璃底栏、也不给底栏留 78px，底部只留源码 .message-page 自己的 48rpx。

  静态稿只做「收到的赞」这一 tab 的已加载终态（源码 onLoad 的默认 tab）：loadMessages() 成功后会调
  deleteUnread(type) 把当前 tab 的未读清零，所以「收到的赞」没有角标，
  另外三个 tab 仍是未读（新增关注 3 / 新的回复 2 / 系统通知 1）。
  系统通知 tab 的行（无头像 + 铃铛占位 + 底部「庆快校园」/ 审核状态）和「新的回复」的原内容块
  这一屏没铺；清空确认弹窗、骨架屏、空态、上拉加载也都没做。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 四个 tab：map 自源码 messageTabs（type / label / icon / count） */
const messageTabs = [
  {
    type: 'like',
    label: '收到的赞',
    count: 0,
    iconPaths: [
      { d: 'M12 20.2 4.9 13.1a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.2Z', mode: 'stroke' },
    ],
  },
  {
    type: 'follow',
    label: '新增关注',
    count: 3,
    iconPaths: [
      { d: 'M10 4.3a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Z', mode: 'fill' },
      { d: 'M3.6 19.6c.6-3.6 3.1-6 6.4-6s5.8 2.4 6.4 6H3.6Z', mode: 'fill' },
      { d: 'M18.6 6.5v6.2M15.5 9.6h6.2', mode: 'stroke' },
    ],
  },
  {
    type: 'reply',
    label: '新的回复',
    count: 2,
    iconPaths: [
      { d: 'M6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7l-4.2 3.1v-3.1H6.4A2.4 2.4 0 0 1 4 13.6V6.4A2.4 2.4 0 0 1 6.4 4Z', mode: 'stroke' },
    ],
  },
  {
    type: 'system',
    label: '系统通知',
    count: 1,
    iconPaths: [
      { d: 'M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z', mode: 'stroke' },
      { d: 'M10.1 18.1a2 2 0 0 0 3.8 0', mode: 'stroke' },
    ],
  },
];

/* 当前 tab 恒为「收到的赞」= 源码 onLoad 的默认值（options.type 缺省时 'like'） */
const activeType = 'like';

/* 收到的赞：字段对齐 formatMessageData() 的 like 分支
   （userName / avatar / content / entityType / createTime），时间走 formatReplyTime 的文案规则 */
const likeMessages = [
  {
    id: 1,
    userName: '微信用户111111111111111',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    time: '12分钟前',
    entityType: 0,
    content: '林胡子家的猪脚饭是真的顶，汤都喝完了',
  },
  {
    id: 2,
    userName: 'Yilena',
    avatar: '/assets/panda.svg',
    time: '46分钟前',
    entityType: 1,
    content: '二楼靠窗的位置插座多，适合自习',
  },
  {
    id: 3,
    userName: '微信用户',
    avatar: null,
    time: '3小时前',
    entityType: 0,
    content: '徐豆豆的柠檬茶比奶茶好喝，就是有点酸',
  },
  {
    id: 4,
    userName: 'メbluefox',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    time: '1天前',
    entityType: 1,
    content: '菊苑一楼的猪脚饭 12 块，量大',
  },
  {
    id: 5,
    userName: 'Yilena',
    avatar: '/assets/panda.svg',
    time: '3天前',
    entityType: 0,
    content: '工行门那家小摊八点后打折，记得早点去',
  },
  {
    id: 6,
    userName: '微信用户',
    avatar: null,
    time: '5天前',
    entityType: 0,
    content: '老潼关的肉夹馍皮是真的脆',
  },
  {
    id: 7,
    userName: 'メbluefox',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    time: '2026-10-30',
    entityType: 1,
    content: '研读室的投影修好了，晚上也能约',
  },
];
</script>

<template>
  <div class="live-page live-message">
    <!-- 源码是原生导航栏（白底 + 标题「消息中心」），这里补一条 44px 的白底返回栏 -->
    <header class="msg-nav live-sticky-head">
      <button class="msg-nav-back" aria-label="返回">
        <uni-icons type="left" :size="22" color="#34313f" />
      </button>
      <h1 class="msg-nav-title">消息中心</h1>
    </header>

    <div class="msg-body">
      <!-- 源码 .message-tabs：白底卡片里的四个 tab -->
      <div class="msg-tabs">
        <div
          v-for="tab in messageTabs"
          :key="tab.type"
          class="msg-tab"
          :class="{ 'is-active': tab.type === activeType }"
        >
          <div class="msg-tab-icon">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                v-for="(item, index) in tab.iconPaths"
                :key="index"
                :d="item.d"
                :fill="item.mode === 'fill' ? (tab.type === activeType ? '#6a5acd' : '#96939f') : 'none'"
                :stroke="item.mode === 'stroke' ? (tab.type === activeType ? '#6a5acd' : '#96939f') : 'none'"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-if="tab.count > 0" class="msg-badge">{{ tab.count > 99 ? '99+' : tab.count }}</span>
          </div>
          <span class="msg-tab-label">{{ tab.label }}</span>
          <div class="msg-tab-indicator" />
        </div>
      </div>

      <!-- 源码 .message-panel：标题 / 条数 / 清空列表 + 消息行 -->
      <div class="msg-panel">
        <div class="msg-panel-header">
          <div class="msg-panel-heading">
            <span class="msg-panel-title">收到的赞</span>
            <span class="msg-panel-count">{{ likeMessages.length }} 条</span>
          </div>
          <span class="msg-clear">清空列表</span>
        </div>

        <div class="msg-list">
          <div v-for="item in likeMessages" :key="item.id" class="msg-row">
            <img v-if="item.avatar" class="msg-avatar" :src="liveAsset(item.avatar)" alt="" />
            <div v-else class="msg-avatar msg-avatar-empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4.2" fill="#9b91bd" />
                <path d="M12 13.6c-4.2 0-7 2.7-7.6 6.6h15.2c-.6-3.9-3.4-6.6-7.6-6.6Z" fill="#9b91bd" />
              </svg>
            </div>
            <div class="msg-content">
              <div class="msg-meta">
                <span class="msg-name">{{ item.userName }}</span>
                <span class="msg-time">{{ item.time }}</span>
              </div>
              <span class="msg-description">
                {{ item.entityType === 0 ? '赞了你的评论' : '赞了你的回复' }}
              </span>
              <span class="msg-text msg-quote">{{ item.content }}</span>
            </div>
          </div>
          <div class="msg-feedback">已显示全部消息</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .message-page 的底色，取 #f7f7fa（比 live-page 的 #f7f7f8 略偏紫）；
   底部不留 190rpx 底栏位，回到源码的 48rpx */
.live-message {
  padding-bottom: calc(var(--u) * 48);
  background: #f7f7fa;
  color: #292633;
}

/* ---------- 返回栏（替代原生导航栏，和 LiveNotice 的 .nt-nav 同一套尺寸） ---------- */
.live-message .msg-nav {
  display: flex;
  box-sizing: border-box;
  height: 44px;
  align-items: center;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.live-message .msg-nav-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.live-message .msg-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- 页面内容：源码 .message-page padding: 24rpx 28rpx 48rpx ---------- */
.live-message .msg-body {
  padding: calc(var(--u) * 24) calc(var(--u) * 28) calc(var(--u) * 48);
}

/* ---------- 四个消息 tab：源码 .message-tabs ---------- */
.live-message .msg-tabs {
  display: flex;
  margin-bottom: calc(var(--u) * 24);
  padding: calc(var(--u) * 28) calc(var(--u) * 12) 0;
  border-radius: calc(var(--u) * 24);
  background: #fff;
}
.live-message .msg-tab {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
}
.live-message .msg-tab-icon {
  position: relative;
  display: flex;
  width: calc(var(--u) * 88);
  height: calc(var(--u) * 88);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 28);
  background: #f6f5f9;
}
.live-message .msg-tab.is-active .msg-tab-icon {
  background: #f1edfc;
}
.live-message .msg-badge {
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
.live-message .msg-tab-label {
  margin-top: calc(var(--u) * 14);
  color: #96939f;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 36);
  white-space: nowrap;
}
.live-message .msg-tab.is-active .msg-tab-label {
  color: #6a5acd;
  font-weight: 500;
}
.live-message .msg-tab-indicator {
  width: calc(var(--u) * 32);
  height: calc(var(--u) * 5);
  margin-top: calc(var(--u) * 20);
  border-radius: calc(var(--u) * 4);
  background: transparent;
}
.live-message .msg-tab.is-active .msg-tab-indicator {
  background: #6a5acd;
}

/* ---------- 消息面板：源码 .message-panel ---------- */
.live-message .msg-panel {
  padding: calc(var(--u) * 28);
  border-radius: calc(var(--u) * 24);
  background: #fff;
}
.live-message .msg-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.live-message .msg-panel-heading {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
}
.live-message .msg-panel-title {
  font-size: calc(var(--u) * 30);
  font-weight: 600;
  line-height: calc(var(--u) * 44);
}
.live-message .msg-panel-count {
  color: #96939f;
  font-size: calc(var(--u) * 22);
}
.live-message .msg-clear {
  flex-shrink: 0;
  padding: calc(var(--u) * 10) 0 calc(var(--u) * 10) calc(var(--u) * 16);
  color: #96939f;
  font-size: calc(var(--u) * 24);
}

/* ---------- 消息行：源码 .message-row ---------- */
.live-message .msg-list {
  margin-top: calc(var(--u) * 16);
}
.live-message .msg-row {
  display: flex;
  align-items: flex-start;
  gap: calc(var(--u) * 18);
  padding: calc(var(--u) * 28) 0;
}
.live-message .msg-row + .msg-row {
  border-top: 1px solid #f3f2f6;
}
.live-message .msg-avatar {
  width: calc(var(--u) * 80);
  height: calc(var(--u) * 80);
  flex-shrink: 0;
  border-radius: 50%;
  background: #f3f1f8;
  object-fit: cover;
}
.live-message .msg-avatar-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.live-message .msg-content {
  flex: 1;
  min-width: 0;
}
.live-message .msg-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.live-message .msg-name {
  overflow: hidden;
  font-size: calc(var(--u) * 28);
  font-weight: 500;
  line-height: calc(var(--u) * 40);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.live-message .msg-time {
  flex-shrink: 0;
  color: #aaa5b4;
  font-size: calc(var(--u) * 20);
}
.live-message .msg-description {
  display: block;
  margin-top: calc(var(--u) * 6);
  color: #96939f;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 36);
}
.live-message .msg-text {
  display: block;
  margin-top: calc(var(--u) * 10);
  color: #5d576b;
  font-size: calc(var(--u) * 26);
  line-height: calc(var(--u) * 40);
  word-break: break-all;
}
/* 「收到的赞」把内容塞进灰底引用块（源码 :class="{ 'message-quote': currentType === 'like' }"） */
.live-message .msg-quote {
  padding: calc(var(--u) * 16) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 12);
  background: #f7f6fa;
  color: #8b8597;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 36);
}
.live-message .msg-feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 16);
  padding: calc(var(--u) * 24) 0 calc(var(--u) * 8);
  color: #aaa5b4;
  font-size: calc(var(--u) * 24);
}
</style>
