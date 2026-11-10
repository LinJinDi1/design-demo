<script>
export const meta = { id: 'detailstore', label: '店铺详情', note: '点店铺卡进入', group: '首页', tab: '', order: 4 };
</script>

<!--
  现版 · 店铺详情（对应 quick-pick-main/pagesLog/detailstore/detailstore.vue）
  结构（照源码 body 的顺序）：
    封面（门头照 + 弹幕 + “N 人正在探店” + 圆形返回键）
    → 店铺概览白卡（店名 / 线上·线下点餐 / 评分 · 评分人数 · 去评分 / 品类标签
       / 营业时间 / 店铺位置 / 店铺介绍）
    → 本周探店（访客 / 浏览 / 占本周总浏览 + 进度条）
    → 店铺菜单（storeSwiper.vue：42% 画框 + 自定义指示点）
    → 店铺留言（fei-comment 列表，源码默认取前 3 条）
    → 底部固定操作栏（评分 / 收藏 / 分享 / 举报 + 查看位置）。
  所有尺寸照抄源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  数据取线上「老潼关肉夹馍」（商业中心 · 线下点餐），留言取真实两条。
-->
<script setup>
import { liveAsset } from './asset.js';

/*
 * getStoreById() 的字段形状（detailstore.vue onLoad 里的 detailstore 对象），
 * 这一份按线上「老潼关肉夹馍」写死：
 *   storeRating / ratingUsersCount / storeClassificationId / openingTime / closingTime
 *   / locationName / description / onlineCount / isOnline
 */
const store = {
  name: '老潼关肉夹馍',
  isOnline: 0,
  storeRating: 9.3,
  ratingUsersCount: 50,
  classification: '主食',
  openingTime: '08:00:00',
  closingTime: '23:59:00',
  locationName: '天桥附近二楼',
  location: '商业中心 · 天桥附近二楼',
  description: '一口回到潼关。潼关肉夹馍现打现烤，馍酥肉香；凉皮、拌面、红豆粥都是老陕口味，二楼靠窗有座位。',
  onlineCount: 1,
  image: '/assets/source-fidelity/commercial/01-laotongguan.jpg',
};

/* computed displayRating / displayHours / classificationLabel 的输出，源码里来自接口 */
const displayRating = '9.3';
const displayHours = '08:00 – 23:59'; /* favoriteHours() 的格式：start + ' – ' + end */

/* 本周探店：uv / storeHits / visitShare（storeHits ÷ 本周总浏览） */
const activity = { visitors: 41, hits: 132, share: 24.8 };

/*
 * fireData → styledBarrageList：源码是 right: -300rpx 起步的飞入动画，
 * 静态稿里动画被关掉会全部停在画外，所以这里直接给「飞行中」的位置。
 */
const barrages = [
  { content: '味道还可以，以前经常吃', top: 0, right: -18 },
  { content: '肉夹馍 9.9，肉给得实在', top: 80, right: 300 },
];

/*
 * swiperData：店铺上传的菜单 / 点餐图，storeSwiper.vue 负责 42% 画框与指示点。
 * 线上是店铺自己传的菜单照，素材里只有「点餐图 + 门头（含价目表）」这两张。
 */
const menuImages = [
  '/assets/screenshot-crops/order-banner.jpg',
  '/assets/screenshot-crops/laotongguan-storefront.jpg',
];

/* store_comment_list（FeiComment 的 props：avatar / nickName / content / createTime / likeCount） */
const comments = [
  {
    name: 'Yilena',
    avatar: '/assets/reference-screens/ref-friends.jpg',
    text: '很不错的店',
    time: '2025-11-26',
    likes: 1,
    reply: {
      name: 'Yilena',
      avatar: '/assets/reference-screens/ref-friends.jpg',
      text: '确实',
    },
  },
  {
    name: 'メbluefox',
    avatar: '/assets/reference-screens/ref-profile.jpg',
    text: '味道还可以，以前经常吃',
    time: '2025-12-06',
    likes: 0,
  },
];
</script>

