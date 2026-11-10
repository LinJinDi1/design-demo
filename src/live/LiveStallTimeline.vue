<script>
export const meta = {
  id: 'stall-timeline',
  label: '现场记录',
  note: '摊位打卡时间线',
  group: '校园觅食',
  tab: '',
  order: 5,
};
</script>

<!--
  现版 · 现场记录（对应 quick-pick-main/pagesLog/stallreporttimeline/stallreporttimeline.vue，215 行）
  入口：摊位详情与 StallList 的「查看记录」（navigateTo?targetType=stall&targetId=...）
  结构：返回栏（pages.json: 现场记录 / 白底）+ 一个 24rpx 20rpx 40rpx 内边距的可滚区，
        里面就一张卡片（components/StallReportTimeline）：
          摘要（这家摊现在怎么样 / 摊名 / 状态 / 证据+更新时间）
          → 按天分组的时间线（左侧 18rpx 圆点 + 2rpx 竖线，右侧「这一小时有 N 人反馈」+ 时间
            + 状态胶囊 + 位置变化 + 「看看大家的补充」+ 展开后的新位置/补充）。
  为什么不直接 import components/StallReportTimeline：它的 watch.requestKey 是 immediate，
  一创建就 reload() 打接口，静态稿会拿到空列表或错误态（README §4）。所以按它的 rpx 手写一份，
  数据形状照 utils/stall-report.ts 的 normalizeHourlyReportTimeline() 输出。
  尺寸照抄组件的 scss：卡片 padding 24rpx / 圆角 16rpx / 阴影 0 4rpx 16rpx rgba(0,0,0,.08)，
  摘要 8rpx 行距 + 22rpx 分隔线，时间线条目 padding-left 30rpx、圆点 18rpx、状态胶囊 4rpx 12rpx。
  刻意简化：加载中 / 加载失败 / 暂无记录三个 state，以及路由参数缺失时的 routeError 分支（源码里是整页状态页）；
  时间线只放 2 天 5 条（源码最多 24 个小时桶）。第 2 条展开，用来露出「新位置 / 补充」那一段。
-->
<script setup>
/* 摊位信息：与 LiveStallDetail 同一家（徐豆豆），normalizeLiveStatus() 之后的文案 */
const stallName = '徐豆豆';
const summaryStatus = '营业中';
const summaryMeta = '4 人刚说看到在营业 · 更新于 09-14 21:12';

/* 每条 = normalizeHourlyBucket() 的输出，字段名照抄，方便跟源码逐行对照 */
const groups = [
  {
    dayText: '今天',
    items: [
      {
        key: 'hour:21',
        feedbackText: '这一小时有 5 人反馈',
        timeText: '21:00',
        statusSummaries: ['4 人看到在营业', '1 人说已经收摊'],
        locationText: '',
        locationDetails: [],
        hiddenLocationDetailCount: 0,
        remarks: [],
        hiddenRemarkCount: 0,
        hasDetails: false,
        expanded: false,
      },
      {
        key: 'hour:20',
        feedbackText: '这一小时有 8 人反馈',
        timeText: '20:00',
        statusSummaries: ['7 人看到在营业', '1 人暂时没看到'],
        locationText: '2 人说位置有变化',
        locationDetails: ['工行门内侧 · ATM 旁边'],
        hiddenLocationDetailCount: 0,
        remarks: ['比平时往里挪了一个摊位，还在老位置附近'],
        hiddenRemarkCount: 0,
        hasDetails: true,
        expanded: true,
      },
      {
        key: 'hour:19',
        feedbackText: '这一小时有 3 人反馈',
        timeText: '19:00',
        statusSummaries: ['2 人看到在营业', '1 人暂时没看到'],
        locationText: '',
        locationDetails: [],
        hiddenLocationDetailCount: 0,
        remarks: [],
        hiddenRemarkCount: 0,
        hasDetails: false,
        expanded: false,
      },
    ],
  },
  {
    dayText: '昨天',
    items: [
      {
        key: 'hour:22y',
        feedbackText: '这一小时有 6 人反馈',
        timeText: '22:00',
        statusSummaries: ['5 人看到在营业', '1 人暂时没看到'],
        locationText: '',
        locationDetails: [],
        hiddenLocationDetailCount: 0,
        remarks: [],
        hiddenRemarkCount: 0,
        hasDetails: false,
        expanded: false,
      },
      {
        key: 'hour:21y',
        feedbackText: '这一小时有 4 人反馈',
        timeText: '21:00',
        statusSummaries: ['3 人说已经收摊', '1 人暂时没看到'],
        locationText: '',
        locationDetails: [],
        hiddenLocationDetailCount: 0,
        remarks: [],
        hiddenRemarkCount: 0,
        hasDetails: false,
        expanded: false,
      },
    ],
  },
];
</script>

