<script>
export const meta = { id: 'notice', label: '通知', note: '系统消息列表', group: '个人', tab: '', order: 6 };
</script>

<!--
  现版 · 通知（对应 quick-pick-main/pagesLog/notice/notice.vue）
  源码只有 61 行：一个白底页 + 每条通知一行（宽度 95vw、padding 30rpx、
  底边 1rpx #d1d1d1 分隔线），渲染的就是 getNoticeList() 里的 description 字段。
  这里照做，只补一条原生导航栏：小程序那层「通知」标题 + 返回是 pages.json 里的
  navigationBarTitleText，设计台上没有原生栏，所以自己画一条 44px 吸顶栏。
  所有尺寸照抄源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
-->
<script setup>
/* getNoticeList() 返回的 NoticeVO，页面上只用得到 description */
const notices = [
  { id: 'n1', description: '你的留言「很不错的店」已通过审核，现在大家都能看到啦。' },
  { id: 'n2', description: '「老潼关肉夹馍」这周多了 3 条新留言，去看看同学们怎么说。' },
  {
    id: 'n3',
    description:
      '版本更新：新增小摊现场情况反馈，看到摊主出摊顺手点一下，帮后面的同学少跑一趟空路。',
  },
  {
    id: 'n4',
    description: '你上传的店铺照片因画面过暗未通过审核，可以换一张门头照重新上传。',
  },
];
</script>

<template>
  <div class="live-page live-notice">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 通知） -->
    <header class="nt-nav live-sticky-head">
      <button class="nt-back" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="nt-nav-title">通知</h1>
    </header>

    <!-- .page：白底 + 每条通知 95vw 居中、30rpx 内边距、1rpx 底边线 -->
    <div class="nt-page">
      <div v-for="item in notices" :key="item.id" class="nt-row">
        <span class="nt-text">{{ item.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page 是白底、100vh 可滚，这里跟着皮肤的状态栏留白走 */
.live-notice {
  padding-bottom: calc(var(--u) * 40);
  background: #fff;
}

/* 导航栏：44px 高，标题居中，返回键压在左边 */
.nt-nav {
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
.nt-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.nt-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

.nt-page {
  width: 100%;
  background-color: #fff;
}
/* 源码 .notice：整行居中；.notice1：95vw + 30rpx 内边距 + 1rpx 底边
   设计台的画布只有 390px，95vw 会按浏览器窗口算（1500px），所以写 95% */
.nt-row {
  display: flex;
  width: 95%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: calc(var(--u) * 30);
  border-bottom: 1px solid #d1d1d1;
}
.nt-text {
  display: flex;
  width: 100%;
  color: #302e33;
  font-size: 16px;
  line-height: 1.5;
  word-break: break-word;
}
</style>

<style>
/*
 * 通知页也没有底部玻璃胶囊，外壳给底栏留的 78px 内边距要去掉，
 * 否则白底页在手机底边上方留出一截灰条。只在本场景生效。
 */
.phone:has(.live-notice) .phone-content {
  padding-bottom: 0;
}
</style>
