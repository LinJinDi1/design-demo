<script>
export const meta = { id: 'myfeed', label: '反馈', note: '意见反馈', group: '个人', tab: '', order: 5 };
</script>

<!--
  现版 · 反馈（对应 quick-pick-main/pagesLog/Myfeed/Myfeed.vue）
  结构：吸顶选项卡（反馈列表 / 提交反馈）→ 表单卡（问题描述 textarea + 字数 → 上传图片 3 格 → 提交反馈按钮）。
  尺寸照抄源码 rpx（1rpx = 0.52px）。静态稿停在「提交反馈」这一 tab：源码默认的「反馈列表」分支（历史反馈列表 /
  Empty 空态 / 「没有更多了」）没画，提交后的确认弹窗与 Toast 也略掉了。
  二级页（uni.navigateTo 打开，不是 tabBar 页）：顶部补一条 44px 原生导航栏，底部不再给玻璃胶囊留白。
-->
<script setup>
import { liveAsset } from './asset.js';

/* 表单：字段对齐 feedbackForm（message / images），字符数与源码 charCount 一致 */
const message = '食堂三楼的取餐窗口最近关得太早，17:40 之后基本买不到饭，希望能延长到 19:30，给晚自习的同学留一点时间。';
const count = message.length;
const maxLength = 200;

const images = [
  '/assets/source-fidelity/commercial/01-laotongguan.jpg',
  '/assets/source-fidelity/commercial/04-korean-flavor.jpg',
];
</script>

<template>
  <div class="live-page live-fb">
    <!-- 小程序原生导航栏（pages.json：navigationBarTitleText = 反馈、白底），二级页没有底部 tabBar -->
    <header class="fb-nav">
      <button class="fb-back" aria-label="返回">
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
      <span class="fb-nav-title">反馈</span>
      <span class="fb-nav-gap"></span>
    </header>

    <div class="fb-tabs">
      <div class="fb-tab">反馈列表</div>
      <div class="fb-tab active">提交反馈</div>
    </div>

    <div class="fb-content">
      <div class="fb-form">
        <div class="fb-group">
          <div class="fb-label">问题描述</div>
          <textarea
            class="fb-description"
            maxlength="200"
            placeholder="请务必仔细描述问题，至少10个字..."
            :value="message"
          ></textarea>
          <div class="fb-char-count">{{ count }}/{{ maxLength }}</div>
        </div>

        <div class="fb-group">
          <div class="fb-label">上传图片</div>
          <div class="fb-upload-hint">最多上传3张图片</div>

          <div class="fb-image-preview">
            <div v-for="(img, index) in images" :key="index" class="fb-preview-item">
              <img :src="liveAsset(img)" alt="" />
              <div class="fb-remove-btn">×</div>
            </div>
            <div class="fb-add-image">+</div>
          </div>
        </div>

        <button class="fb-submit">提交反馈</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 源码 .page-container 是 #f5f5f5（.live-page 默认 #f7f7f8）；
   二级页没有玻璃底栏，把外壳留的 190rpx 收到 40rpx */
.live-fb {
  padding-bottom: calc(var(--u) * 40);
  background: #f5f5f5;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

/* ---------- 自绘返回栏（原生 navigationBar：白底 + 居中 17px 标题） ---------- */
.fb-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #fff;
}
.fb-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fb-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

/* 源码 .tabs 是 top: 0 的吸顶条，这里让到「状态栏 + 44px 导航栏」下面 */
.fb-tabs {
  position: sticky;
  top: 90px;
  z-index: 10;
  display: flex;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.fb-tab {
  position: relative;
  flex: 1;
  padding: calc(var(--u) * 20) 0;
  color: #666;
  font-size: calc(var(--u) * 32);
  text-align: center;
}
.fb-tab.active {
  color: #a27cff;
  font-weight: 500;
}
.fb-tab.active::after {
  content: '';
  position: absolute;
  right: 20%;
  bottom: 0;
  left: 20%;
  height: calc(var(--u) * 6);
  border-radius: calc(var(--u) * 6);
  background: #a27cff;
}

.fb-content {
  padding: calc(var(--u) * 30);
}
.fb-form {
  padding: calc(var(--u) * 40);
  border-radius: calc(var(--u) * 20);
  background: #fff;
  box-shadow: 0 calc(var(--u) * 4) calc(var(--u) * 16) rgba(0, 0, 0, 0.05);
}
.fb-group {
  margin-bottom: calc(var(--u) * 40);
}
.fb-group:last-of-type {
  margin-bottom: 0;
}
.fb-label {
  display: block;
  margin-bottom: calc(var(--u) * 16);
  color: #333;
  font-size: calc(var(--u) * 32);
}
.fb-description {
  display: block;
  width: 100%;
  min-height: calc(var(--u) * 240);
  box-sizing: border-box;
  padding: calc(var(--u) * 24);
  border: 1px solid #e0e0e0;
  border-radius: calc(var(--u) * 16);
  color: #333;
  font-family: inherit;
  font-size: calc(var(--u) * 30);
  line-height: 1.5;
  resize: none;
}
.fb-description:focus {
  border-color: #a27cff;
  outline: none;
}
.fb-char-count {
  margin-top: calc(var(--u) * 10);
  color: #999;
  font-size: calc(var(--u) * 26);
  text-align: right;
}
.fb-upload-hint {
  margin-bottom: calc(var(--u) * 20);
  color: #999;
  font-size: calc(var(--u) * 28);
}
.fb-image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--u) * 20);
  margin-top: calc(var(--u) * 20);
}
.fb-preview-item {
  position: relative;
  overflow: hidden;
  width: calc(var(--u) * 160);
  height: calc(var(--u) * 160);
  border: 1px solid #e0e0e0;
  border-radius: calc(var(--u) * 16);
}
.fb-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.fb-remove-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: calc(var(--u) * 40);
  height: calc(var(--u) * 40);
  align-items: center;
  justify-content: center;
  border-radius: 0 0 0 calc(var(--u) * 16);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: calc(var(--u) * 24);
}
.fb-add-image {
  display: flex;
  width: calc(var(--u) * 160);
  height: calc(var(--u) * 160);
  align-items: center;
  justify-content: center;
  border: 1px dashed #e0e0e0;
  border-radius: calc(var(--u) * 16);
  color: #999;
  font-size: calc(var(--u) * 48);
}
.fb-submit {
  display: block;
  width: 100%;
  margin-top: calc(var(--u) * 40);
  padding: calc(var(--u) * 28);
  border: none;
  border-radius: calc(var(--u) * 16);
  background: #a27cff;
  color: #fff;
  font-size: calc(var(--u) * 32);
  text-align: center;
}
</style>
