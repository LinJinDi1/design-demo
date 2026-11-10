<script>
export const meta = {
  id: 'ic-room',
  label: '空间详情',
  note: '图书馆空间',
  group: '校园',
  tab: '',
  order: 6,
};
</script>

<!--
  现版 · 空间详情（对应 quick-pick-main/pagesLog/icroom/icroom.vue，640 行）
  入口：ic.vue 的空间卡 / 搜索页 / 收藏页（navigateTo?id=...）
  结构：返回栏（pages.json: 空间详情，导航底色吃全局 #F8F8F8）
        → .gallery 相册 460rpx（swiper + 右下角「1 / 3 · 点击看大图」）
        → .card.introduction（空间名 + 容量徽章 / 楼层·位置 / 简介 / 收藏按钮）
        → .tabs（空间指南 / 同学反馈 / 分享体验，默认停在第 0 个）
        → .card 空间指南（5 行「标签 + 说明」，行间 1rpx #f0f1f6 分隔 + 下方 note / updated）。
  尺寸照抄源码 rpx：1rpx = 0.52px（calc(var(--u) * N)），卡片 24rpx 外边距 / 30rpx 内边距 / 24rpx 圆角。
  刻意简化：loading / error 两个 state 分支，以及「同学反馈」「分享体验」两个 tab（含 van-rate 星级、
  时段条形图、留言列表、textarea 表单）都没画——静态稿只保留默认落地的「空间指南」。
  相册素材只有一张带引言文字的校园截屏（source-fidelity 里没有研讨室实景），照 LiveLibrary 空间卡的办法
  放大裁到画面左上角（树 + 教学楼），避开正中的引言文字。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 与 LiveLibrary 第一张空间卡（space-508）同一份数据，字段对齐 server/library.js 的空间记录 */
const cover = liveAsset('/assets/screenshot-crops/campus-scene.jpg');

const space = {
  name: '研讨室（508）',
  seatCount: 8,
  floorLabel: '5F',
  locationDescription: '黄埔分馆 · 电梯左手第一间',
  description:
    '长桌八座，靠窗一整面落地窗，下午有光，适合小组开题和带电脑的长时间讨论。',
  photos: 3,
  updateTime: '2025-05-12',
};

/* guideFields：源码里 key 直接索引 space，label 是写死的五行 */
const guideFields = [
  {
    key: 'table',
    label: '桌椅与布局',
    value:
      '一张 2.4 米长桌、八个固定座位，两侧各四把软垫靠背椅；靠墙一排插座位，桌下能并排放四台笔记本。',
  },
  {
    key: 'facilities',
    label: '设施与环境',
    value:
      '投影、白板、8 个插座、独立空调。整面落地窗朝西，下午有直射光，靠窗一侧建议拉下遮光帘。',
  },
  {
    key: 'location',
    label: '位置与路线',
    value: '黄埔分馆 5F · 电梯左手第一间，出电梯左转经过新书展台就到。',
  },
  {
    key: 'hours',
    label: '开放时间',
    value: '周一至周日 08:00–22:00，考试周延长到 23:00，节假日以图书馆公告为准。',
  },
  {
    key: 'booking',
    label: '预约与使用须知',
    value:
      '至少 4 人起约，单次最长 2 小时；开始后 15 分钟无人签到会自动释放，离开前请把白板擦干净。',
  },
];
</script>

<template>
  <div class="live-page live-icroom">
    <!-- 原生导航栏（navigationStyle: default，标题取 pages.json；icroom 没设底色，吃全局 #F8F8F8） -->
    <header class="ir-nav">
      <button class="ir-back" type="button" aria-label="返回">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m14.6 5.4-7 6.6 7 6.6"
            stroke="#1a1a1a"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span class="ir-nav-title">空间详情</span>
      <span class="ir-nav-gap"></span>
    </header>

    <!-- .gallery：460rpx 相册 + 右下角计数（swiper 的指示点与左右滑动在静态稿里没有意义） -->
    <div class="ir-gallery">
      <img class="ir-gallery-img" :src="cover" alt="" />
      <span class="ir-photo-counter">1 / {{ space.photos }} · 点击看大图</span>
    </div>

    <!-- .card.introduction -->
    <div class="ir-card">
      <div class="ir-heading">
        <span class="ir-space-name">{{ space.name }}</span>
        <span class="ir-badge">{{ space.seatCount }} 人容量</span>
      </div>
      <div class="ir-location">{{ space.floorLabel }} · {{ space.locationDescription }}</div>
      <div class="ir-description">{{ space.description }}</div>
      <!-- 源码 <button class="secondary">，未收藏态；小程序的 button 默认 line-height 2.5555 -->
      <button class="ir-secondary" type="button">收藏这个空间</button>
    </div>

    <!-- .tabs：默认 tab = 0（空间指南） -->
    <div class="ir-tabs">
      <div class="ir-tab ir-tab--active">空间指南</div>
      <div class="ir-tab">同学反馈</div>
      <div class="ir-tab">分享体验</div>
    </div>

    <!-- tab === 0：空间指南 -->
    <div class="ir-card">
      <div class="ir-section-title">坐下来之前，先了解一下</div>
      <div v-for="item in guideFields" :key="item.key" class="ir-guide-row">
        <div class="ir-label">{{ item.label }}</div>
        <div class="ir-description">{{ item.value }}</div>
      </div>
      <div class="ir-note">空间资料供选位参考；开放安排、实时空位及预约结果以图书馆系统为准。</div>
      <div class="ir-updated">资料更新于 {{ space.updateTime }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .detail-page：min-height 100vh / #f5f6fa / 底部 36rpx + 安全区 */
.live-icroom {
  min-height: 888px;
  padding-bottom: calc(var(--u) * 36);
  background: #f5f6fa;
  color: #303347;
}

/* ---------- 自绘返回栏（原生 navigationBar：居中 17px 标题 + 左侧返回） ---------- */
.ir-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #f8f8f8;
}
.ir-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ir-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}
.ir-nav-gap {
  display: block;
  width: 44px;
}

