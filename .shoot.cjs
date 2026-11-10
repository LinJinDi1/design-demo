/*
 * 现版复刻截图工具：无头 Chrome + CDP，截 .phone 画布（390 × 888）。
 * 用法：node .shoot.cjs home live [--full]
 *   node .shoot.cjs home live        → 首屏
 *   node .shoot.cjs home live full   → 整页（滚动内容高度）
 * 产出：.shots/<design>-<scene>[-full].png
 */
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
/* 端口随机取空闲的、用户目录按进程号取：并行截多张图不会互相抢 */
let PORT = 0;
function isFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '127.0.0.1');
  });
}
async function pickPort() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const port = 9300 + Math.floor(Math.random() * 600);
    if (await isFree(port)) return port;
  }
  return 9999;
}
const OUT = path.join(__dirname, '.shots');
const PROFILE = path.join(__dirname, `.chrome-profile-${process.pid}`);
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const scene = process.argv[2] || 'home';
  const design = process.argv[3] || 'live';
  const full = process.argv[4] === 'full';
  PORT = Number(process.env.SHOOT_PORT) || (await pickPort());

  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      '--remote-allow-origins=*',
      `--user-data-dir=${PROFILE}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--disable-gpu',
      '--window-size=1500,1400',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    await waitChrome();
    const target = await (
      await fetch(`http://127.0.0.1:${PORT}/json/new?url=about:blank`, { method: 'PUT' })
    ).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const handler = pending.get(message.id);
        pending.delete(message.id);
        handler(message);
      }
    });
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const current = (id += 1);
        pending.set(current, (message) =>
          message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result),
        );
        ws.send(JSON.stringify({ id: current, method, params }));
      });
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result && result.result.value;
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1400, deviceScaleFactor: 2, mobile: false });

    const url = `http://localhost:5173/qingkuai/?scene=${scene}&design=${design}`;
    await send('Page.navigate', { url });
    await waitApp(evaluate);
    /* 等所有图片解码完；偶发加载失败就整页重载一次，避免截出破图 */
    for (let round = 0; round < 3; round += 1) {
      let failed = 0;
      for (let attempt = 0; attempt < 40; attempt += 1) {
        failed = await evaluate(`[...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length`).catch(() => 0);
        if (!failed) break;
        await sleep(150);
      }
      if (!failed) break;
      if (round === 2) break;
      await send('Page.reload', { ignoreCache: true });
      await waitApp(evaluate);
    }

    /* 关掉动画，方便量稳定尺寸 */
    await evaluate(`(() => { const s = document.createElement('style'); s.textContent = '*{animation:none !important;transition:none !important}'; document.head.appendChild(s); return 'ok'; })()`);
    if (process.env.PRE_JS) await evaluate(process.env.PRE_JS);
    await sleep(600);

    const geo = await evaluate(`(() => {
      const phone = document.querySelector('.phone');
      const content = document.querySelector('.phone-content');
      if (!phone) return null;
      const r = phone.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, scrollHeight: content ? content.scrollHeight : r.height, scrollWidth: content ? content.scrollWidth : r.width };
    })()`);    if (!geo) throw new Error('没找到 .phone');
    console.log('phone', geo);

    const height = full ? Math.min(geo.scrollHeight, 4000) : geo.height;
    if (full) {
      /* 手机壳是定高 + 内部滚动，整页截图需要先把壳撑开、藏掉悬浮底栏 */
      await evaluate(`(() => {
        const st = document.createElement('style');
        st.textContent = '.phone{height:auto !important;min-height:888px} .phone-content{height:auto !important;overflow:visible !important} .live-tabbar,.bottom-nav,.status-bar{display:none !important}';
        document.head.appendChild(st);
        return 'ok';
      })()`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1500,
        height: Math.ceil(height + 400),
        deviceScaleFactor: 2,
        mobile: false,
      });
      await sleep(500);
      const expanded = await evaluate(`document.querySelector('.phone').getBoundingClientRect().height`);
      geo.height = Math.max(expanded, height);
    }

    const clip = process.env.CLIP_SEL
      ? await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(process.env.CLIP_SEL)}); if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x) - 8, y: Math.round(r.y) - 8, width: Math.round(r.width) + 16, height: Math.round(r.height) + 16, scale: 1 }; })()`)
      : { x: Math.round(geo.x), y: Math.round(geo.y), width: Math.round(geo.width), height: Math.round(geo.height), scale: 1 };
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
    const name = `${design}-${scene}${full ? '-full' : ''}${process.env.CLIP_SEL ? '-clip' : ''}${process.env.PRE_TAG || ''}.png`;
    fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'));
    console.log('saved', path.join(OUT, name));
    ws.close();
  } finally {
    chrome.kill();
  }
}

async function waitChrome() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (response.ok) return;
    } catch {
      /* keep polling */
    }
    await sleep(200);
  }
  throw new Error('Chrome 未启动');
}

async function waitApp(evaluate) {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    try {
      const ready = await evaluate(`(() => {
        const phone = document.querySelector('.phone');
        const studio = document.querySelector('.studio');
        return !!(phone && studio && phone.getBoundingClientRect().width > 100);
      })()`);
      if (ready) return;
    } catch {
      /* 页面还在编译 */
    }
    await sleep(500);
  }
  throw new Error('设计台没加载出来');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
