<script>
export const meta = {
  id: 'stalldetail',
  label: '摊位详情',
  note: '小摊卡片点进来',
  group: '校园觅食',
  tab: '',
  order: 2,
};
</script>

<!--
  现版 · 摊位详情（小摊卡片点进来）
  对应 quick-pick-main/pagesLog/stalldetail/stalldetail.vue
        + components/StallLiveStatus（直接复用，无请求）
        + components/StallCommentSummary（它 mounted 就拉评价，静态稿拿不到数据 → 按它的 rpx 手写一份）
  结构：沉浸式返回 → 封面大图 460rpx → 店名卡（头像 + 摊名 + 品类胶囊 + 四列数据）
        → 位置/营业时间/标签卡 → 现场情况卡（原生 StallLiveStatus）
        → 介绍/菜单/评价分段（这里停在「评价」：评分概览 + 全部评价列表）
        → 底部操作条（评分 / 收藏 / 分享）。
  尺寸照抄源码 rpx：1rpx = 0.52px，卡片 margin 0 20rpx / padding 24rpx / radius 16rpx。
  刻意简化：评分弹层、分享面板、留言弹层、快捷上报浮窗（都是点击后才出现的浮层，静态稿不画）。
-->
<script setup>
import { computed } from 'vue';
import StallLiveStatus from '@app/components/StallLiveStatus/StallLiveStatus.vue';
import { liveAsset } from './asset.js';

/* normalizeStall() 之后的形状，数据取线上「徐豆豆」（和 LiveList 第一张卡同一家） */
const stall = {
  name: '徐豆豆',
  type: '饮品',
  ratingText: '4.2',
  ratingUsersCount: 4,
  avgPriceText: '10',
  viewCount: 1286,
  locationText: '工行门 · 工行门附近',
  timeText: '11:00 ~ 22:30',
  tags: ['糖水', '甜品'],
  commentCount: 3,
  image: '/assets/source-fidelity/stalls/xudoudou.jpeg',
};

/* StallLiveStatus 内部会 normalizeLiveStatus()，喂 statusCode 它就会用固定文案 */
const liveStatus = {
  statusCode: 'NO_RECENT_CONFIRMATION',
  evidenceSummary: '最近还没有新的反馈',
};

const tabs = [
  { value: 'intro', label: '介绍' },
  { value: 'menu', label: '菜单' },
  { value: 'comments', label: '评价' },
];
/* 停在「评价」：把评分概览 + 留言列表都露出来（截图里这一段的计数是 3） */
const activeTab = 'comments';

const roundedRating = computed(() => Math.round(Number(stall.ratingText) || 0));

/* StallCommentSummary 的示例数据：线上徐豆豆默认最热的 3 条 */
const comments = [
  {
    id: 'c1',
    author: '微信用户',
    time: '1天前',
    content:
      '以前觉得味道还行，现在觉得不如隔壁忘川清补凉，同样的价格比徐豆豆分量大，而且香芋比他们家好吃',
    likeCount: 0,
  },
  {
    id: 'c2',
    author: '微信用户',
    anonymous: true,
    time: '5天前',
    content: '一般般，没有很好吃',
    likeCount: 0,
  },
  {
    id: 'c3',
    author: '微信用户',
    time: '5天前',
    content: '好吃😋，推荐龙眼桂花冻',
    likeCount: 0,
  },
];

const cover = liveAsset(stall.image);
</script>

