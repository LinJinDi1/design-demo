<script setup>
/*
 * App.vue 是整个项目唯一的主控组件：桌面设计台外壳 + 17 个手机场景。
 * 阅读顺序建议：
 *   1. script 上半段（本段下方）：状态与数据流，全部来自 fixtures.js，无接口请求
 *   2. template 的 <aside class="sidebar">：左侧场景索引
 *   3. template 里那一长串 v-if / v-else-if：每个分支就是一个手机页面，已加中文注释
 * 新增页面要动三个地方：fixtures.js 的 scenes、这里的 v-else-if 分支、对应 CSS。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import {
  scenes, stalls, mallZones, mallShops, dishes, commentsByShop, friendRecommendations,
  friends, homeShortcuts, homeBanners, homeStores, favoriteStores, goldenBoardStores, goldenBoardEntries,
  randomStores, v5Entries, v5GuessTabs, v5GuessStores, v5Notices, v5HotWords, v5Zones, v5CategoryChips,
  v5Ideas, v5MbtiList,
  /* 下面这批是 V5 五个子页面（盲盒机 / 灵感小盒 / MBTI食堂 / 店铺详情 / 我的收藏）的数据 */
  v5Shops, v5Scopes, v5Tastes, v5Prices, v5AreaLabel, v5BoxColors, v5OrbColors, v5OrbPos,
  v5MbtiQuiz, v5MbtiTypes, v5Favorites, v5FavEmpty, v5DetailDemo,
  /* 灵感小盒发布流：快捷标签 / 同学头像 / 评论 / 好友动态初始内容 */
  v5IdeaQuickTags, v5IdeaPeers, v5IdeaComments, v5FriendFeed,
  /* 校园三个板块 / 交友动态 / 我的页 */
  v5CampusBoards, v5LostTabs, v5LostCats, v5LostItems,
  v5MarketCats, v5MarketItems,
  v5HelpTabs, v5HelpKinds, v5HelpItems, v5OrderStatus, v5OrderStatusMarket,
  v5OrderReasons, v5OrderSteps, v5OrderStepsMarket,
  v5FeedPosts, v5PostTypes, v5MyStats, v5MyServices,
  /* 进店逛：位置下拉选项 / 一楼食谱模式 / 顶部推广位 */
  v5ZoneSpots, v5FloorSpots, v5ZonePromos, v5Menus,
  /* 校园三板块共用：校区筛选（大学城 / 桂花岗 / 黄埔） */
  v5Campuses,
  /* 我的页新入口：我的消息（同学互动）；新增关注走「粉丝」数字红点进去 */
  v5FollowTabs, v5Followers, v5MyNoticeTabs, v5MyNotices, v5MyNoticeKind,
  /* 我的页「我的发布」：tab 分类；投诉能选的原因 */
  v5MyPostTabs, v5ReportReasons,
  /* 用户主页：同学档案（头像底色 / 校区 / 一句话 / 标签 / 数据） */
  v5People, v5PeopleDefault,
  /* 校园服务「通知」：开发项目组发给全体同学的官方通知 */
  v5AnnounceTabs, v5AnnounceKind, v5Announces,
} from './fixtures';
/* 图标库：v5Icon('名字', 尺寸) 返回一段可直接 v-html 的 svg。
   金刚区、校园页、我的页的按钮图标全在这里，改图标去 src/v5-icons.js */
import { v5Icon } from './v5-icons';
import PhoneShell from './components/PhoneShell.vue';
import IconSymbol from './components/IconSymbol.vue';
/* 现版（live）分支：照 quick-pick-main 源码 1:1 复刻的五个 tab 页面 */
import LiveHome from './live/LiveHome.vue';
import LiveList from './live/LiveList.vue';
import LiveCampus from './live/LiveCampus.vue';
import LiveFriends from './live/LiveFriends.vue';
import LiveProfile from './live/LiveProfile.vue';

const params = new URLSearchParams(location.search);
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const current = ref(scenes.some((scene) => scene.id === params.get('scene')) ? params.get('scene') : 'home');
const designParam = params.get('design');
const design = ref(['wise', 'v5', 'live'].includes(designParam) ? designParam : 'v5');
const homeDark = ref(params.get('theme') !== 'light');
/* 现版分支目前只还原 5 个 tab 页，切到「现版」时左侧索引只留这 5 个，
   免得点到没有现版实现的场景时掉回原版页面 */
const LIVE_SCENES = ['home', 'stalls', 'campus', 'friends', 'profile'];
/* 现版页面和原版不是同一套命名，左侧索引单独给一套标签/备注 */
const LIVE_SCENE_LABELS = {
  home: { label: '首页', note: '去哪吃 + 猜你喜欢' },
  stalls: { label: '自提 · 校园觅食', note: '小摊列表' },
  campus: { label: '校园', note: '轮播 + 服务卡' },
  friends: { label: '好友', note: '消息 + 好友列表' },
  profile: { label: '我的', note: '资料 + 工具 + 服务' },
};
function sceneLabel(scene) {
  const live = design.value === 'live' ? LIVE_SCENE_LABELS[scene.id] : null;
  return live ? live.label : scene.label;
}
function sceneNote(scene) {
  const live = design.value === 'live' ? LIVE_SCENE_LABELS[scene.id] : null;
  return live ? live.note : scene.note;
}
const visibleScenes = computed(() =>
  design.value === 'live' ? scenes.filter((scene) => LIVE_SCENES.includes(scene.id)) : scenes,
);
const visibleGroups = computed(() => [...new Set(visibleScenes.value.map((scene) => scene.group))]);
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

const v5BoxOpening = ref(false);
const v5OpenCount = computed(() => stalls.length + mallShops.length);

/* V5 首页「猜你喜欢」：当前选中的筛选 tab（all / shangye / qiaoyuan），默认全部推荐 */
const v5GuessArea = ref('all');
/* 全部推荐只显示街边小摊 + 商业中心，饭堂不进首页推荐（和参考稿一致） */
const v5GuessList = computed(() => v5GuessStores
  .filter((s) => (v5GuessArea.value === 'all'
    ? s.area === 'qiaoyuan' || s.area === 'shangye'
    : s.area === v5GuessArea.value))
  .slice()
  .sort((a, b) => b.hot - a.hot));
/* 卡片上的绿色小标签 */
function v5AreaFlag(area) {
  if (area === 'qiaoyuan') return '街边小摊';
  if (area === 'fentang') return '庆园饭堂';
  return '商业中心';
}
/* 卡片跳转：优先用数据里配好的 target */
/* 卡片点击：统一进 V5 店铺详情。
   首页「猜你喜欢」用的是简版数据（photo/place，没有人均），
   这里先按店名去完整店铺池取一份，把人均、营业时间这些补齐 */
function v5OpenStore(store) {
  const full = v5Shops.find((s) => s.name === store.name);
  v5OpenShop({
    ...store,
    ...(full || {}),
    img: (full && full.img) || store.img || store.photo,
    pos: (full && full.pos) || store.pos || store.place,
  });
}

/* 通知弹窗开关，点首页通知栏打开，点遮罩或 × 关闭 */
const v5NoticeOpen = ref(false);

/* 进店逛：当前分区（金刚区点进哪个就是哪个）+ 品类筛选 + 位置筛选
   设计台里可以直接带 URL 参数定位，比如 ?scene=v5-zone&zone=fentang&spot=菊苑一楼 */
const zoneParam = params.get('zone');
const spotParam = params.get('spot');
const v5Zone = ref(v5Zones.some((z) => z.id === zoneParam) ? zoneParam : 'qiaoyuan');
const v5ZoneCat = ref('全部分类');
/* 当前选中的位置，默认「全部位置」。选到饭堂一楼时列表会切成食谱 */
const v5ZoneSpot = ref(
  (v5ZoneSpots[v5Zone.value] || []).includes(spotParam) ? spotParam : '全部位置',
);
const v5SpotOpen = ref(false);          // 「按位置筛选」下拉浮层开关
const v5ZoneInfo = computed(() => v5Zones.find((z) => z.id === v5Zone.value) || v5Zones[0]);
/* 三个榜单：点一下选中，再点一下取消，所以默认是空 = 不排序 */
const v5ZoneRank = ref('');
const v5Ranks = [
  { id: 'hot', label: '人气榜', ico: '🔥' },
  { id: 'like', label: '收藏榜', ico: '♡' },
  { id: 'fame', label: '口碑榜', ico: '★' },
];
function v5ToggleRank(id) {
  v5ZoneRank.value = v5ZoneRank.value === id ? '' : id;
}
/* 当前分区在下拉里能选哪些位置 */
const v5ZoneSpotList = computed(() => v5ZoneSpots[v5Zone.value] || ['全部位置']);
/* 每个位置各有多少家（「全部位置」= 总数），数字显示在下拉右侧 */
const v5SpotCount = (spot) => {
  if (spot === '全部位置') return v5GuessStores.filter((s) => s.area === v5Zone.value).length;
  return v5GuessStores.filter((s) => s.area === v5Zone.value && s.place === spot).length;
};
/* 选到饭堂一楼 → 这一层没有单独店铺，出的是「食谱」 */
const v5IsFloor = computed(() => v5FloorSpots.includes(v5ZoneSpot.value));
const v5MenuList = computed(() => {
  const raw = v5Menus[v5ZoneSpot.value] || [];
  const list = v5ZoneCat.value === '全部分类' ? raw.slice() : raw.filter((m) => m.cat === v5ZoneCat.value);
  return list.slice().sort((a, b) => b.rec - a.rec);
});
const v5ZoneList = computed(() => {
  const list = v5GuessStores
    .filter((s) => s.area === v5Zone.value)
    .filter((s) => v5ZoneSpot.value === '全部位置' || s.place === v5ZoneSpot.value)
    .filter((s) => v5ZoneCat.value === '全部分类' || s.cat.includes(v5ZoneCat.value))
    .slice();
  /* 没选榜单就保持原本顺序（这也是默认状态） */
  if (v5ZoneRank.value === 'fame') return list.sort((a, b) => b.rating - a.rating);
  if (v5ZoneRank.value === 'like') return list.sort((a, b) => b.people - a.people);
  if (v5ZoneRank.value === 'hot') return list.sort((a, b) => b.hot - a.hot);
  return list;
});
function v5PickSpot(spot) {
  v5ZoneSpot.value = spot;
  v5SpotOpen.value = false;
}
function v5SpotReset() { v5PickSpot('全部位置'); }
function v5OpenZone(id) {
  v5Zone.value = id;
  v5ZoneCat.value = '全部分类';
  v5ZoneSpot.value = '全部位置';
  v5ZoneRank.value = '';
  v5SpotOpen.value = false;
  v5Nav('v5-zone');
}
/* 金刚区：带 zone 的进进店逛，其余直接跳对应场景 */
function v5EntryClick(entry) {
  if (entry.zone) { v5OpenZone(entry.zone); return; }
  /* 金刚区的「我的收藏」是从首页进的，返回要回首页，不能直接丢回我的页 */
  if (entry.scene === 'favorites') { v5OpenFav('home'); return; }
  v5Nav(entry.scene);
}

/* 搜索页：输入内容与结果列表 */
const v5SearchText = ref('');
const v5SearchList = computed(() => {
  const kw = v5SearchText.value.trim();
  if (!kw) return [];
  return v5GuessStores.filter((s) => s.name.includes(kw) || s.place.includes(kw) || s.cat.some((c) => c.includes(kw)));
});
function v5OpenSearch() { v5SearchText.value = ''; v5Nav('v5-search'); }

/* ================= 灵感小盒（今天做什么） ================= */
const v5IdeaMax = 10;
/* 洗牌池：抽完一轮再重新洗，保证 12 条都轮到才会重复 */
const v5IdeaPool = ref([]);
const v5IdeaCur = ref(v5Ideas[6]);
const v5IdeaLeft = ref(9);
const v5IdeaHist = ref([]);
const v5IdeaBusy = ref(false);
const v5IdeaEgg = ref(false);
const v5IdeaShow = ref(false);
const v5IdeaFlip = ref(false);
const v5IdeaHistOpen = ref(false);
let v5IdeaTimers = [];
function v5IdeaClearTimers() { v5IdeaTimers.forEach((t) => window.clearTimeout(t)); v5IdeaTimers = []; }
function v5IdeaLater(fn, ms) { v5IdeaTimers.push(window.setTimeout(fn, ms)); }
/* 抽一次：机器摇 → 出蛋 → 露出卡背 → 翻到正面，四步按参考稿的节奏走 */
function v5IdeaDraw() {
  if (v5IdeaBusy.value) return;
  if (v5IdeaLeft.value <= 0) return;
  v5IdeaBusy.value = true;
  v5IdeaClearTimers();
  v5IdeaEgg.value = false;
  v5IdeaShow.value = false;
  /* 卡背先复位，等淡出后再翻回背面，避免看见反向翻转 */
  v5IdeaLater(() => { v5IdeaFlip.value = false; }, 430);
  v5IdeaLater(() => {
    if (!v5IdeaPool.value.length) {
      v5IdeaPool.value = v5Ideas.slice().sort(() => Math.random() - 0.5);
    }
    const pick = v5IdeaPool.value.pop();
    v5IdeaEgg.value = true;
    v5IdeaLeft.value -= 1;
    v5IdeaHist.value = [pick, ...v5IdeaHist.value];
    v5IdeaLater(() => {
      v5IdeaCur.value = pick;
      v5IdeaShow.value = true;              // 先露出淡绿卡背
      v5IdeaLater(() => {
        v5IdeaFlip.value = true;            // 再自动翻到正面
        v5IdeaBusy.value = false;
      }, 640);
    }, 580);
  }, 880);
}
/* 「换一个」= 再扭一次 */
function v5IdeaSkip() { v5IdeaDraw(); }

/* ---------- 发布流：就这个了 → 分享你的想法 → 已出发 ---------- */
/* v5IdeaPost 为 null 时页面是「没发布」的状态；发布后变成一个想法对象 */
const v5IdeaPost = ref(null);
const v5IdeaComposer = ref(false);   // 「分享你的想法」弹窗
const v5IdeaDraft = ref('');         // 弹窗输入框
const v5IdeaDraftTag = ref('');      // 弹窗里选中的快捷标签
const v5IdeaAnon = ref(false);       // 匿名发布开关
const v5IdeaReply = ref('');         // 想法卡底部回复框
/* 好友页的动态流：别人的预置内容 + 我发出去的（每次发布插到最前面） */
const v5IdeaFeed = ref(v5FriendFeed.map((f) => ({ ...f })));

/* 「就这个了」：收起卡片，弹出「分享你的想法」 */
function v5IdeaConfirm() {
  v5IdeaShow.value = false;
  v5IdeaClearTimers();
  v5IdeaLater(() => { v5IdeaFlip.value = false; }, 430);
  v5IdeaDraft.value = '';
  v5IdeaDraftTag.value = '';
  v5IdeaAnon.value = false;
  v5IdeaComposer.value = true;
}
function v5IdeaCloseComposer() { v5IdeaComposer.value = false; }
/* 快捷标签点第二次取消 */
function v5IdeaPickTag(tag) { v5IdeaDraftTag.value = v5IdeaDraftTag.value === tag ? '' : tag; }
/* 发布：把灵感 + 我填的话打包成一条动态 */
function v5IdeaPublish() {
  const idea = v5IdeaCur.value;
  const say = v5IdeaDraft.value.trim();
  v5IdeaPost.value = {
    k: idea.k, cat: idea.cat, t: idea.t, s: idea.s, c: idea.c, tc: idea.tc,
    text: say || `我决定今天${idea.t}～`,   // 没填就用默认句
    tag: v5IdeaDraftTag.value,
    anon: v5IdeaAnon.value,
    time: '刚刚',
    like: 22,
    liked: false,
    peers: 10,
    comments: (v5IdeaComments[idea.k] || []).map((m) => ({ ...m, liked: false })),
  };
  v5IdeaComposer.value = false;
  v5IdeaReply.value = '';
  /* 同步到 V5 交友页的好友动态，发的内容两边都能看到 */
  v5FeedList.value.unshift({
    id: 'idea' + Date.now(),
    type: 'idea',
    ac: v5IdeaAnon.value ? '#DAD9D6' : '#D9E4C9',
    n: v5IdeaAnon.value ? '匿名用户' : '我',
    t: '刚刚',
    cat: idea.cat,
    title: idea.t,
    body: say || `我决定今天${idea.t}～`,
    like: 0,
    cmt: 0,
    liked: false,
    comments: [],
    mine: true,
  });
  /* 同步到好友动态：勾了匿名就顶着一个灰色头像出现，不显示昵称 */
  v5IdeaFeed.value = [{
    ac: v5IdeaAnon.value ? '#DAD9D6' : '#D9E4C9',
    n: v5IdeaAnon.value ? '匿名用户' : '我',
    t: '刚刚',
    cat: idea.cat,
    txt: idea.t,
    body: say || `我决定今天${idea.t}～`,
    like: 0,
    cmt: 0,
    anon: v5IdeaAnon.value,
    mine: true,
  }, ...v5IdeaFeed.value];
}
/* 想法卡上的点赞 */
function v5IdeaToggleLike() {
  const p = v5IdeaPost.value;
  if (!p) return;
  p.liked = !p.liked;
  p.like += p.liked ? 1 : -1;
}
/* 给某条评论点赞 */
function v5IdeaLikeCmt(m) {
  m.liked = !m.liked;
  m.like += m.liked ? 1 : -1;
}
/* 回复一句：直接插到评论列表最上面 */
function v5IdeaSendReply() {
  const p = v5IdeaPost.value;
  const txt = v5IdeaReply.value.trim();
  if (!p || !txt) return;
  p.comments = [{ n: '我', t: '刚刚', ac: '#D9E4C9', txt, like: 0, liked: false }, ...p.comments];
  v5IdeaReply.value = '';
}
/* 「换个灵感 ›」：清掉已发布状态，回到可以再扭的界面 */
function v5IdeaRedraw() { v5IdeaPost.value = null; }
/* 好友页动态流的点赞 */
function v5FeedLike(item) {
  item.liked = !item.liked;
  item.like += item.liked ? 1 : -1;
}
function v5OpenIdea() { v5Nav('v5-idea'); }

/* ================= 校园 · 失物招领 =================
   三个列表都要能被「发布」改到，所以先用 reactive 包一层：
   fixtures 里导出的是普通数组，直接 push/unshift 页面不会刷新
*/
const v5LostAll = reactive(v5LostItems);
const v5MarketAll = reactive(v5MarketItems);
const v5HelpAll = reactive(v5HelpItems);

const v5LostTab = ref('lost');
/* 校区筛选：'all' 不过滤，否则只留该校区的内容 */
const v5LostCampus = ref('all');
const v5LostList = computed(() => v5LostAll
  .filter((i) => i.kind === v5LostTab.value)
  .filter((i) => v5LostCampus.value === 'all' || i.campus === v5LostCampus.value));
/* 每个校区各有多少条，tab 上显示 */
function v5Count(list, campus) {
  return campus === 'all' ? list.length : list.filter((i) => i.campus === campus).length;
}
/* 发完东西自动切到它所属校区，不然用户会以为没发出去 */
function v5Jump(key, campus) {
  if (key === 'lost') v5LostCampus.value = 'all';
  if (key === 'market') v5MarketCampus.value = 'all';
  if (key === 'help') v5HelpCampus.value = 'all';
  v5BoardCampus[key].value = campus || 'all';
}
/* 发布弹窗里的校区按钮：去掉「全部校区」，发布必须选一个具体校区 */
const v5CampusPick = computed(() => v5Campuses.filter((c) => c.id !== 'all'));
/* 给个默认值：设计台里直接点左边的「详情」场景也能看到内容，不会白屏 */
const v5LostCur = ref(v5LostAll[0] || null);
function v5OpenLost(id) { v5LostCur.value = v5LostAll.find((i) => i.id === id); v5Nav('v5-lost-detail'); }

/* ================= 校园 · 闲置小铺 ================= */
const v5MarketCat = ref('全部');
const v5MarketCampus = ref('all');
const v5MarketList = computed(() => (v5MarketCat.value === '全部'
  ? v5MarketAll
  : v5MarketAll.filter((i) => i.cat === v5MarketCat.value))
  .filter((i) => v5MarketCampus.value === 'all' || i.campus === v5MarketCampus.value));
const v5MarketCur = ref(v5MarketAll[0] || null);
function v5OpenMarket(id) { v5MarketCur.value = v5MarketAll.find((i) => i.id === id); v5Nav('v5-market-detail'); }

/* ---- 闲置的底部主按钮：买家「我想要」/ 卖家「标记已抢光」 ----
   点「我想要」= 下单一件，东西立刻变成「已预定」，别人就点不了了，
   订单同时出现在两边的「我的订单」里，走跟搭把手一模一样的流程。
   卖家（我自己挂的东西）这里不放「我想要」，放「标记已抢光」：
   卖完了就点一下，商品变成「已抢光」，别人看到就知道了。 */
const v5MarketOrder = computed(() => (v5MarketCur.value ? v5OrderOf(v5MarketCur.value.id) : null));
const v5MarketAct = computed(() => {
  const it = v5MarketCur.value;
  if (!it) return { t: '我想要', go: () => {}, off: true };
  const o = v5OrderOf(it.id);
  if (o) {
    if (o.taker === '我' || o.pub === '我' || it.mine) {
      return { t: '查看订单', go: () => v5OpenOrder(it.id), off: false };
    }
    return { t: '已被预定', go: () => v5BoardSay('这件已经有人预定了'), off: true };
  }
  /* 我自己挂的：只能标记卖掉了 */
  if (it.mine || it.n === '我') {
    return it.st === '已抢光'
      ? { t: '重新上架', go: () => v5MarketBack(it), off: false }
      : { t: '标记已抢光', go: () => v5MarketSoldOut(it), off: false };
  }
  if (it.st === '已抢光') return { t: '已抢光', go: () => v5BoardSay('卖家已经标记卖掉了'), off: true };
  if (it.st === '已预定') return { t: '已被预定', go: () => v5BoardSay('这件已经有人预定了，去看看别的'), off: true };
  return { t: '我想要', go: () => v5WantMarket(it), off: false };
});
/* 「我的发布」里拿到的是内容的拷贝，改状态得改到原件上 */
function v5MarketReal(it) { return v5MarketAll.find((x) => x.id === it.id) || it; }
/* 买家点「我想要」：锁成已预定 + 生成订单（contact 是买家留的联系方式） */
function v5WantMarket(it, contact) {
  if (contact === undefined) { v5AskContact(it, 'market'); return; }
  if (v5Orders[it.id]) { v5BoardSay('这件已经有人预定了'); return; }
  if (it.mine || it.n === '我') { v5BoardSay('这是你自己挂的，去「我的发布」看进展'); return; }
  const now = v5NowText();
  const real = v5MarketReal(it);
  real.st = '已预定';
  real.takenBy = '我';
  v5Orders[it.id] = {
    no: 'QK26' + String(Date.now()).slice(-8),
    pub: it.n, taker: '我', fee: it.price || 0, st: 'taken', at: now,
    takerContact: contact,
    timeline: [{ t: now, txt: `我想要「${it.title}」，已预定` }],
    ratePub: null, rateTaker: null, complaint: null,
  };
  v5BoardSay('已预定，订单生成了，去订单里复制联系方式');
  v5OpenOrder(it.id);
}
/* 卖家：卖完了就标记「已抢光」 */
function v5MarketSoldOut(it) {
  if (v5Orders[it.id]) { v5BoardSay('已经有人预定了，先去订单里处理'); return; }
  v5MarketReal(it).st = '已抢光';
  v5BoardSay('已标记「已抢光」，别人看得到了');
}
/* 卖家：又有了就重新上架 */
function v5MarketBack(it) {
  v5MarketReal(it).st = '在售';
  v5BoardSay('已重新上架');
}

/* ================= 校园 · 搭把手 ================= */
const v5HelpTab = ref('need');
const v5HelpCampus = ref('all');
const v5HelpList = computed(() => v5HelpAll
  .filter((i) => i.kind === v5HelpTab.value)
  .filter((i) => v5HelpCampus.value === 'all' || i.campus === v5HelpCampus.value));
const v5HelpCur = ref(v5HelpAll[0] || null);
function v5OpenHelp(id) { v5HelpCur.value = v5HelpAll.find((i) => i.id === id); v5Nav('v5-help-detail'); }

/* ================= 详情页底部那四个按钮（三个板块通用） =================
     留言    —— 展开输入条，发出去真的会插到留言列表最前面
     收藏    —— 记住哪些被收藏过，按钮会变成「已收藏」
     复制联系—— 把对方留的微信号复制走，自己去加（页面里没有私信了）
     主按钮  —— 接单/找他帮忙/我想要/联系对方，接单会生成订单 */

/* 收藏：三个板块共用一个集合，key 是 板块+id，避免不同板块 id 撞车 */
/* 预置几个，这样「我的收藏 · 其他」一进去就有东西看；
   key 的拼法是 板块 + id，跟 v5FavToggle 写入时保持一致 */
const v5FavIds = ref(new Set(['helph3', 'marketm4', 'lostl2']));
function v5IsFav(key) { return v5FavIds.value.has(key); }
function v5FavToggle(it, board) {
  const key = board + it.id;
  const next = new Set(v5FavIds.value);
  if (next.has(key)) { next.delete(key); v5BoardSay('已取消收藏'); }
  else { next.add(key); v5BoardSay('已收藏，在我的里面找得到'); }
  v5FavIds.value = next;
}

/* 留言输入条：顶层留言 target=null，回复某条留言时 target=那条留言 */
const v5SayOpen = ref(false);
const v5SayTxt = ref('');
const v5SayTarget = ref(null);
function v5SayTo(target) {
  v5SayTarget.value = target || null;
  v5SayOpen.value = true;
  v5SayTxt.value = '';
}
function v5SayCancel() { v5SayOpen.value = false; v5SayTarget.value = null; v5SayTxt.value = ''; }
function v5SaySend(item) {
  const txt = v5SayTxt.value.trim();
  if (!txt) { v5BoardSay('先写点什么再发'); return; }
  const t = v5SayTarget.value;
  if (t) {
    if (!t.replies) t.replies = [];
    t.replies.push({ who: '我', to: t.n, txt, t: '刚刚' });
    v5BoardSay(`已回复 @${t.n}`);
  } else {
    /* item 来自 reactive 列表，unshift 进去页面立刻多一条 */
    item.cmts.unshift({ n: '我', t: '刚刚', ac: '#EADFC8', txt, like: 0, liked: false, id: 'c' + Date.now(), replies: [] });
    v5BoardSay('留言已发出');
  }
  v5SayCancel();
}
/* 计数：一条留言算一条，它的回复也算进去 */
function v5CmtCount(list) {
  return (list || []).reduce((n, m) => n + 1 + (m.replies ? m.replies.length : 0), 0);
}
/* ================= 任务订单（搭把手 + 闲置小铺通用） =================
   以前没有私信之后，双方靠「留的联系方式」自己联系，平台这边只管一件事：
   把订单记下来 —— 谁接的、做到哪一步、做完了互相怎么评价、出问题怎么投诉。
   一份订单两边看的是同一份数据，只是能点的按钮不一样（v5MyRole 决定）。
   状态：taken 已接单 → done 接单人做完了 → finished 发布人确认了（开互评）→ rated 双方评完

   闲置小铺走的是同一套流程，只是说法不一样：
     买家点「我想要」= taken（已预定）→ 买家点「我拿到了」 → 卖家点「确认卖出」 → 互评
   区分是哪一单看 v5BoardOf(id)：help 搭把手 / market 闲置 */
