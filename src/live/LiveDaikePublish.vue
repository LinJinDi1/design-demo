<script>
export const meta = { id: 'daikepublish', label: '发布体验课', note: '填写课程信息', group: '校园', tab: '', order: 4 };
</script>

<!--
  现版 · 发布体验课
  对应 quick-pick-main/pagesLog/daikepublish/daikepublish.vue
        + components/DaikeContactFields/DaikeContactFields.vue + styles/daike.scss
  结构：返回栏（原生导航条，源码没有 template，这里按 pages.json 标题自绘）
        → 表单（标签列 + 值列：身份 / 课程 / 任课老师 / 校区 / 周次 / 周几 / 节次 /
          上课时间 / 地点 / 内容 / 报酬 / 备注）
        → 联系方式（DaikeContactFields：微信号 + 二维码）
        → 合规提示 → 底部「发布」按钮。
  底部弹层（代课内容多选 / 选择节次）在源码里是 uni-popup，交互才弹；静态稿把它们
  按原样画在表单末尾的灰底带上，不遮罩表单，方便一次核对两种弹层的排版。
  尺寸照抄源码 rpx：1rpx = 0.52px。$dk-pad 32rpx / $dk-row 96rpx / $dk-label 140rpx。
-->
<script setup>
import DaikeContactFields from '@app/components/DaikeContactFields/DaikeContactFields.vue';
import {
  DAIKE_COMPLIANCE_TIP,
  DAIKE_ROLES,
  DAIKE_SECTION_GROUPS,
  DAIKE_TASK_TYPES,
  DAIKE_WECHAT_LIMIT,
} from '@app/utils/daike-config.js';
import {
  formatDateLabel,
  formatSectionText,
  formatTaskSummary,
  formatWeekday,
  resolveClassDate,
  toDateISO,
} from '@app/utils/daike-format.js';

/* form 的默认态（onLoad 里只按 ?role= 改身份，其余都是源码 data 的初值） */
const roles = DAIKE_ROLES;
const form = {
  role: 'need',
  weekday: 3, // 周三
  sectionGroup: '3-4',
  weekOffset: 0, // 本周
};

/* 三处由格式函数算出来的展示值，和运行时同一套 util，文案不会跑偏 */
const dateText = formatDateLabel(toDateISO(resolveClassDate(form.weekday, form.weekOffset)));
const sectionText = formatSectionText(form.sectionGroup);
const taskSummary = formatTaskSummary(['checkin']);

/* 联系方式：线上由 GET /user/daike/profile 回填，静态稿给一个已保存的微信号 */
const wechatId = 'qingkuai_me';
const wechatLimit = DAIKE_WECHAT_LIMIT;

/* 底部弹层的内容：代课内容（多选）+ 节次（单选），选中态与 form 初值一致 */
const taskTypes = DAIKE_TASK_TYPES;
const selectedTaskIds = ['checkin'];
const sectionOptions = DAIKE_SECTION_GROUPS.map((group) => ({
  id: group.id,
  label: `${group.label} · ${group.start}-${group.end}`,
}));
</script>

