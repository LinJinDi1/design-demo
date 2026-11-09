# 现版（live）分支：从 quick-pick-main 的样式结构，到 design-demo 的第 4 套皮肤

> 这份文档回答两件事：
> 1. **可不可行**——把线上小程序（`quick-pick-main`）的样式结构搬进静态设计台（`_design-demo`），做成一套可切换的新分支；
> 2. **怎么落地的**——这次实际做了什么、边界在哪、后面怎么继续。

---

## 一、结论先说

**可行，而且比前两套皮肤更省事，但只适合「视觉复刻」，不适合「结构继承」。**

| 判断项 | 结论 |
|---|---|
| 能不能加第 4 套皮肤 | 能。设计台本来就是 `design` 一个变量 + CSS 作用域，加 `live` 只是第 4 个取值 |
| 能不能 1:1 还原 | 视觉层能到 90%+；`rpx → px` 有 1 个固定换算系数（0.52），不是逐像素猜 |
| 能不能直接复用小程序源码 | 不能。WXML 标签、`uni-*` 组件、`swiper/scroll-view`、原生自定义 tabBar、接口数据都得换掉 |
| 值不值得 | 值得。它把「设计师照着截图猜」变成「照着源码数字抄」，也让改版前后可以并排对比 |
| 最大的坑 | 源码会继续变，设计台不会自动跟；所以它是「某个提交的快照」，不是「活的设计系统」 |

---

## 二、主仓库的样式结构：五层，但只有一层是「共享」的

统计口径：`quick-pick-main` 内 115 个 `.vue`、122 个 vue/scss/css 文件（排除 node_modules / unpackage / uni_modules / wxcomponents）。

### 2.1 量化画像

| 指标 | 数值 | 含义 |
|---|---|---|
| `.vue` 文件 | 115 | 5 个主包页面 + 16 个 `pageuser` + 40 个 `pagesLog` + 组件 |
| `<style>` 块 | 114（scoped 63 / scss 35） | 一半以上是 scoped，样式基本跟着组件走 |
| style 总行数 | 17,775 | 样式量和业务代码同量级 |
| `rpx` 出现次数 | 3,684 | **绝对主导**，设计稿按 750rpx |
| `px` 出现次数 | 376 | 少量固定像素（1px 细线、状态栏、安全区） |
| hex 颜色出现次数 | 1,492 | 其中去重后 **615 种**——绝大多数只出现一两次 |
| 引用 `styles/*.scss` 的文件 | 25 | 只覆盖 22% 的组件/页面 |

数字说明一件事：**这个仓库没有真正的 token 层**。`styles/colors.scss` 定义了 24 个语义变量，但只有 25 个文件引它；全仓库 `#6a5acd`（品牌紫）被硬编码了 90 次，`#fff/#ffffff` 两种写法混用 217 次，615 种颜色里大部分是一次性的。

### 2.2 五个层次

```
① 变量层    uni.scss → @import uni_modules/uni-scss/variables.scss（框架自带，几乎没用上）
            styles/colors.scss   品牌色/中性色/阴影/圆角（24 个变量，25 个文件引用）
            styles/daike.scss    体验课专用（3 个文件引用）
            styles/favorites.scss 收藏页专用（2 个文件引用）
            styles/tab-header.scss tab 页共用头部（3 个页面引用）

② 全局层    App.vue 的 <style>：uni-scss、customicons.css、page 背景 #f5f5f5、
            四个 flex 工具类、隐藏滚动条

③ 页面层    pages/*、pageuser/*、pagesLog/* 每页一个 scoped <style>，
            rpx 写死，颜色写死，靠内联 style 传安全区数值

④ 组件层    components/* 各自 scoped，StallCard / StallList / DiscoveryFeed / StallComment* 等
            自成一套；组件间靠 class 前缀（stall-、discovery-、daike-）区隔

⑤ 平台层    custom-tab-bar/（原生 wxml/wxss 的「玻璃胶囊」底栏，5 栏，独立 icons/）
            pages.json 的 globalStyle（navigationStyle: custom、FAB 组件清单）
            wxcomponents/vant-weapp（外部组件，样式不受仓库控制）
```

### 2.3 结构上的三个特征（决定了复刻策略）

1. **单位统一**：全仓库 3,684 处 `rpx`，750rpx = 屏宽。设计台是 390px 画布 → `1rpx = 390/750 = 0.52px`，是一个**固定系数**，不需要逐元素估。
2. **颜色离散**：品牌紫 `#6a5acd` 出现 90 次，但也有 `#7153bf / #8f75d4 / #6a5acd` 三个近似值混用于 tab 选中态——复刻时必须照抄，不能「顺手归并」，否则和线上对不上。
3. **样式与业务耦合**：安全区高度、`headerLayout` 通过内联 style 注入（`paddingTop: capsule.top`），不是纯 CSS。静态稿里只能用「状态栏 46px」这个固定值替代。

