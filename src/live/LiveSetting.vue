<script>
export const meta = { id: 'setting', label: '设置', note: '账号与偏好', group: '个人', tab: '', order: 3 };
</script>

<!--
  现版 · 设置（对应 quick-pick-main/pagesLog/setting/setting.vue）
  结构：原生导航栏（44px 返回 + 设置）→ 浅蓝渐变底 → 10 张「系统信息」卡片（标题 + 值）→ 底部「退出登录」按钮。
  setting 是从「我的 · 校园服务」navigateTo 进来的二级页：没有 tabBar，只有原生导航栏
  （pages.json: navigationBarTitleText = 设置），自己画一条 44px 吸顶栏。
  所有尺寸照抄源码的 rpx 数字，用 calc(var(--u) * N) 换算（1rpx = 0.52px）。
  源码的值来自 uni.getSystemInfo()，静态稿写成微信开发者工具里的常见取值；
  源码的 .page 是 100vh + 内部滚动，这里改成自然流式（min-height 撑满一屏）让整页截图能看全。
-->
<script setup>
/* 源码 infoList 的 title 顺序；value 由 systemInfo[key] 填，没拿到显示「未获取」 */
const infoList = [
  { title: '小程序名字', value: '庆快校园' },
  { title: '客户端平台', value: 'devtools' },
  { title: '小程序版本', value: '2.32.3' },
  { title: '语言', value: 'zh_CN' },
  { title: '版本', value: '8.0.47' },
  { title: '屏幕宽度', value: '390' },
  { title: '屏幕高度', value: '844' },
  { title: '可使用窗口高度', value: '729' },
  { title: '状态栏的高度', value: '47' },
  { title: 'DPI', value: '3' },
];
</script>

<template>
  <div class="live-page live-setting">
    <!-- 原生导航栏（pages.json: navigationBarTitleText = 设置） -->
    <header class="set-nav live-sticky-head">
      <button class="set-back" type="button" aria-label="返回">
        <uni-icons type="left" size="22" color="#34313f" />
      </button>
      <h1 class="set-nav-title">设置</h1>
    </header>

    <div class="set-body">
      <div class="set-info-list">
        <div v-for="item in infoList" :key="item.title" class="set-info-card">
          <div class="set-card-header">
            <span class="set-card-title">{{ item.title }}</span>
          </div>
          <div class="set-card-content">
            <span class="set-card-value">{{ item.value || '未获取' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="set-footer">
      <button class="set-logout-btn" type="button"><span class="set-btn-text">退出登录</span></button>
    </div>
  </div>
</template>

<style scoped>
/* ---------- .page：135° 浅蓝渐变铺满（二级页没有底栏，footer 自己收尾） ---------- */
.live-setting {
  display: flex;
  min-height: 888px;
  flex-direction: column;
  padding: 46px 0 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #2d3748;
}

/* ---------- 原生导航栏：44px，标题居中，返回键压左边 ---------- */
.set-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: flex;
  flex: none;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  padding: 0 calc(var(--u) * 12);
  background: #fff;
}
.set-back {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
}
.set-nav-title {
  position: absolute;
  right: 0;
  left: 0;
  color: #34313f;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

/* ---------- .body / .info-list / .info-card ---------- */
.set-body {
  flex: 1;
  padding: calc(var(--u) * 30);
}
.set-info-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 24);
}
.set-info-card {
  padding: calc(var(--u) * 30);
  border-left: calc(var(--u) * 6) solid #8b7cff;
  border-radius: calc(var(--u) * 16);
  background: #fff;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 20) rgba(0, 0, 0, 0.06);
}
.set-card-header {
  display: flex;
  align-items: center;
  margin-bottom: calc(var(--u) * 20);
}
.set-card-title {
  color: #2d3748;
  font-size: calc(var(--u) * 30);
  font-weight: 600;
}
/* 源码 .card-content 固定留出左侧图标位（模板里其实没渲染图标），照抄这个缩进 */
.set-card-content {
  padding-left: calc(var(--u) * 80);
}
.set-card-value {
  display: block;
  padding: calc(var(--u) * 16) calc(var(--u) * 20);
  border: 1px solid #e2e8f0;
  border-radius: calc(var(--u) * 10);
  background: #f7fafc;
  color: #4a5568;
  font-size: calc(var(--u) * 28);
  word-break: break-all;
}

/* ---------- .footer / .logout-btn ---------- */
.set-footer {
  display: flex;
  flex: none;
  justify-content: center;
  padding: calc(var(--u) * 30);
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
.set-logout-btn {
  display: flex;
  width: 100%;
  min-height: calc(var(--u) * 88);
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: calc(var(--u) * 50);
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  box-shadow: 0 calc(var(--u) * 6) calc(var(--u) * 20) rgba(255, 107, 107, 0.4);
}
.set-btn-text {
  color: #fff;
  font-size: calc(var(--u) * 32);
  font-weight: 600;
}
</style>