/* ---------- .gallery（460rpx） ---------- */
.ir-gallery {
  position: relative;
  overflow: hidden;
  height: calc(var(--u) * 460);
  background: #e9ebf3;
}
/* 源码 <image mode="aspectFill">；素材只有一张带引言字的截屏，
   这里用 object-fit: cover + 2.6 倍缩放把左上角那条（树 + 教学楼）裁出来，避开正中的引言文字 */
.ir-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
  transform: scale(2.6);
  transform-origin: left top;
}
.ir-photo-counter {
  position: absolute;
  right: calc(var(--u) * 24);
  bottom: calc(var(--u) * 30);
  padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 24);
  background: #25233799;
  color: #fff;
  font-size: calc(var(--u) * 22);
}

/* ---------- .card：introduction / 空间指南 共用卡片壳 ---------- */
.ir-card {
  margin: calc(var(--u) * 24);
  padding: calc(var(--u) * 30);
  border-radius: calc(var(--u) * 24);
  background: #fff;
}

/* .heading / .space-name / .badge / .location */
.ir-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.ir-space-name {
  overflow-wrap: anywhere;
  font-size: calc(var(--u) * 40);
  font-weight: 700;
}
.ir-badge {
  flex-shrink: 0;
  padding: calc(var(--u) * 8) calc(var(--u) * 14);
  border-radius: calc(var(--u) * 12);
  background: #f2edff;
  color: #7d68bd;
  font-size: calc(var(--u) * 23);
}
.ir-location {
  margin: calc(var(--u) * 16) 0;
  color: #9193a5;
  font-size: calc(var(--u) * 24);
  line-height: 1.8;
}

/* .description：简介与指南行共用（27rpx / 行高 1.9） */
.ir-description {
  overflow-wrap: anywhere;
  font-size: calc(var(--u) * 27);
  line-height: 1.9;
  white-space: pre-wrap;
}

/* .secondary（未收藏态） */
.ir-secondary {
  display: block;
  width: 100%;
  margin-top: calc(var(--u) * 26);
  border-radius: calc(var(--u) * 18);
  background: #eee9fb;
  color: #7760bd;
  font-size: calc(var(--u) * 28);
  line-height: 2.5555;
  text-align: center;
}

/* ---------- .tabs ---------- */
.ir-tabs {
  display: flex;
  margin: 0 calc(var(--u) * 24);
}
.ir-tab {
  flex: 1;
  padding: calc(var(--u) * 24) 0;
  border-bottom: calc(var(--u) * 4) solid transparent;
  color: #9595a8;
  font-size: calc(var(--u) * 28);
  text-align: center;
}
.ir-tab--active {
  border-bottom-color: #8c74cc;
  color: #7e65c4;
  font-weight: 600;
}

/* ---------- .section-title / .guide-row / .label / .note / .updated ---------- */
.ir-section-title {
  font-size: calc(var(--u) * 30);
  font-weight: 600;
}
.ir-guide-row {
  padding: calc(var(--u) * 24) 0;
  border-bottom: 1px solid #f0f1f6;
}
.ir-label {
  margin-bottom: calc(var(--u) * 8);
  color: #8b8da0;
  font-size: calc(var(--u) * 24);
}
.ir-note,
.ir-updated {
  margin-top: calc(var(--u) * 18);
  color: #999cad;
  font-size: calc(var(--u) * 22);
  line-height: 1.8;
}
.ir-updated {
  font-size: calc(var(--u) * 20);
}
</style>
