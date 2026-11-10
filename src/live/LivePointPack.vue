<script>
export const meta = { id: 'point-pack', label: '抢购积分包', note: '积分包列表', group: '个人', tab: '', order: 8 };
</script>

<!--
  现版 · 抢购积分包（对应 quick-pick-main/pageuser/PointPack/PointPack.vue，444 行）
  从「我的积分」页进来（我的积分 → 抢购积分包）。结构：44px 返回栏
        → 积分包列表（96vw × 70px 的券：左 75% 券面 = 限时积分劵标签 / 有效期 / 库存进度 / 展开箭头；
          右 25% = 积分数 + 立即领取·立即使用；券面与积分块之间是虚线接缝 + 切角）
        → 展开后的「积分劵描述」行。
  pages.json 是 navigationStyle: default，原生导航栏标题「抢购积分包」；设计台没有原生栏，
  按本项目约定画 44px 的返回栏。
  单位：源码混着 rem / px / rpx。rem 按 webview 默认 16px 基准（0.7rem = 11.2px、0.6rem = 9.6px、
  0.5rem = 8px、1.5rem = 24px）；px 原样保留，rpx 一律 calc(var(--u) * N)。
  页底色 #f5f5f5 来自 App.vue 的全局 page{}（源码 .page 自己没写底色）。
  静态稿：数据照 getIntegralPackageList / getStockByIntegralPackageId 的形状写成常量
  （stockPercent = stock / 100 * 100 = stock），三张券覆盖「立即领取 / 立即使用 / 已展开描述」三种态；
  领券成功的 uni-popup 倒计时弹层没做，van-button / van-progress 用等价原生元素还原。
-->
<script setup>
/* 源码 getAllpointsPack() + processPointPack()：item.stock 来自库存接口，
   stockPercent = stock / 100 * 100；hadPoint 来自 getownPointPack()（自己已领取且未使用） */
const packs = [
  {
    id: 'pp1',
    name: '午市套餐积分劵',
    beginTime: '2025-06-01',
    endTime: '2025-06-30',
    integral: 50,
    stock: 68,
    stockPercent: 68,
    hadPoint: false,
    open: false,
    description: '单笔订单满 20 元可用，仅限 11:00–13:30 的午市档口，每日限量发放。',
  },
  {
    id: 'pp2',
    name: '夏日冰饮积分劵',
    beginTime: '2025-06-05',
    endTime: '2025-07-05',
    integral: 20,
    stock: 24,
    stockPercent: 24,
    hadPoint: true,
    open: false,
    description: '限饮品档口使用，冰饮类商品可用，一次下单只能用一张。',
  },
  {
    id: 'pp3',
    name: '新人首单积分劵',
    beginTime: '2025-05-01',
    endTime: '2025-05-31',
    integral: 100,
    stock: 12,
    stockPercent: 12,
    hadPoint: false,
    open: true,
    description: '注册后 7 天内有效，全站店铺通用，每单限用一张，过期不补。',
  },
];
</script>

