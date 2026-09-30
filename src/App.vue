<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  scenes, stalls, mallZones, mallShops, dishes, commentsByShop, friendRecommendations,
  friends, homeShortcuts, homeBanners, homeStores, favoriteStores, goldenBoardStores, goldenBoardEntries,
  randomStores,
} from './fixtures';
import PhoneShell from './components/PhoneShell.vue';
import IconSymbol from './components/IconSymbol.vue';

const params = new URLSearchParams(location.search);
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const current = ref(scenes.some((scene) => scene.id === params.get('scene')) ? params.get('scene') : 'home');
const design = ref(params.get('design') === 'wise' ? 'wise' : 'original');
const homeDark = ref(params.get('theme') !== 'light');
const groups = computed(() => [...new Set(scenes.map((scene) => scene.group))]);
const activeScene = computed(() => scenes.find((scene) => scene.id === current.value));
const isDetail = computed(() => current.value.includes('doudou') || current.value.includes('tongguan') || ['public-profile', 'linhuzi-reviews'].includes(current.value));
const secondary = computed(() => ['library', 'favorites', 'golden-board', 'random-store'].includes(current.value));
const navActive = computed(() => ['stalls', 'mall', 'canteen'].includes(current.value) ? 'discover' : current.value);
const isTongguan = computed(() => current.value.includes('tongguan'));
const shopName = computed(() => isTongguan.value ? '老潼关肉夹馍' : '徐豆豆');
const shop = computed(() => isTongguan.value
  ? { score: '9.3', people: '50', average: '—', place: '商业中心', time: '08:00—23:59', category: '主食' }
  : { score: '4.2', people: '4', average: '¥10', place: '工行门', time: '11:00—22:30', category: '饮品' });
const shopCover = computed(() => isTongguan.value ? '/assets/screenshot-crops/laotongguan-storefront.jpg' : '/assets/screenshot-crops/xudoudou-stall.jpg');
const shopThumb = computed(() => isTongguan.value ? '/assets/screenshot-crops/laotongguan-card.jpg' : '/assets/screenshot-crops/xudoudou-stall.jpg');
const shopComments = computed(() => commentsByShop[shopName.value]);
const detailTabOverride = ref(null);
const detailTab = computed(() => detailTabOverride.value || (current.value.endsWith('menu') ? 'menu' : current.value.endsWith('message') ? 'reviews' : 'about'));
const friendQuery = ref('');
const followedFriendIds = ref(new Set());
const favoriteTab = ref('store');
const favoriteManaging = ref(false);
const selectedFavorites = ref(new Set());
const hiddenFavorites = ref(new Set());
const favoriteRankLabels = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
const goldenBoardType = ref('store');
const goldenBoardMetric = ref('popularity');
const wiseBoardTab = ref('all');
const libraryTab = ref('rooms');
const libraryCapacity = ref('all');
const libraryQuery = ref('');
const randomCategories = ref([]);
const randomStoreIndex = ref(0);
const randomRolling = ref(false);
const reviewSort = ref('hot');
const reviewDraft = ref('');
const reviewSent = ref(false);
let randomIntervalId;
let randomTimeoutId;
const randomStorePool = computed(() => {
  if (!randomCategories.value.length) return randomStores;
  const matches = randomStores.filter((store) => randomCategories.value.includes(store.category));
  return matches.length ? matches : randomStores;
});
const randomStore = computed(() => randomStorePool.value[randomStoreIndex.value % randomStorePool.value.length]);
const wiseRankedStores = computed(() => wiseBoardTab.value === 'all'
  ? goldenBoardEntries
  : goldenBoardEntries.filter((item) => item.group === wiseBoardTab.value));
const wiseBoardWinner = computed(() => wiseRankedStores.value[0]);
const wiseBoardRunners = computed(() => wiseRankedStores.value.slice(1).map((item, index) => ({
  ...item,
  rank: ['02', '03', '04', '05', '06'][index],
})));
const libraryRoomVisible = computed(() => {
  const keyword = libraryQuery.value.trim().toLowerCase();
  return !keyword || '冥想室 416'.toLowerCase().includes(keyword);
});
const visibleFavoriteStores = computed(() => favoriteStores.filter((item) => !hiddenFavorites.value.has(item.name)));
const filteredFriends = computed(() => {
  const keyword = friendQuery.value.trim().toLowerCase();
  if (!keyword) return friends;
  return friends.filter((friend) => `${friend.name} ${friend.note}`.toLowerCase().includes(keyword));
});

