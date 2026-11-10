<script>
export const meta = { id: 'dialywork', label: '签到', note: '每日签到', group: '个人', tab: '', order: 4 };
</script>

<!--
  现版 · 签到（对应 quick-pick-main/pagesLog/dialywork/dialywork.vue）
  结构：原生导航栏（44px 返回 + 签到）→ 每日签到卡（图标 + 标题 + 已签到/未签到状态 + 进度条 + 积分）
        → uni-calendar 日历 → 当前信息区。
  dialywork 是从「我的 · 我的工具」navigateTo 进来的二级页：没有 tabBar，只有原生导航栏
  （pages.json: navigationBarTitleText = 签到），自己画一条 44px 吸顶栏。
  所有尺寸照抄源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）；
  日历里的 px 值（50px 头部、45px 星期行、100rpx 日格、14px 字号…）来自
  uni_modules/uni-calendar 组件自带的样式，按原值照抄。
  静态稿：签到状态固定在签到成功之后（percent=100、积分 1/1）；日历按当前月份算，
  今天那一格带源码 info.selected 里的「已打卡」打点；当前信息区保持源码初始的占位态（没点日期）。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 源码 data：nowperent（0 / 100）与 score（0 / 1），签到成功与「今天已经签到」都会变成 100 / 1 */
const percent = 100;
const score = 1;

/* ---------- 日历：照 uni-calendar 的 _getWeek 生成 42 个格子 ---------- */
const pad = (value) => String(value).padStart(2, '0');
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();

/* 当月 1 号是周几（0 = 周日）；当月天数 */
const firstWeekday = new Date(year, month - 1, 1).getDay();
const daysInMonth = new Date(year, month, 0).getDate();

const cells = [];
/* 上个月末尾几天（源码 _getLastMonthDays，disable = true） */
for (let i = firstWeekday; i > 0; i -= 1) {
  cells.push({ date: new Date(year, month - 1, -i + 1).getDate(), disabled: true, today: false });
}
/* 本月（源码 _currentMonthDys：isDay = 是不是今天，打点来自 selected） */
for (let i = 1; i <= daysInMonth; i += 1) {
  cells.push({ date: i, disabled: false, today: i === day });
}
/* 下个月开始几天，补满 42 格（源码 _getNextMonthDays，同样 disable = true） */
const surplus = 42 - cells.length;
for (let i = 1; i <= surplus; i += 1) {
  cells.push({ date: i, disabled: true, today: false });
}

const weeks = [];
for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

/* i18n 里的星期文案：SUN / MON / … → 日 / 一 / … */
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const monthLabel = `${year} / ${pad(month)}`;
</script>

<template>
  <div class="live-page live-checkin">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 签到） -->
    <header class="ci-nav live-sticky-head">
      <button class="ci-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="ci-nav-title">签到</h1>
    </header>

    <div class="ci-sign-in-section">
      <div class="ci-sign-in-card">
        <div class="ci-sign-in-header">
          <div class="ci-sign-in-icon-box">
            <!-- 源码 static/dakaqiandao.png，这里用同一套产品图标 -->
            <img class="ci-sign-in-icon" :src="liveAsset('/assets/product-icons/checkin.png')" alt="" />
            <span class="ci-sign-in-text">每日签到</span>
          </div>
          <div class="ci-sign-in-status-box">
            <div class="ci-sign-in-btn" :class="percent ? 'ci-signed' : 'ci-unsigned'">
              {{ percent ? '已签到' : '未签到' }}
            </div>
          </div>
        </div>
        <div class="ci-progress-container">
          <div class="ci-progress-bar-box">
            <!-- 源码 <progress percent activeColor="#6a5acd" stroke-width="3" border-radius="10">：
                 3px 是 uni-app 的 stroke-width 原值，轨道色沿用 progress 默认的 #ebeef5 -->
            <div class="ci-progress">
              <div class="ci-progress-fill" :style="{ width: percent + '%' }"></div>
            </div>
          </div>
          <div class="ci-score-text">积分：{{ score }}/1</div>
        </div>
      </div>
    </div>

    <!-- uni-calendar（insert 模式内嵌，show-month="false"）：头部 + 星期行 + 6 行日期 -->
    <div class="ci-calendar-section">
      <div class="ci-calendar">
        <div class="ci-calendar-header">
          <div class="ci-calendar-nav"><i class="ci-chev ci-chev--left"></i></div>
          <span class="ci-calendar-title">{{ monthLabel }}</span>
          <div class="ci-calendar-nav"><i class="ci-chev ci-chev--right"></i></div>
          <span class="ci-calendar-today">今日</span>
        </div>

        <div class="ci-calendar-weekdays">
          <div v-for="label in weekdays" :key="label" class="ci-calendar-weekday">{{ label }}</div>
        </div>

        <div v-for="(row, rowIndex) in weeks" :key="rowIndex" class="ci-calendar-row">
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="ci-calendar-cell"
            :class="{
              'ci-calendar-cell--disabled': cell.disabled,
              'ci-calendar-cell--today': cell.today,
            }"
          >
            <div class="ci-calendar-box">
              <span class="ci-calendar-day">{{ cell.date }}</span>
              <span v-if="cell.today" class="ci-calendar-mark">已打卡</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ci-date-message-section">
      <div class="ci-date-message-placeholder">点击可查看详细信息</div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .page：源码 padding 20rpx（二级页没有底栏，底部就留 20rpx） ---------- */
