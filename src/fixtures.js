/*
 * fixtures.js = 项目里唯一的数据源。没有任何接口请求，页面上看到的一切文字、图片、评分都在这里。
 * 改这里 = 改页面内容；改样式请去 CSS；改布局请去 App.vue。
 *
 * 速查：
 *   scenes                → 左侧场景索引的按钮（17 个场景的 id / 分组 / 标题 / 副标题）
 *   homeShortcuts         → 首页快捷入口（原版）
 *   homeBanners           → 首页轮播图
 *   homeStores            → 首页「猜你喜欢」卡片
 *   v5Entries             → V5 首页金刚区 5 个入口（含 SVG 图标）
 *   stalls / mallShops    → 桥苑小摊 / 商业中心店铺
 *   mallZones             → 商业中心顶部分区筛选栏
 *   dishes                → 饭堂菜谱（菜名 + 价格）
 *   goldenBoardStores     → 庆快金榜（原版）
 *   goldenBoardEntries    → 庆快金榜（Wise 版，带评分和点击后跳哪个场景）
 *   randomStores          → 开盲盒的候选店铺池
 *   favoriteStores        → 店铺收藏列表
 *   commentsByShop        → 店铺留言/评价，按店铺名取
 *   friends / friendRecommendations → 好友列表 / 好友推荐
 */
// 左侧场景索引：加一个场景 = 在这里加一项 + App.vue 加一个 v-else-if 分支 + 写对应 CSS
export const scenes = [
  { id: 'home', group: '首页', label: '首页', note: '快捷入口与推荐' },
  { id: 'golden-board', group: '首页', label: '庆快金榜', note: '店铺人气榜' },
  { id: 'random-store', group: '首页', label: '开盲盒', note: '随机店铺' },
  { id: 'stalls', group: '校园觅食', label: '桥苑小摊', note: '列表' },
  { id: 'mall', group: '校园觅食', label: '商业中心', note: '侧栏列表' },
  { id: 'canteen', group: '校园觅食', label: '饭堂', note: '每日菜谱' },
  { id: 'campus', group: '校园', label: '校园服务', note: '服务入口' },
  { id: 'library', group: '校园', label: '图书馆', note: '空间列表' },
  { id: 'friends', group: '社交', label: '好友', note: '好友与消息' },
  { id: 'profile', group: '个人', label: '我的', note: '个人中心' },
  { id: 'public-profile', group: '个人', label: '用户主页', note: '公开资料页' },
  { id: 'favorites', group: '个人', label: '店铺收藏', note: '收藏列表' },
  { id: 'xudoudou-top', group: '店铺详情', label: '徐豆豆 · 顶部', note: '介绍态' },
  { id: 'xudoudou-menu', group: '店铺详情', label: '徐豆豆 · 菜单', note: '菜单态' },
  { id: 'xudoudou-message', group: '店铺详情', label: '徐豆豆 · 留言', note: '评价态' },
  { id: 'laotongguan-message', group: '店铺详情', label: '老潼关 · 留言', note: '留言态' },
  { id: 'linhuzi-reviews', group: '店铺详情', label: '林胡子 · 评价', note: '评价抽屉' },
  { id: 'v5-zone', group: 'V5 新版', label: '进店逛', note: '桥苑/商业中心/饭堂' },
  { id: 'v5-search', group: 'V5 新版', label: '搜索页', note: '首页搜索框进入' },
  { id: 'v5-gacha', group: 'V5 新版', label: '今天吃什么', note: '盲盒抽签' },
  { id: 'v5-idea', group: 'V5 新版', label: '灵感小盒', note: '今天做什么' },
  { id: 'v5-mbti', group: 'V5 新版', label: 'MBTI食堂', note: '人格 × 美食' },
  { id: 'v5-detail', group: 'V5 新版', label: '店铺详情', note: '卡片点进去的页面' },
  { id: 'v5-lost', group: 'V5 新版', label: '失物招领', note: '找东西 / 捡到了' },
  { id: 'v5-lost-detail', group: 'V5 新版', label: '失物 · 详情', note: '卡片点进去' },
  { id: 'v5-market', group: 'V5 新版', label: '闲置小铺', note: '出二手' },
  { id: 'v5-market-detail', group: 'V5 新版', label: '闲置 · 详情', note: '卡片点进去' },
  { id: 'v5-help', group: 'V5 新版', label: '搭把手', note: '求助中 / 可提供帮助' },
  { id: 'v5-help-detail', group: 'V5 新版', label: '搭把手 · 详情', note: '卡片点进去' },
  { id: 'v5-user', group: 'V5 新版', label: '用户主页', note: '点头像进去' },
  { id: 'v5-followers', group: 'V5 新版', label: '新增关注', note: '谁关注了我（从我的页粉丝数进入）' },
  { id: 'v5-notices', group: 'V5 新版', label: '我的消息', note: '回复/赞/接单' },
  { id: 'v5-myposts', group: 'V5 新版', label: '我的发布', note: '自己发的任务，可编辑重发/删除' },
  { id: 'v5-orders', group: 'V5 新版', label: '我的订单', note: '我发的单和我接的单' },
  { id: 'v5-order', group: 'V5 新版', label: '订单详情', note: '进度/互评/投诉，双方都看得到' },
  { id: 'v5-feed-detail', group: 'V5 新版', label: '动态 · 详情', note: '交友帖子点进去' },
  { id: 'v5-announce', group: 'V5 新版', label: '通知', note: '项目组发给全体同学' },
  { id: 'v5-announce-detail', group: 'V5 新版', label: '通知 · 详情', note: '通知点进去' },
];

// 首页快捷入口（原版用，图标在 public/assets/source-fidelity/shortcuts/）
export const homeShortcuts = [
  { label: '庆园饭堂', image: '/assets/source-fidelity/shortcuts/canteen.png', scene: 'canteen', group: 'pickup' },
  { label: '桥苑夜市', image: '/assets/source-fidelity/shortcuts/stalls.png', scene: 'stalls', group: 'pickup' },
  { label: '收藏店铺', image: '/assets/source-fidelity/shortcuts/favorites.png', scene: 'favorites', group: 'pickup' },
  { label: '随机店铺', image: '/assets/source-fidelity/shortcuts/random.png', scene: 'random-store', group: 'pickup' },
  { label: '获得积分', image: '/assets/source-fidelity/shortcuts/points.svg', scene: 'profile', group: 'friend' },
  { label: '关注收藏', image: '/assets/source-fidelity/shortcuts/following.svg', scene: 'friends', group: 'friend' },
  { label: '好友收藏', image: '/assets/source-fidelity/shortcuts/friend-favorites.svg', scene: 'friends', group: 'friend' },
  { label: '好友推荐', image: '/assets/source-fidelity/shortcuts/friend-recommend.svg', scene: 'friends', group: 'friend' },
];

// 收藏的店铺列表（图片取自 original-pages/favorites/）
export const favoriteStores = [
  { name: '筷点来潮汕牛肉饭', time: '00:00:00--23:59:00', score: '9', ratings: 6, image: '/assets/original-pages/favorites/01.png' },
  { name: '禾香园', time: '00:00:00--23:59:00', score: '8.5', ratings: 108, image: '/assets/original-pages/favorites/02.png' },
  { name: '猪大哈干蒸排骨饭', time: '07:30:00--23:00:00', score: '9', ratings: 2, image: '/assets/original-pages/favorites/03.png' },
  { name: '鲍汁黄焖鸡', time: '00:00:00--23:59:00', score: '7.1', ratings: 20, image: '/assets/original-pages/favorites/04.png' },
  { name: '顺德干蒸鲜排骨', time: '00:00:00--23:59:00', score: '8.4', ratings: 27, image: '/assets/original-pages/favorites/05.png' },
  { name: '明记烧腊快餐', time: '00:00:00--23:59:00', score: '8.3', ratings: 122, image: '/assets/original-pages/favorites/06.png' },
  { name: '黄师傅', time: '00:00:00--23:59:00', score: '265.3', ratings: 389, image: '/assets/original-pages/favorites/07.png' },
  { name: 'BQ韩式炸鸡', time: '00:00:00--23:59:00', score: '8.9', ratings: 138, image: '/assets/original-pages/favorites/08.png' },
  { name: '遇见汤饭', time: '00:00:00--23:59:00', score: '8.6', ratings: 56, image: '/assets/original-pages/favorites/09.png' },
];

// 庆快金榜 · 原版：名次用 value 排序
export const goldenBoardStores = [
  { name: '徐家小炒', place: '大厅左', value: 2, image: '/assets/original-pages/ranking/01.png' },
  { name: '老潼关肉夹馍', place: '天桥附近二楼', value: 2, image: '/assets/original-pages/ranking/02.png' },
  { name: '旺客', place: '大厅右', value: 1, image: '/assets/original-pages/ranking/03.png' },
  { name: '烤肉拌饭', place: '梅苑三楼', value: 1, image: '/assets/original-pages/ranking/04.png' },
  { name: '黄师傅', place: '大厅右', value: 0, image: '/assets/original-pages/ranking/05.png' },
  { name: '私房牛肉面', place: '大厅右', value: 0, image: '/assets/original-pages/ranking/06.png' },
  { name: '回味屋', place: '小吃街', value: 0, image: '/assets/original-pages/ranking/07.png' },
];

