/*
 * 小程序运行时替身（uni 全局对象 + getApp）。
 *
 * 目的：让 quick-pick-main 的原生组件（components/ 下的 .vue）能直接在设计台里渲染。
 * 这些组件会在业务逻辑里调用 uni.* 和 getApp()，静态稿只关心首屏渲染，
 * 所以这里给一套「不报错、不发请求」的空实现。
 *
 * 必须在任何 app 组件模块被求值之前执行，所以 main.js 第一行就 import 它。
 */
const noop = () => {};

const screen = {
  screenWidth: 390,
  screenHeight: 844,
  windowWidth: 390,
  windowHeight: 844,
  statusBarHeight: 46,
  pixelRatio: 2,
  safeArea: { top: 46, bottom: 810, left: 0, right: 390, width: 390, height: 764 },
  platform: 'devtools',
  system: 'iOS 14.0',
  brand: 'devtools',
  model: 'design-demo',
};

const storage = new Map();

const uni = {
  ...screen,
  getSystemInfoSync: () => ({ ...screen }),
  getWindowInfo: () => ({ ...screen }),
  getDeviceInfo: () => ({ ...screen }),
  getAppBaseInfo: () => ({ ...screen }),
  getMenuButtonBoundingClientRect: () => ({ top: 46, bottom: 78, left: 296, right: 383, width: 87, height: 32 }),
  upx2px: (value) => Number(value) * 0.52,
  rpx2px: (value) => Number(value) * 0.52,
  px2rpx: (value) => Number(value) / 0.52,

  getStorageSync: (key) => (storage.has(key) ? storage.get(key) : ''),
  setStorageSync: (key, value) => storage.set(key, value),
  removeStorageSync: (key) => storage.delete(key),
  getStorage: ({ key, success }) => success && success({ data: storage.get(key) }),
  setStorage: ({ key, data, success }) => {
    storage.set(key, data);
    if (success) success();
  },

  request: () => Promise.reject(new Error('静态设计台不发请求')),
  uploadFile: () => Promise.reject(new Error('静态设计台不发请求')),
  downloadFile: () => Promise.reject(new Error('静态设计台不发请求')),
  getFileSystemManager: () => ({
    getSavedFileList: ({ success }) => success && success({ fileList: [] }),
    saveFile: ({ fail }) => fail && fail(new Error('no fs')),
    removeSavedFile: noop,
  }),

  showToast: noop,
  hideToast: noop,
  showLoading: noop,
  hideLoading: noop,
  showModal: noop,
  $showModal: noop,
  showShareMenu: noop,
  setNavigationBarTitle: noop,
  setNavigationBarColor: noop,
  navigateTo: noop,
  redirectTo: noop,
  switchTab: noop,
  reLaunch: noop,
  navigateBack: noop,
  startPullDownRefresh: noop,
  stopPullDownRefresh: noop,
  pageScrollTo: noop,
  addInterceptor: noop,
  removeInterceptor: noop,
  on: noop,
  off: noop,
  $on: noop,
  $off: noop,
  $emit: noop,
  getUpdateManager: () => ({ onCheckForUpdate: noop, onUpdateReady: noop, onUpdateFailed: noop }),
  createSelectorQuery: () => {
    const query = {
      in: () => query,
      select: () => query,
      selectAll: () => query,
      boundingClientRect: (callback) => {
        if (typeof callback === 'function') callback({ width: 390, height: 60, top: 46, left: 0 });
        return query;
      },
      exec: (callback) => callback && callback([]),
    };
    return query;
  },
  createIntersectionObserver: () => ({ relativeTo: () => ({ observe: noop, disconnect: noop }), observe: noop, disconnect: noop }),
  createVideoContext: () => ({}),
  login: noop,
  checkSession: noop,
  getUserProfile: noop,
  getNetworkType: ({ success } = {}) => success && success({ networkType: 'wifi' }),
};

if (typeof globalThis !== 'undefined') {
  globalThis.uni = globalThis.uni || uni;
  globalThis.wx = globalThis.wx || globalThis.uni;
  globalThis.getApp =
    globalThis.getApp ||
    (() => ({
      globalData: { login: false, token: '', user: {}, clalist: [], secondLocations: {}, canteens: [] },
      unlogin: noop,
      EnterStore: noop,
      visitApplet: noop,
      FileUpload: () => Promise.resolve({}),
    }));
  globalThis.getCurrentPages = globalThis.getCurrentPages || (() => []);
}

export default uni;