<template>
  <div class="live-page live-pointpack">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 抢购积分包） -->
    <header class="pp-nav live-sticky-head">
      <button class="pp-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="pp-nav-title">抢购积分包</h1>
    </header>

    <!-- 源码 .page：列表 + 底部 100rpx 留白（60vh 内部滚动改成自然流式，整页截图能看全） -->
    <div class="pp-list">
      <div v-for="item in packs" :key="item.id" class="pp-item">
        <div class="pp-ticket">
          <div class="pp-face">
            <div class="pp-name">{{ item.name }}</div>
            <div class="pp-time">{{ item.beginTime }}--{{ item.endTime }}</div>
            <div class="pp-meta">
              <span class="pp-stock">库存: {{ item.stock }}</span>
              <span class="pp-progress">
                <span class="pp-progress-fill" :style="{ width: item.stockPercent + '%' }"></span>
              </span>
              <button class="pp-expand" type="button" aria-label="积分劵描述">
                <svg
                  class="pp-expand-icon"
                  :class="{ 'pp-expand-icon--open': item.open }"
                  viewBox="0 0 1026 1024"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    fill="#666663"
                    d="M857.088 224.256q28.672-28.672 69.12-28.672t69.12 28.672q29.696 28.672 29.696 68.608t-29.696 68.608l-382.976 380.928q-12.288 14.336-30.72 19.968t-38.912 4.608-40.448-8.704-34.304-22.016l-376.832-374.784q-29.696-28.672-29.696-68.608t29.696-68.608q14.336-14.336 32.256-21.504t36.864-7.168 37.376 7.168 32.768 21.504l313.344 309.248z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="pp-point">
            <div class="pp-point-value">{{ item.integral }}</div>
            <div class="pp-point-action">
              <span class="pp-btn" :class="{ 'pp-btn--own': item.hadPoint }">
                {{ item.hadPoint ? '立即使用' : '立即领取' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="item.open" class="pp-desc">积分劵描述：{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page 是 100vw × 100vh + padding-bottom 100rpx；页底 #f5f5f5 来自 App.vue 的全局 page{} */
.live-pointpack {
  padding: 46px 0 calc(var(--u) * 100);
  background: #f5f5f5;
  color: #343434;
}

/* ---------- 返回栏：44px，标题居中，返回键压左边 ---------- */
.pp-nav {
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
.pp-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.pp-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

.pp-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

/* ---------- .pointsPack：96vw × 70px 的券 ---------- */
.pp-ticket {
  display: flex;
  width: 96%;
  height: 70px;
  margin-top: calc(var(--u) * 6);
  border-radius: calc(var(--u) * 6);
}

/* .txt：左 75% 券面，右上角切 7px，与右侧虚线接缝 */
.pp-face {
  box-sizing: border-box;
  width: 75%;
  border-right: 1px dashed #b8b8b8;
  background-color: #fff;
  clip-path: polygon(
    0 0,
    calc(100% - 7px) 0,
    100% 7px,
    100% 100%,
    0 100%,
    0 0
  );
}

/* .txt1：50% 高，限时积分劵标签 + 券名 */
.pp-name {
  display: flex;
  width: 100%;
  height: 50%;
  align-items: center;
  box-sizing: border-box;
  padding-left: calc(var(--u) * 20);
  color: #343434;
  font-size: 11.2px; /* 0.7rem */
  font-weight: 900;
}
.pp-name::before {
  margin-right: calc(var(--u) * 10);
  padding: calc(var(--u) * 5) calc(var(--u) * 10);
  border-top-right-radius: calc(var(--u) * 20);
  border-bottom-left-radius: calc(var(--u) * 20);
  background-color: #ee0a24;
  color: #f8f8f8;
  content: '限时积分劵';
  font-size: 11.2px; /* 0.7rem */
  line-height: 1.2;
}

/* .txt3：有效时间 */
.pp-time {
  width: 100%;
  height: 25%;
  box-sizing: border-box;
  padding-left: calc(var(--u) * 20);
  overflow: hidden;
  color: #717171;
  font-size: 8px; /* 0.5rem */
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pp-time::before {
  color: #f4d53c;
  content: '有效时间 : ';
}

/* .txt2：库存 + 进度 + 展开箭头 */
.pp-meta {
  display: flex;
  width: 80%;
  height: 25%;
  box-sizing: border-box;
  align-items: flex-start;
  padding-left: calc(var(--u) * 20);
  overflow: hidden;
  color: #717171;
  font-size: 8px; /* 0.5rem */
  font-weight: 500;
  white-space: nowrap;
}
.pp-stock {
  font-weight: 600;
}
/* van-progress：color #ee0a24 / stroke-width 2px / show-pivot=false */
.pp-progress {
  display: block;
  width: 50%;
  height: 2px;
  flex-shrink: 0;
  margin-top: calc(var(--u) * 10);
  margin-left: calc(var(--u) * 15);
  overflow: hidden;
  border-radius: 100px;
  background-color: #ebeef5;
}
.pp-progress-fill {
  display: block;
  height: 100%;
  border-radius: 100px;
  background-color: #ee0a24;
}
.pp-expand {
  display: flex;
  height: 100%;
  flex-shrink: 0;
  align-items: flex-start;
  cursor: pointer;
}
/* 源码 static/xiangxia.svg：image 被拉成 100rpx × 70%，mode 默认 scaleToFill，所以是扁的 */
.pp-expand-icon {
  display: block;
  width: calc(var(--u) * 100);
  height: 12.25px;
  transition: transform 0.5s ease;
}
.pp-expand-icon--open {
  transform: rotate(180deg);
}

/* .point：右 25% 积分块，左上角切 7px */
.pp-point {
  box-sizing: border-box;
  width: 25%;
  border-left: 1px dashed #b8b8b8;
  background-color: #fff;
  clip-path: polygon(0 7px, 7px 0, 100% 0, 100% 100%, 0 100%, 0 7px);
}
.pp-point-value {
  display: flex;
  height: 55%;
  align-items: flex-end;
  justify-content: center;
  color: #ee0a24;
  font-size: 24px; /* 1.5rem */
  font-weight: 700;
}
.pp-point-value::after {
  color: #ffcd43;
  content: '积分';
  font-size: 9.6px; /* 0.6rem */
}
.pp-point-action {
  display: flex;
  height: 45%;
  align-items: center;
  justify-content: center;
}
/* van-button size="mini"：24px 高 / 左右 8px / 10px 字；type danger = #ee0a24，
   已领取未使用时走 .custom-class → #ffbb00 */
.pp-btn {
  display: inline-flex;
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 2px;
  background-color: #ee0a24;
  color: #fff;
  font-size: 10px;
  line-height: 1;
}
.pp-btn--own {
  background-color: #ffbb00;
}

/* .dec：展开的积分劵描述 */
.pp-desc {
  display: flex;
  width: 96%;
  box-sizing: border-box;
  padding-bottom: calc(var(--u) * 10);
  padding-left: calc(var(--u) * 10);
  background-color: #f5f5f5;
  color: #a9a9a9;
  font-size: 9.6px; /* 0.6rem */
  font-weight: 500;
}
</style>