<template>
  <div class="live-page live-stalldetail">
    <!-- 沉浸式返回：源码 .stall-back 是 fixed + top(statusBar+8)，这里吸在画布状态栏下方 -->
    <div class="sd-back">
      <div class="sd-back-chevron"></div>
    </div>

    <!-- 封面图（stall-image height 460rpx） -->
    <div class="sd-cover">
      <img class="sd-cover-img" :src="cover" alt="" />
    </div>

    <!-- .bodyname：头像 + 摊名 + 品类胶囊 + 四列数据 -->
    <div class="sd-name-card">
      <div class="sd-bn-row">
        <div class="sd-avatar"><img :src="cover" alt="" /></div>
        <div class="sd-info">
          <div class="sd-title-row">
            <span class="sd-name">{{ stall.name }}</span>
            <span class="sd-type">{{ stall.type }}</span>
          </div>
          <div class="sd-stats">
            <div class="sd-stat sd-stat--accent">
              <span class="sd-stat-label">评分</span>
              <span class="sd-stat-value sd-stat-value--accent">{{ stall.ratingText }}</span>
            </div>
            <div class="sd-stat-sep"></div>
            <div class="sd-stat">
              <span class="sd-stat-label">评分人数</span>
              <span class="sd-stat-value">{{ stall.ratingUsersCount }}</span>
            </div>
            <div class="sd-stat-sep"></div>
            <div class="sd-stat sd-stat--accent">
              <span class="sd-stat-label">人均</span>
              <span class="sd-stat-value sd-stat-value--accent">¥{{ stall.avgPriceText }}</span>
            </div>
            <div class="sd-stat-sep"></div>
            <div class="sd-stat">
              <span class="sd-stat-label">浏览</span>
              <span class="sd-stat-value">{{ stall.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- .bodymsg：位置 / 营业时间 / 标签（uni-icons 15px + 28rpx 正文，行距 1.7） -->
    <div class="sd-msg-card">
      <div class="sd-dec-row">
        <uni-icons type="location" :size="15" color="#6a5acd" class="sd-dec-icon" />
        <span class="sd-dec-text">{{ stall.locationText }}</span>
      </div>
      <div class="sd-dec-row">
        <uni-icons type="calendar" :size="15" color="#6a5acd" class="sd-dec-icon" />
        <span class="sd-dec-text">{{ stall.timeText }}</span>
      </div>
      <div class="sd-dec-row sd-dec-tags">
        <!-- 源码用 uni-icons type="flag"，图标表里没有，手画一个价签 -->
        <svg class="sd-dec-icon sd-flag" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M13.2 3.6H20v6.8l-9.1 9.1a1.7 1.7 0 0 1-2.4 0l-4.4-4.4a1.7 1.7 0 0 1 0-2.4l9.1-9.1Z"
            stroke="#6a5acd"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
          <circle cx="16.8" cy="7" r="1.3" fill="#6a5acd" />
        </svg>
        <div class="sd-tags">
          <span v-for="tag in stall.tags" :key="tag" class="sd-tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- .data-card.live-card：现场情况（原生 StallLiveStatus，含「查看记录」胶囊） -->
    <div class="sd-live-card">
      <StallLiveStatus :live-status="liveStatus" :show-timeline-action="true" />
    </div>

    <!-- .detail-tabs：介绍 / 菜单 / 评价（评价带条数） -->
    <div class="sd-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="sd-tab"
        :class="{ 'sd-tab--active': activeTab === tab.value }"
      >
        <span>{{ tab.label }}</span>
        <span v-if="tab.value === 'comments'" class="sd-tab-count">{{ stall.commentCount }}</span>
      </div>
    </div>

    <!-- .data-card.detail-panel--comments -->
    <div class="sd-panel">
      <!-- .evaluation-overview：56rpx 大分数 + 5 颗星 + 写评价 -->
      <div class="sd-overview">
        <span class="sd-overview-score">{{ stall.ratingText }}</span>
        <div class="sd-overview-main">
          <div class="sd-overview-stars">
            <uni-icons
              v-for="score in 5"
              :key="score"
              :type="score <= roundedRating ? 'star-filled' : 'star'"
              :size="15"
              :color="score <= roundedRating ? '#ff9500' : '#d9d9d9'"
            />
          </div>
          <span class="sd-overview-copy">{{ stall.ratingUsersCount }}人评分</span>
        </div>
        <div class="sd-overview-write">写评价</div>
      </div>

      <!-- StallCommentSummary 的静态版：全部评价 + 最热/最新 + 3 条留言 + 查看全部 -->
      <div class="sd-comments">
        <div class="sd-comments-head">
          <span class="sd-comments-title">全部评价</span>
          <div class="sd-sort">
            <div class="sd-sort-tab sd-sort-tab--active">最热</div>
            <div class="sd-sort-tab">最新</div>
          </div>
        </div>

        <div class="sd-comment-list">
          <div v-for="comment in comments" :key="comment.id" class="sd-comment">
            <span class="sd-comment-avatar">
              <uni-icons type="person-filled" :size="18" color="#b9b4c4" />
            </span>
            <div class="sd-comment-main">
              <div class="sd-comment-meta">
                <span class="sd-comment-name">{{ comment.author }}</span>
                <span v-if="comment.anonymous" class="sd-comment-badge">匿名</span>
                <span class="sd-comment-time">{{ comment.time }}</span>
              </div>
              <span class="sd-comment-content">{{ comment.content }}</span>
              <div class="sd-comment-counts"><span>{{ comment.likeCount }}赞</span></div>
            </div>
          </div>
        </div>

        <div class="sd-comments-footer">查看全部 {{ stall.commentCount }} 条评价</div>
      </div>
    </div>

    <!-- .sab-bar：评分 / 收藏 / 分享（源码 position: fixed，这里贴画布底边） -->
    <div class="sd-bar">
      <div class="sd-bar-item">
        <span class="sd-bar-icon sd-bar-icon--rate">
          <uni-icons type="star-filled" :size="20" color="#ff9500" />
        </span>
        <span class="sd-bar-label">评分</span>
      </div>
      <div class="sd-bar-item">
        <!-- collectHeart 的 CSS 爱心（未收藏是 #e0e0e0），下面是它的 .headertip -->
        <span class="sd-bar-icon sd-heart-box"><i class="sd-heart"></i></span>
        <span class="sd-bar-label">收藏</span>
      </div>
      <div class="sd-bar-item">
        <span class="sd-bar-icon sd-bar-icon--share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#6a5acd" aria-hidden="true">
            <path d="M21.6 2.7a1 1 0 0 0-1.3-.7L2.8 9.6a1 1 0 0 0 .08 1.9l6.9 1.9 1.9 6.9a1 1 0 0 0 1.9.08L21.6 2.7Z" />
          </svg>
        </span>
        <span class="sd-bar-label">分享</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 小程序 page 底色 $color-bg-page；底部给操作条让位（源码 .bottom-space 260rpx） */
.live-stalldetail {
  padding-bottom: calc(var(--u) * 160);
  background: #f8f8f8;
}

/* ---------- 沉浸式返回（.stall-back / .stall-back__chevron） ---------- */
.sd-back {
  position: absolute;
  top: calc(46px + 8px);
  left: calc(var(--u) * 30);
  z-index: 20;
  display: flex;
  width: calc(var(--u) * 70);
  height: calc(var(--u) * 70);
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
}
.sd-back-chevron {
  width: calc(var(--u) * 22);
  height: calc(var(--u) * 22);
  margin-left: calc(var(--u) * 12);
  border-bottom: calc(var(--u) * 7) solid #ffffff;
  border-left: calc(var(--u) * 7) solid #ffffff;
  border-radius: calc(var(--u) * 3);
  transform: rotate(45deg);
}

/* ---------- .cover-wrap（460rpx） ---------- */
.sd-cover {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(var(--u) * 460);
  background: #f0eaf4;
}
.sd-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- .bodyname / .bodymsg / .data-card 共用卡片壳 ---------- */
.sd-name-card,
.sd-msg-card,
.sd-live-card,
.sd-panel {
  margin: 0 calc(var(--u) * 20) calc(var(--u) * 16);
  padding: calc(var(--u) * 24);
  border-radius: calc(var(--u) * 16);
  background: #ffffff;
}

/* ---------- .bn-row ---------- */
.sd-bn-row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 24);
}
.sd-avatar {
  overflow: hidden;
  width: calc(var(--u) * 150);
  height: calc(var(--u) * 150);
  flex-shrink: 0;
  border: calc(var(--u) * 2) solid #d9d6f5;
  border-radius: calc(var(--u) * 24);
  background: #f5f5f5;
}
.sd-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sd-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: calc(var(--u) * 16);
}
.sd-title-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: calc(var(--u) * 16);
}
.sd-name {
  overflow: hidden;
  max-width: 100%;
  color: #6a5acd;
  font-size: calc(var(--u) * 42);
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-type {
  flex-shrink: 0;
  padding: calc(var(--u) * 8) calc(var(--u) * 24);
  border-radius: 999px;
  background: #f0f0ff;
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
  line-height: 1.3;
}
.sd-stats {
  display: flex;
  align-items: stretch;
}
.sd-stat {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: calc(var(--u) * 8);
  padding: 0 calc(var(--u) * 10);
}
.sd-stat-label {
  overflow: hidden;
  color: #999999;
  font-size: calc(var(--u) * 24);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-stat-value {
  overflow: hidden;
  color: #1a1a1a;
  font-size: calc(var(--u) * 34);
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sd-stat-value--accent {
  color: #f92e05;
}
.sd-stat--accent .sd-stat-label {
  color: #f92e05;
}
.sd-stat-sep {
  width: 1px;
  flex-shrink: 0;
  margin: calc(var(--u) * 4) 0;
  background: #e0e0e0;
}

/* ---------- .dec-row（位置 / 时间 / 标签） ---------- */
.sd-dec-row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  margin-bottom: calc(var(--u) * 18);
}
.sd-dec-row:last-child {
  margin-bottom: 0;
}
.sd-dec-icon {
  flex-shrink: 0;
  line-height: 1;
}
.sd-flag {
  width: 15px;
  height: 15px;
}
.sd-dec-text {
  color: #666666;
  font-size: calc(var(--u) * 28);
  line-height: 1.7;
}
.sd-dec-tags {
  align-items: flex-start;
}
.sd-dec-tags .sd-dec-icon {
  margin-top: calc(var(--u) * 8);
  transform: none;
}
.sd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--u) * 10);
}
/* components/tip/tip.vue */
.sd-tag {
  padding: calc(var(--u) * 6) calc(var(--u) * 14);
  border-radius: calc(var(--u) * 8);
  background: #ffe1de;
  color: #f95731;
  font-size: calc(var(--u) * 24);
  line-height: 1.4;
  white-space: nowrap;
}

