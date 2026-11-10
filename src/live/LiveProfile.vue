<script>
export const meta = { id: 'profile', label: '我的', note: '资料 + 工具 + 服务', group: '个人', tab: 'profile', order: 1 };
</script>

<!--
  现版 · 我的（对应 quick-pick-main/pages/logs/logs.vue）
  结构：身份区（头像 / 昵称 / 编辑资料）→ QuickID + 复制 + 用龄 → 简介 → 四个统计
        → 我的收藏卡片 → 我的工具（头像商城 / 签到 / 我的积分钱包）→ 校园服务宫格（2 列 × 3 行）。
  所有尺寸照抄小程序源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；
  uni-icons 的 size 在小程序里是 px，这里直接保留 px，并换成同形状内联 SVG。
  静态稿：用户资料写成常量，只保留页面本体，源码里的评分 / 收藏弹层（Markshow / Collectshow）没做。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 用户资料：字段对齐 getProfileOverview() 的 user（name / quickUserId / useTime / briefIntroduction ...） */
const user = {
  name: '一树山茶',
  avatar: '/assets/reference-screens/ref-profile.jpg',
  quickUserId: 'QUICK36328162_011407',
  useTime: 1,
  briefIntroduction: '卧槽+32',
  wallet: 120,
};

/* 四个统计：关注 / 粉丝 / 评分 / 收藏，数值来自 overview.user 与 overview.marks / collections */
const stats = [
  { label: '关注', value: 23 },
  { label: '粉丝', value: 5 },
  { label: '评分', value: 14 },
  { label: '收藏', value: 13 },
];
</script>

