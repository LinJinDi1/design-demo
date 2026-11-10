# src/live —— 现版（live）页面复刻约定

这套皮肤的目标：把 `quick-pick-main`（线上小程序）的页面在 390×888 的静态画布上 **1:1 还原**。
下面这些约定是硬性的，新增页面请照着做。

## 1. 一个页面 = 一个文件

`src/live/LiveXxx.vue`，由 `registry.js` 用 `import.meta.glob` 自动收集，**不用改 App.vue**。

文件必须同时导出 `meta`：

```vue
<script>
export const meta = {
  id: 'detailstore',      // 场景 id，地址栏 ?scene=detailstore
  label: '店铺详情',       // 左侧索引文案
  note: '点店铺卡进入',    // 左侧索引备注（一行）
  group: '首页',          // 首页 / 校园觅食 / 校园 / 社交 / 个人 / 其他
  tab: '',                // 属于哪个底部 tab：home / discover / campus / friends / profile；详情页留空
  order: 4,               // 同组内排序
};
</script>

<script setup>
...
</script>
```

`tab` 留空 = 不显示底部玻璃胶囊（详情页、二级页），画布是满屏的。

## 2. 单位：照抄 rpx，用 `--u` 换算

小程序 750rpx = 画布 390px，所以 `1rpx = 0.52px`，`live.css` 里定义了 `--u: 0.52px`。

```css
/* 源码 padding: 24rpx 28rpx; */
padding: calc(var(--u) * 24) calc(var(--u) * 28);
```

- **不要**自己把 rpx 换算成小数 px——要能跟源码逐行对照。
- `1px` 细线（源码的 `1rpx`）可以直接写 `1px`。
- `uni-icons` 的 `size` 本来就是 px，原样写。

## 3. 页面骨架

```vue
<template>
  <div class="live-page live-xxx">   <!-- live-page 负责状态栏 46px 留白 + 底部留白 -->
    ...
  </div>
</template>
```

- `.live-page` 已给 `padding-top: 46px`（状态栏）和 `padding-bottom`（给底栏让位）。
  详情页（`tab: ''`）没有底栏，自己在根上把底部 padding 调小即可。
- 吸顶头部用 `.live-sticky-head`（`position: sticky; top: 46px`），tab 页头部还可以直接用
  `live.css` 里的 `.tab-section-header / .tab-section-title / .tab-section-subtitle / .tab-search-entry`（对应源码 `styles/tab-header.scss`）。
- 详情页的返回栏自己画：`position: sticky; top: 46px`，高 44–48px，左边返回箭头（`<uni-icons type="back" />` 或内联 SVG）。

## 4. 直接用小程序原生组件（优先）

能复用就复用，还原度最高：

```js
import StallCard from '@app/components/StallCard/StallCard.vue';
```

已打通的适配：`rpx → calc(var(--u)*N)`、`view/text/image/scroll-view/swiper/block` 标签改写、
`uni` / `getApp` 运行时替身、`@/styles/*.scss` 别名、sass。

- 组件在 `mounted` 里发请求的（`DiscoveryFeed`、`friendCard`、`StallList`）**别直接接**，静态稿会拿到空数据。
- 源码样式里若写了元素选择器（`.swiper-box image {...}`），标签改写后会失配，只能手写。

## 5. 图标与图片

- 图标优先用全局 `<uni-icons type="..." :size="16" color="#999" />`（已注册，映射见 `src/uni-components.js`；
  常用的 star / star-filled / location / calendar / shop / heart / person / right / search / notification /
  refreshempty / more / close / plus / checkmarkempty / navigate / auth 都在）。
  **缺的图标用内联 SVG 自己画**，不要改 `uni-components.js`（多人并行会冲突）。
- 图片走 `liveAsset('/assets/...')`（会补上 `/qingkuai/` 前缀）。可用素材：
  `public/assets/source-fidelity/`（店铺实拍、快捷入口图标）、`screenshot-crops/`（截图切片）、
  `original-pages/`（收藏列表等）、`product-icons/`（签到/反馈/地图…）、`live/`（从小程序复制的图标）。

## 6. 类名：必须加页面前缀

设计台的旧皮肤（`styles.css`、`round2/3.css`、`acceptance-fix.css`、`source-fidelity.css`、`wise.css`）
里留着大量和源码同名的全局规则（`.section`、`.friend-row`、`.pickup-header`、`.service-card`、`.profile-stat`…），
**会漏进现版页面把尺寸改坏**。

所以现版页面的 class 一律自带前缀，例如 `detailstore` 用 `.dt-`、`library` 用 `.lib-`：

```css
.dt-hero { ... }        /* 而不是 .store-hero */
.dt-card { ... }
```

复用原生组件时不用管（它自己是 scoped）。

## 7. 自检（每个页面都要做）

```bash
node .shoot.cjs <meta.id> live          # 首屏 → .shots/live-<id>.png
node .shoot.cjs <meta.id> live full     # 整页 → .shots/live-<id>-full.png
```

用 `read_image` 看截图，和源码里的 rpx 数字逐项核：字号、间距、圆角、颜色、层级。
脚本会打印 `scrollWidth`，**必须等于 390**（否则有横向溢出）。

## 8. 不要动的文件

`src/App.vue`、`src/live/registry.js`、`src/live/live.css`、`src/uni-*.js`、`src/mp-base.css`、
`vite.config.js`、`package.json`、`STRUCTURE.md`、`LIVE-BRANCH.md`，以及其他页面文件。
新增页面只写自己那一个 `LiveXxx.vue`（需要图标时加到 `public/assets/live/` 下）。