<template>
  <div class="live-page live-daikepublish">
    <!-- 发布页同样没有底部 tabBar，返回栏自己画 -->
    <header class="dp-nav">
      <button class="dp-back" aria-label="返回">
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
      <span class="dp-nav-title">发布体验课</span>
      <span class="dp-nav-gap"></span>
    </header>

    <!-- ---------- 表单：一行一个字段，左标签列 140rpx + 右值列 ---------- -->
    <div class="dp-row">
      <span class="dp-label">身份</span>
      <div class="dp-options">
        <span
          v-for="role in roles"
          :key="role.id"
          class="dp-option"
          :class="{ 'is-active': role.id === form.role }"
          >{{ role.label }}</span
        >
      </div>
    </div>

    <div class="dp-row">
      <span class="dp-label">课程</span>
      <input class="dp-input" placeholder="不填也可以" />
    </div>

    <div class="dp-row">
      <span class="dp-label">任课老师</span>
      <input class="dp-input" placeholder="不填也可以" />
    </div>

    <div class="dp-row">
      <span class="dp-label">校区</span>
      <span class="dp-value dp-value--empty">选择校区</span>
      <uni-icons type="right" :size="13" color="#cccccc" />
    </div>

    <div class="dp-row">
      <span class="dp-label">周次</span>
      <div class="dp-options">
        <span class="dp-option is-active">本周</span>
        <span class="dp-option">下周</span>
      </div>
    </div>

    <div class="dp-row">
      <span class="dp-label">周几</span>
      <span class="dp-value">{{ formatWeekday(form.weekday) }}</span>
      <uni-icons type="right" :size="13" color="#cccccc" />
    </div>

    <div class="dp-row">
      <span class="dp-label">节次</span>
      <span class="dp-value">{{ sectionText }}</span>
      <uni-icons type="right" :size="13" color="#cccccc" />
    </div>

    <div class="dp-row">
      <span class="dp-label">上课时间</span>
      <span class="dp-value">{{ dateText }}</span>
    </div>

    <div class="dp-row">
      <span class="dp-label">地点</span>
      <input class="dp-input" placeholder="不填也可以" />
    </div>

    <div class="dp-row">
      <span class="dp-label">内容</span>
      <span class="dp-value">{{ taskSummary }}</span>
      <uni-icons type="right" :size="13" color="#cccccc" />
    </div>

    <div class="dp-row">
      <span class="dp-label">报酬</span>
      <input class="dp-input" placeholder="不填表示随缘" />
      <!-- 源码：form.fee !== '' 才显示「元」，默认空 → 不显示 -->
    </div>

    <div class="dp-row dp-row--note">
      <span class="dp-label">备注</span>
      <textarea class="dp-note" placeholder="选填，例如：老师每节都点名"></textarea>
    </div>

    <!-- 微信号 + 二维码：直接用小程序源码组件，行高 / 字号 100% 同源 -->
    <DaikeContactFields :wechat-id="wechatId" qr-image="" :limit="wechatLimit" />

    <span class="dp-tip">{{ DAIKE_COMPLIANCE_TIP }}</span>

    <!-- ---------- 底部弹层（静态呈现）：代课内容多选 + 节次单选 ---------- -->
    <div class="dp-sheets">
      <div class="dp-sheet">
        <div class="dp-sheet-head">
          <span class="dp-sheet-title">代课内容</span>
          <span class="dp-sheet-close">完成</span>
        </div>
        <div v-for="type in taskTypes" :key="type.id" class="dp-sheet-row">
          <span class="dp-sheet-name">{{ type.label }}</span>
          <uni-icons
            v-if="selectedTaskIds.includes(type.id)"
            type="checkmarkempty"
            :size="16"
            color="#0697a7"
          />
        </div>
      </div>

      <div class="dp-sheet">
        <div class="dp-sheet-head">
          <span class="dp-sheet-title">选择节次</span>
          <span class="dp-sheet-close">关闭</span>
        </div>
        <div v-for="option in sectionOptions" :key="option.id" class="dp-sheet-row">
          <span class="dp-sheet-name" :class="{ 'is-active': option.id === form.sectionGroup }">{{
            option.label
          }}</span>
          <uni-icons
            v-if="option.id === form.sectionGroup"
            type="checkmarkempty"
            :size="16"
            color="#0697a7"
          />
        </div>
      </div>
    </div>

    <!-- .submit-bar：源码 position: fixed；设计台的手机是画布，改成 absolute 才贴底 -->
    <div class="dp-submit-bar">
      <div class="dp-submit">发布</div>
    </div>
  </div>
</template>

<style scoped>
.live-daikepublish {
  background: #ffffff;
  /* 源码 .page padding-bottom: calc(220rpx + env(safe-area-inset-bottom)) */
  padding-bottom: calc(var(--u) * 220);
}

