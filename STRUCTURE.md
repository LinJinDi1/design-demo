# 庆快校园设计台 · 结构速查

> 这份文档写给接手的人。看完你应该能回答三个问题：东西在哪、改哪里、为什么这么放。

## 一句话概括

**纯静态视觉稿**：Vite + Vue 3，把 38 个场景索引项（原版 17 + V5 21）塞进一个 390×888 的画布里。左边点场景、右边看效果，还能在「原版 / Wise / V5 / 现版」四套皮肤之间切换（默认 V5）。
没有后端、没有登录、没有接口请求 —— 页面上看到的所有文字、图片、评分，全部写死在 `src/fixtures.js`（现版是写在各自组件里的常量）。

「现版」是第 4 套皮肤：照 `quick-pick-main`（线上小程序）源码 1:1 复刻的 23 个页面（5 个 tab 页 + 18 个二级页），详情看 `LIVE-BRANCH.md`。

它不是真正的微信小程序，也不能提交任何数据，只用来看设计和评审。

---

## 目录树：每个文件是干什么的

```
design-demo/
├─ index.html            入口 HTML，只有一行 <div id="app">，其余全靠 JS 渲染
├─ vite.config.js        ★ 构建配置：base:'/qingkuai/'、@/ 与 @app 别名、
│                          rpx→calc 的 PostCSS 插件、小程序标签改写插件
├─ package.json          三条命令：dev（开发）、build（打包）、preview（预览打包结果）；
│                          dev/build 前会自动跑 scripts/link-sass.cjs
├─ STRUCTURE.md          你正在看的这份文档
├─ LIVE-BRANCH.md        现版分支：可行性分析 + 复刻约定 + 边界
├─ .shoot.cjs            无头 Chrome 截图自检：node .shoot.cjs <scene> <design> [full]
├─ scripts/
│  └─ link-sass.cjs      把 quick-pick-main 的 sass 软链进本项目（复用它的依赖）
├─ src/
│  ├─ main.js       ★ 样式总入口：27 个 CSS 按顺序在这里 import，后加载的覆盖先加载的
│  ├─ App.vue        ★ 主控组件（约 4700 行）：桌面外壳 + 38 个场景的 v-if 分支，全项目最大的文件
│  ├─ fixtures.js    ★ 唯一数据源：场景列表、店铺、菜单、评价、好友……
│  ├─ uni-env.js     ★ 小程序运行时替身（全局 uni / getApp / wx），必须在 main.js 第一行引入
│  ├─ uni-components.js  uni-icons → 内联 SVG
│  ├─ mp-base.css        小程序标签改写成 HTML 后的基础行为（img[mode]、[scroll-x]）
│  ├─ tokens.js        颜色变量。⚠️ 当前没有任何文件引用它，历史遗留
│  ├─ v5-icons.js      V5 用的 SVG 图标（订单、投诉、板块…），按需从 App.vue 引入
│  ├─ components/     5 个小组件（见下）
│  ├─ live/           ★ 现版分支：registry.js + live.css + 23 个 Live*.vue + asset.js（约定见 live/README.md）
│  └─ *.css           25 个样式文件（见下）
└─ public/assets/       图片素材，按用途分目录（live/ 是从小程序复制过来的图标）
```

**components 目录**

| 文件 | 作用 |
|---|---|
| `PhoneShell.vue` | 手机外壳：状态栏 + 可滚动内容区 + 底部导航，所有页面都套在它里面 |
| `StatusBar.vue` | 顶部状态栏（时间、信号、微信胶囊）。⚠️ 它是 `absolute` 定位盖在内容上的 |
| `BottomNav.vue` | 底部导航。原版 / Wise 是五栏（首页 / 自提 / 校园 / 好友 / 我的），V5 换成四栏（首页 / 校园 / 交友 / 我的），现版是浮起来的「玻璃胶囊」五栏（照小程序 `custom-tab-bar/` 复刻） |
| `IconSymbol.vue` | 图标组件，`<IconSymbol name="search" :size="20" />` 这样用 |
| `ShopCard.vue` | 店铺卡片。⚠️ 目前没人引用它，页面上的卡片都是就地写的 |

---

## 四个设计版本怎么切

顶上侧边栏有个「设计版本」四选一：**原版 / Wise / V5 / 现版**，本质就是一个 `design` 变量：

| 版本 | 是什么 | 地址参数 |
|---|---|---|
| 原版 | 按线上截图 1:1 复刻的视觉（旧版线上） | `?design=original`（或不带参数时切到该按钮） |
| Wise | 早前做的一版改版（青柠绿 · 鼠尾草灰 · 24px 圆角） | `?design=wise` |
| V5 | 最新一版，照 `庆快校园-V5新版.html` 参考稿做，已铺到 21 个页面（首页、进店逛、搜索、灵感小盒、MBTI 食堂、店铺详情、校园三板块、用户主页、我的发布 / 订单 / 消息、动态详情、通知） | `?design=v5` |
| **现版** | **照 `quick-pick-main` 源码复刻的线上真实样式（品牌紫 · 玻璃胶囊底栏 · rpx 换算 0.52）** | `?design=live` |