/* ---------- .live-card：现场情况 ---------- */
.sd-live-card {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 24);
}
/* 设计台 round3.css 里有一条裸的全局 .live-status{background:#fff;margin-top:9px;padding:14px 18px}，
   会漏进原生组件的根节点（README §6 说的同名规则），这里按源码置零 */
.sd-live-card :deep(.live-status) {
  margin: 0;
  padding: 0;
  background: transparent;
}

/* ---------- .detail-tabs ---------- */
.sd-tabs {
  display: flex;
  align-items: center;
  margin-top: calc(var(--u) * 2);
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  background: #ffffff;
}
.sd-tab {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 24) calc(var(--u) * 12) calc(var(--u) * 22);
  color: #999999;
  font-size: calc(var(--u) * 27);
  text-align: center;
}
.sd-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(var(--u) * 56);
  height: calc(var(--u) * 5);
  border-radius: calc(var(--u) * 4);
  background: transparent;
  transform: translateX(-50%);
}
.sd-tab--active {
  color: #333333;
  font-weight: 600;
}
.sd-tab--active::after {
  background: #6a5acd;
}
.sd-tab-count {
  margin-left: calc(var(--u) * 5);
  color: #999999;
  font-size: calc(var(--u) * 21);
  font-weight: 400;
}

/* ---------- .detail-panel--comments ---------- */
.sd-panel {
  min-height: 0;
}

