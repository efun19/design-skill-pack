# Design Skill Pack

Design Skill Pack 是一组围绕 `DESIGN.md` 的设计生成工具。它把真实品牌的设计系统 token 整理成可复用数据源，并提供两个下游能力：品牌风格网页/组件生成，以及品牌风格 HTML slides 生成。

核心思路：

- `DESIGN.md` 负责视觉依据：颜色、字体、排版、圆角、间距和设计气质。
- 用户材料负责内容：产品介绍、报告、roadmap、pitch deck、文档等。
- Skill 负责路由和生成：先选品牌 token，再按目标产物生成 HTML / UI / slides。

本项目只使用品牌 token 和视觉气质，不复刻真实品牌官网、logo、插图或营销文案。

## 当前组成

```text
design-skill-pack/
├── brand-design-tokens/
│   ├── SKILL.md
│   ├── brands.json
│   └── design-md/<brand>/DESIGN.md
│
├── brand-slides/
│   ├── SKILL.md
│   ├── formats/PRESENTATION-FORMATS.md
│   ├── layouts/SLIDE-LAYOUTS.md
│   ├── styles/FRONTEND-SLIDES-PRESETS.md
│   ├── transitions/TRANSITIONS.md
│   └── tokens/DESIGN-TO-SLIDE.md
│
├── docs/                        ← 预览站（GitHub Pages 部署）
│   ├── index.html
│   └── examples/<brand>.html
│
├── ADDING-A-BRAND.md
├── CONTENT-SPEC.md
└── README.md
```

## `brand-design-tokens`

`brand-design-tokens` 是品牌 token 数据源，也是一个可独立使用的 skill。

它包含：

- 71 套品牌 `DESIGN.md`
- `brands.json` 品牌索引，包含 `id`、`name`、`theme`、`vibe`、`scenarios`、`blurb`、`design_md`
- `SKILL.md` 品牌路由规则

适用场景：

- 用户点名某个品牌风格，例如 Claude、Stripe、Linear、Apple、Vercel、Notion
- 用户要求按 brand style、design system、design tokens 或 `DESIGN.md` 生成前端产物
- 用户没想清楚风格，需要按场景或气质推荐品牌

它不直接负责最终代码生成。它的职责是把用户的视觉意图路由到正确的 `DESIGN.md`，再交给对应的前端实现或下游 skill。

## `brand-slides`

`brand-slides` 是一个创建型 HTML PPT / deck skill。它明确依赖同级的 `brand-design-tokens`，只消费其中的 `brands.json` 和 `design-md/<brand>/DESIGN.md`，但不使用固定模板。

它的流程完全按创建型 `frontend-slides` 思路走：

1. 询问内容：slides、messages、images、资料或主题。
2. 询问 design：点名品牌、先预览再选，或按场景/气质推荐品牌。
3. 生成 3 个 visual style previews 供用户比较。
4. 用户选完后删除临时 preview HTML。
5. 按用户选中的风格在项目根目录新建目录，并创建完整自包含 HTML presentation。
6. 打开浏览器预览最终文件。

`brand-slides` 不再逐项询问 frame、navigation、transition、layout strategy。那些只作为内部生成决策，不是用户配置表单。用户只需要确认内容、design 和 3 个视觉预览中的方向。

注意：本 skill 没有模板步骤。生成 deck 时必须从用户内容、选定 design、选定 preview 和品牌 `DESIGN.md` 从零组织页面，不能照抄固定 scaffold 或让所有 PPT 都长得像同一个模板。

输出规则：3 个 visual style previews 可以生成临时 HTML 方便比较，但用户选定后必须删除该 preview 文件。最终 presentation 默认写到项目根目录新建目录中，例如 `<deck-slug>/index.html`；除非用户指定路径，不要写进 `brand-slides/` skill 目录。

可参考的 visual direction：

```text
bold-signal
electric-studio
creative-voltage
dark-botanical
notebook-tabs
pastel-geometry
split-pastel
vintage-editorial
neon-cyber
terminal-green
swiss-modern
paper-ink
```

支持的 deck type：

| 类型 | 适用场景 | 默认页数 |
|------|----------|----------|
| `pitch-deck` | 融资、创业项目、商业提案 | 7-8 |
| `product-intro` | 产品介绍、功能发布、营销说明 | 5-7 |
| `roadmap` | 规划、里程碑、版本路线 | 5-6 |
| `report` | 总结、复盘、数据报告 | 5-8 |
| `lesson` | 课程、培训、知识讲解 | 6-8 |

可选 layout：

```text
cover-centered
cover-split
title-bullets
feature-grid-3
metric-strip
timeline
quote-focus
comparison-split
closing-cta
```

