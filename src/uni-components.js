/*
 * easycom / 内置组件的 web 替身。
 *
 * 注意：`view` / `text` / `image` 是 Vue 的内置保留标签名，**不能**注册成组件
 * （会报 "Do not use built-in or reserved HTML elements as component id"）。
 * 所以这三个跟 scroll-view / swiper / block 一起，在 vite.config.js 的
 * `qingkuai-mp-tags` 插件里直接改写成 div / span / img / template。
 *
 * 这里只留真正需要保留语义的：uni-icons（字体图标 → 同形状内联 SVG）。
 */
import { defineComponent, h } from 'vue';

/* ---------- uni-icons：type → 24×24 路径（[路径, 是否填充]） ---------- */
const ICONS = {
  'star-filled': ['M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z', true],
  star: ['M12 3.2l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.8l6.2-.9L12 3.2Z', false],
  location: [
    'M12 21.2s6.4-6 6.4-10.6a6.4 6.4 0 1 0-12.8 0c0 4.6 6.4 10.6 6.4 10.6Z M12 10.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8',
    false,
  ],
  'location-filled': [
    'M12 21.2s6.4-6 6.4-10.6a6.4 6.4 0 1 0-12.8 0c0 4.6 6.4 10.6 6.4 10.6Z',
    true,
  ],
  calendar: [
    'M4.6 7.4h14.8v12.2H4.6z M4.6 11.2h14.8 M8.6 4v4.4 M15.4 4v4.4',
    false,
  ],
  shop: ['M4.2 9.6h15.6v10.2H4.2z M3.2 9.6 4.9 4.8h14.2l1.7 4.8 M9.4 19.8v-5.2h5.2v5.2', false],
  'heart-filled': ['M12 20.6 4.9 13.5a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.6Z', true],
  heart: ['M12 20.2 4.9 13.1a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.2Z', false],
  'person-filled': ['M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4.2 0 7.5 2.4 7.5 5.5V21h-15v-1.5C4.5 16.4 7.8 14 12 14Z', true],
  person: ['M12 4.5a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z M4.8 20.4c.7-3.7 3.6-6 7.2-6s6.5 2.3 7.2 6', false],
  right: ['m9.5 5 7 7-7 7', false],
  left: ['M14.5 5l-7 7 7 7', false],
  up: ['m5 15 7-7 7 7', false],
  down: ['m5 9 7 7 7-7', false],
  bottom: ['m5 9 7 7 7-7', false],
  flag: ['M6.2 20.4V4.2 M6.2 4.8h10.2l-1.5 3.4 1.5 3.4H6.2', false],
  search: ['M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z M16 16l4 4', false],
  notification: ['M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z M10 18.2a2 2 0 0 0 4 0', false],
  refreshempty: ['M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5', false],
  more: ['M6 12h.01M12 12h.01M18 12h.01', false],
  close: ['M6 6l12 12M18 6L6 18', false],
  plus: ['M12 5v14M5 12h14', false],
  checkmarkempty: ['m4.5 12.5 5 5 10-11', false],
  navigate: ['M21 3 3 10.5l7.5 3L14 21 21 3Z', false],
  auth: ['M12 3.5 4.5 7v6c0 4.3 3.2 7 7.5 8 4.3-1 7.5-3.7 7.5-8V7L12 3.5Z', false],
  info: ['M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Z M12 10.6v6 M12 7.7v.02', false],
  gear: [
    'M12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z M19.3 12c0-.5 0-1-.1-1.4l1.6-1.2-1.8-3.1-1.9.8c-.7-.6-1.5-1.1-2.3-1.4L14.4 3h-3.6l-.4 2.1c-.9.3-1.6.8-2.3 1.4l-1.9-.8-1.8 3.1 1.6 1.2c0 .5-.1 1-.1 1.4s0 1 .1 1.4l-1.6 1.2 1.8 3.1 1.9-.8c.7.6 1.4 1.1 2.3 1.4l.4 2.1h3.6l.4-2.1c.9-.3 1.6-.8 2.3-1.4l1.9.8 1.8-3.1-1.6-1.2c.1-.5.1-1 .1-1.4Z',
    false,
  ],
  map: ['M9 4.5 3.5 6.8v13L9 17.5l5.5 2.3 5.5-2.3v-13L14.5 6.7 9 4.5Z M9 4.5v13 M14.5 6.7v13', false],
  chat: ['M5.6 5h12.8a1.8 1.8 0 0 1 1.8 1.8v7.4a1.8 1.8 0 0 1-1.8 1.8h-6.6L7 19.6v-3.6H5.6a1.8 1.8 0 0 1-1.8-1.8V6.8A1.8 1.8 0 0 1 5.6 5Z', false],
  camera: ['M4 8.4h3.2L9 5.8h6l1.8 2.6H20v10.4H4z M12 16.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z', false],
  trash: ['M4.6 6.8h14.8 M9.4 6.8V4.4h5.2v2.4 M6.6 6.8l.9 13h9l.9-13', false],
  checkbox: ['M4.6 4.6h14.8v14.8H4.6z M8.4 12.2l2.6 2.6 4.8-5.2', false],
  circle: ['M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Z', false],
};

const UniIcons = defineComponent({
  name: 'UniIcons',
  inheritAttrs: false,
  props: {
    type: { type: String, default: '' },
    size: { type: [Number, String], default: 16 },
    color: { type: String, default: '#333333' },
  },
  setup(props, { attrs }) {
    return () => {
      const size = Number(props.size) || 16;
      const entry = ICONS[props.type];
      const d = entry ? entry[0] : ICONS.more[0];
      const filled = entry ? entry[1] : false;
      return h(
        'svg',
        {
          ...attrs,
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: filled ? props.color : 'none',
          stroke: filled ? 'none' : props.color,
          'stroke-width': 1.7,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          style: [{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }, attrs.style],
        },
        [h('path', { d })],
      );
    };
  },
});

export function installUniComponents(app) {
  app.component('uni-icons', UniIcons);
}
