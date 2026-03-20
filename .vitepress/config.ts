import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: "SILANDRI",
  description: "席兰德里",
  lang: "zh-CN",
  head: [['link', { rel: 'icon', type: 'image/png', href: `/image/SILANDRI/SILANDRI.png` }]],
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: "SILANDRI",
    outline: { level: "deep", label: "目录" },
    search: { provider: "local" },
    nav: [
      { text: '首页', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: "成员", link: "/members" }
    ],

    sidebar: {
      "/guide/": [
        {
          text: "开始之前……",
          collapsed: false,
          items: [
            { text: "介绍", link: "/guide/intro" },
            { text: "Markdown 解析测试", link: "/guide/markdown-test" }
          ]
        }
      ]
    },
    logo: '/image/SILANDRI/SILANDRI.png',
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2023-present SILANDRI`
    },
    editLink: {
      pattern: `https://github.com/jiesendesi/jiesendesi.github.io/edit/main/:path`,
      text: "在 GitHub 上编辑此页"
    }

  }
})
