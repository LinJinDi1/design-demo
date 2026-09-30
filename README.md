# 庆快校园静态设计稿

独立的 Vite + Vue 3 静态设计台，用 390 × 844 手机画布承载庆快校园的核心页面和状态。项目不调用 API，所有内容来自 `src/fixtures.js`。

## 启动

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 页面范围

- 校园觅食：桥苑小摊列表
- 校园觅食：商业中心侧栏列表
- 校园觅食：饭堂每日菜谱（青色餐饮态）
- 校园
- 图书馆
- 好友
- 我的
- 徐豆豆详情：顶部介绍、菜单滚动、留言三个状态
- 老潼关肉夹馍详情：留言状态

桌面端可通过左侧设计台切换全部 17 个场景，并在“原版 / Wise 新版”之间切换；手机底部五栏导航可切换觅食、校园、好友、我的。也可以使用 `?scene=xudoudou-menu` 等查询参数直达场景，追加 `&design=wise` 可直达对应场景的 Wise 版。

## 代码结构

- `src/fixtures.js`：17 个场景、店铺、菜单和评价 fixture
- `src/tokens.js`：核心颜色 token
- `src/components/`：手机壳、底部导航、店铺卡片和符号组件
- `src/App.vue`：页面模板与场景编排
- `src/styles.css`：桌面设计台、390px 手机画布和全部静态页面样式
- `src/wise.css` 与各页面样式：按 Wise 设计文档实现的 17 个新版页面，仅在 `design=wise` 时生效
- `public/assets/`：从原项目复制后独立持有的静态素材

## 边界

这是静态视觉稿，不包含登录、网络请求、表单提交、支付或真实业务状态。源项目 `/Users/bytedance/quick-pick-main` 未被修改。
