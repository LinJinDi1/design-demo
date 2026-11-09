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
  location: ['M12 21.5s6.5-6.2 6.5-11a6.5 6.5 0 1 0-13 0c0 4.8 6.5 11 6.5 11Z', false],
  'location-filled': ['M12 21.5s6.5-6.2 6.5-11a6.5 6.5 0 1 0-13 0c0 4.8 6.5 11 6.5 11Z', true],
  calendar: ['M4.5 6.5h15v14h-15z', false],
  shop: ['M4 9.5h16v10.5H4z M3 9.5l1.6-4.5h14.8L21 9.5', false],
  'heart-filled': ['M12 20.6 4.9 13.5a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.6Z', true],
  heart: ['M12 20.2 4.9 13.1a4.7 4.7 0 0 1 6.6-6.7l.5.5.5-.5a4.7 4.7 0 1 1 6.6 6.7L12 20.2Z', false],
  'person-filled': ['M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c4.2 0 7.5 2.4 7.5 5.5V21h-15v-1.5C4.5 16.4 7.8 14 12 14Z', true],
  person: ['M12 4.5a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z', false],
  right: ['m9.5 5 7 7-7 7', false],
  left: ['M14.5 5l-7 7 7 7', false],
  search: ['M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z M16 16l4 4', false],
  notification: ['M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.3L5 15.6h14l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5Z M10 18.2a2 2 0 0 0 4 0', false],
  refreshempty: ['M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5', false],
  more: ['M6 12h.01M12 12h.01M18 12h.01', false],
  close: ['M6 6l12 12M18 6L6 18', false],
  plus: ['M12 5v14M5 12h14', false],
  checkmarkempty: ['m4.5 12.5 5 5 10-11', false],
  navigate: ['M21 3 3 10.5l7.5 3L14 21 21 3Z', false],
  auth: ['M12 3.5 4.5 7v6c0 4.3 3.2 7 7.5 8 4.3-1 7.5-3.7 7.5-8V7L12 3.5Z', false],
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