地址栏示例：`http://localhost:5173/qingkuai/?scene=home&design=v5`

现版共 23 个页面：5 个 tab 页（`home / stalls / campus / friends / profile`）+ 2 个自提分栏（`businesscenter / searchdining`）+ 18 个二级页。切到现版时左侧索引只列这些页面（由 `src/live/registry.js` 自动收集）。新增现版页面只需在 `src/live/` 下加一个带 `meta` 的 `Live*.vue`，`App.vue` 不用动。

加一个新场景要动 **三个地方**：`fixtures.js` 的 `scenes` 数组 → `App.vue` 加一个 `v-else-if` 分支 → 写对应 CSS。
现版不写 `fixtures.js`，而是新建一个 `src/live/LiveXxx.vue`，数据写在组件里。

---

## App.vue 怎么读

文件很大，但结构很固定，按这个顺序看：

1. **`<script setup>` 上半段**：状态和计算属性（`current` 当前场景、`design` 设计版本、各种 tab 状态）。V5 的几个核心状态也在这里：`v5NavStack` 导航栈、`v5Orders` 订单表、`v5Reports` 投诉记录
2. **`<aside class="sidebar">`**：左侧场景索引，按钮由 `fixtures.js` 的 `scenes` 自动生成
3. **`<section class="stage">`**：右侧舞台，里面是手机壳
4. **一长串 `v-if / v-else-if`**：每个分支就是一个手机页面
5. **链尾的弹层们**：发布、编辑、删除确认、投诉、接单留联系方式 —— 这些要跨页面复用，所以放在 if 链之后、手机壳之内

场景分支对照表（在 App.vue 里搜「关键词」就能跳过去）：

| 分组 | 页面 | 搜索关键词 | 备注 |
|---|---|---|---|
| 首页 | 首页 · V5 | `design === 'v5'` | 最新，第一屏 |
| 首页 | 首页 · Wise | `wise-home-page` | 含深色/浅色切换 |
| 首页 | 首页 · 原版 | `class="screen home-real"` | 轮播 + 快捷入口 + 金榜卡 |
| 首页 | 庆快金榜 | `golden-board` | 原版 / Wise 两套 |
| 首页 | 开盲盒 | `wise-random-store` | 随机抽店，5 秒后停 |
| 校园觅食 | 桥苑小摊 / 商业中心 / 饭堂 | `food-screen` | 三个 tab 共用一个分支 |
| 校园 | 校园服务 | `current === 'campus'` | 原版 / Wise 两套 |
| 校园 | 图书馆 | `current === 'library'` | 原版 / Wise 两套 |
| 社交 | 好友 | `current === 'friends'` | 原版 / Wise 两套 |
| 个人 | 我的 | `current === 'profile'` | 原版 / Wise 两套 |
| 个人 | 店铺收藏 | `current === 'favorites'` | 原版 / Wise 两套 |
| 个人 | 用户公开主页 | `public-profile` | 原版 / Wise 两套 |
| 店铺详情 | 徐豆豆（介绍/菜单/留言）、老潼关 | `store-detail` | 靠 `isTongguan` 区分两家店 |
| 店铺详情 | 林胡子 · 评价抽屉 | `linhuzi-reviews` | 原版 / Wise 两套 |
| **V5 首页** | 首页 · V5 | `v5-zone` 之前那一段 | 推广横滑卡 + 金刚区 + 推荐店铺 |
| **V5 首页** | 进店逛 / 搜索 / 今天吃什么 / 灵感小盒 / MBTI 食堂 | `v5-zone`、`v5-search`、`v5-gacha`、`v5-idea`、`v5-mbti` | 一页一个分支 |
| **V5 店铺** | 店铺详情 · V5 | `v5-detail` | 卡片点进去，含评价 / 留言 |
| **V5 校园** | 失物招领 / 闲置小铺 / 搭把手（列表 + 详情，共 6 个分支） | `v5-lost`、`v5-market`、`v5-help` | 三个板块结构同构，发布弹层共用 |
| **V5 我的** | 我的发布 / 我的订单 / 订单详情 / 我的消息 / 新增关注 | `v5-myposts`、`v5-orders`、`v5-order`、`v5-notices`、`v5-followers` | 订单是跨板块的，见下 |
| **V5 社交** | 用户主页 / 动态详情 / 通知（列表 + 详情） | `v5-user`、`v5-feed-detail`、`v5-announce` | 点头像进主页，主页评分取真实评价 |