<template>
  <div class="live-page live-detailstore">
    <!-- storeImage：460rpx 门头照 + fire-comment 弹幕 + online-indicator -->
    <div class="dt-hero">
      <img class="dt-cover" :src="liveAsset(store.image)" alt="店铺门头" />

      <div class="dt-barrage">
        <span
          v-for="item in barrages"
          :key="item.content"
          class="dt-barrage-item"
          :style="{ top: `calc(var(--u) * ${item.top})`, right: `calc(var(--u) * ${item.right})` }"
          >{{ item.content }}</span
        >
      </div>

      <div class="dt-online">
        <i class="dt-online-dot"></i>
        <span>{{ store.onlineCount }} 人正在探店</span>
      </div>

      <!-- .back：源码 fixed，左侧 28rpx，64rpx 圆形深色底 -->
      <button class="dt-back" aria-label="返回">
        <uni-icons type="left" size="24" color="#fff" />
      </button>
    </div>

    <!-- store-overview：上移 22rpx 盖住封面，白底圆角 -->
    <div class="dt-overview">
      <div class="dt-heading">
        <h1 class="dt-name">{{ store.name }}</h1>
        <span class="dt-order-label">{{ store.isOnline === 1 ? '线上点餐' : '线下点餐' }}</span>
      </div>

      <div class="dt-score-row">
        <span class="dt-score">{{ displayRating }}</span>
        <span class="dt-scale">/ 10</span>
        <span class="dt-reviews">{{ store.ratingUsersCount }} 人评分</span>
        <span class="dt-rate-action">去评分</span>
        <uni-icons type="right" size="12" color="#a59bbd" />
      </div>

      <div class="dt-tag-row"><span class="dt-tag">{{ store.classification }}</span></div>

      <div class="dt-info-row">
        <uni-icons type="calendar" size="17" color="#8b7fba" />
        <span class="dt-info-label">营业时间</span>
        <span class="dt-info-value">{{ displayHours }}</span>
      </div>

      <div class="dt-info-row dt-info-row--location">
        <uni-icons type="location" size="17" color="#8b7fba" />
        <span class="dt-info-label">店铺位置</span>
        <span class="dt-info-value">{{ store.location }}</span>
        <uni-icons type="right" size="13" color="#b4acbf" />
      </div>

      <p class="dt-desc">{{ store.description }}</p>
    </div>

    <!-- store-activity：本周探店 -->
    <section class="dt-card">
      <div class="dt-section-head">
        <span>本周探店</span>
        <span class="dt-caption">看看这家有多受欢迎</span>
      </div>
      <div class="dt-metrics">
        <div class="dt-metric">
          <b class="dt-metric-value">{{ activity.visitors }}</b>
          <span class="dt-metric-label">位访客</span>
        </div>
        <div class="dt-metric">
          <b class="dt-metric-value">{{ activity.hits }}</b>
          <span class="dt-metric-label">次浏览</span>
        </div>
        <div class="dt-metric">
          <b class="dt-metric-value">{{ activity.share }}<i class="dt-metric-unit">%</i></b>
          <span class="dt-metric-label">占本周总浏览</span>
        </div>
      </div>
      <div class="dt-track"><i class="dt-fill" :style="{ width: `${activity.share}%` }"></i></div>
    </section>

    <!-- bodyswiper：店铺菜单（storeSwiper.vue） -->
    <section class="dt-card">
      <div class="dt-section-head">
        <span>店铺菜单</span>
        <span class="dt-caption">点开查看大图</span>
      </div>
      <div class="dt-swiper">
        <img class="dt-swiper-img" :src="liveAsset(menuImages[0])" alt="店铺菜单" />
        <div class="dt-dots">
          <i
            v-for="(image, index) in menuImages"
            :key="image"
            class="dt-dot"
            :class="{ 'dt-dot--on': index === 0 }"
          ></i>
        </div>
      </div>
    </section>

    <!-- comment：店铺留言 -->
    <section class="dt-card dt-comment">
      <div class="dt-comment-head">
        <span>店铺留言</span>
        <span class="dt-comment-count">{{ comments.length }} 条</span>
        <span class="dt-comment-all">
          查看全部<uni-icons type="right" size="12" color="#a49aaf" />
        </span>
      </div>

      <div class="dt-comment-entry">
        <svg class="dt-entry-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12Z"
            stroke="#a49aaf"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
        </svg>
        <span class="dt-placeholder">选一句留言，分享你的感受</span>
        <svg class="dt-entry-icon dt-entry-icon--compose" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20h4L18 10a2.83 2.83 0 0 0-4-4L4 16v4Z"
            stroke="#a49aaf"
            stroke-width="1.7"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="dt-comment-list">
        <article v-for="comment in comments" :key="comment.name" class="dt-comment-item">
          <div class="dt-comment-row">
            <img class="dt-avatar" :src="liveAsset(comment.avatar)" alt="" />
            <div class="dt-comment-main">
              <div class="dt-username">{{ comment.name }}</div>
              <p class="dt-content">{{ comment.text }}</p>
              <div class="dt-comment-actions">
                <span class="dt-time">{{ comment.time }}</span>
                <span class="dt-action">回复</span>
                <span class="dt-action">分享</span>
              </div>
            </div>
            <div class="dt-like">
              <uni-icons type="heart" size="20" color="#a49eae" />
              <span class="dt-like-count">{{ comment.likes || '赞' }}</span>
            </div>
          </div>

          <div v-if="comment.reply" class="dt-replies">
            <div class="dt-reply">
              <img class="dt-reply-avatar" :src="liveAsset(comment.reply.avatar)" alt="" />
              <div class="dt-reply-main">
                <div class="dt-reply-author">{{ comment.reply.name }}</div>
                <p class="dt-reply-text">{{ comment.reply.text }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- header（底部操作栏）：4 个圆形按钮 + 主按钮 -->
    <div class="dt-actionbar">
      <button class="dt-func" aria-label="评分">
        <uni-icons type="star" size="23" color="#756997" />
        <span class="dt-func-label">评分</span>
      </button>
      <button class="dt-func" aria-label="收藏">
        <uni-icons type="heart" size="23" color="#756997" />
        <span class="dt-func-label">收藏</span>
      </button>
      <button class="dt-func" aria-label="分享">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M13.5 4.5 20 9.2l-6.5 4.7v-3.5c-4.6 0-7.6 2.4-8.7 6.1-.6-5.4 2.7-9.1 8.7-9.1V4.5Z"
            stroke="#756997"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
        <span class="dt-func-label">分享</span>
      </button>
      <button class="dt-func" aria-label="举报">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="#756997" stroke-width="1.7" />
          <path
            d="M12 11v5.2M12 7.9h.01"
            stroke="#756997"
            stroke-width="1.9"
            stroke-linecap="round"
          />
        </svg>
        <span class="dt-func-label">举报</span>
      </button>
      <button class="dt-goto">{{ store.isOnline === 1 ? '立即点餐' : '查看位置' }}</button>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 页面根：源码 .page（#f7f6fa），没有 tab 页的底栏留白 ---------- */
.live-detailstore {
  /* 底部只留一点缝：操作栏自己是 sticky，跟着内容滚到底后不会有东西被它压住 */
  padding-bottom: calc(var(--u) * 12);
  background: #f7f6fa;
  color: #34313f;
}

/* ---------- storeImage：封面 460rpx ---------- */
.dt-hero {
  position: relative;
  height: calc(var(--u) * 460);
  overflow: hidden;
  background: #eeebf4;
}
.dt-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* .fire-comment：top 180rpx、高 210rpx 的弹幕带 */
.dt-barrage {
  position: absolute;
  top: calc(var(--u) * 180);
  left: 0;
  width: 100%;
  height: calc(var(--u) * 210);
  overflow: hidden;
  pointer-events: none;
}
.dt-barrage-item {
  position: absolute;
  max-width: calc(var(--u) * 360);
  padding: calc(var(--u) * 8) calc(var(--u) * 18);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: calc(var(--u) * 40);
  background: rgba(54, 44, 71, 0.45);
  color: #fff;
  font-size: calc(var(--u) * 24);
  font-weight: 400;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* .online-indicator：right 26rpx / bottom 44rpx 的深色胶囊 */
.dt-online {
  position: absolute;
  right: calc(var(--u) * 26);
  bottom: calc(var(--u) * 44);
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 10);
  padding: calc(var(--u) * 12) calc(var(--u) * 18);
  border-radius: calc(var(--u) * 30);
  background: rgba(38, 31, 46, 0.5);
  color: #fff;
  font-size: calc(var(--u) * 21);
}
.dt-online-dot {
  width: calc(var(--u) * 10);
  height: calc(var(--u) * 10);
  border-radius: 50%;
  background: #b4a8ff;
}

/* .back：64rpx 圆形，深色半透明 + 1rpx 白描边 */
.dt-back {
  position: absolute;
  top: calc(var(--u) * 40);
  left: calc(var(--u) * 28);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  background: rgba(30, 26, 39, 0.42);
  cursor: pointer;
}

/* ---------- store-overview ---------- */
.dt-overview {
  position: relative;
  z-index: 1;
  margin-top: calc(var(--u) * -22);
  padding: calc(var(--u) * 30) calc(var(--u) * 28) calc(var(--u) * 26);
  border-radius: calc(var(--u) * 28) calc(var(--u) * 28) 0 0;
  background: #fff;
}
.dt-heading {
  display: flex;
  align-items: flex-start;
  gap: calc(var(--u) * 18);
}
.dt-name {
  flex: 1;
  min-width: 0;
  color: #34313f;
  font-size: calc(var(--u) * 36);
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: break-word;
}
.dt-order-label {
  flex-shrink: 0;
  margin-top: calc(var(--u) * 7);
  padding: calc(var(--u) * 6) calc(var(--u) * 12);
  border-radius: calc(var(--u) * 8);
  background: #f4f1fc;
  color: #8c7ab6;
  font-size: calc(var(--u) * 20);
  white-space: nowrap;
}
.dt-score-row {
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 8);
  padding: calc(var(--u) * 14) 0;
}
.dt-score {
  color: #6a5acd;
  font-size: calc(var(--u) * 36);
  font-weight: 600;
  line-height: 1.4;
}
.dt-scale,
.dt-reviews {
  color: #a39aac;
  font-size: calc(var(--u) * 23);
}
.dt-reviews {
  margin-left: calc(var(--u) * 16);
}
.dt-rate-action {
  margin-left: auto;
  color: #8c7ab6;
  font-size: calc(var(--u) * 23);
}
.dt-tag-row {
  display: flex;
  padding-bottom: calc(var(--u) * 18);
}
.dt-tag {
  padding: calc(var(--u) * 5) calc(var(--u) * 14);
  border-radius: calc(var(--u) * 8);
  background: #f7f6fa;
  color: #8e879b;
  font-size: calc(var(--u) * 22);
}
.dt-info-row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  min-height: calc(var(--u) * 68);
  font-size: calc(var(--u) * 24);
}
.dt-info-label {
  flex-shrink: 0;
  color: #8e859c;
}
.dt-info-value {
  flex: 1;
  min-width: 0;
  color: #5d566b;
  line-height: 1.5;
}
.dt-desc {
  margin-top: calc(var(--u) * 18);
  padding-top: calc(var(--u) * 22);
  border-top: 1px solid #f0edf5;
  color: #857c92;
  font-size: calc(var(--u) * 25);
  line-height: 1.7;
}

