# Design Skill Pack

一组用于生成品牌风格前端页面和 HTML 演示文稿的 Claude Code Skill。

## 概览

Design Skill Pack 提供两个可组合使用的 Skill，以 `DESIGN.md` 为核心——一种用于描述品牌视觉系统（颜色、字体、圆角、间距、气质）的结构化格式。

```
brand-design-tokens  ──→  brand-slides
       ↑
  71 套真实品牌
  设计系统
```

- **`brand-design-tokens`** — 品牌 token 数据库 + 路由 Skill。负责选定品牌并提供 `DESIGN.md` 供下游使用。
- **`brand-slides`** — 零依赖 HTML 演示文稿生成器。支持品牌 token 套用或预设风格。基于 [frontend-slides](https://github.com/zarazhangrui/frontend-slides) 构建。

两个 Skill 可独立使用，也可组合使用。

## Skill 说明

### `brand-design-tokens`

将用户意图路由到对应品牌的设计系统，并输出 token 数据。

- 71 套真实品牌 `DESIGN.md`（Claude、Stripe、Linear、Vercel、Notion、Apple 等）
- `brands.json` 索引，包含 `id`、`name`、`theme`、`vibe`、`scenarios`、`blurb` 字段
- 三种选品牌方式：点名品牌、浏览[预览站](https://efun19.github.io/design-skill-pack/brands.html)、按场景/气质推荐
- 多品牌对比：通过 `generate-demo.js` 生成对比 Demo

### `brand-slides`

生成自包含的 HTML 演示文稿（`index.html`），CSS/JS 全部内联，无需构建工具，零依赖。

- **风格选择：** 情绪引导 → 3 个视觉预览，或直接选预设，或套用品牌 token
- **12 个精选预设** — Bold Signal、Electric Studio、Dark Botanical、Notebook Tabs、Swiss Modern 等
- **品牌 token 集成** — 通过 `brand-tokens-bridge.md` 将 `DESIGN.md` 的颜色、字体、圆角映射到任意预设
- **视口适配** — 每张幻灯片适配 `100dvh`，流式排版使用 `clamp()`，幻灯片内无滚动条
- **在线编辑** — 可选的浏览器内文字编辑，`localStorage` 自动保存
- **PDF 导出** — 通过 `scripts/export-pdf.sh` 使用 Playwright 截图转 PDF

## 品牌预览

在线浏览全部 71 套品牌效果：

```
https://efun19.github.io/design-skill-pack/brands.html
```

## 安装

将 Skill 目录复制到对应 AI 编程工具的 Skills 目录。支持用户级和项目级两种安装方式：

### 用户级安装（对所有项目生效）

```bash
cp -r brand-design-tokens ~/.claude/skills/
cp -r brand-slides        ~/.claude/skills/
```

### 项目级安装（仅当前项目生效）

```bash
cp -r brand-design-tokens /path/to/your-project/.claude/skills/
cp -r brand-slides        /path/to/your-project/.claude/skills/
```

安装后通过对应 AI 编程工具的 Skill 工具调用。

> 其他 AI 编程工具的目录名可能有所不同，请参考其官方文档。

## 目录结构

```
design-skill-pack/
├── brand-design-tokens/
│   ├── SKILL.md
│   ├── brands.json
│   ├── generate-demo.js
│   └── design-md/<brand>/DESIGN.md   （71 套品牌）
│
├── brand-slides/
│   ├── SKILL.md
│   ├── STYLE_PRESETS.md
│   ├── viewport-base.css
│   ├── html-template.md
│   ├── animation-patterns.md
│   ├── brand-tokens-bridge.md
│   └── scripts/
│       ├── export-pdf.sh
│       └── extract-pptx.py
│
└── docs/                             （GitHub Pages 预览站）
    ├── index.html                        （项目介绍演示文稿，GitHub Pages 首页）
    ├── brands.html                       （71 套品牌卡片，可搜索）
    └── examples/<brand>.html
```

## 新增品牌

详见 [ADDING-A-BRAND.md](ADDING-A-BRAND.md)。

1. 将 `DESIGN.md` 放入 `brand-design-tokens/design-md/<brand>/`
2. 在 `brands.json` 中添加品牌索引条目
3. 在 `docs/examples/<brand>.html` 添加预览页
4. 在 `docs/brands.html` 接入品牌卡片

## 致谢

- **[frontend-slides](https://github.com/zarazhangrui/frontend-slides)** by zarazhangrui — `brand-slides` 基于此项目构建。MIT License。
- **[awesome-design-md](https://github.com/VoltAgent/awesome-design-md)** by VoltAgent — 品牌设计 token 的数据来源参考。MIT License。

本项目仅使用设计 token 和抽象视觉气质，不复刻真实品牌 logo、官网文案或专有页面结构。

## License

[MIT](LICENSE)
