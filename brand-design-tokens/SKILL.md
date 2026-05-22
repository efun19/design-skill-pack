---
name: brand-design-tokens
description: >
  当前端、UI、页面或组件需要套用某个品牌风格、设计系统或 DESIGN.md 设计 token
  时使用。负责从品牌 token 库中按品牌名、场景、气质路由到正确的
  DESIGN.md,提供配色、字体、排版、圆角、间距等视觉依据。适用于用户提到
  Claude、Stripe、Linear、Apple、Vercel、Notion 等品牌风格,或要求 brand style、
  design system、design tokens、DESIGN.md、选择视觉风格。本 skill 不单独生成代码,
  应配合前端实现继续完成 HTML / React / Vue / Tailwind 等产物。用户已提供完整
  设计稿或设计系统时不适用。
---

# brand-design-tokens

## Overview

71 套真实品牌的设计系统 token 库。本 skill **不单独负责代码生成** —— 它先把
用户的风格意图路由到正确的 `DESIGN.md`,再按用户原始需求继续实现界面。产物
形态(HTML / React / Vue / Tailwind 等)由当时需求决定。

它是前端实现 skill 的风格前置层:先选定品牌 token,再继续编码。不要把它当作
通用 UI 美化 skill,也不要跳过 token 直接凭印象写。

## When to Use

- 用户点名了某品牌或某设计系统,如 Claude / Stripe / Linear / Apple / Vercel / Notion
- 用户要求按某种品牌风格、brand style、design system、design tokens 或 `DESIGN.md` 写界面
- 前端 / UI / 页面 / 组件已经要实现,但需要先选择视觉方向或品牌 token
- 需要配色 / 字体 / 排版 / 圆角 / 间距方案,且这些方案应来自真实品牌 token

**不适用:** 用户已提供完整视觉规范(自带设计稿 / 设计系统)。

## Data Files

| 文件 | 内容 |
|------|------|
| `brands.json` | 71 条路由索引 |
| `design-md/<brand>/DESIGN.md` | 各品牌完整 token(colors / typography / rounded / spacing) |
| `examples/<brand>.html` | 各品牌渲染预览页,只用于浏览效果,不要作为生成依据 |
| `index.html` | 71 套预览总索引,带搜索和分类,只用于选择风格 |

`brands.json` 每条字段:`id` `name` `theme` `vibe`(中文风格词)
`scenarios`(英文场景标签)`blurb`(一句话描述)`design_md`(token 文档路径)。

## Routing — 三选一

判断用户属于哪条路径:

**路径 1 · 点名了品牌**(如「按 Claude 风格写 HTML」「用 Stripe 风格写落地页」)
1. 读 `brands.json`,按 `name` / `id` 定位。
2. 不在 71 条内 → 告诉用户「该品牌不在库中」,转路径 2 或 3。不猜、不套近似品牌。
3. 命中 → 把 `design_md` 指向的 `DESIGN.md` **全文**读入,只按该 token 写前端。
   不要读取或参考 `examples/<id>.html`;预览页只用于人工浏览效果,不是生成依据。

**路径 2 · 不确定风格**
必须把本 skill 目录的 `index.html` 直接提供给用户,并在环境允许时直接帮用户打开浏览器预览 71 套真实效果。选定后转路径 1 第 3 步。

执行要求:
1. 优先直接打开 `index.html`。本地命令可用时执行 `open docs/index.html` 或等价方式。
2. 无法直接打开时,必须给出可点击/可复制的 HTML 路径,例如 `docs/index.html`。
3. 明确告诉用户:预览页只用于人工挑选风格,生成时仍只读取对应 `DESIGN.md`,不要从预览 HTML 抽结构、样式或代码。
4. 打开或提供链接后暂停,等待用户选定品牌。不要替用户默认选择。

**路径 3 · 描述了场景或气质**(如「写个博客」「想要暗色编辑感」)
读 `brands.json`,按三个维度过滤:`scenarios`(用途)、`vibe`(气质)、
`theme`(用户提到亮/暗时)。推荐 2-3 个品牌并各附 `blurb`。若三维交叉后候选
不足,放宽到只匹配最强的维度,并向用户说明取舍。用户拍板后转路径 1 第 3 步。

## Common Mistakes

- **跳过路径直接凭印象写** —— 必须真的读 `DESIGN.md` 全文,token 才准。
- **品牌不在库时强行套近似品牌** —— 不要。明确告知不在库。
- **路径 3 只看 `vibe` 不看 `scenarios`** —— 气质和用途两个维度都要过滤。
- **读取 `examples/<id>.html` 后照着写** —— 不要。生成时只读取对应品牌的 `DESIGN.md`,不要从预览 HTML 抽结构、样式或代码。
- **把本 skill 当成通用前端实现 skill** —— 不要。它负责品牌 token 路由,实现仍按用户原始技术栈继续。
- **复刻真实品牌官网 / logo / 文案** —— 不要。只使用品牌 token 和视觉气质,页面内容应服务用户项目。
