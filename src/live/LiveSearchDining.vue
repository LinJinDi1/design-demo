<script>
export const meta = {
  id: 'searchdining',
  label: '饭堂',
  note: '每日菜谱',
  group: '校园觅食',
  tab: 'discover',
  order: 3,
};
</script>

<!--
  现版 · 饭堂（校园觅食 tab 的第三格）
  对应 quick-pick-main/pagesLog/searchdining/searchdining.vue（28 行，只负责传参）
        + components/DiningBrowser/DiningBrowser.vue（kind="canteen"，每日菜谱的真正渲染者）
        + components/StoreCanteen + components/CanteenCard（老的「周几 + 菜名 ¥价」列表，样式同源）
  结构：吸顶头部（校园觅食 + 副标题 + 搜索框 + 三个 tab，饭堂高亮）
        → 饭堂行（菊苑饭堂⌄ + 「按楼层查找」）→ 楼层 chips（带「菜谱 / 菜谱·店铺 / 店铺」角标）
        → 每日菜谱 / 楼层店铺切换 → 周一到周五（周几 + 日期，今天高亮）
        → 「周X菜谱 + N 道菜」→ 菜单来源 → 双列菜名/价格卡 → 菜谱说明。
  尺寸照抄源码 rpx：1rpx = 0.52px。日期按真实当天算（同 DiningBrowser 的 weekDate()）。
  刻意简化：楼层/分类下拉、下拉刷新、上拉加载（静态稿只铺一屏半），店铺模式不单独画。
-->
<script setup>
import { computed } from 'vue';

const tabs = [
  { key: 'stall', label: '桥苑小摊' },
  { key: 'business', label: '商业中心' },
  { key: 'canteen', label: '饭堂' },
];
const activeTab = 'canteen';

/* parents[0]：饭堂名 + venue-hint */
const canteenName = '菊苑饭堂';
const venueHint = '按楼层查找';

/* getCanteenFloors()：contentMode 决定这层是「菜谱 / 菜谱·店铺 / 店铺」 */
const floors = [
  { id: 'f1', name: '菊苑一楼', mode: 'MIXED', label: '一楼', modeLabel: '菜谱·店铺' },
  { id: 'f2', name: '菊苑二楼', mode: 'STORES', label: '二楼', modeLabel: '店铺' },
  { id: 'f3', name: '菊苑三楼', mode: 'STORES', label: '三楼', modeLabel: '店铺' },
];
const activeFloor = 'f1';

/* 今天落在周一到周五 → 选中今天，否则退回周一（同 DiningBrowser 的 weekday 初始化） */
const today = new Date();
const todayIndex = ((today.getDay() || 7) - 1) % 7;
const activeWeekday = todayIndex >= 0 && todayIndex <= 4 ? todayIndex + 1 : 1;

const weekdays = ['周一', '周二', '周三', '周四', '周五'];
const weekDates = weekdays.map((_, index) => {
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - todayIndex + index,
  );
  return `${date.getMonth() + 1}/${date.getDate()}`;
});
const monthDay = (index) => {
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - todayIndex + index,
  );
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/* getDiningMenu()：这一层这一天的菜，14 道（和 V5 的「14 道今日菜」同一个量级） */
const dishes = [
  { id: 'd1', name: '香辣大虾', price: 6.5 },
  { id: 'd2', name: '干锅鸭腿', price: 7.5 },
  { id: 'd3', name: '紫苏炒滑鸡', price: 6 },
  { id: 'd4', name: '麻婆豆腐', price: 3.5 },
  { id: 'd5', name: '鱼香茄子', price: 3.5 },
  { id: 'd6', name: '豆干肉丝', price: 4.5 },
  { id: 'd7', name: '青瓜拌猪展', price: 7 },
  { id: 'd8', name: '椒盐鸡丁', price: 6 },
  { id: 'd9', name: '干煸辣子鸡', price: 6 },
  { id: 'd10', name: '蒜泥茄子', price: 3.5 },
  { id: 'd11', name: '香菇鸡', price: 5 },
  { id: 'd12', name: '酱汁鸡', price: 6.5 },
  { id: 'd13', name: '蒜香口水鸡', price: 5 },
  { id: 'd14', name: '鱼片滑蛋', price: 6.5 },
];

/* DiningBrowser.price()：保留必要小数 */
const priceText = (value) =>
  value == null ? '—' : Number(value).toFixed(2).replace(/\.?0+$/, '');

const weekdayLabel = computed(() => weekdays[activeWeekday - 1]);
const menuSource = computed(
  () =>
    `菊苑食堂一楼大众班每周菜谱（${monthDay(0)}~${monthDay(4)}） · 更新于 ${weekDates[0]}`,
);
</script>

