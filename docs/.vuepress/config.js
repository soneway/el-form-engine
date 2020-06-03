module.exports = {
  host: '127.0.0.1',
  port: '8320',
  title: '表单引擎',
  base: '/form-engine/docs-dist/',
  lastUpdated: 'Last Updated',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/start' },
    ],
    sidebar: [
      {
        title: '指南',
        collapsable: false,
        children: [
          ['/guide/start', '快速上手'],
          ['/guide/schema', '表单数据配置规范'],
        ],
      },
      {
        title: '组件',
        collapsable: false,
        children: [
          ['/components/form-editor', 'FormEditor 表单填写'],
        ],
      },
    ],
  },
};
