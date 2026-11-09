/*
 * 现版（live）图标路径助手：统一走 Vite 的 BASE_URL（/qingkuai/），
 * 组件里直接写 liveAsset('/assets/live/home/stall.svg') 即可。
 */
export const liveAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