/* ---------- 自绘返回栏（原生 navigationBar） ---------- */
.dp-nav {
  position: sticky;
  top: 46px;
  z-index: 12;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: 44px;
  background: #ffffff;
}
.dp-back {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
}
.dp-nav-title {
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

/* ---------- .row / .label / .value（@mixin dk-row / dk-label / dk-value） ---------- */
.dp-row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: calc(var(--u) * 96);
  padding: 0 calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dp-label {
  flex-shrink: 0;
  width: calc(var(--u) * 140);
  color: #999999;
  font-size: calc(var(--u) * 26);
  line-height: 1.4;
}
.dp-value {
  flex: 1;
  min-width: 0;
  color: #1a1a1a;
  font-size: calc(var(--u) * 29);
  line-height: 1.5;
}
.dp-value--empty {
  color: #b3b3b3;
}

/* ---------- 输入框：透明底、无边框，高度 60rpx（占位文字 #b3b3b3） ---------- */
.dp-input {
  flex: 1;
  min-width: 0;
  height: calc(var(--u) * 60);
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #1a1a1a;
  font-family: inherit;
  font-size: calc(var(--u) * 29);
  line-height: 1.5;
}
.dp-input::placeholder,
.dp-note::placeholder {
  color: #b3b3b3;
}

/* ---------- .options / .option ---------- */
.dp-options {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: calc(var(--u) * 40);
}
.dp-option {
  color: #666666;
  font-size: calc(var(--u) * 28);
  line-height: 1.4;
}
.dp-option.is-active {
  color: #6a5acd;
  font-weight: 600;
}

/* ---------- .row--note / .note ---------- */
.dp-row--note {
  align-items: flex-start;
  padding-top: calc(var(--u) * 26);
  padding-bottom: calc(var(--u) * 22);
}
.dp-row--note .dp-label {
  line-height: 1.6;
}
.dp-note {
  flex: 1;
  min-width: 0;
  height: calc(var(--u) * 110);
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #1a1a1a;
  font-family: inherit;
  font-size: calc(var(--u) * 28);
  line-height: 1.6;
  resize: none;
}

/* ---------- .foot-note ---------- */
.dp-tip {
  display: block;
  padding: calc(var(--u) * 40) calc(var(--u) * 32) 0;
  color: #b3b3b3;
  font-size: calc(var(--u) * 21);
  line-height: 1.6;
}

/* ---------- 底部弹层：灰底带 + 白色 sheet（源码 .sheet / .sheet-head / .sheet-row） ---------- */
.dp-sheets {
  display: flex;
  flex-direction: column;
  gap: calc(var(--u) * 24);
  margin-top: calc(var(--u) * 40);
  padding: calc(var(--u) * 24) 0;
  background: #f7f7f8;
}
.dp-sheet {
  /* 源码 .sheet：padding-bottom: calc(20rpx + env(safe-area-inset-bottom)) */
  padding-bottom: calc(var(--u) * 20);
  background: #ffffff;
  border-top: 1px solid #ededed;
  border-bottom: 1px solid #ededed;
}
.dp-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-height: calc(var(--u) * 96);
  padding: 0 calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dp-sheet-title {
  color: #1a1a1a;
  font-size: calc(var(--u) * 30);
  font-weight: 600;
}
.dp-sheet-close {
  color: #999999;
  font-size: calc(var(--u) * 26);
}
.dp-sheet-row {
  display: flex;
  align-items: center;
  gap: calc(var(--u) * 16);
  box-sizing: content-box;
  min-height: calc(var(--u) * 96);
  padding: calc(var(--u) * 18) calc(var(--u) * 32);
  border-bottom: 1px solid #ededed;
}
.dp-sheet-name {
  flex: 1;
  min-width: 0;
  color: #1a1a1a;
  font-size: calc(var(--u) * 28);
  line-height: 1.4;
}
.dp-sheet-name.is-active {
  color: #6a5acd;
  font-weight: 600;
}

/* ---------- .submit-bar / .submit ---------- */
.dp-submit-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: calc(var(--u) * 16) calc(var(--u) * 32);
  border-top: 1px solid #ededed;
  background: #ffffff;
}
.dp-submit {
  display: flex;
  height: calc(var(--u) * 92);
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--u) * 4);
  background: #6a5acd;
  color: #ffffff;
  font-size: calc(var(--u) * 30);
}
</style>