---

## 三、design-demo 为什么能装下第 4 套皮肤

设计台的皮肤机制只有三件事，都已经是现成的：

```
design 变量（original | wise | v5 | live）
  ├─ 根容器 [data-design] + 可选 .wise-theme 类  → 给 CSS 做作用域钩子
  ├─ main.js 按顺序 import 的 CSS 层               → 后加载覆盖先加载
  └─ App.vue 里一长串 v-if / v-else-if             → 每个分支 = 一个手机页面
```

- **皮肤 = CSS 作用域 + 一组分支**，没有路由、没有主题运行时，所以加一套的成本是线性的。
- 画布固定 390×888，`.status-bar` 绝对定位高 46px，`.phone-content` 内部滚动 —— 和「小程序自定义导航栏 + 页面滚动」的结构天然同构。
- 底栏由 `BottomNav.vue` 按 `design` 渲染：原版/Wise 用位图五栏，V5 用内联 SVG 四栏，现版再加一个「玻璃胶囊」五栏即可。

### 复刻前后对照

| 层 | quick-pick-main | design-demo 现版分支 |
|---|---|---|
| 单位 | `rpx`（750 稿） | `calc(var(--u) * N)`，`--u: 0.52px`，**N 原样抄源码** |
| 颜色 | hex 写死 | 同 hex；品牌色收到 `--live-*` 变量，值仍取自 `colors.scss` |
| 页面 | 一个 `.vue` = 一个页面 | 一个 `src/live/LiveXxx.vue` = 一个 tab 页 |
| 底栏 | `custom-tab-bar/`（原生 wxml） | `BottomNav.vue` 的 `live-tabbar` 分支，图标直接复制原图 |
| 图片 | 接口返回 / CDN | `public/assets/` 本地素材 + `liveAsset()` 拼 BASE_URL |
| 数据 | 接口 + 登录态 + 分页 | 常量数组，3–5 条真实示例数据 |

---

## 四、这次实际落地的内容

### 4.1 新增文件

| 文件 | 作用 |
|---|---|
| `src/live/live.css` | 现版底座：`--u` 单位桥、`--live-*` 颜色、`.live-page`、tab 页共用头部（抄 `tab-header.scss`）、玻璃胶囊底栏 |
| `src/live/LiveHome.vue` | 首页（`pages/homepage/homepage.vue` + **原生 `hot.vue`** + `DiscoveryFeed`） |
| `src/live/LiveList.vue` | 自提 / 校园觅食（`pages/list/list.vue` + `StallList` 结构 + **原生 `StallCard`**） |
| `src/live/LiveCampus.vue` | 校园（`pages/campus/campus.vue`） |
| `src/live/LiveFriends.vue` | 好友（`pagesFriend/index/index.vue`） |
| `src/live/LiveProfile.vue` | 我的（`pages/logs/logs.vue`） |
| `src/live/asset.js` | 图片路径助手（走 Vite `BASE_URL`） |
| `src/uni-env.js` | 运行时替身：全局 `uni` / `getApp` / `wx`（不发请求、不报错） |
| `src/uni-components.js` | `uni-icons` → 同形状内联 SVG（与源码 `type` / `size` / `color` 对齐） |
| `src/mp-base.css` | 小程序标签改写成 HTML 后的基础行为（`img[mode]` 裁切、`[scroll-x]` 溢出） |
| `scripts/link-sass.cjs` | 把 `quick-pick-main/node_modules/sass` 软链进来（`npm run dev` 前自动执行） |
| `public/assets/live/` | 从主仓库复制的图标：`static/home/*.svg`、`custom-tab-bar/icons/*.png`、`static/tushuguan.png`、`static/星星.png` |

### 4.2 改动文件（都很小）

| 文件 | 改动 |
|---|---|
| `src/App.vue` | `design` 接受 `live`；皮肤切换器第 4 个按钮「现版」；切到现版时左侧场景只留 5 个 tab 页；if 链最前面插 5 个 `v-if/v-else-if`（原首个分支降级为 `v-else-if`） |
| `src/components/BottomNav.vue` | 新增 `live-tabbar` 分支：玻璃胶囊 + 5 栏 + 位图图标 |
| `src/main.js` | 第一行 `import './uni-env.js'`；创建 app 后 `installUniComponents`；末尾追加 `live/live.css`（第 ⑧ 层）和 `mp-base.css`（第 ⑨ 层） |
| `vite.config.js` | 新增三条能力：`@/` → quick-pick-main 的别名、`rpx → calc(var(--u) * N)` 的 PostCSS 转换、小程序标签改写插件；并放开 `server.fs.allow` |
| `package.json` | 新增 `predev` / `prebuild` 钩子跑 `scripts/link-sass.cjs` |

