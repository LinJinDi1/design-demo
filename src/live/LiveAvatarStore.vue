<script>
export const meta = { id: 'avatar-store', label: '头像商城', note: '头像包', group: '个人', tab: '', order: 9 };
</script>

<!--
  现版 · 头像商城（对应 quick-pick-main/pagesLog/avastore/avastore.vue，207 行）
  从「我的 · 我的工具」里的「头像商城」进来。结构：44px 返回栏 → 头像一个包一行
  （95vw 卡片 = 左 35vw 头像 + 底盘 / 中 45vw「↟分类名↡ + ¥花费积分 + 我想拥有👉」/ 右 15vw 已拥有·未购买印章）。
  pages.json 是 navigationStyle: default，原生导航栏标题「头像商城」；设计台没有原生栏，
  按本项目约定画 44px 的返回栏。
  单位：源码混着 vw / rem / px / rpx。vw 按 390 画布折成 px（35vw = 136.5px、45vw = 175.5px、
  15vw = 58.5px，源码就是这三个 vw 相加正好铺满 95vw 的卡片内容宽）；rem 按 webview 默认 16px 基准
  （0.8rem = 12.8px、0.9rem = 14.4px）；rpx 走 calc(var(--u) * N)。卡片本体是白底（源码 .page #ffffff）。
  静态稿：线上头像图来自 getByStoreZone_2() 接口，这里用 emoji + 渐变圆替代圆形头像，
  底盘（static/底盘.png）用 CSS 椭圆还原；已拥有 / 未购买（static/已拥有.svg 红 / 未购买.svg 灰）
  用旋转的印章文字近似；点卡进头像详情（detailava）不接。
-->
<script setup>
/* 字段对齐 avastore 里的 avalist[i]：avacategory.name / avacategory.pay，
   owned 对应源码 ownAvaId.includes(String(item.avacategory.id)) */
const avatars = [
  { id: 'a1', name: '国宝熊猫', pay: 200, emoji: '🐼', bg: 'linear-gradient(145deg, #f2f6ff, #dfe8f8)', owned: true },
  { id: 'a2', name: '校园柴犬', pay: 150, emoji: '🐶', bg: 'linear-gradient(145deg, #fff7ea, #f4e3c9)', owned: false },
  { id: 'a3', name: '奶油小猫', pay: 120, emoji: '🐱', bg: 'linear-gradient(145deg, #fdf2f7, #f3dfea)', owned: false },
  { id: 'a4', name: '星空狐狸', pay: 300, emoji: '🦊', bg: 'linear-gradient(145deg, #fdf4ea, #f2dfca)', owned: true },
  { id: 'a5', name: '软萌兔兔', pay: 180, emoji: '🐰', bg: 'linear-gradient(145deg, #f4fbf6, #dfefe4)', owned: false },
];
</script>

