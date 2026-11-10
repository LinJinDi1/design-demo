/*
 * 现版（live）页面注册表。
 *
 * 约定：src/live 下每个 LiveXxx.vue 在 <script> 里导出 meta，这里用 import.meta.glob
 * 自动收集，**新增页面不用改 App.vue**：
 *
 *   <script>
 *   export const meta = {
 *     id: 'detailstore',        // 场景 id，?scene=detailstore
 *     label: '店铺详情',         // 左侧索引文案
 *     note: '点店铺卡进入',      // 左侧索引备注
 *     group: '首页',            // 分组：首页 / 校园觅食 / 校园 / 社交 / 个人 / 其他
 *     tab: 'home',              // 属于哪个底部 tab：home / discover / campus / friends / profile；详情页留空
 *     order: 3,                 // 同组内排序
 *   };
 *   </script>
 */

const modules = import.meta.glob('./Live*.vue', { eager: true });

const GROUP_ORDER = ['首页', '校园觅食', '校园', '社交', '个人', '其他'];

export const livePages = Object.entries(modules)
  .map(([file, module]) => {
    const meta = module.meta || {};
    const fallbackId = file.replace(/^\.\/Live/, '').replace(/\.vue$/, '').toLowerCase();
    return {
      id: meta.id || fallbackId,
      label: meta.label || meta.id || fallbackId,
      note: meta.note || '',
      group: meta.group || '其他',
      tab: meta.tab || '',
      order: meta.order ?? 99,
      component: module.default,
    };
  })
  .sort((a, b) => {
    const byGroup = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    if (byGroup !== 0) return byGroup;
    return a.order - b.order;
  });

export const livePageMap = Object.fromEntries(livePages.map((page) => [page.id, page]));

export const livePageIds = livePages.map((page) => page.id);