### 4.3 怎么用

```
http://localhost:5173/qingkuai/?scene=home&design=live     # 首页
http://localhost:5173/qingkuai/?scene=stalls&design=live   # 自提
http://localhost:5173/qingkuai/?scene=campus&design=live   # 校园
http://localhost:5173/qingkuai/?scene=friends&design=live  # 好友
http://localhost:5173/qingkuai/?scene=profile&design=live  # 我的
```

左侧「设计版本」四选一：原版 / Wise / V5 / **现版**。

### 4.4 五个页面的来源对照

| 页面 | 组件 | 主仓库来源 | 复刻要点 |
|---|---|---|---|
| 首页 | `LiveHome.vue` | `pages/homepage/homepage.vue` + `components/DiscoveryFeed` + `components/hot` | 品牌顶栏、去哪吃 3 项、快捷入口 3 项、金榜入口 + 新店报到、猜你喜欢双列 |
| 自提 | `LiveList.vue` | `pages/list/list.vue` + `components/StallList` + `components/StallCard` | 吸顶头 + 搜索 + 三 tab、品类/位置 chips、「共 132 家 · 已展示 5 家」+ 最热/最新、5 张小摊卡 |
| 校园 | `LiveCampus.vue` | `pages/campus/campus.vue` | 标题 + 轮播（引言 / 作者 / 圆点）+ 三张整宽服务卡（图书馆 / 大学体验课 / 庆快画廊） |
| 好友 | `LiveFriends.vue` | `pagesFriend/index/index.vue` + `components/friendCard` | 吸顶头 + 搜索、消息 4 宫格（未读角标）、我的好友列表、认识新同学 |
| 我的 | `LiveProfile.vue` | `pages/logs/logs.vue` | 灰底身份区（头像 / QuickID / 简介 / 四统计）、我的收藏卡、工具 3 列、服务 2×3 宫格 |

每页都只做「已加载完成」的终态：没有骨架屏、空态、分页、下拉刷新、弹层和按压动效。

### 4.5 截图自检

仓库根 `.shoot.cjs` 用无头 Chrome + CDP 截 `.phone` 画布（不依赖 puppeteer）：

```bash
node .shoot.cjs home live        # 首屏 → .shots/live-home.png
node .shoot.cjs home live full   # 整页（撑开手机壳）→ .shots/live-home-full.png
```

换页面只换第一个参数；换皮肤换成 `original / wise / v5`。脚本会等所有图片解码完再截，
否则底栏那十几个 PNG 图标会截成空白。

### 4.6 关键一步：直接加载小程序的组件，而不是抄一遍

只靠「照抄 rpx 数字」永远会有 1–2px 的偏差，真正保证还原度的办法是**用同一份组件源码**。
设计台现在具备这个能力：`import StallCard from '@app/components/StallCard/StallCard.vue'`
就能把线上那张小摊卡（含 `StallLiveStatus`、`tip` 标签）原样渲染出来。

四个必要的适配层，缺一不可：

| 层 | 文件 | 解决什么 |
|---|---|---|
| 单位 | `vite.config.js` 里的 `rpxToCalc` PostCSS 插件 | 把 app 源码里的 `Nrpx` 换成 `calc(var(--u) * N)`（只处理 quick-pick-main，设计台自己的 CSS 不动） |
| 标签 | `vite.config.js` 里的 `mpTags` 插件 | `view→div`、`text→span`、`image→img`、`scroll-view→div`、`swiper→div`、`block→template`。**不能**把 `view/text/image` 注册成 Vue 组件——它们是内置保留 tag |
| 运行时 | `src/uni-env.js` | 全局 `uni` / `getApp` / `wx` 的空实现（`getSystemInfoSync` 固定返回 390×844、`request` 直接 reject），组件里的业务调用不会炸 |
| 样式 | `@/` 别名 + `scripts/link-sass.cjs` | `@import '@/styles/colors.scss'` 能解析；`<style lang="scss">` 有 sass 可用（复用 app 的 node_modules，不给设计台加依赖） |