.live-checkin {
  min-height: 888px;
  padding: 46px calc(var(--u) * 20) calc(var(--u) * 20);
  background-color: #f5f5f5;
  color: #333;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.ci-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  /* 根节点有 20rpx 横向内边距，导航栏要铺满整屏，所以负回去 */
  margin: 0 calc(var(--u) * -20);
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.ci-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.ci-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .sign-in-section / .sign-in-card ---------- */
.ci-sign-in-section {
  padding: calc(var(--u) * 20) 0;
}
.ci-sign-in-card {
  padding: calc(var(--u) * 30);
  border-radius: calc(var(--u) * 15);
  background-color: #fff;
}
.ci-sign-in-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ci-sign-in-icon-box {
  display: flex;
  align-items: center;
}
.ci-sign-in-icon {
  width: calc(var(--u) * 60);
  height: calc(var(--u) * 60);
  margin-right: calc(var(--u) * 15);
}
.ci-sign-in-text {
  color: #333;
  font-size: calc(var(--u) * 32);
  font-weight: bold;
}
.ci-sign-in-btn {
  min-width: calc(var(--u) * 120);
  padding: calc(var(--u) * 8) calc(var(--u) * 16);
  border-radius: calc(var(--u) * 20);
  font-size: calc(var(--u) * 24);
  text-align: center;
}
.ci-signed {
  background-color: #e0f7e9;
  color: #4caf50;
}
.ci-unsigned {
  background-color: #fcebeb;
  color: #f44336;
}

/* ---------- .progress-container ---------- */
.ci-progress-container {
  display: flex;
  align-items: center;
  margin-top: calc(var(--u) * 20);
}
.ci-progress-bar-box {
  flex-grow: 1;
}
.ci-progress {
  height: 3px;
  overflow: hidden;
  border-radius: 10px;
  background-color: #ebeef5;
}
.ci-progress-fill {
  height: 100%;
  border-radius: 10px;
  background-color: #6a5acd;
}
.ci-score-text {
  margin-left: calc(var(--u) * 20);
  color: #999;
  font-size: calc(var(--u) * 24);
}

/* ---------- .calendar-section + uni-calendar 默认样式 ---------- */
.ci-calendar-section {
  margin-top: calc(var(--u) * 20);
}
.ci-calendar {
  background-color: #fff;
}
.ci-calendar-header {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ededed;
}
.ci-calendar-nav {
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
}
.ci-chev {
  width: 10px;
  height: 10px;
  border-top: 2px solid #555555;
  border-left: 2px solid #808080;
}
.ci-chev--left {
  transform: rotate(-45deg);
}
.ci-chev--right {
  transform: rotate(135deg);
}
.ci-calendar-title {
  width: 100px;
  color: #333;
  font-size: 14px;
  text-align: center;
}
.ci-calendar-today {
  position: absolute;
  top: calc(var(--u) * 25);
  right: 0;
  height: 25px;
  padding: 0 5px 0 10px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  background-color: #f1f1f1;
  color: #333;
  font-size: 12px;
  line-height: 25px;
}
.ci-calendar-weekdays {
  display: flex;
}
.ci-calendar-weekday {
  display: flex;
  height: 45px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}
.ci-calendar-row {
  display: flex;
}
.ci-calendar-cell {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ci-calendar-cell--disabled {
  background-color: rgba(249, 249, 249, 0.3);
}
.ci-calendar-box {
  display: flex;
  width: calc(var(--u) * 100);
  height: calc(var(--u) * 100);
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ci-calendar-day {
  color: #333;
  font-size: 14px;
}
.ci-calendar-cell--disabled .ci-calendar-day {
  color: #c0c0c0;
}
/* 源码 uni-calendar 的 --isDay：$uni-primary(#2979ff) 底 + 白字，整格铺满 */
.ci-calendar-cell--today {
  background-color: #2979ff;
  opacity: 0.8;
}
.ci-calendar-cell--today .ci-calendar-day {
  color: #fff;
}
/* 打点文字：源码是 --extra 的 #e43d33，压在蓝底上读不清，这里换成半透明白 */
.ci-calendar-mark {
  color: rgba(255, 255, 255, 0.92);
  font-size: 12px;
}

/* ---------- .date-message-section ---------- */
.ci-date-message-section {
  margin-top: calc(var(--u) * 20);
  padding: calc(var(--u) * 30);
  border-radius: calc(var(--u) * 15);
  background-color: #fff;
}
.ci-date-message-placeholder {
  padding: calc(var(--u) * 50) 0;
  color: #999;
  font-size: calc(var(--u) * 28);
  text-align: center;
}
</style>