<template>
  <div class="live-page live-st">
    <!-- 原生导航栏（pages.json: 现场记录 / 白底） -->
    <header class="st-nav">
      <button class="st-back" type="button" aria-label="返回">
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
      <span class="st-nav-title">现场记录</span>
      <span class="st-nav-gap"></span>
    </header>

    <!-- .timeline-page__body：24rpx 20rpx 40rpx，里面只有一张 StallReportTimeline 卡片 -->
    <div class="st-body">
      <div class="st-card">
        <!-- .timeline__summary -->
        <div class="st-summary">
          <span class="st-summary-label">这家摊现在怎么样</span>
          <span class="st-summary-name">{{ stallName }}</span>
          <span class="st-summary-status">{{ summaryStatus }}</span>
          <span class="st-summary-meta">{{ summaryMeta }}</span>
        </div>

        <!-- .timeline__list -->
        <div class="st-list">
          <div v-for="group in groups" :key="group.dayText" class="st-group">
            <span class="st-day">{{ group.dayText }}</span>

            <div v-for="item in group.items" :key="item.key" class="st-item">
              <div class="st-dot"></div>

              <div class="st-content">
                <div class="st-item-row">
                  <span class="st-feedback">{{ item.feedbackText }}</span>
                  <span class="st-time">{{ item.timeText }}</span>
                </div>

                <div v-if="item.statusSummaries.length" class="st-status-list">
                  <span v-for="line in item.statusSummaries" :key="line" class="st-status">{{
                    line
                  }}</span>
                </div>

                <span v-if="item.locationText" class="st-location">{{ item.locationText }}</span>

                <div v-if="item.hasDetails" class="st-details-action">
                  {{ item.expanded ? '收起补充' : '看看大家的补充' }}
                </div>

                <div v-if="item.expanded" class="st-details">
                  <span
                    v-for="location in item.locationDetails"
                    :key="location"
                    class="st-detail"
                    >新位置：{{ location }}</span
                  >
                  <span v-if="item.hiddenLocationDetailCount" class="st-detail-more"
                    >还有 {{ item.hiddenLocationDetailCount }} 条位置补充</span
                  >
                  <span v-for="remark in item.remarks" :key="remark" class="st-detail"
                    >补充：{{ remark }}</span
                  >
                  <span v-if="item.hiddenRemarkCount" class="st-detail-more"
                    >还有 {{ item.hiddenRemarkCount }} 条补充</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .timeline-page：100vw / 100vh / $color-bg-page（#f8f8f8） */
.live-st {
  min-height: 888px;
  padding-bottom: 0;
  background: #f8f8f8;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.st-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #fff;
}
.st-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.st-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}
.st-nav-gap {
  display: block;
  width: 44px;
}

/* ---------- .timeline-page__body（scroll-view 的高度换成 100vh 对应的 798px） ---------- */
.st-body {
  box-sizing: border-box;
  min-height: calc(888px - 90px);
  padding: calc(var(--u) * 24) calc(var(--u) * 20) calc(var(--u) * 40);
}