已经切到原生组件的：**自提页的 `StallCard`**（连带 `StallLiveStatus`、`tip`）、**首页的 `hot`（新店报到）**。
其余页面（校园 / 好友 / 我的）仍是手写结构——它们的版式简单，手写反而更好改。

还没接的、以及为什么：

| 组件 | 卡在哪 |
|---|---|
| `StallList` | 内部有游标分页、分类/位置接口、下拉刷新，接进来要连 mock 一起做 |
| `DiscoveryFeed` | `mounted` 就发请求，静态稿会得到空列表 |
| `friendCard` | `mounted` 调关注状态接口；渲染层没问题，但需要先 stub `server/generated/social.js` |
| `pages/*.vue` 整页 | 依赖 `onLoad/onShow` 生命周期、`getApp().globalData`、SSE；而且页面样式里常出现 `image {}` 这类元素选择器，标签改写后选择器会失配 |

> 元素选择器这条要注意：标签从 `<image>` 改成 `<img>` 后，源码里 `.swiper-box image {...}` 这种选择器就不再命中。
> 复用某个组件前先 `grep -n " image\b\| view\b"` 看一眼它的样式块，有就手动补类名。

---

## 五、可行性的边界：哪些复刻不了

| 类别 | 具体 | 处理方式 |
|---|---|---|
| 组件语义 | `swiper`、`scroll-view`、`cover-view`、`uni-icons`、`van-*`（vant-weapp） | 用静态结构 + 内联 SVG 近似；轮播只画第一屏 |
| 动态数据 | 分页游标、SSE 未读数、登录态、骨架屏 | 硬编码「已加载完成」的终态 |
| 平台能力 | 胶囊按钮安全区、`uni.getMenuButtonBoundingClientRect`、原生 tabBar 切换动画 | 用 46px 状态栏 + 固定内边距替代 |
| 交互态 | hover-class、animation、下拉刷新、弹层进出场 | 只保留静态帧；必要时手写 `:hover` |
| 图片 | 接口返回的店铺图 | 用 `public/assets/` 既有素材占位（同名店铺优先复用） |
| 亚像素 | `0.52` 系数会产生小数 | `calc()` 交给浏览器，不四舍五入，保证与源码比例一致 |

---

## 六、风险与维护成本

1. **快照会过期**：现版分支是「按某个提交复刻」的，源码再改版就不同步。建议在文件头写清对应提交/日期，并把「同步现版」当成一次明确任务，而不是日常动作。
2. **旧皮肤的全局类会漏进来（实测最大的坑）**：`styles.css / round2.css / round3.css / acceptance-fix.css / source-fidelity.css / wise.css` 里留着大量**和源码同名**的规则——`.pickup-header`、`.pickup-tabs`、`.pickup-tab`、`.home-shortcut(s)`、`.friend-row`、`.friend-avatar`、`.message-grid`、`.section`、`.service-card`、`.profile-avatar`、`.profile-stat(s)`。现版页面只要沿用源码类名，就会被这些旧规则悄悄改尺寸（实测：小摊页标题多推 14px、tab 被撑到 49px；好友行被撑到 76px）。两个办法：给现版组件加根类前缀提高特异性（`.live-friends .friend-row`），或者干脆换类名（`list-header / list-tabs`）。
3. **双份样式**：`live.css` 和 `tab-header.scss` 是同一套规则的两份拷贝，改一边忘一边就会分叉。
4. **硬编码颜色继续扩散**：现版分支照抄 hex 是对的（为了像），但它也会继承「615 种颜色」的问题，不宜作为新设计的起点。
5. **底栏尺寸靠常量**：`116rpx` 高、`12rpx` 底距是抄原生组件的，若主仓库改底栏，这边要手动跟。
6. **图标只能近似**：`uni-icons` 是字体图标，换成内联 SVG 后字形有细微差别，不适合再做像素级对比。

---

## 七、如果要从「复刻」升级成「设计基线」

三步，按投入从低到高：

1. **提炼 token**：把 `--live-*` 从「现版专用」提升为设计台全局 token，并把 `colors.scss` 里 24 个变量作为唯一来源（图标、卡片、状态色都走变量）。
2. **抽公共件**：把现版五个页面里重复的「tab 页头部 / 搜索条 / 卡片 / 评分芯片 / 玻璃底栏」抽到 `src/live/components/`，新页面只组合。
3. **加视觉回归**：`.shoot.cjs` 已经是可脚本化的，串成「五页 × 两态」的截图基线，改样式后跑一次 diff，比人眼可靠。

做到第 3 步，"design-demo 上的现版" 就等于一份可回归的线上视觉基线，而不是一张会过期的截图拼贴。
