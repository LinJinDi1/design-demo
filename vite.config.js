import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const here = path.dirname(fileURLToPath(import.meta.url));
/* 线上小程序源码目录：现版（live）分支直接 import 它的组件与样式 */
const APP_ROOT = path.resolve(here, process.env.QK_APP_ROOT || '../quick-pick-main');
/*
 * 没跟 quick-pick-main 放在一起时（比如别人只 clone 了 design-demo），
 * 现版里那几个 import '@app/...' 会解析失败。这时把 @app 指向内置的占位组件，
 * 保证 `npm run dev` / `npm run build` 仍然可用，只是现版的卡片显示成提示块。
 */
const HAS_APP = fs.existsSync(APP_ROOT);
const APP_FALLBACK = path.resolve(here, 'src/app-stub');
if (!HAS_APP) {
  console.warn(
    `[qingkuai] 没找到小程序源码目录 ${APP_ROOT}\n` +
      '           现版（live）的原生组件将用占位实现；可用 QK_APP_ROOT=<路径> 指定。',
  );
}

/**
 * 小程序里所有尺寸都是 rpx（750 设计稿），浏览器不认识这个单位。
 * 这里在 PostCSS 阶段把 quick-pick-main 里的 `Nrpx` 换成 `calc(var(--u) * N)`，
 * --u 由 src/live/live.css 定义（1rpx = 390/750px = 0.52px）。
 * 只处理 app 目录，设计台自己的 CSS 不受影响。
 */
const rpxToCalc = () => ({
  postcssPlugin: 'qingkuai-rpx-to-calc',
  Declaration(decl) {
    const file = decl.source?.input?.file || '';
    if (!file.includes('quick-pick-main')) return;
    if (!decl.value || !decl.value.includes('rpx')) return;
    decl.value = decl.value.replace(/(-?\d*\.?\d+)rpx/g, (_, n) => `calc(var(--u) * ${n})`);
  },
});
rpxToCalc.postcss = true;

/**
 * 小程序标签 → HTML 标签。
 *
 * Vue 不允许把 `view` / `text` / `image` 注册成组件（内置保留名），
 * 所以这里在 SFC 编译前把模板里的标签按 1:1 换掉，属性、指令、class 全部保留：
 *   view→div  text→span  image→img  scroll-view→div  swiper/swiper-item→div
 *   block→template  cover-view→div
 * 只处理 quick-pick-main 的 .vue，设计台自己的文件不动。
 */
const MP_TAGS = {
  view: 'div',
  text: 'span',
  image: 'img',
  'scroll-view': 'div',
  swiper: 'div',
  'swiper-item': 'div',
  'cover-view': 'div',
  'cover-image': 'img',
  navigator: 'div',
  block: 'template',
};
const MP_TAG_RE = new RegExp(
  `<\\/?(${Object.keys(MP_TAGS)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?=[\\s/>])`,
  'g',
);

function rewriteMpTags(code) {
  /* 只动模板段：第一个 <script / <style 之前的部分 */
  const cut = ['<script', '<style']
    .map((token) => {
      const index = code.indexOf(token);
      return index < 0 ? Number.POSITIVE_INFINITY : index;
    })
    .reduce((min, value) => Math.min(min, value), Number.POSITIVE_INFINITY);
  const head = cut === Number.POSITIVE_INFINITY ? code : code.slice(0, cut);
  const rest = cut === Number.POSITIVE_INFINITY ? '' : code.slice(cut);
  const rewritten = head.replace(MP_TAG_RE, (match, tag) => match.replace(tag, MP_TAGS[tag]));
  return rewritten + rest;
}

const mpTags = () => ({
  name: 'qingkuai-mp-tags',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('quick-pick-main') || !id.endsWith('.vue')) return null;
    if (!code.includes('<template')) return null;
    return { code: rewriteMpTags(code), map: null };
  },
});

export default defineConfig({
  plugins: [mpTags(), vue()],
  base: '/qingkuai/',
  resolve: {
    alias: [
      /* 小程序源码里 @/xxx 指向 quick-pick-main 根目录（styles/colors.scss、uni_modules/…） */
      { find: /^@\//, replacement: `${APP_ROOT}/` },
      /* 显式别名，给设计台里 import 原生组件用；没有源码目录时退到占位实现 */
      { find: '@app', replacement: HAS_APP ? APP_ROOT : APP_FALLBACK },
    ],
  },
  css: {
    postcss: {
      plugins: [rpxToCalc()],
    },
    /* sass 不在此处指定：Vite 8 只从本项目的 node_modules 找，
       由 scripts/link-sass.cjs（npm run dev 前自动执行）把它链过来 */
  },
  server: {
    fs: {
      /* 允许读取仓库外的 quick-pick-main 源码 */
      allow: HAS_APP ? [here, APP_ROOT] : [here],
    },
  },
});