<template>
  <div class="live-page live-searchdining">
    <!-- list.vue 的吸顶头部：标题 / 副标题 / 搜索 / 三 tab（文案与源码逐字一致） -->
    <header class="dn-head live-sticky-head">
      <div class="tab-section-header">
        <div class="dn-title tab-section-title">校园觅食</div>
        <div class="tab-section-subtitle">先选地方，再慢慢挑</div>
      </div>

      <div class="dn-search tab-search-entry">
        <svg class="dn-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.4" stroke="#a39bad" stroke-width="1.9" />
          <path d="m15.6 15.6 4.6 4.6" stroke="#a39bad" stroke-width="1.9" stroke-linecap="round" />
        </svg>
        <span>搜店铺、小摊或饭堂</span>
      </div>

      <div class="dn-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="dn-tab"
          :class="{ active: tab.key === activeTab }"
        >
          {{ tab.label }}
        </div>
      </div>
    </header>

    <!-- DiningBrowser：筛选区（饭堂版：饭堂名 + 楼层 chip + 菜谱/店铺切换 + 周几） -->
    <div class="dn-filters">
      <div class="dn-venue">
        <div class="dn-venue-pick">
          <span class="dn-venue-name">{{ canteenName }}</span>
          <span class="dn-chevron"></span>
        </div>
        <span class="dn-venue-hint">{{ venueHint }}</span>
      </div>

      <div class="dn-filter-line">
        <span class="dn-filter-label">楼层</span>
        <div class="dn-filter-scroll">
          <div class="dn-chips">
            <div
              v-for="floor in floors"
              :key="floor.id"
              class="dn-chip"
              :class="{ active: activeFloor === floor.id }"
            >
              <span>{{ floor.label }}</span>
              <span class="dn-floor-mode">{{ floor.modeLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- isMixed（一楼是大食代）才有这两个选项 -->
      <div class="dn-switch">
        <div class="dn-switch-option dn-switch-option--selected">每日菜谱</div>
        <div class="dn-switch-option">楼层店铺</div>
      </div>

      <div class="dn-week">
        <div
          v-for="(label, index) in weekdays"
          :key="label"
          class="dn-day"
          :class="{ active: activeWeekday === index + 1 }"
        >
          <span class="dn-day-name">{{ label }}</span>
          <span class="dn-day-date">{{ weekDates[index] }}</span>
        </div>
      </div>
    </div>

    <!-- .dining-scroll：每日菜谱 -->
    <div class="dn-menu">
      <div class="dn-menu-head">
        <span>{{ weekdayLabel }}菜谱</span>
        <span class="dn-menu-count">{{ dishes.length }} 道菜</span>
      </div>
      <div class="dn-menu-source">{{ menuSource }}</div>

      <div class="dn-menu-grid">
        <div v-for="dish in dishes" :key="dish.id" class="dn-dish">
          <span class="dn-dish-name">{{ dish.name }}</span>
          <span class="dn-dish-price">
            <span class="dn-currency">¥</span>{{ priceText(dish.price) }}
          </span>
        </div>
      </div>

      <div class="dn-menu-note">菜谱来自饭堂最近上传的菜单，实际供应以现场为准</div>
    </div>
  </div>
</template>

<style scoped>
.live-searchdining {
  background: #f6f7fa;
}

/* ---------- 吸顶头部（和 LiveList 的 list-header 同一套数字） ---------- */
.dn-head {
  padding-top: calc(var(--u) * 4);
  background: #ffffff;
}
.dn-title {
  min-height: 32px;
}
.live-searchdining .dn-search {
  height: calc(var(--u) * 78);
  margin: 0 calc(var(--u) * 28);
  border: 1px solid #eeebf3;
  border-radius: calc(var(--u) * 18);
  background: #f8f7fa;
}
.dn-search-icon {
  flex-shrink: 0;
  width: calc(var(--u) * 30);
  height: calc(var(--u) * 30);
}
.dn-tabs {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--u) * 28);
  margin-top: calc(var(--u) * 18);
  padding: 0 calc(var(--u) * 28);
}
.dn-tab {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 22) 0;
  color: #aaa4b5;
  font-size: calc(var(--u) * 30);
  text-align: center;
}
.dn-tab.active {
  color: #7153bf;
  font-weight: 600;
}
.dn-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(var(--u) * 38);
  height: calc(var(--u) * 5);
  margin-left: calc(var(--u) * -19);
  border-radius: calc(var(--u) * 5);
  background: #8f75d4;
}