> 分支顺序有讲究：V5 / Wise 的判断写在原版前面，因为 `v-else-if` 只匹配第一个成立的。新增分支时记得插在对应位置。
>
> ⚠️ **别把弹层插进这条 if 链中间** —— 链尾有个不带条件的 `v-else` 兜底分支（原版店铺详情），任何插在中间的元素都会把这些页面顶掉。弹层（发布 / 编辑 / 删除确认 / 投诉 / 接单留联系方式）统一放在 `</PhoneShell>` 之前。

---

## 25 个 CSS 文件是什么关系

按 `main.js` 的 import 顺序分五层，**后面的覆盖前面的**，别随意调顺序：

| 层 | 文件 | 作用 |
|---|---|---|
| ① 底座 | `styles.css` | 桌面设计台外壳、手机画布、状态栏，以及**原版全部页面**的样式 |
| ② 修补 | `round2.css` `round3.css` | 第 2、3 轮视觉微调（状态栏、底栏、详情尺寸…） |
| ② 修补 | `acceptance-fix.css` | 验收尺寸修正：把 1080×2460 参考图等比落到 390×888 |
| ② 修补 | `round2-nav.css` | 底部导航图标尺寸 |
| ② 修补 | `source-fidelity.css` | 首页 / 觅食页高保真，按 750rpx 源样式折算 |
| ③ Wise | `wise.css` | Wise 主题总样式：变量 + `.wise-theme` 全局规则 |
| ③ Wise | `wise-*.css`（10 个） | Wise 版各分页，一页一个文件 |
| ③ Wise | `sticky-tabs.css` | 长列表页的吸顶 tab |
| ④ 补充 | `original-pages.css` `reference-redesign.css` `*-refine.css` | 原版补充、评价抽屉与公开主页、两处精修 |
| ⑤ V5 | `v5-home.css` | V5 首页，类名全部 `v5-` 前缀，不污染其它版本 |
| ⑤ V5 | `v5-pages.css` | V5 二级页通用骨架（顶栏、卡片、空态、滚动容器） |
| ⑤ V5 | `v5-tabs.css` | V5 各分页：校园三板块、我的发布 / 订单 / 消息、订单详情、投诉弹层 |
| ⑧ 现版 | `live/live.css` | 现版底座：`--u` 单位桥（1rpx=0.52px）、`--live-*` 颜色、`.live-page`、tab 页共用头部、玻璃胶囊底栏 |

现版的五个页面各自带 `<style scoped>`（`live/LiveHome.vue` 等），不进这 25 个全局 CSS，只共用 `live/live.css` 里的变量和基类。

**公共约定**：Wise 的样式几乎都写在 `.wise-theme` 或 `[data-design="wise"]` 选择器里；V5 同理用 `[data-design="v5"]` 和 `.v5-` 前缀。根容器上的 `data-scene` / `data-design` 两个属性就是给 CSS 做作用域限定的钩子。

---

## 复用小程序的原生组件（现版）

现版可以直接 import `quick-pick-main` 里的组件，不用手抄模板：

```vue
<script setup>
import StallCard from '@app/components/StallCard/StallCard.vue';
</script>

<StallCard v-for="stall in stalls" :key="stall.id" :stall="stall" />
```

四层适配都已在 `vite.config.js` / `src/` 里做好，改组件时不用管：

| 层 | 谁负责 | 说明 |
|---|---|---|
| `rpx` → `calc(var(--u) * N)` | `vite.config.js` 的 `rpxToCalc` | 只作用于 `quick-pick-main` 的文件；`--u` 由 `live.css` 定义 |
| `view/text/image/scroll-view/swiper/block` → HTML 标签 | `vite.config.js` 的 `mpTags` | `view/text/image` 是 Vue 保留名，**不能**用 `app.component` 注册 |
| `uni` / `getApp` / `wx` | `src/uni-env.js` | 空实现：不发请求、不报错，`getSystemInfoSync` 固定 390×844 |
| `<uni-icons>` | `src/uni-components.js` | 字体图标换成同形状内联 SVG |
| `@/styles/colors.scss` + `<style lang="scss">` | `vite.config.js` 的 `@` 别名 + `scripts/link-sass.cjs` | sass 复用 app 的 node_modules |

⚠️ 两个已知限制：
1. 源码样式里若出现 **元素选择器**（`.swiper-box image {...}`），标签改写后会失配，需要手动补类名；
2. 组件若在 `mounted` 里请求接口（`DiscoveryFeed`、`friendCard`），静态稿会拿到空数据，要先把 `server/generated/*` stub 掉。

已经接上的：`StallCard`（含 `StallLiveStatus`、`tip`）、`hot`。其余仍为手写结构。

---

## public/assets 目录说明