内部可用 frame：

```text
fit-16x9
full-bleed
stage-card
scroll-snap
```

内部可用 navigation：

```text
keyboard-dots-touch
keyboard-only
dots-only
scroll
```

内部可用 transition：

```text
fade-up
scale-in
slide-left
blur-in
cut
```

`brand-slides` 不接入完整 `frontend-slides`，也不做 PPT/PDF 转换、图片导出或分享发布。它只保留核心创建：生成可打开的单文件 HTML slides。

## 两个 Skill 的关系

```text
用户: "用 Stripe 风格做一个 pitch deck"
        │
        ▼
brand-slides
  1. 询问或读取内容
  2. 读取 ../brand-design-tokens/brands.json
  3. 找到 Stripe 的 DESIGN.md
  4. 确认用户想要的 design
  5. 生成 3 个 visual style previews
  6. 删除临时 preview HTML
  7. 在项目根目录新建 deck 输出目录
  8. 按用户选中的 preview 从零创建 index.html
  9. 打开浏览器
        │
        ▼
brand-design-tokens
  提供品牌索引和 DESIGN.md token
```

依赖边界：

- `brand-slides` 依赖 `brand-design-tokens/brands.json`
- `brand-slides` 依赖 `brand-design-tokens/design-md/<brand>/DESIGN.md`
- `brand-slides` 不依赖 `brand-design-tokens/examples/*.html`
- `brand-slides` 不复制 71 套品牌 token
- `brand-slides` 不使用固定 HTML 模板

## 使用方式

### 预览品牌风格

在线预览（71 套品牌效果）：

```
https://efun19.github.io/design-skill-pack/
```

使用 skill 时，如果用户没点名品牌，AI 必须把这个链接直接提供给用户。预览页只用于人工选择风格，不作为代码生成依据。

### 使用品牌 token 写 UI

典型请求：

```text
用 Linear 风格做一个 SaaS dashboard 页面
```

流程：

1. 使用 `brand-design-tokens` 查找 Linear。
2. 读取 `brand-design-tokens/design-md/linear/DESIGN.md`。
3. 按该 token 继续实现 HTML / React / Vue / Tailwind 产物。

### 使用品牌 token 做 HTML PPT

典型请求：

```text
用 Stripe 风格做一个 AI 产品 pitch deck
```

流程：

1. 使用 `brand-slides`。
2. 检查同级 `brand-design-tokens` 是否存在。
3. 选择 design 风格，流程和 `brand-design-tokens` 一样：
   - 点名品牌：直接匹配 `id` / `name`。
   - 浏览选择：如果用户没点名品牌，提供在线预览链接 `https://efun19.github.io/design-skill-pack/`，等用户看完 71 套预览后再选。
   - 场景推荐：按 `scenarios`、`vibe`、`theme` 推荐 2-3 个品牌。
4. 读取选定品牌的 `DESIGN.md`。
5. 询问内容和 design；如果用户已提供则不重复追问。
6. 生成 3 个 visual style previews，等待用户选择或混合。
7. 用户选定后删除临时 preview HTML。
8. 按选中方向在项目根目录新建目录，输出一个自包含 `index.html`。
9. 直接打开浏览器；无法打开时提供本地 HTML 路径。

## 新增品牌

新增品牌时改动 `brand-design-tokens` 和 `docs`：

1. 把该品牌的 `DESIGN.md` 放到 `brand-design-tokens/design-md/<brand>/DESIGN.md`。
2. 在 `brand-design-tokens/brands.json` 加品牌索引。
3. 按 `ADDING-A-BRAND.md` 手写 `docs/examples/<brand>.html`。
4. 在 `docs/index.html` 接入品牌卡片。

不要在 `brand-slides` 中复制品牌 token。`brand-slides` 永远从 `brand-design-tokens` 读取数据。

## 设计来源与风险声明

- 设计 token 来源参考 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)，MIT License。
- 本项目只使用设计 token 和抽象视觉气质，不使用真实品牌 logo、官网文案或专有页面结构。
- 部分品牌字体是付费或专有字体，生成时必须保留 fallback 字体链。
- `DESIGN.md` 原本面向网页，不是幻灯片；用于 slides 时必须经过 Token Cropping，避免信息密度和留白比例失控。

## 项目状态

| 模块 | 状态 | 说明 |
|------|------|------|
| `brand-design-tokens` | 已完成 | 71 套品牌 token、预览站和 skill |
| `brand-slides` | 已搭建 | 轻量 HTML slides skill、layout、transition、runtime |
| 模板驱动 PPT | 未开始 | 从预制模板挑选并改内容 |

## License

MIT License — see [LICENSE](LICENSE).
