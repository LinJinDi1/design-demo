<script>
export const meta = { id: 'my-point', label: '我的积分', note: '积分与明细', group: '个人', tab: '', order: 7 };
</script>

<!--
  现版 · 我的积分（对应 quick-pick-main/pageuser/Mypoint/Mypoint.vue，543 行）
  结构：44px 返回栏 → 40vh 渐变头（135° #43cbff → #9708cc，投影 0 10rpx 10rpx grey）
        + uCharts 仪表盘（opts.color[0] = #ffffff：30% 白轨道 + 白色进度环 + 51 根白刻度
          + 中心渐变圆 + 渐隐指针弧 + 圆心「120 / 可用积分」）
        → 我的积分劵列表（左 75% 券面：限时积分劵标签 / 有效期 / 库存进度 / 展开箭头；
          右 25% 积分数 + 立即使用·已使用；券面与积分块之间是虚线接缝 + 切角）
        → 展开后的「积分劵描述」行。
  pages.json 里这页是 navigationStyle: custom，线上没有原生导航栏（源码 .title 是自绘标题行）；
  设计台为了能返回上一页，按本项目约定补一条 44px 返回栏（标题取 navigationBarTitleText「我的积分」），
  源码 .title 那 10vh 的标题行就让给它，渐变里保留同高留白。
  单位：源码混着 vh / rem / px / rpx。1vh 折成 --mp-vh: 8.42px（状态栏以下的画布高度，同 LiveMateDetail）；
  rem 按 webview 默认 16px 基准（0.7rem = 11.2px、0.6rem = 9.6px、0.5rem = 8px）；
  px 原样保留，rpx 一律 calc(var(--u) * N)。页底色 #f5f5f5 来自 App.vue 的全局 page{}。
  静态稿：wallet 固定 120（与「我的」页钱包一致），源码 percent = wallet / ceil(wallet/10)*10 在这里
  正好是 1.00，所以进度环是整圈、30% 白的轨道被完全盖住，51 根刻度也全是实白；
  表盘上 uCharts 那圈 0…100 的 13px 刻度数字没画（白色画在白色进度环上，满进度时只露出半个字），
  van-button / van-progress / qiun-data-charts 都换成等价的原生元素 + 内联 SVG 仪表盘。
-->
<script setup>
/* ---------- 仪表盘：照抄 getServerData() 的算法 + uCharts 的 progress 表盘几何 ---------- */
const wallet = 120; /* getUserInfo() 返回的 user.wallet */
const walletMax = Math.ceil(wallet / 10) * 10; /* 向上取整到以 0 结尾的整数 */
const percent = Number((wallet / walletMax).toFixed(2));

/* opts.extra.gauge：startAngle 0.75π、endAngle 0.25π（270° 表盘，开口朝下）、width 15、
   splitLine 10 × childNumber 5（51 根刻度）；opts.color[0] = #ffffff，所以环、刻度、指针都是白的
   （progress 模式下指针不是针，是一段 width/3 = 5px 的弧，见下）。
   尺寸取自 uCharts drawGaugeDataPoints：radius = min(w, h)/2 - 5 - width/2，innerRadius = radius - width */
const CHART_W = 390; /* .charts-box 是 100vw × 29vh，390 画布下 = 390 × 244 */
const CHART_H = 244;
const START = 135; /* 0.75π */
const SWEEP = 270; /* 0.25π - 0.75π + 2π */
const RING_WIDTH = 15;
const RADIUS = Math.min(CHART_W, CHART_H) / 2 - 5 - RING_WIDTH / 2; /* 109.5 */
const RING_RADIUS = RADIUS - RING_WIDTH; /* 94.5：进度条画在这条半径上 */
const POINTER_RADIUS = RADIUS - RING_WIDTH * 2.5; /* 72：指针弧 */
const DISC_RADIUS = RADIUS - RING_WIDTH * 3; /* 64.5：中心圆形背景 */
const CX = CHART_W / 2;
const CY = CHART_H / 2;