| 目录 | 内容 |
|---|---|
| `tabbar/` | 底部导航图标（普通态 / 选中态两套） |
| `product-icons/` | 功能图标：签到、反馈、地图、点赞… |
| `original-pages/` | 原版截图切片：收藏列表、金榜、随机店铺 |
| `source-fidelity/` | 高保真素材：店铺实拍、轮播图、快捷入口图标 |
| `screenshot-crops/` | 从参考图裁下来的局部（店铺门头、点餐码…） |
| `*.ico / *.png / *.svg` | 散装通用图标：Logo、搜索、设置、礼物、熊猫… |

---

## 想改 X，应该动哪里

| 我想…… | 去改 |
|---|---|
| 改店铺名、评分、菜单、好友昵称 | `src/fixtures.js` |
| 改首页金刚区的图标和文字 | `fixtures.js` 的 `v5Entries`（V5）/ `homeShortcuts`（原版） |
| 改 V5 首页的样式 | `src/v5-home.css` |
| 改 V5 二级页通用骨架（顶栏 / 卡片 / 空态 / 滚动区） | `src/v5-pages.css` |
| 改 V5 校园三板块、我的发布 / 订单 / 消息、订单详情 | `src/v5-tabs.css` |
| 加一个 V5 图标 | `src/v5-icons.js` |
| 改 Wise 某页的样式 | 对应的 `wise-*.css` |
| 改现版某页的样式 | 对应 `src/live/LiveXxx.vue` 的 `<style scoped>`；共用部分（底栏 / tab 页头部 / 单位）改 `src/live/live.css` |
| 现版新加一个页面 | 新建 `src/live/LiveXxx.vue`（数据写在组件里）→ `App.vue` 的 if 链顶部加一条 `v-else-if` → 把场景 id 加进 `LIVE_SCENES` |
| 校现版和线上对不对得上 | `node .shoot.cjs <scene> live` 截图，和 `quick-pick-main` 源码里的 rpx 数字逐项核 |
| 现版想直接复用小程序的某个组件 | `import X from '@app/components/...'`，按源码 props 传静态数据；先确认它的样式里没有元素选择器、`mounted` 里没有接口 |
| 改原版某页的样式 | `styles.css`（底座），或对应的修补文件 |
| 新增一个页面 | `fixtures.js` 加场景 → `App.vue` 加分支 → 新建 CSS 并在 `main.js` import |
| 改订单 / 投诉 / 互评的逻辑 | `App.vue` 里 `v5Orders`、`v5Reports` 那两段；预置订单也在那里 |
| 整体换配色 | 谨慎：颜色散落在各个 CSS 里硬编码，`tokens.js` 目前没接上 |

---

## 几个踩过的坑

1. **状态栏会盖住内容**：`.status-bar` 是 `absolute` + `z-index:15`，高 46px。自定义页面必须在顶部留出 ≥46px 的 padding（`.screen` 默认就是 46px），否则第一行内容会被压在状态栏下面。
2. **访问地址要带 `/qingkuai/`**：`vite.config.js` 设了 `base`，只开 `localhost:5173` 是空白页；打包后的 `dist` 也必须挂静态服务器，双击 `index.html` 打不开。
3. **弹层必须挂在手机壳里面**：`.board-mask` 用的是 `position:absolute; inset:0`，定位基准是最近的已定位祖先。挂在 `PhoneShell` **外面**就会以整个浏览器窗口为基准，宽屏上被拉成整屏宽（表现为「没适应屏幕」）。挂在 `PhoneShell` 插槽里，基准才是 `.phone`，宽高自动 = 390×888。
4. **二级页的返回不能写死**：早期版本把返回箭头写死成 `selectScene('campus')`，导致从交友点头像进个人主页后按返回会跳到校园页。现在统一走导航栈：`v5Nav(to)` 入场压栈、`v5Back(fallback)` 出栈回上一页，根页（`V5_ROOTS = home/campus/friends/profile`）会清空栈。新增二级页记得用这两个函数，别直接改 `current`。
5. **headless 截图里量不准弹层位置**：无头浏览器不推进 CSS 动画，弹层会停在 `translateY(100%)` 的起始帧，量出来像「跑到屏幕外」。截图前注入 `*{animation:none !important;transition:none !important}` 再量。
6. **现版的单位不是 px**：小程序源码全是 `rpx`（750 稿），画布是 390px，所以要写 `calc(var(--u) * 28)` 而不是 `14.5px`——`--u` 就是 0.52。别看渲染结果像整数就改成 px，改了就再也对不上源码了。
7. **现版的按钮要显式 `background: transparent`**：`styles.css` 只重置了 `border`，没重置 `background`，而 `.live-tabbar` 在 `.live-page` 外面，UA 默认的 `buttonface` 白底会在玻璃底栏里画出五个白方块。
