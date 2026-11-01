/* ==========================================================
   V5 图标库
   ----------------------------------------------------------
   风格跟首页「今天吃什么」的礼物盒、「今天做什么」的扭蛋机看齐：
     奶油底 + 浅色描边 + 白色高光条 + 小四芒星点缀
   不是图标库那种等宽深线，是有点厚涂感的小插画，所以每个图标
   都自己带颜色，不跟着外层的文字色走。

   用法：
     import { v5Icon } from './v5-icons';
     <span v-html="v5Icon('stall', 26)"></span>

   想加新图标：在下面 v5Icons 里加一个 key，值是一段 24×24 坐标系
   的 SVG 内部内容（不用写 <svg> 标签，也不要带 width/height）。
   ========================================================== */

/* 共用的小四芒星（跟礼物盒上那颗同款造型，竖长款）。
   x / y 是星星中心，s 是竖直半长，c 是颜色。
   比例是从「今天吃什么」礼物盒那颗星上量下来的，别随便改，
   改了就不像手画的了 */
function spark(x, y, s, c) {
  const f = (n) => Number(n.toFixed(2));
  const p = (dx, dy) => `${f(dx * s)} ${f(dy * s)}`;
  return `<path d="M${f(x)} ${f(y - s)}`
    + `c ${p(0.109, 0.565)} ${p(0.196, 0.783)} ${p(0.522, 1)}`
    + `c ${p(-0.326, 0.217)} ${p(-0.413, 0.435)} ${p(-0.522, 1)}`
    + `c ${p(-0.109, -0.565)} ${p(-0.196, -0.783)} ${p(-0.522, -1)}`
    + `c ${p(0.326, -0.217)} ${p(0.413, -0.435)} ${p(0.522, -1)}Z" fill="${c}"/>`;
}

/* 所有图标的身子。
   坐标都是 24×24，主体大概占 2.5 ~ 21 之间，四周留一点呼吸 */
