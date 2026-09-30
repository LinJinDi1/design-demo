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
];

export const homeShortcuts = [
  { label: '庆园饭堂', image: '/assets/source-fidelity/shortcuts/canteen.png', scene: 'canteen', group: 'pickup' },
  { label: '桥苑小摊', image: '/assets/source-fidelity/shortcuts/stalls.png', scene: 'stalls', group: 'pickup' },
  { label: '收藏店铺', image: '/assets/source-fidelity/shortcuts/favorites.png', scene: 'favorites', group: 'pickup' },
  { label: '随机店铺', image: '/assets/source-fidelity/shortcuts/random.png', scene: 'random-store', group: 'pickup' },
  { label: '获得积分', image: '/assets/source-fidelity/shortcuts/points.svg', scene: 'profile', group: 'friend' },
  { label: '关注收藏', image: '/assets/source-fidelity/shortcuts/following.svg', scene: 'friends', group: 'friend' },
  { label: '好友收藏', image: '/assets/source-fidelity/shortcuts/friend-favorites.svg', scene: 'friends', group: 'friend' },
  { label: '好友推荐', image: '/assets/source-fidelity/shortcuts/friend-recommend.svg', scene: 'friends', group: 'friend' },
];

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

export const goldenBoardStores = [
  { name: '徐家小炒', place: '大厅左', value: 2, image: '/assets/original-pages/ranking/01.png' },
  { name: '老潼关肉夹馍', place: '天桥附近二楼', value: 2, image: '/assets/original-pages/ranking/02.png' },
  { name: '旺客', place: '大厅右', value: 1, image: '/assets/original-pages/ranking/03.png' },
  { name: '烤肉拌饭', place: '梅苑三楼', value: 1, image: '/assets/original-pages/ranking/04.png' },
  { name: '黄师傅', place: '大厅右', value: 0, image: '/assets/original-pages/ranking/05.png' },
  { name: '私房牛肉面', place: '大厅右', value: 0, image: '/assets/original-pages/ranking/06.png' },
  { name: '回味屋', place: '小吃街', value: 0, image: '/assets/original-pages/ranking/07.png' },
];

