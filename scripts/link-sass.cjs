/*
 * 让设计台能用上 sass，但不给这个静态稿项目再装一份依赖。
 *
 * 背景：现版（live）分支会直接 import quick-pick-main 里的 .vue 组件，
 * 其中 <style lang="scss"> 需要 sass；Vite 是从**本项目**的 node_modules 去找它的，
 * 所以这里把 quick-pick-main 已经装好的 sass 软链进来（Windows 用 junction / *nix 用 symlink）。
 *
 * 如果哪天 quick-pick-main 那边不在了，就在本项目里 `npm i -D sass`，本脚本会自动跳过。
 */
const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const projectRoot = path.resolve(here, '..');
const target = path.resolve(projectRoot, '../quick-pick-main/node_modules/sass');
const link = path.resolve(projectRoot, 'node_modules/sass');

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

if (exists(link)) {
  console.log('[link-sass] node_modules/sass 已存在，跳过');
} else if (!exists(target)) {
  console.log('[link-sass] 没找到 quick-pick-main/node_modules/sass，请在本项目执行 npm i -D sass');
  process.exit(0);
} else {
  fs.mkdirSync(path.dirname(link), { recursive: true });
  fs.symlinkSync(target, link, 'junction');
  console.log(`[link-sass] ${link} -> ${target}`);
}
