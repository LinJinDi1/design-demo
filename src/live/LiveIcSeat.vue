<script>
export const meta = {
  id: 'ic-seat',
  label: '座位',
  note: '图书馆座位',
  group: '校园',
  tab: '',
  order: 7,
};
</script>

<!--
  现版 · 座位（对应 quick-pick-main/pagesLog/seat/seat.vue，62 行）
  入口：pages/campus/campus.vue 的座位入口（navigateTo）
  结构只有两段：.seatimage（27vh 白底，居中一张 90vw × 24vh、圆角 40rpx 的座位图）
              → .seatmsg（73vh 白底，里面是 <van-tree-select>：左侧 1/3 分组导航，右侧 2/3 内容区）。
  源码是一张没写完的稿：items 写死成「分组 1 / 分组 2」，content 插槽里是个空 view，
  所以这里也照做——只画分组导航的两行和空白内容区，不自己补座位网格。
  单位：26 行里没有 rpx 尺寸，全是 vh / vw。小程序的 100vh = 屏幕高减去原生导航条，
  设计台上 100vh 会按浏览器窗口（1500×1400）算，所以把 27vh / 73vh / 24vh 换算成
  「888 - 46(状态栏) - 44(导航栏) = 798px」的 27% / 73% / 24%，90vw 写 90%（同 LiveNotice 的 95vw → 95%）。
  van-tree-select 按 Vant 2 的默认样式手写（导航 flex:1 / 内容 flex:2、#f7f8fa 底、条目 padding 14px 12px、
  选中项白底加粗），没有深色的激活色——Vant 2 的导航激活项只改底色和字重。
  座位图沿用源码里写死的 COS 图地址（同一张图，静态稿直接引原地址）；断网时退回灰底占位。
-->
<script setup>
import { ref } from 'vue';

/* 源码 data：activeIndex 0，items 两个写死的分组 */
const activeIndex = 0;
const items = [{ text: '分组 1' }, { text: '分组 2' }];

const seatMapUrl =
  'https://bluefox-web-cos-1319400004.cos.ap-guangzhou.myqcloud.com/images/fdeb6ac0-e139-462b-aa4c-fbe8a575f977.png';
const mapFailed = ref(false);
</script>

<template>
  <div class="live-page live-icseat">
    <!-- 原生导航栏（pages.json: 座位 / 白底） -->
    <header class="is-nav">
      <button class="is-back" type="button" aria-label="返回">
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
      <span class="is-nav-title">座位</span>
      <span class="is-nav-gap"></span>
    </header>

    <!-- .seatimage.flex：27vh 白底，居中 90vw × 24vh 圆角座位图 -->
    <div class="is-hero">
      <img
        v-if="!mapFailed"
        class="is-hero-img"
        :src="seatMapUrl"
        alt=""
        @error="mapFailed = true"
      />
      <span v-else class="is-hero-placeholder">座位图待补充</span>
    </div>

    <!-- .seatmsg：73vh，van-tree-select -->
    <div class="is-select">
      <div class="is-tree">
        <div class="is-tree-nav">
          <div
            v-for="(item, index) in items"
            :key="item.text"
            class="is-tree-nav-item"
            :class="{ 'is-tree-nav-item--active': index === activeIndex }"
          >
            {{ item.text }}
          </div>
        </div>
        <!-- 源码 <template #content> 里是一个空 view，内容区就是空白的 -->
        <div class="is-tree-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 page 是白底、两段各占 27vh / 73vh，正好铺满一屏 */
.live-icseat {
  min-height: 888px;
  padding-bottom: 0;
  background: #fff;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.is-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #fff;
}
.is-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.is-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}
.is-nav-gap {
  display: block;
  width: 44px;
}

/* ---------- .seatimage（100vw × 27vh，flex 居中） ---------- */
.is-hero {
  display: flex;
  height: calc((888px - 90px) * 0.27);
  align-items: center;
  justify-content: center;
  background: #fff;
}
/* .seatimage image：90vw × 24vh + 40rpx 圆角，mode="aspectFill" */
.is-hero-img {
  width: 90%;
  height: calc((888px - 90px) * 0.24);
  border-radius: calc(var(--u) * 40);
  object-fit: cover;
}
.is-hero-placeholder {
  display: flex;
  width: 90%;
  height: calc((888px - 90px) * 0.24);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 40);
  background: #f5f5f5;
  color: #999;
  font-size: calc(var(--u) * 26);
}

/* ---------- .seatmsg（100vw × 73vh）+ van-tree-select ---------- */
.is-select {
  height: calc((888px - 90px) * 0.73);
  background: #fff;
}
.is-tree {
  display: flex;
  height: 100%;
  font-size: 14px;
}
/* .van-tree-select__nav：flex 1、#f7f8fa 底、可滚动 */
.is-tree-nav {
  flex: 1;
  overflow-y: auto;
  background: #f7f8fa;
}
/* .van-tree-select__nav-item：padding 14px 12px，选中项白底 + 字重 500 */
.is-tree-nav-item {
  padding: 14px 12px;
  color: #323233;
  line-height: 20px;
}
.is-tree-nav-item--active {
  background: #fff;
  font-weight: 500;
}
.is-tree-content {
  flex: 2;
  overflow-y: auto;
  background: #fff;
}
</style>
