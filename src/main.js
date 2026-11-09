/* 第一行必须是运行时替身：现版（live）会直接 import 小程序源码里的组件，
   这些组件依赖全局 uni / getApp，必须在它们被求值之前挂好 */
import './uni-env.js';
import { createApp } from 'vue';
import App from './App.vue';
import { installUniComponents } from './uni-components.js';

/*
 * 样式总入口，也是唯一的入口：新写样式文件必须在这里 import 才会生效。
 * 加载顺序 = 覆盖顺序（后面的覆盖前面的），不要随便上下移动。
 * 大体分五层：①底座 → ②逐轮修补 → ③Wise 主题与各分页 → ④原版补充/精修 → ⑤V5 新版
 */
import './styles.css';               // ① 底座：桌面设计台外壳、390×888 手机画布、状态栏 +「原版」全部页面样式
import './round2.css';               // ② 第二轮视觉修补（状态栏、底栏、好友/我的等页面细节）
import './round3.css';               // ② 第三轮修补（店铺详情、觅食列表、好友页尺寸再校准）
import './acceptance-fix.css';       // ② 验收尺寸修正：按 1080×2460 参考图等比落到 390×888 画布
import './round2-nav.css';           // ② 底部导航图标尺寸修补
import './source-fidelity.css';      // ② 首页 / 校园觅食高保真：按 750rpx 源样式折算到 390px
import './wise.css';                 // ③ Wise 新版总样式：主题变量 + .wise-theme 下的全局规则
import './wise-home.css';            // ③ Wise 版各分页，一页一个文件（首页）
import './wise-random-store.css';    // ③ 开盲盒
import './wise-golden-board.css';    // ③ 庆快金榜
import './wise-campus.css';          // ③ 校园服务
import './wise-library.css';         // ③ 图书馆
import './wise-favorites.css';        // ③ 店铺收藏
import './wise-friends.css';          // ③ 好友
import './wise-profile.css';          // ③ 我的
import './wise-stalls.css';           // ③ 桥苑小摊
import './wise-store-detail.css';     // ③ 店铺详情
import './sticky-tabs.css';          // ③ 长列表页的吸顶 tab（避开 46px 状态栏）
import './original-pages.css';       // ④ 原版页面补充样式（原生导航栏等）
import './reference-redesign.css';   // ④ 评价抽屉、用户公开主页：原版与 Wise 两套写法都在里面
import './linhuzi-reviews-refine.css'; // ④ 林胡子评价抽屉精修
import './public-profile-refine.css';  // ④ 用户公开主页精修
import './v5-home.css';              // ⑤ V5 新版：首页 + 进店逛/搜索页 + 通知弹窗 + 四栏底栏
import './v5-pages.css';             // ⑥ V5 五个子页：今天吃什么(盲盒机)/今天做什么(灵感小盒)/MBTI食堂/店铺详情/我的收藏
import './v5-tabs.css';              // ⑦ V5 四个 tab 页(校园/交友/我的) + 校园三个板块(失物招领/闲置小铺/搭把手)及其详情页
import './live/live.css';            // ⑧ 现版：照小程序源码复刻（750rpx → 0.52px，玻璃底栏），只在 design=live 生效
import './mp-base.css';              // ⑨ 小程序组件替身的基础行为（img[mode] 裁切、scroll-view 溢出）

/* 兜底：某一屏渲染出错时不要把整个设计台打白，
   把错误打到控制台方便排查，其余页面照常能点 */
const app = createApp(App);
/* 注册 <view>/<text>/<image>/<scroll-view>/<uni-icons> 等小程序内置组件的替身 */
installUniComponents(app);
app.config.errorHandler = (err, vm, info) => {
  console.log('VUEERR:' + info + ' :: ' + (err && err.stack ? err.stack : err));
};
app.mount('#app');
