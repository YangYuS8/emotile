import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Emotile',
  description: 'A pixel expression language and runtime for AI agents',
  base: '/emotile/',
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/what-is-emotile' },
      { text: 'API', link: '/api/' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Contributing', link: '/contributing' },
      {
        text: 'Languages',
        items: [
          { text: 'English', link: '/' },
          { text: '中文', link: '/zh/' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'What is Emotile', link: '/guide/what-is-emotile' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Expression Schema', link: '/guide/expression-schema' },
            { text: 'Agent Guidance', link: '/guide/agent-guidance' },
          ],
        },
        {
          text: 'Project',
          items: [
            { text: 'Roadmap', link: '/roadmap' },
            { text: 'v0.2 Plan', link: '/v0.2-plan' },
            { text: 'Decisions', link: '/decisions' },
            { text: 'Contributing', link: '/contributing' },
            { text: 'Writing Guidelines', link: '/writing-guidelines' },
          ],
        },
      ],
      '/zh/guide/': [
        {
          text: '入门',
          items: [
            { text: '什么是 Emotile', link: '/zh/guide/what-is-emotile' },
            { text: '快速开始', link: '/zh/guide/quick-start' },
            { text: '表达式结构', link: '/zh/guide/expression-schema' },
            { text: 'Agent 指南', link: '/zh/guide/agent-guidance' },
          ],
        },
        {
          text: '项目',
          items: [
            { text: '路线图', link: '/zh/roadmap' },
            { text: 'v0.2 计划', link: '/zh/v0.2-plan' },
            { text: '决策记录', link: '/zh/decisions' },
            { text: '贡献指南', link: '/zh/contributing' },
            { text: '文档规范', link: '/zh/writing-guidelines' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YangYuS8/emotile' },
    ],

    editLink: {
      pattern: 'https://github.com/YangYuS8/emotile/edit/main/docs/:path',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Emotile Contributors',
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/what-is-emotile' },
          { text: 'API', link: '/zh/api/' },
          { text: '路线图', link: '/zh/roadmap' },
          { text: '贡献指南', link: '/zh/contributing' },
          {
            text: '语言',
            items: [
              { text: 'English', link: '/' },
              { text: '中文', link: '/zh/' },
            ],
          },
        ],
      },
    },
  },
})