/* ---------- .evaluation-overview ---------- */
.sd-overview {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 20);
  padding: calc(var(--u) * 8) calc(var(--u) * 4) calc(var(--u) * 26);
  border-bottom: 1px solid #f5f5f5;
}
.sd-overview-score {
  flex-shrink: 0;
  color: #f92e05;
  font-size: calc(var(--u) * 56);
  font-weight: 800;
  line-height: 1;
  letter-spacing: calc(var(--u) * 1);
}
.sd-overview-main {
  flex: 1;
  min-width: 0;
}
.sd-overview-stars {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 4);
}
.sd-overview-copy {
  display: block;
  margin-top: calc(var(--u) * 8);
  color: #999999;
  font-size: calc(var(--u) * 22);
}
.sd-overview-write {
  flex-shrink: 0;
  padding: calc(var(--u) * 14) calc(var(--u) * 30);
  border-radius: 999px;
  background: linear-gradient(135deg, #6a5acd 0%, #7b68ee 100%);
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 14) rgba(106, 90, 205, 0.25);
  color: #ffffff;
  font-size: calc(var(--u) * 24);
  font-weight: 600;
}

/* ---------- .comment-summary（StallCommentSummary 的静态版） ---------- */
.sd-comments {
  display: block;
  margin-top: calc(var(--u) * 24);
}
.sd-comments-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
  margin-bottom: calc(var(--u) * 24);
}
.sd-comments-title {
  position: relative;
  padding-left: calc(var(--u) * 20);
  color: #333333;
  font-size: calc(var(--u) * 30);
  font-weight: 700;
  letter-spacing: calc(var(--u) * 1);
}
.sd-comments-title::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: calc(var(--u) * 8);
  height: calc(var(--u) * 30);
  border-radius: calc(var(--u) * 4);
  background: linear-gradient(180deg, #6a5acd, #7b68ee);
  transform: translateY(-50%);
}
.sd-sort {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
  padding: calc(var(--u) * 5);
  border-radius: 999px;
  background: #f8f8f8;
}
.sd-sort-tab {
  padding: calc(var(--u) * 8) calc(var(--u) * 22);
  border-radius: 999px;
  color: #999999;
  font-size: calc(var(--u) * 22);
  line-height: 1.4;
}
.sd-sort-tab--active {
  background: #ffffff;
  box-shadow: 0 calc(var(--u) * 2) calc(var(--u) * 8) rgba(106, 90, 205, 0.12);
  color: #6a5acd;
  font-weight: 600;
}
.sd-comment-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 18);
}
.sd-comment {
  display: flex;
  align-items: flex-start;
  gap: calc(var(--u) * 16);
  padding: calc(var(--u) * 20);
  border: 1px solid #f5f5f5;
  border-radius: calc(var(--u) * 16);
  background: #f8f8f8;
}
.sd-comment-avatar {
  display: flex;
  width: calc(var(--u) * 68);
  height: calc(var(--u) * 68);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: calc(var(--u) * 2) solid #d9d6f5;
  border-radius: 50%;
  background: #f5f5f5;
}
.sd-comment-main {
  flex: 1;
  min-width: 0;
}
.sd-comment-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: calc(var(--u) * 10);
}
.sd-comment-name {
  color: #666666;
  font-size: calc(var(--u) * 24);
  font-weight: 600;
}
.sd-comment-badge {
  padding: calc(var(--u) * 2) calc(var(--u) * 10);
  border-radius: calc(var(--u) * 4);
  background: #f5f5f5;
  color: #999999;
  font-size: calc(var(--u) * 18);
}
.sd-comment-time {
  color: #b2b2b2;
  font-size: calc(var(--u) * 20);
}
.sd-comment-content {
  display: block;
  margin-top: calc(var(--u) * 10);
  color: #333333;
  font-size: calc(var(--u) * 26);
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}
.sd-comment-counts {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 16);
  margin-top: calc(var(--u) * 12);
  color: #999999;
  font-size: calc(var(--u) * 22);
}
.sd-comments-footer {
  margin-top: calc(var(--u) * 24);
  padding: calc(var(--u) * 18) 0;
  border-top: 1px solid #f5f5f5;
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
  font-weight: 600;
  text-align: center;
}

