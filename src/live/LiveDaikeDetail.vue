<script>
export const meta = { id: 'daikedetail', label: '体验课详情', note: '课程 + 接单', group: '校园', tab: '', order: 3 };
</script>

<!--
  现版 · 体验课详情
  对应 quick-pick-main/pagesLog/daikedetail/daikedetail.vue（非本人发布 + 状态 open）
        + styles/daike.scss
  结构：返回栏（小程序原生导航条，源码里没有 template，这里按 pages.json 的标题自绘）
        → 课头（课程名 + 状态 / 时间 / 地点 / 老师 / 内容 / 报酬 + 几人了解）
        → 三行「标签列 + 值列」（雇主 / 微信 / 说明）
        → 合规提示 → 底部操作条（加微信 + 我来了解）。
  尺寸照抄源码 rpx：1rpx = 0.52px。$dk-pad 32rpx / $dk-row 96rpx / $dk-label 140rpx。
-->
<template>
  <div class="live-page live-daikedetail">
    <!-- 详情页没有底部 tabBar，返回栏自己画：吸在状态栏下面，高 44px（对齐原生导航条） -->
    <header class="dd-nav">
      <button class="dd-back" aria-label="返回">
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
      <span class="dd-nav-title">体验课详情</span>
      <span class="dd-nav-gap"></span>
    </header>

    <!-- .head -->
    <section class="dd-head">
      <div class="dd-head-row">
        <span class="dd-title">高等数学（上）</span>
        <span class="dd-status">等人了解</span>
      </div>
      <span class="dd-meta">11月5日 周三 · 3-4 节</span>
      <span class="dd-meta">大学城 教3-201</span>
      <span class="dd-meta">任课老师 陈老师</span>
      <span class="dd-meta">代签到 · 记笔记</span>
      <div class="dd-fee-line">
        <div class="dd-fee">
          <span class="dd-fee-label">报酬</span>
          <span class="dd-fee-value">¥15</span>
        </div>
        <span class="dd-interest">3 人正在了解</span>
      </div>
    </section>

    <div class="dd-row">
      <span class="dd-label">雇主</span>
      <span class="dd-value">林小满</span>
      <span class="dd-note">2 小时前</span>
    </div>

    <div class="dd-row">
      <span class="dd-label">微信</span>
      <span class="dd-value">linxm_0321</span>
      <span class="dd-link">复制</span>
      <span class="dd-link">二维码</span>
    </div>

    <!-- 说明：多行，.row--multiline 顶部对齐 -->
    <div class="dd-row dd-row--note">
      <span class="dd-label">说明</span>
      <span class="dd-value dd-value--note"
        >老师每节都点名，帮忙答个到就行；下课拍一下黑板上的作业。</span
      >
    </div>

    <span class="dd-tip">体验课仅限同学之间互助，请遵守学校的考勤与请假规定。</span>

    <!-- .action-bar：源码 position: fixed；设计台里改成 absolute，才贴在手机画布的底部 -->
    <div class="dd-bar">
      <span class="dd-ghost">加微信</span>
      <div class="dd-primary">我来了解</div>
    </div>
  </div>
</template>

<style scoped>
.live-daikedetail {
  background: #ffffff;
  /* 源码 .page padding-bottom: calc(180rpx + env(safe-area-inset-bottom))，给底部操作条让位 */
  padding-bottom: calc(var(--u) * 180);
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.dd-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #ffffff;
}
.dd-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}
.dd-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

/* ---------- .head ---------- */
.dd-head {
  padding: calc(var(--u) * 32) calc(var(--u) * 32) calc(var(--u) * 28);
  border-bottom: 1px solid #ededed;
}
.dd-head-row {
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 24);
}
.dd-title {
  flex: 1;
  min-width: 0;
  color: #1a1a1a;
  font-size: calc(var(--u) * 36);
  font-weight: 600;
  line-height: 1.4;
}
.dd-status {
  flex-shrink: 0;
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
  line-height: 1.4;
}
.dd-status.is-closed {
  color: #b3b3b3;
}
.dd-meta {
  display: block;
  margin-top: calc(var(--u) * 10);
  color: #666666;
  font-size: calc(var(--u) * 25);
  line-height: 1.5;
}
.dd-fee-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: calc(var(--u) * 24);
  margin-top: calc(var(--u) * 18);
}
.dd-fee {
  display: flex;
  align-items: baseline;
  gap: calc(var(--u) * 12);
}
.dd-fee-label {
  color: #999999;
  font-size: calc(var(--u) * 24);
}
.dd-fee-value {
  color: #f92e05;
  font-size: calc(var(--u) * 32);
  font-weight: 600;
}
.dd-interest {
  color: #6a5acd;
  font-size: calc(var(--u) * 24);
}

/* ---------- .row（@mixin dk-row / dk-label / dk-value） ---------- */
.dd-row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: calc(var(--u) * 96);
  padding: 0 calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dd-label {
  flex-shrink: 0;
  width: calc(var(--u) * 140);
  color: #999999;
  font-size: calc(var(--u) * 26);
  line-height: 1.4;
}
.dd-value {
  flex: 1;
  min-width: 0;
  color: #1a1a1a;
  font-size: calc(var(--u) * 29);
  line-height: 1.5;
}
.dd-row--note {
  align-items: flex-start;
  padding-top: calc(var(--u) * 26);
  padding-bottom: calc(var(--u) * 24);
}
.dd-row--note .dd-label {
  line-height: 1.7;
}
.dd-value--note {
  color: #666666;
  font-size: calc(var(--u) * 27);
  line-height: 1.7;
}
.dd-note {
  flex-shrink: 0;
  margin-left: calc(var(--u) * 20);
  color: #b3b3b3;
  font-size: calc(var(--u) * 23);
}
.dd-link {
  flex-shrink: 0;
  margin-left: calc(var(--u) * 20);
  color: #6a5acd;
  font-size: calc(var(--u) * 26);
  line-height: 1.4;
}

/* ---------- .foot-note ---------- */
.dd-tip {
  display: block;
  padding: calc(var(--u) * 36) calc(var(--u) * 32) 0;
  color: #b3b3b3;
  font-size: calc(var(--u) * 21);
  line-height: 1.6;
}

/* ---------- .action-bar ---------- */
.dd-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 32);
  padding: calc(var(--u) * 16) calc(var(--u) * 32);
  border-top: 1px solid #ededed;
  background: #ffffff;
}
.dd-ghost {
  flex-shrink: 0;
  padding: 0 calc(var(--u) * 6);
  color: #666666;
  font-size: calc(var(--u) * 27);
}
.dd-primary {
  display: flex;
  flex: 1;
  height: calc(var(--u) * 88);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 4);
  background: #6a5acd;
  color: #ffffff;
  font-size: calc(var(--u) * 29);
}
</style>