/* ---------- .dining-filters ---------- */
.dn-filters {
  flex-shrink: 0;
  padding: calc(var(--u) * 12) calc(var(--u) * 28) calc(var(--u) * 22);
  background: #ffffff;
  border-bottom: 1px solid #eeedf5;
}
.dn-venue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
  margin-bottom: calc(var(--u) * 18);
}
.dn-venue-pick {
  display: flex;
  align-items: center;
  min-height: calc(var(--u) * 60);
  gap: calc(var(--u) * 12);
}
.dn-venue-name {
  color: #323343;
  font-size: calc(var(--u) * 31);
  font-weight: 600;
  line-height: 1.4;
}
.dn-chevron {
  display: flex;
  width: calc(var(--u) * 36);
  height: calc(var(--u) * 36);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f1f8;
}
.dn-chevron::before {
  content: '';
  width: calc(var(--u) * 10);
  height: calc(var(--u) * 10);
  margin-top: calc(var(--u) * -5);
  border-right: calc(var(--u) * 3) solid #9793ac;
  border-bottom: calc(var(--u) * 3) solid #9793ac;
  transform: rotate(45deg);
}
.dn-venue-hint {
  flex-shrink: 0;
  color: #aaa8b8;
  font-size: calc(var(--u) * 21);
}
.dn-filter-line {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 18);
  margin-top: calc(var(--u) * 14);
}
.dn-filter-label {
  flex-shrink: 0;
  color: #9795a6;
  font-size: calc(var(--u) * 23);
}
.dn-filter-scroll {
  flex: 1;
  width: 0;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.dn-filter-scroll::-webkit-scrollbar {
  display: none;
}
.dn-chips {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 12);
}
.dn-chip {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: calc(var(--u) * 10);
  padding: calc(var(--u) * 11) calc(var(--u) * 20);
  border-radius: calc(var(--u) * 12);
  background: #f7f7fa;
  color: #797588;
  font-size: calc(var(--u) * 24);
  line-height: 1.4;
}
.dn-chip.active {
  background: #efebff;
  color: #6a5acd;
  font-weight: 600;
}
.dn-floor-mode {
  padding: calc(var(--u) * 3) calc(var(--u) * 7);
  border-radius: calc(var(--u) * 7);
  background: #eeebf4;
  color: #a198b0;
  font-size: calc(var(--u) * 17);
  font-weight: 400;
}
.dn-chip.active .dn-floor-mode {
  background: rgba(255, 255, 255, 0.72);
  color: #8270bf;
}

/* .content-switch */
.dn-switch {
  display: flex;
  gap: calc(var(--u) * 30);
  margin-top: calc(var(--u) * 24);
  color: #a5a0b3;
  font-size: calc(var(--u) * 25);
}
.dn-switch-option {
  padding-bottom: calc(var(--u) * 12);
}
.dn-switch-option--selected {
  border-bottom: calc(var(--u) * 4) solid #8a6ed5;
  color: #7354c5;
}

/* .weekday-row */
.dn-week {
  display: flex;
  gap: calc(var(--u) * 8);
  margin-top: calc(var(--u) * 24);
}
.dn-day {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--u) * 5);
  padding: calc(var(--u) * 12) 0 calc(var(--u) * 10);
  border-radius: calc(var(--u) * 14);
  background: #f8f8fb;
  color: #92909e;
  text-align: center;
}
.dn-day.active {
  background: #6a5acd;
  color: #ffffff;
}
.dn-day-name {
  font-size: calc(var(--u) * 22);
  font-weight: 600;
}
.dn-day-date {
  font-size: calc(var(--u) * 17);
  opacity: 0.72;
}

/* ---------- .dining-scroll（菜谱列表） ---------- */
.dn-menu {
  box-sizing: border-box;
  background: #f7f6fa;
}
.dn-menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(var(--u) * 30) calc(var(--u) * 30) 0;
  color: #45404f;
  font-size: calc(var(--u) * 29);
  font-weight: 600;
}
.dn-menu-count {
  color: #aaa2b5;
  font-size: calc(var(--u) * 22);
  font-weight: 400;
}
.dn-menu-source {
  padding: calc(var(--u) * 12) calc(var(--u) * 30) 0;
  color: #a49bad;
  font-size: calc(var(--u) * 21);
  line-height: 1.5;
}

/* .menu-grid / .dish-row */
.dn-menu-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: calc(var(--u) * 16);
  padding: calc(var(--u) * 24);
}
.dn-dish {
  display: flex;
  min-height: calc(var(--u) * 44);
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--u) * 12);
  padding: calc(var(--u) * 26) calc(var(--u) * 20);
  border: 1px solid #eeeaf2;
  border-radius: calc(var(--u) * 18);
  background: #ffffff;
}
.dn-dish-name {
  min-width: 0;
  color: #514759;
  font-size: calc(var(--u) * 26);
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.dn-dish-price {
  flex-shrink: 0;
  color: #be8151;
  font-size: calc(var(--u) * 27);
  font-weight: 600;
}
.dn-currency {
  margin-right: calc(var(--u) * 3);
  font-size: calc(var(--u) * 19);
  font-weight: 400;
}

/* .menu-note */
.dn-menu-note {
  padding: calc(var(--u) * 24) calc(var(--u) * 26) calc(var(--u) * 40);
  color: #aaa5b5;
  font-size: calc(var(--u) * 22);
  line-height: 1.6;
  text-align: center;
}
</style>