/* ---------- 白卡：store-activity / bodyswiper / comment ---------- */
.dt-card {
  margin: calc(var(--u) * 18) calc(var(--u) * 24) 0;
  padding: calc(var(--u) * 26);
  border-radius: calc(var(--u) * 22);
  background: #fff;
}
.dt-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
  color: #34313f;
  font-size: calc(var(--u) * 28);
  font-weight: 600;
}
.dt-caption {
  color: #aaa1b6;
  font-size: calc(var(--u) * 21);
  font-weight: 400;
}

/* activity-metrics：三段等分，中间 1rpx 竖线 */
.dt-metrics {
  display: flex;
  padding: calc(var(--u) * 28) 0 calc(var(--u) * 22);
}
.dt-metric {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 8);
}
.dt-metric + .dt-metric {
  border-left: 1px solid #f0edf5;
}
.dt-metric-value {
  color: #63577f;
  font-size: calc(var(--u) * 34);
  font-weight: 600;
  line-height: 1.3;
}
.dt-metric-unit {
  margin-left: calc(var(--u) * 4);
  font-size: calc(var(--u) * 20);
  font-style: normal;
}
.dt-metric-label {
  color: #a49bae;
  font-size: calc(var(--u) * 21);
}
.dt-track {
  height: calc(var(--u) * 6);
  overflow: hidden;
  border-radius: calc(var(--u) * 6);
  background: #f1eef7;
}
.dt-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #9b8bdb;
}