const v5Orders = reactive({
  /* 预置两单：都是我发布、被同学接走，这样能直接看「发布人这一侧」能干什么 */
  h2: {
    no: 'QK26101801', pub: '我', taker: '橙子', fee: 3, st: 'done', at: '10-30 18:20',
    takerContact: '微信 cz_nanmen',
    timeline: [
      { t: '10-30 18:20', txt: '橙子接了这单' },
      { t: '10-30 18:33', txt: '橙子标记已完成，等你确认' },
    ],
    ratePub: null, rateTaker: null, complaint: null,
  },
  h4: {
    no: 'QK26101703', pub: '我', taker: '林小满', fee: 2, st: 'taken', at: '10-30 09:12',
    takerContact: '微信 linxm_0321',
    timeline: [{ t: '10-30 09:12', txt: '林小满接了这单' }],
    ratePub: null, rateTaker: null, complaint: null,
  },
  /* 我接的单：林小满发的代取快递，我做完了，等他确认 —— 演示「接单人这一侧」 */
  h1: {
    no: 'QK26101605', pub: '林小满', taker: '我', fee: 2, st: 'done', at: '10-30 16:05',
    takerContact: '微信 qingkuai_me',
    timeline: [
      { t: '10-30 16:05', txt: '我接了这单' },
      { t: '10-30 17:02', txt: '我标记已完成，等对方确认' },
    ],
    ratePub: null, rateTaker: null, complaint: null,
  },
  /* 这一单跟我没关系（别人发的、别人接的），用来演示「已被接单，别人接不了」 */
  h3: {
    no: 'QK26101711', pub: '张三', taker: '阿梨', fee: 5, st: 'taken', at: '10-30 15:40',
    takerContact: '微信 ali_book',
    timeline: [{ t: '10-30 15:40', txt: '阿梨接了这单' }],
    ratePub: null, rateTaker: null, complaint: null,
  },
  /* ---- 闲置小铺的两单 ---- */
  /* m5 是我挂出去的词典，阿梨点了「我想要」—— 演示「卖家这一侧」 */
  m5: {
    no: 'QK26101522', pub: '我', taker: '阿梨', fee: 20, st: 'taken', at: '10-30 11:26',
    takerContact: '微信 ali_2024',
    timeline: [{ t: '10-30 11:26', txt: '阿梨想要这本词典，已预定' }],
    ratePub: null, rateTaker: null, complaint: null,
  },
  /* m1 是阿泽的高数书，我点了「我想要」并已拿到 —— 演示「买家这一侧」 */
  m1: {
    no: 'QK26101408', pub: '阿泽', taker: '我', fee: 15, st: 'done', at: '10-29 20:11',
    takerContact: '微信 qingkuai_me',
    timeline: [
      { t: '10-29 20:11', txt: '我想要这本教材，已预定' },
      { t: '10-30 12:40', txt: '我拿到了，等卖家确认' },
    ],
    ratePub: null, rateTaker: null, complaint: null,
  },
});
function v5OrderOf(id) { return v5Orders[id] || null; }
/* 这一单属于哪个板块：help 搭把手 / market 闲置 / lost 失物 */
function v5BoardOf(id) {
  if (v5HelpAll.some((i) => i.id === id)) return 'help';
  if (v5MarketAll.some((i) => i.id === id)) return 'market';
  if (v5LostAll.some((i) => i.id === id)) return 'lost';
  return '';
}
/* 订单上的中文说法，闲置和搭把手不一样（已预定 / 已拿到 / 确认卖出） */
function v5OrderIsMarket(id) { return v5BoardOf(id) === 'market'; }
function v5OrderStepsOf(id) { return v5OrderIsMarket(id) ? v5OrderStepsMarket : v5OrderSteps; }
function v5OrderStText(o, id) {
  const map = v5OrderIsMarket(id) ? v5OrderStatusMarket : v5OrderStatus;
  return map[o.st] || o.st;
}
/* 金额那一行：搭把手叫「报酬」，闲置叫「价格」 */
function v5OrderFeeWord(id) { return v5OrderIsMarket(id) ? '价格' : '报酬'; }
/* 两边怎么称呼：搭把手是发布人/接单人，闲置是卖家/买家 */
function v5OrderPubWord(id) { return v5OrderIsMarket(id) ? '卖家' : '发布人'; }
function v5OrderTakerWord(id) { return v5OrderIsMarket(id) ? '买家' : '接单人'; }
/* 我是发布人还是接单人：两边看到的按钮不一样 */
function v5MyRole(o, it) {
  if (!o) return null;
  if (o.taker === '我') return 'taker';
  if (o.pub === '我' || (it && it.mine)) return 'pub';
  return null;
}
/* 订单对应的那条内容：搭把手、闲置、失物都可能，按 id 到三个列表里找 */
function v5OrderItem(id) {
  return v5HelpAll.find((i) => i.id === id)
    || v5MarketAll.find((i) => i.id === id)
    || v5LostAll.find((i) => i.id === id)
    || null;
}
/* 我的订单：我发的 + 我接的，都列出来（搭把手和闲置混在一起，按接单时间倒序） */
const v5MyOrderList = computed(() => Object.keys(v5Orders).map((id) => {
  const it = v5OrderItem(id);
  const o = v5Orders[id];
  if (!it || !o) return null;
  const role = v5MyRole(o, it);
  return role ? { id, it, o, role } : null;
}).filter(Boolean));
const v5OrderCur = ref(null);
/* 我的页进「我的订单」 */
function v5OpenOrders() { v5OrderTab.value = 'all'; v5Nav('v5-orders'); }
function v5OpenOrder(id) {
  const it = v5OrderItem(id);
  if (!it || !v5Orders[id]) return;
  v5OrderCur.value = { it, o: v5Orders[id], role: v5MyRole(v5Orders[id], it) };
  v5RateStar.value = 5;
  v5RateTxt.value = '';
  v5Nav('v5-order');
}
/* 订单详情里点「看任务/商品详情」：这一单属于哪个板块就跳哪个详情页 */
function v5OpenOrderItem() {
  const c = v5OrderCur.value;
  if (!c) return;
  if (v5BoardOf(c.it.id) === 'market') v5OpenMarket(c.it.id);
  else if (v5BoardOf(c.it.id) === 'lost') v5OpenLost(c.it.id);
  else v5OpenHelp(c.it.id);
}
/* 接单：把任务锁成「已接单」并生成订单，之后别人就接不了了
   （contact 是接单人留的联系方式，没传说明还没弹过填联系方式的框） */
function v5TakeTask(it, contact) {
  if (contact === undefined) { v5AskContact(it, 'help'); return; }
  if (v5Orders[it.id]) { v5BoardSay('这单已经有人接了'); return; }
  if (it.mine || it.n === '我') { v5BoardSay('这是你自己发的，去「我的发布」看进展'); return; }
  const now = v5NowText();
  it.st = '已接单';
  it.takenBy = '我';
  v5Orders[it.id] = {
    no: 'QK26' + String(Date.now()).slice(-8),
    pub: it.n, taker: '我', fee: it.fee || 0, st: 'taken', at: now,
    takerContact: contact,
    timeline: [{ t: now, txt: '我接了这单' }],
    ratePub: null, rateTaker: null, complaint: null,
  };
  v5BoardSay('接单成功，去订单里复制联系方式');
  v5OpenOrder(it.id);
}
/* ================= 接单时留联系方式 =================
   没有私信以后，双方要自己联系，所以接单这一步必须让接单人留个号，
   不然订单详情里「复制接单人联系方式」就是空的。 */
const v5ContactAsk = ref(null);   // { it, board } —— 正在接的那一单
const v5ContactInput = ref('');
const v5ContactSave = ref(true);
const v5MyContact = ref('');      // 记住上次填的，下次自动带上
/* 点「立即接单 / 我想要」先弹这个框，不直接建单 */
function v5AskContact(it, board) {
  if (v5Orders[it.id]) { v5BoardSay(board === 'market' ? '这件已经有人预定了' : '这单已经有人接了'); return; }
  if (it.mine || it.n === '我') { v5BoardSay('这是你自己发的，去「我的发布」看进展'); return; }
  v5ContactInput.value = v5MyContact.value;
  v5ContactAsk.value = { it, board };
}
function v5ContactConfirm() {
  const ask = v5ContactAsk.value;
  if (!ask) return;
  const c = v5ContactInput.value.trim();
  if (!c) { v5BoardSay('留个联系方式吧，不然对方找不到你'); return; }
  if (v5ContactSave.value) v5MyContact.value = c;
  v5ContactAsk.value = null;
  if (ask.board === 'market') v5WantMarket(ask.it, c);
  else v5TakeTask(ask.it, c);
}

/* 我的订单列表：全部 / 我接的 / 我发布的 */
const v5OrderTab = ref('all');
const v5MyOrderShow = computed(() => v5MyOrderList.value.filter((r) => (
  v5OrderTab.value === 'all' ? true : v5OrderTab.value === 'taker' ? r.role === 'taker' : r.role === 'pub'
)));
function v5OrderNum(kind) {
  return kind === 'all' ? v5MyOrderList.value.length : v5MyOrderList.value.filter((r) => r.role === kind).length;
}
/* 进度条走到第几步：taken 1 · done 2 · finished 3 · rated 4 */
const v5OrderStep = { taken: 1, done: 2, finished: 3, rated: 4 };
function v5OrderStepOn(o, id) { return (v5OrderStep[o.st] || 0) >= v5OrderStep[id]; }
/* 复制接单人（买家）留的联系方式 —— 接单时会让他填，没填就是空 */
function v5OrderCopyTaker() {
  const c = v5OrderCur.value;
  if (!c) return;
  const tc = c.o.takerContact;
  if (!tc) { v5BoardSay('对方还没留联系方式，先复制上面的去问问'); return; }
  v5Copy(tc);
}
/* 订单详情里：我的评价 / 对方给我的评价 */
const v5OrderMine = computed(() => {
  const c = v5OrderCur.value;
  if (!c) return null;
  return c.role === 'pub' ? c.o.ratePub : c.o.rateTaker;
});
const v5OrderOther = computed(() => {
  const c = v5OrderCur.value;
  if (!c) return null;
  return c.role === 'pub' ? c.o.rateTaker : c.o.ratePub;
});
/* 订单详情底部那颗按钮：按「我是谁 + 走到哪一步」给不同的动作
   闲置的说法跟搭把手不一样：买家是「我拿到了」，卖家是「确认卖出」 */
