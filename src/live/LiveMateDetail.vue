<script>
export const meta = { id: 'mate-detail', label: '用户主页', note: '好友 / 粉丝资料页', group: '社交', tab: '', order: 3 };
</script>

<!--
  现版 · 用户主页（对应 quick-pick-main/pageuser/MateDetail/MateDetail.vue）
  结构：上半屏渐变 + 建筑插画（35vh）→ 悬浮返回圆钮 → 白色圆角资料板（top:-5vh / 60vh）
        → 头像 + 昵称 + 性别符号 + 关注/粉丝 + 个性签名 + 用龄 + 收藏数（带右箭头）+ 评分数
        → 底部固定渐变条「+关注」。
  源码这一屏的单位混着 vh / rem / px（不是 rpx）：1vh 这里折算成 --md-vh（(888-46)/100 = 8.42px，
  即状态栏以下的画布高度百分比），0.8rem 按 webview 默认 16px 基准写 12.8px，px 原样保留。
  静态稿只做「未关注」态（源码 isfollow = 0 → 按钮是「+关注」），关注/取消关注弹窗和 toast 没做。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 资料字段对齐 getApp().globalData.MateDetail：id / name / sex / followedAvatar /
   follow / fan / briefIntroduction / useTime / collectNumber / markNumber */
const mate = {
  name: 'Yilena',
  sex: '女',
  followedAvatar: '/assets/panda.svg',
  follow: 23,
  fan: 5,
  briefIntroduction: '保持热爱',
  useTime: 2,
  collectNumber: 13,
  markNumber: 14,
};

/* 源码 getISfollow() 的返回值：0 = 未关注（按钮「+关注」），1 = 已关注（按钮「取消关注」） */
const isfollow = 0;
</script>

<template>
  <div class="live-page live-mate">
    <!-- 源码 .bg：35vh 渐变底 + 建筑插画（image 宽度 100%、高度是 image 组件默认的 240px，靠底对齐） -->
    <div class="md-bg">
      <div class="md-back">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m16.6 3.4-8.2 8.6 8.2 8.6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <svg class="md-building" viewBox="0 0 1228 1024" preserveAspectRatio="none" aria-hidden="true">
        <path d="M24.192148 292.916988a26.880164 26.880164 0 0 0-16.896103 6.144037c-3.840023 4.608028-6.912042 9.984061-6.912043 16.128099v678.148139c0 12.288075 10.752066 22.272136 23.808146 22.272136h324.865982c5.376033 0 11.52007-2.304014 16.128099-6.144038 4.608028-4.608028 6.912042-9.984061 6.912042-16.128098v-678.148139c0-12.288075-10.752066-22.272136-23.040141-22.272136H24.192148z" fill="#AEC9FF" />
        <path d="M1185.415235 1015.071796c5.376033 0 11.52007-2.304014 16.128099-6.144038 4.608028-4.608028 6.912042-9.984061 6.912042-16.128098v-678.14814c0-6.144038-2.304014-11.52007-6.912042-16.128098a26.419361 26.419361 0 0 0-16.128099-6.144037h-324.865983a26.880164 26.880164 0 0 0-16.896103 6.144037c-3.840023 4.608028-6.912042 9.984061-6.912042 16.128098v678.14814c0 12.288075 10.752066 22.272136 23.808145 22.272136h324.865983z" fill="#1870FD" />
        <path d="M606.877304 18.432113v529.155229h89.088544v86.78453h-89.088544V691.204219h89.088544v86.784529h-89.088544v237.313449h161.280984c6.144038 0 11.52007-2.304014 16.128099-6.144038a27.648169 27.648169 0 0 0 6.912042-16.896103V41.472253a23.040141 23.040141 0 0 0-23.040141-23.04014h-161.280984z" fill="#AEC9FF" />
        <path d="M441.909897 18.432113c-13.05608 0-23.040141 9.984061-23.04014 23.04014v950.789803c0 13.05608 10.752066 23.040141 23.04014 23.040141h165.121008v-237.313449h-92.928567V691.204219h92.928567v-56.832347h-92.928567V547.587342h92.928567V18.432113h-165.121008z" fill="#1870FD" />
      </svg>
    </div>

    <!-- 源码 .body：top -5vh、高 60vh、上圆角 30px、白→浅蓝渐变 + 外发光 -->
    <div class="md-body">
      <div class="md-user">
        <img class="md-avatar" :src="liveAsset(mate.followedAvatar)" alt="" />
        <div class="md-name">{{ mate.name }}</div>
        <div class="md-sex" :class="mate.sex === '男' ? 'is-male' : 'is-female'">
          {{ mate.sex === '男' ? '♂' : '♀' }}
        </div>
      </div>

      <div class="md-info">
        <div class="md-stats">关注 : {{ mate.follow }} | 粉丝 : {{ mate.fan }}</div>
        <div class="md-sign">
          <span class="md-sign-label">个性签名：</span>
          <span class="md-sign-text">{{ mate.briefIntroduction || '暂无描述' }}</span>
        </div>
        <div class="md-line md-age">
          <span>用龄：{{ mate.useTime }} 年</span>
        </div>
        <div class="md-line md-collect">
          <span>收藏数：{{ mate.collectNumber }}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m9.4 4.6 7.2 7.4-7.2 7.4" stroke="#8b8b8b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="md-line md-mark">
          <span>评分数：{{ mate.markNumber }}</span>
        </div>
      </div>
    </div>

    <!-- 源码 .footer：贴底 10vh 渐变条 + 90% 宽的胶囊按钮 -->
    <div class="md-footer">
      <button class="md-follow-btn">{{ isfollow === 0 ? '+关注' : '取消关注' }}</button>
    </div>
  </div>
