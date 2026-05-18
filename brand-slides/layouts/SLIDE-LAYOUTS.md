# Slide Layout Choices

这些 layout 借鉴 `frontend-slides` 的 preset 结构语言，但只保留轻量 HTML slides 需要的版式骨架。品牌颜色、字体、圆角仍然来自 `DESIGN.md` 裁剪后的 `--slide-*` 变量。

## Selection Rule

每一页必须选择一个 layout：

```text
Slide N
type: cover | problem | feature-grid | metrics | roadmap | quote | closing
layout: cover-centered | cover-split | title-bullets | feature-grid-3 | metric-strip | timeline | quote-focus | closing-cta
```

如果用户未指定 layout，由 slide type 和选定视觉预览自动匹配。不要让整套 deck 每页都用同一种 layout。

不要把 layout strategy 作为逐项问题询问用户。用户可以在 design 选择或预览反馈里自然描述偏好，例如“多用左右分屏”“多放数据卡片”“像杂志排版”“不要太多卡片”。

## Layout Catalog

| Layout | Inspired by frontend-slides pattern | Best for | Structure |
|--------|-------------------------------------|----------|-----------|
| `cover-centered` | centered dark / editorial cover | 标题页、章节页 | eyebrow + large title + subtitle 居中或左中 |
| `cover-split` | split panel presets | 标题页、产品介绍 | 左侧文字，右侧 visual/card/abstract panel |
| `title-bullets` | clean corporate slide | 问题、洞察、说明 | title + subtitle + 3-5 bullets |
| `feature-grid-3` | card grid preset | 功能、卖点、方案柱 | title + 3 cards |
| `metric-strip` | dashboard / report slide | 数据、成果、牵引力 | title + 3-4 metrics 横向排列 |
| `timeline` | roadmap / process slide | 路线图、流程 | title + 3-5 milestones |
| `quote-focus` | editorial / magazine slide | 用户声音、观点 | quote 大字 + attribution |
| `comparison-split` | before/after split | 竞品、现状 vs 方案 | 两栏对比 |
| `closing-cta` | CTA / final slide | 结尾、下一步 | large title + CTA + contact/next step |

## Auto Mapping

| Slide type | Default layout | Alternative layouts |
|------------|----------------|---------------------|
| `cover` | `cover-centered` | `cover-split` |
| `section` | `cover-centered` | `quote-focus` |
| `problem` | `title-bullets` | `comparison-split` |
| `insight` | `quote-focus` | `title-bullets` |
| `solution` | `feature-grid-3` | `cover-split` |
| `feature-grid` | `feature-grid-3` | `comparison-split` |
| `process` | `timeline` | `title-bullets` |
| `comparison` | `comparison-split` | `feature-grid-3` |
| `metrics` | `metric-strip` | `feature-grid-3` |
| `roadmap` | `timeline` | `metric-strip` |
| `quote` | `quote-focus` | `cover-centered` |
| `closing` | `closing-cta` | `cover-centered` |

## HTML Class Contract

Use one layout class on each slide:

```html
<section class="slide layout-cover-split" data-slide="1">
  <div class="slide-content">
    ...
  </div>
</section>
```

Required class names:

```text
layout-cover-centered
layout-cover-split
layout-title-bullets
layout-feature-grid-3
layout-metric-strip
layout-timeline
layout-quote-focus
layout-comparison-split
layout-closing-cta
```

## Design Notes

- `cover-split` and `comparison-split` should use strong asymmetry, not a generic centered hero.
- `metric-strip` should keep numbers large and labels short.
- `timeline` should prefer 3-5 milestones; more than 5 becomes unreadable.
- `feature-grid-3` should use 3 cards by default; 4 cards only when content is very short.
- `quote-focus` should use generous whitespace and a single strong quote.
- Decorative shapes must be abstract CSS shapes only; no logo, mascot, illustration, or copied brand assets.
