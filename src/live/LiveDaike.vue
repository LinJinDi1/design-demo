<script>
export const meta = { id: 'daike', label: '大学体验课', note: '课程列表', group: '校园', tab: '', order: 2 };
</script>

<!--
  现版 · 大学体验课（列表）
  对应 quick-pick-main/pagesLog/daike/daike.vue（默认「找人体验」分栏）
        + components/DaikeItem/DaikeItem.vue + styles/daike.scss
  这是一级 tab 页里长出来的二级页（校园页 uni.navigateTo 进来），不是 tabBar 页面：
  线上有原生导航栏（标题「大学体验课」+ 返回），没有底部 tab 栏，所以 meta.tab 留空，
  外壳隐藏玻璃底栏，这里自己画一条 44px 吸顶返回栏。
  结构：返回栏 → 三个分栏（找人体验 / 我想体验 / 我的）+ 右上角「发布」
        → 校区筛选条（全部校区 + 「N 条」）→ 体验课条目 → 「没有更多了」。
  尺寸照抄源码 rpx：1rpx = 0.52px，写成 calc(var(--u) * N)。
  条目直接用小程序源码的 DaikeItem.vue（纯展示组件，不请求接口），尺寸与源码同源；
  页面级数字（tabs / toolbar / list-end）来自 daike.vue 的 scoped 样式 + styles/daike.scss。
-->
<script setup>
import DaikeItem from '@app/components/DaikeItem/DaikeItem.vue';

/* DAIKE_BOARD_TABS：默认落在「找人体验」（role = need） */
const tabs = [
  { id: 'need', label: '找人体验' },
  { id: 'can', label: '我想体验' },
  { id: 'mine', label: '我的' },
];
const activeTab = 'need';

/*
 * 线上由 GET /user/daike/post 返回、server/daike.js 的 decoratePost() 归一化后的字段：
 * courseTitle / feeText / timeText / taskLabels / campusName / ownerName / createdText /
 * interestText / statusText。DaikeItem 再从这些字段拼出 metaLine 与 ownerLine。
 */
const posts = [
  {
    id: 'd1',
    status: 'open',
    courseTitle: '高等数学（上）',
    fee: 15,
    feeText: '¥15',
    timeText: '11月5日 周三 · 3-4 节',
    taskLabels: ['代签到'],
    campusName: '大学城',
    ownerName: '林小满',
    createdText: '2 小时前',
    interestText: '3 人正在了解',
    statusText: '等人了解',
  },
  {
    id: 'd2',
    status: 'open',
    courseTitle: '大学英语视听说',
    fee: 10,
    feeText: '¥10',
    timeText: '11月6日 周四 · 1-2 节',
    taskLabels: ['代上课'],
    campusName: '大学城',
    ownerName: '阿梨',
    createdText: '昨天',
    interestText: '1 人正在了解',
    statusText: '等人了解',
  },
  {
    id: 'd3',
    status: 'open',
    courseTitle: '中国近现代史纲要',
    fee: 8,
    feeText: '¥8',
    timeText: '11月7日 周五 · 5-6 节',
    taskLabels: ['代签到', '记笔记'],
    campusName: '桂花岗',
    ownerName: '橙子',
    createdText: '昨天',
    interestText: '',
    statusText: '等人了解',
  },
  {
    id: 'd4',
    status: 'closed',
    courseTitle: '线性代数',
    fee: 0,
    feeText: '随缘',
    timeText: '11月10日 周一 · 9-10 节',
    taskLabels: ['代上课'],
    campusName: '黄埔',
    ownerName: '阿泽',
    createdText: '3 天前',
    interestText: '',
    statusText: '已找到',
  },
  {
    id: 'd5',
    status: 'open',
    courseTitle: '概率论与数理统计',
    fee: 20,
    feeText: '¥20',
    timeText: '11月11日 周二 · 7-8 节',
    taskLabels: ['代交作业'],
    campusName: '黄埔',
    ownerName: '徐豆豆',
    createdText: '4 天前',
    interestText: '2 人正在了解',
    statusText: '等人了解',
  },
];
</script>

<template>
  <div class="live-page live-daike">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 大学体验课）；源码 template 里没有，这里自绘 -->
    <header class="dk-nav">
      <button class="dk-back" aria-label="返回">
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
      <span class="dk-nav-title">大学体验课</span>
      <span class="dk-nav-gap"></span>
    </header>

    <!-- .tabs：三个分栏 + 右上角「发布」（源码里「我的」也是分栏之一，不是 pages.json 的 tabBar） -->
    <div class="dk-tabs">
      <span
        v-for="tab in tabs"
        :key="tab.id"
        class="dk-tab"
        :class="{ 'is-active': tab.id === activeTab }"
        >{{ tab.label }}</span
      >
      <span class="dk-publish">发布</span>
    </div>

    <!-- .toolbar：校区筛选（源码点开 showActionSheet，静态稿只画「全部校区」）+ 条数 -->
    <div class="dk-toolbar">
      <span class="dk-campus">全部校区</span>
      <!-- <uni-icons type="bottom" size="11" color="#999999">：设计台没注册 bottom，这里照 11px 内联 SVG -->
      <svg class="dk-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m5.5 9 6.5 6.5L18.5 9"
          stroke="#999999"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="dk-count">{{ posts.length }} 条</span>
    </div>

    <div class="dk-list">
      <DaikeItem v-for="post in posts" :key="post.id" :post="post" />
      <span class="dk-list-end">没有更多了</span>
    </div>
  </div>
</template>

<style scoped>
/* styles/daike.scss：$dk-page = #fff，$dk-line = #ededed，$dk-pad = 32rpx */
.live-daike {
  /* 没有玻璃底栏（meta.tab 为空），底部只留 40rpx，和 LiveNotice 一致 */
  padding-bottom: calc(var(--u) * 40);
  background: #ffffff;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.dk-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #ffffff;
}
.dk-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}
.dk-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

/* ---------- .tabs / .tab / .tabs-action ---------- */
.dk-tabs {
  display: flex;
  align-items: flex-end;
  padding: 0 calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dk-tab {
  position: relative;
  margin-right: calc(var(--u) * 48);
  padding: calc(var(--u) * 26) 0 calc(var(--u) * 22);
  color: #666666;
  font-size: calc(var(--u) * 29);
  line-height: 1.2;
}
.dk-tab.is-active {
  color: #1a1a1a;
  font-weight: 600;
}
/* .tab.is-active::after：bottom -1rpx、高 3rpx 的紫色短线，正好压住 1rpx 分隔线 */
.dk-tab.is-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: calc(var(--u) * 3);
  background: #6a5acd;
}
.dk-publish {
  margin-left: auto;
  padding: calc(var(--u) * 26) 0 calc(var(--u) * 22);
  color: #6a5acd;
  font-size: calc(var(--u) * 27);
  line-height: 1.2;
}

/* ---------- .toolbar ---------- */
.dk-toolbar {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 8);
  box-sizing: border-box;
  min-height: calc(var(--u) * 84);
  padding: 0 calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dk-campus {
  color: #666666;
  font-size: calc(var(--u) * 26);
}
.dk-caret {
  flex-shrink: 0;
}
.dk-count {
  margin-left: auto;
  color: #b3b3b3;
  font-size: calc(var(--u) * 24);
}

/* ---------- .list-end ---------- */
.dk-list-end {
  display: block;
  padding: calc(var(--u) * 40) 0 0;
  color: #b3b3b3;
  font-size: calc(var(--u) * 22);
  text-align: center;
}
</style>