/* ---------- .sab-bar（评分 / 收藏 / 分享） ---------- */
.sd-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 19;
  display: flex;
  height: calc(var(--u) * 112);
  box-sizing: content-box;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
  box-shadow: 0 calc(var(--u) * -2) calc(var(--u) * 12) rgba(0, 0, 0, 0.06);
}
.sd-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 2);
  padding: calc(var(--u) * 8) calc(var(--u) * 24);
}
.sd-bar-icon {
  display: flex;
  width: calc(var(--u) * 48);
  height: calc(var(--u) * 48);
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.sd-bar-icon--rate {
  background: #fff4e0;
}
.sd-bar-icon--share {
  background: #f0f0ff;
}
.sd-bar-label {
  color: #6a5acd;
  font-size: calc(var(--u) * 22);
  font-weight: 600;
  line-height: 1.4;
}

/* collectHeart.vue 的 .heart-shape：36rpx 方块转 45° + 两个圆 */
.sd-heart-box {
  border-radius: 0;
  background: none;
}
.sd-heart {
  position: relative;
  display: block;
  width: calc(var(--u) * 36);
  height: calc(var(--u) * 36);
  background: #e0e0e0;
  transform: rotate(45deg);
}
.sd-heart::before,
.sd-heart::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: inherit;
}
.sd-heart::before {
  top: -50%;
  left: 0;
}
.sd-heart::after {
  top: 0;
  left: -50%;
}
</style>