const polar = (deg, radius) => {
  const rad = (deg * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
};
const round = (value) => Number(value.toFixed(2));
const point = (deg, radius) => polar(deg, radius).map(round).join(',');

/* 从 135° 开始顺时针扫 270° * fraction（屏幕坐标里角度变大 = 顺时针） */
const arcPath = (fraction, radius) => {
  const [x1, y1] = polar(START, radius);
  const [x2, y2] = polar(START + SWEEP * fraction, radius);
  const largeArc = SWEEP * fraction > 180 ? 1 : 0;
  return `M${round(x1)} ${round(y1)} A${radius} ${radius} 0 ${largeArc} 1 ${round(x2)} ${round(y2)}`;
};

/* 轨道（白色 30%）+ 进度（白色），都是 15px 粗、圆头 */
const trackPath = arcPath(1, RING_RADIUS);
const progressPath = arcPath(percent, RING_RADIUS);

/* 刻度：splitNumber 10 × childNumber 5 + 1 = 51 根，3px 宽、7.5px 长，
   画在环外侧（radius → radius + 7.5）；已走过的部分白色，剩下的是 30% 白 */
const TICK_COUNT = 51;
const ticks = Array.from({ length: TICK_COUNT }, (_, index) => {
  const deg = START + (SWEEP / (TICK_COUNT - 1)) * index;
  const [x1, y1] = polar(deg, RADIUS);
  const [x2, y2] = polar(deg, RADIUS + 7.5);
  return {
    key: index,
    x1: round(x1),
    y1: round(y1),
    x2: round(x2),
    y2: round(y2),
    opacity: percent > index / TICK_COUNT ? 1 : 0.3,
  };
});

/* 指针不是针：uCharts progress 表盘画的是一段贴着 POINTER_RADIUS 的弧（0.3π = 54°），
   两端渐变淡出，弧的末端再补一个高 4 / 长 4 的小箭头 */
const pointerDeg = START + SWEEP * percent;
const pointerRad = (pointerDeg * Math.PI) / 180;
const pointerNormalX = -Math.sin(pointerRad);
const pointerNormalY = Math.cos(pointerRad);
const pointerPath = `M${point(pointerDeg - 27, POINTER_RADIUS)} A${POINTER_RADIUS} ${POINTER_RADIUS} 0 0 1 ${point(pointerDeg + 27, POINTER_RADIUS)}`;
const pointerBaseX = CX + Math.cos(pointerRad) * (POINTER_RADIUS + 2.5);
const pointerBaseY = CY + Math.sin(pointerRad) * (POINTER_RADIUS + 2.5);
const pointerHead = [
  point(pointerDeg, POINTER_RADIUS + 6.5),
  `${round(pointerBaseX + pointerNormalX * 4)},${round(pointerBaseY + pointerNormalY * 4)}`,
  `${round(pointerBaseX - pointerNormalX * 4)},${round(pointerBaseY - pointerNormalY * 4)}`,
].join(' ');
/* 指针弧的渐变方向：竖直方向 ±0.6r（转正之后就是垂直于指针的那条线） */
const pointerFade = 0.6 * POINTER_RADIUS;
const fadeFrom = { x: round(CX + pointerNormalX * pointerFade), y: round(CY + pointerNormalY * pointerFade) };
const fadeTo = { x: round(CX - pointerNormalX * pointerFade), y: round(CY - pointerNormalY * pointerFade) };

/* ---------- 我的积分劵：getMyOrder() 返回的积分包 ----------
   源码 getownPointPack() 里把 stock 写死 1、stockPercent 写死 1 / 10 * 100，这里照抄 */
const packs = [
  {
    id: 'p1',
    name: '午市套餐积分劵',
    beginTime: '2025-06-01',
    endTime: '2025-06-30',
    integral: 50,
    stock: 1,
    stockPercent: 10,
    hasUse: 0,
    open: false,
    description: '单笔订单满 20 元可用，仅在 11:00–13:30 的午市档口生效，不与其他优惠同享。',
  },
  {
    id: 'p2',
    name: '夏日冰饮积分劵',
    beginTime: '2025-06-05',
    endTime: '2025-07-05',
    integral: 20,
    stock: 1,
    stockPercent: 10,
    hasUse: 0,
    open: true,
    description: '限饮品档口使用，冰饮类商品可用，一次下单只能用一张，过期不补。',
  },
  {
    id: 'p3',
    name: '新人首单积分劵',
    beginTime: '2025-05-01',
    endTime: '2025-05-31',
    integral: 100,
    stock: 1,
    stockPercent: 10,
    hasUse: 1,
    open: false,
    description: '注册后 7 天内有效，全站店铺通用，已使用后不再返还。',
  },
];
</script>

<template>
  <div class="live-page live-mypoint">
    <!-- 返回栏：pages.json 是 custom 导航，设计台按约定画一条 44px 的（标题取 navigationBarTitleText） -->
    <header class="mp-nav live-sticky-head">
      <button class="mp-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="mp-nav-title">我的积分</h1>
    </header>

    <!-- 源码 .header：40vh 渐变底 + 投影；.title(10vh) / .free(1vh) / .header1(29vh) 三段 -->
    <div class="mp-header">
      <div class="mp-gauge">
        <svg class="mp-gauge-svg" viewBox="0 0 390 244" role="img" aria-label="可用积分">
          <defs>
            <!-- 中心圆形背景：series 色 30% → 白色 10% 的竖向渐变 -->
            <linearGradient
              id="mp-gauge-disc"
              gradientUnits="userSpaceOnUse"
              :x1="CX"
              :y1="CY - DISC_RADIUS"
              :x2="CX"
              :y2="CY + DISC_RADIUS"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0.3" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0.1" />
            </linearGradient>
            <!-- 指针弧两端淡出 -->
            <linearGradient
              id="mp-gauge-pointer"
              gradientUnits="userSpaceOnUse"
              :x1="fadeFrom.x"
              :y1="fadeFrom.y"
              :x2="fadeTo.x"
              :y2="fadeTo.y"
            >
              <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="0.5" stop-color="#ffffff" stop-opacity="1" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>

          <circle :cx="CX" :cy="CY" :r="DISC_RADIUS" fill="url(#mp-gauge-disc)" />
          <path
            :d="trackPath"
            fill="none"
            stroke="#ffffff"
            stroke-opacity="0.3"
            :stroke-width="RING_WIDTH"
            stroke-linecap="round"
          />
          <line
            v-for="tick in ticks"
            :key="tick.key"
            :x1="tick.x1"
            :y1="tick.y1"
            :x2="tick.x2"
            :y2="tick.y2"
            stroke="#ffffff"
            :stroke-opacity="tick.opacity"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            :d="progressPath"
            fill="none"
            stroke="#ffffff"
            :stroke-width="RING_WIDTH"
            stroke-linecap="round"
          />
          <path
            :d="pointerPath"
            fill="none"
            stroke="url(#mp-gauge-pointer)"
            stroke-width="5"
            stroke-linecap="round"
          />
          <polygon :points="pointerHead" fill="#ffffff" />
        </svg>
        <div class="mp-gauge-copy">
          <span class="mp-gauge-value">{{ wallet }}</span>
          <span class="mp-gauge-label">可用积分</span>
        </div>
      </div>
    </div>

    <!-- 源码 .body：60vh 内部滚动 + padding-bottom 100rpx，这里改成自然流式，整页截图能看全 -->
    <div class="mp-body">
      <div v-for="item in packs" :key="item.id" class="mp-item">
        <div class="mp-ticket">
          <div class="mp-face">
            <div class="mp-name">{{ item.name }}</div>
            <div class="mp-time">{{ item.beginTime }}--{{ item.endTime }}</div>
            <div class="mp-meta">
              <span class="mp-stock">库存: {{ item.stock }}</span>
              <span class="mp-progress">
                <span class="mp-progress-fill" :style="{ width: item.stockPercent + '%' }"></span>
              </span>
              <button class="mp-expand" type="button" aria-label="积分劵描述">
                <svg
                  class="mp-expand-icon"
                  :class="{ 'mp-expand-icon--open': item.open }"
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

          <div class="mp-point">
            <div class="mp-point-value">{{ item.integral }}</div>
            <div class="mp-point-action">
              <span class="mp-btn" :class="{ 'mp-btn--used': item.hasUse }">
                {{ item.hasUse ? '已使用' : '立即使用' }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="item.open" class="mp-desc">积分劵描述：{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page 是 100vw × 100vh；页底 #f5f5f5 来自 App.vue 里的全局 page{}，不是这一页自己写的 */
.live-mypoint {
  --mp-vh: 8.42px;
  padding: 46px 0 0;
  background: #f5f5f5;
  color: #343434;
}

/* ---------- 返回栏：44px，标题居中，返回键压左边 ---------- */
.mp-nav {
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
.mp-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.mp-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .header：40vh 渐变 + 投影 ---------- */
.mp-header {
  /* 用 padding 而不是子元素 margin，避免外边距穿透把渐变顶下去 */
  padding-top: calc(var(--mp-vh) * 11); /* 源码 .title(10vh) + .free(1vh) 的高度 */
  background: linear-gradient(135deg, #43cbff 0%, #9708cc 100%);
  box-shadow: 0 calc(var(--u) * 10) calc(var(--u) * 10) grey;
}
/* .header1：29vh 的图表区，源码 .charts-box / .header1-1 都是 100% × 100% */
.mp-gauge {
  position: relative;
  width: 100%;
  height: calc(var(--mp-vh) * 29);
}
.mp-gauge-svg {
  display: block;
  width: 100%;
  height: 100%;
}
/* 中心文字：源码 drawRingTitle 把 title 基线放在圆心 +2.5px、subtitle 基线放在圆心 +22.5px */
.mp-gauge-copy {
  position: absolute;
  inset: 0;
  color: #fff;
}
.mp-gauge-value {
  position: absolute;
  top: calc(50% + 2.5px);
  right: 0;
  left: 0;
  font-size: 25px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
  transform: translateY(-100%);
}
.mp-gauge-label {
  position: absolute;
  top: calc(50% + 22.5px);
  right: 0;
  left: 0;
  font-size: 15px;
  line-height: 1;
  text-align: center;
  transform: translateY(-100%);
}

/* ---------- .body / .evePack：列表 ---------- */
.mp-body {
  padding-bottom: calc(var(--u) * 100);
}
.mp-item {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

/* ---------- .pointsPack：96vw × 70px 的券 ---------- */
.mp-ticket {
  display: flex;
  width: 96%;
  height: 70px;
  margin-top: calc(var(--u) * 6);
  border-radius: calc(var(--u) * 6);
}

/* .txt：左 75% 券面，右上角切 7px，与右侧虚线接缝 */
.mp-face {
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
.mp-name {
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
.mp-name::before {
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
.mp-time {
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
.mp-time::before {
  color: #f4d53c;
  content: '有效时间 : ';
}

/* .txt2：库存 + 进度 + 展开箭头 */
.mp-meta {
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
.mp-stock {
  font-weight: 600;
}
/* van-progress：color #ee0a24 / stroke-width 2px / show-pivot=false */
.mp-progress {
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
.mp-progress-fill {
  display: block;
  height: 100%;
  border-radius: 100px;
  background-color: #ee0a24;
}
.mp-expand {
  display: flex;
  height: 100%;
  flex-shrink: 0;
  align-items: flex-start;
  cursor: pointer;
}
/* 源码 static/xiangxia.svg：image 被拉成 100rpx × 70%，mode 默认 scaleToFill，所以是扁的 */
.mp-expand-icon {
  display: block;
  width: calc(var(--u) * 100);
  height: 12.25px;
  transition: transform 0.5s ease;
}
.mp-expand-icon--open {
  transform: rotate(180deg);
}

/* .point：右 25% 积分块，左上角切 7px */
.mp-point {
  box-sizing: border-box;
  width: 25%;
  border-left: 1px dashed #b8b8b8;
  background-color: #fff;
  clip-path: polygon(0 7px, 7px 0, 100% 0, 100% 100%, 0 100%, 0 7px);
}
.mp-point-value {
  display: flex;
  height: 55%;
  align-items: flex-end;
  justify-content: center;
  color: #ee0a24;
  font-size: 24px; /* 1.5rem */
  font-weight: 700;
}
.mp-point-value::after {
  color: #ffcd43;
  content: '积分';
  font-size: 9.6px; /* 0.6rem */
}
.mp-point-action {
  display: flex;
  height: 45%;
  align-items: center;
  justify-content: center;
}
/* van-button size="mini"：24px 高 / 左右 8px / 10px 字；type danger = #ee0a24，
   hasUse 时走 .custom-class → #ffbb00 */
.mp-btn {
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
.mp-btn--used {
  background-color: #ffbb00;
}

/* .dec：展开的积分劵描述 */
.mp-desc {
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