/* storeSwiper.vue：padding-top 42% 的画框 + 底部指示点 */
.dt-swiper {
  position: relative;
  width: 100%;
  margin-top: calc(var(--u) * 22);
  padding-top: 42%;
  overflow: hidden;
  border-radius: calc(var(--u) * 16);
  background: #f8f7fa;
}
.dt-swiper-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: calc(var(--u) * 16);
  object-fit: cover;
}
.dt-dots {
  position: absolute;
  right: 0;
  bottom: calc(var(--u) * 20);
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 12);
}
.dt-dot {
  width: calc(var(--u) * 16);
  height: calc(var(--u) * 8);
  border-radius: calc(var(--u) * 4);
  background: #dcd5eb;
}
.dt-dot--on {
  background: #8b7cc5;
}

/* ---------- comment ---------- */
.dt-comment-head {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  color: #34313f;
  font-size: calc(var(--u) * 28);
  font-weight: 600;
}
.dt-comment-count {
  color: #aaa1b6;
  font-size: calc(var(--u) * 22);
  font-weight: 400;
}
.dt-comment-all {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 4);
  min-height: calc(var(--u) * 64);
  margin-left: auto;
  color: #a49aaf;
  font-size: calc(var(--u) * 21);
  font-weight: 400;
}
.dt-comment-entry {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 14);
  margin: calc(var(--u) * 12) 0 calc(var(--u) * 4);
  padding: calc(var(--u) * 16) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 40);
  background: #f6f4f9;
}
.dt-entry-icon {
  flex-shrink: 0;
  width: 19px;
  height: 19px;
}
.dt-entry-icon--compose {
  width: 18px;
  height: 18px;
}
.dt-placeholder {
  flex: 1;
  color: #a49aaf;
  font-size: calc(var(--u) * 24);
  line-height: calc(var(--u) * 36);
}
.dt-comment-item {
  padding: calc(var(--u) * 26) 0 calc(var(--u) * 22);
}
.dt-comment-item + .dt-comment-item {
  border-top: 1px solid #f3f0f7;
}
.dt-comment-row {
  display: flex;
  align-items: flex-start;
}
.dt-avatar {
  flex-shrink: 0;
  width: calc(var(--u) * 64);
  height: calc(var(--u) * 64);
  margin-right: calc(var(--u) * 18);
  border-radius: 50%;
  background: #f3f1f7;
  object-fit: cover;
}
.dt-comment-main {
  flex: 1;
  min-width: 0;
}
.dt-username {
  min-height: calc(var(--u) * 34);
  margin-bottom: calc(var(--u) * 6);
  color: #81798c;
  font-size: calc(var(--u) * 25);
  font-weight: 500;
  line-height: calc(var(--u) * 34);
}
.dt-content {
  color: #38333f;
  font-size: calc(var(--u) * 28);
  line-height: calc(var(--u) * 42);
  word-break: break-word;
}
.dt-comment-actions {
  display: flex;
  align-items: center;
  column-gap: calc(var(--u) * 16);
  margin-top: calc(var(--u) * 2);
}
.dt-time {
  color: #b0a8b9;
  font-size: calc(var(--u) * 21);
  line-height: calc(var(--u) * 34);
}
.dt-action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--u) * 64);
  color: #958c9f;
  font-size: calc(var(--u) * 22);
  line-height: calc(var(--u) * 32);
}
.dt-like {
  display: flex;
  flex-shrink: 0;
  width: calc(var(--u) * 72);
  min-height: calc(var(--u) * 80);
  margin: calc(var(--u) * 4) calc(var(--u) * -16) 0 calc(var(--u) * 4);
  padding-top: calc(var(--u) * 2);
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 6);
  color: #a49eae;
}
.dt-like-count {
  font-size: calc(var(--u) * 20);
  line-height: calc(var(--u) * 28);
}
.dt-replies {
  margin-left: calc(var(--u) * 82);
  padding-top: calc(var(--u) * 6);
}
.dt-reply {
  display: flex;
  align-items: flex-start;
}
.dt-reply-avatar {
  flex-shrink: 0;
  width: calc(var(--u) * 42);
  height: calc(var(--u) * 42);
  margin-right: calc(var(--u) * 12);
  border-radius: 50%;
  background: #f3f1f7;
  object-fit: cover;
}
.dt-reply-main {
  flex: 1;
  min-width: 0;
}
.dt-reply-author {
  min-height: calc(var(--u) * 30);
  margin-bottom: calc(var(--u) * 2);
  color: #81798c;
  font-size: calc(var(--u) * 23);
  font-weight: 500;
  line-height: calc(var(--u) * 30);
}
.dt-reply-text {
  color: #38333f;
  font-size: calc(var(--u) * 25);
  line-height: calc(var(--u) * 38);
}