/* ---------- .timeline 卡片 ---------- */
.st-card {
  padding: calc(var(--u) * 24);
  border-radius: calc(var(--u) * 16);
  background: #fff;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 16) rgba(0, 0, 0, 0.08);
}

/* ---------- .timeline__summary ---------- */
.st-summary {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 8);
  padding-bottom: calc(var(--u) * 22);
  border-bottom: 1px solid #f0f0f0;
}
.st-summary-label {
  color: #999;
  font-size: calc(var(--u) * 22);
  line-height: 1.45;
}
.st-summary-name {
  color: #666;
  font-size: calc(var(--u) * 24);
  line-height: 1.5;
  word-break: break-all;
}
.st-summary-status {
  color: #333;
  font-size: calc(var(--u) * 30);
  font-weight: 600;
  line-height: 1.45;
  word-break: break-all;
}
.st-summary-meta {
  color: #666;
  font-size: calc(var(--u) * 24);
  line-height: 1.6;
  word-break: break-all;
}

/* ---------- .timeline__list / __group / __day ---------- */
.st-list {
  margin-top: calc(var(--u) * 24);
}
.st-group + .st-group {
  margin-top: calc(var(--u) * 24);
}
.st-day {
  display: block;
  margin-bottom: calc(var(--u) * 12);
  color: #999;
  font-size: calc(var(--u) * 22);
  line-height: 1.45;
}

/* ---------- .timeline__item：左侧竖线（9rpx / 2rpx）+ 18rpx 圆点 ---------- */
.st-item {
  position: relative;
  padding: 0 0 calc(var(--u) * 20) calc(var(--u) * 30);
}
.st-item:last-child {
  padding-bottom: 0;
}
.st-item::before {
  content: '';
  position: absolute;
  top: calc(var(--u) * 16);
  bottom: 0;
  left: calc(var(--u) * 9);
  width: calc(var(--u) * 2);
  background: #f0f0f0;
}
.st-item:last-child::before {
  display: none;
}
.st-dot {
  position: absolute;
  top: calc(var(--u) * 10);
  left: 0;
  width: calc(var(--u) * 18);
  height: calc(var(--u) * 18);
  border-radius: 50%;
  background: #6a5acd;
}

/* ---------- .timeline__content 里的各行 ---------- */
.st-content {
  min-width: 0;
}
.st-item-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: calc(var(--u) * 16);
}
.st-feedback {
  flex: 1;
  min-width: 0;
  color: #333;
  font-size: calc(var(--u) * 26);
  font-weight: 600;
  line-height: 1.5;
  word-break: break-all;
}
.st-time {
  flex-shrink: 0;
  color: #999;
  font-size: calc(var(--u) * 22);
  line-height: 1.5;
}
.st-status-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--u) * 8) calc(var(--u) * 12);
  margin-top: calc(var(--u) * 8);
}
.st-status {
  padding: calc(var(--u) * 4) calc(var(--u) * 12);
  border-radius: calc(var(--u) * 40);
  background: #f5f5f5;
  color: #666;
  font-size: calc(var(--u) * 22);
  line-height: 1.5;
}
.st-location {
  display: block;
  margin-top: calc(var(--u) * 8);
  color: #6a5acd;
  font-size: calc(var(--u) * 23);
  line-height: 1.5;
}
.st-details-action {
  display: inline-flex;
  margin-top: calc(var(--u) * 8);
  color: #6a5acd;
  font-size: calc(var(--u) * 22);
  line-height: 1.5;
}
.st-details {
  margin-top: calc(var(--u) * 8);
  padding: calc(var(--u) * 12) calc(var(--u) * 16);
  border-radius: calc(var(--u) * 8);
  background: #f7f7f7;
}
.st-detail,
.st-detail-more {
  display: block;
  color: #666;
  font-size: calc(var(--u) * 22);
  line-height: 1.65;
  word-break: break-all;
}
.st-detail-more {
  color: #999;
}
</style>
