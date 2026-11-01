/*
 * 颜色 token（紫 / 青 / 墨 等）。
 * 注意：目前没有任何文件引用它——页面颜色都直接写在 CSS 里，这里是历史遗留的备用文件。
 * 真要统一改配色，建议从这里出发，但得先把 CSS 里的硬编码颜色换成 var()。
 */
export const tokens = {
  purple: '#6a5acd',
  purpleDark: '#5142b5',
  purpleSoft: '#eeeaff',
  cyan: '#16b8ad',
  ink: '#242235',
  muted: '#8b889b',
  surface: '#ffffff',
  canvas: '#f5f5fa',
};