</template>

<style scoped>
/* 源码用 100vw × 100vh 铺满一屏：画布 888px，状态栏占 46px，所以 1vh = 8.42px。
   源码 .page 的 100vh 是「状态栏以下的视口」，这里把整页钉成 888px（画布高度）来对齐 */
.live-mate {
  --md-vh: 8.42px;
  position: relative;
  box-sizing: border-box;
  height: 888px;
  padding-bottom: 0;
  overflow: hidden;
  background: #fff;
  color: #292633;
}

/* ---------- 上半屏：源码 .bg ---------- */
.live-mate .md-bg {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--md-vh) * 35);
  align-items: flex-end;
  overflow: hidden;
  background: linear-gradient(to bottom, #e9f2ff 0%, #f6faff 50%, #e9f2ff 100%);
}
.live-mate .md-building {
  display: block;
  width: 100%;
  height: 240px;
}

/* 源码 .back：left 5vw / top 8vw（屏宽 390 → 19.5px / 31.2px；不能用 vw，浏览器视口比画布宽），
   70rpx 的黑色半透明圆 + 白色箭头 */
.live-mate .md-back {
  position: absolute;
  top: 31.2px;
  left: 19.5px;
  z-index: 2;
  display: flex;
  width: calc(var(--u) * 70);
  height: calc(var(--u) * 70);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 70);
  background: rgba(0, 0, 0, 0.5);
}

/* ---------- 资料板：源码 .body ---------- */
.live-mate .md-body {
  position: relative;
  top: calc(var(--md-vh) * -5);
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--md-vh) * 60);
  padding-top: 30px;
  border-radius: 30px 30px 0 0;
  background: linear-gradient(to top, #d3f2fd 0%, #ffffff 100%);
  box-shadow: 0 0 10px #999ca4;
}

/* ---------- 头像行：源码 .usermsg（高 10vh、padding-left 30px） ---------- */
.live-mate .md-user {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: calc(var(--md-vh) * 10);
  align-items: center;
  padding-left: 30px;
}
.live-mate .md-avatar {
  box-sizing: border-box;
  width: calc(var(--md-vh) * 10);
  height: calc(var(--md-vh) * 10);
  flex-shrink: 0;
  border: calc(var(--u) * 3) solid #787c83;
  border-radius: calc(var(--md-vh) * 5);
  background: #f3f1f8;
  object-fit: cover;
}
.live-mate .md-name {
  display: flex;
  height: calc(var(--md-vh) * 10);
  align-items: center;
  margin-left: 15px;
  font-family: Cambria, Cochin, Georgia, 'Times New Roman', serif;
  font-weight: 800;
}
.live-mate .md-sex {
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: 5px;
  font-size: 12.8px;
}
.live-mate .md-sex.is-male {
  color: #2467c7;
}
.live-mate .md-sex.is-female {
  color: #f65684;
}

/* ---------- 资料区：源码 .usermsg1（margin-top 15px、padding-left 30px） ---------- */
.live-mate .md-info {
  box-sizing: border-box;
  margin-top: 15px;
  padding-left: 30px;
}
.live-mate .md-stats {
  color: #9ca1aa;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 12.8px;
  font-weight: 700;
}
.live-mate .md-sign {
  display: flex;
  margin-top: 10px;
  color: #7b7f86;
  font-size: 12.8px;
}
.live-mate .md-sign-label {
  color: #1870fd;
  font-weight: 800;
}
.live-mate .md-sign-text {
  color: #1870fd;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-weight: 600;
}
.live-mate .md-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-right: 30px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 12.8px;
  font-weight: 600;
}

/* ---------- 底部关注条：源码 .footer / .footer_btn ---------- */
.live-mate .md-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: calc(var(--md-vh) * 10);
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #d3f2fd 0%, #e1f6fe 100%);
}
.live-mate .md-follow-btn {
  width: 90%;
  height: 46px;
  border: 0;
  border-radius: calc(var(--md-vh) * 5);
  background: rgba(40, 121, 254, 0.7);
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  line-height: 46px;
  text-align: center;
}
</style>
