import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

export default defineConfig({
  base,
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
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    logo: '/image/SILANDRI/SILANDRI.png',
    docFooter: {
      prev: "上一页",
      next: "下一页"
    },
    footer: {
      message: "C.S.T.F. 为此 Wiki 的建立付出了不可磨灭的贡献。",
      copyright: `Copyright © 2023-present SILANDRI`
    },
    editLink: {
      pattern: `https://github.com/jiesendesi/jiesendesi.github.io/edit/main/:path`,
      text: "在 GitHub 上编辑此页"
    }

  }
})