function toggleFollow(id) {
  const next = new Set(followedFriendIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  followedFriendIds.value = next;
}
function toggleFavoriteManaging() {
  favoriteManaging.value = !favoriteManaging.value;
  if (!favoriteManaging.value) selectedFavorites.value = new Set();
}
function toggleFavoriteSelection(name) {
  const next = new Set(selectedFavorites.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  selectedFavorites.value = next;
}
function removeSelectedFavorites() {
  hiddenFavorites.value = new Set([...hiddenFavorites.value, ...selectedFavorites.value]);
  selectedFavorites.value = new Set();
  favoriteManaging.value = false;
}
function advanceRandomStore() {
  randomStoreIndex.value = (randomStoreIndex.value + 1) % randomStorePool.value.length;
}
function stopRandomStore() {
  window.clearInterval(randomIntervalId);
  window.clearTimeout(randomTimeoutId);
  randomRolling.value = false;
}
function toggleRandomStore() {
  if (randomRolling.value) {
    stopRandomStore();
    return;
  }
  randomRolling.value = true;
  randomIntervalId = window.setInterval(advanceRandomStore, 500);
  randomTimeoutId = window.setTimeout(stopRandomStore, 5000);
}
function sendReview() {
  if (!reviewDraft.value.trim()) return;
  reviewSent.value = true;
  reviewDraft.value = '';
}

const scrollOffsets = { 'xudoudou-top': 0, 'xudoudou-menu': 0, 'xudoudou-message': 405, 'laotongguan-message': 335 };
function restoreSceneScroll(id) {
  nextTick(() => {
    const viewport = document.querySelector('.phone-content');
    if (!viewport) return;
    if (design.value === 'wise' && id.endsWith('message')) {
      const tabs = viewport.querySelector('.store-tabs');
      if (tabs) {
        viewport.scrollTop += tabs.getBoundingClientRect().top - viewport.getBoundingClientRect().top - 58;
        return;
      }
    }
    viewport.scrollTop = scrollOffsets[id] || 0;
  });
}
function selectScene(id) {
  if (id === 'discover') id = 'stalls';
  if (id !== 'random-store') stopRandomStore();
  detailTabOverride.value = null;
  current.value = id;
  const url = new URL(location.href);
  url.searchParams.set('scene', id);
  history.replaceState({}, '', url);
  restoreSceneScroll(id);
}
function selectDetailTab(tab) {
  if (isTongguan.value) {
    detailTabOverride.value = tab;
    document.querySelector('.phone-content')?.scrollTo({ top: 0 });
    return;
  }
  selectScene(tab === 'about' ? 'xudoudou-top' : tab === 'menu' ? 'xudoudou-menu' : 'xudoudou-message');
}
function selectDesign(nextDesign) {
  design.value = nextDesign;
  const url = new URL(location.href);
  if (nextDesign === 'wise') url.searchParams.set('design', 'wise');
  else url.searchParams.delete('design');
  history.replaceState({}, '', url);
  restoreSceneScroll(current.value);
}
function toggleHomeTheme() {
  homeDark.value = !homeDark.value;
  const url = new URL(location.href);
  if (homeDark.value) url.searchParams.delete('theme');
  else url.searchParams.set('theme', 'light');
  history.replaceState({}, '', url);
}
onMounted(() => restoreSceneScroll(current.value));
onBeforeUnmount(stopRandomStore);
</script>

<template>
  <div :class="['studio', { 'wise-theme': design === 'wise', 'home-dark-theme': design === 'wise' && current === 'home' && homeDark }]" :data-scene="current" :data-design="design">
    <aside class="sidebar">
      <div class="brand"><img src="/assets/qingkuai.ico"><div><strong>庆快校园</strong><small>STATIC DESIGN DESK</small></div></div>
      <div class="sidebar-intro"><span class="eyebrow">SCREEN INDEX</span><h1>线上页面静态复刻</h1><p>17 个截图状态，390 × 888 手机画布。</p></div>
      <div class="design-switcher" aria-label="设计版本">
        <span class="group-label">设计版本</span>
        <div><button :class="{ active: design === 'original' }" @click="selectDesign('original')">原版</button><button :class="{ active: design === 'wise' }" @click="selectDesign('wise')">Wise 新版</button></div>
        <small>{{ design === 'wise' ? '青柠绿 · 鼠尾草灰 · 24px 圆角' : '保留现有视觉，不做覆盖' }}</small>
      </div>
      <div v-for="group in groups" :key="group" class="scene-group"><div class="group-label">{{ group }}</div><button v-for="scene in scenes.filter((item) => item.group === group)" :key="scene.id" :class="['scene-button', { active: current === scene.id }]" @click="selectScene(scene.id)"><span>{{ scene.label }}</span><small>{{ scene.note }}</small></button></div>
      <div class="scope-note"><span class="pulse"></span><span>本地静态数据<br><small>无 API 调用</small></span></div>
    </aside>

    <section class="stage">
      <header class="stage-header"><div><span class="eyebrow">{{ design === 'wise' ? 'WISE REDESIGN' : 'CURRENT SCENE' }}</span><h2>{{ activeScene.label }}</h2></div><div class="stage-meta"><button class="mobile-design-toggle" @click="selectDesign(design === 'wise' ? 'original' : 'wise')">{{ design === 'wise' ? '查看原版' : '查看 Wise 新版' }}</button><div class="viewport-chip"><span></span>390 × 888</div></div></header>
      <div class="phone-wrap"><PhoneShell :active="navActive" :detail="isDetail" :secondary="secondary" @navigate="selectScene">
        <section v-if="current === 'linhuzi-reviews' && design === 'wise'" class="screen wise-review-sheet-page">
          <header class="wise-review-store">
            <img :src="asset('/assets/source-fidelity/stalls/linhuzi.jpeg')" alt="林胡子猪脚饭摊位">
            <button aria-label="返回" @click="selectScene('stalls')"><IconSymbol name="back" :size="30" /></button>
            <div class="wise-review-cover-meta"><small>桥苑小摊 · 学4门</small><h1>林胡子猪脚饭</h1><span>主食</span></div>
          </header>
          <section class="wise-review-sheet">
            <div class="wise-sheet-handle"></div>
            <header><div><small>全部评价</small><h2>大家怎么说</h2></div><button aria-label="关闭" @click="selectScene('stalls')"><span>关闭</span></button></header>
            <section class="wise-review-score"><div class="wise-review-score-main"><strong>5.0</strong><span><b aria-label="5 星">★★★★★</b><small>1 人评价</small></span></div><dl><div><dt>人均</dt><dd>¥15</dd></div><div><dt>推荐</dt><dd>猪脚饭</dd></div></dl></section>
            <nav class="wise-review-sort"><button :class="{ active: reviewSort === 'hot' }" @click="reviewSort = 'hot'">最热</button><button :class="{ active: reviewSort === 'new' }" @click="reviewSort = 'new'">最新</button></nav>
            <section class="wise-review-list" aria-label="评价列表"><article class="wise-review-item"><header><div class="wise-review-avatar">微</div><span><b>微信用户</b><small>2026-09-08 · 消费后评价</small></span><button aria-label="更多操作"><IconSymbol name="more" :size="15" /></button></header><div class="wise-review-rating"><b aria-label="5 星">★★★★★</b><span>口味很好</span></div><p>好吃！给的肉很多，辣椒也好吃，才十五块钱。有猪脚饭和土豆牛腩饭。</p><footer><button aria-label="点赞">♡ <span>赞 0</span></button><button>回复</button></footer></article><p class="wise-review-end"><span></span>没有更多评价了<span></span></p></section>
          </section>
          <form class="wise-review-composer" @submit.prevent="sendReview"><input v-model="reviewDraft" aria-label="写评价" placeholder="写下你的真实体验"><label><input type="checkbox"><span>匿名</span></label><button type="submit" :disabled="!reviewDraft.trim()">发送</button></form>
          <div v-if="reviewSent" class="wise-review-toast">评价已发送</div>
        </section>

        <section v-else-if="current === 'linhuzi-reviews'" class="screen original-review-sheet-page">
          <header class="original-review-store"><img :src="asset('/assets/source-fidelity/stalls/linhuzi.jpeg')" alt="林胡子猪脚饭摊位"><button aria-label="返回" @click="selectScene('stalls')"><IconSymbol name="back" :size="30" /></button><div><img :src="asset('/assets/source-fidelity/stalls/linhuzi.jpeg')" alt=""><h1>林胡子猪脚饭</h1><span>主食</span></div><nav><b>评分</b><span>评分人数</span><b>人均</b><span>浏览</span></nav></header>
          <section class="original-review-sheet"><div class="original-sheet-handle"></div><header><div><h2>林胡子猪脚饭</h2><p>看看大家都怎么说</p></div><button @click="selectScene('stalls')">关闭</button></header><nav><button :class="{ active: reviewSort === 'hot' }" @click="reviewSort = 'hot'">最热</button><button :class="{ active: reviewSort === 'new' }" @click="reviewSort = 'new'">最新</button></nav><article><header><div class="original-review-avatar"></div><span><b>微信用户</b><small>2026-09-08</small></span></header><p>好吃！给的肉很多，辣椒也好吃，才十五块钱。有猪脚饭和土豆牛腩饭</p><footer><button>赞 0</button><button>回复</button></footer></article><p class="original-review-end">没有更多评价了</p></section>
          <form class="original-review-composer" @submit.prevent="sendReview"><input v-model="reviewDraft" placeholder="写评价" aria-label="写评价"><label><input type="checkbox">匿名</label><button type="submit">发送</button></form>
        </section>

        <section v-else-if="current === 'public-profile' && design === 'wise'" class="screen wise-public-profile">
          <header class="wise-public-cover"><button aria-label="返回" @click="selectScene('friends')"><IconSymbol name="back" :size="30" /></button><button aria-label="更多"><IconSymbol name="more" :size="18" /></button><div><span>庆快校园</span><strong>个人主页</strong></div></header>
          <main class="wise-public-card"><div class="wise-public-avatar reference-avatar"></div><div class="wise-public-heading"><small>已关注</small><h1>微信用户 <span>♀</span></h1><p>她在庆快校园的第 1 年</p></div><section class="wise-public-social"><button><b>3</b><span>关注</span></button><button><b>1</b><span>粉丝</span></button><button><b>1</b><span>收藏</span></button><button><b>0</b><span>评分</span></button></section><section class="wise-public-sign"><small>个性签名</small><p>~！ @测试</p></section><section class="wise-public-facts"><header><small>个人资料</small></header><div><span>用龄</span><b>1 年</b></div><button><span>收藏数</span><b>1</b><IconSymbol name="arrow" :size="22" /></button></section><section class="wise-public-reviews"><header><div><small>公开内容</small><h2>她的评价</h2></div><span>0 条</span></header><div class="wise-public-empty"><IconSymbol name="message" :size="24" /><p>还没有发表过评价</p><small>以后发布的公开评价会显示在这里</small></div></section></main>
          <footer class="wise-public-follow"><button>已关注</button></footer>
        </section>

        <section v-else-if="current === 'public-profile'" class="screen original-public-profile">
          <header><button aria-label="返回" @click="selectScene('friends')"><IconSymbol name="back" :size="30" /></button><button aria-label="更多"><IconSymbol name="more" :size="18" /></button></header><main><div class="original-public-avatar reference-avatar"></div><h1>微信用户 <span>♀</span></h1><p class="original-public-social">关注：3 | 粉丝：1</p><p class="original-public-sign"><span>个性签名：</span>~！ @测试</p><dl><div><dt>用龄：</dt><dd>1 年</dd></div><div><dt>收藏数：</dt><dd>1</dd><IconSymbol name="arrow" :size="24" /></div><div><dt>评分数：</dt><dd>0</dd></div></dl></main><footer><button>已关注</button></footer>
        </section>
        <section v-else-if="current === 'home' && design === 'wise'" :class="['screen', 'wise-home-page', { 'is-dark': homeDark }]">
          <header class="wise-home-topbar">
            <button class="wise-home-brand" aria-label="庆快校园首页">
              <img :src="asset('/assets/qingkuai.ico')" alt="">
              <span>庆快校园<small>QINGKUAI CAMPUS</small></span>
            </button>
            <div>
              <button aria-label="搜索"><IconSymbol name="search" :size="21" /></button>
              <button class="wise-home-theme-toggle" :aria-label="homeDark ? '切换到日间模式' : '切换到夜间模式'" :title="homeDark ? '日间模式' : '夜间模式'" @click="toggleHomeTheme">
                <IconSymbol :name="homeDark ? 'sun' : 'moon'" :size="18" />
              </button>
              <button aria-label="通知"><IconSymbol name="bell" :size="20" /></button>
            </div>
          </header>

          <div class="wise-home-notice">
            <b>校园通知</b>
            <p>祝大家学业顺利，生活愉快！</p>
            <IconSymbol name="arrow" :size="18" />
          </div>

          <section class="wise-home-hero">
            <div class="wise-home-hero-copy">
              <small>QINGKUAI CAMPUS · DAILY GUIDE</small>
              <h1>在校园，<br>过好每一天。</h1>
              <p>学习空间、校园服务、吃饭和好友动态，都在这里。</p>
            </div>
            <figure @click="selectScene('campus')">
              <img :src="asset('/assets/source-fidelity/banners/home-1.png')" alt="欢迎来到庆快校园">
            </figure>
          </section>

          <nav class="wise-home-quick" aria-label="常用入口">
            <button @click="selectScene('campus')"><img :src="asset('/assets/star.png')" alt=""><span>校园服务</span></button>
            <button @click="selectScene('library')"><img :src="asset('/assets/library.png')" alt=""><span>图书馆</span></button>
            <button @click="selectScene('canteen')"><img :src="asset('/assets/source-fidelity/shortcuts/canteen.png')" alt=""><span>饭堂</span></button>
            <button @click="selectScene('stalls')"><img :src="asset('/assets/source-fidelity/shortcuts/stalls.png')" alt=""><span>桥苑小摊</span></button>
            <button @click="selectScene('random-store')"><img :src="asset('/assets/source-fidelity/shortcuts/random.png')" alt=""><span>开盲盒</span></button>
            <button @click="selectScene('golden-board')"><img :src="asset('/assets/collection.png')" alt=""><span>庆快金榜</span></button>
            <button @click="selectScene('friends')"><img :src="asset('/assets/friends.svg')" alt=""><span>好友</span></button>
            <button @click="selectScene('favorites')"><img :src="asset('/assets/source-fidelity/shortcuts/favorites.png')" alt=""><span>店铺收藏</span></button>
          </nav>

          <section class="wise-home-glance">
            <header>
              <div><small>TODAY AT A GLANCE</small><h2>今日一览</h2></div>
              <time>09 / 16</time>
            </header>
            <div class="wise-home-glance-grid">
              <button class="library" @click="selectScene('library')">
                <span>图书馆</span><strong>18</strong><small>个空间</small><b>找个安静位置 <IconSymbol name="arrow" :size="17" /></b>
              </button>
              <button class="canteen" @click="selectScene('canteen')">
                <span>饭堂</span><strong>14</strong><small>道今日菜</small><b>查看菜谱 <IconSymbol name="arrow" :size="17" /></b>
              </button>
              <button class="friends" @click="selectScene('friends')">
                <span>好友</span><strong>34</strong><small>条新消息</small><b>进入好友 <IconSymbol name="arrow" :size="17" /></b>
              </button>
              <button class="ranking" @click="selectScene('golden-board')">
                <span>庆快金榜</span><strong>01</strong><small>黄师傅</small><b>查看本周榜 <IconSymbol name="arrow" :size="17" /></b>
              </button>
            </div>
          </section>
        </section>

        <section v-else-if="current === 'home'" class="screen home-real">
          <header class="home-brand"><img src="/assets/qingkuai.ico"><strong>庆快校园</strong></header>
          <section class="home-banner-carousel" aria-label="校园轮播"><img v-for="(banner, index) in homeBanners" :key="banner" :src="asset(banner)" :alt="`校园轮播 ${index + 1}`" :class="{ active: index === 0 }"><div class="home-banner-dots"><i class="active"></i><i></i><i></i></div></section>
          <div class="home-shortcuts"><div v-for="group in ['pickup', 'friend']" :key="group" class="home-shortcut-group"><button v-for="item in homeShortcuts.filter((shortcut) => shortcut.group === group)" :key="item.label" @click="selectScene(item.scene)"><img :src="asset(item.image)" :alt="item.label"><span>{{ item.label }}</span></button></div></div>
          <section class="ranking-card" @click="selectScene('golden-board')"><div><h2>庆快金榜</h2><p>发现校园里，值得一尝的好味道</p></div><b><i>2</i><i>1</i><i>3</i></b><footer>校园店铺 · 街边小摊 <span>去看看榜单 ›</span></footer></section>
          <div class="home-notice"><IconSymbol name="notice" :size="24" /><b>通知</b><span>祝大家学业顺利，生活愉快！</span></div>
          <section class="home-recommend"><header><h2>猜你喜欢</h2><span>店铺小摊，都有好味道</span></header><nav><b>全部推荐</b><span>商业中心</span><span>街边小摊</span></nav><div><article v-for="item in homeStores" :key="item.name" @click="item.name === '徐豆豆' && selectScene('xudoudou-top')"><img :src="asset(item.photo)"><small>{{ item.kind }}</small><h3>{{ item.name }}</h3><p>{{ item.place }}</p><b>{{ item.score }}</b></article></div></section>
          <button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button>
        </section>

        <section v-else-if="current === 'random-store'" class="screen wise-random-store">
          <header class="wise-random-topbar">
            <button aria-label="返回首页" @click="selectScene('home')"><IconSymbol name="back" :size="28" /></button>
            <div><small>QINGKUAI PICK</small><b>开盲盒</b></div>
            <span>01 / 15</span>
          </header>

          <section class="wise-random-intro">
            <small>NO MORE HESITATION</small>
            <h1>今天，<br><em>吃哪家？</em></h1>
            <p>选个范围，剩下的交给运气。</p>
          </section>

          <section class="wise-random-filter">
            <header><b>先定个范围</b><small>可多选 · 不选则全部</small></header>
            <div class="wise-random-chips">
              <label v-for="category in ['主食', '饮品', '小吃', '粉面']" :key="category">
                <input v-model="randomCategories" type="checkbox" :value="category">
                <span>{{ category }}</span>
              </label>
            </div>
          </section>

          <section :class="['wise-random-stage', { rolling: randomRolling }]">
            <header><small>{{ randomRolling ? 'ROLLING…' : 'YOUR PICK' }}</small><span>{{ randomStore.category }}</span></header>
            <figure><img :src="asset(randomStore.image)" :alt="randomStore.name"></figure>
            <footer><small>{{ randomRolling ? '正在替你决定' : '这次去吃' }}</small><h2>{{ randomStore.name }}</h2></footer>
          </section>

          <div class="wise-random-actions">
            <button class="start" :class="{ active: randomRolling }" @click="toggleRandomStore">{{ randomRolling ? '停一下' : '开始抽取' }}</button>
            <button v-if="!randomRolling" class="confirm" @click="selectScene(randomStore.target)">就去这家 <IconSymbol name="arrow" :size="20" /></button>
            <small>{{ randomRolling ? '点击按钮可以提前停止' : '开始后将在 5 秒内自动停下' }}</small>
          </div>
        </section>

        <section v-else-if="current === 'golden-board' && design === 'wise'" class="screen wise-golden-board">
          <header class="wise-board-hero" @click="selectScene(wiseBoardWinner.target)">
            <img :src="asset(wiseBoardWinner.photo)" :alt="wiseBoardWinner.name">
            <div class="wise-board-topline">
              <button aria-label="返回首页" @click.stop="selectScene('home')"><IconSymbol name="back" :size="26" /></button>
              <span>QINGKUAI WEEKLY</span>
            </div>
            <div class="wise-board-hero-copy">
              <small>校园里，值得一尝的好味道</small>
              <h1>庆快金榜</h1>
              <div class="wise-board-winner"><b>01</b><span><small>本周第一</small><strong>{{ wiseBoardWinner.name }}</strong><em>{{ wiseBoardWinner.place }}</em></span><i>★ {{ wiseBoardWinner.score }}</i></div>
            </div>
          </header>

          <nav class="wise-board-tabs" aria-label="榜单分类">
            <button :class="{ active: wiseBoardTab === 'all' }" @click="wiseBoardTab = 'all'">综合榜</button>
            <button :class="{ active: wiseBoardTab === 'stall' }" @click="wiseBoardTab = 'stall'">小摊榜</button>
            <button :class="{ active: wiseBoardTab === 'store' }" @click="wiseBoardTab = 'store'">校园店铺</button>
          </nav>

          <section class="wise-board-list">
            <header><div><small>THIS WEEK'S PICKS</small><h2>{{ wiseBoardTab === 'all' ? '继续上榜' : wiseBoardTab === 'stall' ? '小摊推荐' : '店铺推荐' }}</h2></div><span>{{ wiseRankedStores.length }} 家上榜</span></header>
            <article v-for="item in wiseBoardRunners" :key="item.name" @click="selectScene(item.target)">
              <div class="wise-board-rank">{{ item.rank }}</div>
              <figure><img :src="asset(item.photo)" :alt="item.name"></figure>
              <div class="wise-board-copy"><small>{{ item.category }}</small><h3>{{ item.name }}</h3><p>{{ item.place }}</p><footer><b>★ {{ item.score }}</b><span>{{ item.votes }}</span></footer></div>
              <IconSymbol name="arrow" :size="21" />
            </article>
          </section>

          <footer class="wise-board-note"><span>依据站内评分与近期反馈整理</span><b>每周一更新</b></footer>
        </section>

        <section v-else-if="current === 'golden-board'" class="screen original-golden-board">
          <header class="original-native-head">
            <button aria-label="返回首页" @click="selectScene('home')">‹</button>
            <h1>庆快金榜</h1>
          </header>
          <section class="golden-board-hero">
            <small>校园好味道</small>
            <h1>庆快金榜</h1>
            <p>从校园店铺到街边小摊，看看大家喜欢哪一家</p>
            <i class="golden-bars" aria-hidden="true"><b></b><b></b><b></b></i>
          </section>
          <section class="golden-board-sheet">
            <div class="golden-dimensions">
              <button :class="{ active: goldenBoardType === 'store' }" @click="goldenBoardType = 'store'">店铺</button>
              <button :class="{ active: goldenBoardType === 'stall' }" @click="goldenBoardType = 'stall'">小摊</button>
            </div>
            <nav class="golden-metrics">
              <button :class="{ active: goldenBoardMetric === 'popularity' }" @click="goldenBoardMetric = 'popularity'">人气榜</button>
              <button :class="{ active: goldenBoardMetric === 'favorite' }" @click="goldenBoardMetric = 'favorite'">收藏榜</button>
              <button :class="{ active: goldenBoardMetric === 'rating' }" @click="goldenBoardMetric = 'rating'">口碑榜</button>
            </nav>
            <div class="golden-caption">
              <span>{{ goldenBoardMetric === 'rating' ? '按用户评分排序' : goldenBoardMetric === 'favorite' ? '按累计收藏人数排序' : goldenBoardType === 'stall' ? '按小摊累计浏览排序' : '按店铺本周浏览排序' }}</span>
              <span>每次展示 10 名</span>
            </div>
            <div class="golden-rank-list">
              <article v-for="(item, index) in goldenBoardStores" :key="item.name">
                <i :class="`rank-${index + 1}`">{{ index + 1 }}</i>
                <img :src="asset(item.image)" :alt="item.name">
                <div><strong>{{ item.name }}</strong><small>{{ item.place }}</small></div>
                <p><b>{{ goldenBoardMetric === 'rating' && item.value ? `${item.value}.0` : item.value }}</b><small>{{ goldenBoardMetric === 'rating' ? '用户评分' : goldenBoardMetric === 'favorite' ? '人收藏' : goldenBoardType === 'stall' ? '次累计浏览' : '次本周浏览' }}</small></p>
              </article>
            </div>
          </section>
        </section>

        <section v-else-if="current === 'stalls' && design === 'wise'" class="screen wise-stalls-page">
          <header class="wise-stalls-hero">
            <div class="wise-stalls-kicker"><span>QINGKUAI</span><span>FOOD GUIDE · 01</span></div>
            <h1><span>桥苑</span><br>小摊</h1>
          </header>
          <nav class="wise-stalls-nav wise-sticky-food-tabs" aria-label="校园觅食分类"><button class="active">桥苑小摊</button><button @click="selectScene('mall')">商业中心</button><button @click="selectScene('canteen')">饭堂</button></nav>
          <label class="wise-food-compact-search"><img src="/assets/search.png" alt=""><span>搜索摊位或想吃的东西</span><b>↗</b></label>

          <section class="wise-stalls-filters" aria-label="摊位筛选">
            <div><strong>吃什么</strong><button class="active">全部</button><button>主食</button><button>饮品</button><button>小吃</button><button>粉面</button></div>
            <div><strong>在哪里</strong><button class="active">不限</button><button>工行门</button><button>学4门</button></div>
          </section>

          <section class="wise-stalls-directory">
            <header>
              <div><small>NEAR CAMPUS · TODAY</small><h2>今天，吃点什么？</h2><p>共 132 家 · 本页精选 {{ stalls.length }} 家</p></div>
              <div class="wise-stalls-sort"><button class="active">最热</button><button>最新</button></div>
            </header>
            <article v-for="(item, index) in stalls" :key="item.name" class="wise-stall-entry" @click="item.name === '徐豆豆' && selectScene('xudoudou-top')">
              <figure><img :src="asset(item.photo)" :alt="item.name"><span>{{ String(index + 1).padStart(2, '0') }}</span></figure>
              <div class="wise-stall-copy">
                <div class="wise-stall-category"><span>{{ item.category }}</span><i>{{ item.tags.join(' · ') }}</i></div>
                <h3>{{ item.name }}</h3>
                <p class="wise-stall-rating"><b>★ {{ item.score }}</b><span>{{ item.people }}评价</span><span>人均 {{ item.average }}</span></p>
                <dl><div><dt>位置</dt><dd>{{ item.place }}</dd></div><div><dt>营业</dt><dd>{{ item.time }}</dd></div></dl>
                <footer><span><i></i>最近还没人确认</span><b>{{ item.name === '徐豆豆' ? '查看摊位' : '摊位资料' }}　↗</b></footer>
              </div>
            </article>
          </section>
        </section>

        <section v-else-if="['stalls', 'mall', 'canteen'].includes(current)" class="screen food-screen">
          <header class="pickup-header"><h1><template v-if="design === 'wise'"><span>校园</span>觅食</template><template v-else>校园觅食</template></h1><p>小摊烟火，饭堂日常，校园好店</p><label v-if="design !== 'wise'" class="real-search"><img src="/assets/search.png"><span>搜索店铺、小摊、饭堂、图书馆</span></label><nav v-if="design !== 'wise'" class="pickup-tabs"><button :class="{ active: current === 'stalls' }" @click="selectScene('stalls')">桥苑小摊</button><button :class="{ active: current === 'mall' }" @click="selectScene('mall')">商业中心</button><button :class="{ active: current === 'canteen' }" @click="selectScene('canteen')">饭堂</button></nav></header>
          <nav v-if="design === 'wise'" class="pickup-tabs wise-sticky-food-tabs"><button :class="{ active: current === 'stalls' }" @click="selectScene('stalls')">桥苑小摊</button><button :class="{ active: current === 'mall' }" @click="selectScene('mall')">商业中心</button><button :class="{ active: current === 'canteen' }" @click="selectScene('canteen')">饭堂</button></nav>
          <label v-if="design === 'wise'" class="wise-food-compact-search"><img src="/assets/search.png" alt=""><span>搜索店铺、小摊、饭堂、图书馆</span><b>↗</b></label>
          <template v-if="current === 'stalls'">
            <div class="filter-panel"><div><b>品类</b><span class="selected">全部分类</span><span>主食</span><span>饮品</span><span>小吃</span><span>粉面</span></div><div><b>位置</b><span class="selected">全部位置</span><span>工行门</span><span>学4门</span></div></div>
            <div class="sort-line"><strong>共 132 家 <small>已展示 8 家</small></strong><span><b>最热</b>　最新</span></div>
            <article v-for="item in stalls" :key="item.name" class="real-store" @click="item.name === '徐豆豆' && selectScene('xudoudou-top')"><img class="store-list-photo" :src="asset(item.photo)" :alt="item.name"><div><h3>{{ item.name }} <em>{{ item.category }}</em></h3><div class="score-line">★ {{ item.score }} <span>（{{ item.people }}） · 人均 {{ item.average }}</span></div><p><span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span></p><p>● 最近还没人确认</p><small>最近还没有新的反馈</small><footer><span>⌖ {{ item.place }}</span><span>▣ {{ item.time }}</span></footer></div></article>
          </template>
          <template v-else-if="current === 'mall'">
            <div class="venue-line"></div><div class="category-line"><b>品类</b><span class="active">全部</span><span>主食</span><span>饮品</span><span>小吃</span><span>粉面</span></div>
            <div class="split-list"><aside><b>分区</b><button v-for="(zone, index) in mallZones" :key="zone" :class="{ active: index === 0 }">{{ zone }}</button></aside><main><article v-for="item in mallShops" :key="item.name" class="dining-store" @click="item.name === '老潼关肉夹馍' && selectScene('laotongguan-message')"><img class="dining-store-photo" :src="asset(item.photo)" :alt="item.name"><section><h3>{{ item.name }}</h3><b>★ {{ item.score }}　{{ item.people }}</b><p>{{ item.category }} · {{ item.place }}</p><small>{{ item.time }}</small></section></article></main></div>
          </template>
          <template v-else>
            <div class="canteen-filter"><div><strong>菊苑饭堂⌄</strong><small>每一餐，都好好吃</small></div><p><b>楼层</b><span class="active">一楼<br><small>菜谱</small></span><span>二楼<br><small>店铺</small></span></p></div><div class="weekdays"><span class="active">周一<small>9/14</small></span><span>周二<small>9/15</small></span><span>周三<small>9/16</small></span><span>周四<small>9/17</small></span><span>周五<small>9/18</small></span></div><div class="menu-heading"><strong>周一菜谱</strong><span>36 道菜</span></div><div class="menu-source">菊苑食堂一楼大众班每周菜谱（10月13日~10月17日） · 更新于 2025-10-12</div><div class="plain-menu"><p v-for="dish in dishes" :key="dish[0]"><span>{{ dish[0] }}</span><b>{{ dish[1] }}</b></p></div>
          </template>
          <button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button>
        </section>

        <section v-else-if="current === 'campus' && design === 'wise'" class="screen wise-campus-page">
          <header class="wise-campus-heading">
            <div><small>QINGKUAI CAMPUS · 02</small><h1>校园指南</h1></div>
            <button aria-label="更多"><IconSymbol name="more" :size="20" /></button>
          </header>

          <figure class="wise-campus-hero">
            <img src="/assets/screenshot-crops/campus-scene.jpg" alt="校园实景">
            <figcaption><small>HUANGPU CAMPUS</small><h2>在校园里，找到你的节奏。</h2></figcaption>
          </figure>

          <div class="wise-campus-facts">
            <span><small>校区</small><b>黄埔</b></span>
            <span><small>服务</small><b>02</b></span>
            <span><small>状态</small><b>持续更新</b></span>
          </div>

          <section class="wise-campus-directory">
            <header><div><small>CAMPUS SERVICES</small><h2>校园服务</h2></div><span>浏览全部</span></header>
            <div>
              <button class="primary" @click="selectScene('library')">
                <i>01</i>
                <img src="/assets/library.png" alt="">
                <span><small>学习空间</small><strong>图书馆</strong><p>查看实景、桌椅和设施</p></span>
                <IconSymbol name="arrow" :size="22" />
              </button>
              <button class="disabled" disabled>
                <i>02</i>
                <img src="/assets/star.png" alt="">
                <span><small>校园创作</small><strong>庆快画廊</strong><p>正在准备中</p></span>
                <b>开发中</b>
              </button>
            </div>
          </section>

          <section class="wise-campus-links">
            <header><small>QUICK ACCESS</small><h2>常用入口</h2></header>
            <div>
              <button><IconSymbol name="map" :size="29" /><span>校园地图</span><IconSymbol name="arrow" :size="18" /></button>
              <button><IconSymbol name="notice" :size="29" /><span>校园通知</span><IconSymbol name="arrow" :size="18" /></button>
            </div>
          </section>
        </section>

        <section v-else-if="current === 'campus'" class="screen campus-real"><header><h1>校园</h1></header><div class="campus-photo"><img src="/assets/screenshot-crops/campus-scene.jpg" alt="校园实景与寄语"></div><h2>校园服务</h2><button class="service-card" @click="selectScene('library')"><img src="/assets/library.png"><strong>图书馆</strong><p>看实景、桌椅与设施，找到合适的学习空间</p></button><button class="service-card disabled"><img src="/assets/star.png"><strong>庆快画廊</strong><span>开发中</span><p>正在准备中，敬请期待</p></button><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <section v-else-if="current === 'library' && design === 'wise'" class="screen wise-library-page">
          <header class="wise-library-bar">
            <button aria-label="返回校园" @click="selectScene('campus')"><IconSymbol name="back" :size="27" /></button>
            <strong>图书馆</strong>
            <span aria-hidden="true"></span>
          </header>

          <section class="wise-library-intro">
            <div><small>HUANGPU LIBRARY · B1</small><h1>找个合适的<br>学习空间</h1><p>查看空间资料与设施信息。</p></div>
            <img src="/assets/library.png" alt="">
          </section>

          <nav class="wise-library-tabs">
            <button :class="{ active: libraryTab === 'rooms' }" @click="libraryTab = 'rooms'">研讨室</button>
            <button :class="{ active: libraryTab === 'seats' }" @click="libraryTab = 'seats'">自习座位</button>
            <button :class="{ active: libraryTab === 'favorites' }" @click="libraryTab = 'favorites'">我的收藏</button>
          </nav>

          <section class="wise-library-controls">
            <div class="wise-library-location"><button>黄埔校区 <span>⌄</span></button><button>黄埔分馆 B1 <span>⌄</span></button></div>
            <label><IconSymbol name="search" :size="19" /><input v-model="libraryQuery" type="search" placeholder="搜索房间名、位置或设施"></label>
            <div class="wise-library-capacity">
              <button :class="{ active: libraryCapacity === 'all' }" @click="libraryCapacity = 'all'">不限人数</button>
              <button :class="{ active: libraryCapacity === '4' }" @click="libraryCapacity = '4'">4 人以上</button>
              <button :class="{ active: libraryCapacity === '6' }" @click="libraryCapacity = '6'">6 人以上</button>
              <button :class="{ active: libraryCapacity === '8' }" @click="libraryCapacity = '8'">8 人以上</button>
            </div>
          </section>

          <section v-if="libraryTab === 'rooms'" class="wise-library-results">
            <header><div><small>DISCUSSION ROOMS</small><h2>研讨空间</h2></div><span>18 个空间</span></header>
            <p class="wise-library-notice">实时空位和预约结果请以图书馆系统为准。</p>
            <article v-if="libraryRoomVisible">
              <div class="wise-library-room-visual"><img src="/assets/library.png" alt=""><span>实景照片待补充</span></div>
              <div class="wise-library-room-copy"><small>黄埔分馆 · 4F</small><h3>冥想室（416）</h3><p>2 人容量 · 桌椅布局待补充</p><footer><span>暂无环境评价</span><button>查看详情 <IconSymbol name="arrow" :size="18" /></button></footer></div>
            </article>
            <p v-else class="wise-library-empty">没有找到匹配的空间</p>
          </section>

          <section v-else-if="libraryTab === 'seats'" class="wise-library-empty-state">
            <small>SELF-STUDY SEATS</small><h2>自习座位</h2><p>座位资料正在整理，实时空位请以图书馆系统为准。</p>
          </section>

          <section v-else class="wise-library-empty-state">
            <small>SAVED SPACES</small><h2>我的收藏</h2><p>还没有收藏空间。</p><button @click="libraryTab = 'rooms'">浏览研讨室</button>
          </section>
        </section>

        <section v-else-if="current === 'library'" class="screen library-real"><header class="native-head"><button @click="selectScene('campus')">‹</button><h1>图书馆</h1></header><div class="lib-hero"><small>LIBRARY GUIDE</small><h1>先看看，再选个好位置</h1><p>实景、桌椅、设施，一起看清楚。</p><nav><button class="active">研讨室</button><button>自习座位</button><button>我的收藏</button></nav></div><div class="lib-body"><section class="library-filter-card"><div class="selects"><span>黄埔校区⌄</span><span>黄埔分馆（B1）栋⌄</span></div><label class="real-search"><img src="/assets/search.png"><span>搜房间名、位置或设施</span></label><div class="capacity"><span class="active">不限人数</span><span>至少 4 人</span><span>至少 6 人</span><span>至少 8 人</span></div></section><div class="menu-heading"><strong>看看空间的样子</strong><span>18 个空间</span></div><p class="library-note">这里展示空间资料与同学反馈，实时空位和预约结果请以图书馆系统为准。</p><article class="space-card"><div class="photo-placeholder">▤<br><small>实景照片待补充</small></div><section><header><h3>冥想室（416）</h3><b>2 人容量</b></header><p>具体位置待补充</p><small>桌椅布局与空间介绍待补充</small><footer>暂无环境评价 <b>看实景与详情 →</b></footer></section></article></div></section>

        <section v-else-if="current === 'favorites' && design === 'wise'" class="screen wise-favorites-page">
          <header class="wise-favorites-heading">
            <div class="wise-favorites-topline">
              <button aria-label="返回个人中心" @click="selectScene('profile')"><IconSymbol name="back" :size="27" /></button>
              <span aria-hidden="true"></span>
            </div>
            <small>SAVED PLACES</small>
            <div class="wise-favorites-title"><h1>我的收藏</h1><b>{{ visibleFavoriteStores.length }}</b></div>
            <div class="wise-favorites-subline"><p>收好喜欢的店，下次直接找到。</p><button class="manage" @click="toggleFavoriteManaging">{{ favoriteManaging ? '完成' : '管理' }}</button></div>
          </header>

          <nav class="wise-favorite-tabs">
            <button :class="{ active: favoriteTab === 'store' }" @click="favoriteTab = 'store'">校园店铺</button>
            <button :class="{ active: favoriteTab === 'stall' }" @click="favoriteTab = 'stall'">桥苑小摊</button>
            <button :class="{ active: favoriteTab === 'library' }" @click="favoriteTab = 'library'">图书馆</button>
          </nav>

          <template v-if="favoriteTab === 'store'">
            <section class="wise-favorite-context">
              <span>{{ visibleFavoriteStores.length }} 家已收藏</span>
              <button><IconSymbol name="pin" :size="18" /> 地图查看</button>
            </section>
            <section v-if="visibleFavoriteStores.length" class="wise-favorite-list">
              <article v-for="(item, index) in visibleFavoriteStores" :key="item.name">
                <button v-if="favoriteManaging" class="wise-favorite-check" :class="{ selected: selectedFavorites.has(item.name) }" :aria-label="`选择${item.name}`" @click="toggleFavoriteSelection(item.name)">{{ selectedFavorites.has(item.name) ? '✓' : '' }}</button>
                <span v-else class="wise-favorite-index">{{ favoriteRankLabels[index] }}</span>
                <img :src="asset(item.image)" :alt="item.name">
                <div><small>校园店铺</small><h2>{{ item.name }}</h2><p>营业至 {{ item.time.split('--')[1]?.slice(0, 5) }}</p><footer><b>★ {{ item.score }}</b><span>{{ item.ratings }} 人评分</span></footer></div>
              </article>
            </section>
            <section v-else class="wise-favorite-empty"><h2>暂无收藏</h2><p>去校园店铺看看吧。</p><button @click="selectScene('mall')">浏览店铺</button></section>
          </template>

          <section v-else class="wise-favorite-empty">
            <small>{{ favoriteTab === 'library' ? 'SAVED SPACES' : 'SAVED STALLS' }}</small>
            <h2>{{ favoriteTab === 'library' ? '还没有收藏空间' : '还没有收藏小摊' }}</h2>
            <p>{{ favoriteTab === 'library' ? '找到合适的学习位置后，可以收藏到这里。' : '收藏喜欢的小摊，下次会更容易找到。' }}</p>
            <button @click="selectScene(favoriteTab === 'library' ? 'library' : 'stalls')">{{ favoriteTab === 'library' ? '浏览图书馆' : '浏览小摊' }}</button>
          </section>

          <footer v-if="favoriteManaging" class="wise-favorite-action">
            <span>已选择 {{ selectedFavorites.size }} 项</span>
            <button :disabled="selectedFavorites.size === 0" @click="removeSelectedFavorites">取消收藏</button>
          </footer>
        </section>

        <section v-else-if="current === 'favorites'" class="screen original-favorites">
          <header class="original-native-head">
            <button aria-label="返回个人中心" @click="selectScene('profile')">‹</button>
            <h1>店铺收藏</h1>
          </header>
          <nav class="favorite-tabs">
            <button :class="{ active: favoriteTab === 'store' }" @click="favoriteTab = 'store'">店铺</button>
            <button :class="{ active: favoriteTab === 'library' }" @click="favoriteTab = 'library'">图书馆</button>
            <button :class="{ active: favoriteTab === 'stall' }" @click="favoriteTab = 'stall'">桥苑小摊</button>
            <button v-if="favoriteTab !== 'stall'" class="favorite-map">📍 <span>地图</span> ›</button>
            <button class="favorite-manage" @click="toggleFavoriteManaging">{{ favoriteManaging ? '完成' : '管理' }}</button>
          </nav>
          <div v-if="favoriteTab === 'store'" class="favorite-list">
            <article v-for="item in favoriteStores" :key="item.name">
              <input v-if="favoriteManaging" type="checkbox" :aria-label="`选择${item.name}`">
              <img :src="asset(item.image)" :alt="item.name">
              <section>
                <header><h2>{{ item.name }}</h2><b>自提</b></header>
                <p>营业时间:{{ item.time }}</p>
                <footer><strong>评分: {{ item.score }}</strong><span>{{ item.ratings }}人评分</span></footer>
              </section>
            </article>
          </div>
          <div v-else class="favorite-empty">{{ favoriteTab === 'library' ? '还没有收藏图书馆空间' : '还没有收藏桥苑摊位' }}</div>
          <button v-if="favoriteManaging" class="favorite-cancel">取消收藏</button>
        </section>

        <section v-else-if="current === 'friends' && design === 'wise'" class="screen wise-friends-page">
          <header class="wise-friends-hero">
            <div class="wise-friends-topline">
              <span>QINGKUAI CIRCLE · 03</span>
              <button aria-label="更多"><IconSymbol name="more" :size="20" /></button>
            </div>
            <div class="wise-friends-title">
              <div><h1>好友</h1><p>一起发现校园里的好味道。</p></div>
              <div class="reference-avatar friend-avatar"></div>
            </div>
            <label class="wise-friend-search">
              <IconSymbol name="search" :size="20" />
              <input v-model="friendQuery" type="search" placeholder="搜索好友" aria-label="搜索好友">
            </label>
          </header>

          <nav class="wise-message-strip" aria-label="消息分类">
            <button><IconSymbol name="likes" :size="25" /><span>收到的赞</span></button>
            <button><IconSymbol name="followers" :size="25" /><span>新增关注</span></button>
            <button><IconSymbol name="replies" :size="25" /><span>新的回复</span></button>
            <button><IconSymbol name="system" :size="25" /><span>系统通知</span><i>34</i></button>
          </nav>

          <section class="wise-friend-recommendations">
            <header><div><small>PEOPLE YOU MAY KNOW</small><h2>认识新朋友</h2></div><button>换一批</button></header>
            <div>
              <article v-for="(item, index) in friendRecommendations" :key="item.id">
                <div :class="['wise-recommend-avatar', { alternate: index === 1 }]"><span>{{ index === 0 ? 'W' : 'Q' }}</span></div>
                <small>为你推荐</small>
                <h3>{{ item.name }}</h3>
                <p>{{ item.id }}</p>
                <button :class="{ followed: followedFriendIds.has(item.id) }" @click="toggleFollow(item.id)">
                  {{ followedFriendIds.has(item.id) ? '已关注' : '关注' }}
                </button>
              </article>
            </div>
          </section>

          <section class="wise-friend-directory">
            <header><div><small>YOUR CIRCLE</small><h2>你的好友</h2></div><span>{{ filteredFriends.length }} 位</span></header>
            <div v-if="filteredFriends.length">
              <article v-for="(item, index) in filteredFriends" :key="item.name">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <div :class="['reference-avatar', `friend-${friends.indexOf(item)}`]"></div>
                <div><strong>{{ item.name }}</strong><small>{{ item.note }}</small></div>
                <button aria-label="查看好友"><IconSymbol name="arrow" :size="20" /></button>
              </article>
            </div>
            <p v-else class="wise-friend-empty">没有找到匹配的好友</p>
          </section>
        </section>

        <section v-else-if="current === 'friends'" class="screen friends-real"><header class="friend-profile"><div class="reference-avatar friend-avatar"></div><h1>一树山茶?</h1></header><label class="real-search"><img src="/assets/search.png"><span>点击搜索好友</span></label><section class="friend-card recommend"><header><h2>可能想认识的人</h2><button>↻ 换一批</button></header><article v-for="item in friendRecommendations" :key="item.id"><div class="avatar-placeholder"></div><div><strong>{{ item.name }}<small>({{ item.id }})</small></strong><span>为你推荐</span></div><button>关注</button></article></section><section class="friend-card message-box"><header><h2>消息</h2><span>清除未读</span></header><div class="message-grid"><button><IconSymbol name="likes" :size="29" />收到的赞</button><button><IconSymbol name="followers" :size="29" />新增关注</button><button><IconSymbol name="replies" :size="29" />新的回复</button><button><IconSymbol name="system" :size="29" />系统通知<i>34</i></button></div><h2>你的好友</h2><article v-for="(item, index) in friends" :key="item.name" class="friend-row"><div :class="['reference-avatar', `friend-${index}`]"></div><div><strong>{{ item.name }}</strong><small>{{ item.note }}</small></div></article></section><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <section v-else-if="current === 'profile' && design === 'wise'" class="screen wise-profile-page">
          <header class="wise-profile-identity">
            <div class="wise-profile-topline">
              <span>QINGKUAI ID · 011407</span>
              <button aria-label="设置"><IconSymbol name="more" :size="20" /></button>
            </div>
            <div class="wise-profile-person">
              <div class="reference-avatar wise-profile-avatar"></div>
              <div>
                <small>校园生活家</small>
                <h1>一树山茶?</h1>
                <p>简介：卧槽+32</p>
              </div>
            </div>
            <button class="wise-profile-id">
              <span>QUICK36328162_011407</span>
              <b>复制 ID</b>
            </button>
          </header>

          <section class="wise-profile-stats" aria-label="个人数据">
            <div><small>关注</small><b>23</b></div>
            <div><small>粉丝</small><b>5</b></div>
            <div><small>用龄</small><b>1 年</b></div>
          </section>

          <section class="wise-profile-collection">
            <header><div><small>SAVED ON CAMPUS</small><h2>我的收藏</h2></div><b>13</b></header>
            <button @click="selectScene('favorites')">
              <IconSymbol name="shop" :size="34" />
              <span><strong>收藏的店铺与小摊</strong><small>随时回到喜欢的味道</small></span>
              <IconSymbol name="arrow" :size="22" />
            </button>
          </section>

          <section class="wise-profile-tools">
            <header><small>MY ACTIVITY</small><h2>我的工具</h2></header>
            <div>
              <button><IconSymbol name="checkin" :size="31" /><span><strong>每日签到</strong><small>今天还未签到</small></span><b>去签到</b></button>
              <button><IconSymbol name="shop" :size="31" /><span><strong>头像商城</strong><small>挑一个新的校园头像</small></span><IconSymbol name="arrow" :size="20" /></button>
              <button><IconSymbol name="star" :size="25" /><span><strong>我的评分</strong><small>已经留下 14 条评分</small></span><IconSymbol name="arrow" :size="20" /></button>
            </div>
          </section>

          <section class="wise-profile-services">
            <header><small>SERVICE</small><h2>校园服务</h2></header>
            <div>
              <button><IconSymbol name="feedback" :size="29" /><span>反馈</span><IconSymbol name="arrow" :size="18" /></button>
              <button><IconSymbol name="notice" :size="29" /><span>通知</span><IconSymbol name="arrow" :size="18" /></button>
              <button><IconSymbol name="contact" :size="29" /><span>联系我们</span><IconSymbol name="arrow" :size="18" /></button>
              <button><IconSymbol name="map" :size="29" /><span>校园地图</span><IconSymbol name="arrow" :size="18" /></button>
            </div>
          </section>
        </section>

        <section v-else-if="current === 'profile'" class="screen profile-real"><div class="profile-bg"><div class="profile-user"><div class="reference-avatar profile-avatar"></div><h1>一树山茶?</h1><p>关注 23 | 粉丝 5</p></div><div class="profile-meta"><span>用户ID：QUICK36328162_011407</span><span>用龄：1年</span></div><div class="profile-numbers"><span><b>14</b>评分数</span><span><b>13</b>收藏</span><span><b>0</b>积分</span></div></div><button class="collection-card" @click="selectScene('favorites')"><IconSymbol name="shop" :size="44" /><strong>我的收藏</strong></button><section class="my-card"><h2>我的卡片</h2><p>简介：卧槽+32</p></section><section class="profile-panel"><h2>我的工具</h2><div class="profile-grid two"><button><IconSymbol name="shop" :size="36" /><span>头像商城</span></button><button><IconSymbol name="checkin" :size="36" /><span>签到</span></button></div></section><section class="profile-panel"><h2>我的服务</h2><div class="profile-grid four"><button><IconSymbol name="feedback" :size="36" /><span>反馈</span></button><button><IconSymbol name="notice" :size="36" /><span>通知</span></button><button><IconSymbol name="contact" :size="36" /><span>联系我们</span></button><button><IconSymbol name="map" :size="36" /><span>地图</span></button></div></section><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <section v-else-if="design === 'wise'" :class="['screen', 'wise-store-detail', { tongguan: isTongguan }]">
          <header class="wise-store-cover">
            <img :src="asset(shopCover)" :alt="shopName">
            <button class="wise-store-back" aria-label="返回" @click="selectScene(isTongguan ? 'mall' : 'stalls')"><IconSymbol name="back" :size="28" /></button>
            <span>{{ isTongguan ? '商业中心 · 二楼' : '桥苑小摊 · 工行门' }}</span>
          </header>

          <section class="wise-store-heading">
            <div><small>{{ isTongguan ? 'CAMPUS STORE' : 'STREET FOOD' }}</small><h1>{{ shopName }}</h1><p>{{ isTongguan ? '一口回到潼关。' : '每日现做的糖水与甜品。' }}</p></div>
            <img :src="asset(shopThumb)" :alt="shopName">
          </section>

          <section class="wise-store-metrics">
            <div><small>评分</small><b>{{ shop.score }}</b></div>
            <div><small>{{ isTongguan ? '评价' : '评分人数' }}</small><b>{{ shop.people }}</b></div>
            <div><small>{{ isTongguan ? '品类' : '人均' }}</small><b>{{ isTongguan ? shop.category : shop.average }}</b></div>
          </section>

          <section class="wise-store-facts">
            <p><IconSymbol name="pin" :size="18" /><span><small>位置</small><b>{{ shop.place }}<template v-if="!isTongguan"> · 工行门附近</template></b></span></p>
            <p><IconSymbol name="bell" :size="17" /><span><small>营业时间</small><b>{{ shop.time }}</b></span></p>
            <p class="live"><i></i><span><small>现场情况</small><b>{{ isTongguan ? '1 人正在探店' : '最近还没人确认' }}</b></span><button>查看记录</button></p>
          </section>

          <nav class="store-tabs wise-store-tabs">
            <button :class="{ active: detailTab === 'about' }" @click="selectDetailTab('about')">{{ isTongguan ? '店铺位置' : '介绍' }}</button>
            <button :class="{ active: detailTab === 'menu' }" @click="selectDetailTab('menu')">{{ isTongguan ? '点餐二维码' : '菜单' }}</button>
            <button :class="{ active: detailTab === 'reviews' }" @click="selectDetailTab('reviews')">{{ isTongguan ? '留言' : '评价 3' }}</button>
          </nav>

          <section v-if="detailTab === 'about'" class="wise-store-content wise-store-about">
            <header><small>{{ isTongguan ? 'STORE LOCATION' : 'ABOUT THE STALL' }}</small><h2>{{ isTongguan ? '店铺位置' : '摊位介绍' }}</h2></header>
            <p>{{ isTongguan ? '位于商业中心天桥附近二楼，营业时段为 08:00—23:59。' : '人均 10 元，多种糖水甜品。每日现做，营业时段为 11:00—22:30。' }}</p>
            <dl><div><dt>{{ isTongguan ? '位置' : '推荐' }}</dt><dd>{{ isTongguan ? '天桥附近二楼' : '龙眼桂花冻' }}</dd></div><div><dt>品类</dt><dd>{{ shop.category }}<template v-if="!isTongguan"> · 甜品</template></dd></div><div><dt>状态</dt><dd>资料持续更新</dd></div></dl>
          </section>

          <section v-else-if="detailTab === 'menu'" class="wise-store-content wise-store-menu">
            <template v-if="isTongguan">
              <header><small>ORDER ONLINE</small><h2>点餐二维码</h2></header>
              <img class="wise-order-banner large" src="/assets/screenshot-crops/order-banner.jpg" alt="点餐二维码区域">
              <p class="wise-order-note">扫码查看当前菜单与价格，实际供应情况以店内为准。</p>
            </template>
            <template v-else>
              <header><small>STALL MENU</small><h2>摊位菜单</h2><span>价格以现场为准</span></header>
              <div class="wise-menu-list">
              <p><span><i>01</i>芒果斑斓椰</span><b>小 ¥9 · 大 ¥11</b></p>
              <p><span><i>02</i>芒果仙草</span><b>当日供应</b></p>
              <p><span><i>03</i>桂花酒酿小丸子</span><b>当日供应</b></p>
              <p><span><i>04</i>椰汁红豆酒酿豆花小丸子</span><b>当日供应</b></p>
              <p><span><i>05</i>冰渣清补凉</span><b>当日供应</b></p>
              <p><span><i>06</i>多芒麻薯碗</span><b>当日供应</b></p>
              </div>
            </template>
          </section>

          <section v-else class="wise-store-content wise-store-reviews">
            <header class="wise-rating-summary">
              <b>{{ shop.score }}</b>
              <span><small>商家评分</small><strong>★★★★☆</strong></span>
              <span><small>评价人数</small><strong>{{ shop.people }}</strong></span>
            </header>
            <img v-if="isTongguan" class="wise-order-banner" src="/assets/screenshot-crops/order-banner.jpg" alt="点餐二维码区域">
            <div class="wise-review-title"><div><small>{{ isTongguan ? 'MESSAGES' : 'REVIEWS' }}</small><h2>{{ isTongguan ? '留言' : '全部评价' }}</h2></div><button>写评价</button></div>
            <article v-for="(comment, index) in shopComments" :key="comment.name + comment.time">
              <header><div>{{ String(index + 1).padStart(2, '0') }}</div><span><b>{{ comment.name }}</b><small>{{ comment.time }}</small></span><strong>•••</strong></header>
              <p>{{ comment.text }}</p>
              <aside v-if="comment.reply">{{ comment.reply }}</aside>
              <footer><span>♡ {{ comment.likes }}</span><span>回复</span><span>分享</span></footer>
            </article>
          </section>

          <nav :class="['wise-detail-actions', { tongguan: isTongguan }]">
            <button><IconSymbol name="star" :size="22" /><span>评分</span></button>
            <button><IconSymbol name="heart" :size="22" /><span>收藏</span></button>
            <button><IconSymbol name="arrow" :size="22" /><span>分享</span></button>
            <button v-if="isTongguan"><IconSymbol name="notice" :size="21" /><span>举报</span></button>
            <button v-if="isTongguan" class="primary">立即前往</button>
          </nav>
        </section>

        <section v-else class="screen store-detail-real" :class="isTongguan ? 'tongguan-detail' : 'doudou-detail'">
          <div class="store-hero"><button @click="selectScene(isTongguan ? 'mall' : 'stalls')"><IconSymbol name="back" :size="30" /></button><img :src="asset(shopCover)" :alt="shopName"><span>{{ isTongguan ? '线上点餐　　线下点餐' : '摊位实景' }}</span></div>
          <div class="store-title"><img class="store-avatar" :src="asset(shopThumb)" :alt="shopName"><div class="store-name-line"><h1>{{ shopName }}</h1><em>{{ shop.category }}</em></div><div class="stat-row"><span>评分<b>{{ shop.score }}</b></span><span>{{ isTongguan ? '访客量' : '评分人数' }}<b>{{ shop.people }}</b></span><span>{{ isTongguan ? '位置' : '人均' }}<b>{{ isTongguan ? shop.place : shop.average }}</b></span><span>{{ isTongguan ? '类型' : '浏览' }}<b>{{ isTongguan ? shop.category : '179' }}</b></span></div></div>
          <div class="detail-information"><p>⌖ {{ shop.place }}<template v-if="!isTongguan"> · 工行门附近</template></p><p>▣ {{ shop.time }}</p><p v-if="!isTongguan">⚑ <span>糖水</span><span>甜品</span></p><p v-else>📖 一口回到潼关。</p></div>
          <div class="live-status"><small>现场情况</small><strong><i></i>{{ isTongguan ? '1人正在探店…' : '最近还没人确认' }}</strong><button>查看记录</button><p>{{ isTongguan ? '本周访问次数: 1，占总体的比例 100.0%' : '最近还没有新的反馈' }}</p></div>
          <nav class="store-tabs"><button :class="{active:detailTab==='about'}" @click="selectScene(isTongguan ? 'laotongguan-message' : 'xudoudou-top')">{{ isTongguan ? '店铺位置' : '介绍' }}</button><button :class="{active:detailTab==='menu'}" @click="!isTongguan && selectScene('xudoudou-menu')">{{ isTongguan ? '点餐二维码' : '菜单' }}</button><button :class="{active:detailTab==='reviews'}" @click="selectScene(isTongguan ? 'laotongguan-message' : 'xudoudou-message')">{{ isTongguan ? '留言' : '评价 3' }}</button></nav>
          <div v-if="detailTab === 'about'" class="store-blocks about-state"><h2>{{ isTongguan ? '店铺位置' : '摊位介绍' }}</h2><p>{{ isTongguan ? '商业中心天桥附近二楼，一口回到潼关。' : '人均10元，多种糖水甜品。每日现做，营业时段为 11:00—22:30。' }}</p><div class="rating-card"><b>{{ shop.score }}</b><span>商家评分<br>★★★★☆</span><span>评分人数<br>{{ shop.people }}</span></div></div>
          <div v-else-if="detailTab === 'menu'" class="store-blocks menu-state"><template v-if="isTongguan"><h2>点餐二维码</h2><img class="order-banner" src="/assets/screenshot-crops/order-banner.jpg" alt="点餐二维码区域"></template><template v-else><div class="text-menu"><h3>摊位菜单</h3><p>芒果斑斓椰（小9 大11）</p><p>芒果仙草 / 桂花酒酿小丸子</p><p>椰汁红豆酒酿豆花小丸子</p><p>冰渣清补凉 / 椰汁西瓜小丸子</p><p>木薯芋圆 / 多芒麻薯碗</p></div></template></div>
          <div v-else class="store-blocks comments"><div class="rating-card"><b>{{ shop.score }}</b><span>商家评分<br>★★★★☆</span><span>评分人数<br>{{ shop.people }}</span></div><img v-if="isTongguan" class="order-banner" src="/assets/screenshot-crops/order-banner.jpg" alt="点餐二维码区域"><h2><img src="/assets/message.png">{{ isTongguan ? '留言' : '全部评价' }}</h2><button class="say-something"><img src="/assets/say.svg">说点什么</button><article v-for="comment in shopComments" :key="comment.name + comment.time"><header><div class="avatar-placeholder"></div><div><b>{{ comment.name }}</b><small>{{ comment.time }}</small></div></header><p>{{ comment.text }}</p><aside v-if="comment.reply">{{ comment.reply }}</aside><footer>♥ {{ comment.likes }}　回复　分享</footer></article></div>
          <div :class="['detail-action-bar',{tongguan:isTongguan}]"><button><b>★</b><span>评分</span></button><button><b>♥</b><span>收藏</span></button><button><b>●</b><span>分享</span></button><button v-if="isTongguan"><b>♙</b><span>举报</span></button><button v-if="isTongguan" class="go-now">立即前往</button></div>
        </section>
      </PhoneShell></div>
      <footer class="stage-footer"><span>STATIC PROTOTYPE · 17 SCENES × 2 DESIGNS</span><span>场景、设计版本与底栏均可切换</span></footer>
    </section>
  </div>
</template>