const v5OrderAct = computed(() => {
  const c = v5OrderCur.value;
  if (!c) return null;
  const o = c.o;
  const role = v5MyRole(o, c.it);
  const mk = v5OrderIsMarket(c.it.id);
  if (o.st === 'taken') {
    return role === 'taker'
      ? { t: mk ? '我拿到了' : '我做完了', go: () => v5OrderDone(o), off: false }
      : { t: mk ? '等买家来拿' : '等对方完成', off: true };
  }
  if (o.st === 'done') {
    return role === 'pub'
      ? { t: mk ? '确认已卖出' : '确认完成', go: () => v5OrderConfirm(o), off: false }
      : { t: '等对方确认', off: true };
  }
  if (o.st === 'finished') return { t: '双方评价后结束', off: true };
  return { t: '订单已结束', off: true };
});
/* 星星画成文字：3 分就是 ★★★ */
function v5StarText(n) { return '★'.repeat(n || 0); }
/* 订单页底部那颗按钮：有些状态只能等对方，点了就给句提示 */
function v5OrderGo() {
  const a = v5OrderAct.value;
  if (!a) return;
  if (a.off) { v5BoardSay(a.t === '订单已结束' ? '这单已经结束了' : '等对方操作完，再轮到你'); return; }
  a.go();
}
/* 详情页用：这一单的订单 + 底部主按钮该显示什么 */
const v5HelpOrder = computed(() => (v5HelpCur.value ? v5OrderOf(v5HelpCur.value.id) : null));
const v5HelpAct = computed(() => {
  const it = v5HelpCur.value;
  if (!it) return { t: '立即接单', go: () => {}, off: true };
  const o = v5OrderOf(it.id);
  if (o) {
    const r = v5MyRole(o, it);
    if (r === 'taker') return { t: '我的订单', go: () => v5OpenOrder(it.id), off: false };
    if (r === 'pub') return { t: '查看订单', go: () => v5OpenOrder(it.id), off: false };
    return { t: '已被接单', go: () => v5BoardSay('这单已经有人接了'), off: true };
  }
  if (it.st === '已接单') return { t: '已被接单', go: () => v5BoardSay('这单已经有人接了'), off: true };
  /* 「可提供帮助」这类是人家在揽活，主按钮点一下把联系方式复制走 */
  if (it.kind === 'can') return { t: '找他帮忙', go: () => v5Copy(it.contact), off: false };
  return { t: '立即接单', go: () => v5TakeTask(it), off: false };
});
/* 接单人 / 买家：我做完了，等对方确认 */
function v5OrderDone(o) {
  const mk = v5OrderCur.value ? v5OrderIsMarket(v5OrderCur.value.it.id) : false;
  o.st = 'done';
  o.timeline.push({ t: v5NowText(), txt: mk ? '我拿到了，等卖家确认' : '我标记已完成，等对方确认' });
  v5BoardSay(mk ? '已标记拿到手，等卖家确认' : '已标记完成，等对方确认');
}
/* 发布人 / 卖家：确认完成，之后双方就能互评 */
function v5OrderConfirm(o) {
  const mk = v5OrderCur.value ? v5OrderIsMarket(v5OrderCur.value.it.id) : false;
  o.st = 'finished';
  o.timeline.push({ t: v5NowText(), txt: mk ? '我确认已卖出，可以互评了' : '我确认完成，可以互评了' });
  v5BoardSay('已确认完成，给对方打个分吧');
}
/* 互评：星级 + 一句话，两边都评完订单才算真的结束 */
const v5RateStar = ref(5);
const v5RateTxt = ref('');
function v5RateSubmit(o) {
  const role = v5MyRole(o, v5OrderCur.value ? v5OrderCur.value.it : null);
  const one = { star: v5RateStar.value, txt: v5RateTxt.value.trim(), t: v5NowText(), by: role };
  if (role === 'pub') o.ratePub = one; else o.rateTaker = one;
  if (o.ratePub && o.rateTaker) {
    o.st = 'rated';
    o.timeline.push({ t: v5NowText(), txt: '双方都评价完了，订单结束' });
  } else {
    const mk = v5OrderCur.value ? v5OrderIsMarket(v5OrderCur.value.it.id) : false;
    o.timeline.push({
      t: v5NowText(),
      txt: mk ? (role === 'pub' ? '我评价了买家' : '我评价了卖家') : (role === 'pub' ? '我评价了接单人' : '我评价了发布人'),
    });
  }
  v5RateTxt.value = '';
  v5RateStar.value = 5;
  v5BoardSay('评价已提交，谢谢反馈');
}
/* 投诉：选原因 + 补充说明，提交后订单上会一直挂着「处理中」 */
const v5ComplainOpen = ref(false);
const v5ComplainReason = ref(v5OrderReasons[0]);
const v5ComplainTxt = ref('');
function v5ComplainSubmit(o) {
  o.complaint = {
    by: '我', reason: v5ComplainReason.value, txt: v5ComplainTxt.value.trim(),
    st: '处理中', t: v5NowText(),
  };
  o.timeline.push({ t: v5NowText(), txt: `我发起了投诉：${v5ComplainReason.value}` });
  v5ComplainOpen.value = false;
  v5ComplainTxt.value = '';
  v5BoardSay('投诉已提交，平台会跟进');
}
/* 复制联系方式：微信号 / 手机号 / 取件码都能用 */
function v5Copy(txt) {
  const str = String(txt || '').trim();
  if (!str) { v5BoardSay('对方没留联系方式'); return; }
  const ok = () => v5BoardSay('已复制：' + str);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(ok, () => { v5FallbackCopy(str); ok(); });
  } else {
    v5FallbackCopy(str);
    ok();
  }
}
function v5FallbackCopy(str) {
  const ta = document.createElement('textarea');
  ta.value = str;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* 静态稿，复制失败也不影响演示 */ }
  document.body.removeChild(ta);
}
function v5NowText() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
/* 校园页顶部小卡片上的日期：写的是「今天」，那就真的取今天，别写死 */
const v5TodayText = computed(() => {
  const d = new Date();
  const w = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${w}`;
});

/* ================= 用户主页（点任何头像都能进来） ================= */
const v5UserCur = ref('林小满');
/* 同学档案：fixtures 里没登记过的名字（比如新发任务的人）走默认那份 */
function v5Person(name) {
  return v5People[name] || { ...v5PeopleDefault, tags: [...v5PeopleDefault.tags] };
}
const v5UserInfo = computed(() => v5Person(v5UserCur.value));
/* ---- 主页那颗「评分」：别人给他的评价的平均分 ----
   分数不是他自己写过多少条评价，而是「被别人评价」打出来的分：
     1. fixtures 里 v5People[x].reviews 是他以前攒下的评价
     2. 真下单互评之后（v5Orders 里的 ratePub / rateTaker）也会算进来
        —— o.pub 是他时看 rateTaker（接单人给发布人的评价），反之看 ratePub
   两边合起来求平均，就是主页上显示的那个数。 */
function v5RateOf(name) {
  const p = v5Person(name);
  const list = (p.reviews || []).map((r) => ({ ...r }));
  Object.keys(v5Orders).forEach((id) => {
    const o = v5Orders[id];
    if (!o) return;
    if (o.pub === name && o.rateTaker) {
      list.push({ by: o.taker, star: o.rateTaker.star, txt: o.rateTaker.txt, t: o.rateTaker.t });
    }
    if (o.taker === name && o.ratePub) {
      list.push({ by: o.pub, star: o.ratePub.star, txt: o.ratePub.txt, t: o.ratePub.t });
    }
  });
  const n = list.length;
  const sum = list.reduce((s, r) => s + (Number(r.star) || 0), 0);
  return { score: n ? sum / n : 0, n, list };
}
/* 个人主页上显示的那份（跟着切换的人变） */
const v5UserRate = computed(() => v5RateOf(v5UserCur.value));
/* 我的页顶部「评分」那一格：同学给我的平均分 */
const v5MyRate = computed(() => v5RateOf('我'));
const v5MyRateShow = computed(() => (v5MyRate.value.n ? v5MyRate.value.score.toFixed(1) : '—'));
const v5UserFollowed = ref(new Set());
/* 这个人在三个板块发过什么 */
const v5UserPosts = computed(() => [
  ...v5HelpAll.filter((i) => i.n === v5UserCur.value).map((i) => ({ ...i, board: 'help', boardLabel: '搭把手', ico: 'hand' })),
  ...v5LostAll.filter((i) => i.n === v5UserCur.value).map((i) => ({ ...i, board: 'lost', boardLabel: '失物招领', ico: 'bag' })),
  ...v5MarketAll.filter((i) => i.n === v5UserCur.value).map((i) => ({ ...i, board: 'market', boardLabel: '闲置小铺', ico: 'shirt' })),
  ...v5FeedList.value.filter((i) => i.n === v5UserCur.value).map((i) => ({ ...i, board: 'feed', boardLabel: '交友', ico: 'chat', st: '已发布' })),
]);
function v5OpenUser(name) {
  if (!name) return;
  if (name === '我') { v5Nav('profile'); return; }
  v5UserCur.value = name;
  v5Nav('v5-user');
}
function v5UserFollow(name) {
  const next = new Set(v5UserFollowed.value);
  if (next.has(name)) { next.delete(name); v5BoardSay(`已取消关注 ${name}`); }
  else { next.add(name); v5BoardSay(`已关注 ${name}`); }
  v5UserFollowed.value = next;
}

/* ---------- 三个板块共用的发布弹窗 ----------
   v5BoardKey 决定弹哪一套字段；发布后直接插到对应列表最前面
*/
/* 三个板块各自的「当前校区」，分开存，互不影响。'all' = 全部校区 */
const v5BoardCampus = { lost: ref('all'), market: ref('all'), help: ref('all') };
const v5BoardKey = ref('');            // lost / market / help，空串 = 没开
const v5BoardDraft = ref({});
function v5BoardReset(key) {
  v5BoardKey.value = key;
  v5BoardPhotos.value = [];
  v5BoardDraft.value = key === 'lost'
    ? { kind: 'lost', title: '', cat: '证件', desc: '', campus: '大学城校区', place: '', contact: '', reward: '' }
    : key === 'market'
      ? { title: '', cat: '教材', price: '', old: '', cond: '九成新', desc: '', campus: '大学城校区', place: '', contact: '' }
      : { kind: 'need', title: '', cat: '代取快递', fee: '', desc: '', campus: '大学城校区', place: '', time: '', contact: '' };
}
function v5BoardClose() { v5BoardKey.value = ''; }
/* ---------- 编辑重发（我的发布里用） ----------
   自己的发布弹窗：不新建一条，改完原地保存，id、留言、订单都留着。
   字段只挑通用的那几个（标题/说明/地点/时间/联系方式/报酬），够改就行 */
const v5EditTarget = ref(null);
const v5EditDraft = ref({});
function v5MyPostEdit(p) {
  v5EditTarget.value = p;
  v5BoardPhotos.value = [...(p.photos || [])];
  v5EditDraft.value = {
    title: p.title || '', desc: p.desc || '', campus: p.campus || '大学城校区',
    place: p.place || '', time: p.time || '', contact: p.contact || '',
    fee: p.fee || '', price: p.price || '', reward: p.reward || '',
    body: p.body || '',
  };
}
function v5EditClose() { v5EditTarget.value = null; v5BoardPhotos.value = []; }
function v5EditSave() {
  const p = v5EditTarget.value;
  if (!p) return;
  const d = v5EditDraft.value;
  /* 交友帖没有校区 / 地点 / 报酬那些，只改标题和正文 */
  if (p.board === 'feed') {
    const f = v5FeedList.value.find((x) => x.id === p.id);
    if (f) {
      f.title = d.title || f.title;
      f.body = d.body || f.body;
      v5BoardSay('动态已更新');
    }
    v5EditClose();
    return;
  }
  const arr = p.board === 'help' ? v5HelpAll : p.board === 'lost' ? v5LostAll : v5MarketAll;
    const cur = arr.find((x) => x.id === p.id);
    if (cur) {
    Object.assign(cur, {
      title: d.title || cur.title,
      desc: d.desc || '没写更多说明，复制联系方式找我',
      campus: d.campus || cur.campus,
      place: d.place || cur.place,
      contact: d.contact || '没留，留言问我',
      photos: [...v5BoardPhotos.value],
      time: p.board === 'help' ? (d.time || cur.time) : cur.time,
      fee: p.board === 'help' ? (Number(d.fee) || 0) : cur.fee,
      price: p.board === 'market' ? (Number(d.price) || 0) : cur.price,
      reward: p.board === 'lost' ? (d.reward || '') : cur.reward,
    });
    /* 还没人接的单，重新上架时把状态归位；已经接了的不动 */
    if (!v5Orders[cur.id]) {
      cur.st = p.board === 'lost' ? (cur.kind === 'lost' ? '寻找中' : '待认领')
        : p.board === 'market' ? '在售'
          : (cur.kind === 'need' ? '等人接' : '可接单');
    }
    v5BoardSay('已保存，重新发布了');
  }
  v5EditClose();
}
/* 删除：先确认，删掉内容本身，有订单的一并撤掉 */
const v5DelOpen = ref(false);
const v5DelTarget = ref(null);
function v5AskDel(p) { v5DelTarget.value = p; v5DelOpen.value = true; }
function v5DoDel() {
  const p = v5DelTarget.value;
  if (!p) return;
  if (p.board === 'feed') {
    const k = v5FeedList.value.findIndex((x) => x.id === p.id);
    if (k > -1) v5FeedList.value.splice(k, 1);
    v5DelOpen.value = false;
    v5DelTarget.value = null;
    v5BoardSay('动态已删除');
    return;
  }
  const arr = p.board === 'help' ? v5HelpAll : p.board === 'lost' ? v5LostAll : v5MarketAll;
  const i = arr.findIndex((x) => x.id === p.id);
  if (i > -1) arr.splice(i, 1);
  if (v5Orders[p.id]) delete v5Orders[p.id];
  v5DelOpen.value = false;
  v5DelTarget.value = null;
  v5BoardSay('已删除');
}
function v5BoardPublish() {
  const d = v5BoardDraft.value;
  const id = 'new' + Date.now();
  const base = {
    n: '我', ac: '#D9E4C9', t: '刚刚', cmts: [], mine: true,
    photos: [...v5BoardPhotos.value],
    desc: d.desc || '没写更多说明，复制联系方式找我',
    campus: d.campus || '大学城校区',
    place: d.place || '校园里',
    contact: d.contact || '没留，留言问我',
  };
  if (v5BoardKey.value === 'lost') {
    v5LostAll.unshift({
      ...base, id, kind: d.kind, title: d.title || '没写名字的东西', cat: d.cat,
      time: '刚刚', st: d.kind === 'lost' ? '寻找中' : '待认领', reward: d.reward || '',
    });
    v5LostTab.value = d.kind;
  } else if (v5BoardKey.value === 'market') {
    v5MarketAll.unshift({
      ...base, id, title: d.title || '闲置好物', cat: d.cat,
      price: Number(d.price) || 0, old: Number(d.old) || 0, cond: d.cond, st: '在售',
    });
    v5MarketCat.value = '全部';
  } else {
    v5HelpAll.unshift({
      ...base, id, kind: d.kind, title: d.title || '需要一个帮手', cat: d.cat,
      fee: Number(d.fee) || 0, time: d.time || '时间待定', st: d.kind === 'need' ? '等人接' : '可接单',
    });
    v5HelpTab.value = d.kind;
  }
  v5BoardKey.value = '';
}
/* ---------- 发布弹窗里的「加照片」 ----------
   静态稿不真的上传，用 FileReader 读成本地 dataURL 直接显示，
   发布后跟着这条内容一起走：列表卡和详情页都能看到 */
const v5BoardPhotos = ref([]);
const v5PhotoView = ref('');
/* 列表卡左侧那个小方块：有照片就当封面，没照片用原来的彩色块 + 图标 */
function v5ThumbStyle(it) {
  return it.photos && it.photos.length
    ? { backgroundImage: `url(${it.photos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: it.ac };
}
function v5BoardPickPhoto() { document.getElementById('v5-photo-input')?.click(); }
function v5BoardFiles(e) {
  const room = 4 - v5BoardPhotos.value.length;
  const files = Array.from(e.target.files || []).slice(0, room);
  if (!files.length) return;
  files.forEach((f) => {
    const reader = new FileReader();
    reader.onload = () => { v5BoardPhotos.value.push(reader.result); };
    reader.readAsDataURL(f);
  });
  if (e.target.files.length > room) v5BoardSay('最多只能加 4 张照片');
  e.target.value = '';
}
function v5BoardDelPhoto(i) { v5BoardPhotos.value.splice(i, 1); }

/* 详情页里的「我想要 / 我接了 / 我捡到了」：只弹个提示条，静态稿不真下单 */
const v5BoardToast = ref('');
let v5ToastTimer = null;
function v5BoardSay(msg) {
  v5BoardToast.value = msg;
  window.clearTimeout(v5ToastTimer);
  v5ToastTimer = window.setTimeout(() => { v5BoardToast.value = ''; }, 1800);
}

/* ================= 我的 · 新增关注（从「粉丝」数字上的红点进去） ================= */
const v5FollowTab = ref('fans');
/* reactive 包一层，点「回关」按钮页面才会立刻变 */
const v5FollowAll = reactive(v5Followers);
const v5FollowList = computed(() => v5FollowAll.filter((u) => u.type === v5FollowTab.value));
/* 我的页顶部「粉丝」旁边那个小红点，就是新关注的人数 */
const v5NewFans = computed(() => v5FollowAll.filter((u) => u.type === 'fans' && u.isNew).length);
function v5FollowBack(u) {
  u.back = !u.back;
  v5BoardSay(u.back ? `已回关 ${u.n}` : `已取消关注 ${u.n}`);
}
function v5OpenFollowers() { v5FollowTab.value = 'fans'; v5Nav('v5-followers'); }

/* ================= 我的 · 我的消息（同学之间的互动） ================= */
const v5NoticeTab = ref('all');
const v5NoticeAll = reactive(v5MyNotices);
const v5NoticeList = computed(() => (v5NoticeTab.value === 'all'
  ? v5NoticeAll
  : v5NoticeAll.filter((n) => n.type === v5NoticeTab.value)));
/* 我的页「我的消息」旁边的红点数字 = 未读条数 */
const v5Unread = computed(() => v5NoticeAll.filter((n) => n.unread).length);
function v5OpenNotice() { v5NoticeTab.value = 'all'; v5Nav('v5-notices'); }
/* 点一下这条通知，左上角的小圆点就消失 */
/* 点一条消息：除了标记已读，还要跳到「出事的那条内容」上
   kind 决定去哪：feed 动态详情 / help 任务 / lost 失物 / market 闲置 */
/* ------------------------------------------------------------
   我的消息 → 具体内容
   ------------------------------------------------------------
   早先的做法是给 10 条假数据各写一个 go:{kind,id}，那只能糊住这 10 条，
   后端真接进来之后新消息就没有目标了。现在改成运行时自动认人：

   1. 后端如果直接给了 go 字段（{kind, id}），优先用它
   2. 没有的话，拿消息里的 quote（对方说的）和 mine（我发的）
      去动态 / 搭把手 / 失物 / 闲置 四个板块里比对标题、正文、评论内容
   3. 都找不到：去这个人的主页（保证点哪都不会没反应）

   这样以后后端返回任何一条消息，只要文案能对上内容，就能自动跳过去。 */
function v5NoticeSources() {
  const asArray = (v) => (Array.isArray(v) ? v : (v && v.value) || []);
  return [
    { kind: 'feed', list: asArray(v5FeedList) },
    { kind: 'help', list: asArray(v5HelpAll) },
    { kind: 'lost', list: asArray(v5LostAll) },
    { kind: 'market', list: asArray(v5MarketAll) },
  ];
}
/* 一条内容身上可以用来比对的所有文字：标题、正文、每条评论 */
function v5NoticeTexts(it) {
  const own = [it.title, it.body, it.desc].filter(Boolean);
  const cmts = (it.comments || it.cmts || []).map((c) => c.txt).filter(Boolean);
  return { own, cmts };
}
/* 给某条内容和这条消息打个「像不像」的分，越高越像 */
function v5NoticeScore(it, quote, mine) {
  const { own, cmts } = v5NoticeTexts(it);
  const [head] = own;                      // 第一个当标题看
  let best = 0;
  const has = (a, b) => a && b && (a === b || (b.length >= 4 && a.includes(b)) || (a.length >= 4 && b.includes(a)));
  if (head && quote && quote === head) best = Math.max(best, 100);
  if (head && mine && mine === head) best = Math.max(best, 96);
  if (head && quote && quote.includes(head) && head.length >= 2) best = Math.max(best, 84);
  if (head && mine && mine.includes(head) && head.length >= 2) best = Math.max(best, 80);
  if (own.some((t) => has(t, quote))) best = Math.max(best, 52);
  if (own.some((t) => has(t, mine))) best = Math.max(best, 50);
  if (cmts.some((t) => t === quote)) best = Math.max(best, 60);
  if (cmts.some((t) => has(t, mine))) best = Math.max(best, 40);
  return best;
}
/* 找出这条消息指向的内容：返回 { kind, item } */
function v5NoticeTarget(n) {
  const quote = (n.quote || '').trim();
  const mine = (n.mine || '').trim();
  if (n.go && n.go.kind) return n.go;
  let hit = null;
  for (const src of v5NoticeSources()) {
    for (const it of src.list) {
      const s = v5NoticeScore(it, quote, mine);
      if (s > 0 && (!hit || s > hit.score)) hit = { score: s, kind: src.kind, id: it.id };
    }
  }
  return hit ? { kind: hit.kind, id: hit.id } : null;
}
function v5OpenNoticeItem(n) {
  n.unread = false;
  const t = v5NoticeTarget(n);
  if (t) {
    if (t.kind === 'feed') v5OpenFeed(t.id);
    else if (t.kind === 'help') v5OpenHelp(t.id);
    else if (t.kind === 'lost') v5OpenLost(t.id);
    else if (t.kind === 'market') v5OpenMarket(t.id);
    return;
  }
  /* 对不上具体内容：就去这个人的主页，保证点哪都有反应 */
  v5OpenUser(n.n);
}
function v5NoticeAllRead() {
  v5NoticeAll.forEach((n) => { n.unread = false; });
  v5BoardSay('全部已读');
}

/* ================= 校园服务 · 通知（项目组发的官方通知） =================
   注意跟「我的消息」是两码事：
     我的消息 = 同学之间（谁回复/赞/接单了我）
     通知     = 开发项目组发给全体同学（版本更新/活动/停服维护）
*/
const v5AnnTab = ref('all');
const v5AnnAll = reactive(v5Announces);
/* 置顶的排前面，其余按原顺序 */
const v5AnnList = computed(() => {
  const base = v5AnnTab.value === 'all'
    ? v5AnnAll
    : v5AnnAll.filter((a) => a.type === v5AnnTab.value);
  return [...base].sort((x, y) => (y.top ? 1 : 0) - (x.top ? 1 : 0));
});
/* 校园服务「通知」格子上的红点 = 官方通知未读条数 */
const v5AnnUnread = computed(() => v5AnnAll.filter((a) => a.unread).length);
/* 默认给第一条：这样在设计台里直接选「通知·详情」场景也能看到内容 */
const v5AnnCur = ref(v5Announces[0] || null);
function v5OpenAnnounce() { v5AnnTab.value = 'all'; v5Nav('v5-announce'); }
function v5OpenAnn(id) {
  const a = v5AnnAll.find((x) => x.id === id);
  if (a) a.unread = false;
  v5AnnCur.value = a;
  v5Nav('v5-announce-detail');
}
function v5AnnAllRead() {
  v5AnnAll.forEach((a) => { a.unread = false; });
  v5BoardSay('官方通知全部已读');
}

/* 我的页顶部四列数据：关注/粉丝 进新增关注，收藏 进我的收藏 */
function v5StatClick(label) {
  if (label === '关注' || label === '粉丝') v5OpenFollowers();
  else if (label === '收藏') v5OpenFav('profile');
  else if (label === '评分') {
    v5BoardSay(v5MyRate.value.n
      ? `${v5MyRate.value.n} 位同学给你的平均分 ${v5MyRateShow.value}，接单和卖闲置的互评都会算进来`
      : '还没有同学给你评价，完成一单互评后就会有分了');
  } else v5BoardSay('这里还没做下一页');
}
/* 校园服务六个格子：只有「通知」有下一页，其余静态稿里先弹个提示 */
function v5SvcClick(name) {
  if (name === '通知') v5OpenAnnounce();
  else v5BoardSay(`${name} · 还没做页面`);
}

/* ================= 我的 · 我的发布 =================
   把三个板块里「自己发的」捞出来拼一页：
     fixtures 里带 mine: true 的几条 + 页面上现发的（发布时会带上 mine）
   这里只拼展示用的字段，点进去还是复用原来三个详情页 */
const v5MyPostTab = ref('all');
const v5MyPostRaw = computed(() => [
  ...v5HelpAll.filter((i) => i.mine).map((i) => ({ ...i, ico: 'hand', board: 'help', boardLabel: '搭把手' })),
  ...v5LostAll.filter((i) => i.mine).map((i) => ({ ...i, ico: 'bag', board: 'lost', boardLabel: '失物招领' })),
  ...v5MarketAll.filter((i) => i.mine).map((i) => ({ ...i, ico: 'shirt', board: 'market', boardLabel: '闲置小铺' })),
  ...v5FeedList.value.filter((i) => i.mine).map((i) => ({ ...i, ico: 'chat', board: 'feed', boardLabel: '交友', st: '已发布' })),
]);
const v5MyPostCount = computed(() => v5MyPostRaw.value.length);
const v5MyPostList = computed(() => (v5MyPostTab.value === 'all'
  ? v5MyPostRaw.value
  : v5MyPostRaw.value.filter((p) => p.board === v5MyPostTab.value)));
/* tab 上的数量：全部 6 · 搭把手 2 … */
function v5MyPostNum(board) {
  return board === 'all' ? v5MyPostCount.value : v5MyPostRaw.value.filter((p) => p.board === board).length;
}
function v5OpenMyPosts() { v5MyPostTab.value = 'all'; v5Nav('v5-myposts'); }
/* 点卡片进对应板块的详情页 */
function v5MyPostOpen(p) {
  if (p.board === 'help') v5OpenHelp(p.id);
  else if (p.board === 'lost') v5OpenLost(p.id);
  else if (p.board === 'market') v5OpenMarket(p.id);
  else if (p.board === 'feed') v5OpenFeed(p.id);
}
/* 状态标签配色：已结束的一种，进行中的第二种，其余按等待处理 */
function v5MyPostTone(st) {
  if (['已归还', '已结束', '已完成', '已抢光'].includes(st)) return 'done';
  if (st === '进行中' || st === '已接单') return 'ing';
  if (st === '已预定') return 'hold';
  if (st === '已发布') return 'ok';
  return 'wait';
}
/* 一句话说清进展：看留言条数 */
function v5MyPostNote(p) {
  if (p.board === 'feed') {
    const c = p.comments.length;
    return c ? `${c} 条评论 · ${p.like} 个赞` : `${p.like} 个赞，还没人评论`;
  }
  const n = p.cmts.length;
  if (!n) return '还没有人回应，再等等';
  if (p.board === 'market') {
    if (p.st === '已抢光') return '已经标记卖掉了';
    if (v5OrderOf(p.id)) return '有人预定了，去看订单';
    return n ? `${n} 个人想要` : '还没有人来问';
  }
  if (p.board === 'lost') return `${n} 条线索`;
  return `${n} 个人想帮`;
}

/* ================= 交友 · 好友动态 ================= */
/* 深拷贝一份，点赞/评论都改这份，不污染 fixtures */
/* ================= 投诉（通用） =================
   没有私信以后，遇到不对劲的内容或人，就走投诉这一条路。
   交友动态、别人的主页都能投诉；提交后记在 v5Reports 里，
   页面上会显示「已投诉」，方便演示后续状态。 */
const v5ReportOpen = ref(false);
const v5ReportTarget = ref(null);
const v5ReportReason = ref(v5ReportReasons[0]);
const v5ReportTxt = ref('');
const v5Reports = reactive({});
/* target: { key, what, name, title } —— key 用来判断这条投诉过了没 */
function v5OpenReport(t) {
  v5ReportTarget.value = t;
  v5ReportReason.value = v5ReportReasons[0];
  v5ReportTxt.value = '';
  v5ReportOpen.value = true;
}
function v5ReportClose() { v5ReportOpen.value = false; v5ReportTarget.value = null; }
function v5Reported(key) { return !!v5Reports[key]; }
function v5ReportSubmit() {
  const t = v5ReportTarget.value;
  if (!t) return;
  v5Reports[t.key] = {
    what: t.what, name: t.name || '', title: t.title || '',
    reason: v5ReportReason.value, txt: v5ReportTxt.value.trim(),
    st: '处理中', t: v5NowText(),
  };
  v5ReportClose();
  v5ReportTxt.value = '';
  v5BoardSay('投诉已提交，平台会跟进');
}
/* 投诉一条交友动态 */
function v5ReportFeed(p) {
  v5OpenReport({ key: 'feed:' + p.id, what: '动态', name: p.n, title: p.title });
}
/* 投诉一个人：用户主页右上那个 ··· */
function v5ReportUser(name) {
  v5OpenReport({ key: 'user:' + name, what: '账号', name, title: '' });
}

const v5FeedList = ref(v5FeedPosts.map((p) => ({
  ...p,
  comments: p.comments.map((c) => ({ ...c, liked: false })),
})));
function v5FeedLikePost(p) {
  p.liked = !p.liked;
  p.like += p.liked ? 1 : -1;
}
function v5FeedLikeCmt(c) {
  c.liked = !c.liked;
  c.like += c.liked ? 1 : -1;
}
/* 动态详情：点卡片进独立的一页，不再在原地把评论撑开 */
const v5FeedCur = ref(v5FeedList.value[0] || null);
const v5FeedReply = ref('');
function v5OpenFeed(id) {
  const p = v5FeedList.value.find((i) => i.id === id);
  if (!p) return;
  v5FeedCur.value = p;
  v5FeedReply.value = '';
  v5Nav('v5-feed-detail');
}
function v5FeedCurReply() {
  const p = v5FeedCur.value;
  const txt = v5FeedReply.value.trim();
  if (!p || !txt) return;
  p.comments.push({ n: '我', t: '刚刚', ac: '#D9E4C9', txt, like: 0, liked: false });
  p.cmt = p.comments.length;
  v5FeedReply.value = '';
  v5BoardSay('评论已发出');
}
/* 发动态：四种类型，不只是灵感小盒 */
const v5FeedComposer = ref(false);
const v5FeedType = ref('idea');
const v5FeedTitle = ref('');
const v5FeedBody = ref('');
const v5FeedMbti = ref('INFP');
function v5FeedOpenComposer() {
  v5FeedType.value = 'idea';
  v5FeedTitle.value = '';
  v5FeedBody.value = '';
  v5FeedComposer.value = true;
}
function v5FeedCloseComposer() { v5FeedComposer.value = false; }
function v5FeedPublish() {
  const type = v5FeedType.value;
  const title = v5FeedTitle.value.trim();
  const body = v5FeedBody.value.trim();
  const mbti = v5FeedMbti.value;
  const meta = {
    idea: { cat: '日常', name: '日常灵感' },
    mbti: { cat: mbti, name: v5MbtiTypes[mbti] ? v5MbtiTypes[mbti].nm : '调停者' },
    friend: { cat: '找搭子', name: '找搭子' },
    life: { cat: '日常', name: '日常' },
  }[type];
  v5FeedList.value.unshift({
    id: 'my' + Date.now(),
    type,
    ac: '#D9E4C9',
    n: '我',
    t: '刚刚',
    cat: meta.cat,
    title: title || (type === 'mbti' ? '我的 MBTI 是 ' + mbti : '说点什么'),
    body: body || '刚刚更新了一条动态',
    mbti: type === 'mbti' ? mbti : '',
    mbtiName: type === 'mbti' ? meta.name : '',
    mbtiDesc: '',
    like: 0,
    cmt: 0,
    liked: false,
    comments: [],
    mine: true,
  });
  v5FeedComposer.value = false;
}
/* 16 型人格的代码列表，发 MBTI 动态时用来选 */
const v5MbtiCodes = Object.keys(v5MbtiTypes);
/* 六种类型各有自己的颜色，动态卡片左上角那个小标签用 */
const v5TypeTint = {
  idea: { bg: '#D9E4C9', ink: '#5E7350', label: '灵感' },
  mbti: { bg: '#DED8EA', ink: '#77688E', label: 'MBTI' },
  friend: { bg: '#F2D7D3', ink: '#96655C', label: '找搭子' },
  life: { bg: '#F4E8C6', ink: '#8A7748', label: '日常' },
};

/* ================= 人格食堂（MBTI × 美食） ================= */
/* step: 0 介绍页 / 1~6 第 N 题 / 7 结果卡 */
const v5MbtiStep = ref(0);
const v5MbtiCode = ref('');
const v5MbtiAns = ref([]);
const v5MbtiPoster = ref(false);
const v5MbtiNo = ref(1286);
const v5MbtiCur = computed(() => v5MbtiQuiz[v5MbtiStep.value - 1] || v5MbtiQuiz[0]);
const v5MbtiResult = computed(() => v5MbtiTypes[v5MbtiCode.value] || v5MbtiTypes.INFP);
/* 结果卡里的三家店：按店名去店铺池取完整数据 */
const v5MbtiShops = computed(() => v5MbtiResult.value.s
  .map((name) => v5Shops.find((s) => s.name === name))
  .filter(Boolean));
function v5MbtiStart() {
  v5MbtiAns.value = [];
  v5MbtiStep.value = 1;
  v5Nav('v5-mbti');
}
/* 每题二选一：选 A 记维度第一个字母，选 B 记第二个 */
function v5MbtiAnswer(key) {
  const q = v5MbtiCur.value;
  v5MbtiAns.value = [...v5MbtiAns.value, { d: q.d, pick: key === 'a' ? q.d[0] : q.d[1] }];
  if (v5MbtiStep.value >= 6) {
    v5MbtiCode.value = v5MbtiFinish(v5MbtiAns.value);
    v5MbtiStep.value = 7;
  } else {
    v5MbtiStep.value += 1;
  }
}
/* 四个维度 EI / SN / TF / JP 各自投票，票数过半取第一个字母 */
function v5MbtiFinish(ans) {
  return ['EI', 'SN', 'TF', 'JP'].map((d) => {
    const votes = ans.filter((a) => a.d === d);
    const first = votes.filter((v) => v.pick === d[0]).length;
    return first >= Math.ceil(votes.length / 2) ? d[0] : d[1];
  }).join('');
}
function v5OpenMbti() {
  /* 测过就直接看结果卡，没测过回到介绍页 */
  v5MbtiStep.value = v5MbtiCode.value ? 7 : 0;
  v5Nav('v5-mbti');
}

/* ================= 今天吃什么 · 盲盒机 ================= */
const v5gMode = ref('random');
const v5gScope = ref('all');
const v5gTaste = ref('all');
const v5gPrice = ref('all');
const v5gOnlyOpen = ref(false);
const v5gNoRepeat = ref(false);
const v5gBusy = ref(false);
const v5gPicks = ref([]);
const v5gHist = ref([]);
let v5gTimer;
/* 当前筛选条件下的店铺池（只在筛选栏收窄，不区分营业，营业数单独算） */
const v5gPoolList = computed(() => v5Shops.filter((s) => {
  if (v5gScope.value !== 'all' && s.area !== v5gScope.value) return false;
  if (v5gTaste.value !== 'all' && !s.cat.includes(v5gTaste.value)) return false;
  if (v5gPrice.value === '10' && !(s.price < 10)) return false;
  if (v5gPrice.value === '15' && !(s.price >= 10 && s.price <= 15)) return false;
  if (v5gPrice.value === '99' && !(s.price > 15)) return false;
  if (v5gOnlyOpen.value && s.rest) return false;
  return true;
}));
/* 池子里正在营业的店：rest 为 true 的算今天休息 */
const v5gOpenList = computed(() => v5gPoolList.value.filter((s) => !s.rest));
const v5gMbtiList = computed(() => (v5gMode.value === 'mbti' && v5MbtiCode.value ? v5MbtiShops.value : []));
/* 真正用来抽的池子：人格模式优先抽本命食堂，否则用筛选后的营业店铺 */
const v5gDrawPool = computed(() => {
  if (v5gMode.value === 'mbti') return v5gMbtiList.value.length ? v5gMbtiList.value : v5gOpenList.value;
  return v5gOpenList.value;
});
const v5gHint = computed(() => {
  if (v5gBusy.value) return '扭蛋机正在挑，等一下~';
  if (!v5gDrawPool.value.length) return '这个条件下没有可抽的店，放宽一点试试';
  if (v5gPicks.value.length) return '就决定是你了，去吃吧！';
  return '这一餐，让盲盒机来替你做决定吧~';
});
function v5gReset() {
  v5gScope.value = 'all';
  v5gTaste.value = 'all';
  v5gPrice.value = 'all';
  v5gOnlyOpen.value = false;
}
/* 抽 n 个：机器抖动 900ms 后出结果，同时记进「今天抽过的签」 */
function v5gDraw(n) {
  const noRepeat = v5gDrawPool.value.filter((s) => !(v5gNoRepeat.value && v5gHist.value.some((h) => h.shop.name === s.name)));
  const source = noRepeat.length >= n ? noRepeat : v5gDrawPool.value;
  if (!source.length || v5gBusy.value) return;
  v5gBusy.value = true;
  v5gPicks.value = [];
  window.clearTimeout(v5gTimer);
  v5gTimer = window.setTimeout(() => {
    const bag = source.slice().sort(() => Math.random() - 0.5);
    v5gPicks.value = bag.slice(0, n);
    v5gPicks.value.forEach((s) => {
      v5gHist.value = [{ shop: s, at: v5gNow() }, ...v5gHist.value];
    });
    v5gBusy.value = false;
  }, 900);
}
function v5gNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/* ================= 店铺详情（V5） ================= */
const v5Detail = ref(v5DetailDemo);
const v5DetailFav = ref(false);
const v5DetailStar = ref(false);
const v5DetailLiked = ref(false);
/* 从卡片 / 收藏 / 推荐列表进详情：把店铺数据塞进 v5Detail 再切场景 */
function v5OpenShop(shop) {
  if (!shop) return;
  const area = shop.area || 'shangye';
  v5Detail.value = {
    ...shop,
    img: shop.img || shop.photo,
    tags: [...(shop.cat || []).slice(0, 1), v5AreaLabel[area] || '商中店铺'],
    week: { visitors: 10 + (shop.hot % 9), views: shop.people * 19 + 38, share: (shop.hot / 2).toFixed(1) + '%' },
    exploring: 1 + (shop.hot % 6),
    price: shop.price || 12,
    pos: shop.pos || '校内',
    time: shop.time || '全天营业',
  };
  v5DetailFav.value = false;
  v5DetailStar.value = false;
  v5Nav('v5-detail');
}
function v5OpenShopByName(name) { v5OpenShop(v5Shops.find((s) => s.name === name)); }
function v5BackFromDetail() { v5Back('home'); }
function v5OpenGacha() { v5Nav('v5-gacha'); }

/* ================= 我的收藏（V5） =================
   从我的页进来返回就去我的页，从首页快捷入口进来返回就去首页，
   以前写死回 profile，导致从首页进去的会被带偏到我的页 */
const v5FavBack = ref('profile');
function v5OpenFav(from) {
  v5FavBack.value = from || 'profile';
  v5FavTab.value = 'shop';
  v5Nav('favorites');
}
const v5FavTab = ref('shop');
const v5FavType = { shop: '店铺', stall: '小摊', content: '图书馆' };
/* 除了原来的三种，把校园板块里收藏到的东西（任务 / 闲置 / 失物）
   统归到「其他」这一个 tab 里，点进去还是各自的详情页 */
const v5FavTabs = [...Object.keys(v5FavType), 'other'];
const v5BoardFav = [
  { board: 'lost', list: v5LostAll, label: '失物', ico: 'bag', tint: '#F2D7D3', scene: 'v5-lost-detail' },
  { board: 'market', list: v5MarketAll, label: '闲置', ico: 'shirt', tint: '#CBDCEF', scene: 'v5-market-detail' },
  { board: 'help', list: v5HelpAll, label: '任务', ico: 'hand', tint: '#D9E4C9', scene: 'v5-help-detail' },
];
const v5FavCount = (board) => v5BoardFav.find((b) => b.board === board).list.filter((i) => v5IsFav(board + i.id)).length;
/* 「其他」里的内容：把三个板块收藏到的条目拼起来，各自带类型标签 */
const v5FavOther = computed(() => {
  const rows = [];
  v5BoardFav.forEach((b) => {
    b.list.filter((i) => v5IsFav(b.board + i.id)).forEach((i) => rows.push({ ...b, it: i }));
  });
  return rows;
});
const v5FavEmptyOther = '还没有收藏任务或二手，在失物／闲置／搭把手里点心就能收进来';
/* 收藏数据里存的是店名，这里换成完整店铺数据供列表渲染 */
const v5FavItems = computed(() => (v5Favorites[v5FavTab.value] || [])
  .map((name) => v5Shops.find((s) => s.name === name))
  .filter(Boolean));
function v5OpenFavBoard(row) {
  if (row.board === 'lost') v5OpenLost(row.it.id);
  else if (row.board === 'market') v5OpenMarket(row.it.id);
  else v5OpenHelp(row.it.id);
}

let v5BoxTimeoutId;
function openBlindBox() {
  if (v5BoxOpening.value) return;
  v5BoxOpening.value = true;
  window.clearTimeout(v5BoxTimeoutId);
  v5BoxTimeoutId = window.setTimeout(() => {
    v5BoxOpening.value = false;
    v5Nav('v5-gacha');
  }, 460);
}

/* ================= 二级页「从哪来」导航栈（V5） =================
   以前每个二级页顶上的返回箭头都写死一个去处（全都回 home 或 campus），
   于是出现「在交友里点别人头像 → 进他主页 → 点返回却被甩到校园」这种跳丢的情况。
   现在统一：跳进任意一个二级页之前，先把「我现在在哪」压进这个栈；
   返回时从栈顶弹出来；栈空了才用那一页自己的兜底去处。
   四个底部 tab（首页 / 校园 / 交友 / 我的）是根，回到任一根就把栈清空。 */
const V5_ROOTS = ['home', 'campus', 'friends', 'profile'];
const v5NavStack = ref([]);
/* 进新的二级页时用这个，替代裸写 selectScene */
function v5Nav(to) {
  if (!to) return;
  if (V5_ROOTS.includes(to)) v5NavStack.value = [];
  else if (to !== current.value) v5NavStack.value.push(current.value);
  selectScene(to);
}
/* 二级页返回时用这个，fallback 是栈空时的兜底去处 */
function v5Back(fallback) {
  const prev = v5NavStack.value.pop();
  selectScene(prev && prev !== current.value ? prev : fallback || 'home');
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
  if (V5_ROOTS.includes(id)) v5NavStack.value = []; /* 回到根 tab 就清空来路 */
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
  else if (nextDesign === 'v5') url.searchParams.set('design', 'v5');
  else if (nextDesign === 'live') url.searchParams.set('design', 'live');
  else url.searchParams.delete('design');
  history.replaceState({}, '', url);
  /* 现版只做了 5 个 tab 页，从别的场景切过来先落到首页 */
  if (nextDesign === 'live' && !LIVE_SCENES.includes(current.value)) selectScene('home');
  restoreSceneScroll(current.value);
}
function nextDesignMode() {
  if (design.value === 'original') return 'wise';
  if (design.value === 'wise') return 'v5';
  if (design.value === 'v5') return 'live';
  return 'original';
}
const designLabel = computed(() => ({
  original: '查看原版',
  wise: '查看 Wise 新版',
  v5: '查看 V5 新版',
  live: '查看现版复刻',
}[design.value]));
function toggleHomeTheme() {
  homeDark.value = !homeDark.value;
  const url = new URL(location.href);
  if (homeDark.value) url.searchParams.delete('theme');
  else url.searchParams.set('theme', 'light');
  history.replaceState({}, '', url);
}
onMounted(() => {
  /* 带 ?design=live&scene=其它 进来时，落到现版首页，避免渲染原版兜底页 */
  if (design.value === 'live' && !LIVE_SCENES.includes(current.value)) selectScene('home');
  restoreSceneScroll(current.value);
});
onBeforeUnmount(() => { stopRandomStore(); window.clearTimeout(v5BoxTimeoutId); });
</script>

<template>
  <!-- 根容器上的 data-scene / data-design 是 CSS 定位页面的钩子，很多样式靠它做作用域限定 -->
  <div :class="['studio', { 'wise-theme': design === 'wise', 'home-dark-theme': design === 'wise' && current === 'home' && homeDark }]" :data-scene="current" :data-design="design">
    <!-- 左侧场景索引：按钮列表由 fixtures.js 的 scenes 数组按 group 分组渲染 -->
    <aside class="sidebar">
      <div class="brand"><img src="/assets/qingkuai.ico"><div><strong>庆快校园</strong><small>STATIC DESIGN DESK</small></div></div>
      <div class="sidebar-intro"><span class="eyebrow">SCREEN INDEX</span><h1>线上页面静态复刻</h1><p>17 个截图状态，390 × 888 手机画布。</p></div>
      <!-- 设计版本四选一：原版 / Wise / V5 / 现版，切换只改 design，不改动其它场景数据 -->
      <div class="design-switcher" aria-label="设计版本">
        <span class="group-label">设计版本</span>
        <div><button :class="{ active: design === 'original' }" @click="selectDesign('original')">原版</button><button :class="{ active: design === 'wise' }" @click="selectDesign('wise')">Wise</button><button :class="{ active: design === 'v5' }" @click="selectDesign('v5')">V5</button><button :class="{ active: design === 'live' }" @click="selectDesign('live')">现版</button></div>
        <small>{{ design === 'wise' ? '青柠绿 · 鼠尾草灰 · 24px 圆角' : design === 'v5' ? '校园绿 · 米白 · V5 参考稿' : design === 'live' ? '照小程序源码复刻 · 品牌紫 · 玻璃底栏' : '保留现有视觉，不做覆盖' }}</small>
      </div>
      <div v-for="group in visibleGroups" :key="group" class="scene-group"><div class="group-label">{{ group }}</div><button v-for="scene in visibleScenes.filter((item) => item.group === group)" :key="scene.id" :class="['scene-button', { active: current === scene.id }]" @click="selectScene(scene.id)"><span>{{ sceneLabel(scene) }}</span><small>{{ sceneNote(scene) }}</small></button></div>
      <div class="scope-note"><span class="pulse"></span><span>本地静态数据<br><small>无 API 调用</small></span></div>
    </aside>

    <!-- 右侧舞台：标题栏 + 手机画布 -->
    <section class="stage">
      <header class="stage-header"><div><span class="eyebrow">{{ design === 'wise' ? 'WISE REDESIGN' : design === 'v5' ? 'V5 REDESIGN' : design === 'live' ? 'LIVE BUILD' : 'CURRENT SCENE' }}</span><h2>{{ sceneLabel(activeScene) }}</h2></div><div class="stage-meta"><button class="mobile-design-toggle" @click="selectDesign(nextDesignMode())">{{ designLabel }}</button><div class="viewport-chip"><span></span>390 × 888</div></div></header>
      <!-- 手机壳：状态栏(绝对定位) + 可滚动内容区 + 底部导航。下面这一长串 v-if/v-else-if 就是全部场景页面 -->
      <div class="phone-wrap"><PhoneShell :active="navActive" :detail="isDetail" :secondary="secondary" :design="design" @navigate="selectScene">
        <!-- ============ 【现版】quick-pick-main 线上代码的五个 tab 页（页面级组件在 src/live/） ============ -->
        <LiveHome v-if="current === 'home' && design === 'live'" />
        <LiveList v-else-if="current === 'stalls' && design === 'live'" />
        <LiveCampus v-else-if="current === 'campus' && design === 'live'" />
        <LiveFriends v-else-if="current === 'friends' && design === 'live'" />
        <LiveProfile v-else-if="current === 'profile' && design === 'live'" />

        <!-- ============ 【店铺详情 · 林胡子评价抽屉｜Wise 新版】 ============ -->
        <section v-else-if="current === 'linhuzi-reviews' && design === 'wise'" class="screen wise-review-sheet-page">
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

        <!-- ============ 【店铺详情 · 林胡子评价抽屉｜原版】 ============ -->
        <section v-else-if="current === 'linhuzi-reviews'" class="screen original-review-sheet-page">
          <header class="original-review-store"><img :src="asset('/assets/source-fidelity/stalls/linhuzi.jpeg')" alt="林胡子猪脚饭摊位"><button aria-label="返回" @click="selectScene('stalls')"><IconSymbol name="back" :size="30" /></button><div><img :src="asset('/assets/source-fidelity/stalls/linhuzi.jpeg')" alt=""><h1>林胡子猪脚饭</h1><span>主食</span></div><nav><b>评分</b><span>评分人数</span><b>人均</b><span>浏览</span></nav></header>
          <section class="original-review-sheet"><div class="original-sheet-handle"></div><header><div><h2>林胡子猪脚饭</h2><p>看看大家都怎么说</p></div><button @click="selectScene('stalls')">关闭</button></header><nav><button :class="{ active: reviewSort === 'hot' }" @click="reviewSort = 'hot'">最热</button><button :class="{ active: reviewSort === 'new' }" @click="reviewSort = 'new'">最新</button></nav><article><header><div class="original-review-avatar"></div><span><b>微信用户</b><small>2026-09-08</small></span></header><p>好吃！给的肉很多，辣椒也好吃，才十五块钱。有猪脚饭和土豆牛腩饭</p><footer><button>赞 0</button><button>回复</button></footer></article><p class="original-review-end">没有更多评价了</p></section>
          <form class="original-review-composer" @submit.prevent="sendReview"><input v-model="reviewDraft" placeholder="写评价" aria-label="写评价"><label><input type="checkbox">匿名</label><button type="submit">发送</button></form>
        </section>

        <!-- ============ 【个人 · 用户公开主页｜Wise 新版】 ============ -->
        <section v-else-if="current === 'public-profile' && design === 'wise'" class="screen wise-public-profile">
          <header class="wise-public-cover"><button aria-label="返回" @click="selectScene('friends')"><IconSymbol name="back" :size="30" /></button><button aria-label="更多"><IconSymbol name="more" :size="18" /></button><div><span>庆快校园</span><strong>个人主页</strong></div></header>
          <main class="wise-public-card"><div class="wise-public-avatar reference-avatar"></div><div class="wise-public-heading"><small>已关注</small><h1>微信用户 <span>♀</span></h1><p>她在庆快校园的第 1 年</p></div><section class="wise-public-social"><button><b>3</b><span>关注</span></button><button><b>1</b><span>粉丝</span></button><button><b>1</b><span>收藏</span></button><button><b>0</b><span>评分</span></button></section><section class="wise-public-sign"><small>个性签名</small><p>~！ @测试</p></section><section class="wise-public-facts"><header><small>个人资料</small></header><div><span>用龄</span><b>1 年</b></div><button><span>收藏数</span><b>1</b><IconSymbol name="arrow" :size="22" /></button></section><section class="wise-public-reviews"><header><div><small>公开内容</small><h2>她的评价</h2></div><span>0 条</span></header><div class="wise-public-empty"><IconSymbol name="message" :size="24" /><p>还没有发表过评价</p><small>以后发布的公开评价会显示在这里</small></div></section></main>
          <footer class="wise-public-follow"><button>已关注</button></footer>
        </section>

        <!-- ============ 【个人 · 用户公开主页｜原版】 ============ -->
        <section v-else-if="current === 'public-profile'" class="screen original-public-profile">
          <header><button aria-label="返回" @click="selectScene('friends')"><IconSymbol name="back" :size="30" /></button><button aria-label="更多"><IconSymbol name="more" :size="18" /></button></header><main><div class="original-public-avatar reference-avatar"></div><h1>微信用户 <span>♀</span></h1><p class="original-public-social">关注：3 | 粉丝：1</p><p class="original-public-sign"><span>个性签名：</span>~！ @测试</p><dl><div><dt>用龄：</dt><dd>1 年</dd></div><div><dt>收藏数：</dt><dd>1</dd><IconSymbol name="arrow" :size="24" /></div><div><dt>评分数：</dt><dd>0</dd></div></dl></main><footer><button>已关注</button></footer>
        </section>
        <!-- ============ 【首页｜V5 新版】顶栏 + 搜索 + 金刚区 + 今天吃什么/做什么双卡；下半段沿用原版通知栏与猜你喜欢 ============ -->
        <section v-else-if="current === 'home' && design === 'v5'" class="screen v5-home-page">
          <header class="v5-topbar">
            <div class="v5-brand">
              <img :src="asset('/assets/qingkuai.ico')" alt="庆快校园">
              <span class="v5-brand-name">庆快校园</span>
            </div>
            <div class="v5-capsule">
              <span class="v5-c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2" /><circle cx="10" cy="4" r="2" /><circle cx="18" cy="4" r="2" /></svg></span>
              <span class="v5-c-div"></span>
              <span class="v5-c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2" /><path d="M6 3.6v4.8M3.6 6h4.8" /></svg></span>
            </div>
          </header>

          <div class="v5-searchbar" role="button" tabindex="0" aria-label="搜索" @click="v5OpenSearch">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#98A29C" stroke-width="1.6" /><path d="M11 11l3.5 3.5" stroke="#98A29C" stroke-width="1.6" stroke-linecap="round" /></svg>
            <span>搜索店铺、小摊、饭堂好味</span>
          </div>

          <nav class="v5-entries" aria-label="快捷入口">
            <button v-for="entry in v5Entries" :key="entry.label" class="v5-entry" @click="v5EntryClick(entry)">
              <span class="v5-iconbox" :style="{ background: entry.background, border: entry.border }" v-html="v5Icon(entry.icon, 28)"></span>
              <span class="v5-entry-label">{{ entry.label }}</span>
            </button>
          </nav>

          <div class="v5-duo">
            <button :class="['v5-duo-card', 'eat', { opening: v5BoxOpening }]" @click="openBlindBox">
              <span class="txt">
                <span class="v5-live"><i></i>营业中 <b>{{ v5OpenCount }}</b> 家</span>
                <span class="big">今天吃<span style="color:#B98C3F">什么</span><span class="q">?</span></span>
                <span class="hint">点我抽签 ›</span>
              </span>
              <svg class="v5-duo-art" width="44" height="44" viewBox="0 0 40 40" fill="none">
                <defs>
                  <linearGradient id="v5BoxBodyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F8F4" /><stop offset="1" stop-color="#DCE8DF" /></linearGradient>
                  <linearGradient id="v5BoxLidG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF8" /><stop offset="1" stop-color="#EFF0E6" /></linearGradient>
                </defs>
                <g class="beam">
                  <circle cx="20" cy="22" r="15" fill="#FFF6DC" />
                  <path d="M20 3v3.4M20 37.6V41M4 22h3.4M32.6 22H36M8.7 10.7l2.4 2.4M28.9 30.9l2.4 2.4M31.3 10.7l-2.4 2.4M11.1 30.9l-2.4 2.4" stroke="#EBD49A" stroke-width="2" stroke-linecap="round" />
                </g>
                <path class="spk" d="M20 3.4c.5 2.6.9 3.6 2.4 4.6-1.5 1-1.9 2-2.4 4.6-.5-2.6-.9-3.6-2.4-4.6 1.5-1 1.9-2 2.4-4.6Z" fill="#EBD49A" />
                <path class="spk" style="transition-delay:.04s" d="M30.4 8.2c.32 1.66.58 2.3 1.53 2.94-.95.64-1.21 1.28-1.53 2.94-.32-1.66-.58-2.3-1.53-2.94.95-.64 1.21-1.28 1.53-2.94Z" fill="#E4B5B6" />
                <path class="spk" style="transition-delay:.08s" d="M8.9 10.4c.28 1.44.5 2 1.33 2.55-.83.55-1.05 1.11-1.33 2.55-.28-1.44-.5-2-1.33-2.55.83-.55 1.05-1.11 1.33-2.55Z" fill="#A3C9B8" />
                <g class="lid">
                  <rect x="7.6" y="5.6" width="24.8" height="7.6" rx="3.4" fill="url(#v5BoxLidG)" stroke="#B7CFC4" stroke-width="1.3" />
                  <path d="M20 5.6v7.6" stroke="#A3C9B8" stroke-opacity=".8" stroke-width="1.6" />
                </g>
                <g class="body-b">
                  <rect x="8.6" y="13.4" width="22.8" height="21.4" rx="6" fill="url(#v5BoxBodyG)" stroke="#B7CFC4" stroke-width="1.3" />
                  <path d="M20 13.4v21.4" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="2.6" />
                  <path d="M8.6 19.6h22.8" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.6" />
                </g>
                <g class="bow">
                  <ellipse cx="15.6" cy="12.6" rx="4.2" ry="2.7" fill="#F6F1E7" stroke="#CFDCD2" stroke-width="1.1" transform="rotate(-18 15.6 12.6)" />
                  <ellipse cx="24.4" cy="12.6" rx="4.2" ry="2.7" fill="#F6F1E7" stroke="#D7DECF" stroke-width="1.1" transform="rotate(18 24.4 12.6)" />
                  <circle cx="20" cy="12.8" r="1.7" fill="#EBD49A" />
                </g>
              </svg>
            </button>

            <button class="v5-duo-card rank" @click="v5OpenIdea">
              <span class="txt">
                <b class="rank-name">今天做什么？</b>
                <span class="hint">课余灵感，点一下就有</span>
              </span>
              <span class="go-side">
                <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                  <defs><linearGradient id="v5DomeGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF6EA" /><stop offset="1" stop-color="#EDE0C4" /></linearGradient></defs>
                  <path d="M6 24V13a14 14 0 0 1 28 0v11H6Z" fill="url(#v5DomeGold)" stroke="#CDBB8B" stroke-width="1.3" />
                  <circle cx="14.5" cy="18.5" r="3.4" fill="#E7CD94" />
                  <circle cx="26" cy="16.5" r="3.6" fill="#DCC894" />
                  <circle cx="20.5" cy="12.5" r="3.2" fill="#EFE3C6" />
                  <circle cx="20.5" cy="20.5" r="2.5" fill="#EBD49A" />
                  <path d="M11 12.5a9 9 0 0 1 5-5.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity=".9" />
                  <rect x="8" y="24" width="24" height="9" rx="4" fill="#F5EEDC" stroke="#CDBB8B" stroke-width="1.3" />
                  <circle cx="17.5" cy="28.5" r="2.6" fill="#D5BF8C" />
                  <circle cx="26.5" cy="28.5" r="2.6" fill="#FCF8EF" stroke="#CDBB8B" stroke-width="1.1" />
                  <path d="M26.5 27.4v2.2" stroke="#BEAA78" stroke-width="1.1" stroke-linecap="round" />
                </svg>
              </span>
            </button>
          </div>

          <!-- 通知栏：白底圆角横条，红色喇叭 + 红色「通知」二字，竖线分隔右侧滚动文案 -->
          <div class="v5-notice" role="button" tabindex="0" @click="v5NoticeOpen = true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6.5v3h2.5L9 13V3L4.5 6.5H2Z" stroke="#E23E3E" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.5 6a3.2 3.2 0 0 1 0 4M13.3 4.3a5.8 5.8 0 0 1 0 7.4" stroke="#E23E3E" stroke-width="1.5" stroke-linecap="round"/></svg>
            <b>通知</b>
            <span class="v5-n-line"></span>
            <span class="v5-n-text">全新改版上线，感谢大家一直以来的陪伴与支持</span>
          </div>

          <!-- 猜你喜欢：标题 + 三个筛选 tab + 两列卡片网格 -->
          <section class="v5-section">
            <div class="v5-sec-head"><h2>猜你喜欢</h2></div>
            <div class="v5-tabs">
              <button v-for="tab in v5GuessTabs" :key="tab.id" :class="{ on: v5GuessArea === tab.id }" @click="v5GuessArea = tab.id">{{ tab.label }}</button>
            </div>
            <div class="v5-grid2">
              <div v-for="store in v5GuessList" :key="store.name" class="v5-shop-card" @click="v5OpenStore(store)">
                <div class="v5-cover"><img :src="asset(store.photo)" :alt="store.name"><span class="v5-flag">{{ v5AreaFlag(store.area) }}</span></div>
                <div class="v5-card-body">
                  <h3>{{ store.name }}</h3>
                  <span class="v5-loc">{{ store.place }}</span>
                  <div class="v5-card-row"><span class="v5-rate">★ {{ store.rating.toFixed(1) }}</span><span class="v5-cnt">{{ store.people }}人评过</span></div>
                </div>
              </div>
            </div>
          </section>

          <!-- 通知弹窗：点上方通知栏弹出，点遮罩或右上角 × 关闭 -->
          <div :class="['v5-nmodal', { show: v5NoticeOpen }]">
            <button class="v5-nmask" aria-label="关闭" @click="v5NoticeOpen = false"></button>
            <div class="v5-ncard">
              <div class="v5-nh">
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M2 6.5v3h2.5L9 13V3L4.5 6.5H2Z" stroke="#E23E3E" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.5 6a3.2 3.2 0 0 1 0 4M13.3 4.3a5.8 5.8 0 0 1 0 7.4" stroke="#E23E3E" stroke-width="1.5" stroke-linecap="round"/></svg>
                <b>通知</b>
                <button class="v5-nx" aria-label="关闭" @click="v5NoticeOpen = false">
                  <svg width="11" height="11" viewBox="0 0 12 12" stroke="#6B7377" stroke-width="1.6" stroke-linecap="round"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>
                </button>
              </div>
              <div v-for="item in v5Notices" :key="item.title" class="v5-nitem">
                <h4>{{ item.title }}<span class="v5-nd">{{ item.date }}</span></h4>
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 【进店逛｜V5】金刚区点「桥苑小摊 / 商业中心 / 庆园饭堂」进入的分区页 ============ -->
        <section v-else-if="current === 'v5-zone'" class="screen v5-page">
          <div class="v5-sub-top">
            <button class="v5-d-back" aria-label="返回" @click="v5Back('home')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>{{ v5ZoneInfo.label }}</h1>
            <div class="v5-capsule">
              <span class="v5-c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2" /><circle cx="10" cy="4" r="2" /><circle cx="18" cy="4" r="2" /></svg></span>
              <span class="v5-c-div"></span>
              <span class="v5-c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2" /><path d="M6 3.6v4.8M3.6 6h4.8" /></svg></span>
            </div>
          </div>
          <div class="v5-sub-body">
            <p class="v5-sub-lead">{{ v5ZoneInfo.lead }}</p>

            <!-- 顶部推荐位：可以左右滑，所以放几家都不挤 -->
            <div class="v5-promo-head">
              <strong>推荐</strong>
              <small>左右滑看看 ›</small>
            </div>
            <div class="v5-promo-scroll">
              <div v-for="pm in v5ZonePromos[v5Zone]" :key="pm.name" class="v5-promo" @click="v5OpenStore(v5GuessStores.find((s) => s.name === pm.name) || { name: pm.name })">
                <img :src="asset(pm.img)" :alt="pm.name">
                <em class="v5-p-tag">推荐</em>
                <strong>{{ pm.name }}</strong>
                <small>{{ pm.line }}</small>
                <div class="v5-p-foot">
                  <span><b>¥{{ pm.price }}</b> 人均起 · ★{{ pm.rating.toFixed(1) }}</span>
                </div>
              </div>
            </div>

            <div class="v5-filter-row">
              <button v-for="chip in v5CategoryChips" :key="chip" :class="['v5-chip', { on: v5ZoneCat === chip }]" @click="v5ZoneCat = chip">{{ chip }}</button>
            </div>

            <!-- 第二排：左边「位置」下拉（展开就贴在下面，不是弹窗），右边三个榜单 -->
            <div class="v5-rank-bar">
              <button class="v5-spot" :class="{ on: v5SpotOpen || v5ZoneSpot !== '全部位置' }" @click="v5SpotOpen = !v5SpotOpen">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" fill="currentColor"/></svg>
                {{ v5ZoneSpot }}
                <span class="v5-spot-arw" :class="{ up: v5SpotOpen }">⌄</span>
              </button>
              <button v-for="r in v5Ranks" :key="r.id" :class="['v5-rank', { on: v5ZoneRank === r.id }]" @click="v5ToggleRank(r.id)">
                <i>{{ r.ico }}</i>{{ r.label }}
              </button>
              <!-- 下拉面板：跟着这一行往下掉，点旁边任意地方收起来 -->
              <div v-if="v5SpotOpen" class="v5-spot-drop" @click.stop>
                <header class="v5-sp-top"><h4>按位置筛选</h4><button @click="v5SpotReset">重置</button></header>
                <button v-for="sp in v5ZoneSpotList" :key="sp" class="v5-sp-row" @click="v5PickSpot(sp)">
                  <span class="v5-sp-name">{{ sp }}</span>
                  <span class="v5-sp-radio" :class="{ on: v5ZoneSpot === sp }"></span>
                  <span class="v5-sp-num">{{ v5SpotCount(sp) }}</span>
                </button>
              </div>
            </div>
            <!-- 展开下拉时铺一层透明的「点别处收起」，不遮住页面 -->
            <div v-if="v5SpotOpen" class="v5-spot-catch" @click="v5SpotOpen = false"></div>
            <!-- 饭堂一楼：出食谱 -->
            <template v-if="v5IsFloor">
              <div class="v5-list-meta"><span>共 {{ v5MenuList.length }} 道 · {{ v5ZoneSpot }}食谱</span><span>点菜看窗口与价格</span></div>
              <div class="v5-shop-list">
                <div v-for="(m, i) in v5MenuList" :key="m.n" class="v5-menu-card">
                  <span class="v5-mc-ico" v-html="v5Icon(m.ico, 24)"></span>
                  <div class="v5-mc-main">
                    <div class="v5-mc-top">
                      <strong>{{ m.n }}</strong>
                      <em v-if="m.star" class="v5-mc-star">招牌</em>
                      <span class="v5-mc-no">No.{{ i + 1 }}</span>
                    </div>
                    <p class="v5-mc-sub">{{ m.win }} · {{ m.cat }} · ★{{ m.rate.toFixed(1) }}</p>
                    <p class="v5-mc-rec">{{ m.rec }} 人推荐</p>
                  </div>
                  <b class="v5-mc-price">¥{{ m.price }}</b>
                </div>
              </div>
            </template>

            <!-- 其余：出店铺 -->
            <template v-else>
              <div class="v5-list-meta"><span>共 {{ v5ZoneList.length }} 家</span><span>点商家进详情</span></div>
              <div class="v5-shop-list">
                <div v-for="(s, i) in v5ZoneList" :key="s.name" class="v5-row-card" @click="v5OpenStore(s)">
                  <div class="v5-thumb">
                    <img :src="asset(s.photo)" :alt="s.name">
                    <em class="v5-t-cat">{{ s.cat[0] }}</em>
                    <span class="v5-t-no">No.{{ i + 1 }}</span>
                  </div>
                  <div class="v5-rc-body">
                    <div class="v5-rc-head"><h3>{{ s.name }}</h3><b class="v5-rc-like">♡ {{ s.likes || 0 }}</b></div>
                    <div class="v5-rc-row"><span class="v5-rc-rate">★ {{ s.rating.toFixed(1) }}</span><span class="v5-rc-cnt">({{ s.people }}人评过)</span><span class="v5-rc-dot">·</span><span class="v5-rc-price">人均 ¥{{ s.price }}</span></div>
                    <div class="v5-rc-tags"><em v-for="c in s.cat" :key="c">{{ c }}</em></div>
                    <p class="v5-rc-pos">{{ s.place }} · {{ s.time }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </section>

        <!-- ============ 【搜索｜V5】首页搜索框进入 ============ -->
        <section v-else-if="current === 'v5-search'" class="screen v5-page">
          <div class="v5-sub-top">
            <div class="v5-s-inp">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#98A29C" stroke-width="1.6" /><path d="M11 11l3.5 3.5" stroke="#98A29C" stroke-width="1.6" stroke-linecap="round" /></svg>
              <input v-model="v5SearchText" type="text" placeholder="搜索店铺、小摊、饭堂好味" aria-label="搜索">
              <button v-if="v5SearchText" class="v5-s-clear" aria-label="清空" @click="v5SearchText = ''">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#A9A498" stroke-width="1.7" stroke-linecap="round" /></svg>
              </button>
            </div>
            <button class="v5-s-cancel" @click="v5Back('home')">取消</button>
          </div>
          <div class="v5-sub-body">
            <template v-if="v5SearchText.trim()">
              <div class="v5-list-meta"><span>共 {{ v5SearchList.length }} 个结果</span></div>
              <div class="v5-shop-list">
                <div v-for="s in v5SearchList" :key="s.name" class="v5-row-card" @click="v5OpenStore(s)">
                  <div class="v5-thumb"><img :src="asset(s.photo)" :alt="s.name"></div>
                  <div class="v5-rc-body">
                    <h3>{{ s.name }}</h3>
                    <span class="v5-rc-cat">{{ s.cat.join(' · ') }}</span>
                    <div class="v5-rc-row"><span class="v5-rc-rate">★ {{ s.rating.toFixed(1) }}</span><span class="v5-rc-cnt">{{ s.people }}人评过</span></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="v5-s-sec"><h3>热门搜索</h3></div>
              <div class="v5-s-chips">
                <button v-for="w in v5HotWords" :key="w" @click="v5SearchText = w">{{ w }}</button>
              </div>
            </template>
          </div>
        </section>

        <!-- ============ 【今天吃什么 · 盲盒机｜V5】首页抽签卡进入 ============ -->
        <!-- ============ 【今天吃什么 · 盲盒机｜V5】首页抽签卡进入 ============ -->
        <section v-else-if="current === 'v5-gacha'" class="v5p gacha">
          <div class="gamba"></div>
          <!-- 自带状态栏：复刻参考稿每页各自的 07:40（会盖住项目的全局 14:11 状态栏） -->
          <div class="statusbar">
            <span>07:40</span>
            <span class="sicons">
              <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="3" width="3" height="8" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
              <svg width="16" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1 4.6C4.6 1.9 11.4 1.9 15 4.6"/><path d="M3.4 7.4C5.8 5.6 10.2 5.6 12.6 7.4"/><circle cx="8" cy="10.2" r="1.1" fill="currentColor" stroke="none"/></svg>
              <svg width="22" height="11" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="19" height="11" rx="3" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="14" height="8" rx="1.5" fill="currentColor"/><path d="M21.5 4v4c1-.4 1-3.6 0-4Z" fill="currentColor" opacity=".5"/></svg>
            </span>
          </div>
          <div class="gtop">
            <button class="gback" aria-label="返回" @click="v5Back('home')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#4A4E52" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <span class="gtitle">今天吃什么</span>
            <div class="capsule">
              <span class="c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2"/><circle cx="10" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg></span>
              <span class="c-div"></span>
              <span class="c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2"/><path d="M6 3.6v4.8M3.6 6h4.8"/></svg></span>
            </div>
          </div>

          <!-- 模式切换：随机抽 / 按 MBTI 抽 -->
          <div class="gmode">
            <button :class="{ on: v5gMode === 'random' }" @click="v5gMode = 'random'">随机模式</button>
            <button :class="{ on: v5gMode === 'mbti' }" @click="v5gMode = 'mbti'">MBTI模式</button>
          </div>

          <div class="gbody">
            <!-- 池子状态栏：始终告诉用户「我在多少家里抽」，池子太小时变橙提醒 -->
            <div :class="['gpool', { warn: v5gPoolList.length < 5 }]">
              <span class="gpool-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M9.6 20v-5.4h4.8V20" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="gpool-tx">池子里 <b>{{ v5gPoolList.length }}</b> 家</span>
              <span class="gpool-sep"></span>
              <span class="gpool-tx">营业中 <b>{{ v5gOpenList.length }}</b> 家</span>
              <button class="gpool-rst" @click="v5gReset">重置范围</button>
            </div>

            <!-- 人格模式面板：没测过就引导去测，测过了显示结果 -->
            <div v-if="v5gMode === 'mbti'" class="gmbti">
              <div v-if="!v5MbtiCode" class="gm-no">
                <div class="gm-t">还没测过你的吃饭MBTI</div>
                <p class="gm-p">6 道二选一，60 秒出结果。<br>测完之后，这台机子就只抽你的本命食堂。</p>
                <button class="gm-btn" @click="v5OpenMbti">去测一测 ›</button>
              </div>
              <div v-else class="gm-yes">
                <div class="gm-hd">
                  <span class="gm-code">{{ v5MbtiCode }}</span>
                  <span class="gm-nm">{{ v5MbtiResult.nm }}</span>
                  <button class="gm-re" @click="v5MbtiStart">重测</button>
                </div>
                <p class="gm-ds">「{{ v5MbtiResult.ds }}」</p>
              </div>
            </div>

            <!-- 三行筛选：想去哪 / 口味 / 人均，外加「只看营业中」开关 -->
            <div class="gfilter">
              <div class="gfrow">
                <span class="gflabel">想去哪</span>
                <div class="gchips">
                  <button v-for="o in v5Scopes" :key="o.key" :class="['gchip', { on: v5gScope === o.key }]" @click="v5gScope = o.key">{{ o.label }}</button>
                </div>
              </div>
              <div class="gfrow">
                <span class="gflabel">口味</span>
                <div class="gchips">
                  <button v-for="o in v5Tastes" :key="o.key" :class="['gchip', { on: v5gTaste === o.key }]" @click="v5gTaste = o.key">{{ o.label }}</button>
                </div>
              </div>
              <div class="gfrow">
                <span class="gflabel">人均</span>
                <div class="gchips">
                  <button v-for="o in v5Prices" :key="o.key" :class="['gchip', { on: v5gPrice === o.key }]" @click="v5gPrice = o.key">{{ o.label }}</button>
                </div>
              </div>
              <button :class="['gtoggle', { on: v5gOnlyOpen }]" @click="v5gOnlyOpen = !v5gOnlyOpen">
                <span>只看营业中的店</span>
                <span class="sw"><span class="knob"></span></span>
              </button>
            </div>

            <!-- 盲盒机：整机平时轻微摇晃，抽的时候抖动 -->
            <div class="gstage">
              <div class="gglow"></div>
              <div :class="['gmachine', { spinning: v5gBusy }]">
                <svg viewBox="0 0 200 248" width="176" height="218" fill="none" aria-label="盲盒机">
                  <defs>
                    <linearGradient id="v5bBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8F6F0"/><stop offset="1" stop-color="#E1E6DF"/></linearGradient>
                    <linearGradient id="v5bSign" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCFAF5"/><stop offset="1" stop-color="#EBE7DC"/></linearGradient>
                    <linearGradient id="v5bGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".44"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".10"/><stop offset="1" stop-color="#D6E2EC" stop-opacity=".24"/></linearGradient>
                    <linearGradient id="v5bTray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DAD5C9"/><stop offset="1" stop-color="#EDE9DF"/></linearGradient>
                    <radialGradient id="v5bShade" cx="34%" cy="26%" r="76%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".42"/><stop offset=".58" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#6B6B6B" stop-opacity=".14"/></radialGradient>
                    <radialGradient id="v5bFloor" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7E9C8C" stop-opacity=".32"/><stop offset="1" stop-color="#7E9C8C" stop-opacity="0"/></radialGradient>
                    <!-- 一只盲盒：颜色由 use 上的 color 决定 -->
                    <g id="v5bBx">
                      <rect x="-14" y="-12" width="28" height="24" rx="7" fill="currentColor"/>
                      <rect x="-14" y="-12" width="28" height="24" rx="7" fill="url(#v5bShade)"/>
                      <path d="M-14 -5V-5A7 7 0 0 1 -7 -12h14a7 7 0 0 1 7 7Z" fill="#FFFFFF" fill-opacity=".30"/>
                      <path d="M-13 -5h26" stroke="#FFFFFF" stroke-opacity=".42" stroke-width="1.4"/>
                      <path d="M0 -12v24" stroke="#FFFFFF" stroke-opacity=".48" stroke-width="1.8"/>
                      <ellipse cx="-4.4" cy="-14.6" rx="3.9" ry="2.5" fill="#FFFFFF" fill-opacity=".52" transform="rotate(-20 -4.4 -14.6)"/>
                      <ellipse cx="4.4" cy="-14.6" rx="3.9" ry="2.5" fill="#FFFFFF" fill-opacity=".52" transform="rotate(20 4.4 -14.6)"/>
                      <circle cx="0" cy="-14.4" r="1.5" fill="#FFFFFF" fill-opacity=".66"/>
                    </g>
                  </defs>
                  <ellipse cx="100" cy="238" rx="70" ry="9" fill="url(#v5bFloor)"/>
                  <!-- 顶部招牌 -->
                  <rect x="46" y="10" width="108" height="34" rx="15" fill="url(#v5bSign)" stroke="#FFFFFF" stroke-opacity=".85"/>
                  <path d="M52 40h96" stroke="#000000" stroke-opacity=".05" stroke-width="2.5" stroke-linecap="round"/>
                  <text x="100" y="32" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="2.4" fill="#9A9D9C">盲盒机</text>
                  <!-- 机身 -->
                  <rect x="34" y="44" width="132" height="152" rx="28" fill="url(#v5bBody)"/>
                  <rect x="34.75" y="44.75" width="130.5" height="150.5" rx="27.25" stroke="#FFFFFF" stroke-opacity=".85"/>
                  <path d="M52 54h96" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
                  <!-- 展柜玻璃内的 9 只盲盒 -->
                  <g class="g-boxes">
                    <rect x="46" y="60" width="108" height="88" rx="16" fill="#F1EEE4"/>
                    <rect x="46.75" y="60.75" width="106.5" height="86.5" rx="15.25" stroke="#000000" stroke-opacity=".06"/>
                    <use href="#v5bBx" transform="translate(68,78)" style="color:#F6F1E7"/>
                    <use href="#v5bBx" transform="translate(100,78)" style="color:#E4B5B6"/>
                    <use href="#v5bBx" transform="translate(132,78)" style="color:#A3C9B8"/>
                    <use href="#v5bBx" transform="translate(68,104)" style="color:#A8B9CC"/>
                    <use href="#v5bBx" transform="translate(100,104)" style="color:#F5E2A4"/>
                    <use href="#v5bBx" transform="translate(132,104)" style="color:#F6F1E7"/>
                    <use href="#v5bBx" transform="translate(68,130)" style="color:#A3C9B8"/>
                    <use href="#v5bBx" transform="translate(100,130)" style="color:#F6F1E7"/>
                    <use href="#v5bBx" transform="translate(132,130)" style="color:#A8B9CC"/>
                    <path d="M50 92h100M50 118h100" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>
                  </g>
                  <!-- 玻璃反光 -->
                  <rect x="46" y="60" width="108" height="88" rx="16" fill="url(#v5bGlass)"/>
                  <path d="M60 138a46 46 0 0 1 26-34" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>
                  <path d="M138 130a52 52 0 0 0 6-16" stroke="#FFFFFF" stroke-opacity=".42" stroke-width="3.5" stroke-linecap="round"/>
                  <!-- 旋钮：本体静止，只有灰线绕圆心转动 -->
                  <g>
                    <circle cx="64" cy="172" r="20" fill="#ECE8DE"/>
                    <circle cx="64" cy="172" r="20" fill="#FFFFFF" opacity=".45"/>
                    <circle cx="64" cy="172" r="13.5" fill="#FBFAF6"/>
                    <rect class="gknob-line" x="56" y="168.5" width="16" height="7" rx="3.5" fill="#D4CFC3"/>
                  </g>
                  <!-- 出货指示灯 -->
                  <circle cx="132" cy="164" r="4.6" fill="#E4B5B6" opacity=".85"/>
                  <circle cx="132" cy="180" r="4.6" fill="#A3C9B8" opacity=".85"/>
                  <!-- 取货口 -->
                  <rect x="58" y="196" width="84" height="30" rx="14" fill="url(#v5bTray)" stroke="#FFFFFF" stroke-opacity=".7"/>
                  <path d="M66 204h68" stroke="#000000" stroke-opacity=".07" stroke-width="2.4" stroke-linecap="round"/>
                  <path d="M66 219h68" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
                  <!-- 速度线：静止时几乎看不见，抽的时候闪 -->
                  <g class="speed" stroke="#A3C9B8" stroke-width="2.6" stroke-linecap="round" fill="none">
                    <path d="M23 94q-7-12 0-22"/><path d="M14 102q-9-6-11-14"/>
                    <path d="M177 94q7-12 0-22"/><path d="M186 102q9-6 11-14"/>
                  </g>
                </svg>
              </div>
            </div>

            <!-- 结果区：抽 1 个时单列大卡，抽 3 个时三列小卡 -->
            <div :class="['gresult', { single: v5gPicks.length === 1 }]">
              <div class="gtriple">
                <div v-for="(s, i) in v5gPicks" :key="s.name" class="gmini"
                     :style="{ '--cap': v5BoxColors[i % 5], animationDelay: i * 90 + 'ms' }"
                     @click="v5OpenShop(s)">
                  <span class="m-photo"><img :src="asset(s.img)" :alt="s.name"></span>
                  <span class="m-name">{{ s.name }}</span>
                  <span class="m-rate">★ {{ s.rating.toFixed(1) }}</span>
                  <span class="m-price">人均 ¥{{ s.price }}</span>
                  <span class="m-go">去看看 ›</span>
                </div>
              </div>
            </div>

            <p class="ghint">{{ v5gHint }}</p>

            <div class="gactions">
              <button class="gbtn primary" :disabled="v5gBusy || !v5gPoolList.length" @click="v5gDraw(1)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.2" stroke="#FFFFFF" stroke-width="2"/><path d="M12 8.4v7.2M8.4 12h7.2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>
                <span class="lb">单抽</span>
              </button>
              <button class="gbtn ghost" :disabled="v5gBusy || v5gPoolList.length < 3" @click="v5gDraw(3)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2.4" y="12.4" width="8.6" height="8.6" rx="2.6" stroke="#6B6F73" stroke-width="1.8"/><rect x="13" y="7" width="7" height="7" rx="2.2" stroke="#6B6F73" stroke-width="1.8"/><rect x="13" y="15.4" width="7" height="7" rx="2.2" stroke="#6B6F73" stroke-width="1.8"/></svg>
                <span class="lb">三连抽</span>
              </button>
            </div>
            <button :class="['glink', { on: v5gNoRepeat }]" @click="v5gNoRepeat = !v5gNoRepeat">
              <span class="box"><svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              优先避开今天抽过的店
            </button>

            <div class="ghistory">
              <div class="ghhead">
                <h3>今天抽过的签</h3>
                <span>{{ v5gHist.length ? '共 ' + v5gHist.length + ' 家' : '还没有抽过' }}</span>
              </div>
              <div v-if="!v5gHist.length" class="ghempty">今天还没开过盲盒，抽一个试试~</div>
              <div v-else class="ghscroll">
                <div v-for="(h, i) in v5gHist" :key="'hg' + i" class="ghcard" @click="v5OpenShop(h.shop)">
                  <span class="h-thumb"><img :src="asset(h.shop.img)" :alt="h.shop.name"></span>
                  <span class="h-name">{{ h.shop.name }}</span>
                  <span class="h-time">{{ h.at }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 【灵感小盒｜V5】首页「今天做什么」进入 ============ -->
        <!-- ============ 【灵感小盒｜V5】首页「今天做什么」进入 ============ -->
        <section v-else-if="current === 'v5-idea'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('home')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>灵感小盒</h1>
            <div class="capsule">
              <span class="c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2"/><circle cx="10" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg></span>
              <span class="c-div"></span>
              <span class="c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2"/><path d="M6 3.6v4.8M3.6 6h4.8"/></svg></span>
            </div>
          </div>
          <div class="sub-body">
            <div class="idea-wrap">
              <div class="idea-stage">
                <div :class="['idea-machine', { shake: v5IdeaBusy }]">
                  <!-- 机内 13 颗玻璃珠：位置与配色都来自数据，不写死在模板里 -->
                  <div class="idea-orbs">
                    <span v-for="(p, i) in v5OrbPos" :key="'orb' + i" class="idea-orb"
                          :style="{ width: (40 + (i % 3) * 4) + 'px', height: (40 + (i % 3) * 4) + 'px', left: p[0] + '%', top: p[1] + '%', background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,.92) 0%, ' + v5OrbColors[i % 5] + ' 62%)' }"></span>
                  </div>
                  <div class="idea-tray">
                    <span class="idea-knob"><i></i></span>
                    <span class="idea-out">
                      <span :class="['egg', { pop: v5IdeaEgg }]" :style="{ background: 'radial-gradient(circle at 32% 26%, rgba(255,255,255,.92) 0%, ' + v5IdeaCur.c + ' 62%)' }"></span>
                    </span>
                  </div>
                </div>
                <!-- 结果卡：先露出淡绿卡背，再翻到正面 -->
                <div :class="['idea-result', { show: v5IdeaShow }]">
                  <div :class="['icard', { flip: v5IdeaFlip }]">
                    <div class="iface back">
                      <svg class="btx" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <g fill="#FFFFFF" fill-opacity=".16">
                          <circle cx="34" cy="42" r="2.6"/><circle cx="166" cy="58" r="2.6"/>
                          <circle cx="30" cy="150" r="2.6"/><circle cx="170" cy="238" r="2.6"/>
                          <circle cx="100" cy="20" r="2"/><circle cx="100" cy="266" r="2"/>
                          <path d="M0 200 L200 80" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="1"/>
                          <path d="M0 80 L200 200" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="1"/>
                        </g>
                      </svg>
                      <svg class="clover" viewBox="0 0 48 56" fill="none" aria-label="幸运草">
                        <g fill="#8DBE8A">
                          <ellipse cx="24" cy="14" rx="6.8" ry="8.2"/>
                          <ellipse cx="24" cy="14" rx="6.8" ry="8.2" transform="rotate(90 24 23)"/>
                          <ellipse cx="24" cy="14" rx="6.8" ry="8.2" transform="rotate(180 24 23)"/>
                          <ellipse cx="24" cy="14" rx="6.8" ry="8.2" transform="rotate(270 24 23)"/>
                        </g>
                        <g fill="#FFFFFF" fill-opacity=".34">
                          <ellipse cx="21.4" cy="12.6" rx="2.6" ry="3.1"/>
                          <ellipse cx="21.4" cy="12.6" rx="2.6" ry="3.1" transform="rotate(90 24 23)"/>
                          <ellipse cx="21.4" cy="12.6" rx="2.6" ry="3.1" transform="rotate(180 24 23)"/>
                          <ellipse cx="21.4" cy="12.6" rx="2.6" ry="3.1" transform="rotate(270 24 23)"/>
                        </g>
                        <circle cx="24" cy="23" r="2.4" fill="#7BA976"/>
                        <path d="M24 27.5c1.6 5.4-1.4 8.6.4 14.2" stroke="#7BA976" stroke-width="2.8" stroke-linecap="round"/>
                        <path d="M24.6 35.5c3.4-1 5.2.4 6.8 1.8-2.6.7-4.8.3-6.8-1.8Z" fill="#8DBE8A"/>
                      </svg>
                      <span class="bmark">灵感小盒</span>
                    </div>
                    <div class="iface front">
                      <span class="cat" :style="{ background: v5IdeaCur.c, color: v5IdeaCur.tc }">{{ v5IdeaCur.cat }}</span>
                      <span class="txt">{{ v5IdeaCur.t }}</span>
                      <span class="sub">{{ v5IdeaCur.s }}</span>
                      <div class="idea-acts">
                        <button class="iact" @click="v5IdeaConfirm">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5.5 12.5l4.3 4.3L18.8 7.6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          就这个了
                        </button>
                        <button class="iact ghost" @click="v5IdeaSkip">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 4.5V10h-5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          换一个
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 已发布状态：我这条想法 + 同学们的评论 -->
              <div v-if="v5IdeaPost" class="idea-post">
                <div class="ip-head">
                  <span class="ip-ava" :style="{ background: v5IdeaPost.anon ? '#DAD9D6' : '#D9E4C9', color: v5IdeaPost.anon ? '#8C8A85' : '#5E7350' }">{{ v5IdeaPost.anon ? '匿' : '我' }}</span>
                  <div class="ip-who">
                    <strong>{{ v5IdeaPost.anon ? '匿名用户' : '我' }}</strong>
                    <small>刚刚 · 来自灵感小盒</small>
                  </div>
                  <span class="ip-go">已出发</span>
                </div>
                <div class="ip-topic" :style="{ color: v5IdeaPost.tc }">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 6.5h16M4 12h16M4 17.5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>{{ v5IdeaPost.cat }} · {{ v5IdeaPost.t }}</span>
                </div>
                <p class="ip-text">
                  {{ v5IdeaPost.text }}
                  <em v-if="v5IdeaPost.tag" class="ip-tag">{{ v5IdeaPost.tag }}</em>
                </p>
                <div class="ip-peers">
                  <span v-for="(c, i) in v5IdeaPeers" :key="'pr' + i" class="pp" :style="{ background: c }"></span>
                  <span class="pt">{{ v5IdeaPost.peers }} 位同学今天也在做这件事</span>
                </div>
                <div class="ip-stat">
                  <button :class="['st', { on: v5IdeaPost.liked }]" @click="v5IdeaToggleLike">
                    <svg width="14" height="14" viewBox="0 0 24 24" :fill="v5IdeaPost.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                    {{ v5IdeaPost.like }}
                  </button>
                  <span class="st">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 12.4c0 3.9-3.6 7-8 7-1 0-2-.16-2.9-.46L4.5 20.5l1.3-3.4A6.7 6.7 0 0 1 4 12.4c0-3.9 3.6-7 8-7s8 3.1 8 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                    {{ v5IdeaPost.comments.length }}
                  </span>
                  <button class="st again" @click="v5IdeaRedraw">换个灵感 ›</button>
                </div>
                <div class="ip-cmts">
                  <h3>同学们的评论 ({{ v5IdeaPost.comments.length }})</h3>
                  <div v-for="(m, i) in v5IdeaPost.comments" :key="'cm' + i" class="cm-row">
                    <button class="ca" :style="{ background: m.ac }" @click="v5OpenUser(m.n)">{{ m.n.slice(0, 1) }}</button>
                    <div class="cb">
                      <div class="ch"><strong @click="v5OpenUser(m.n)">{{ m.n }}</strong><small>{{ m.t }}</small></div>
                      <p>{{ m.txt }}</p>
                    </div>
                    <button :class="['cl', { on: m.liked }]" @click="v5IdeaLikeCmt(m)">
                      <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                      {{ m.like }}
                    </button>
                  </div>
                </div>
                <div class="ip-input">
                  <input v-model="v5IdeaReply" type="text" placeholder="回复一句，或者问问有没有人一起…" @keyup.enter="v5IdeaSendReply" />
                  <button @click="v5IdeaSendReply">发送</button>
                </div>
              </div>

              <button :class="['idea-draw', { empty: !v5IdeaLeft }]" @click="v5IdeaDraw">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.5 8.2A2.3 2.3 0 0 1 5.8 6h12.4a2.3 2.3 0 0 1 2.3 2.2v1.2a2.4 2.4 0 0 0 0 5.2v1.2a2.3 2.3 0 0 1-2.3 2.2H5.8a2.3 2.3 0 0 1-2.3-2.2v-1.2a2.4 2.4 0 0 0 0-5.2V8.2Z" stroke="#7A9464" stroke-width="1.7" stroke-linejoin="round"/><path d="M14.2 6v12" stroke="#7A9464" stroke-width="1.4" stroke-dasharray="2.4 2.6"/></svg>
                <span class="lbl">{{ v5IdeaLeft ? '扭一下 (' + v5IdeaLeft + '/' + v5IdeaMax + ')' : '盒子空了，明天再来' }}</span>
              </button>
              <button class="idea-luck" @click="v5IdeaHistOpen = !v5IdeaHistOpen">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.6" stroke="#9BA59A" stroke-width="1.7"/><path d="M12 7.6V12l3 1.9" stroke="#9BA59A" stroke-width="1.7" stroke-linecap="round"/></svg>
                今日手气
              </button>
              <div :class="['idea-hist', { open: v5IdeaHistOpen }]">
                <div v-if="!v5IdeaHist.length" class="ih-empty">今天还没扭过，先扭一下试试手气</div>
                <div v-for="(p, i) in v5IdeaHist" :key="'h' + i" class="ih-row">
                  <span class="dot" :style="{ background: p.c }"></span>
                  <span class="t">{{ p.t }}</span>
                  <em>{{ i === 0 ? '刚刚' : i + ' 分钟前' }}</em>
                </div>
              </div>
            </div>
          </div>

          <!-- 「分享你的想法」发布弹窗：点「就这个了」才出现 -->
          <div v-if="v5IdeaComposer" class="idea-mask" @click.self="v5IdeaCloseComposer">
            <div class="idea-sheet">
              <header class="ish-top">
                <h3>分享你的想法</h3>
                <button class="ish-x" aria-label="关闭" @click="v5IdeaCloseComposer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
                </button>
              </header>
              <div class="ish-idea">
                <span class="ish-cat" :style="{ background: v5IdeaCur.c, color: v5IdeaCur.tc }">{{ v5IdeaCur.cat }}</span>
                <span class="ish-t">{{ v5IdeaCur.t }}</span>
              </div>
              <textarea
                v-model="v5IdeaDraft"
                class="ish-input"
                rows="4"
                placeholder="说说你的想法，或者喊一声求组队…（选填）"
              ></textarea>
              <div class="ish-tags">
                <button v-for="g in v5IdeaQuickTags" :key="g" :class="['tg', { on: v5IdeaDraftTag === g }]" @click="v5IdeaPickTag(g)">{{ g }}</button>
              </div>
              <div :class="['ish-anon', { on: v5IdeaAnon }]" @click="v5IdeaAnon = !v5IdeaAnon">
                <span class="cbx">
                  <svg v-if="v5IdeaAnon" width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5.5 12.5l4.3 4.3L18.8 7.6" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                匿名发布，不显示我的昵称
              </div>
              <button class="ish-pub" @click="v5IdeaPublish">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4.2 11.9 20 4.6l-7.3 15.8-1.6-6.9-6.9-1.6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
                发布想法
              </button>
            </div>
          </div>
        </section>

        <!-- ============ 【MBTI食堂｜V5】金刚区「MBTI食堂」进入 ============ -->
        <!-- ============ 【MBTI食堂｜V5】金刚区「MBTI食堂」进入 ============ -->
        <section v-else-if="current === 'v5-mbti'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('home')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>MBTI食堂</h1>
            <div class="capsule">
              <span class="c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2"/><circle cx="10" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg></span>
              <span class="c-div"></span>
              <span class="c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2"/><path d="M6 3.6v4.8M3.6 6h4.8"/></svg></span>
            </div>
          </div>
          <div class="sub-body">
            <!-- 状态 123：介绍 → 6 道二选一 → 结果卡 -->
            <template v-if="v5MbtiStep === 0">
              <div class="mb-hero">
                <div class="kick">MBTI × 美食 · 仅供娱乐</div>
                <h1>MBTI食堂</h1>
                <p>不问你MBTI，只问你怎么吃。<br>6 道二选一，60 秒出你的食堂MBTI，<br>顺便告诉你今天该去哪一家。</p>
              </div>
              <div class="mb-act"><button class="mb-btn" @click="v5MbtiStart">开始测 · 6 题</button></div>
              <p class="mb-note">结果和真正的 MBTI 没关系，别当真，好吃才是真的</p>
            </template>

            <template v-else-if="v5MbtiStep <= 6">
              <div class="mb-dots">
                <i v-for="(q, i) in v5MbtiQuiz" :key="i" :class="{ on: i < v5MbtiStep }"></i>
              </div>
              <div class="mb-q">
                <div class="qn">第 {{ v5MbtiStep }} / 6 题 · {{ v5MbtiCur.hint }}</div>
                <div class="qt">{{ v5MbtiCur.qt }}</div>
                <button class="mb-opt" @click="v5MbtiAnswer('a')"><span class="oi">A</span><span class="ot">{{ v5MbtiCur.a }}</span></button>
                <button class="mb-opt" @click="v5MbtiAnswer('b')"><span class="oi">B</span><span class="ot">{{ v5MbtiCur.b }}</span></button>
              </div>
              <p class="mb-note">选你下意识会做的那个，别想太久</p>
            </template>

            <template v-else>
              <div class="mb-card">
                <div class="cd">{{ v5MbtiCode }}</div>
                <span class="nm">{{ v5MbtiResult.nm }}</span>
                <div class="ds">「{{ v5MbtiResult.ds }}」</div>
                <div class="hr"></div>
                <div class="sl">你的食堂三选一</div>
                <div v-for="(s, i) in v5MbtiShops" :key="s.name" class="mb-shop" @click="v5OpenShop(s)">
                  <span class="sn">{{ i + 1 }}</span>
                  <span class="sx">{{ s.name }}</span>
                  <span class="sy">去看看 ›</span>
                </div>
                <div class="mb-no lg">
                  <span class="lb">你是本校第</span>
                  <span class="v">{{ v5MbtiNo }}</span>
                  <span class="lb">位 {{ v5MbtiCode }}</span>
                </div>
              </div>
              <div class="mb-act">
                <button class="mb-btn" @click="v5MbtiPoster = true">生成分享海报</button>
                <button class="mb-btn ghost" @click="v5OpenGacha">去抽盲盒</button>
              </div>
              <div class="mb-act"><button class="mb-btn ghost" style="flex:1" @click="v5MbtiStart">再测一次</button></div>
              <p class="mb-note">把这张卡发出去，看看你身边的人都是什么味道</p>
            </template>
          </div>

          <!-- 分享海报浮层：absolute inset:0 相对 .phone，不随列表滚动 -->
          <div v-if="v5MbtiPoster" class="mb-poster" @click.self="v5MbtiPoster = false">
            <div class="sheet">
              <div class="mb-card" style="border:none;box-shadow:none;padding:0;background:none">
                <div class="cd">{{ v5MbtiCode }}</div>
                <span class="nm">{{ v5MbtiResult.nm }}</span>
                <div class="ds">「{{ v5MbtiResult.ds }}」</div>
                <div class="mb-no"><span class="lb">本校第</span><span class="v">{{ v5MbtiNo }}</span><span class="lb">位</span></div>
              </div>
              <div class="pbtns">
                <button class="pbtn" @click="v5MbtiPoster = false">关闭</button>
                <button class="pbtn pri" @click="v5MbtiPoster = false">保存图片</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ============ 【店铺详情｜V5】卡片 / 收藏 / 推荐列表进入 ============ -->
        <section v-else-if="current === 'v5-detail'" class="v5p detail">
          <div class="d-status statusbar">
            <span>19:04</span>
            <span class="sicons">
              <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="3" width="3" height="8" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
              <svg width="16" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M1 4.6C4.6 1.9 11.4 1.9 15 4.6"/><path d="M3.4 7.4C5.8 5.6 10.2 5.6 12.6 7.4"/><circle cx="8" cy="10.2" r="1.1" fill="currentColor" stroke="none"/></svg>
              <svg width="22" height="11" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="19" height="11" rx="3" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="14" height="8" rx="1.5" fill="currentColor"/><path d="M21.5 4v4c1-.4 1-3.6 0-4Z" fill="currentColor" opacity=".5"/></svg>
            </span>
          </div>
          <div class="d-hero">
            <img :src="asset(v5Detail.img)" :alt="v5Detail.name">
            <div class="d-top">
              <button class="d-back" aria-label="返回" @click="v5BackFromDetail">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="capsule">
                <span class="c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2"/><circle cx="10" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg></span>
                <span class="c-div"></span>
                <span class="c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2"/><path d="M6 3.6v4.8M3.6 6h4.8"/></svg></span>
              </div>
            </div>
            <span class="d-explore"><i></i>{{ v5Detail.exploring }} 人正在探店</span>
          </div>
          <div class="d-body">
            <div class="d-shoph">
              <h2>{{ v5Detail.name }}<span class="ot">线上点餐</span></h2>
              <div class="d-score">
                <b>{{ v5Detail.rating.toFixed(1) }}</b><em>/ 5 · {{ v5Detail.people }} 人评分</em>
                <span class="go">去评分 ›</span>
              </div>
              <div class="d-shoptags"><i v-for="t in v5Detail.tags" :key="t">{{ t }}</i></div>
            </div>
            <div class="d-card" style="margin-top:12px">
              <div class="d-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9DA09A" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
                <span class="dkey">营业时间</span>{{ v5Detail.time }}
              </div>
              <div class="d-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9DA09A" stroke-width="1.8"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>
                <span class="dkey">店铺位置</span>{{ v5Detail.pos }}
                <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#C9CDD1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
            <p class="d-desc">{{ v5Detail.desc }}</p>
            <div class="d-week">
              <div class="wh"><b>本周探店</b><span>看看这家有多受欢迎</span></div>
              <div class="wrow">
                <div class="w"><b>{{ v5Detail.week.visitors }}</b><span>位访客</span></div>
                <div class="w"><b>{{ v5Detail.week.views }}</b><span>次浏览</span></div>
                <div class="w"><b>{{ v5Detail.week.share }}</b><span>占本周总浏览</span></div>
              </div>
            </div>
            <div class="d-menu">
              <div class="mh"><b>菜单与点餐</b><span>点开查看大图</span></div>
              <div class="mb">
                <img :src="asset(v5Detail.img)" :alt="v5Detail.name">
                <span class="mcap">人均 ¥{{ v5Detail.price }}</span>
              </div>
            </div>
          </div>
          <div class="d-bar">
            <button class="act" @click="v5DetailLiked = !v5DetailLiked">
              <svg width="19" height="19" viewBox="0 0 24 24" :fill="v5DetailStar ? '#E3C489' : 'none'" stroke="#8A9299" stroke-width="1.7"><path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L4.3 9.9l6-.9L12 3.5Z"/></svg>
              评分
            </button>
            <button :class="['act', 'fav', { on: v5DetailFav }]" @click="v5DetailFav = !v5DetailFav">
              <svg width="19" height="19" viewBox="0 0 24 24" :fill="v5DetailFav ? '#C4705F' : 'none'" stroke="#8A9299" stroke-width="1.7"><path d="M12 21s-7.5-4.7-9.3-9C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 5.8 3.6 4.3 7-1.8 4.3-9.3 9-9.3 9Z"/></svg>
              {{ v5DetailFav ? '已收藏' : '收藏' }}
            </button>
            <button class="act">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8A9299" stroke-width="1.7"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg>
              分享
            </button>
            <button class="act">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8A9299" stroke-width="1.7"><path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L4.3 9.9l6-.9L12 3.5Z"/></svg>
              举报
            </button>
            <button class="cta">立即点餐</button>
          </div>
        </section>

        <!-- ============ 【首页｜Wise 新版】深色/浅色可切换（homeDark） ============ -->
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
            <button @click="v5OpenFav('home')"><img :src="asset('/assets/source-fidelity/shortcuts/favorites.png')" alt=""><span>店铺收藏</span></button>
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

        <!-- ============ 【首页｜原版】轮播 + 快捷入口 + 金榜卡 + 通知 + 猜你喜欢 ============ -->
        <section v-else-if="current === 'home'" class="screen home-real">
          <header class="home-brand"><img src="/assets/qingkuai.ico"><strong>庆快校园</strong></header>
          <section class="home-banner-carousel" aria-label="校园轮播"><img v-for="(banner, index) in homeBanners" :key="banner" :src="asset(banner)" :alt="`校园轮播 ${index + 1}`" :class="{ active: index === 0 }"><div class="home-banner-dots"><i class="active"></i><i></i><i></i></div></section>
          <div class="home-shortcuts"><div v-for="group in ['pickup', 'friend']" :key="group" class="home-shortcut-group"><button v-for="item in homeShortcuts.filter((shortcut) => shortcut.group === group)" :key="item.label" @click="selectScene(item.scene)"><img :src="asset(item.image)" :alt="item.label"><span>{{ item.label }}</span></button></div></div>
          <section class="ranking-card" @click="selectScene('golden-board')"><div><h2>庆快金榜</h2><p>发现校园里，值得一尝的好味道</p></div><b><i>2</i><i>1</i><i>3</i></b><footer>校园店铺 · 街边小摊 <span>去看看榜单 ›</span></footer></section>
          <div class="home-notice"><IconSymbol name="notice" :size="24" /><b>通知</b><span>祝大家学业顺利，生活愉快！</span></div>
          <section class="home-recommend"><header><h2>猜你喜欢</h2><span>店铺小摊，都有好味道</span></header><nav><b>全部推荐</b><span>商业中心</span><span>街边小摊</span></nav><div><article v-for="item in homeStores" :key="item.name" @click="item.name === '徐豆豆' && selectScene('xudoudou-top')"><img :src="asset(item.photo)"><small>{{ item.kind }}</small><h3>{{ item.name }}</h3><p>{{ item.place }}</p><b>{{ item.score }}</b></article></div></section>
          <button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button>
        </section>

        <!-- ============ 【开盲盒】随机抽一家店，5 秒滚动后停 ============ -->
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

        <!-- ============ 【庆快金榜｜Wise 新版】店铺/小摊榜切换 ============ -->
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

        <!-- ============ 【庆快金榜｜原版】 ============ -->
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

        <!-- ============ 【桥苑小摊｜Wise 新版】 ============ -->
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

        <!-- ============ 【校园觅食 · 三个 tab 共用｜原版】stalls 桥苑小摊 / mall 商业中心 / canteen 饭堂 ============ -->
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

        <!-- ============ 【校园｜V5】底部「校园」进入 ============ -->
        <!-- 三个板块：失物招领 / 闲置小铺 / 搭把手，数据都在 fixtures 的 v5CampusBoards -->
        <section v-else-if="current === 'campus' && design === 'v5'" class="screen v5-tab-page">
          <div class="tab-head">
            <h1>校园</h1>
            <p>把小事交给彼此，日子会顺一点</p>
          </div>

          <div class="tip-card">
            <span class="tip-date">{{ v5TodayText }}</span>
            <strong>庆快校园祝您校园生活顺利！今天也要认真生活哦~</strong>
            <small>顺手看一眼校园里今天的新消息</small>
          </div>

          <div class="board-list">
            <button v-for="b in v5CampusBoards" :key="b.id" class="board-card" @click="v5Nav(b.scene)">
              <span class="bico" :style="{ background: b.tint }" v-html="v5Icon(b.ico, 30)"></span>
              <div class="bmain">
                <strong>{{ b.name }}</strong>
                <small>{{ b.lead }}</small>
              </div>
              <span class="bside">
                <em>{{ b.tag }}</em>
                <i>›</i>
              </span>
            </button>
          </div>

          <h2 class="tab-sub">校园服务</h2>
          <div class="svc-grid">
            <button class="svc-cell" @click="v5Nav('library')">
              <span class="sico" style="background:#D9E4C9" v-html="v5Icon('library', 26)"></span>
              图书馆
            </button>
            <button class="svc-cell disabled">
              <span class="sico" style="background:#E7E3D8" v-html="v5Icon('gallery', 26)"></span>
              庆快画廊
              <b>开发中</b>
            </button>
          </div>
        </section>

        <!-- ============ 【失物招领｜V5】校园页第一个板块 ============ -->
        <section v-else-if="current === 'v5-lost'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('campus')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>失物招领</h1>
            <button class="sub-add" @click="v5BoardReset('lost')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
              发布
            </button>
          </div>
          <div class="sub-body">
            <div class="v5l-campus">
              <button v-for="cp in v5Campuses" :key="cp.id" :class="['cp', { on: v5LostCampus === cp.id }]" @click="v5LostCampus = cp.id">
                {{ cp.short }}<i>{{ v5Count(v5LostAll, cp.id) }}</i>
              </button>
            </div>
            <div class="v5l-tabs">
              <button v-for="tb in v5LostTabs" :key="tb.id" :class="['vt', { on: v5LostTab === tb.id }]" @click="v5LostTab = tb.id">{{ tb.label }}</button>
            </div>
            <p class="v5l-lead">{{ v5LostTab === 'lost' ? '这些东西还没有找到主人，看到请说一声' : '有人捡到了东西，看看是不是你的' }}</p>
            <button v-for="it in v5LostList" :key="it.id" class="v5l-card" @click="v5OpenLost(it.id)">
              <span class="lc-pic" :style="v5ThumbStyle(it)">
                <svg v-if="!it.photos || !it.photos.length" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#ffffffcc" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 8V6.6a3 3 0 0 1 6 0V8" stroke="#ffffffcc" stroke-width="1.5" stroke-linecap="round"/></svg>
                <b v-else-if="it.photos.length > 1" class="lc-picn">{{ it.photos.length }}图</b>
              </span>
              <div class="lc-main">
                <strong>{{ it.title }}</strong>
                <small>{{ it.place }} · {{ it.time }}</small>
                <div class="lc-meta">
                  <em>{{ it.cat }}</em>
                  <span v-if="it.reward">悬赏 {{ it.reward }}</span>
                  <span v-if="it.photos && it.photos.length">📷 有图</span>
                </div>
              </div>
              <span class="lc-st" :class="{ done: it.st === '已归还' }">{{ it.st }}</span>
            </button>
          </div>

          <!-- 发布弹窗：三个板块共用同一套外观，字段按 v5BoardKey 切换 -->
          <div v-if="v5BoardKey === 'lost'" class="board-mask" @click.self="v5BoardClose">
            <div class="board-sheet">
              <header class="bs-top"><h3>发一条失物信息</h3>
                <button class="bs-x" @click="v5BoardClose"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <div class="bs-kind">
                <button :class="{ on: v5BoardDraft.kind === 'lost' }" @click="v5BoardDraft.kind = 'lost'">我丢了东西</button>
                <button :class="{ on: v5BoardDraft.kind === 'found' }" @click="v5BoardDraft.kind = 'found'">我捡到了东西</button>
              </div>
              <input v-model="v5BoardDraft.title" class="bs-in" type="text" placeholder="丢/捡到的是什么（必填）">
              <div class="bs-chips">
                <button v-for="c in v5LostCats" :key="c" :class="['bc', { on: v5BoardDraft.cat === c }]" @click="v5BoardDraft.cat = c">{{ c }}</button>
              </div>
              <p class="bs-lb">校区</p>
              <div class="bs-campus">
                <button v-for="cp in v5CampusPick" :key="cp.id" :class="['cp', { on: v5BoardDraft.campus === cp.id }]" @click="v5BoardDraft.campus = cp.id">{{ cp.label }}</button>
              </div>
              <input v-model="v5BoardDraft.place" class="bs-in" type="text" placeholder="大概在哪里丢的 / 捡到的">
              <input v-model="v5BoardDraft.reward" class="bs-in" type="text" placeholder="想给点什么感谢（选填）">
              <input v-model="v5BoardDraft.contact" class="bs-in" type="text" placeholder="怎么联系你（选填）">
              <textarea v-model="v5BoardDraft.desc" class="bs-ta" rows="3" placeholder="补充一下样子、特征，方便别人认出来"></textarea>
              <!-- 加照片：从本地选，最多 4 张 -->
              <p class="bs-lb">照片（选填，最多 4 张）</p>
              <div class="bs-photos">
                <button class="bp-add" @click="v5BoardPickPhoto">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3.6 8.6h3.2l1.5-2.4h5.4l1.5 2.4h3.2a1.1 1.1 0 0 1 1.1 1.1v8.2a1.1 1.1 0 0 1-1.1 1.1H4.7a1.1 1.1 0 0 1-1.1-1.1V9.7a1.1 1.1 0 0 1 1.1-1.1Z" stroke="#8E9187" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13.4" r="3.3" stroke="#8E9187" stroke-width="1.4"/></svg>
                  <span>加照片</span>
                </button>
                <div v-for="(p, i) in v5BoardPhotos" :key="'bp' + i" class="bp-pic" :style="{ backgroundImage: `url(${p})` }">
                  <button class="bp-x" @click="v5BoardDelPhoto(i)">×</button>
                </div>
              </div>
              <button class="bs-pub" @click="v5BoardPublish">发布</button>
            </div>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【失物 · 详情｜V5】列表卡片点进来 ============ -->
        <section v-else-if="current === 'v5-lost-detail'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('v5-lost')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>失物详情</h1>
            <span class="sub-note">{{ v5LostCur ? v5LostCur.st : '' }}</span>
          </div>
          <div v-if="v5LostCur" class="sub-body">
            <!-- 传了照片就直接用照片当封面，不再显示上面那块彩色占位盒子 -->
            <template v-if="v5LostCur.photos && v5LostCur.photos.length">
              <div class="v5d-cover" @click="v5PhotoView = v5LostCur.photos[0]">
                <img :src="v5LostCur.photos[0]" alt="实拍照片">
                <em>{{ v5LostCur.photos.length }} 张实拍</em>
              </div>
              <div v-if="v5LostCur.photos.length > 1" class="v5d-album">
                <img v-for="(p, i) in v5LostCur.photos.slice(1)" :key="v5Lostx" + i :src="p" alt="实拍照片" @click="v5PhotoView = p">
              </div>
            </template>
            <div v-else class="v5d-hero" :style="{ background: v5LostCur.ac }">
              <svg width="62" height="62" viewBox="0 0 24 24" fill="none"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#ffffffd9" stroke-width="1.3" stroke-linejoin="round"/><path d="M9 8V6.6a3 3 0 0 1 6 0V8" stroke="#ffffffd9" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
            <div class="v5d-card">
              <h2>{{ v5LostCur.title }}</h2>
              <div class="v5d-tags">
                <em>{{ v5LostCur.cat }}</em>
                <em>{{ v5LostCur.kind === 'lost' ? '找东西' : '捡到了' }}</em>
              </div>
              <p class="v5d-desc">{{ v5LostCur.desc }}</p>
              <dl class="v5d-rows">
                <div v-if="v5LostCur.campus"><dt>校区</dt><dd>{{ v5LostCur.campus }}</dd></div>
                <div><dt>地点</dt><dd>{{ v5LostCur.place }}</dd></div>
                <div><dt>时间</dt><dd>{{ v5LostCur.time }}</dd></div>
                <div><dt>发布人</dt><dd><button class="v5d-link" @click="v5OpenUser(v5LostCur.n)">{{ v5LostCur.n }} ›</button></dd></div>
                <div v-if="v5LostCur.reward"><dt>感谢</dt><dd>{{ v5LostCur.reward }}</dd></div>
                <div><dt>联系</dt><dd><button class="v5d-copy" @click="v5Copy(v5LostCur.contact)">{{ v5LostCur.contact }}<em>复制</em></button></dd></div>
              </dl>
            </div>
            <div class="v5d-cmts">
              <h3>大家的留言 ({{ v5CmtCount(v5LostCur.cmts) }})</h3>
              <div v-for="(m, i) in v5LostCur.cmts" :key="'lc' + i" class="cm-row">
                <!-- 头像和昵称都能点，进去是他的主页 -->
                <button class="ca" :style="{ background: m.ac }" @click="v5OpenUser(m.n)">{{ m.n.slice(0, 1) }}</button>
                <div class="cb">
                  <div class="ch">
                    <strong @click="v5OpenUser(m.n)">{{ m.n }}</strong>
                    <small>{{ m.t }}</small>
                  </div>
                  <p>{{ m.txt }}</p>
                  <p v-for="(r, ri) in m.replies || []" :key="'lr' + ri" class="cm-rep">
                    <b @click="v5OpenUser(r.who)">{{ r.who }}</b> 回复 <b @click="v5OpenUser(r.to)">{{ r.to }}</b>：{{ r.txt }}
                  </p>
                  <button class="cm-re" @click="v5SayTo(m)">回复</button>
                </div>
                <button :class="['cl', { on: m.liked }]" @click="v5FeedLikeCmt(m)">
                  <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ m.like }}
                </button>
              </div>
              <p v-if="!v5LostCur.cmts.length" class="cm-none">还没有人留言，你可以先说一句</p>
            </div>
          </div>
          <!-- 点底部「留言」或某条留言的「回复」，才会冒出这一条输入区 -->
          <div v-if="v5SayOpen" class="say-box">
            <input
              v-model="v5SayTxt" class="say-in" type="text"
              :placeholder="v5SayTarget ? `回复 @${v5SayTarget.n}` : '给发布人留句话'"
              @keyup.enter="v5SaySend(v5LostCur)">
            <button class="say-x" @click="v5SayCancel">取消</button>
            <button class="say-send" @click="v5SaySend(v5LostCur)">发送</button>
          </div>
          <div v-if="v5LostCur" class="act-bar">
            <button class="ab-ico" @click="v5SayTo(null)">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20.4 12.4c0 3.9-3.8 7-8.4 7-1 0-2-.15-2.9-.42L4.4 20.6l1.5-3.5A6.5 6.5 0 0 1 3.6 12.4c0-3.9 3.8-7 8.4-7s8.4 3.1 8.4 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 12.2h6.4M8.8 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span>留言</span>
              <i class="ab-n">{{ v5CmtCount(v5LostCur.cmts) }}</i>
            </button>
            <button :class="['ab-ico', { on: v5IsFav('lost' + v5LostCur.id) }]" @click="v5FavToggle(v5LostCur, 'lost')">
              <svg width="17" height="17" viewBox="0 0 24 24" :fill="v5IsFav('lost' + v5LostCur.id) ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              <span>{{ v5IsFav('lost' + v5LostCur.id) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="ab-ghost ab-copy" @click="v5Copy(v5LostCur.contact)">复制联系</button>
            <button class="ab-main" @click="v5Copy(v5LostCur.contact)">联系对方</button>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【闲置小铺｜V5】校园页第二个板块 ============ -->
        <section v-else-if="current === 'v5-market'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('campus')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>闲置小铺</h1>
            <button class="sub-add" @click="v5BoardReset('market')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
              发布
            </button>
          </div>
          <div class="sub-body">
            <div class="v5l-campus">
              <button v-for="cp in v5Campuses" :key="cp.id" :class="['cp', { on: v5MarketCampus === cp.id }]" @click="v5MarketCampus = cp.id">
                {{ cp.short }}<i>{{ v5Count(v5MarketAll, cp.id) }}</i>
              </button>
            </div>
            <p class="v5l-lead">毕业带不走的，都可以在这里换个主人</p>
            <div class="v5l-chips">
              <button v-for="c in v5MarketCats" :key="c" :class="['vt', { on: v5MarketCat === c }]" @click="v5MarketCat = c">{{ c }}</button>
            </div>
            <button v-for="it in v5MarketList" :key="it.id" class="v5l-card market" @click="v5OpenMarket(it.id)">
              <span class="lc-pic" :style="v5ThumbStyle(it)">
                <svg v-if="!it.photos || !it.photos.length" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8.6 4.2 4.4 6.2l1.7 4 2-1v9.4a1 1 0 0 0 1 1h6.8a1 1 0 0 0 1-1V9.2l2 1 1.7-4-4.2-2" stroke="#ffffffcc" stroke-width="1.5" stroke-linejoin="round"/></svg>
                <b v-else-if="it.photos.length > 1" class="lc-picn">{{ it.photos.length }}图</b>
              </span>
              <div class="lc-main">
                <strong>{{ it.title }}</strong>
                <small>{{ it.cond }} · {{ it.place }}</small>
                <div class="lc-meta">
                  <em>{{ it.cat }}</em>
                  <!-- 已预定 / 已抢光 在列表里就能看出来，不用点进去 -->
                  <b v-if="it.st !== '在售'" :class="['lc-taken', { out: it.st === '已抢光' }]">{{ it.st }}</b>
                  <span class="old">¥{{ it.old }}</span>
                  <span v-if="it.photos && it.photos.length">📷 有图</span>
                </div>
              </div>
              <span class="lc-price">¥{{ it.price }}</span>
            </button>
          </div>

          <div v-if="v5BoardKey === 'market'" class="board-mask" @click.self="v5BoardClose">
            <div class="board-sheet">
              <header class="bs-top"><h3>出一件闲置</h3>
                <button class="bs-x" @click="v5BoardClose"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <input v-model="v5BoardDraft.title" class="bs-in" type="text" placeholder="要出的是什么（必填）">
              <div class="bs-chips">
                <button v-for="c in v5MarketCats.filter((x) => x !== '全部')" :key="c" :class="['bc', { on: v5BoardDraft.cat === c }]" @click="v5BoardDraft.cat = c">{{ c }}</button>
              </div>
              <div class="bs-two">
                <input v-model="v5BoardDraft.price" class="bs-in" type="text" placeholder="想卖多少">
                <input v-model="v5BoardDraft.old" class="bs-in" type="text" placeholder="原价多少">
              </div>
              <div class="bs-chips">
                <button v-for="c in ['全新', '九五成新', '九成新', '八成新', '七成新']" :key="c" :class="['bc', { on: v5BoardDraft.cond === c }]" @click="v5BoardDraft.cond = c">{{ c }}</button>
              </div>
              <p class="bs-lb">校区</p>
              <div class="bs-campus">
                <button v-for="cp in v5CampusPick" :key="cp.id" :class="['cp', { on: v5BoardDraft.campus === cp.id }]" @click="v5BoardDraft.campus = cp.id">{{ cp.label }}</button>
              </div>
              <input v-model="v5BoardDraft.place" class="bs-in" type="text" placeholder="自提地点">
              <input v-model="v5BoardDraft.contact" class="bs-in" type="text" placeholder="怎么联系你（选填）">
              <textarea v-model="v5BoardDraft.desc" class="bs-ta" rows="3" placeholder="说说成色和入手渠道，别人买得放心"></textarea>
              <!-- 加照片：从本地选，最多 4 张 -->
              <p class="bs-lb">照片（选填，最多 4 张）</p>
              <div class="bs-photos">
                <button class="bp-add" @click="v5BoardPickPhoto">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3.6 8.6h3.2l1.5-2.4h5.4l1.5 2.4h3.2a1.1 1.1 0 0 1 1.1 1.1v8.2a1.1 1.1 0 0 1-1.1 1.1H4.7a1.1 1.1 0 0 1-1.1-1.1V9.7a1.1 1.1 0 0 1 1.1-1.1Z" stroke="#8E9187" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13.4" r="3.3" stroke="#8E9187" stroke-width="1.4"/></svg>
                  <span>加照片</span>
                </button>
                <div v-for="(p, i) in v5BoardPhotos" :key="'bp' + i" class="bp-pic" :style="{ backgroundImage: `url(${p})` }">
                  <button class="bp-x" @click="v5BoardDelPhoto(i)">×</button>
                </div>
              </div>
              <button class="bs-pub" @click="v5BoardPublish">上架</button>
            </div>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【闲置 · 详情｜V5】 ============ -->
        <section v-else-if="current === 'v5-market-detail'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('v5-market')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>闲置详情</h1>
            <span class="sub-note">{{ v5MarketCur ? v5MarketCur.st : '' }}</span>
          </div>
          <div v-if="v5MarketCur" class="sub-body">
            <!-- 传了照片就直接用照片当封面，不再显示上面那块彩色占位盒子 -->
            <template v-if="v5MarketCur.photos && v5MarketCur.photos.length">
              <div class="v5d-cover" @click="v5PhotoView = v5MarketCur.photos[0]">
                <img :src="v5MarketCur.photos[0]" alt="实拍照片">
                <em>{{ v5MarketCur.photos.length }} 张实拍</em>
              </div>
              <div v-if="v5MarketCur.photos.length > 1" class="v5d-album">
                <img v-for="(p, i) in v5MarketCur.photos.slice(1)" :key="v5Markx" + i :src="p" alt="实拍照片" @click="v5PhotoView = p">
              </div>
            </template>
            <div v-else class="v5d-hero" :style="{ background: v5MarketCur.ac }">
              <svg width="62" height="62" viewBox="0 0 24 24" fill="none"><path d="M8.6 4.2 4.4 6.2l1.7 4 2-1v9.4a1 1 0 0 0 1 1h6.8a1 1 0 0 0 1-1V9.2l2 1 1.7-4-4.2-2" stroke="#ffffffd9" stroke-width="1.3" stroke-linejoin="round"/></svg>
            </div>
            <div class="v5d-card">
              <h2>{{ v5MarketCur.title }}</h2>
              <div class="v5d-price">
                <b>¥{{ v5MarketCur.price }}</b>
                <s>¥{{ v5MarketCur.old }}</s>
                <em>{{ v5MarketCur.cond }}</em>
              </div>
              <p class="v5d-desc">{{ v5MarketCur.desc }}</p>
              <dl class="v5d-rows">
                <div><dt>分类</dt><dd>{{ v5MarketCur.cat }}</dd></div>
                <div v-if="v5MarketCur.campus"><dt>校区</dt><dd>{{ v5MarketCur.campus }}</dd></div>
                <div><dt>自提</dt><dd>{{ v5MarketCur.place }}</dd></div>
                <div><dt>卖家</dt><dd><button class="v5d-link" @click="v5OpenUser(v5MarketCur.n)">{{ v5MarketCur.n }} ›</button></dd></div>
                <div><dt>联系</dt><dd><button class="v5d-copy" @click="v5Copy(v5MarketCur.contact)">{{ v5MarketCur.contact }}<em>复制</em></button></dd></div>
              </dl>
            </div>
            <div class="v5d-cmts">
              <h3>大家的留言 ({{ v5CmtCount(v5MarketCur.cmts) }})</h3>
              <div v-for="(m, i) in v5MarketCur.cmts" :key="'mc' + i" class="cm-row">
                <button class="ca" :style="{ background: m.ac }" @click="v5OpenUser(m.n)">{{ m.n.slice(0, 1) }}</button>
                <div class="cb">
                  <div class="ch">
                    <strong @click="v5OpenUser(m.n)">{{ m.n }}</strong>
                    <small>{{ m.t }}</small>
                  </div>
                  <p>{{ m.txt }}</p>
                  <p v-for="(r, ri) in m.replies || []" :key="'mr' + ri" class="cm-rep">
                    <b @click="v5OpenUser(r.who)">{{ r.who }}</b> 回复 <b @click="v5OpenUser(r.to)">{{ r.to }}</b>：{{ r.txt }}
                  </p>
                  <button class="cm-re" @click="v5SayTo(m)">回复</button>
                </div>
                <button :class="['cl', { on: m.liked }]" @click="v5FeedLikeCmt(m)">
                  <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ m.like }}
                </button>
              </div>
              <p v-if="!v5MarketCur.cmts.length" class="cm-none">还没有人留言，你可以先问一句</p>
            </div>
          </div>
          <div v-if="v5SayOpen" class="say-box">
            <input
              v-model="v5SayTxt" class="say-in" type="text"
              :placeholder="v5SayTarget ? `回复 @${v5SayTarget.n}` : '给卖家留句话'"
              @keyup.enter="v5SaySend(v5MarketCur)">
            <button class="say-x" @click="v5SayCancel">取消</button>
            <button class="say-send" @click="v5SaySend(v5MarketCur)">发送</button>
          </div>
          <div v-if="v5MarketCur" class="act-bar">
            <button class="ab-ico" @click="v5SayTo(null)">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20.4 12.4c0 3.9-3.8 7-8.4 7-1 0-2-.15-2.9-.42L4.4 20.6l1.5-3.5A6.5 6.5 0 0 1 3.6 12.4c0-3.9 3.8-7 8.4-7s8.4 3.1 8.4 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 12.2h6.4M8.8 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span>留言</span>
              <i class="ab-n">{{ v5CmtCount(v5MarketCur.cmts) }}</i>
            </button>
            <button :class="['ab-ico', { on: v5IsFav('market' + v5MarketCur.id) }]" @click="v5FavToggle(v5MarketCur, 'market')">
              <svg width="17" height="17" viewBox="0 0 24 24" :fill="v5IsFav('market' + v5MarketCur.id) ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              <span>{{ v5IsFav('market' + v5MarketCur.id) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="ab-ghost ab-copy" @click="v5Copy(v5MarketCur.contact)">复制联系</button>
            <button :class="['ab-main', { off: v5MarketAct.off }]" @click="v5MarketAct.go">{{ v5MarketAct.t }}</button>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【搭把手｜V5】校园页第三个板块 ============ -->
        <section v-else-if="current === 'v5-help'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('campus')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>搭把手</h1>
            <button class="sub-add" @click="v5BoardReset('help')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
              发布
            </button>
          </div>
          <div class="sub-body">
            <div class="v5l-campus">
              <button v-for="cp in v5Campuses" :key="cp.id" :class="['cp', { on: v5HelpCampus === cp.id }]" @click="v5HelpCampus = cp.id">
                {{ cp.short }}<i>{{ v5Count(v5HelpAll, cp.id) }}</i>
              </button>
            </div>
            <div class="v5l-tabs">
              <button v-for="tb in v5HelpTabs" :key="tb.id" :class="['vt', { on: v5HelpTab === tb.id }]" @click="v5HelpTab = tb.id">{{ tb.label }}</button>
            </div>
            <p class="v5l-lead">{{ v5HelpTab === 'need' ? '谁顺手能帮一把，接一单' : '这些同学说他们能帮，直接找他们' }}</p>
            <button v-for="it in v5HelpList" :key="it.id" class="v5l-card" @click="v5OpenHelp(it.id)">
              <span class="lc-pic" :style="v5ThumbStyle(it)">
                <svg v-if="!it.photos || !it.photos.length" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 12.6V19a1.4 1.4 0 0 0 1.4 1.4h5.2A1.4 1.4 0 0 0 16 19v-6.4" stroke="#ffffffcc" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 3.4v9.2" stroke="#ffffffcc" stroke-width="1.5" stroke-linecap="round"/></svg>
                <b v-else-if="it.photos.length > 1" class="lc-picn">{{ it.photos.length }}图</b>
              </span>
              <div class="lc-main">
                <strong>{{ it.title }}</strong>
                <small>{{ it.place }} · {{ it.time }}</small>
                <div class="lc-meta"><em>{{ it.cat }}</em><b v-if="it.st === '已接单'" class="lc-taken">已接单</b><span v-if="it.photos && it.photos.length">📷 有图</span></div>
              </div>
              <span class="lc-fee">{{ it.fee ? '¥' + it.fee : '随缘' }}</span>
            </button>
          </div>

          <div v-if="v5BoardKey === 'help'" class="board-mask" @click.self="v5BoardClose">
            <div class="board-sheet">
              <header class="bs-top"><h3>发一条互助</h3>
                <button class="bs-x" @click="v5BoardClose"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <div class="bs-kind">
                <button :class="{ on: v5BoardDraft.kind === 'need' }" @click="v5BoardDraft.kind = 'need'">求助中</button>
                <button :class="{ on: v5BoardDraft.kind === 'can' }" @click="v5BoardDraft.kind = 'can'">可提供帮助</button>
              </div>
              <input v-model="v5BoardDraft.title" class="bs-in" type="text" placeholder="需要帮什么（必填）">
              <div class="bs-chips">
                <button v-for="c in v5HelpKinds" :key="c" :class="['bc', { on: v5BoardDraft.cat === c }]" @click="v5BoardDraft.cat = c">{{ c }}</button>
              </div>
              <!-- 校区独占一行，下面才是 地点 / 时间 两个并排输入框，别再挤到一行去 -->
              <p class="bs-lb">校区</p>
              <div class="bs-campus">
                <button v-for="cp in v5CampusPick" :key="cp.id" :class="['cp', { on: v5BoardDraft.campus === cp.id }]" @click="v5BoardDraft.campus = cp.id">{{ cp.label }}</button>
              </div>
              <div class="bs-two">
                <input v-model="v5BoardDraft.place" class="bs-in" type="text" placeholder="地点">
                <input v-model="v5BoardDraft.time" class="bs-in" type="text" placeholder="时间">
              </div>
              <input v-model="v5BoardDraft.fee" class="bs-in" type="text" placeholder="愿意给多少（不填就是随缘）">
              <input v-model="v5BoardDraft.contact" class="bs-in" type="text" placeholder="怎么联系你（选填）">
              <textarea v-model="v5BoardDraft.desc" class="bs-ta" rows="3" placeholder="说清楚一点，别人好判断能不能帮"></textarea>
              <!-- 加照片：从本地选，最多 4 张 -->
              <p class="bs-lb">照片（选填，最多 4 张）</p>
              <div class="bs-photos">
                <button class="bp-add" @click="v5BoardPickPhoto">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3.6 8.6h3.2l1.5-2.4h5.4l1.5 2.4h3.2a1.1 1.1 0 0 1 1.1 1.1v8.2a1.1 1.1 0 0 1-1.1 1.1H4.7a1.1 1.1 0 0 1-1.1-1.1V9.7a1.1 1.1 0 0 1 1.1-1.1Z" stroke="#8E9187" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13.4" r="3.3" stroke="#8E9187" stroke-width="1.4"/></svg>
                  <span>加照片</span>
                </button>
                <div v-for="(p, i) in v5BoardPhotos" :key="'bp' + i" class="bp-pic" :style="{ backgroundImage: `url(${p})` }">
                  <button class="bp-x" @click="v5BoardDelPhoto(i)">×</button>
                </div>
              </div>
              <button class="bs-pub" @click="v5BoardPublish">发布</button>
            </div>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【搭把手 · 详情｜V5】 ============ -->
        <section v-else-if="current === 'v5-help-detail'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('v5-help')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>互助详情</h1>
            <span class="sub-note">{{ v5HelpCur ? v5HelpCur.st : '' }}</span>
          </div>
          <div v-if="v5HelpCur" class="sub-body">
            <!-- 传了照片就直接用照片当封面，不再显示上面那块彩色占位盒子 -->
            <template v-if="v5HelpCur.photos && v5HelpCur.photos.length">
              <div class="v5d-cover" @click="v5PhotoView = v5HelpCur.photos[0]">
                <img :src="v5HelpCur.photos[0]" alt="实拍照片">
                <em>{{ v5HelpCur.photos.length }} 张实拍</em>
              </div>
              <div v-if="v5HelpCur.photos.length > 1" class="v5d-album">
                <img v-for="(p, i) in v5HelpCur.photos.slice(1)" :key="v5Helpx" + i :src="p" alt="实拍照片" @click="v5PhotoView = p">
              </div>
            </template>
            <div v-else class="v5d-hero" :style="{ background: v5HelpCur.ac }">
              <svg width="62" height="62" viewBox="0 0 24 24" fill="none"><path d="M8 12.6V19a1.4 1.4 0 0 0 1.4 1.4h5.2A1.4 1.4 0 0 0 16 19v-6.4" stroke="#ffffffd9" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 3.4v9.2" stroke="#ffffffd9" stroke-width="1.3" stroke-linecap="round"/><path d="M12 3.4c1.6-1.6 3.4-2 4.6-1.8.4 2.2-.6 3.6-1.8 4.6M12 3.4c-1.6-1.6-3.4-2-4.6-1.8-.4 2.2.6 3.6 1.8 4.6" stroke="#ffffffd9" stroke-width="1.3" stroke-linecap="round"/></svg>
            </div>
            <div class="v5d-card">
              <!-- 有人接单后这里常驻一条订单入口，双方点进去是同一份订单 -->
              <div v-if="v5HelpOrder" class="v5d-order" @click="v5OpenOrder(v5HelpCur.id)">
                <span class="vo-st" :class="v5HelpOrder.st">{{ v5OrderStatus[v5HelpOrder.st] }}</span>
                <span class="vo-txt">{{ v5HelpOrder.taker }} 接了这单 · {{ v5HelpOrder.no }}</span>
                <b>查看订单 ›</b>
              </div>
              <h2>{{ v5HelpCur.title }}</h2>
              <div class="v5d-price">
                <b>{{ v5HelpCur.fee ? '¥' + v5HelpCur.fee : '随缘' }}</b>
                <em>{{ v5HelpCur.cat }}</em>
                <em>{{ v5HelpCur.kind === 'need' ? '求助中' : '可提供帮助' }}</em>
              </div>
              <p class="v5d-desc">{{ v5HelpCur.desc }}</p>
              <dl class="v5d-rows">
                <div v-if="v5HelpCur.campus"><dt>校区</dt><dd>{{ v5HelpCur.campus }}</dd></div>
                <div><dt>地点</dt><dd>{{ v5HelpCur.place }}</dd></div>
                <div><dt>时间</dt><dd>{{ v5HelpCur.time }}</dd></div>
                <div><dt>发起人</dt><dd><button class="v5d-link" @click="v5OpenUser(v5HelpCur.n)">{{ v5HelpCur.n }} ›</button></dd></div>
                <div><dt>联系</dt><dd><button class="v5d-copy" @click="v5Copy(v5HelpCur.contact)">{{ v5HelpCur.contact }}<em>复制</em></button></dd></div>
              </dl>
            </div>
            <div class="v5d-cmts">
              <h3>大家的留言 ({{ v5CmtCount(v5HelpCur.cmts) }})</h3>
              <div v-for="(m, i) in v5HelpCur.cmts" :key="'hc' + i" class="cm-row">
                <button class="ca" :style="{ background: m.ac }" @click="v5OpenUser(m.n)">{{ m.n.slice(0, 1) }}</button>
                <div class="cb">
                  <div class="ch">
                    <strong @click="v5OpenUser(m.n)">{{ m.n }}</strong>
                    <small>{{ m.t }}</small>
                  </div>
                  <p>{{ m.txt }}</p>
                  <p v-for="(r, ri) in m.replies || []" :key="'hr' + ri" class="cm-rep">
                    <b @click="v5OpenUser(r.who)">{{ r.who }}</b> 回复 <b @click="v5OpenUser(r.to)">{{ r.to }}</b>：{{ r.txt }}
                  </p>
                  <button class="cm-re" @click="v5SayTo(m)">回复</button>
                </div>
                <button :class="['cl', { on: m.liked }]" @click="v5FeedLikeCmt(m)">
                  <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ m.like }}
                </button>
              </div>
              <p v-if="!v5HelpCur.cmts.length" class="cm-none">还没有人留言，你可以先问一句</p>
            </div>
          </div>
          <!-- 点底部「留言」或某条留言的「回复」，才会冒出这一条输入区 -->
          <div v-if="v5SayOpen" class="say-box">
            <input
              v-model="v5SayTxt" class="say-in" type="text"
              :placeholder="v5SayTarget ? `回复 @${v5SayTarget.n}` : '给发布人留句话'"
              @keyup.enter="v5SaySend(v5HelpCur)">
            <button class="say-x" @click="v5SayCancel">取消</button>
            <button class="say-send" @click="v5SaySend(v5HelpCur)">发送</button>
          </div>
          <!-- 底部四个功能：留言 / 收藏 / 复制联系 / 接单（接完就变查看订单） -->
          <div v-if="v5HelpCur" class="act-bar">
            <button class="ab-ico" @click="v5SayTo(null)">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20.4 12.4c0 3.9-3.8 7-8.4 7-1 0-2-.15-2.9-.42L4.4 20.6l1.5-3.5A6.5 6.5 0 0 1 3.6 12.4c0-3.9 3.8-7 8.4-7s8.4 3.1 8.4 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 12.2h6.4M8.8 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              <span>留言</span>
              <i class="ab-n">{{ v5CmtCount(v5HelpCur.cmts) }}</i>
            </button>
            <button :class="['ab-ico', { on: v5IsFav('help' + v5HelpCur.id) }]" @click="v5FavToggle(v5HelpCur, 'help')">
              <svg width="17" height="17" viewBox="0 0 24 24" :fill="v5IsFav('help' + v5HelpCur.id) ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              <span>{{ v5IsFav('help' + v5HelpCur.id) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="ab-ghost ab-copy" @click="v5Copy(v5HelpCur.contact)">复制联系</button>
            <button :class="['ab-main', { off: v5HelpAct.off }]" @click="v5HelpAct.go">{{ v5HelpAct.t }}</button>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【用户主页｜V5】点任何头像进来 ============ -->
        <section v-else-if="current === 'v5-user'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('campus')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>{{ v5UserCur }}</h1>
            <button
              class="sub-act"
              @click="v5Reported('user:' + v5UserCur) ? v5BoardSay('已经投诉过了，处理中') : v5ReportUser(v5UserCur)">
              {{ v5Reported('user:' + v5UserCur) ? '已投诉' : '···' }}
            </button>
          </div>
          <div class="sub-body">
            <div class="up-card">
              <span class="up-ava" :style="{ background: v5UserInfo.ac }">{{ v5UserCur.slice(0, 1) }}</span>
              <strong>{{ v5UserCur }}</strong>
              <small>{{ v5UserInfo.campus }} · {{ v5UserInfo.cls }}</small>
              <p class="up-bio">{{ v5UserInfo.bio }}</p>
              <div class="up-tags"><em v-for="t in v5UserInfo.tags" :key="t">{{ t }}</em></div>
              <div class="up-stats">
                <span><b>{{ v5UserInfo.posted }}</b><i>发布</i></span>
                <span><b>{{ v5UserInfo.helped }}</b><i>帮过</i></span>
                <span>
                  <b>{{ v5UserRate.n ? v5UserRate.score.toFixed(1) : '—' }}</b>
                  <i>评分{{ v5UserRate.n ? ` · ${v5UserRate.n} 人` : '' }}</i>
                </span>
              </div>
            </div>

            <!-- 评分下面：别人给他的评价都列出来，分数就是这些打出来的 -->
            <div class="up-rate">
              <h3>大家给{{ v5UserCur === '我' ? '我' : v5UserCur }}的评价 <i>{{ v5UserRate.n }}</i></h3>
              <template v-if="v5UserRate.n">
                <div class="ur-head">
                  <b>{{ v5UserRate.score.toFixed(1) }}</b>
                  <span>{{ '★'.repeat(Math.round(v5UserRate.score)) }}</span>
                  <em>被 {{ v5UserRate.n }} 位同学评价过</em>
                </div>
                <div v-for="(r, i) in v5UserRate.list.slice(0, 3)" :key="'ur' + i" class="ur-row">
                  <div class="ur-top">
                    <strong @click="v5OpenUser(r.by)">{{ r.by }}</strong>
                    <span>{{ '★'.repeat(r.star) }}</span>
                    <small>{{ r.t }}</small>
                  </div>
                  <p>{{ r.txt || '（没写评价）' }}</p>
                </div>
              </template>
              <p v-else class="cm-none">还没有人给他评价过</p>
            </div>

            <div class="up-act">
              <button :class="['up-follow', { on: v5UserFollowed.has(v5UserCur) }]" @click="v5UserFollow(v5UserCur)">
                {{ v5UserFollowed.has(v5UserCur) ? '已关注' : '关注' }}
              </button>
            </div>

            <h2 class="up-sub">他发的内容 <i>{{ v5UserPosts.length }}</i></h2>
            <p v-if="!v5UserPosts.length" class="cm-none">还没有在校园里发过东西</p>
            <article v-for="p in v5UserPosts" :key="p.board + p.id" class="mp-row" @click="v5MyPostOpen(p)">
              <span class="mp-ico" :style="{ background: p.ac }" v-html="v5Icon(p.ico, 22)"></span>
              <div class="mp-main">
                <div class="mp-top">
                  <span class="mp-st" :class="v5MyPostTone(p.st)">{{ p.st }}</span>
                  <strong>{{ p.title }}</strong>
                </div>
                <p class="mp-where">
                  <template v-if="p.board === 'feed'">
                    {{ v5TypeTint[p.type].label }} · {{ p.t }}
                  </template>
                  <template v-else>
                    {{ p.campus }} · {{ p.place }}<template v-if="p.time"> · {{ p.time }}</template>
                  </template>
                </p>
                <div class="mp-foot">
                  <em>{{ p.boardLabel }}</em>
                  <span>{{ v5MyPostNote(p) }}</span>
                  <b v-if="p.fee">报酬 ¥{{ p.fee }}</b>
                  <b v-else-if="p.price">¥{{ p.price }}</b>
                </div>
              </div>
              <span class="mp-go">›</span>
            </article>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【校园服务｜Wise 新版】 ============ -->
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

        <!-- ============ 【校园服务｜原版】 ============ -->
        <section v-else-if="current === 'campus'" class="screen campus-real"><header><h1>校园</h1></header><div class="campus-photo"><img src="/assets/screenshot-crops/campus-scene.jpg" alt="校园实景与寄语"></div><h2>校园服务</h2><button class="service-card" @click="selectScene('library')"><img src="/assets/library.png"><strong>图书馆</strong><p>看实景、桌椅与设施，找到合适的学习空间</p></button><button class="service-card disabled"><img src="/assets/star.png"><strong>庆快画廊</strong><span>开发中</span><p>正在准备中，敬请期待</p></button><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <!-- ============ 【图书馆｜Wise 新版】空间列表 + 筛选 ============ -->
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

        <!-- ============ 【图书馆｜原版】 ============ -->
        <section v-else-if="current === 'library'" class="screen library-real"><header class="native-head"><button @click="selectScene('campus')">‹</button><h1>图书馆</h1></header><div class="lib-hero"><small>LIBRARY GUIDE</small><h1>先看看，再选个好位置</h1><p>实景、桌椅、设施，一起看清楚。</p><nav><button class="active">研讨室</button><button>自习座位</button><button>我的收藏</button></nav></div><div class="lib-body"><section class="library-filter-card"><div class="selects"><span>黄埔校区⌄</span><span>黄埔分馆（B1）栋⌄</span></div><label class="real-search"><img src="/assets/search.png"><span>搜房间名、位置或设施</span></label><div class="capacity"><span class="active">不限人数</span><span>至少 4 人</span><span>至少 6 人</span><span>至少 8 人</span></div></section><div class="menu-heading"><strong>看看空间的样子</strong><span>18 个空间</span></div><p class="library-note">这里展示空间资料与同学反馈，实时空位和预约结果请以图书馆系统为准。</p><article class="space-card"><div class="photo-placeholder">▤<br><small>实景照片待补充</small></div><section><header><h3>冥想室（416）</h3><b>2 人容量</b></header><p>具体位置待补充</p><small>桌椅布局与空间介绍待补充</small><footer>暂无环境评价 <b>看实景与详情 →</b></footer></section></article></div></section>

        <!-- ============ 【我的收藏｜V5】三个分类：店铺 / 小摊 / 图书馆 ============ -->
        <section v-else-if="current === 'favorites' && design === 'v5'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back(v5FavBack)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>我的收藏</h1>
            <div class="capsule">
              <span class="c-dots"><svg width="20" height="8" viewBox="0 0 20 8" fill="#1A1D21"><circle cx="2" cy="4" r="2"/><circle cx="10" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg></span>
              <span class="c-div"></span>
              <span class="c-plus"><svg width="12" height="12" viewBox="0 0 12 12" stroke="#1A1D21" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="6" cy="6" r="5.2"/><path d="M6 3.6v4.8M3.6 6h4.8"/></svg></span>
            </div>
          </div>
          <div class="sub-body">
            <div class="list-meta">
              <span>喜欢的，都在这里</span>
              <span class="fav-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3B8A73" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5-6 2.5V6.5Z"/><path d="M9 4v13.5M15 6.5V20"/></svg>
                地图
              </span>
            </div>
            <!-- 分类切换：前面三个是原来的，最后「其他」收的是校园板块里收藏的东西 -->
            <div class="seg fav-seg">
              <button v-for="k in v5FavTabs" :key="k"
                      :class="{ on: v5FavTab === k }" @click="v5FavTab = k">
                {{ k === 'other' ? '其他' : v5FavType[k] }}{{ k === 'other' ? ' ' + v5FavOther.length : ' ' + v5Favorites[k].length }}
              </button>
            </div>
            <div class="list-meta">
              <span>共 {{ v5FavTab === 'other' ? v5FavOther.length : v5FavItems.length }} 个收藏</span>
              <span class="fav-link">管理</span>
            </div>

            <!-- 校园板块里收藏的任务 / 闲置 / 失物，统一放在「其他」里 -->
            <template v-if="v5FavTab === 'other'">
              <template v-if="v5FavOther.length">
                <div class="cardbox fav-other">
                  <div v-for="row in v5FavOther" :key="row.board + row.it.id" class="fv-row" @click="v5OpenFavBoard(row)">
                    <span class="thumb fo-ico" :style="{ background: row.tint }" v-html="v5Icon(row.ico, 24)"></span>
                    <span class="fi">
                      <h3>{{ row.it.title }}</h3>
                      <span class="tm">{{ row.label }} · {{ row.it.campus || '大学城校区' }} · {{ row.it.place }}</span>
                      <span class="sc">
                        <i class="pill">{{ row.it.st }}</i>
                        <template v-if="row.board === 'market'">¥{{ row.it.price }}</template>
                        <template v-else-if="row.board === 'help'">{{ row.it.fee ? '¥' + row.it.fee : '随缘' }}</template>
                        <template v-else>{{ row.it.cat }}</template>
                      </span>
                    </span>
                    <span class="side">
                      <span class="tp">{{ row.label }}</span>
                      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#C9CDD1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                  </div>
                </div>
              </template>
              <div v-else class="fav-empty">{{ v5FavEmptyOther }}</div>
            </template>

            <template v-else-if="v5FavItems.length">
              <div class="cardbox">
                <div v-for="s in v5FavItems" :key="s.name" class="fv-row" @click="v5OpenShop(s)">
                  <img class="thumb" :src="asset(s.img)" :alt="s.name">
                  <span class="fi">
                    <h3>{{ s.name }}</h3>
                    <span class="tm">{{ s.time }}</span>
                    <span class="sc"><i class="pill">★ {{ s.rating.toFixed(1) }}</i>{{ s.people }} 人评分</span>
                  </span>
                  <span class="side">
                    <span class="tp">{{ v5FavType[v5FavTab] }}</span>
                    <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#C9CDD1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </span>
                </div>
              </div>
            </template>
            <div v-else class="fav-empty">{{ v5FavEmpty[v5FavTab] }}</div>
          </div>
        </section>

        <!-- ============ 【店铺收藏｜Wise 新版】可管理、可取消 ============ -->
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

        <!-- ============ 【店铺收藏｜原版】 ============ -->
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

        <!-- ============ 【好友｜Wise 新版】 ============ -->
        <!-- ============ 【交友｜V5】底部「交友」进入 ============ -->
        <!-- 好友动态：灵感 / MBTI / 找搭子 / 日常 四种类型，都能点赞评论 -->
        <!-- ============ 【动态 · 详情｜V5】交友里点某条帖子进来 ============ -->
        <section v-else-if="current === 'v5-feed-detail'" class="screen v5-tab-page">
          <div class="tab-head detail">
            <button class="tb-back" aria-label="返回" @click="v5Back('friends')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="#20242B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>{{ v5FeedCur ? v5TypeTint[v5FeedCur.type].label : '动态' }}</h1>
            <button
              v-if="v5FeedCur"
              class="sub-act"
              @click="v5Reported('feed:' + v5FeedCur.id) ? v5BoardSay('已经投诉过了，处理中') : v5ReportFeed(v5FeedCur)">
              {{ v5Reported('feed:' + v5FeedCur.id) ? '已投诉' : '投诉' }}
            </button>
          </div>

          <div class="fdt-body" v-if="v5FeedCur">
            <div class="fdt-head">
              <button class="fd-ava" :style="{ background: v5FeedCur.ac }" @click="v5OpenUser(v5FeedCur.n)">{{ v5FeedCur.n.slice(0, 1) }}</button>
              <div class="fdc-who">
                <strong @click="v5OpenUser(v5FeedCur.n)">{{ v5FeedCur.n }}</strong>
                <small>{{ v5FeedCur.t }} · 来自{{ v5TypeTint[v5FeedCur.type].label }}</small>
              </div>
              <em class="fdc-type" :style="{ background: v5TypeTint[v5FeedCur.type].bg, color: v5TypeTint[v5FeedCur.type].ink }">
                {{ v5FeedCur.type === 'mbti' ? v5FeedCur.mbti : v5FeedCur.cat }}
              </em>
            </div>

            <h2 class="fdt-title">{{ v5FeedCur.title }}</h2>
            <p class="fdt-text">{{ v5FeedCur.body }}</p>

            <div v-if="v5FeedCur.type === 'mbti'" class="fdc-mbti">
              <b>{{ v5FeedCur.mbti }}</b>
              <div>
                <strong>{{ v5FeedCur.mbtiName }}</strong>
                <small>{{ v5FeedCur.mbtiDesc || '测一测，看看食堂会给你推什么' }}</small>
              </div>
              <button @click="v5Nav('v5-mbti')">去测 ›</button>
            </div>

            <div class="fdt-acts">
              <button :class="['fa', { on: v5FeedCur.liked }]" @click="v5FeedLikePost(v5FeedCur)">
                <svg width="15" height="15" viewBox="0 0 24 24" :fill="v5FeedCur.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                {{ v5FeedCur.like }}
              </button>
              <button class="fa">💬 {{ v5FeedCur.comments.length }} 条评论</button>
            </div>

            <div class="fdt-cmts">
              <h3>大家的评论 ({{ v5FeedCur.comments.length }})</h3>
              <div v-for="(m, i) in v5FeedCur.comments" :key="'fdc' + i" class="cm-row">
                <button class="ca" :style="{ background: m.ac }" @click="v5OpenUser(m.n)">{{ m.n.slice(0, 1) }}</button>
                <div class="cb">
                  <div class="ch"><strong @click="v5OpenUser(m.n)">{{ m.n }}</strong><small>{{ m.t }}</small></div>
                  <p>{{ m.txt }}</p>
                </div>
                <button :class="['cl', { on: m.liked }]" @click="v5FeedLikeCmt(m)">
                  <svg width="13" height="13" viewBox="0 0 24 24" :fill="m.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ m.like }}
                </button>
              </div>
              <p v-if="!v5FeedCur.comments.length" class="cm-none">还没有人评论，你可以先说一句</p>
            </div>
          </div>

          <!-- 底部评论输入条 -->
          <div class="fdt-foot">
            <input v-model="v5FeedReply" type="text" placeholder="说两句，或者问问有没有人一起…" @keyup.enter="v5FeedCurReply">
            <button @click="v5FeedCurReply">发送</button>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <section v-else-if="current === 'friends' && design === 'v5'" class="screen v5-tab-page">
          <div class="tab-head row">
            <div>
              <h1>交友</h1>
              <p>看看大家在忙什么，说两句也行</p>
            </div>
            <button class="tab-add" @click="v5FeedOpenComposer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>
              发一条
            </button>
          </div>

          <div class="fd-list">
            <div v-for="p in v5FeedList" :key="p.id" class="fd-card" @click="v5OpenFeed(p.id)">
              <div class="fdc-head">
                <button class="fd-ava" :style="{ background: p.ac }" @click.stop="v5OpenUser(p.n)">{{ p.n.slice(0, 1) }}</button>
                <div class="fdc-who">
                  <strong @click.stop="v5OpenUser(p.n)">{{ p.n }}</strong>
                  <small>{{ p.t }} · 来自{{ v5TypeTint[p.type].label }}</small>
                </div>
                <em class="fdc-type" :style="{ background: v5TypeTint[p.type].bg, color: v5TypeTint[p.type].ink }">
                  {{ p.type === 'mbti' ? p.mbti : p.cat }}
                </em>
              </div>

              <p class="fdc-title">{{ p.title }}</p>
              <p class="fdc-body">{{ p.body }}</p>

              <!-- MBTI 类型的动态会多出一张人格卡，这是小巧思 -->
              <div v-if="p.type === 'mbti'" class="fdc-mbti">
                <b>{{ p.mbti }}</b>
                <div>
                  <strong>{{ p.mbtiName }}</strong>
                  <small>{{ p.mbtiDesc || '测一测，看看食堂会给你推什么' }}</small>
                </div>
                <button @click.stop="v5Nav('v5-mbti')">去测 ›</button>
              </div>

              <div class="fdc-acts">
                <button :class="['fa', { on: p.liked }]" @click.stop="v5FeedLikePost(p)">
                  <svg width="15" height="15" viewBox="0 0 24 24" :fill="p.liked ? 'currentColor' : 'none'"><path d="M12 20.3l-1.5-1.35C6.1 14.75 3.3 12.2 3.3 9.05A4.9 4.9 0 0 1 8.2 4.15c1.5 0 2.9.67 3.8 1.73a5.06 5.06 0 0 1 3.8-1.73 4.9 4.9 0 0 1 4.9 4.9c0 3.15-2.8 5.7-7.2 9.9L12 20.3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ p.like }}
                </button>
                <button class="fa" @click.stop="v5OpenFeed(p.id)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 12.4c0 3.9-3.6 7-8 7-1 0-2-.16-2.9-.46L4.5 20.5l1.3-3.4A6.7 6.7 0 0 1 4 12.4c0-3.9 3.6-7 8-7s8 3.1 8 7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  {{ p.comments.length }}
                </button>
                <button class="fa shr" @click.stop="v5BoardSay('已复制，去粘贴给朋友吧')">分享</button>
                <button
                  :class="['fa', 'rep', { on: v5Reported('feed:' + p.id) }]"
                  @click.stop="v5Reported('feed:' + p.id) ? v5BoardSay('已经投诉过了，处理中') : v5ReportFeed(p)">
                  {{ v5Reported('feed:' + p.id) ? '已投诉' : '投诉' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 发动态弹窗：四种类型 -->
          <div v-if="v5FeedComposer" class="board-mask" @click.self="v5FeedCloseComposer">
            <div class="board-sheet">
              <header class="bs-top"><h3>发一条动态</h3>
                <button class="bs-x" @click="v5FeedCloseComposer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <div class="bs-kind">
                <button v-for="tp in v5PostTypes" :key="tp.id" :class="{ on: v5FeedType === tp.id }" @click="v5FeedType = tp.id">{{ tp.label }}</button>
              </div>
              <div v-if="v5FeedType === 'mbti'" class="bs-chips">
                <button v-for="code in v5MbtiCodes" :key="code" :class="['bc', { on: v5FeedMbti === code }]" @click="v5FeedMbti = code">{{ code }}</button>
              </div>
              <input v-model="v5FeedTitle" class="bs-in" type="text" :placeholder="v5FeedType === 'mbti' ? '说说是怎么测出来的（选填）' : v5FeedType === 'friend' ? '想找人一起做什么（必填）' : '想分享什么（必填）'">
              <textarea v-model="v5FeedBody" class="bs-ta" rows="4" placeholder="详细说说，或者喊一声求组队…"></textarea>
              <button class="bs-pub" @click="v5FeedPublish">发布</button>
            </div>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
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

        <!-- ============ 【好友｜原版】推荐 + 消息 + 好友列表 ============ -->
        <section v-else-if="current === 'friends'" class="screen friends-real"><header class="friend-profile"><div class="reference-avatar friend-avatar"></div><h1>一树山茶?</h1></header><label class="real-search"><img src="/assets/search.png"><span>点击搜索好友</span></label><section class="friend-card recommend"><header><h2>可能想认识的人</h2><button>↻ 换一批</button></header><article v-for="item in friendRecommendations" :key="item.id"><div class="avatar-placeholder"></div><div><strong>{{ item.name }}<small>({{ item.id }})</small></strong><span>为你推荐</span></div><button>关注</button></article></section><section class="friend-card idea-feed"><header><h2>好友动态</h2><span>来自灵感小盒</span></header><article v-for="(item, index) in v5IdeaFeed" :key="'fd' + index"><span class="fd-ava" :style="{ background: item.ac, color: item.anon ? '#8C8A85' : '#5E7350' }">{{ item.n.slice(0, 1) }}</span><div class="fd-main"><div class="fd-top"><strong>{{ item.n }}</strong><small>{{ item.t }}</small><em v-if="item.cat">{{ item.cat }}</em></div><p class="fd-t">{{ item.txt }}</p><p class="fd-b">{{ item.body }}</p><footer><button :class="['fd-z', { on: item.liked }]" @click="v5FeedLike(item)">♡ {{ item.like }}</button><span>💬 {{ item.cmt }}</span><b v-if="item.anon">匿名发布</b></footer></div></article></section><section class="friend-card message-box"><header><h2>消息</h2><span>清除未读</span></header><div class="message-grid"><button><IconSymbol name="likes" :size="29" />收到的赞</button><button><IconSymbol name="followers" :size="29" />新增关注</button><button><IconSymbol name="replies" :size="29" />新的回复</button><button><IconSymbol name="system" :size="29" />系统通知<i>34</i></button></div><h2>你的好友</h2><article v-for="(item, index) in friends" :key="item.name" class="friend-row"><div :class="['reference-avatar', `friend-${index}`]"></div><div><strong>{{ item.name }}</strong><small>{{ item.note }}</small></div></article></section><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <!-- ============ 【我的｜Wise 新版】 ============ -->
        <!-- ============ 【我的｜V5】底部「我的」进入 ============ -->
        <!-- 结构照参考图：用户信息 → 四列数据 → 我的收藏 → 我的工具 → 校园服务 -->
        <section v-else-if="current === 'profile' && design === 'v5'" class="screen v5-tab-page">
          <div class="my-user">
            <span class="my-ava">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.4" r="3.6" stroke="#8B877D" stroke-width="1.6"/><path d="M4.8 20.2c.6-3.6 3.6-5.8 7.2-5.8s6.6 2.2 7.2 5.8" stroke="#8B877D" stroke-width="1.6" stroke-linecap="round"/></svg>
            </span>
            <div class="my-who">
              <h1>微信用户</h1>
              <button class="my-edit">编辑个人资料 ›</button>
              <div class="my-id">
                <span>QUICK54516993.013119</span>
                <button @click="v5BoardSay('ID 已复制')">复制</button>
              </div>
            </div>
            <span class="my-age">用龄 1 年</span>
          </div>

          <div class="my-stats">
            <button v-for="s in v5MyStats" :key="s.l" @click="v5StatClick(s.l)">
              <!-- 「评分」这一格显示的是同学给我的平均分，不是我写过的评价条数 -->
              <b>{{ s.l === '评分' ? v5MyRateShow : s.n }}</b><span>{{ s.l }}</span>
              <i v-if="s.l === '粉丝' && v5NewFans" class="st-dot">{{ v5NewFans }}</i>
            </button>
          </div>

          <button class="my-fav" @click="v5OpenFav('profile')">
            <span class="mf-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.6l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 10.3l5.4-.8L12 4.6Z" stroke="#C9A05A" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </span>
            <div class="mf-txt"><strong>我的收藏</strong><small>店铺 · IC 空间</small></div>
            <i>›</i>
          </button>

          <!-- 我的消息：谁回复我 / 赞我 / 接了我的单 -->
          <!-- 上面：我发出去的东西进展如何；下面：别人给我的动静 -->
          <div class="my-inbox">
            <button class="mi-row" @click="v5OpenMyPosts">
              <span class="mi-ico" style="background:#DED8EA" v-html="v5Icon('post', 26)"></span>
              <span class="mi-txt">
                <strong>我的发布</strong>
                <small>看看自己发的任务怎么样了</small>
              </span>
              <i class="mi-num">{{ v5MyPostCount }}</i>
              <b class="mi-go">›</b>
            </button>
            <button class="mi-row" @click="v5OpenNotice">
              <span class="mi-ico" style="background:#F4E8C6" v-html="v5Icon('notice', 26)"></span>
              <span class="mi-txt">
                <strong>我的消息</strong>
                <small>回复 · 赞 · 接单，都在这里</small>
              </span>
              <i v-if="v5Unread" class="mi-dot">{{ v5Unread }}</i>
              <b class="mi-go">›</b>
            </button>
            <button class="mi-row" @click="v5OpenOrders">
              <span class="mi-ico" style="background:#E1F0E8" v-html="v5Icon('order', 26)"></span>
              <span class="mi-txt">
                <strong>我的订单</strong>
                <small>进度 · 互评 · 投诉，双方都看得到</small>
              </span>
              <i class="mi-num">{{ v5MyOrderList.length }}</i>
              <b class="mi-go">›</b>
            </button>
          </div>

          <h2 class="tab-sub">校园服务</h2>
          <div class="my-svc">
            <button v-for="s in v5MyServices" :key="s.name" @click="v5SvcClick(s.name)">
              <span class="ms-ico" :style="{ background: s.tint }" v-html="v5Icon(s.ico, 24)"></span>
              {{ s.name }}
              <i v-if="s.name === '通知' && v5AnnUnread" class="ms-dot">{{ v5AnnUnread }}</i>
            </button>
          </div>
          <p class="my-foot">
            把小事交给彼此，日子会顺一点
            <em>庆快校园 v1.0.0</em>
          </p>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【新增关注｜V5】我的页「新增关注」进去 ============ -->
        <section v-else-if="current === 'v5-followers'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('profile')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>{{ v5FollowTab === 'fans' ? '新增关注' : '我的关注' }}</h1>
            <button class="sub-act" @click="v5BoardSay('关注列表已刷新')">刷新</button>
          </div>
          <div class="sub-body">
            <p class="sub-lead" v-if="v5FollowTab === 'fans'">
              最近有 {{ v5NewFans }} 位新朋友关注了你，回关一下就能互相看到动态
            </p>
            <p class="sub-lead" v-else>你一共关注了 {{ v5FollowList.length }} 个账号</p>

            <div class="fn-tabs">
              <button v-for="t in v5FollowTabs" :key="t.id" :class="['fn-tab', { on: v5FollowTab === t.id }]" @click="v5FollowTab = t.id">
                {{ t.label }}<i v-if="t.id === 'fans' && v5NewFans">{{ v5NewFans }}</i>
              </button>
            </div>

            <article v-for="u in v5FollowList" :key="u.id" class="fn-row">
              <button class="fn-ava" :style="{ background: u.ac }" @click="v5OpenUser(u.n)">{{ u.n.slice(0, 1) }}</button>
              <div class="fn-main">
                <div class="fn-top">
                  <strong @click="v5OpenUser(u.n)">{{ u.n }}</strong>
                  <em v-if="u.isNew" class="fn-new">新</em>
                  <em v-if="u.official" class="fn-off">官方</em>
                  <small>{{ u.t }}</small>
                </div>
                <p class="fn-bio">{{ u.bio }}</p>
                <p v-if="u.mutual" class="fn-mut">{{ u.mutual }} 位共同关注</p>
              </div>
              <button :class="['fn-btn', { on: u.back }]" @click="v5FollowBack(u)">{{ u.back ? '已关注' : '回关' }}</button>
            </article>
          </div>
        </section>

        <!-- ============ 【我的消息｜V5】我的页「我的消息」进去：同学之间的互动 ============ -->
        <section v-else-if="current === 'v5-notices'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('profile')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>我的消息</h1>
            <button class="sub-act" @click="v5NoticeAllRead">全部已读</button>
          </div>
          <div class="sub-body">
            <p class="sub-lead">共 {{ v5NoticeList.length }} 条，其中 {{ v5Unread }} 条未读</p>

            <div class="nt-tabs">
              <button v-for="t in v5MyNoticeTabs" :key="t.id" :class="['nt-tab', { on: v5NoticeTab === t.id }]" @click="v5NoticeTab = t.id">{{ t.label }}</button>
            </div>

            <article v-for="n in v5NoticeList" :key="n.id" :class="['nt-row', { unread: n.unread }]" @click="v5OpenNoticeItem(n)">
              <button class="nt-ava" :style="{ background: n.ac }" @click.stop="v5OpenUser(n.n)">
                {{ n.n.slice(0, 1) }}
                <b class="nt-kind" :style="{ background: v5MyNoticeKind[n.type].tint }" v-html="v5Icon(v5MyNoticeKind[n.type].ico, 12)"></b>
              </button>
              <div class="nt-main">
                <div class="nt-top">
                  <strong @click.stop="v5OpenUser(n.n)">{{ n.n }}</strong>
                  <span class="nt-act">{{ n.txt }}</span>
                  <small>{{ n.t }}</small>
                </div>
                <blockquote class="nt-quote">{{ n.quote }}</blockquote>
                <p v-if="n.mine" class="nt-mine">我：{{ n.mine }}</p>
                <i v-if="n.unread" class="nt-dot"></i>
              </div>
              <!-- 直接回他一句，不用绕一圈 -->
            </article>
          </div>
        </section>

        <!-- ============ 【我的发布｜V5】我的页「我的发布」进去：看自己发的东西进展 ============ -->
        <section v-else-if="current === 'v5-myposts'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('profile')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>我的发布</h1>
            <span class="sub-note">共 {{ v5MyPostCount }} 条</span>
          </div>
          <div class="sub-body">
            <p class="sub-lead">搭把手 / 失物招领 / 闲置小铺 / 交友 发过的都在这儿，点开看进展</p>

            <div class="nt-tabs mp-tabs">
              <button v-for="t in v5MyPostTabs" :key="t.id" :class="['nt-tab', { on: v5MyPostTab === t.id }]" @click="v5MyPostTab = t.id">
                {{ t.label }}<i>{{ v5MyPostNum(t.id) }}</i>
              </button>
            </div>

            <p v-if="!v5MyPostList.length" class="mp-empty">
              这一类还没发过呢。
              <button v-if="v5MyPostTab === 'feed'" @click="selectScene('friends')">去交友发一条 ›</button>
              <button v-else @click="selectScene('campus')">去校园发一条 ›</button>
            </p>

            <article v-for="p in v5MyPostList" :key="p.board + p.id" class="mp-row" @click="v5MyPostOpen(p)">
              <span class="mp-ico" :style="{ background: p.ac }" v-html="v5Icon(p.ico, 22)"></span>
              <div class="mp-main">
                <div class="mp-top">
                  <span class="mp-st" :class="v5MyPostTone(p.st)">{{ p.st }}</span>
                  <strong>{{ p.title }}</strong>
                </div>
                <p class="mp-where">
                  <template v-if="p.board === 'feed'">
                    {{ v5TypeTint[p.type].label }} · {{ p.t }}
                  </template>
                  <template v-else>
                    {{ p.campus }} · {{ p.place }}<template v-if="p.time"> · {{ p.time }}</template>
                  </template>
                </p>
                <div class="mp-foot">
                  <em>{{ p.boardLabel }}</em>
                  <span>{{ v5MyPostNote(p) }}</span>
                  <b v-if="p.fee">报酬 ¥{{ p.fee }}</b>
                  <b v-else-if="p.price">¥{{ p.price }}</b>
                </div>
                <!-- 自己发的东西：改一改重新上架，或者干脆删掉 -->
                <div class="mp-ops">
                  <button @click.stop="v5MyPostEdit(p)">编辑重发</button>
                  <button class="del" @click.stop="v5AskDel(p)">删除</button>
                  <button v-if="v5OrderOf(p.id)" class="ord" @click.stop="v5OpenOrder(p.id)">看订单</button>
                  <!-- 自己挂的闲置：卖完了点一下就变「已抢光」 -->
                  <button
                    v-else-if="p.board === 'market' && p.st === '在售'"
                    class="ord" @click.stop="v5MarketSoldOut(p)">卖掉了</button>
                  <button
                    v-else-if="p.board === 'market' && p.st === '已抢光'"
                    class="ord" @click.stop="v5MarketBack(p)">重新上架</button>
                </div>
              </div>
              <span class="mp-go">›</span>
            </article>
          </div>

          <!-- 删除前先问一句：已经有人接单的话要提醒 -->
          <div v-if="v5DelOpen" class="board-mask" @click.self="v5DelOpen = false">
            <div class="board-sheet">
              <header class="bs-top"><h3>删除这条发布？</h3>
                <button class="bs-x" @click="v5DelOpen = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <p class="cp-tip">
                「{{ v5DelTarget ? v5DelTarget.title : '' }}」会被删掉，留言也一起没了，删了就找不回来。
                <template v-if="v5DelTarget && v5OrderOf(v5DelTarget.id)">
                  <b>这单已经有人接了，删除会同时撤掉订单。</b>
                </template>
              </p>
              <button class="bs-pub del" @click="v5DoDel">确认删除</button>
            </div>
          </div>

          <!-- 编辑重发：改完原地保存，不新建一条 -->
          <div v-if="v5EditTarget" class="board-mask" @click.self="v5EditClose">
            <div class="board-sheet">
              <header class="bs-top"><h3>编辑重发</h3>
                <button class="bs-x" @click="v5EditClose"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <p class="bs-lb">{{ v5EditTarget.boardLabel }} · {{ v5EditTarget.title }}</p>
              <input v-model="v5EditDraft.title" class="bs-in" type="text" placeholder="标题">
              <textarea v-model="v5EditDraft.desc" class="bs-ta" rows="3" placeholder="说清楚一点，别人更好判断"></textarea>
              <textarea v-if="v5EditTarget.board === 'feed'" v-model="v5EditDraft.body" class="bs-ta" rows="4" placeholder="正文，写详细一点"></textarea>
              <div v-if="v5EditTarget.board !== 'feed'" class="bs-chips">
                <button v-for="cp in v5CampusPick" :key="cp.id" :class="['bc', { on: v5EditDraft.campus === cp.id }]" @click="v5EditDraft.campus = cp.id">{{ cp.label }}</button>
              </div>
              <input v-if="v5EditTarget.board !== 'feed'" v-model="v5EditDraft.place" class="bs-in" type="text" placeholder="地点">
              <input v-if="v5EditTarget.board === 'help'" v-model="v5EditDraft.time" class="bs-in" type="text" placeholder="时间">
              <input v-if="v5EditTarget.board === 'help'" v-model="v5EditDraft.fee" class="bs-in" type="text" placeholder="报酬（元）">
              <input v-if="v5EditTarget.board === 'market'" v-model="v5EditDraft.price" class="bs-in" type="text" placeholder="价格（元）">
              <input v-if="v5EditTarget.board === 'lost'" v-model="v5EditDraft.reward" class="bs-in" type="text" placeholder="感谢（选填）">
              <input v-if="v5EditTarget.board !== 'feed'" v-model="v5EditDraft.contact" class="bs-in" type="text" placeholder="联系方式，别人可以直接复制">
              <template v-if="v5EditTarget.board !== 'feed'">
              <p class="bs-lb">照片（选填，最多 4 张）</p>
              <div class="bs-photos">
                <button class="bp-add" @click="v5BoardPickPhoto">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3.6 8.6h3.2l1.5-2.4h5.4l1.5 2.4h3.2a1.1 1.1 0 0 1 1.1 1.1v8.2a1.1 1.1 0 0 1-1.1 1.1H4.7a1.1 1.1 0 0 1-1.1-1.1V9.7a1.1 1.1 0 0 1 1.1-1.1Z" stroke="#8E9187" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="13.4" r="3.3" stroke="#8E9187" stroke-width="1.4"/></svg>
                  <span>加照片</span>
                </button>
                <div v-for="(p, i) in v5BoardPhotos" :key="'ep' + i" class="bp-pic" :style="{ backgroundImage: `url(${p})` }">
                  <button class="bp-x" @click="v5BoardDelPhoto(i)">×</button>
                </div>
              </div>
              </template>
              <button class="bs-pub" @click="v5EditSave">保存并重新发布</button>
            </div>
          </div>
        </section>

        <!-- ============ 【我的订单｜V5】我接的单 + 我发的单 ============ -->
        <section v-else-if="current === 'v5-orders'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('profile')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>我的订单</h1>
            <span class="sub-note">共 {{ v5MyOrderList.length }} 条</span>
          </div>
          <div class="sub-body">
            <p class="sub-lead">接下的活和发出去的活都在这儿，点进去看进度、互评、投诉</p>

            <div class="nt-tabs mp-tabs">
              <button :class="['nt-tab', { on: v5OrderTab === 'all' }]" @click="v5OrderTab = 'all'">全部<i>{{ v5OrderNum('all') }}</i></button>
              <button :class="['nt-tab', { on: v5OrderTab === 'taker' }]" @click="v5OrderTab = 'taker'">我接的<i>{{ v5OrderNum('taker') }}</i></button>
              <button :class="['nt-tab', { on: v5OrderTab === 'pub' }]" @click="v5OrderTab = 'pub'">我发布的<i>{{ v5OrderNum('pub') }}</i></button>
            </div>

            <p v-if="!v5MyOrderShow.length" class="mp-empty">
              这一类还没有订单。
              <button @click="selectScene('campus')">去搭把手看看 ›</button>
            </p>

            <article v-for="r in v5MyOrderShow" :key="r.id" class="or-row" @click="v5OpenOrder(r.id)">
              <div class="or-main">
                <div class="or-top">
                  <span class="or-st" :class="r.o.st">{{ v5OrderStText(r.o, r.id) }}</span>
                  <strong>{{ r.it.title }}</strong>
                </div>
                <p class="or-who">
                  <em class="or-bd" :class="{ mk: v5OrderIsMarket(r.id) }">{{ v5OrderIsMarket(r.id) ? '闲置' : '搭把手' }}</em>
                  {{ r.role === 'taker'
                    ? `我${v5OrderIsMarket(r.id) ? '想要的东西' : '接的单'} · ${v5OrderPubWord(r.id)} ${r.o.pub}`
                    : `我发布的 · ${r.o.taker} ${v5OrderIsMarket(r.id) ? '想要了' : '接了'}` }}
                </p>
                <div class="or-foot">
                  <em>{{ r.o.no }}</em>
                  <span>{{ r.it.place }}<template v-if="r.it.time"> · {{ r.it.time }}</template></span>
                  <b>¥{{ r.o.fee }}</b>
                </div>
              </div>
              <span class="or-go">›</span>
            </article>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【订单详情｜V5】双方看的是同一份：进度 / 互评 / 投诉 ============ -->
        <section v-else-if="current === 'v5-order'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('v5-orders')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>订单详情</h1>
            <button class="sub-act" @click="v5ComplainOpen = true">投诉</button>
          </div>
          <!-- 从场景索引直接跳进来时 v5OrderCur 是空的，给个兜底别留白屏 -->
          <div v-if="!v5OrderCur" class="sub-body v5p-empty">
            <p>还没有选中订单</p>
            <button class="v5p-empty-go" @click="v5OpenOrders">去看我的订单</button>
          </div>
          <div v-else class="sub-body">
            <div class="or-head">
              <span class="oh-st" :class="v5OrderCur.o.st">{{ v5OrderStText(v5OrderCur.o, v5OrderCur.it.id) }}</span>
              <div class="oh-txt">
                <strong>{{ v5OrderCur.it.title }}</strong>
                <small>订单号 {{ v5OrderCur.o.no }} · {{ v5OrderCur.o.at }} {{ v5OrderIsMarket(v5OrderCur.it.id) ? '预定' : '接单' }}</small>
              </div>
            </div>

            <!-- 四步进度条：走到哪一步就亮到第几个（闲置的说法不一样） -->
            <div class="or-step">
              <span v-for="(st, i) in v5OrderStepsOf(v5OrderCur.it.id)" :key="st.id" :class="['os', { on: v5OrderStepOn(v5OrderCur.o, st.id) }]">
                <i>{{ i + 1 }}</i>{{ st.label }}
              </span>
            </div>

            <!-- 双方是谁 + 复制联系方式（没有私信了，各自加微信） -->
            <div class="or-two">
              <div class="ot-one">
                <span class="ot-ava" :style="{ background: v5OrderCur.it.ac }">{{ v5OrderCur.o.pub.slice(0, 1) }}</span>
                <div class="ot-info">
                  <strong @click="v5OpenUser(v5OrderCur.o.pub)">{{ v5OrderCur.o.pub }}</strong>
                  <small>{{ v5OrderPubWord(v5OrderCur.it.id) }} · {{ v5OrderCur.role === 'pub' ? '（我）' : '' }}</small>
                  <em class="ot-ct">{{ v5OrderCur.it.contact || '没留联系方式' }}</em>
                </div>
                <button class="ot-copy" @click="v5Copy(v5OrderCur.it.contact)">复制</button>
              </div>
              <div class="ot-one">
                <span class="ot-ava" :style="{ background: '#D9E4C9' }">{{ v5OrderCur.o.taker.slice(0, 1) }}</span>
                <div class="ot-info">
                  <strong @click="v5OpenUser(v5OrderCur.o.taker)">{{ v5OrderCur.o.taker }}</strong>
                  <small>{{ v5OrderTakerWord(v5OrderCur.it.id) }} · {{ v5OrderCur.role === 'taker' ? '（我）' : '' }}</small>
                  <em class="ot-ct">{{ v5OrderCur.o.takerContact || '还没留联系方式' }}</em>
                </div>
                <button class="ot-copy" @click="v5OrderCopyTaker">复制</button>
              </div>
            </div>

            <div class="or-task" @click="v5OpenOrderItem">
              <div class="ot-line">
                <span>{{ v5OrderIsMarket(v5OrderCur.it.id) ? '商品' : '任务' }}</span>
                <strong>{{ v5OrderCur.it.title }}</strong>
              </div>
              <div class="ot-line"><span>地点</span><strong>{{ v5OrderCur.it.place }}</strong></div>
              <div v-if="v5OrderCur.it.time" class="ot-line"><span>时间</span><strong>{{ v5OrderCur.it.time }}</strong></div>
              <div class="ot-line">
                <span>{{ v5OrderFeeWord(v5OrderCur.it.id) }}</span>
                <strong class="fee">¥{{ v5OrderCur.o.fee }}</strong>
              </div>
              <b class="ot-go">看{{ v5OrderIsMarket(v5OrderCur.it.id) ? '商品' : '任务' }}详情 ›</b>
            </div>

            <div class="or-time">
              <h3>订单进度</h3>
              <p v-for="(tl, i) in v5OrderCur.o.timeline" :key="'tl' + i">
                <em>{{ tl.t }}</em>{{ tl.txt }}
              </p>
            </div>

            <!-- 互评：两边都评完才算真的结束 -->
            <div class="or-rate">
              <h3>互评</h3>
              <div class="rt-box">
                <p class="rt-to">
                  我给{{ v5OrderCur.role === 'pub' ? v5OrderTakerWord(v5OrderCur.it.id) : v5OrderPubWord(v5OrderCur.it.id) }}
                  {{ v5OrderCur.role === 'pub' ? v5OrderCur.o.taker : v5OrderCur.o.pub }} 打分
                </p>
                <div v-if="v5OrderMine" class="rt-done">
                  <b>{{ '★'.repeat(v5OrderMine.star) }}</b>
                  <p>{{ v5OrderMine.txt || '（没写评价）' }}</p>
                  <small>{{ v5OrderMine.t }} 已提交</small>
                </div>
                <template v-else>
                  <div class="rt-stars">
                    <button v-for="n in 5" :key="n" :class="{ on: n <= v5RateStar }" @click="v5RateStar = n">★</button>
                  </div>
                  <textarea v-model="v5RateTxt" class="bs-ta" rows="3" placeholder="说两句，帮别人参考一下"></textarea>
                  <button class="rt-send" @click="v5RateSubmit(v5OrderCur.o)">提交评价</button>
                  <small v-if="v5OrderCur.o.st === 'taken' || v5OrderCur.o.st === 'done'" class="rt-wait">
                    {{ v5OrderIsMarket(v5OrderCur.it.id) ? '交易完成后才能互评' : '任务完成后才能互评' }}
                  </small>
                </template>
              </div>

              <div class="rt-box">
                <p class="rt-to">对方对我的评价</p>
                <div v-if="v5OrderOther" class="rt-done">
                  <b>{{ '★'.repeat(v5OrderOther.star) }}</b>
                  <p>{{ v5OrderOther.txt || '（没写评价）' }}</p>
                  <small>{{ v5OrderOther.t }}</small>
                </div>
                <p v-else class="cm-none">对方还没评价</p>
              </div>
            </div>

            <div v-if="v5OrderCur.o.complaint" class="or-cp">
              <h3>我的投诉</h3>
              <p><em>{{ v5OrderCur.o.complaint.t }}</em>{{ v5OrderCur.o.complaint.reason }} · {{ v5OrderCur.o.complaint.st }}</p>
              <p v-if="v5OrderCur.o.complaint.txt">{{ v5OrderCur.o.complaint.txt }}</p>
            </div>

            <div class="or-acts">
              <button :class="['oa-main', { off: v5OrderAct && v5OrderAct.off }]" @click="v5OrderAct && v5OrderAct.go && v5OrderAct.go()">
                {{ v5OrderAct ? v5OrderAct.t : '' }}
              </button>
              <button class="oa-ghost" @click="v5ComplainOpen = true">投诉</button>
            </div>
          </div>

          <!-- 投诉弹层：选个原因 + 补充说明 -->
          <div v-if="v5ComplainOpen" class="board-mask" @click.self="v5ComplainOpen = false">
            <div class="board-sheet">
              <header class="bs-top"><h3>投诉这一单</h3>
                <button class="bs-x" @click="v5ComplainOpen = false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg></button>
              </header>
              <div class="cp-reasons">
                <button v-for="rs in v5OrderReasons" :key="rs" :class="{ on: v5ComplainReason === rs }" @click="v5ComplainReason = rs">{{ rs }}</button>
              </div>
              <textarea v-model="v5ComplainTxt" class="bs-ta" rows="3" placeholder="说说经过，方便我们判断（选填）"></textarea>
              <button class="bs-pub" @click="v5ComplainSubmit(v5OrderCur.o)">提交投诉</button>
            </div>
          </div>
          <div v-if="v5BoardToast" class="v5p-toast">{{ v5BoardToast }}</div>
        </section>

        <!-- ============ 【通知｜V5】校园服务「通知」进去：开发项目组发的官方通知 ============ -->
        <section v-else-if="current === 'v5-announce'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('profile')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>通知</h1>
            <button class="sub-act" @click="v5AnnAllRead">全部已读</button>
          </div>
          <div class="sub-body">
            <p class="sub-lead">来自庆快校园项目组 · {{ v5AnnUnread }} 条未读</p>

            <div class="nt-tabs">
              <button v-for="t in v5AnnounceTabs" :key="t.id" :class="['nt-tab', { on: v5AnnTab === t.id }]" @click="v5AnnTab = t.id">{{ t.label }}</button>
            </div>

            <article v-for="a in v5AnnList" :key="a.id" class="an-row" @click="v5OpenAnn(a.id)">
              <span class="an-ico" :style="{ background: v5AnnounceKind[a.type].tint }" v-html="v5Icon(v5AnnounceKind[a.type].ico, 24)"></span>
              <div class="an-main">
                <div class="an-top">
                  <em :style="{ background: v5AnnounceKind[a.type].bar }">{{ v5AnnounceKind[a.type].word }}</em>
                  <strong>{{ a.title }}</strong>
                </div>
                <p class="an-brief">{{ a.body.split('\n')[0] }}</p>
                <div class="an-foot">
                  <span>{{ a.from }}</span>
                  <span>{{ a.t }}</span>
                </div>
                <i v-if="a.unread" class="an-dot"></i>
              </div>
            </article>
          </div>
        </section>

        <!-- ============ 【通知 · 详情｜V5】官方通知点进去 ============ -->
        <section v-else-if="current === 'v5-announce-detail'" class="v5p subpage">
          <div class="sub-top">
            <button class="d-back" aria-label="返回" @click="v5Back('v5-announce')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#3A3F42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <h1>通知详情</h1>
            <button class="sub-act" @click="v5BoardSay('已收到，感谢反馈')">有用</button>
          </div>
          <div class="sub-body" v-if="v5AnnCur">
            <div class="ad-hero" :style="{ background: v5AnnounceKind[v5AnnCur.type].tint }">
              <span v-html="v5Icon(v5AnnounceKind[v5AnnCur.type].ico, 40)"></span>
            </div>
            <em class="ad-kind" :style="{ background: v5AnnounceKind[v5AnnCur.type].bar }">{{ v5AnnounceKind[v5AnnCur.type].word }}</em>
            <h2 class="ad-title">{{ v5AnnCur.title }}</h2>
            <div class="ad-meta">
              <span>{{ v5AnnCur.from }}</span>
              <span>{{ v5AnnCur.t }}</span>
            </div>
            <div class="ad-body">
              <p v-for="(line, i) in v5AnnCur.body.split('\n')" :key="i">{{ line }}</p>
            </div>
            <div class="ad-tags">
              <i v-for="tg in v5AnnCur.tags" :key="tg">#{{ tg }}</i>
            </div>
            <div class="ad-sign">
              <p>庆快校园项目组</p>
              <small>有问题随时在「反馈」里找我们</small>
            </div>
          </div>
        </section>

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

        <!-- ============ 【我的｜原版】 ============ -->
        <section v-else-if="current === 'profile'" class="screen profile-real"><div class="profile-bg"><div class="profile-user"><div class="reference-avatar profile-avatar"></div><h1>一树山茶?</h1><p>关注 23 | 粉丝 5</p></div><div class="profile-meta"><span>用户ID：QUICK36328162_011407</span><span>用龄：1年</span></div><div class="profile-numbers"><span><b>14</b>评分数</span><span><b>13</b>收藏</span><span><b>0</b>积分</span></div></div><button class="collection-card" @click="selectScene('favorites')"><IconSymbol name="shop" :size="44" /><strong>我的收藏</strong></button><section class="my-card"><h2>我的卡片</h2><p>简介：卧槽+32</p></section><section class="profile-panel"><h2>我的工具</h2><div class="profile-grid two"><button><IconSymbol name="shop" :size="36" /><span>头像商城</span></button><button><IconSymbol name="checkin" :size="36" /><span>签到</span></button></div></section><section class="profile-panel"><h2>我的服务</h2><div class="profile-grid four"><button><IconSymbol name="feedback" :size="36" /><span>反馈</span></button><button><IconSymbol name="notice" :size="36" /><span>通知</span></button><button><IconSymbol name="contact" :size="36" /><span>联系我们</span></button><button><IconSymbol name="map" :size="36" /><span>地图</span></button></div></section><button class="floating-gift" aria-label="礼物"><IconSymbol name="gift" :size="30" /></button></section>

        <!-- ============ 【店铺详情｜Wise 新版】徐豆豆（介绍/菜单/留言）与老潼关（留言）共用，靠 isTongguan 区分 ============ -->
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

        <!-- ============ 【店铺详情｜原版】兜底分支：上面都没匹配到时走这里 ============ -->
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

        <!-- 投诉弹层：动态、别人的主页都能用，所以挂在手机外壳里面（PhoneShell 插槽里），
             绝对定位的基准是 .phone，宽高就跟着手机走。
             以前挂在手机外壳外面，会被拉成整屏宽 —— 就是「没适应屏幕」那个毛病。 -->
        <!-- 接单 / 我想要 之前先留个联系方式：站内没有私信，
             双方只能靠各自留的微信/电话自己联系，所以这一步省不掉。
             填过一次就记住（v5MyContact），下次自动带上。 -->
        <div v-if="v5ContactAsk" class="board-mask rp-mask" @click.self="v5ContactAsk = null">
          <div class="board-sheet">
            <header class="bs-top">
              <h3>留个联系方式</h3>
              <button class="bs-x" @click="v5ContactAsk = null">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
              </button>
            </header>
            <p class="cp-tip">
              接下这单以后，{{ v5ContactAsk.board === 'market' ? '卖家' : '发布人' }}要按这个联系你。
              站内没有私信，留个微信或手机号就行：
            </p>
            <input v-model="v5ContactInput" class="bs-in" type="text" placeholder="比如 微信 xxx / 13800138000">
            <div class="ct-keep">
              <label><input v-model="v5ContactSave" type="checkbox">以后接单都用它，不用每次填</label>
            </div>
            <button class="bs-pub" @click="v5ContactConfirm">{{ v5ContactAsk.board === 'market' ? '确认想要' : '确认接单' }}</button>
          </div>
        </div>

        <div v-if="v5ReportOpen" class="board-mask rp-mask" @click.self="v5ReportClose">
          <div class="board-sheet">
            <header class="bs-top">
              <h3>投诉{{ v5ReportTarget ? v5ReportTarget.what : '' }}</h3>
              <button class="bs-x" @click="v5ReportClose">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#20242B" stroke-width="2.2" stroke-linecap="round"/></svg>
              </button>
            </header>
            <p v-if="v5ReportTarget" class="cp-tip">
              <template v-if="v5ReportTarget.what === '动态'">「{{ v5ReportTarget.title }}」这条动态</template>
              <template v-else>{{ v5ReportTarget.name }} 这个账号</template>
              哪里不对？选一个，再补两句：
            </p>
            <div class="cp-reasons">
              <button v-for="rs in v5ReportReasons" :key="rs" :class="{ on: v5ReportReason === rs }" @click="v5ReportReason = rs">{{ rs }}</button>
            </div>
            <textarea v-model="v5ReportTxt" class="bs-ta" rows="3" placeholder="说说经过，方便我们判断（选填）"></textarea>
            <button class="bs-pub" @click="v5ReportSubmit">提交投诉</button>
          </div>
        </div>
      </PhoneShell></div>
      <footer class="stage-footer"><span>STATIC PROTOTYPE · 38 SCENES × 4 DESIGNS</span><span>场景、设计版本与底栏均可切换</span></footer>
    </section>
  </div>

  <!-- 发布弹窗「加照片」用的隐藏文件框。放在这里而不是弹窗里，
       是因为三个板块共用同一个，写进 v-if 里面容易拿不到 -->
  <input id="v5-photo-input" type="file" accept="image/*" multiple class="v5-file-hide" @change="v5BoardFiles">

  <!-- 点照片放大的浮层 -->
  <div v-if="v5PhotoView" class="v5-photo-mask" @click="v5PhotoView = ''">
    <img :src="v5PhotoView" alt="照片大图">
  </div>
</template>
