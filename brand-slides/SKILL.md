---
name: brand-slides
description: >
  当用户需要创建 HTML slides / PPT / deck / 演示稿时使用。它依赖同级
  brand-design-tokens 的 brands.json 和 DESIGN.md 获取品牌视觉依据，但不使用模板，
  不做转换，只从用户内容和选定 design 出发，生成 3 个视觉风格预览供用户选择，
  再创建完整自包含 HTML 幻灯片并打开浏览器。
---

# brand-slides

## Overview

`brand-slides` 是一个创建型 HTML slides skill，不是模板套壳工具。

核心流程必须和 `frontend-slides` 的创建流程一致：

1. Ask about your content: slides, messages, images.
2. Ask about the design you want: named brand, preview first, or recommended brands.
3. Generate 3 visual style previews for the user to compare.
4. Create the full presentation in the chosen style.
5. Open it in the browser.

本 skill 只保留核心创建能力。不做 PPT/PDF 转换、不做分享发布、不做模板选择、不把任何 scaffold 当最终视觉来源。

## Hard Rules

- 不使用 `templates/`，本 skill 不应包含或引用固定 HTML 模板。
- 不复用、照抄、改写模板风格。每次 deck 都必须根据内容、选定 design 和选中的视觉预览从零组织 HTML/CSS。
- 不读取 `brand-design-tokens/examples/*.html` 作为生成依据；预览页只用于人工浏览品牌效果。
- 不复制真实品牌 logo、官网文案、插图或页面结构，只使用 `DESIGN.md` 中的 token 和设计气质。
- 不逐项询问 frame、navigation、transition、layout strategy。它们是生成时的内部设计决策，不是用户配置表单。
- 不做转换功能：不要生成 PDF、PPTX、图片导出、speaker notes 转换、在线发布或分享链接。

## Required Layout

本 skill 必须与 `brand-design-tokens/` 同级安装：

```text
design-skill-pack/
├── brand-design-tokens/
│   ├── brands.json
│   └── design-md/<brand>/DESIGN.md
└── brand-slides/
    ├── SKILL.md
    ├── formats/PRESENTATION-FORMATS.md
    ├── layouts/SLIDE-LAYOUTS.md
    ├── styles/FRONTEND-SLIDES-PRESETS.md
    ├── transitions/TRANSITIONS.md
    └── tokens/DESIGN-TO-SLIDE.md
```

运行前必须检查：

1. `../brand-design-tokens/brands.json` 是否存在。
2. 选定品牌是否能在 `brands.json` 中按 `id` 或 `name` 命中。
3. 命中品牌的 `design_md` 指向的 `DESIGN.md` 是否存在。

任一缺失时停止生成，并明确告诉用户缺少什么。不要猜品牌，不要改用近似品牌。

## When to Use

- 用户要求生成 HTML slides、PPT、deck、演示稿、pitch deck、roadmap deck、report deck。
- 用户想把一段材料、主题、文档或想法变成可直接打开的单文件 HTML 演示稿。
- 用户需要先比较几个视觉方向，再选择最终 PPT 风格。

不适用：用户只是在做网页、组件、落地页或 React/Vue UI，此时使用 `brand-design-tokens` 作为视觉前置层即可。

## Creation Flow

### 1. Ask About Content

先确认演示内容，而不是先问模板或配置。

需要了解：

- 原始材料：用户粘贴的文本、文档、会议纪要、PRD、网页、数据、图片说明。
- 核心信息：这套 deck 要让观众记住什么。
- 使用场景：pitch、产品介绍、roadmap、报告、课程、内部汇报、发布会。
- 页数偏好：如果用户未指定，默认建议 5-8 页。

如果用户已经提供足够材料，直接进入下一步。不要重复追问。

如果内容不足，只问一个问题：

```text
你想把哪些内容放进这套 slides？可以贴材料、列要点、说明主题，或告诉我目标观众和核心信息。
```

### 2. Ask About Design

再确认用户想使用哪套 design 风格。这里复用 `brand-design-tokens` 的三路径路由：点名品牌、先预览再选、按场景或气质推荐。

如果用户已经明确指定品牌或品牌 id，例如“用 Stripe 风格”“Linear deck”“Claude 风格 PPT”，直接按 Brand Token Resolution 的路径 1 读取对应 `DESIGN.md`。