export const v5Icons = {
  /* ---------- 金刚区 ---------- */

  /* 桥苑小摊：小摊车 + 遮阳伞 + 小灯笼 */
  stall: `
    <path d="M2.6 10.6h18.8c0-4.4-4.2-7.6-9.4-7.6s-9.4 3.2-9.4 7.6Z" fill="#A3C9B8"/>
    <path d="M4 10.6c1.4-1.3 2.7-1.3 4 0 1.3-1.3 2.6-1.3 4 0 1.3-1.3 2.7-1.3 4 0 1.3-1.3 2.6-1.3 4 0" fill="#A3C9B8"/>
    <path d="M2.6 10.6c-.7 1.3-.7 2.2 0 3.2h18.8c.7-1 .7-1.9 0-3.2" fill="#BBD6C7"/>
    <path d="M2.6 10.6h18.8" stroke="#8FB3A3" stroke-width="1" stroke-opacity=".55"/>
    <path d="M12 10.6v3.2" stroke="#CDBB8B" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="12" cy="12.8" r="1.5" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1"/>
    <rect x="4.4" y="13.8" width="15.2" height="6.4" rx="2.4" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2"/>
    <rect x="6.4" y="15.6" width="11.2" height="3" rx="1.4" fill="#F5E2A4"/>
    <path d="M6.4 16.6h11.2" stroke="#FFFFFF" stroke-width="1" stroke-opacity=".6" stroke-linecap="round"/>
    <circle cx="8" cy="21" r="1.6" fill="#E7E2D6" stroke="#CDBB8B" stroke-width="1.1"/>
    <circle cx="16" cy="21" r="1.6" fill="#E7E2D6" stroke="#CDBB8B" stroke-width="1.1"/>`,

  /* 商业中心：小楼 + 屋檐 + 两面橱窗 + 小旗 */
  mall: `
    <path d="M12 2.8v2.6" stroke="#CDBB8B" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M12 3.2h3.2l-1.1 1.3 1.1 1.3H12Z" fill="#EBD49A"/>
    <path d="M3.2 8.8h17.6l-1.5-3.6H4.7L3.2 8.8Z" fill="#A8B9CC" stroke="#8FA6BC" stroke-width="1.1" stroke-linejoin="round"/>
    <rect x="4.8" y="8.8" width="14.4" height="12.2" rx="2.4" fill="#F6F1E7" stroke="#8FA6BC" stroke-width="1.1"/>
    <rect x="6.6" y="11.2" width="4.4" height="4.4" rx="1.4" fill="#CBDCEF"/>
    <rect x="13" y="11.2" width="4.4" height="4.4" rx="1.4" fill="#CBDCEF"/>
    <rect x="9.8" y="16.6" width="4.4" height="4.4" rx="1.4" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <path d="M6.4 10.4h11.2" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".6" stroke-linecap="round"/>`,

  /* 庆园饭堂：热饭碗 + 筷子 */
  canteen: `
    <path d="M16.2 3.4l2.9 1.2-3.6 8.6-2.9-1.2Z" fill="#E7E2D6" stroke="#CDBB8B" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M19.1 4.6l2.9 1.2-3.6 8.6-2.9-1.2Z" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M3.4 12.6h17.2c0 4.9-3.9 8.2-8.6 8.2s-8.6-3.3-8.6-8.2Z" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2" stroke-linejoin="round"/>
    <ellipse cx="12" cy="12.6" rx="8.6" ry="2.4" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.2"/>
    <ellipse cx="12" cy="12.6" rx="6.2" ry="1.5" fill="#EBD49A" fill-opacity=".55"/>
    <path d="M6.4 16a6.6 6.6 0 0 0 2.8 2.4" stroke="#FFFFFF" stroke-width="1.4" stroke-opacity=".7" stroke-linecap="round"/>`,

  /* MBTI 食堂：笑脸盘子 + 两颗小星 */
  mbti: `
    ${spark(5.2, 7.6, 3.4, '#EBD49A')}
    ${spark(18.8, 6.4, 2.6, '#E4B5B6')}
    <ellipse cx="12" cy="15.6" rx="8.8" ry="4.8" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2"/>
    <ellipse cx="12" cy="15.2" rx="7.2" ry="3.4" fill="#EBD49A" fill-opacity=".6"/>
    <circle cx="10.3" cy="14.6" r="1" fill="#7B776E"/>
    <circle cx="13.7" cy="14.6" r="1" fill="#7B776E"/>
    <path d="M10.5 17c.9.9 2.1.9 3 0" stroke="#7B776E" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M6.6 16.4a6 6 0 0 0 2.6 2" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity=".55" stroke-linecap="round"/>`,

  /* 新增关注：两个小人 + 右上角小加号 */
  people: `
    <circle cx="8.4" cy="9.2" r="3" fill="#D6E1EE" stroke="#8FA6BC" stroke-width="1.2"/>
    <path d="M3.6 20c0-2.8 2.1-4.8 4.8-4.8s4.8 2 4.8 4.8" fill="#D6E1EE" stroke="#8FA6BC" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="15.9" cy="10" r="3" fill="#CBDCEF" stroke="#8FA6BC" stroke-width="1.2"/>
    <path d="M11.1 20.8c0-2.8 2.1-4.8 4.8-4.8s4.8 2 4.8 4.8" fill="#CBDCEF" stroke="#8FA6BC" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="19.4" cy="5.4" r="3.2" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1"/>
    <path d="M19.4 4v2.8M18 5.4h2.8" stroke="#7B776E" stroke-width="1.2" stroke-linecap="round"/>`,

  /* 我的收藏：一颗心 + 右上小星 */
  fav: `
    ${spark(18.6, 5.8, 3, '#EBD49A')}
    <path d="M12 21c-4.9-3-7.7-6-7.7-9.2a4.2 4.2 0 0 1 7.7-2.1 4.2 4.2 0 0 1 7.7 2.1C19.7 15 16.9 18 12 21Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M8.4 12.4c.4-1.6 1.6-2.6 3.2-3" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity=".6" stroke-linecap="round"/>`,

  /* ---------- 校园 · 三个板块 ---------- */

  /* 失物招领：小背包 + 铃铛（表示"招领"） */
  bag: `
    <path d="M9.2 9.4V6.8a2.9 2.9 0 0 1 5.8 0v2.6" stroke="#8FA6BC" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M4.4 15.2h15.2v3.4c0 2.7-3.4 4.8-7.6 4.8s-7.6-2.1-7.6-4.8v-3.4Z" fill="#BBCAE0" stroke="#8FA6BC" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M4.4 13.6c0-2.8 3.4-4.8 7.6-4.8s7.6 2 7.6 4.8v1.8H4.4v-1.8Z" fill="#D6E1EE" stroke="#8FA6BC" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="10.2" y="14.6" width="3.6" height="2.8" rx="1.2" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <circle cx="18" cy="6.2" r="2" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <path d="M16.4 7.4h3.2" stroke="#CDBB8B" stroke-width="1" stroke-linecap="round"/>
    <path d="M6.6 17.4h10.8" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".5" stroke-linecap="round"/>`,

  /* 闲置小铺：T 恤 + 价签 */
  shirt: `
    <path d="M9 4.8 3.6 7.2l2.1 3.9 2.1-1.1v9c0 .9.7 1.6 1.6 1.6h5.2c.9 0 1.6-.7 1.6-1.6v-9l2.1 1.1 2.1-3.9L15 4.8" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M9 4.8c1.3 1.8 4.7 1.8 6 0" fill="#F6F1E7" stroke="#D9C9C4" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M6.6 11.4h10.8" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".55" stroke-linecap="round"/>
    <circle cx="18" cy="17.2" r="2.6" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <path d="M18 14.8v1.4" stroke="#CDBB8B" stroke-width="1.1" stroke-linecap="round"/>`,

  /* 搭把手：一只手托着一颗心 */
  hand: `
    <path d="M12 12.6c-2.9-1.9-4.5-3.6-4.5-5.5a2.5 2.5 0 0 1 4.5-1.3 2.5 2.5 0 0 1 4.5 1.3c0 1.9-1.6 3.6-4.5 5.5Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="7.4" y="12.4" width="2.3" height="3.4" rx="1.15" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="10" y="12.4" width="2.3" height="3.4" rx="1.15" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="12.6" y="12.4" width="2.3" height="3.4" rx="1.15" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="15.2" y="12.4" width="2.3" height="3.4" rx="1.15" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="3.9" y="16.4" width="3.4" height="3" rx="1.5" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.1" transform="rotate(-16 5.6 17.9)"/>
    <rect x="6.6" y="14.8" width="10.8" height="5.8" rx="2.8" fill="#F5E2A4" stroke="#CDBB8B" stroke-width="1.2"/>
    <path d="M8.6 17h6.8" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity=".6" stroke-linecap="round"/>`,

  /* 订单：一张小票，用于对账单 */
  order: `
    <rect x="5.4" y="3.2" width="13.2" height="17.6" rx="2.2" fill="#F6F1E7" stroke="#A3C9B8" stroke-width="1.2"/>
    <path d="M8.2 7.6h7.6M8.2 11h7.6M8.2 14.4h4.4" stroke="#A3C9B8" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M7.2 3.2v-1.2M12 3.2v-1.2M16.8 3.2v-1.2" stroke="#A3C9B8" stroke-width="1.1" stroke-linecap="round"/>`,

  /* 图书馆：两排书架 */
  library: `
    <rect x="2.6" y="4.6" width="18.8" height="15" rx="2.6" fill="#F6F1E7" stroke="#A3C9B8" stroke-width="1.2"/>
    <path d="M2.6 12.2h18.8" stroke="#A3C9B8" stroke-width="1.2"/>
    <rect x="4" y="6" width="3" height="5" rx="1" fill="#D9E4C9"/>
    <rect x="7.8" y="6" width="3" height="5" rx="1" fill="#EBD49A"/>
    <rect x="11.6" y="6" width="3" height="5" rx="1" fill="#E4B5B6"/>
    <rect x="15.4" y="6" width="3" height="5" rx="1" fill="#CBDCEF"/>
    <rect x="4" y="13.6" width="3" height="4.6" rx="1" fill="#CBDCEF"/>
    <rect x="7.8" y="13.6" width="3" height="4.6" rx="1" fill="#D9E4C9"/>
    <rect x="11.6" y="13.6" width="3" height="4.6" rx="1" fill="#EBD49A"/>
    <rect x="15.4" y="13.6" width="3" height="4.6" rx="1" fill="#E4B5B6"/>
    <path d="M4.6 8.2h2M8.4 8.2h2M12.2 8.2h2M16 8.2h2" stroke="#FFFFFF" stroke-width="1" stroke-opacity=".55" stroke-linecap="round"/>`,

  /* 庆快画廊：一幅小画 + 小太阳 */
  gallery: `
    <rect x="2.8" y="5.4" width="18.4" height="13.6" rx="2.6" fill="#F6F1E7" stroke="#C3CFDC" stroke-width="1.2"/>
    <path d="M4.6 16.2l4.2-4 3.2 3 2.8-2.6 4.6 4.4Z" fill="#A3C9B8"/>
    <circle cx="8.4" cy="9.4" r="1.5" fill="#EBD49A"/>
    <path d="M4.6 15.4h14.8" stroke="#8FB3A3" stroke-width="1"/>
    <path d="M5.4 6.9h13.2" stroke="#FFFFFF" stroke-width="1" stroke-opacity=".55" stroke-linecap="round"/>`,

  /* ---------- 我的 · 我的工具 ---------- */

  /* 头像商城：会笑的购物袋 */
  shop: `
    <path d="M8.6 8.6V6.8a3.4 3.4 0 0 1 6.8 0v1.8" stroke="#8FA6BC" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M5 9h14l-1.2 10.6a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 9Z" fill="#CBDCEF" stroke="#8FA6BC" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="9.8" cy="14.4" r="1.05" fill="#7B776E"/>
    <circle cx="14.2" cy="14.4" r="1.05" fill="#7B776E"/>
    <path d="M10.4 16.8c1 .9 2.2.9 3.2 0" stroke="#7B776E" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M7.2 11.6h9.6" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".6" stroke-linecap="round"/>`,

  /* 签到：日历 + 一个勾 */
  checkin: `
    <rect x="7" y="3.2" width="2.1" height="3.8" rx="1.05" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="14.9" y="3.2" width="2.1" height="3.8" rx="1.05" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <rect x="3.2" y="5.6" width="17.6" height="15" rx="3.2" fill="#F6F1E7" stroke="#C3CFDC" stroke-width="1.2"/>
    <path d="M3.2 10.4h17.6" stroke="#C3CFDC" stroke-width="1.2"/>
    <path d="M8.4 15.6l2.8 2.8 5-5.6" stroke="#5E7350" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.4 7.4h6" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".6" stroke-linecap="round"/>`,

  /* 我的积分：三颗四芒星（跟礼物盒那颗同款） */
  point: `
    ${spark(6.4, 7.8, 3.6, '#F5E2A4')}
    ${spark(18.2, 6.8, 2.8, '#F5E2A4')}
    <path d="M12 7.2c.75 3.9 1.3 5.4 3.5 6.9-2.2 1.5-2.75 3-3.5 6.9-.75-3.9-1.3-5.4-3.5-6.9 2.2-1.5 2.75-3 3.5-6.9Z" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1" stroke-linejoin="round"/>`,

  /* 我的发布：留言板 + 一支小铅笔（跟「我的消息」的铃铛配一套） */
  post: `
    <rect x="3.2" y="4.4" width="13.6" height="15.6" rx="2.6" fill="#F6F1E7" stroke="#C9C2D9" stroke-width="1.2"/>
    <rect x="6.4" y="2.6" width="7.2" height="3.2" rx="1.6" fill="#DED8EA" stroke="#C9C2D9" stroke-width="1.1"/>
    <path d="M6.6 10.4h6.8M6.6 13.4h6.8M6.6 16.4h4.2" stroke="#C9C2D9" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M5.4 6.8h5" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".6" stroke-linecap="round"/>
    <g transform="rotate(45 16.6 13.4)">
      <rect x="15" y="8.8" width="3.2" height="9.2" rx="1.4" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
      <path d="M15 15h3.2l-1.6 3Z" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.1" stroke-linejoin="round"/>
    </g>`,

  /* ---------- 我的 · 校园服务 ---------- */

  /* 反馈：对话气泡 + 一颗心 */
  feedback: `
    <path d="M7.4 17.8v3.2l4.2-3.2H7.4Z" fill="#F6F1E7" stroke="#C9C2D9" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="2.8" y="5.6" width="18.4" height="12.4" rx="4.2" fill="#F6F1E7" stroke="#C9C2D9" stroke-width="1.2"/>
    <path d="M5.6 8.6h12.8" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".6" stroke-linecap="round"/>
    <path d="M12 14.6c-2.3-1.5-3.6-2.8-3.6-4.3a2 2 0 0 1 3.6-1.1 2 2 0 0 1 3.6 1.1c0 1.5-1.3 2.8-3.6 4.3Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1" stroke-linejoin="round"/>`,

  /* ---------- 饭堂一楼食谱：碗 / 盘 / 杯 ---------- */

  /* 碗：带汤的热菜（米饭、面、粥） */
  bowl: `
    <path d="M3.6 11.6h16.8a8.4 8.4 0 0 1-16.8 0Z" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M2.8 11.4h18.4" stroke="#CDBB8B" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M4.6 20.2h14.8" stroke="#EBD49A" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M8.4 14.2c0-1.4 1.6-2 3.6-2s3.6.6 3.6 2" stroke="#A3C9B8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M6.4 8.4c0-1.2 1-1.8 1-3M10 8.4c0-1.4 1.4-2 1.4-3.4M13.6 8.4c0-1.4 1.4-2 1.4-3.4" stroke="#E4B5B6" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M5.6 13.4v1.6" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".7" stroke-linecap="round"/>`,

  /* 盘：装盘的小吃点心 */
  plate: `
    <ellipse cx="12" cy="13.2" rx="9.2" ry="6.4" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2"/>
    <ellipse cx="12" cy="13" rx="5.6" ry="3.6" fill="#DED8EA" stroke="#C9C2D9" stroke-width="1.1"/>
    <path d="M8.6 12.4c1.1-1.2 2.1-1.2 3.2 0M11.8 12.4c1.1-1.2 2.1-1.2 3.2 0" stroke="#FFFFFF" stroke-width="1.1" stroke-opacity=".72" stroke-linecap="round" fill="none"/>
    <circle cx="9.4" cy="15.2" r="1.1" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1"/>
    <circle cx="14.6" cy="15" r="1.1" fill="#A3C9B8" stroke="#8FB89C" stroke-width="1"/>`,

  /* 杯：饮品 */
  cup: `
    <path d="M6 7.6h12l-1.2 11a1.6 1.6 0 0 1-1.6 1.4H8.8a1.6 1.6 0 0 1-1.6-1.4L6 7.6Z" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5.4 7.6h13.2" stroke="#CDBB8B" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M7.4 12.6c.6 2.6 3.4 3.4 5.2 3.4" stroke="#A3C9B8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M8.4 10.4v6.4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity=".68" stroke-linecap="round"/>
    <path d="M17.2 9.6c1.4.4 1.6 1.8 1.2 3" stroke="#EBD49A" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <circle cx="21" cy="7.6" r="1.6" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1"/>`,

  /* 礼物盒（照「今天吃什么」那个盲盒机上的同款画法）
     官方通知里的「版本更新」用它——新版本就是一份礼物 */
  gift: `
    ${spark(19.6, 5.4, 3.2, '#EBD49A')}
    ${spark(4.6, 5.2, 2.2, '#E4B5B6')}
    <rect x="3.6" y="11.8" width="16.8" height="9" rx="2.2" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2"/>
    <rect x="2.8" y="8.4" width="18.4" height="3.8" rx="1.5" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.2"/>
    <rect x="10.4" y="8.4" width="3.2" height="12.4" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1"/>
    <path d="M10.2 8.6c-1.7-1.3-3.4-.9-3.4 1 0 1.5 2.2 2.4 3.4 3.2 1.2-.8 3.4-1.7 3.4-3.2 0-1.9-1.7-2.3-3.4-1Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M5.6 14.6v4" stroke="#FFFFFF" stroke-width="1.3" stroke-opacity=".68" stroke-linecap="round"/>`,

  /* 小喇叭：官方通知里的「活动」用它，喊大家来参加 */
  megaphone: `
    ${spark(18.8, 5.6, 2.6, '#EBD49A')}
    <path d="M4.2 10.2 11 8.2v8.2l-6.8-2v-4.2Z" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="11.6" y="11.4" width="3" height="6.2" rx="1.3" fill="#F6F1E7" stroke="#CDBB8B" stroke-width="1.2"/>
    <rect x="9.6" y="17.4" width="4.6" height="2.4" rx="1.2" fill="#C3CFDC" stroke="#A8B9CC" stroke-width="1.1"/>
    <path d="M4.6 11.2v2.4" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity=".7" stroke-linecap="round"/>
    <path d="M17 10.4a4.2 4.2 0 0 1 0 5" stroke="#C3CFDC" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M19.6 8.6a7.4 7.4 0 0 1 0 8.4" stroke="#C3CFDC" stroke-width="1.3" stroke-linecap="round" fill="none"/>`,

  /* 通知：铃铛 + 两侧摆动的小弧 */
  notice: `
    <path d="M3.6 9.8c-.7.7-1 1.6-1 2.5M21.4 9.8c.7.7 1 1.6 1 2.5" stroke="#EBD49A" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="12" cy="5.6" r="1.5" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>
    <path d="M6.2 17c-.7-1-1-2.1-1-3.3 0-3.7 3-6.7 6.8-6.7s6.8 3 6.8 6.7c0 1.2-.3 2.3-1 3.3H6.2Z" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M4.6 17.4h14.8" stroke="#CDBB8B" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M10.2 19.4c0 1.5 3.6 1.5 3.6 0Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M8.6 11.4a5.6 5.6 0 0 1 2.2-2" stroke="#FFFFFF" stroke-width="1.4" stroke-opacity=".65" stroke-linecap="round"/>`,

  /* 联系我们：信封 + 中间一颗心 */
  contact: `
    <rect x="2.8" y="6.2" width="18.4" height="11.8" rx="2.8" fill="#F6F1E7" stroke="#8FA6BC" stroke-width="1.2"/>
    <path d="M3.3 7.2h17.4l-8.7 6.1L3.3 7.2Z" fill="#CBDCEF" stroke="#8FA6BC" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M12 18.4c-1.8-1.1-2.8-2.2-2.8-3.4a1.6 1.6 0 0 1 2.8-.9 1.6 1.6 0 0 1 2.8.9c0 1.2-1 2.3-2.8 3.4Z" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1" stroke-linejoin="round"/>`,

  /* 地图：折起来的三折页 + 图钉 */
  map: `
    <path d="M3.2 6.4l5.4-2v13.6l-5.4 2V6.4Z" fill="#D9E4C9" stroke="#A3C9B8" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M15.4 6.4l5.4-2v13.6l-5.4 2V6.4Z" fill="#D9E4C9" stroke="#A3C9B8" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M8.6 4.4l6.8 2v13.6l-6.8-2V4.4Z" fill="#F6F1E7" stroke="#A3C9B8" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M10 12.4c1.9 1.5 3.1-1.3 4.9.2" stroke="#EBD49A" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="1.8 2"/>
    <path d="M16.6 13v1.6" stroke="#7B776E" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="16.6" cy="10.4" r="2.2" fill="#E4B5B6" stroke="#D9C9C4" stroke-width="1.1"/>`,

  /* 关于我们：摊开的书 + 书签 */
  about: `
    <path d="M12 6.2c-1.8-1.2-3.9-1.7-6.3-1.7v13c2.4 0 4.5.5 6.3 1.7 1.8-1.2 3.9-1.7 6.3-1.7v-13c-2.4 0-4.5.5-6.3 1.7Z" fill="#DED8EA" stroke="#C9C2D9" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M12 6.2v13" stroke="#C9C2D9" stroke-width="1.2"/>
    <path d="M7.4 9.8h3.2M7.4 12.2h3.2M13.4 9.8h3.2M13.4 12.2h3.2" stroke="#F6F1E7" stroke-width="1.2" stroke-linecap="round"/>
    <rect x="14.6" y="5" width="2.1" height="7" rx="1.05" fill="#EBD49A" stroke="#CDBB8B" stroke-width="1.1"/>`,

  /* 设置：六齿小齿轮 */
  setting: `
    <g fill="#E7E3D8" stroke="#C3CFDC" stroke-width="1.1" stroke-linejoin="round">
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1"/>
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1" transform="rotate(60 12 12)"/>
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1" transform="rotate(120 12 12)"/>
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1" transform="rotate(180 12 12)"/>
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1" transform="rotate(240 12 12)"/>
      <rect x="10.8" y="3.4" width="2.4" height="3.6" rx="1.1" transform="rotate(300 12 12)"/>
    </g>
    <circle cx="12" cy="12" r="5.6" fill="#E7E3D8" stroke="#C3CFDC" stroke-width="1.2"/>
    <circle cx="12" cy="12" r="2.3" fill="#F6F1E7" stroke="#C3CFDC" stroke-width="1.1"/>`,
};

/* 拿到一整段可以直接 v-html 的 <svg> 字符串 */
export function v5Icon(name, size = 24) {
  const body = v5Icons[name];
  if (!body) return '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

export default v5Icon;