<template>
  <div class="live-page live-profile">
    <header class="profile-header">
      <div class="profile-identity">
        <div class="profile-avatar-wrap">
          <img class="profile-avatar" :src="liveAsset(user.avatar)" alt="" />
        </div>
        <div class="profile-identity-copy">
          <div class="profile-name">{{ user.name }}</div>
          <div class="profile-edit">
            编辑个人资料
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 5 7 7-7 7" stroke="#6a5acd" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div class="profile-id-row">
        <div class="profile-id">
          <span class="profile-id-value">{{ user.quickUserId }}</span>
          <span class="profile-id-action">复制</span>
        </div>
        <span class="profile-age">用龄 {{ user.useTime }} 年</span>
      </div>

      <div class="profile-bio">{{ user.briefIntroduction }}</div>

      <div class="profile-stats">
        <div v-for="stat in stats" :key="stat.label" class="profile-stat">
          <span class="profile-stat-value">{{ stat.value }}</span>
          <span class="profile-stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </header>

    <div class="profile-content">
      <!-- 我的收藏卡片：星标 + 店铺 · IC 空间 + 右箭头 -->
      <div class="profile-collection">
        <div class="profile-collection-icon">
          <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 3.2 2.6 5.6 6.1.85-4.5 4.2 1.1 6.05L12 16.9l-5.3 3 1.1-6.05-4.5-4.2 6.1-.85L12 3.2Z" fill="#c28b36" />
          </svg>
        </div>
        <div class="profile-collection-copy">
          <div class="profile-card-title">我的收藏</div>
          <div class="profile-card-note">店铺 · IC 空间</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 5 7 7-7 7" stroke="#aaa7bd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <!-- 我的工具：源码 toolList（头像商城 shop #668ca8 / 签到 calendar #6f987e）+ 我的积分钱包 -->
      <section class="profile-section">
        <div class="profile-section-title">我的工具</div>
        <div class="profile-tools">
          <div class="profile-tool">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3.6 9.4h16.8" stroke="#668ca8" stroke-width="1.6" stroke-linecap="round" />
              <path d="M5.6 9.4 7 4.4h10l1.4 5" stroke="#668ca8" stroke-width="1.6" stroke-linejoin="round" />
              <path d="M5.8 9.4v9.4a1.4 1.4 0 0 0 1.4 1.4h9.6a1.4 1.4 0 0 0 1.4-1.4V9.4" stroke="#668ca8" stroke-width="1.6" stroke-linejoin="round" />
              <path d="M9.9 20.2v-4.7a1.3 1.3 0 0 1 1.3-1.3h1.6a1.3 1.3 0 0 1 1.3 1.3v4.7" stroke="#668ca8" stroke-width="1.6" stroke-linejoin="round" />
            </svg>
            <span class="profile-tool-name">头像商城</span>
          </div>
          <div class="profile-tool">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3.6" y="5.4" width="16.8" height="15.2" rx="2.6" stroke="#6f987e" stroke-width="1.6" />
              <path d="M3.6 10.2h16.8M8.4 3.2v4.4M15.6 3.2v4.4" stroke="#6f987e" stroke-width="1.6" stroke-linecap="round" />
              <path d="M8.1 13.6h2.1M13.9 13.6h2.1M8.1 17h2.1M13.9 17h2.1" stroke="#6f987e" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            <span class="profile-tool-name">签到</span>
          </div>
          <div class="profile-tool">
            <span class="profile-wallet">{{ user.wallet }}<span class="profile-wallet-unit">分</span></span>
            <span class="profile-tool-name">我的积分</span>
          </div>
        </div>
      </section>

      <!-- 校园服务：源码 serviceList 的 6 项（反馈 / 通知 / 联系我们 / 地图 / 关于我们 / 设置），图标统一 #737181 -->
      <section class="profile-section">
        <div class="profile-section-title">校园服务</div>
        <div class="profile-services">
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7l-4.2 3.1v-3.1H6.4A2.4 2.4 0 0 1 4 13.6V6.4A2.4 2.4 0 0 1 6.4 4Z" stroke="#737181" stroke-width="1.7" stroke-linejoin="round" />
            </svg>
            <span>反馈</span>
          </div>
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z" stroke="#737181" stroke-width="1.7" stroke-linejoin="round" />
              <path d="M10.1 18.1a2 2 0 0 0 3.8 0" stroke="#737181" stroke-width="1.7" stroke-linecap="round" />
            </svg>
            <span>通知</span>
          </div>
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.8 15v-2.8a7.2 7.2 0 0 1 14.4 0V15" stroke="#737181" stroke-width="1.7" stroke-linecap="round" />
              <rect x="2.6" y="13.4" width="4.2" height="6.8" rx="2.1" stroke="#737181" stroke-width="1.7" />
              <rect x="17.2" y="13.4" width="4.2" height="6.8" rx="2.1" stroke="#737181" stroke-width="1.7" />
            </svg>
            <span>联系我们</span>
          </div>
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9.4 3.8 3.6 6.2v14l5.8-2.4 5.2 2.4 5.8-2.4v-14L14.6 6.2 9.4 3.8Z" stroke="#737181" stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9.4 3.8v14M14.6 6.2v14" stroke="#737181" stroke-width="1.7" />
            </svg>
            <span>地图</span>
          </div>
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.6" stroke="#737181" stroke-width="1.7" />
              <path d="M12 11v5.6" stroke="#737181" stroke-width="1.7" stroke-linecap="round" />
              <circle cx="12" cy="7.9" r="1.15" fill="#737181" />
            </svg>
            <span>关于我们</span>
          </div>
          <div class="profile-service">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m12 2.6 1.8 2.2 2.8-.8.6 2.8 2.8 1-1.2 2.6 1.7 2.3-2.3 1.8.1 2.9-2.9.4-1.6 2.4-2.4-1.5-2.4 1.5-1.6-2.4-2.9-.4.1-2.9-2.3-1.8 1.7-2.3L3.8 7.8l2.8-1 .6-2.8 2.8.8L12 2.6Z" stroke="#737181" stroke-width="1.6" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="3.3" stroke="#737181" stroke-width="1.6" />
            </svg>
            <span>设置</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .profile-page 的底色 #f7f7f9 / 字体 / 字色 #282632，底色和字体由 .live-page 兜住，只补字色 */