如果用户没有指定 design，只问一个问题，并且必须提供预览入口：

示例问题：

```text
你想用哪套 design 风格？

推荐：先预览再选。我可以打开 ../brand-design-tokens/index.html，让你浏览 71 套品牌预览后选定。

也可以直接指定品牌，例如 Stripe / Linear / Claude；或者描述场景和气质，我推荐 2-3 个品牌。
```

如果用户选择“先预览再选”，必须打开或提供 `../brand-design-tokens/index.html`，然后暂停等待用户选定品牌。不要继续生成 3 个 visual style previews。

### 3. Generate 3 Visual Style Previews

生成完整 deck 前，必须先给用户 3 个视觉风格预览进行比较。

预览不是最终 deck，也不是模板。预览用于表达三个不同视觉方向，每个方向至少包含：

```text
Preview A: 名称
Design direction: 目标设计方向
Brand basis: 使用的品牌 token 或推荐品牌
Visual language: 背景、字体、版式、装饰、动效方向
Best for: 为什么适合这份内容
Tradeoff: 它可能不适合什么
```

预览可以是：

- 简短文本风格卡片；或
- 一个临时 HTML preview 文件，包含 3 张并排风格卡片。

如果能创建临时 HTML preview，创建后必须打开浏览器；如果不能打开，提供可点击/可复制路径。

临时 preview 文件规则：

- 只用于让用户比较 A / B / C，不是最终交付物。
- 文件名必须明确带 `preview`，例如 `brand-slides-preview.html` 或 `preview-<slug>.html`。
- 用户选定视觉方向后，必须删除这个临时 preview HTML。
- 删除 preview 后再创建完整 presentation。不要把 preview 文件留在项目里。

必须暂停等待用户选择 A / B / C，或让用户说明“把 A 的结构和 C 的色彩结合”。用户确认前，不生成完整 presentation。

### 4. Create Full Presentation

用户选定视觉预览后，创建完整自包含 `.html` 文件。

默认输出位置：

- 在当前项目根目录下新建一个目录存放最终产物。
- 目录名使用 deck 主题的 slug，例如 `ai-product-pitch-deck/`、`roadmap-presentation/`；不确定主题时使用 `brand-slides-output/`。
- 最终 HTML 默认写入该目录的 `index.html`。
- 如果同名目录已存在，不要覆盖用户文件；改用带序号的目录名，例如 `<slug>-2/`。
- 除非用户明确指定路径，不要把最终 HTML 写到 `brand-slides/` skill 目录内。

生成要求：

- 从零写 HTML/CSS/JS，不从模板文件复制结构或视觉样式。
- CSS 写在 `<style>` 内，JS 写在 `<script>` 内。
- 每页是一个独立 slide，保持演示稿信息密度，每页只表达一个核心观点。
- 品牌 token 写入 `:root` 的 `--slide-*` CSS variables，映射规则见 `tokens/DESIGN-TO-SLIDE.md`。
- 可参考 `layouts/SLIDE-LAYOUTS.md`、`formats/PRESENTATION-FORMATS.md`、`transitions/TRANSITIONS.md` 做内部生成决策，但不要把这些作为用户逐项配置。
- 至少使用 3 种不同页面构图，避免所有页面都是同一种 hero/card/grid。
- 交互至少支持键盘翻页；可按风格需要加入 dots、touch swipe 或 scroll snap。
- 内容来自用户材料或根据主题合理组织，不来自品牌官网文案。

推荐内部结构：

```text
Slide 1: cover
Slide 2: context / problem / thesis
Slide 3: insight / opportunity
Slide 4: solution / product / framework
Slide 5: proof / metrics / comparison
Slide 6: roadmap / next step / closing
```

可按内容调整，不要机械套用。

### 5. Open In Browser

生成最终 HTML 后必须打开浏览器。

执行要求：

1. 本地命令可用时执行 `open <project-root>/<output-dir>/index.html` 或等价方式。
2. 如果无法直接打开，必须给出可点击/可复制的本地 HTML 路径。
3. 告诉用户可以用方向键、空格或页面内控件浏览。

## Brand Token Resolution