<template>
  <div class="live-page live-avastore">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 头像商城） -->
    <header class="as-nav live-sticky-head">
      <button class="as-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="as-nav-title">头像商城</h1>
    </header>

    <!-- 源码 .page：白底 + 头像包列表（.evebag 每行 margin-bottom 5rpx） -->
    <div class="as-list">
      <div v-for="item in avatars" :key="item.id" class="as-row">
        <div class="as-card">
          <!-- .eveimage：35vw 头像列 -->
          <div class="as-avatar-col">
            <div class="as-avatar-holder">
              <!-- 线上是 <image> 150rpx 圆形头像，静态稿用渐变圆 + emoji 代替 -->
              <span class="as-avatar" :style="{ background: item.bg }">{{ item.emoji }}</span>
            </div>
            <div class="as-base">
              <!-- .evedipan image：宽 70%、高 20rpx 的底盘 -->
              <span class="as-base-plate"></span>
            </div>
          </div>

          <!-- .evemsg：45vw 文案列 -->
          <div class="as-msg">
            <div class="as-msg-gap"></div>
            <div class="as-category">↟{{ item.name }}↡</div>
            <div class="as-price">
              <span class="as-price-label">¥花费积分：</span>
              <span class="as-price-value">{{ item.pay }}</span>
            </div>
            <div class="as-want">我想拥有👉</div>
          </div>

          <!-- .evestatus：15vw 印章列，已拥有红 / 未购买灰 -->
          <div class="as-status">
            <span class="as-stamp" :class="item.owned ? 'as-stamp--own' : 'as-stamp--no'">
              {{ item.owned ? '已拥有' : '未购买' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page：白底、100vh 内部滚动；这里改成自然流式让整页截图能看全 */
.live-avastore {
  padding: 46px 0 0;
  background-color: #fff;
  color: #333;
}

/* ---------- 返回栏：44px，标题居中，返回键压左边 ---------- */
.as-nav {
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
.as-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.as-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .evebag：每行 100vw、水平居中、margin-bottom 5rpx ---------- */
.as-row {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: calc(var(--u) * 5);
}

/* .evebag1：95vw + 5rpx 浅灰描边 + 15rpx 圆角 + 底部 10rpx 留白。
   源码没写 box-sizing（默认 content-box），这里照原样，宽度才对得上 95vw 内容宽 */
.as-card {
  display: flex;
  box-sizing: content-box;
  width: 95%;
  padding-bottom: calc(var(--u) * 10);
  border: calc(var(--u) * 5) solid #f9f9f9;
  border-radius: calc(var(--u) * 15);
}

/* .eveimage：35vw（390 画布 = 136.5px），里面是头像 + 底盘上下两段 */
.as-avatar-col {
  width: 136.5px;
}
.as-avatar-holder {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
}
/* 源码 .eveava image：150rpx × 150rpx、圆角 150rpx */
.as-avatar {
  display: flex;
  width: calc(var(--u) * 150);
  height: calc(var(--u) * 150);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 150);
  font-size: 38px;
  line-height: 1;
}
/* .evedipan：100% 宽 × 20rpx 高，image 占 70% × 100% */
.as-base {
  display: flex;
  width: 100%;
  height: calc(var(--u) * 20);
  align-items: center;
  justify-content: center;
}
.as-base-plate {
  display: block;
  width: 70%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 35%, #e9e7f2 0%, #cfccdd 55%, #efeef4 100%);
}

/* .evemsg：45vw（175.5px） */
.as-msg {
  width: 175.5px;
}
/* 源码里第一行是 <view style="width:100%; height:30rpx"> 占位 */
.as-msg-gap {
  width: 100%;
  height: calc(var(--u) * 30);
}
/* .evemsg1：45rpx 高、加粗、衬线体、品牌紫 #6a5acd；字号按页面默认 16px */
.as-category {
  width: 100%;
  height: calc(var(--u) * 45);
  overflow: hidden;
  color: #6a5acd;
  font-family: Cambria, Cochin, Georgia, 'Times New Roman', serif;
  font-size: 16px;
  font-weight: bolder;
  white-space: nowrap;
}
/* .evemsg2：0.8rem 加粗 + 内联的两段着色（标签 #f3571a、数值 #fcc423 / 0.9rem） */
.as-price {
  color: #7d7d7d;
  font-size: 12.8px;
  font-weight: bolder;
}
.as-price-label {
  display: inline-block;
  color: #f3571a;
}
.as-price-value {
  display: inline-block;
  color: #fcc423;
  font-size: 14.4px;
}
/* .evemsg3：70rpx 高、青色 #31a1b2、0.8rem */
.as-want {
  display: flex;
  height: calc(var(--u) * 70);
  align-items: center;
  color: #31a1b2;
  font-size: 12.8px;
}

/* .evestatus：15vw（58.5px）× 170rpx（88.4px），印章贴顶 */
.as-status {
  display: flex;
  width: 58.5px;
  height: calc(var(--u) * 170);
  justify-content: center;
}
/* 源码是 static/已拥有.svg（#fd0b0c）/ static/未购买.svg（#999999 + #e0e0e0）两张 15vw 见方的印章图，
   这里用旋转的方形印章文字近似；44px 旋转 18° 后外框 ≈ 55px，仍在 15vw（58.5px）的列宽里 */
.as-stamp {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 2px solid currentColor;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1.1;
  transform: rotate(-18deg);
}
.as-stamp--own {
  color: #fd0b0c;
}
.as-stamp--no {
  color: #999999;
  background-color: rgba(224, 224, 224, 0.45);
}
</style>