// 开盲盒的候选店铺池，target = 抽中后跳转到哪个场景
export const randomStores = [
  { name: '烧鸭粉', category: '粉面', image: '/assets/original-pages/random-store/roast-duck-noodles.png', target: 'mall' },
  { name: '老潼关肉夹馍', category: '主食', image: '/assets/source-fidelity/commercial/01-laotongguan.jpg', target: 'laotongguan-message' },
  { name: '老上海馄饨铺', category: '小吃', image: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', target: 'mall' },
  { name: '功夫小茗', category: '饮品', image: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', target: 'mall' },
];

// 首页顶部轮播图
export const homeBanners = [
  '/assets/source-fidelity/banners/home-1.png',
  '/assets/source-fidelity/banners/home-2.jpeg',
  '/assets/source-fidelity/banners/home-3.png',
];

// 首页「猜你喜欢」的卡片数据
export const homeStores = [
  { name: '黄师傅', place: '大厅右', score: '389 人评过', photo: '/assets/source-fidelity/featured/huang-shifu.jpg', kind: '校园店铺' },
  { name: '徐豆豆', place: '工行门', score: '★ 4.2', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg', kind: '桥苑小摊' },
  { name: '全记', place: '工行门', score: '★ 4.3', photo: '/assets/source-fidelity/stalls/quanji.jpeg', kind: '桥苑小摊' },
  { name: '林胡子猪脚饭', place: '学4门', score: '★ 5.0', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg', kind: '桥苑小摊' },
];

// 庆快金榜 · Wise 版：score 评分、group 区分店铺/小摊、target 是点击后的场景
export const goldenBoardEntries = [
  { name: '黄师傅', category: '校园店铺', group: 'store', place: '商业中心 · 大厅右', score: '9.6', votes: '389 人评过', photo: '/assets/source-fidelity/featured/huang-shifu.jpg', target: 'mall' },
  { name: '老潼关肉夹馍', category: '校园店铺', group: 'store', place: '商业中心 · 天桥附近二楼', score: '9.3', votes: '50 人评过', photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg', target: 'laotongguan-message' },
  { name: '徐豆豆', category: '桥苑小摊', group: 'stall', place: '工行门 · 糖水甜品', score: '9.2', votes: '4 人评过', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg', target: 'xudoudou-top' },
  { name: '全记', category: '桥苑小摊', group: 'stall', place: '工行门 · 炒粉主食', score: '8.9', votes: '2 人评过', photo: '/assets/source-fidelity/stalls/quanji.jpeg', target: 'stalls' },
  { name: '林胡子猪脚饭', category: '桥苑小摊', group: 'stall', place: '学4门 · 猪脚饭', score: '8.8', votes: '1 人评过', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg', target: 'stalls' },
  { name: '老上海馄饨铺', category: '校园店铺', group: 'store', place: '商业中心 · 大厅中', score: '8.8', votes: '165 人评过', photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', target: 'mall' },
];

// 桥苑小摊的 3 家店
export const stalls = [
  { name: '徐豆豆', category: '饮品', tags: ['糖水', '甜品'], time: '11:00—22:30', score: '4.2', people: '4人', average: '¥10', place: '工行门 · 工行门附近', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg' },
  { name: '全记', category: '主食', tags: ['炒粉', '主食'], time: '11:00—22:30', score: '4.3', people: '2人', average: '¥10', place: '工行门 · 工行门附近', photo: '/assets/source-fidelity/stalls/quanji.jpeg' },
  { name: '林胡子猪脚饭', category: '主食', tags: ['主食', '猪脚饭', '牛腩饭'], time: '11:00—22:30', score: '5.0', people: '1人', average: '¥15', place: '学4门 · 学4门附近', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg' },
];

// 商业中心顶部的分区筛选栏文字
export const mallZones = ['全部', '大厅左', '大厅中', '大厅右', '大厅前', '大厅后', '京东一路', '小博联区', '大博联区', '古茗附近', '猪大哈区', '小吃街', '天桥附近二楼'];

// 商业中心店铺列表
export const mallShops = [
  { name: '老潼关肉夹馍', score: '9.3', people: '50 人评过', category: '主食', place: '天桥附近二楼', time: '08:00—23:59', photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg' },
  { name: '老上海馄饨铺', score: '8.8', people: '165 人评过', category: '主食', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg' },
  { name: '功夫小茗', score: '8.7', people: '71 人评过', category: '饮品', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg' },
  { name: '韩国风味', score: '8.9', people: '143 人评过', category: '主食', place: '大厅中', time: '08:00—20:00', photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg' },
  { name: 'Come On潮味', score: '8.7', people: '79 人评过', category: '主食', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/05-come-on.jpg' },
];

// 饭堂菜谱：[菜名, 价格]
export const dishes = [
  ['香辣大虾', '¥6.5'], ['干锅鸭腿', '¥7.5'], ['紫苏炒滑鸡', '¥6'], ['麻婆豆腐', '¥3.5'],
  ['鱼香茄子', '¥3.5'], ['豆干肉丝', '¥4.5'], ['青瓜拌猪展', '¥7'], ['椒盐鸡丁', '¥6'],
  ['干煸辣子鸡', '¥6'], ['蒜泥茄子', '¥3.5'], ['香菇鸡', '¥5'], ['酱汁鸡', '¥6.5'],
  ['蒜香口水鸡', '¥5'], ['鱼片滑蛋', '¥6.5'],
];

// 店铺留言 / 评价，键是店铺名（徐豆豆、老潼关肉夹馍）
export const commentsByShop = {
  '徐豆豆': [
    { name: '微信用户', time: '1天前', text: '以前觉得味道还行，现在觉得不如隔壁忘川清补凉，同样的价格比徐豆豆分量大，而且香芋比他们家好吃', likes: 0 },
    { name: '微信用户', time: '5天前', text: '一般般，没有很好吃', likes: 0 },
    { name: '微信用户', time: '5天前', text: '好吃😋，推荐龙眼桂花冻', likes: 0 },
  ],
  '老潼关肉夹馍': [
    { name: 'Yilena', time: '2025-11-26', text: '很不错的店', likes: 1, reply: 'Yilena：确实' },
    { name: 'メbluefox', time: '2025-12-06', text: '味道还可以，以前经常吃', likes: 0 },
  ],
};

// V5 首页金刚区：label 文字、scene 点击后跳转、background/border 图标底色、icon 是内联 SVG
export const v5Entries = [
  {
    label: '桥苑小摊', scene: 'v5-zone', zone: 'qiaoyuan',
    background: '#E9F1EC', border: 'none',
    icon: 'stall',
  },
  {
    label: '商业中心', scene: 'v5-zone', zone: 'shangye',
    background: '#E7EEF7', border: 'none',
    icon: 'mall',
  },
  {
    label: '庆园饭堂', scene: 'v5-zone', zone: 'fentang',
    background: '#F9F0DC', border: 'none',
    icon: 'canteen',
  },
  {
    label: 'MBTI食堂', scene: 'v5-mbti',
    background: '#FBF3E2', border: '1px solid #E8D9B4',
    icon: 'mbti',
  },
  {
    label: '我的收藏', scene: 'favorites',
    background: '#F0EBF7', border: 'none',
    icon: 'fav',
  },
];

// V5 首页「猜你喜欢」的三个筛选 tab：id 用来筛选卡片，label 是显示文字
export const v5GuessTabs = [
  { id: 'all', label: '全部推荐' },
  { id: 'shangye', label: '商业中心' },
  { id: 'qiaoyuan', label: '街边小摊' },
];

// V5 全站共用的店铺数据（首页猜你喜欢 + 进店逛 + 搜索都从这里取）
// area：qiaoyuan 街边小摊 / shangye 商业中心 / fentang 庆园饭堂
// cat：品类标签，进店逛的品类筛选用它；hot 越大排越前；target 是点击后跳转的场景
export const v5GuessStores = [
  { name: '徐豆豆', area: 'qiaoyuan', cat: ['饮品', '糖水'], photo: '/assets/source-fidelity/stalls/xudoudou.jpeg', rating: 4.2, people: 4, place: '工行门', price: 10, time: '11:00 - 22:30', likes: 0, hot: 60, target: 'xudoudou-top' },
  { name: '全记', area: 'qiaoyuan', cat: ['粉面', '主食'], photo: '/assets/source-fidelity/stalls/quanji.jpeg', rating: 4.3, people: 2, place: '工行门', price: 10, time: '11:00 - 22:30', likes: 1, hot: 80, target: 'stalls' },
  { name: '夜宵炒面王', area: 'qiaoyuan', cat: ['粉面', '主食'], photo: '/assets/source-fidelity/commercial/05-come-on.jpg', rating: 4.1, people: 7, place: '工行门', price: 11, time: '19:00 - 01:00', likes: 2, hot: 70, target: 'stalls' },
  { name: '林胡子猪脚饭', area: 'qiaoyuan', cat: ['主食'], photo: '/assets/source-fidelity/stalls/linhuzi.jpeg', rating: 4.6, people: 12, place: '学四门', price: 15, time: '17:00 - 23:00', likes: 5, hot: 95, target: 'linhuzi-reviews' },

  { name: '韩国风味', area: 'shangye', cat: ['主食', '小吃'], photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', rating: 4.4, people: 143, place: '大厅左', price: 16, time: '08:00 - 20:00', likes: 4, hot: 90, target: 'mall' },
  { name: '老上海馄饨铺', area: 'shangye', cat: ['主食', '小吃'], photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', rating: 4.4, people: 165, place: '大厅中', price: 9, time: '全天营业', likes: 8, hot: 97, target: 'mall' },
  { name: '功夫小茗', area: 'shangye', cat: ['饮品'], photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', rating: 4.3, people: 71, place: '大厅中', price: 8, time: '全天营业', likes: 6, hot: 92, target: 'mall' },
  { name: 'Come On 潮味', area: 'shangye', cat: ['主食'], photo: '/assets/source-fidelity/commercial/05-come-on.jpg', rating: 4.5, people: 79, place: '大厅右', price: 13, time: '全天营业', likes: 3, hot: 86, target: 'mall' },
  { name: '关东煮小铺', area: 'shangye', cat: ['小吃'], photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', rating: 4.2, people: 33, place: '小吃街', price: 7, time: '10:00 - 22:00', likes: 2, hot: 78, target: 'mall' },
  { name: '老潼关肉夹馍', area: 'shangye', cat: ['主食', '小吃'], photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg', rating: 5.0, people: 50, place: '天桥附近二楼', price: 12, time: '全天营业', likes: 7, hot: 88, target: 'laotongguan-message' },
  { name: '广式鸡蛋仔', area: 'shangye', cat: ['小吃'], photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', rating: 4.1, people: 26, place: '大厅前', price: 8, time: '10:00 - 21:30', likes: 3, hot: 72, target: 'mall' },
  { name: '东北水饺馆', area: 'shangye', cat: ['主食', '粉面'], photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', rating: 4.5, people: 58, place: '大厅后', price: 15, time: '09:30 - 21:00', likes: 5, hot: 81, target: 'mall' },
  { name: '鲜果时光', area: 'shangye', cat: ['饮品'], photo: '/assets/source-fidelity/commercial/05-come-on.jpg', rating: 4.2, people: 19, place: '京东一路', price: 9, time: '10:00 - 22:00', likes: 2, hot: 70, target: 'mall' },
  { name: '博联烤肉饭', area: 'shangye', cat: ['主食'], photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', rating: 4.6, people: 41, place: '小博联区', price: 16, time: '11:00 - 20:30', likes: 4, hot: 83, target: 'mall' },
  { name: '大博联炸鸡铺', area: 'shangye', cat: ['小吃'], photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg', rating: 4.3, people: 37, place: '大博联区', price: 14, time: '11:30 - 22:00', likes: 6, hot: 79, target: 'mall' },
  { name: '古茗旁煎饼摊', area: 'shangye', cat: ['主食', '小吃'], photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', rating: 4.4, people: 30, place: '古茗附近', price: 7, time: '06:30 - 10:00 / 16:00 - 22:00', likes: 5, hot: 76, target: 'mall' },
  { name: '猪大哈猪脚饭', area: 'shangye', cat: ['主食'], photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', rating: 4.7, people: 63, place: '猪大哈区', price: 15, time: '10:30 - 20:30', likes: 8, hot: 87, target: 'mall' },

  { name: '菊苑小炒', area: 'fentang', cat: ['主食'], photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', rating: 4.7, people: 23, place: '菊苑二楼', price: 11, time: '06:30 - 13:00 / 16:30 - 20:30', likes: 5, hot: 85, target: 'canteen' },
  { name: '遇见汤饭', area: 'fentang', cat: ['主食'], photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', rating: 4.9, people: 1, place: '菊苑二楼', price: 12, time: '全天营业', likes: 0, hot: 78, target: 'canteen' },
  { name: '兰苑烧腊档', area: 'fentang', cat: ['主食', '小吃'], photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', rating: 4.6, people: 31, place: '兰苑二楼', price: 13, time: '10:30 - 20:00', likes: 4, hot: 88, target: 'canteen' },
  { name: '渝记麻辣烫', area: 'fentang', cat: ['小吃', '粉面'], photo: '/assets/source-fidelity/commercial/05-come-on.jpg', rating: 4.7, people: 45, place: '兰苑三楼', price: 15, time: '11:00 - 21:30', likes: 6, hot: 90, target: 'canteen' },
  { name: '梅苑饺子馆', area: 'fentang', cat: ['主食', '粉面'], photo: '/assets/source-fidelity/commercial/05-come-on.jpg', rating: 4.8, people: 37, place: '梅苑二楼', price: 11, time: '07:00 - 20:00', likes: 5, hot: 89, target: 'canteen' },
  { name: '台式便当', area: 'fentang', cat: ['主食'], photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg', rating: 4.4, people: 19, place: '梅苑二楼', price: 14, time: '10:30 - 19:30', likes: 2, hot: 79, target: 'canteen' },
  { name: '港式茶餐厅', area: 'fentang', cat: ['小吃', '饮品'], photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', rating: 4.6, people: 28, place: '梅苑三楼', price: 18, time: '11:00 - 21:00', likes: 4, hot: 84, target: 'canteen' },
];

// V5 首页通知弹窗里的两条通知：title 标题、date 右上角日期、text 正文
export const v5Notices = [
  {
    title: '全新改版上线',
    date: '10-13',
    text: '感谢大家一直以来的陪伴与支持！本次改版带来了全新的首页与自提点餐体验，还上线了「今天吃什么」盲盒抽签，帮你解决每一顿的选择困难。店铺评分、收藏与好友发现也同步升级，欢迎体验并告诉我们你的想法。',
  },
  {
    title: '桥苑小摊营业时间调整',
    date: '10-11',
    text: '工行门、学四门各小摊即日起统一 17:00 后出摊，夜宵档延长至 23:30；徐豆豆糖水摊调整为 11:00 ~ 22:30。请大家合理安排觅食时间，别跑空啦。',
  },
];

// V5 搜索页的「热门搜索」词
export const v5HotWords = ['徐豆豆', '桥苑铁板烧', '糖水', '猪脚饭', '麻辣烫', '饭堂二楼'];

// V5 进店逛的三个分区：id 对应店铺数据里的 area，lead 是顶部那行小字
export const v5Zones = [
  { id: 'qiaoyuan', label: '桥苑小摊', lead: '工行门 · 学四门的烟火气' },
  { id: 'shangye', label: '商业中心', lead: '天桥附近，一条街吃遍' },
  { id: 'fentang', label: '庆园饭堂', lead: '菊苑 · 兰苑 · 梅苑，今天吃哪个苑' },
];

// V5 进店逛顶部的品类筛选
export const v5CategoryChips = ['全部分类', '主食', '饮品', '小吃', '粉面'];

/* 注意：灵感池改为参考稿那 12 条（带 k 关键词和配色），
   定义在文件末尾「V5 五个子页面的数据」那一节里，这里不再重复导出 */

// V5 人格食堂（首页「MBTI食堂」进入）的 16 型人格
export const v5MbtiList = [
  { type: 'INTJ', tag: '冷静规划家', line: '效率优先，别让我排队' },
  { type: 'INTP', tag: '好奇脑洞王', line: '想吃点没吃过的' },
  { type: 'ENTJ', tag: '行动派', line: '说走就走，别纠结' },
  { type: 'ENTP', tag: '点子制造机', line: '今天想换换口味' },
  { type: 'INFJ', tag: '安静理想派', line: '找个不吵的角落' },
  { type: 'INFP', tag: '温柔造梦者', line: '想吃点治愈的东西' },
  { type: 'ENFJ', tag: '热心组织者', line: '把大家叫上一起吃' },
  { type: 'ENFP', tag: '快乐源泉', line: '吃之前先拍照' },
  { type: 'ISTJ', tag: '稳重可靠款', line: '老样子，别换' },
  { type: 'ISFJ', tag: '贴心照顾型', line: '热乎的、家常的' },
  { type: 'ESTJ', tag: '效率执行者', line: '快、稳、管饱' },
  { type: 'ESFJ', tag: '氛围担当', line: '吃饭要有人一起' },
  { type: 'ISTP', tag: '低调动手派', line: '随便，能吃饱就行' },
  { type: 'ISFP', tag: '慢生活爱好者', line: '想吃点清爽的' },
  { type: 'ESTP', tag: '现场行动派', line: '哪家近吃哪家' },
  { type: 'ESFP', tag: '气氛组C位', line: '热闹的地方才是好地方' },
];

// 好友页「可能想认识的人」
export const friendRecommendations = [
  { name: '微信用户', id: 'QUICK07260312_0…' },
  { name: '微信用户', id: 'QUICK62765708_0…' },
];

// 好友列表：名字 + 个性签名
export const friends = [
  { name: '微信用户111111111111111', note: '此处无声胜有声' },
  { name: '微信用户', note: '~！ @测试' },
  { name: 'Yilena', note: '保持热爱' },
];

/* ==========================================================
   V5 新版 · 五个子页面的数据
   （今天吃什么盲盒机 / 今天做什么灵感小盒 / MBTI食堂 / 店铺详情 / 我的收藏）
   数据照搬参考稿 庆快校园-V5新版.html，图片映射到项目现有资源
   ========================================================== */

// 图片映射：参考稿用 img/shop-*.jpg，这里换成项目里真实存在的图
const V5_IMG = {
  stall: '/assets/source-fidelity/stalls/xudoudou.jpeg',
  veg: '/assets/source-fidelity/stalls/quanji.jpeg',
  meat: '/assets/source-fidelity/stalls/linhuzi.jpeg',
  noodle: '/assets/source-fidelity/commercial/05-come-on.jpg',
  wonton: '/assets/source-fidelity/commercial/02-laoshanghai.jpg',
  tea: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg',
};
const IM = (k) => V5_IMG[k];

/* 今天吃什么 · 盲盒机的店铺池（21 家）
   area: qiaoyuan 校园小摊 / shangye 商中店铺 / fentang 饭堂店铺
   cat: 品类标签，用于「口味」筛选
   price: 人均，用于「人均」筛选
   rest: true 表示今天休息中（不计入营业中数量）
   ct/fl: 饭堂归属（菊苑/兰苑/梅苑 + 楼层）
*/
export const v5Shops = [
  { name: '徐豆豆', img: IM('stall'), area: 'qiaoyuan', cat: ['饮品', '糖水'], rating: 4.2, people: 4, price: 10, pos: '工行门 · 工行门附近', time: '11:00 ~ 22:30', likes: 0, hot: 60, rest: true },
  { name: '全记', img: IM('veg'), area: 'qiaoyuan', cat: ['炒粉', '主食'], rating: 4.3, people: 2, price: 10, pos: '工行门 · 工行门附近', time: '11:00 ~ 22:30', likes: 1, hot: 80 },
  { name: '桥苑铁板烧', img: IM('meat'), area: 'qiaoyuan', cat: ['小吃', '主食'], rating: 4.6, people: 12, price: 15, pos: '学四门 · 小摊集中区', time: '17:00 ~ 23:00', likes: 5, hot: 95 },
  { name: '夜宵炒面王', img: IM('noodle'), area: 'qiaoyuan', cat: ['粉面', '主食'], rating: 4.1, people: 7, price: 11, pos: '工行门 · 夜市口', time: '19:00 ~ 01:00', likes: 2, hot: 70, rest: true },

  { name: '隆江猪脚饭', img: IM('meat'), area: 'shangye', cat: ['主食'], rating: 4.9, people: 50, price: 14, pos: '天桥附近二楼', time: '全天营业', likes: 12, hot: 99 },
  { name: '北京炸酱面 · 武汉热干面', img: IM('noodle'), area: 'shangye', cat: ['粉面'], rating: 5.0, people: 1, price: 12, pos: '小吃街', time: '全天营业', likes: 0, hot: 88 },
  { name: '老上海馄饨铺', img: IM('wonton'), area: 'shangye', cat: ['主食', '小吃'], rating: 4.4, people: 165, price: 9, pos: '大厅中', time: '全天营业', likes: 8, hot: 97 },
  { name: '功夫小茗', img: IM('tea'), area: 'shangye', cat: ['饮品'], rating: 4.3, people: 71, price: 8, pos: '大厅中', time: '全天营业', likes: 6, hot: 92, rest: true },
  { name: '韩国风味', img: IM('meat'), area: 'shangye', cat: ['主食', '小吃'], rating: 4.4, people: 143, price: 16, pos: '大厅左', time: '08:00 ~ 20:00', likes: 4, hot: 90 },
  { name: 'Come On 潮味', img: IM('noodle'), area: 'shangye', cat: ['主食'], rating: 4.5, people: 79, price: 13, pos: '大厅右', time: '全天营业', likes: 3, hot: 86 },

  { name: '遇见汤饭', img: IM('veg'), area: 'fentang', ct: '菊苑', fl: '二楼', cat: ['主食'], rating: 4.9, people: 1, price: 12, pos: '菊苑二楼', time: '全天营业', likes: 0, hot: 78 },
  { name: '泰美味盖浇饭', img: IM('meat'), area: 'fentang', ct: '菊苑', fl: '二楼', cat: ['主食'], rating: 4.9, people: 1, price: 13, pos: '菊苑二楼', time: '全天营业', likes: 1, hot: 74 },
  { name: '环球美食', img: IM('tea'), area: 'fentang', ct: '菊苑', fl: '二楼', cat: ['小吃', '饮品'], rating: 4.8, people: 6, price: 15, pos: '菊苑二楼', time: '全天营业', likes: 2, hot: 72 },
  { name: '菊苑小炒', img: IM('veg'), area: 'fentang', ct: '菊苑', fl: '二楼', cat: ['主食'], rating: 4.7, people: 23, price: 11, pos: '菊苑二楼', time: '06:30 ~ 13:00 / 16:30 ~ 20:30', likes: 5, hot: 85 },
  { name: '风味扒饭', img: IM('meat'), area: 'fentang', ct: '菊苑', fl: '二楼', cat: ['主食'], rating: 4.6, people: 18, price: 14, pos: '菊苑二楼', time: '全天营业', likes: 3, hot: 80 },

  { name: '兰苑烧腊档', img: IM('meat'), area: 'fentang', ct: '兰苑', fl: '二楼', cat: ['主食', '小吃'], rating: 4.6, people: 31, price: 13, pos: '兰苑二楼', time: '10:30 ~ 20:00', likes: 4, hot: 88 },
  { name: '湘味小炒', img: IM('veg'), area: 'fentang', ct: '兰苑', fl: '二楼', cat: ['主食'], rating: 4.5, people: 22, price: 12, pos: '兰苑二楼', time: '10:30 ~ 20:00', likes: 3, hot: 82 },
  { name: '渝记麻辣烫', img: IM('noodle'), area: 'fentang', ct: '兰苑', fl: '三楼', cat: ['小吃', '粉面'], rating: 4.7, people: 45, price: 15, pos: '兰苑三楼', time: '11:00 ~ 21:30', likes: 6, hot: 90 },

  { name: '梅苑饺子馆', img: IM('wonton'), area: 'fentang', ct: '梅苑', fl: '二楼', cat: ['主食', '粉面'], rating: 4.8, people: 37, price: 11, pos: '梅苑二楼', time: '07:00 ~ 20:00', likes: 5, hot: 89 },
  { name: '台式便当', img: IM('meat'), area: 'fentang', ct: '梅苑', fl: '二楼', cat: ['主食'], rating: 4.4, people: 19, price: 14, pos: '梅苑二楼', time: '10:30 ~ 19:30', likes: 2, hot: 79 },
  { name: '港式茶餐厅', img: IM('tea'), area: 'fentang', ct: '梅苑', fl: '三楼', cat: ['小吃', '饮品'], rating: 4.6, people: 28, price: 18, pos: '梅苑三楼', time: '11:00 ~ 21:00', likes: 4, hot: 84, rest: true },
];

// 盲盒机筛选行的选项
export const v5Scopes = [
  { key: 'all', label: '全校随心' },
  { key: 'shangye', label: '商中店铺' },
  { key: 'fentang', label: '饭堂店铺' },
  { key: 'qiaoyuan', label: '校园小摊' },
];
export const v5Tastes = [
  { key: 'all', label: '不挑口味' },
  { key: '主食', label: '主食' },
  { key: '饮品', label: '饮品' },
  { key: '小吃', label: '小吃' },
  { key: '粉面', label: '粉面' },
];
export const v5Prices = [
  { key: 'all', label: '不限' },
  { key: '10', label: '¥10 以下' },
  { key: '15', label: '¥10 ~ 15' },
  { key: '99', label: '¥15 以上' },
];
// 区域中文名（卡片角标、筛选结果用）
export const v5AreaLabel = { qiaoyuan: '校园小摊', shangye: '商中店铺', fentang: '饭堂店铺' };
// 盲盒外壳颜色，随机给抽中的盒子上色
export const v5BoxColors = ['#F6F1E7', '#E4B5B6', '#A3C9B8', '#A8B9CC', '#F5E2A4'];

/* 今天做什么 · 灵感小盒
   t 主文案 / k 关键词（评论里替换用）/ cat 分类 / c 卡片底色 / tc 文字色 / s 副标题
*/
export const v5Ideas = [
  { t: '泡两小时图书馆', k: '泡图书馆', cat: '学习', c: '#D9E4C9', tc: '#5E7350', s: '把落下的进度补回来' },
  { t: '早睡一次，明早去晨读', k: '晨读', cat: '学习', c: '#D9E4C9', tc: '#5E7350', s: '试试清晨的校园' },
  { t: '操场夜跑三圈', k: '夜跑', cat: '运动', c: '#CBDCEF', tc: '#5A7B96', s: '出出汗，晚风很舒服' },
  { t: '打一场羽毛球', k: '打球', cat: '运动', c: '#CBDCEF', tc: '#5A7B96', s: '约上球友，动起来' },
  { t: '和室友去南门夜市逛吃', k: '逛夜市', cat: '美食', c: '#F2D7D3', tc: '#96655C', s: '边走边吃才是正经事' },
  { t: '解锁一家没吃过的桥苑小摊', k: '探摊', cat: '美食', c: '#F2D7D3', tc: '#96655C', s: '抽完顺手扭个店' },
  { t: '看一部收藏很久的电影', k: '看电影', cat: '休闲', c: '#F4E8C6', tc: '#8A7748', s: '关掉消息，专心看完' },
  { t: '拍一组校园晚霞', k: '拍晚霞', cat: '休闲', c: '#F4E8C6', tc: '#8A7748', s: '日落前出门正正好' },
  { t: '写手账记录今天', k: '写手账', cat: '休闲', c: '#F4E8C6', tc: '#8A7748', s: '小事也值得记下来' },
  { t: '约好友拼一局桌游', k: '打桌游', cat: '社交', c: '#DED8EA', tc: '#77688E', s: '输赢不重要，开心就好' },
  { t: '给朋友带杯奶茶', k: '带奶茶', cat: '社交', c: '#DED8EA', tc: '#77688E', s: '友谊有时候是甜的' },
  { t: '整理相册，发一条动态', k: '发动态', cat: '社交', c: '#DED8EA', tc: '#77688E', s: '把今天分享出去' },
];
// 扭蛋机里 13 颗玻璃珠的位置（百分比）与配色
export const v5OrbColors = ['#F2D7D3', '#CBDCEF', '#D9E4C9', '#F4E8C6', '#DED8EA'];
export const v5OrbPos = [[6, 4], [30, 0], [54, 3], [78, 7], [0, 30], [24, 27], [48, 32], [72, 29], [8, 58], [32, 56], [56, 61], [80, 57], [44, 82]];

/* 灵感小盒 · 发布弹窗
   quickTags 一键贴的心情标签；peers 是「N 位同学今天也在做这件事」那排头像的配色
*/
export const v5IdeaQuickTags = ['一个人去', '求组队！', '刚刚做完', '求推荐同款'];
export const v5IdeaPeers = ['#D9E4C9', '#CBDCEF', '#F2D7D3'];

/* 灵感小盒 · 评论区
   用灵感的关键词 k 分组，每组 3 条；ac 头像底色 / n 昵称 / t 时间 / txt 内容 / like 赞数
   想改评论文案直接在这里改，页面不用动
*/
export const v5IdeaComments = {
  泡图书馆: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人坐着太容易刷手机了', like: 4, id: 'c1', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '三楼靠窗位置安静，强烈推荐', like: 12, id: 'c2', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚从图书馆出来，确实值得', like: 8, id: 'c3', replies: [], },
  ],
  晨读: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '明早六点半湖边见，有人来吗', like: 4, id: 'c4', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '晨读完去吃早饭，一整天都舒服', like: 12, id: 'c5', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '坚持了三天，确实清醒很多', like: 8, id: 'c6', replies: [], },
  ],
  夜跑: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人跑两圈就放弃了', like: 4, id: 'c7', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '跑完拉伸别忘了，不然明天腿酸', like: 12, id: 'c8', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚跑完三圈，晚风确实舒服', like: 8, id: 'c9', replies: [], },
  ],
  打球: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，缺一个人就能开双打', like: 4, id: 'c10', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '羽毛球场晚上七点后要排队', like: 12, id: 'c11', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚打完，出汗真的解压', like: 8, id: 'c12', replies: [], },
  ],
  逛夜市: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人逛吃不划算', like: 4, id: 'c13', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '南门那家烤冷面一定要加蛋', like: 12, id: 'c14', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚逛回来，四个人吃六样刚好', like: 8, id: 'c15', replies: [], },
  ],
  探摊: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，新摊位想找人一起试', like: 4, id: 'c16', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '桥苑最里面那家是新开的', like: 12, id: 'c17', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚解锁一家，意外地好吃', like: 8, id: 'c18', replies: [], },
  ],
  看电影: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人看太安静了', like: 4, id: 'c19', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '关掉消息专心看完，体验完全不同', like: 12, id: 'c20', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚看完，值回票价', like: 8, id: 'c21', replies: [], },
  ],
  拍晚霞: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，想找人一起蹲日落', like: 4, id: 'c22', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '操场看台那个角度最好出片', like: 12, id: 'c23', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚拍完，今天云层特别好看', like: 8, id: 'c24', replies: [], },
  ],
  写手账: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求推荐同款本子和胶带', like: 4, id: 'c25', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '只写三行也行，别给自己压力', like: 12, id: 'c26', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚写完，回头翻真的会笑', like: 8, id: 'c27', replies: [], },
  ],
  打桌游: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，还差两个人就能开局', like: 4, id: 'c28', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '狼人杀缺一，来就来', like: 12, id: 'c29', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚打完一局，笑到肚子疼', like: 8, id: 'c30', replies: [], },
  ],
  带奶茶: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求推荐同款，哪家奶茶不踩雷', like: 4, id: 'c31', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '三分糖去冰，基本不会错', like: 12, id: 'c32', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚被请了一杯，心情很好', like: 8, id: 'c33', replies: [], },
  ],
  发动态: [
    { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人发动态太孤单了', like: 4, id: 'c34', replies: [], },
    { n: '橙子', t: '2分钟前', ac: '#F4E8C6', txt: '发动态我在行，要不要给你支两招', like: 12, id: 'c35', replies: [], },
    { n: '阿泽', t: '5分钟前', ac: '#D9E4C9', txt: '刚做完发动态，确实值得，强烈推荐', like: 8, id: 'c36', replies: [], },
  ],
};

/* 好友页「好友动态」的初始内容：模拟别人已经发出来的灵感
   ac 头像底色 / n 昵称 / t 时间 / cat 分类 / txt 话题 / body 正文 / like 赞 / cmt 评论数
   我自己发出来的会插到最前面，所以这里只放别人的
*/
export const v5FriendFeed = [
  { ac: '#CBDCEF', n: '阿梨', t: '12分钟前', cat: '运动', txt: '操场夜跑三圈', body: '求组队，一个人跑两圈就放弃了', like: 18, cmt: 5, anon: false },
  { ac: '#F4E8C6', n: '橙子', t: '1小时前', cat: '美食', txt: '解锁一家没吃过的桥苑小摊', body: '今天试了桥苑最里面那家，意外地好吃', like: 31, cmt: 9, anon: false },
  { ac: '#D9E4C9', n: '阿泽', t: '2小时前', cat: '休闲', txt: '拍一组校园晚霞', body: '看台那个角度真的出片，明天还去', like: 24, cmt: 3, anon: false },
];

/* MBTI食堂 · 6 道题
   d 维度 / qt 题干 / hint 提示 / a、b 两个选项
*/
export const v5MbtiQuiz = [
  { d: 'EI', qt: '中午下课铃响了', hint: '你下意识会怎么吃', a: '找个人少的角落，一个人安静吃完', b: '在群里喊一嗓子，凑满三个人再走' },
  { d: 'SN', qt: '站在菜单前', hint: '三秒内你会点哪个', a: '那道吃了三年的，闭着眼都不会错', b: '没见过的那道，今天就想试试' },
  { d: 'TF', qt: '挑店这件事', hint: '你更信哪个', a: '评分、性价比、出餐速度，算清楚再定', b: '不管了，今天馋什么就吃什么' },
  { d: 'JP', qt: '出门吃饭前', hint: '你的真实状态', a: '先刷好攻略，连点什么菜都想好了', b: '走到哪吃到哪，撞上哪家算哪家' },
  { d: 'EI', qt: '南门新开了一家网红店', hint: '你的第一反应', a: '等这阵风头过了再说', b: '现在就去，还要拍照发动态' },
  { d: 'JP', qt: '排了二十分钟，发现不好吃', hint: '然后呢', a: '立刻换一家，不能白跑一趟', b: '算了，吃完还要赶下一节课' },
];
/* MBTI食堂 · 16 型人格
   nm 名称 / ds 一句话描述 / s 推荐的三家店（店名要和 v5Shops 对得上）
*/
export const v5MbtiTypes = {
  INTJ: { nm: '建筑师型', ds: '把吃饭当任务，效率是最高美德', s: ['隆江猪脚饭', '环球美食', '台式便当'] },
  INTP: { nm: '逻辑学家型', ds: '为了搞清哪家最好吃，先列个表', s: ['环球美食', '菊苑小炒', '老上海馄饨铺'] },
  ENTJ: { nm: '指挥官型', ds: '我选店，你们跟上就行', s: ['Come On 潮味', '桥苑铁板烧', '港式茶餐厅'] },
  ENTP: { nm: '辩论家型', ds: '菜单上没见过的，才是今天的正确答案', s: ['韩国风味', '徐豆豆', '湘味小炒'] },
  INFJ: { nm: '提倡者型', ds: '一个人吃饭不是孤独，是给自己充电', s: ['遇见汤饭', '老上海馄饨铺', '梅苑饺子馆'] },
  INFP: { nm: '调停者型', ds: '好不好吃是其次，气氛得对', s: ['功夫小茗', '遇见汤饭', '老上海馄饨铺'] },
  ENFJ: { nm: '主人公型', ds: '聚餐我组，店我定，你们人到就行', s: ['港式茶餐厅', '菊苑小炒', 'Come On 潮味'] },
  ENFP: { nm: '快乐小狗型', ds: '今天想吃火锅明天想吃日料，先走再说', s: ['泰美味盖浇饭', '徐豆豆', '环球美食'] },
  ISTJ: { nm: '物流师型', ds: '固定窗口，固定那道菜，别问为什么', s: ['风味扒饭', '台式便当', '隆江猪脚饭'] },
  ISFJ: { nm: '守卫者型', ds: '阿姨多打一勺，能开心一整天', s: ['菊苑小炒', '兰苑烧腊档', '梅苑饺子馆'] },
  ESTJ: { nm: '总经理型', ds: '说好吃这家就这家，别临时换', s: ['兰苑烧腊档', '北京炸酱面 · 武汉热干面', '港式茶餐厅'] },
  ESFJ: { nm: '执政官型', ds: '这家好吃，我得安利给全宿舍', s: ['菊苑小炒', '桥苑铁板烧', '功夫小茗'] },
  ISTP: { nm: '鉴赏家型', ds: '出餐快、能吃饱、别排队，完事', s: ['夜宵炒面王', '台式便当', '风味扒饭'] },
  ISFP: { nm: '探险家型', ds: '看到哪家顺眼，今天就是它了', s: ['渝记麻辣烫', '徐豆豆', '遇见汤饭'] },
  ESTP: { nm: '企业家型', ds: '网红店？现在就去排队', s: ['桥苑铁板烧', 'Come On 潮味', '韩国风味'] },
  ESFP: { nm: '表演者型', ds: '吃饭是社交，一个人吃那只能叫充饥', s: ['泰美味盖浇饭', '环球美食', '湘味小炒'] },
};

/* 我的收藏 · 三类收藏的初始内容（存的是店铺名，详情从 v5Shops 取） */
export const v5Favorites = {
  shop: ['Come On 潮味', '隆江猪脚饭', '渝记麻辣烫'],
  stall: [],
  content: [],
};
// 收藏页三类为空时的提示语
export const v5FavEmpty = {
  shop: '把喜欢留住，下次再来',
  stall: '看到心动的小摊，点收藏留住它',
  content: '收藏的图书馆座位会出现在这里',
};

/* 店铺详情 · 示例数据（隆江猪脚饭，参考稿截图里那家） */
export const v5DetailDemo = {
  name: '隆江猪脚饭',
  img: IM('meat'),
  area: 'shangye',
  rating: 4.9,
  people: 50,
  price: 14,
  time: '全天营业',
  pos: '天桥附近二楼',
  tags: ['主食', '商中店铺'],
  desc: '肥瘦可选，卤汁拌饭一绝，中午 12 点之后基本要排队，去晚了就没了。',
  exploring: 5,
  week: { visitors: 10, views: 968, share: '51.0%' },
  hot: 99,
  likes: 12,
};

/* ==========================================================
   校园 · 三个新板块
   失物招领（找东西 / 捡到了）｜闲置小铺（出二手）｜搭把手（有偿互助）
   字段说明：
     ac 头像底色 / n 发布人 / t 时间 / st 状态徽标
   想改文案直接改这里，页面不用动
   ========================================================== */

/* ---------- 失物招领 ---------- */
export const v5LostTabs = [
  { id: 'lost', label: '找东西' },
  { id: 'found', label: '捡到了' },
];
export const v5LostCats = ['证件', '数码', '书籍', '生活', '其他'];
export const v5LostItems = [
  {
    id: 'l1', campus: '大学城校区', kind: 'lost', title: '黑色小米充电宝', cat: '数码',
    desc: '10000 毫安那款，边角有一点磕痕，落在三教 305 靠窗那排座位了。',
    place: '三教 305', time: '周二下午', n: '林小满', ac: '#CBDCEF',
    st: '寻找中', reward: '找到了请喝奶茶', contact: '微信同号，看到请联系我',
    cmts: [
      { n: '阿泽', t: '10分钟前', ac: '#D9E4C9', txt: '三教 305 我今天下午也在，帮你问了保洁阿姨', like: 3, id: 'c37', replies: [], },
      { n: '橙子', t: '半小时前', ac: '#F4E8C6', txt: '去失物招领处登记了吗，一般在教学楼一楼', like: 5, id: 'c38', replies: [], },
    ],
  },
  {
    id: 'l2', campus: '大学城校区', kind: 'lost', title: '钥匙串（挂蓝色小熊）', cat: '生活',
    desc: '三把钥匙加一个蓝色小熊挂件，晚上跑完操发现没了，可能是掉在看台附近。',
    place: '操场看台', time: '周三晚上', n: '我', mine: true, ac: '#F2D7D3',
    st: '寻找中', reward: '当面感谢 + 一盒水果', contact: '下课都在操场，可以直接送来',
    cmts: [
      { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '看到看台第二排有一串，你去看下是不是', like: 7, id: 'c39', replies: [], },
    ],
  },
  {
    id: 'l3', campus: '桂花岗校区', kind: 'lost', title: '学生证（张三）', cat: '证件',
    desc: '夹在一本蓝色笔记本里一起丢的，本子上有我的名字。补办要跑好几趟，麻烦大家留意。',
    place: '商业中心', time: '周一下午', n: '张三', ac: '#D9E4C9',
    st: '寻找中', reward: '必有重谢', contact: '捡到请放到商业中心服务台',
    cmts: [
      { n: '橙子', t: '1小时前', ac: '#F4E8C6', txt: '服务台那边我帮你问过了，暂时没人送去', like: 4, id: 'c40', replies: [], },
      { n: '阿泽', t: '2小时前', ac: '#D9E4C9', txt: '补办其实可以在公众号上预约，不用排队', like: 9, id: 'c41', replies: [], },
    ],
  },
  {
    id: 'l4', campus: '大学城校区', kind: 'found', title: '捡到一副黑框眼镜', cat: '生活',
    desc: '二教 201 最后一排捡到的，眼镜布包着放在那儿，看着像刚丢的。',
    place: '二教 201', time: '今天上午', n: '阿梨', ac: '#CBDCEF',
    st: '待认领', reward: '', contact: '我来二教都带着，报度数就能拿走',
    cmts: [
      { n: '周周', t: '5分钟前', ac: '#F2D7D3', txt: '是不是 400 度那副，我室友丢了一副', like: 2, id: 'c42', replies: [], },
    ],
  },
  {
    id: 'l5', campus: '黄埔校区', kind: 'found', title: '捡到一本《高等数学》', cat: '书籍',
    desc: '书里夹着几张草稿纸，扉页没写名字，先放在图书馆二楼的失物架上了。',
    place: '图书馆二楼', time: '昨天傍晚', n: '阿泽', ac: '#D9E4C9',
    st: '待认领', reward: '', contact: '图书馆二楼东侧失物架，自己来拿',
    cmts: [
      { n: '橙子', t: '3小时前', ac: '#F4E8C6', txt: '应该是同济第七版吧，这本书人手一本', like: 6, id: 'c43', replies: [], },
    ],
  },
  {
    id: 'l6', campus: '桂花岗校区', kind: 'found', title: '捡到一把长柄雨伞', cat: '生活',
    desc: '深蓝色，伞面上有个小熊印花，食堂门口的伞架上拿的，应该是上周那场雨落下的。',
    place: '饭堂门口', time: '上周四', n: '我', mine: true, ac: '#F4E8C6',
    st: '已归还', reward: '', contact: '已经还给主人啦',
    cmts: [
      { n: '林小满', t: '1天前', ac: '#CBDCEF', txt: '谢谢！那把伞跟了我两年了', like: 12, id: 'c44', replies: [], },
    ],
  },
];

/* ---------- 闲置小铺（出二手） ---------- */
export const v5MarketCats = ['全部', '教材', '数码', '生活', '服饰'];
export const v5MarketItems = [
  {
    id: 'm1', campus: '大学城校区', title: '高等数学 同济第七版', cat: '教材', price: 15, old: 42, cond: '九成新',
    desc: '上册，只有前两章有少量笔记，其余干净，考试周翻得少。',
    place: '三教', n: '阿泽', ac: '#D9E4C9', st: '已预定', takenBy: '我',
    contact: '微信 aze_2023',
    cmts: [
      { n: '周周', t: '20分钟前', ac: '#F2D7D3', txt: '15 出吗，我下周要用到', like: 2, id: 'c45', replies: [], },
      { n: '橙子', t: '1小时前', ac: '#F4E8C6', txt: '这本教材二手很抢手，手慢无', like: 4, id: 'c46', replies: [], },
    ],
  },
  {
    id: 'm2', campus: '大学城校区', title: '小米蓝牙耳机', cat: '数码', price: 80, old: 199, cond: '九五成新',
    desc: '降噪款，买了半年，因为换了新的所以出。音质没问题，配件齐全。',
    place: '商业中心', n: '我', mine: true, ac: '#CBDCEF', st: '在售',
    contact: '微信 wode_wechat88',
    cmts: [
      { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '能便宜点吗，学生党预算有限', like: 3, id: 'c47', replies: [], },
    ],
  },
  {
    id: 'm3', campus: '桂花岗校区', title: '护眼台灯', cat: '生活', price: 25, old: 69, cond: '八成新',
    desc: '三档调光，触摸屏有点不灵但不影响用，毕业带不走。',
    place: '兰苑', n: '橙子', ac: '#F4E8C6', st: '在售',
    contact: '微信 cz_nanmen',
    cmts: [
      { n: '阿泽', t: '2小时前', ac: '#D9E4C9', txt: '自提还是能送，我在菊苑', like: 1, id: 'c48', replies: [], },
    ],
  },
  {
    id: 'm4', campus: '大学城校区', title: '26 寸自行车', cat: '生活', price: 120, old: 380, cond: '七成新',
    desc: '骑了两年，刹车刚换过，链条上过油。毕业出，可以试骑再决定。',
    place: '梅苑车棚', n: '张三', ac: '#D9E4C9', st: '在售',
    contact: '微信 zs_stu77',
    cmts: [
      { n: '林小满', t: '半天前', ac: '#CBDCEF', txt: '车还在吗，想下午去看', like: 2, id: 'c49', replies: [], },
    ],
  },
  {
    id: 'm5', campus: '黄埔校区', title: '现代汉语词典 第七版', cat: '教材', price: 20, old: 108, cond: '九成新',
    desc: '文学院专业课要用，几乎没翻过，塑封都还在。',
    place: '三教', n: '我', mine: true, ac: '#F2D7D3', st: '已预定', takenBy: '阿梨',
    contact: '微信 wode_wechat88',
    cmts: [
      { n: '阿梨', t: '3小时前', ac: '#CBDCEF', txt: '排我后面一个，我第二顺位', like: 1, id: 'c50', replies: [], },
    ],
  },
  {
    id: 'm6', campus: '大学城校区', title: '加厚羽绒服', cat: '服饰', price: 60, old: 299, cond: '八成新',
    desc: 'M 码，藏青色，去年买的穿了一冬。洗过了很干净，南方过冬够用。',
    place: '菊苑', n: '阿梨', ac: '#CBDCEF', st: '在售',
    contact: '微信 ali_book',
    cmts: [
      { n: '橙子', t: '5小时前', ac: '#F4E8C6', txt: '这个价格良心了', like: 5, id: 'c51', replies: [], },
    ],
  },
];

/* ---------- 搭把手（有偿互助） ---------- */
export const v5HelpTabs = [
  { id: 'need', label: '求助中' },
  { id: 'can', label: '可提供帮助' },
];
export const v5HelpKinds = ['代取快递', '代拿外卖', '帮忙占座', '代买东西', '搬东西'];
export const v5HelpItems = [
  /* h8 特意留一条还没人接的放在最前面：
     其余几条都配了订单（用来演示进行中的单子），要是全被接走，
     一进「求助中」就看不到「立即接单」了，演示走不通。 */
  {
    id: 'h8', campus: '大学城校区', kind: 'need', title: '搬一下行李（梅苑 3 栋楼下）', cat: '搬东西', fee: 8,
    desc: '两个行李箱加一床被子，从楼下搬到四楼。有点重，一个人扛不动。',
    place: '梅苑 3 栋', time: '今天 19:00 前', n: '周周', ac: '#F2D7D3', st: '等人接',
    contact: '微信 zhouzhou_24',
    cmts: [
      { n: '阿泽', t: '10分钟前', ac: '#D9E4C9', txt: '我刚好在梅苑，等会儿过去', like: 1, id: 'c58', replies: [], },
    ],
  },
  {
    id: 'h1', campus: '大学城校区', kind: 'need', title: '代取快递（菜鸟驿站）', cat: '代取快递', fee: 2,
    desc: '三个包裹，都不大。今天下午下课实在赶不回去，谁顺路帮拿下。',
    place: '菜鸟驿站', time: '今天 17:30 前', n: '林小满', ac: '#CBDCEF', st: '已接单',
    contact: '微信 linxm_0321',
    cmts: [
      { n: '阿泽', t: '刚刚', ac: '#D9E4C9', txt: '我五点正好去那边，可以接', like: 4, id: 'c52', replies: [], },
    ],
  },
  {
    id: 'h2', campus: '大学城校区', kind: 'need', title: '代拿外卖（南门）', cat: '代拿外卖', fee: 3,
    desc: '点的麻辣烫，商家已经出餐了。南门有点远，下不去楼。',
    place: '南门', time: '今晚 18:40', n: '我', mine: true, ac: '#F2D7D3', st: '已接单',
    contact: '微信 wode_wechat88',
    cmts: [
      { n: '橙子', t: '10分钟前', ac: '#F4E8C6', txt: '我正好在南门，联系我', like: 2, id: 'c53', replies: [], },
    ],
  },
  {
    id: 'h3', campus: '桂花岗校区', kind: 'need', title: '帮忙占个座（图书馆三楼）', cat: '帮忙占座', fee: 5,
    desc: '明天上午在图书馆三楼靠窗，谁先到帮我放本书占一下，我有偿。',
    place: '图书馆三楼', time: '明天 08:30', n: '张三', ac: '#D9E4C9', st: '已接单',
    contact: '微信 zs_stu77',
    cmts: [
      { n: '阿梨', t: '1小时前', ac: '#CBDCEF', txt: '我每天都去，明天帮你放', like: 6, id: 'c54', replies: [], },
    ],
  },
  {
    id: 'h4', campus: '大学城校区', kind: 'need', title: '代买一份水果', cat: '代买东西', fee: 2,
    desc: '想吃点橙子，楼下水果店买两三斤就行，我在宿舍不方便下去。',
    place: '桥苑水果店', time: '今天晚上', n: '我', mine: true, ac: '#CBDCEF', st: '已接单',
    contact: '微信 wode_wechat88',
    cmts: [
      { n: '林小满', t: '半小时前', ac: '#CBDCEF', txt: '接了，顺便给自己也带点', like: 3, id: 'c55', replies: [], },
    ],
  },
  {
    id: 'h5', campus: '大学城校区', kind: 'can', title: '顺路取快递，每天五点在驿站', cat: '代取快递', fee: 2,
    desc: '每天下午五点都会去菜鸟驿站，顺路带几个没问题，提前说一声就行。',
    place: '菜鸟驿站', time: '每天 17:00', n: '阿泽', ac: '#D9E4C9', st: '可接单',
    contact: '微信 aze_2023',
    cmts: [
      { n: '周周', t: '2小时前', ac: '#F2D7D3', txt: '靠谱，上次就是他帮我带的', like: 8, id: 'c56', replies: [], },
    ],
  },
  {
    id: 'h6', campus: '黄埔校区', kind: 'can', title: '代拿外卖，南门附近随叫随到', cat: '代拿外卖', fee: 3,
    desc: '宿舍在南门这边，下课都在。外卖到了喊我一声，两分钟就到。',
    place: '南门', time: '全天', n: '橙子', ac: '#F4E8C6', st: '可接单',
    contact: '微信 cz_nanmen',
    cmts: [
      { n: '张三', t: '3小时前', ac: '#D9E4C9', txt: '手脚很快，推荐', like: 5, id: 'c57', replies: [], },
    ],
  },
  {
    id: 'h7', campus: '桂花岗校区', kind: 'can', title: '帮忙装系统 / 修电脑', cat: '代买东西', fee: 0,
    desc: '计算机专业的，装系统、清灰、装软件都会，小问题不收钱，大问题看着给。',
    place: '三教', time: '课余时间', n: '张三', ac: '#D9E4C9', st: '可接单',
    contact: '微信 zs_stu77',
    cmts: [
      { n: '阿梨', t: '5小时前', ac: '#CBDCEF', txt: '上次帮我重装了一次，十分钟搞定', like: 11, id: 'c58', replies: [], },
    ],
  },
];

/* ---------- 任务订单 ----------
   接单后生成一单，双方看同一份：进度、互评、投诉都在里面。
   v5OrderStatus 是订单状态在页面上的中文说法；v5OrderReasons 是投诉时能选的原因 */
export const v5OrderStatus = {
  waiting: '待接单', taken: '已接单', done: '待确认', finished: '待互评', rated: '已结束',
};
export const v5OrderReasons = ['对方放鸽子', '一直联系不上', '态度不好', '任务跟说好的不一样', '别的，我来说'];
export const v5OrderSteps = [
  { id: 'taken', label: '已接单' },
  { id: 'done', label: '已完成' },
  { id: 'finished', label: '确认完成' },
  { id: 'rated', label: '互评结束' },
];
/* 闲置小铺走的也是同一套订单流程，只是说法不一样：
   买家点「我想要」= 已预定 → 买家拿到东西 → 卖家确认卖出 → 双方互评 */
export const v5OrderStepsMarket = [
  { id: 'taken', label: '已预定' },
  { id: 'done', label: '已拿到' },
  { id: 'finished', label: '确认卖出' },
  { id: 'rated', label: '互评结束' },
];
/* 闲置的订单状态：跟搭把手共用同一套 key，显示的字不一样 */
export const v5OrderStatusMarket = {
  waiting: '在售', taken: '已预定', done: '待确认', finished: '待互评', rated: '已结束',
};

/* ---------- 校园页三个板块的入口卡片 ---------- */
export const v5CampusBoards = [
  {
    id: 'lost', scene: 'v5-lost', name: '失物招领', lead: '找找看 / 捡到了就发一条',
    ico: 'bag', tint: '#CBDCEF', ink: '#5A7B96', count: 6, tag: '今天 3 条新消息',
  },
  {
    id: 'market', scene: 'v5-market', name: '闲置小铺', lead: '让旧物换个主人',
    ico: 'shirt', tint: '#F4E8C6', ink: '#8A7748', count: 6, tag: '教材最好出',
  },
  {
    id: 'help', scene: 'v5-help', name: '搭把手', lead: '代取快递、代拿外卖，顺手帮一把',
    ico: 'hand', tint: '#D9E4C9', ink: '#5E7350', count: 7, tag: '平均 ¥3 一单',
  },
];

/* ---------- 交友页 · 好友动态 ----------
   type: idea 灵感小盒 / mbti 人格 / friend 交友 / life 日常
   每条自带 comments，点「评论」展开
*/
export const v5FeedPosts = [
  {
    id: 'f1', type: 'idea', ac: '#D9E4C9', n: '阿泽', t: '12分钟前',
    cat: '运动', title: '操场夜跑三圈', body: '刚跑完，晚风很舒服，出了一身汗',
    like: 18, cmt: 2, liked: false,
    comments: [
      { n: '阿梨', t: '刚刚', ac: '#CBDCEF', txt: '求组队，一个人跑两圈就放弃了', like: 4, id: 'c59', replies: [], },
      { n: '橙子', t: '5分钟前', ac: '#F4E8C6', txt: '跑完记得拉伸，不然明天腿酸', like: 12, id: 'c60', replies: [], },
    ],
  },
  {
    id: 'f2', type: 'mbti', ac: '#DED8EA', n: '橙子', t: '1小时前',
    cat: 'INFP', title: '我的 MBTI 是 INFP', body: '测出来是调停者，食堂给我推了三家甜品店，还挺准',
    mbti: 'INFP', mbtiName: '调停者', mbtiDesc: '安静但有火，理想主义，对在意的事很固执',
    like: 42, cmt: 2, liked: false,
    comments: [
      { n: '周周', t: '半小时前', ac: '#F2D7D3', txt: '同 INFP！握个手', like: 9, id: 'c61', replies: [], },
      { n: '张三', t: '40分钟前', ac: '#D9E4C9', txt: '我是 ENTJ，我们刚好互补', like: 6, id: 'c62', replies: [], },
    ],
  },
  {
    id: 'f3', type: 'friend', ac: '#F2D7D3', n: '周周', t: '2小时前',
    cat: '找搭子', title: '找周末一起去市区的搭子', body: '想去看展，一个人去有点无聊，最好也是文学院的',
    like: 26, cmt: 2, liked: false,
    comments: [
      { n: '阿梨', t: '1小时前', ac: '#CBDCEF', txt: '我我我，我也想去那个展', like: 7, id: 'c63', replies: [], },
      { n: '林小满', t: '1小时前', ac: '#CBDCEF', txt: '带上我，三个人刚好', like: 3, id: 'c64', replies: [], },
    ],
  },
  {
    id: 'f4', type: 'idea', ac: '#F4E8C6', n: '阿梨', t: '3小时前',
    cat: '休闲', title: '拍一组校园晚霞', body: '看台那个角度真的出片，明天还想去',
    like: 31, cmt: 1, liked: false,
    comments: [
      { n: '阿泽', t: '2小时前', ac: '#D9E4C9', txt: '今天云层特别好看，拍到了吗', like: 5, id: 'c65', replies: [], },
    ],
  },
  {
    id: 'f6', type: 'friend', ac: '#D9E4C9', n: '我', t: '昨天', mine: true,
    cat: '找搭子', title: '周四下午图书馆四楼，有人一起刷题吗', body: '高数期中考前最后一次集中刷题，我带了整理好的错题本，来两三个人刚好',
    like: 7, cmt: 1, liked: false,
    comments: [
      { n: '周周', t: '10小时前', ac: '#F2D7D3', txt: '我去，带上我的卷子', like: 2, id: 'c65', replies: [], },
    ],
  },
  {
    id: 'f7', type: 'idea', ac: '#F4E8C6', n: '我', t: '两天前', mine: true,
    cat: '日常', title: '三教后门那排银杏黄了', body: '下午四点的光最好看，路过的人都停下来拍照，趁还没落叶赶紧去',
    like: 31, cmt: 1, liked: false,
    comments: [
      { n: '阿梨', t: '一天前', ac: '#CBDCEF', txt: '昨天去了，真的好看', like: 5, id: 'c66', replies: [], },
    ],
  },
  {
    id: 'f5', type: 'life', ac: '#CBDCEF', n: '林小满', t: '昨天',
    cat: '吐槽', title: '三教 305 的空调太冷了', body: '每次去复习都要带外套，有没有人同感',
    like: 58, cmt: 2, liked: false,
    comments: [
      { n: '张三', t: '昨天', ac: '#D9E4C9', txt: '同感，我都是坐最后一排', like: 14, id: 'c66', replies: [], },
      { n: '橙子', t: '昨天', ac: '#F4E8C6', txt: '可以跟楼管说一声调一下', like: 8, id: 'c67', replies: [], },
    ],
  },
];
/* 发动态时可选的四种类型 */
export const v5PostTypes = [
  { id: 'idea', label: '灵感' },
  { id: 'mbti', label: 'MBTI' },
  { id: 'friend', label: '找搭子' },
  { id: 'life', label: '日常' },
];

/* ---------- 我的页 ---------- */
export const v5MyStats = [
  { n: 23, l: '关注' }, { n: 5, l: '粉丝' }, { n: 14, l: '评分' }, { n: 13, l: '收藏' },
];
/* 注意：原来这里有「我的工具」三项（头像商城 / 签到 / 我的积分），
   2026-10-29 按需求删掉了，改成了「新增关注」「我的通知」两个入口条。
   图标 shop / checkin / point 还留在 src/v5-icons.js 里没删，以后要用直接调 */
export const v5MyServices = [
  { ico: 'feedback', tint: '#F2D7D3', ink: '#9C6A60', name: '反馈' },
  { ico: 'notice', tint: '#F4E8C6', ink: '#8A7748', name: '通知' },
  { ico: 'contact', tint: '#CBDCEF', ink: '#4E7FA8', name: '联系我们' },
  { ico: 'map', tint: '#D9E4C9', ink: '#5E7350', name: '地图' },
  { ico: 'about', tint: '#DED8EA', ink: '#77688E', name: '关于我们' },
  { ico: 'setting', tint: '#E7E3D8', ink: '#7B776E', name: '设置' },
];

/* ==========================================================
   我的 · 「我的发布」
   ========================================================== */
/* 「我的发布」页的分类 tab。
   哪几条算「我发的」：fixtures 里标了 mine: true 的那几条，
   加上在页面上现发一条（v5BoardPublish 会带上 mine: true） */
export const v5MyPostTabs = [
  { id: 'all', label: '全部' },
  { id: 'help', label: '搭把手' },
  { id: 'lost', label: '失物' },
  { id: 'market', label: '闲置' },
  { id: 'feed', label: '交友' },
];

/* 投诉时能选的原因：内容、动态、人都用这一套 */
export const v5ReportReasons = ['内容不合适', '广告或骚扰', '冒充别人', '说话难听 / 人身攻击', '信息是假的', '别的，我来说'];

/* ==========================================================
   我的 · 「新增关注」与「通知中心」
   ========================================================== */

/* ---------- 新增关注：谁关注了我 ----------
   n 昵称 / ac 头像底色 / t 时间 / bio 一句话 / isNew 是不是新关注的
   mutual 共同关注数 / back 是否已回关
*/
export const v5FollowTabs = [
  { id: 'fans', label: '新增关注' },
  { id: 'mine', label: '我的关注' },
];
export const v5Followers = [
  {
    id: 'u1', n: '阿梨', ac: '#CBDCEF', t: '2分钟前', isNew: true, mutual: 3,
    bio: '文学院 · 喜欢拍照和逛展', type: 'fans', back: false,
  },
  {
    id: 'u2', n: '橙子', ac: '#F4E8C6', t: '18分钟前', isNew: true, mutual: 5,
    bio: '经常在南门代拿外卖', type: 'fans', back: false,
  },
  {
    id: 'u3', n: '阿泽', ac: '#D9E4C9', t: '1小时前', isNew: true, mutual: 2,
    bio: '夜跑搭子，每天五点在驿站', type: 'fans', back: true,
  },
  {
    id: 'u4', n: '林小满', ac: '#F2D7D3', t: '3小时前', isNew: false, mutual: 8,
    bio: '三教常驻，复习搭子', type: 'fans', back: true,
  },
  {
    id: 'u5', n: '周周', ac: '#DED8EA', t: '昨天', isNew: false, mutual: 1,
    bio: '想找人一起去看展', type: 'fans', back: false,
  },
  {
    id: 'u6', n: '张三', ac: '#D9E4C9', t: '2天前', isNew: false, mutual: 4,
    bio: '计算机专业，会修电脑', type: 'fans', back: true,
  },
  /* 我的关注 */
  {
    id: 'm1', n: '庆快校园', ac: '#D9E4C9', t: '官方', isNew: false, mutual: 0,
    bio: '庆快校园官方账号', type: 'mine', back: true, official: true,
  },
  {
    id: 'm2', n: '桥苑小摊', ac: '#F4E8C6', t: '昨天更新', isNew: false, mutual: 0,
    bio: '今天有 12 家在营业', type: 'mine', back: true,
  },
  {
    id: 'm3', n: '图书馆', ac: '#CBDCEF', t: '3天前更新', isNew: false, mutual: 0,
    bio: '三楼靠窗还有 6 个位置', type: 'mine', back: true,
  },
  {
    id: 'm4', n: '阿梨', ac: '#CBDCEF', t: '刚刚活跃', isNew: false, mutual: 3,
    bio: '文学院 · 喜欢拍照和逛展', type: 'mine', back: true,
  },
  {
    id: 'm5', n: '阿泽', ac: '#D9E4C9', t: '1小时前活跃', isNew: false, mutual: 2,
    bio: '夜跑搭子，每天五点在驿站', type: 'mine', back: true,
  },
];

/* ---------- 通知中心 ----------
   type: reply 回复我 / like 点赞我 / accept 接了我的单
   txt 是动作，quote 是被评论/被点赞的那条内容，mine 是我发的那条

   ★ 不写跳转目标：以前给每条写死 go:{kind,id}，只能糊住这 10 条，
     后端接进来以后的新消息就跳不动了。现在由 App.vue 里的
     v5NoticeTarget() 运行时拿 quote / mine 去动态·搭把手·失物·闲置里比对，
     所以后端返回任何消息都能自动认出目标（对不上的就只显示文字，其余走主页）。
     如果后端能明确给出目标，直接带 go:{kind:'feed'|'help'|'lost'|'market', id} 也照样优先用。
*/
/* 只有这三种：回复 / 赞 / 接单。
   私信那一栏（{ id:'dm' }）2026-11-01 按需求删掉了 —— 站内已经没有私信功能，
   留着只会让人点进去发现是空的。以后后端返回别的类型，直接往这里加一项即可。 */
export const v5MyNoticeTabs = [
  { id: 'all', label: '全部' },
  { id: 'reply', label: '回复' },
  { id: 'like', label: '赞' },
  { id: 'accept', label: '接单' },
];
export const v5MyNotices = [
  {
    id: 'n1', type: 'reply', n: '阿梨', ac: '#CBDCEF', t: '刚刚', unread: true,
    txt: '回复了你的动态', quote: '求组队，一个人跑两圈就放弃了',
    mine: '刚跑完，晚风很舒服，出了一身汗',
  },
  {
    id: 'n2', type: 'accept', n: '阿泽', ac: '#D9E4C9', t: '4分钟前', unread: true,
    txt: '接了你的单', quote: '代取快递（菜鸟驿站）· ¥2',
    mine: '三个包裹，都不大。今天下午下课实在赶不回去',
  },
  {
    id: 'n3', type: 'like', n: '橙子', ac: '#F4E8C6', t: '12分钟前', unread: true,
    txt: '赞了你的动态', quote: '我决定今天拍一组校园晚霞～', mine: '',
  },
  {
    id: 'n5', type: 'accept', n: '阿梨', ac: '#CBDCEF', t: '1小时前', unread: false,
    txt: '接了你的单', quote: '帮忙占个座（图书馆三楼）· ¥5',
    mine: '明天上午在图书馆三楼靠窗，谁先到帮我放本书占一下',
  },
  {
    id: 'n6', type: 'reply', n: '周周', ac: '#DED8EA', t: '2小时前', unread: false,
    txt: '回复了你的失物', quote: '看到看台第二排有一串，你去看下是不是',
    mine: '钥匙串（挂蓝色小熊）',
  },
  {
    id: 'n7', type: 'like', n: '张三', ac: '#D9E4C9', t: '3小时前', unread: false,
    txt: '赞了你的闲置', quote: '26 寸自行车 · ¥120', mine: '',
  },
  {
    id: 'n8', type: 'reply', n: '橙子', ac: '#F4E8C6', t: '昨天', unread: false,
    txt: '回复了你的闲置', quote: '这个价格良心了', mine: '加厚羽绒服 · ¥60',
  },
  {
    id: 'n10', type: 'like', n: '阿梨', ac: '#CBDCEF', t: '2天前', unread: false,
    txt: '赞了你的动态', quote: '我的 MBTI 是 INFP', mine: '',
  },
];
/* 三种通知各配一个小图标名（走 v5-icons.js）和一句提示（私信那一档已删） */
export const v5MyNoticeKind = {
  reply: { ico: 'feedback', tint: '#F2D7D3', word: '回复' },
  like: { ico: 'fav', tint: '#F4E8C6', word: '赞' },
  accept: { ico: 'hand', tint: '#D9E4C9', word: '接单' },
};

/* ==========================================================
   校园服务 · 通知
   这里不是「谁回复我/赞我」，那是「我的消息」；
   这里是**开发项目组**发给全体同学的官方通知：
   版本更新、活动预告、停服维护、新功能上线
   ========================================================== */
export const v5AnnounceTabs = [
  { id: 'all', label: '全部' },
  { id: 'update', label: '版本更新' },
  { id: 'activity', label: '活动' },
  { id: 'system', label: '系统' },
];
/* 四种通知各配一个标题色条和一句前缀 */
export const v5AnnounceKind = {
  update: { ico: 'gift', tint: '#D9E4C9', ink: '#5E7350', word: '版本更新', bar: '#8FB89C' },
  activity: { ico: 'megaphone', tint: '#F4E8C6', ink: '#8A7748', word: '活动', bar: '#E0BE7C' },
  system: { ico: 'setting', tint: '#E7E3D8', ink: '#7B776E', word: '系统', bar: '#BFB9A8' },
};
export const v5Announces = [
  {
    id: 'a1', type: 'update', title: 'v1.2.0 更新：灵感小盒可以发动态了',
    t: '今天 09:20', from: '庆快校园项目组', top: true, unread: true,
    body: '这次更新我们给灵感小盒加了「分享你的想法」：\n· 扭到灵感后可以直接发到好友动态，同学能看到、能点赞、能评论\n· 不想露脸的话，发布时勾一下「匿名发布」就好\n· 灵感小盒每天还是 5 次机会，第二天自动补满\n\n另外修了一批小问题：店铺详情的价格偶尔对不上、收藏列表滑到底会闪。',
    tags: ['灵感小盒', '好友动态', '匿名发布'],
  },
  {
    id: 'a2', type: 'activity', title: '「搭把手」内测中：帮个小忙，攒点人情',
    t: '昨天 18:00', from: '庆快校园项目组', top: true, unread: true,
    body: '代取快递、代拿外卖、帮忙占座、搬东西——这些小事现在可以在「搭把手」里发布了。\n\n内测期间不收手续费，也不限发布条数。建议把酬劳定在 2~5 元，顺手帮一把，谁都不吃亏。\n\n如果你发现了刷单、虚假发布，麻烦在「反馈」里告诉我们，我们会在 24 小时内处理。',
    tags: ['搭把手', '内测'],
  },
  {
    id: 'a3', type: 'system', title: '10 月 31 日凌晨 2:00-4:00 停服维护',
    t: '2天前', from: '庆快校园项目组', top: false, unread: true,
    body: '为了把失物招领的消息推送做得更及时，我们会在 10 月 31 日凌晨 2:00 到 4:00 进行一次维护。\n\n维护期间：\n· 无法发布新内容、无法评论\n· 已经发出去的内容不受影响，恢复后照常\n· 维护一般 1 小时内结束，如果超时我们会再发一条通知\n\n给大家添麻烦了。',
    tags: ['停服维护'],
  },
  {
    id: 'a4', type: 'update', title: 'v1.1.0 更新：失物招领上线',
    t: '3天前', from: '庆快校园项目组', top: false, unread: false,
    body: '丢东西和捡到东西，现在都有地方说了。\n\n「找东西」发你丢的，「捡到了」发你捡的，两边都能留言。为了让信息更准，发布时记得写清楚地点和时间——我们看到写得详细的，找回率明显更高。',
    tags: ['失物招领'],
  },
  {
    id: 'a5', type: 'activity', title: '毕业季 · 闲置小铺免手续费一个月',
    t: '5天前', from: '庆快校园项目组', top: false, unread: false,
    body: '6 月 1 日到 6 月 30 日，在闲置小铺发布的所有商品免收手续费。\n\n带不走的教材、台灯、自行车、小家电，都挂上来吧。我们会在活动期间把「教材」分类放到首页推荐位。',
    tags: ['闲置小铺', '毕业季'],
  },
  {
    id: 'a6', type: 'system', title: '关于账号与隐私的一点说明',
    t: '1周前', from: '庆快校园项目组', top: false, unread: false,
    body: '有同学问我们拿数据做什么，这里统一说明：\n\n· 我们不会把你的发布内容、收藏卖给任何人\n· 匿名发布的内容，后台也看不到你是谁\n· 你可以随时在「设置」里导出或删除自己的数据\n\n我们是本校学生做的小项目，服务器和维护费用自己贴，没有商业化的打算。',
    tags: ['隐私', '公告'],
  },
];

/* ==========================================================
   一、校区（失物招领 / 闲置小铺 / 搭把手 都要按校区筛）
   发布时先选校区，再看加拉的地名，这样跨校区的同学不会被无关内容刷屏
   ========================================================== */
export const v5Campuses = [
  { id: 'all', label: '全部校区', short: '全部' },
  { id: '大学城校区', label: '大学城校区', short: '大学城' },
  { id: '桂花岗校区', label: '桂花岗校区', short: '桂花岗' },
  { id: '黄埔校区', label: '黄埔校区', short: '黄埔' },
];

/* ==========================================================
   二、进店逛 · 三个分区的「位置」下拉选项
   照参考稿排的：桥苑是「全部位置 / 工行门 / 学四门」，
   商业中心是「大厅左 / 大厅中 / 大厅右 / 小吃街 / 天桥附近二楼」，
   庆园饭堂直接按楼层排「菊苑一楼、菊苑二楼、兰苑一楼…」
   注意 fentang 里带「一楼」的那几项不在店铺数据的 place 里，
   它们走「食谱」模式（见下面 v5Menus）
   ========================================================== */
export const v5ZoneSpots = {
  qiaoyuan: ['全部位置', '工行门', '学四门'],
  /* 商业中心的位置：照实际摊位分布给的 11 个（前面统一加「全部位置」） */
  shangye: [
    '全部位置', '大厅左', '大厅中', '大厅右', '大厅前', '大厅后',
    '京东一路', '小博联区', '大博联区', '古茗附近', '猪大哈区', '小吃街', '天桥附近二楼',
  ],
  fentang: ['全部位置', '菊苑一楼', '菊苑二楼', '兰苑一楼', '兰苑二楼', '兰苑三楼', '梅苑一楼'],
};
/* 哪些位置点了要看「食谱」而不是店铺列表：饭堂的一楼都是大食代，按菜目出 */
export const v5FloorSpots = ['菊苑一楼', '兰苑一楼', '梅苑一楼'];

/* ==========================================================
   三、进店逛 · 顶部的「推荐」横滑卡
   改成了能左右滑的一排，所以每个分区多放几家也不挤
   name 必须是 v5GuessStores 里真的店名，点了才跳得过去
   ========================================================== */
export const v5ZonePromos = {
  qiaoyuan: [
    { name: '林胡子猪脚饭', img: '/assets/source-fidelity/stalls/linhuzi.jpeg', line: '人气旺，去晚了要排队', price: 15, rating: 4.6 },
    { name: '全记', img: '/assets/source-fidelity/stalls/quanji.jpeg', line: '老熟脸，闭眼点不踩雷', price: 10, rating: 4.3 },
    { name: '徐豆豆', img: '/assets/source-fidelity/stalls/xudoudou.jpeg', line: '糖水现煮，夏天一碗刚好', price: 10, rating: 4.2 },
    { name: '夜宵炒面王', img: '/assets/source-fidelity/commercial/05-come-on.jpg', line: '开到凌晨，自习回来还有热的', price: 11, rating: 4.1 },
  ],
  shangye: [
    { name: '老上海馄饨铺', img: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', line: '人气旺，饭点要排一会儿', price: 9, rating: 4.4 },
    { name: '老潼关肉夹馍', img: '/assets/source-fidelity/commercial/01-laotongguan.jpg', line: '满分口碑，皮脆肉足', price: 12, rating: 5.0 },
    { name: '功夫小茗', img: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', line: '全天营业，课间来一杯', price: 8, rating: 4.3 },
    { name: '韩国风味', img: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', line: '大厅左边最好找的铺子', price: 16, rating: 4.4 },
    { name: '猪大哈猪脚饭', img: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', line: '猪大哈区新搬来的，份量足', price: 15, rating: 4.7 },
  ],
  fentang: [
    { name: '渝记麻辣烫', img: '/assets/source-fidelity/commercial/05-come-on.jpg', line: '兰苑三楼，人气最旺', price: 15, rating: 4.7 },
    { name: '梅苑饺子馆', img: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', line: '老熟脸，皮薄馅足', price: 11, rating: 4.8 },
    { name: '兰苑烧腊档', img: '/assets/source-fidelity/commercial/04-korean-flavor.jpg', line: '叉烧油鸡，饭点要早去', price: 13, rating: 4.6 },
    { name: '港式茶餐厅', img: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', line: '梅苑三楼，适合坐下来聊', price: 18, rating: 4.6 },
  ],
};

/* ==========================================================
   四、饭堂一楼 · 食谱
   选到「菊苑一楼 / 兰苑一楼 / 梅苑一楼」时，列表出的不是店铺而是菜。
   每条：n 菜名 / price 价格 / win 出自哪个窗口 / cat 品类 /
        rate 评分 / rec 多少人推荐 / star 是不是窗口招牌 / ico 用什么图标
   ========================================================== */
export const v5Menus = {
  菊苑一楼: [
    { n: '香菇滑鸡饭', price: 9, win: '大众快餐', cat: '主食', rate: 4.8, rec: 26, star: true, ico: 'bowl' },
    { n: '梅菜扣肉饭', price: 11, win: '大众快餐', cat: '主食', rate: 4.7, rec: 21, star: true, ico: 'bowl' },
    { n: '番茄炒蛋饭', price: 7, win: '大众快餐', cat: '主食', rate: 4.4, rec: 14, ico: 'bowl' },
    { n: '豉汁排骨饭', price: 12, win: '大众快餐', cat: '主食', rate: 4.5, rec: 11, ico: 'bowl' },
    { n: '豆浆配油条', price: 4, win: '早餐窗口', cat: '小吃', rate: 4.7, rec: 22, star: true, ico: 'plate' },
    { n: '皮蛋瘦肉粥', price: 5, win: '早餐窗口', cat: '小吃', rate: 4.3, rec: 9, ico: 'bowl' },
    { n: '冰镇酸梅汤', price: 3, win: '饮品窗口', cat: '饮品', rate: 4.8, rec: 20, ico: 'cup' },
    { n: '现磨豆浆', price: 2, win: '饮品窗口', cat: '饮品', rate: 4.6, rec: 17, ico: 'cup' },
  ],
  兰苑一楼: [
    { n: '红烧牛肉面', price: 13, win: '面食窗口', cat: '粉面', rate: 4.8, rec: 31, star: true, ico: 'bowl' },
    { n: '兰州拉面', price: 11, win: '面食窗口', cat: '粉面', rate: 4.6, rec: 25, star: true, ico: 'bowl' },
    { n: '担担面', price: 10, win: '面食窗口', cat: '粉面', rate: 4.4, rec: 13, ico: 'bowl' },
    { n: '三鲜砂锅米线', price: 12, win: '砂锅窗口', cat: '粉面', rate: 4.5, rec: 16, ico: 'bowl' },
    { n: '麻辣香锅饭', price: 14, win: '自选快餐', cat: '主食', rate: 4.7, rec: 19, ico: 'plate' },
    { n: '荤素自选套餐', price: 10, win: '自选快餐', cat: '主食', rate: 4.2, rec: 12, ico: 'plate' },
    { n: '现榨橙汁', price: 6, win: '饮品窗口', cat: '饮品', rate: 4.6, rec: 14, ico: 'cup' },
    { n: '饭堂柠檬茶', price: 4, win: '饮品窗口', cat: '饮品', rate: 4.5, rec: 23, star: true, ico: 'cup' },
  ],
  梅苑一楼: [
    { n: '梅苑云吞面', price: 10, win: '粤式窗口', cat: '粉面', rate: 4.8, rec: 28, star: true, ico: 'bowl' },
    { n: '虾仁蟹黄包', price: 8, win: '早点窗口', cat: '小吃', rate: 4.7, rec: 22, star: true, ico: 'plate' },
    { n: '梅苑肠粉', price: 7, win: '早点窗口', cat: '小吃', rate: 4.6, rec: 18, ico: 'plate' },
    { n: '豉油皇炒面', price: 9, win: '粤式窗口', cat: '粉面', rate: 4.4, rec: 15, ico: 'bowl' },
    { n: '蜜汁叉烧饭', price: 13, win: '烧腊窗口', cat: '主食', rate: 4.9, rec: 34, star: true, ico: 'plate' },
    { n: '白切鸡饭', price: 12, win: '烧腊窗口', cat: '主食', rate: 4.5, rec: 16, ico: 'plate' },
    { n: '冬瓜薏米汤', price: 3, win: '汤品窗口', cat: '小吃', rate: 4.3, rec: 8, ico: 'bowl' },
    { n: '港式冻奶茶', price: 5, win: '饮品窗口', cat: '饮品', rate: 4.7, rec: 21, ico: 'cup' },
  ],
};

/* ==========================================================
   用户主页
   ----------------------------------------------------------
   v5People 按昵称索引：头像底色 ac / 校区 / 一句话 / 标签 / 数据
   注意这里的 ac 是这个人的「固定头像色」，跟他发的那条的动态卡片底色
   不是一个东西，同一个人在哪出现都该是同一个色。
   reviews = 别人给他的评价（by 谁评的 / star 几星 / txt 说了什么 / t 什么时候）。
   主页上那颗「评分」就是这些评价的平均分，不是他自己写过的评价条数。
   真下单互评之后产生的新评价会由 App.vue 的 v5RateOf() 自动并进来一起算。
   ========================================================== */
export const v5People = {
  林小满: {
    ac: '#CBDCEF', campus: '大学城校区', bio: '顺路能帮的都会帮一把，课表比较碎', joined: '2025 年入学',
    tags: ['夜跑搭子', '快递代取', '计算机学院'], posted: 12, helped: 31, on: '刚刚在线', cls: '计科 24 级',
    reviews: [
      { by: '阿泽', star: 5, txt: '包裹带到楼下还帮我拍了照，很细心', t: '10-26' },
      { by: '周周', star: 5, txt: '钥匙串就是她帮我找回来的', t: '10-22' },
      { by: '橙子', star: 4, txt: '来得稍微晚一点，不过提前说了', t: '10-18' },
    ],
  },
  阿泽: {
    ac: '#D9E4C9', campus: '大学城校区', bio: '每天五点在菜鸟驿站，顺手带几个没问题', joined: '2024 年入学',
    tags: ['准时', '代取快递', '夜跑'], posted: 8, helped: 52, on: '5 分钟前在线', cls: '软件 23 级',
    reviews: [
      { by: '周周', star: 5, txt: '五点准时到，从来没让我等过', t: '10-28' },
      { by: '林小满', star: 5, txt: '一次帮拿了三个包裹，很好说话', t: '10-24' },
    ],
  },
  橙子: {
    ac: '#F4E8C6', campus: '黄埔校区', bio: '宿舍在南门这边，外卖到了喊我一声', joined: '2025 年入学',
    tags: ['南门', '代拿外卖', '话多'], posted: 15, helped: 27, on: '在线', cls: '数媒 24 级',
    reviews: [
      { by: '林小满', star: 5, txt: '南门取外卖两分钟就到，很靠谱', t: '10-30' },
      { by: '张三', star: 4, txt: '手脚快，就是路上爱聊天哈哈', t: '10-25' },
    ],
  },
  阿梨: {
    ac: '#EEE0F0', campus: '大学城校区', bio: '文学院，喜欢拍照和逛展，偶尔出闲置', joined: '2024 年入学',
    tags: ['闲置', '拍照', '细心'], posted: 21, helped: 14, on: '1 小时前在线', cls: '中文 23 级',
    reviews: [
      { by: '周周', star: 5, txt: '羽绒服跟新的一样，包装得很仔细', t: '10-27' },
      { by: '阿泽', star: 5, txt: '出闲置很爽快，讲价也痛快', t: '10-19' },
    ],
  },
  张三: {
    ac: '#D9E4C9', campus: '桂花岗校区', bio: '计算机专业，装系统清灰修电脑都会', joined: '2023 年入学',
    tags: ['修电脑', '图书馆常客', '免费帮忙'], posted: 6, helped: 63, on: '学习中', cls: '计科 22 级',
    reviews: [
      { by: '阿梨', star: 5, txt: '重装系统十分钟搞定，还帮我清了灰', t: '10-29' },
    ],
  },
  周周: {
    ac: '#F2D7D3', campus: '大学城校区', bio: '下课都在操场，钥匙串丢过三次', joined: '2025 年入学',
    tags: ['操场', '失物招领', '爱丢东西'], posted: 9, helped: 5, on: '2 小时前在线', cls: '体育 24 级',
    reviews: [
      { by: '林小满', star: 5, txt: '捡到东西第一时间就发上来了', t: '10-21' },
    ],
  },
  我: {
    ac: '#EADFC8', campus: '大学城校区', bio: '这就是你。悄悄说一下，别人才愿意搭话', joined: '2026 年入学',
    tags: ['新来的', '想多认识点人'], posted: 0, helped: 0, on: '在线', cls: '还没有填',
    reviews: [
      { by: '阿梨', star: 5, txt: '交易很顺利，说几点就几点', t: '10-30' },
      { by: '林小满', star: 4, txt: '人挺好的，就是回复慢了点', t: '10-28' },
    ],
  },
};
/* 没在上面登记过的人（比如你自己起的名字）用这个兜底 */
export const v5PeopleDefault = {
  ac: '#E7E3D8', campus: '大学城校区', bio: '这位同学还没写简介', joined: '2026 年入学',
  tags: ['庆快同学'], posted: 1, helped: 0, on: '刚刚在线', cls: '未填写', reviews: [],
};