/* ---------- header：底部操作栏（源码 fixed，这里用 sticky 贴住手机底边） ---------- */
.dt-actionbar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
  box-sizing: border-box;
  width: 100%;
  padding: calc(var(--u) * 16) calc(var(--u) * 24);
  border-top: 1px solid #eeebf4;
  background: #fff;
}
.dt-func {
  display: flex;
  flex-shrink: 0;
  width: calc(var(--u) * 88);
  min-width: 44px;
  min-height: 44px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 8);
}
.dt-func-label {
  color: #8b8299;
  font-size: calc(var(--u) * 19);
  line-height: 1.4;
}
.dt-goto {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 44px;
  margin-left: calc(var(--u) * 12);
  align-items: center;
  justify-content: center;
  height: calc(var(--u) * 88);
  border-radius: calc(var(--u) * 40);
  background: #6a5acd;
  color: #fff;
  font-size: calc(var(--u) * 28);
  font-weight: 500;
  line-height: 1.4;
}
</style>

<style>
/*
 * 详情页没有底部玻璃胶囊，外壳给底栏留的 78px 内边距要去掉，
 * 否则 sticky 的操作栏会浮在手机底边上方 78px、底下留一条空白。
 * 用 :has(.live-detailstore) 限定只在本场景生效，其它页面不受影响
 * （live.css / mp-base.css / acceptance-fix.css 一行没动）。
 */
.phone:has(.live-detailstore) .phone-content {
  padding-bottom: 0;
}
</style>