.live-profile {
  color: #282632;
}
.profile-header {
  padding: 0 calc(var(--u) * 36) calc(var(--u) * 28);
  background: #f2f2f4;
}
.profile-identity {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 24);
  padding-top: calc(var(--u) * 32);
}
.profile-avatar-wrap {
  display: flex;
  flex-shrink: 0;
  width: calc(var(--u) * 116);
  height: calc(var(--u) * 116);
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border: calc(var(--u) * 4) solid rgba(255, 255, 255, 0.8);
  border-radius: calc(var(--u) * 36);
  background: #e7e7ea;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.profile-identity-copy {
  flex: 1;
  min-width: 0;
}
.profile-name {
  overflow: hidden;
  font-size: calc(var(--u) * 38);
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-edit {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--u) * 6);
  margin-top: calc(var(--u) * 10);
  padding: calc(var(--u) * 8) 0;
  color: var(--live-primary);
  font-size: calc(var(--u) * 23);
}
.profile-id-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
  margin-top: calc(var(--u) * 28);
}
.profile-id {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: calc(var(--u) * 12);
  color: #9391a4;
  font-size: calc(var(--u) * 21);
}
.profile-id-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-id-action {
  flex-shrink: 0;
  color: #6a5acd;
}
.profile-age {
  flex-shrink: 0;
  color: #9391a4;
  font-size: calc(var(--u) * 21);
}
.profile-bio {
  margin-top: calc(var(--u) * 24);
  color: #6f6c78;
  font-size: calc(var(--u) * 26);
  line-height: 1.6;
  overflow-wrap: break-word;
}
.profile-stats {
  display: grid;
  margin-top: calc(var(--u) * 28);
  padding: calc(var(--u) * 22) 0 calc(var(--u) * 4);
  border-top: 1px solid rgba(106, 90, 205, 0.1);
  grid-template-columns: repeat(4, 1fr);
}
.profile-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 10);
}
.profile-stat-value {
  font-size: calc(var(--u) * 38);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.profile-stat-label {
  color: #878395;
  font-size: calc(var(--u) * 24);
}
.profile-content {
  padding: calc(var(--u) * 22) calc(var(--u) * 28) calc(var(--u) * 40);
}
.profile-collection {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 24);
  padding: calc(var(--u) * 30);
  border-radius: calc(var(--u) * 22);
  background: #fff;
}
.profile-collection-icon {
  display: flex;
  flex-shrink: 0;
  width: calc(var(--u) * 86);
  height: calc(var(--u) * 86);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 24);
  background: #f0edff;
}
.profile-collection-copy {
  flex: 1;
  min-width: 0;
}
.profile-card-title {
  font-size: calc(var(--u) * 30);
  font-weight: 500;
}
.profile-card-note {
  margin-top: calc(var(--u) * 10);
  color: #9893a5;
  font-size: calc(var(--u) * 23);
}
.profile-section {
  margin-top: calc(var(--u) * 34);
}
.profile-section-title {
  margin: 0 calc(var(--u) * 6) calc(var(--u) * 20);
  font-size: calc(var(--u) * 28);
  font-weight: 500;
}
.profile-tools {
  display: grid;
  border-radius: calc(var(--u) * 22);
  background: #fff;
  grid-template-columns: repeat(3, 1fr);
}
.profile-tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--u) * 20);
  padding: calc(var(--u) * 32) 0;
}
.profile-tool-name {
  color: #555160;
  font-size: calc(var(--u) * 25);
}
.profile-wallet {
  height: calc(var(--u) * 52);
  color: var(--live-primary);
  font-size: calc(var(--u) * 40);
  font-weight: 600;
  line-height: calc(var(--u) * 52);
}
.profile-wallet-unit {
  margin-left: calc(var(--u) * 8);
  font-size: calc(var(--u) * 20);
  font-weight: 400;
}
.profile-services {
  display: grid;
  padding: calc(var(--u) * 10) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 22);
  background: #fff;
  gap: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.profile-service {
  display: flex;
  min-width: 0;
  min-height: calc(var(--u) * 96);
  align-items: center;
  gap: calc(var(--u) * 18);
  padding: calc(var(--u) * 22) calc(var(--u) * 16);
  color: #5d5767;
  font-size: calc(var(--u) * 25);
}
.profile-service:nth-child(odd) {
  border-right: 1px solid #f1eff5;
}
.profile-service:nth-child(n + 3) {
  border-top: 1px solid #f1eff5;
}
</style>