export const randomStores = [
  { name: '烧鸭粉', category: '粉面', image: '/assets/original-pages/random-store/roast-duck-noodles.png', target: 'mall' },
  { name: '老潼关肉夹馍', category: '主食', image: '/assets/source-fidelity/commercial/01-laotongguan.jpg', target: 'laotongguan-message' },
  { name: '老上海馄饨铺', category: '小吃', image: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', target: 'mall' },
  { name: '功夫小茗', category: '饮品', image: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg', target: 'mall' },
];

export const homeBanners = [
  '/assets/source-fidelity/banners/home-1.png',
  '/assets/source-fidelity/banners/home-2.jpeg',
  '/assets/source-fidelity/banners/home-3.png',
];

export const homeStores = [
  { name: '黄师傅', place: '大厅右', score: '389 人评过', photo: '/assets/source-fidelity/featured/huang-shifu.jpg', kind: '校园店铺' },
  { name: '徐豆豆', place: '工行门', score: '★ 4.2', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg', kind: '桥苑小摊' },
  { name: '全记', place: '工行门', score: '★ 4.3', photo: '/assets/source-fidelity/stalls/quanji.jpeg', kind: '桥苑小摊' },
  { name: '林胡子猪脚饭', place: '学4门', score: '★ 5.0', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg', kind: '桥苑小摊' },
];

export const goldenBoardEntries = [
  { name: '黄师傅', category: '校园店铺', group: 'store', place: '商业中心 · 大厅右', score: '9.6', votes: '389 人评过', photo: '/assets/source-fidelity/featured/huang-shifu.jpg', target: 'mall' },
  { name: '老潼关肉夹馍', category: '校园店铺', group: 'store', place: '商业中心 · 天桥附近二楼', score: '9.3', votes: '50 人评过', photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg', target: 'laotongguan-message' },
  { name: '徐豆豆', category: '桥苑小摊', group: 'stall', place: '工行门 · 糖水甜品', score: '9.2', votes: '4 人评过', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg', target: 'xudoudou-top' },
  { name: '全记', category: '桥苑小摊', group: 'stall', place: '工行门 · 炒粉主食', score: '8.9', votes: '2 人评过', photo: '/assets/source-fidelity/stalls/quanji.jpeg', target: 'stalls' },
  { name: '林胡子猪脚饭', category: '桥苑小摊', group: 'stall', place: '学4门 · 猪脚饭', score: '8.8', votes: '1 人评过', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg', target: 'stalls' },
  { name: '老上海馄饨铺', category: '校园店铺', group: 'store', place: '商业中心 · 大厅中', score: '8.8', votes: '165 人评过', photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg', target: 'mall' },
];

export const stalls = [
  { name: '徐豆豆', category: '饮品', tags: ['糖水', '甜品'], time: '11:00—22:30', score: '4.2', people: '4人', average: '¥10', place: '工行门 · 工行门附近', photo: '/assets/source-fidelity/stalls/xudoudou.jpeg' },
  { name: '全记', category: '主食', tags: ['炒粉', '主食'], time: '11:00—22:30', score: '4.3', people: '2人', average: '¥10', place: '工行门 · 工行门附近', photo: '/assets/source-fidelity/stalls/quanji.jpeg' },
  { name: '林胡子猪脚饭', category: '主食', tags: ['主食', '猪脚饭', '牛腩饭'], time: '11:00—22:30', score: '5.0', people: '1人', average: '¥15', place: '学4门 · 学4门附近', photo: '/assets/source-fidelity/stalls/linhuzi.jpeg' },
];

export const mallZones = ['全部', '大厅左', '大厅中', '大厅右', '大厅前', '大厅后', '京东一路', '小博联区', '大博联区', '古茗附近', '猪大哈区', '小吃街', '天桥附近二楼'];

export const mallShops = [
  { name: '老潼关肉夹馍', score: '9.3', people: '50 人评过', category: '主食', place: '天桥附近二楼', time: '08:00—23:59', photo: '/assets/source-fidelity/commercial/01-laotongguan.jpg' },
  { name: '老上海馄饨铺', score: '8.8', people: '165 人评过', category: '主食', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/02-laoshanghai.jpg' },
  { name: '功夫小茗', score: '8.7', people: '71 人评过', category: '饮品', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/03-gongfuxiaoming.jpg' },
  { name: '韩国风味', score: '8.9', people: '143 人评过', category: '主食', place: '大厅中', time: '08:00—20:00', photo: '/assets/source-fidelity/commercial/04-korean-flavor.jpg' },
  { name: 'Come On潮味', score: '8.7', people: '79 人评过', category: '主食', place: '大厅中', time: '00:00—23:59', photo: '/assets/source-fidelity/commercial/05-come-on.jpg' },
];

export const dishes = [
  ['香辣大虾', '¥6.5'], ['干锅鸭腿', '¥7.5'], ['紫苏炒滑鸡', '¥6'], ['麻婆豆腐', '¥3.5'],
  ['鱼香茄子', '¥3.5'], ['豆干肉丝', '¥4.5'], ['青瓜拌猪展', '¥7'], ['椒盐鸡丁', '¥6'],
  ['干煸辣子鸡', '¥6'], ['蒜泥茄子', '¥3.5'], ['香菇鸡', '¥5'], ['酱汁鸡', '¥6.5'],
  ['蒜香口水鸡', '¥5'], ['鱼片滑蛋', '¥6.5'],
];

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

export const friendRecommendations = [
  { name: '微信用户', id: 'QUICK07260312_0…' },
  { name: '微信用户', id: 'QUICK62765708_0…' },
];

export const friends = [
  { name: '微信用户111111111111111', note: '此处无声胜有声' },
  { name: '微信用户', note: '~！ @测试' },
  { name: 'Yilena', note: '保持热爱' },
];
