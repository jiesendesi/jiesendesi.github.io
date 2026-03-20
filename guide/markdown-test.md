---
title: Markdown 解析测试页
description: 用于检验 VitePress 的 Markdown 渲染、代码高亮、容器、表格、Mermaid 等能力
---

# Markdown 解析测试页

这是一篇“尽量覆盖常见语法”的页面，用来检验：

- 标题层级与右侧目录（Outline）
- 段落、粗体/斜体、行内代码、换行
- 引用、列表（含嵌套）、任务列表
- 表格、分割线
- 代码块（含高亮、代码组）、代码导入
- 图片、链接、锚点
- 容器（tip/warning/danger/details）
- Mermaid 图

---

## 1. 标题与锚点

跳转测试：

- [跳到表格](#3-表格)
- [跳到代码组](#5-代码组)
- [跳到 mermaid](#7-mermaid)

### 1.1 行内样式

这里有 **粗体**、*斜体*、~~删除线~~、`行内代码`。

同一段落中测试特殊字符转义：`<tag>`、`a_b`、`a\_b`、`1 < 2 && 2 > 1`。

> 这是引用（blockquote）。
>
> - 引用里的列表
> - 第二项

---

## 2. 列表

### 2.1 无序列表（嵌套）

- 一级 A
  - 二级 A-1
    - 三级 A-1-a
- 一级 B

### 2.2 有序列表（连续性）

1. 第一项
2. 第二项
3. 第三项

### 2.3 任务列表

- [x] 已完成
- [ ] 未完成

---

## 3. 表格

| 列名左对齐 | 列名居中 | 列名右对齐 |
| :-- | :-: | --: |
| foo | bar | 123 |
| 长文本测试：Markdown 表格单元格里也可以有 `code` | OK | 9999 |

---

## 4. 代码块与高亮

### 4.1 TypeScript

```ts
type User = { id: string; name: string };

export function hello(user: User) {
  return `Hello, ${user.name} (#${user.id})`;
}
```

### 4.2 Bash

```bash
pnpm run docs:dev
pnpm run docs:build
```

---

## 5. 代码组

::: code-group

```sh [pnpm]
pnpm run docs:dev
```

```sh [npm]
npm run docs:dev
```

```sh [yarn]
yarn docs:dev
```

:::

---

## 6. 容器（Containers）

::: tip 提示
这是 `tip` 容器，用于放置建议或补充说明。
:::

::: warning 注意
这是 `warning` 容器，用于强调可能的风险或注意事项。
:::

::: danger 危险
这是 `danger` 容器，用于强调高风险内容。
:::

::: details 点击展开
这里是 `details` 容器内容：

- 支持列表
- 支持 **加粗** 与 `code`
:::

---

外部链接测试：<https://vitepress.dev/>

### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" />