品牌风格仍复用 `brand-design-tokens`，但品牌选择服务于 3 个视觉预览，不再是模板选择，也不是抽象情绪选择。

### 路径 1 · 用户点名品牌

1. 读取 `../brand-design-tokens/brands.json`。
2. 按 `id` 或 `name` 匹配品牌。
3. 不在库中 → 明确告知不在库，不猜近似品牌；请用户改选、浏览或让你推荐。
4. 命中后全文读取 `design_md` 指向的 `DESIGN.md`。

### 路径 2 · 用户想先预览再选

1. 必须把 `../brand-design-tokens/index.html` 直接提供给用户。
2. 环境允许时直接帮用户打开：`open ../brand-design-tokens/index.html`。
3. 告诉用户预览页只用于人工挑选风格，生成时仍只读取对应 `DESIGN.md`。
4. 打开或提供链接后暂停，等待用户选定品牌。不要替用户默认选择。

### 路径 3 · 用户描述场景或气质

1. 读取 `brands.json`。
2. 按 `scenarios`、`vibe`、`theme` 三个维度筛选。
3. 推荐 2-3 个品牌，并附上 `blurb` 与推荐理由。
4. 用户确认品牌后，读取对应 `DESIGN.md`。

## Visual Preview Rules

3 个预览必须真的不同，不能只是换名字。

每个预览至少在这些维度中改变 3 项：

- 品牌 token 或品牌气质
- 背景处理：flat / gradient / stage / paper / grid / terminal / editorial
- 排版节奏：hero-led / editorial / dense report / keynote / technical
- 构图语言：split / centered / card system / timeline / dashboard / magazine
- 动效方向：calm / sharp / cinematic / no-frills

如果用户已经指定品牌，3 个预览应使用同一个品牌 token，但改变 presentation style。不要换品牌。

如果用户没有指定品牌，3 个预览可以推荐 3 个不同品牌方向，但必须说明为什么。

## Slide Types

使用这些内容槽位组织 slides，不要把它们当固定视觉模板：

| type | 内容槽位 |
|------|----------|
| `cover` | eyebrow, title, subtitle, footer |
| `section` | label, title, short statement |
| `problem` | title, 3 pain points |
| `insight` | title, supporting quote or contrast |
| `solution` | title, subtitle, 3 solution pillars |
| `feature-grid` | title, 3-4 feature cards |
| `process` | title, 3-5 steps |
| `comparison` | title, before/after or old/new |
| `metrics` | title, 3 key numbers |
| `roadmap` | title, 3-5 milestones |
| `quote` | quote, attribution |
| `closing` | title, CTA, contact or next step |

## Verification

生成后必须人工检查：

- 最终 HTML 浏览器可直接打开。
- 键盘翻页可用，至少支持 `ArrowRight`、空格、`ArrowLeft`。
- 当前页进度正确，或滚动模式下页面吸附清楚。
- 页面没有明显溢出、遮挡或不可读的小字。
- 视觉方向与用户选定的 Preview A / B / C 一致。
- 品牌颜色、字体、圆角、边框来自对应 `DESIGN.md`。
- 不是模板风格，不是所有页同一布局。
- 内容是用户资料提炼或合理 deck structure，不是品牌官网文案。

## Common Mistakes

- 从模板开始改。不要，本 skill 没有模板步骤。
- 还没问 content / design 就生成。必须先确认内容和设计风格。
- 跳过 3 个视觉预览。必须先让用户比较并选择。
- 用户选完视觉预览后还保留临时 preview HTML。必须删除临时预览文件。
- 把最终 HTML 写进 `brand-slides/` skill 目录。默认应在项目根目录新建输出目录。
- 把 frame、navigation、transition、layout strategy 当成逐项表单让用户确认。不要，这些是内部设计决策。
- 读取 `examples/*.html` 抄页面。不要读取 examples 作为生成依据。
- 生成网页而不是 slides。输出必须是演示稿体验。
- 所有 slides 都用同一种 card grid 或同一种 centered hero。必须随内容变化构图。
- 复制真实品牌 logo、官网标题或营销文案。只能使用 token 和视觉气质。
- 在 `brand-slides` 内复制 71 个品牌 token。品牌数据只来自同级 `brand-design-tokens`。
