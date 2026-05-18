# Frontend Slides Visual Directions

本文件把 `zarazhangrui/frontend-slides` 的 style preset 思路迁移为 `brand-slides` 的视觉方向参考。来源项目为 MIT License；这里保留方向名称和结构语言，但不复制其颜色/字体作为最终样式。

重要边界：

- 品牌颜色、字体、圆角仍然来自 `brand-design-tokens/design-md/<brand>/DESIGN.md`。
- 本文件只用于生成 3 个视觉 style previews 时寻找差异化方向。
- 不使用真实 logo、插图或品牌资产。
- 如果 preset 的原始颜色/字体与 DESIGN.md 冲突，以 DESIGN.md 为准。

## Preview Rule

不要把这些方向作为逐项表单让用户选择。`brand-slides` 必须先根据内容和用户选定的 design 生成 3 个视觉预览，再让用户从预览中选择或混合。

生成 3 个预览时必须：

1. 选择 3 个明显不同的视觉方向。
2. 为每个方向说明 design direction、layout language、适合原因和取舍。
3. 允许用户用自然语言调整，例如“把 A 的冲击力和 C 的冷静结合”。
4. 用户选定前不要创建完整 presentation。

## Preset Catalog

| Preset | Source group | Vibe | Layout language | Good for |
|--------|--------------|------|-----------------|----------|
| `bold-signal` | Dark Themes | confident, bold, high-impact | dark stage + bold card + large section number | pitch deck, launch, strong claim |
| `electric-studio` | Dark Themes | bold, clean, professional | split panel + edge accent + quote hero | product intro, keynote |
| `creative-voltage` | Dark Themes | energetic, retro-modern | split panels + neon badges + halftone/grid cue | creative proposal, campaign |
| `dark-botanical` | Dark Themes | elegant, premium, artistic | centered content + soft abstract shapes + thin accents | luxury, editorial, brand story |
| `notebook-tabs` | Light Themes | editorial, organized, tactile | paper card + side tabs + notebook details | lesson, workshop, structured report |
| `pastel-geometry` | Light Themes | friendly, approachable | rounded card + vertical pills + soft geometry | product intro, education, friendly SaaS |
| `split-pastel` | Light Themes | playful, modern | two-color split + badges + grid overlay | community, consumer product, creative deck |
| `vintage-editorial` | Light Themes | witty, confident, editorial | centered cream canvas + geometric accents + bordered CTA | thought leadership, narrative deck |
| `neon-cyber` | Specialty Themes | futuristic, techy | particle/grid background + neon glow + mono accents | AI, developer, cyber / infra pitch |
| `terminal-green` | Specialty Themes | developer, hacker | terminal surface + scan lines + code blocks | devtools, infra, technical lesson |
| `swiss-modern` | Specialty Themes | clean, precise, Bauhaus | visible grid + asymmetric layout + geometric marks | corporate, architecture, system design |
| `paper-ink` | Specialty Themes | literary, thoughtful | paper texture + drop caps + pull quotes + rules | essay, research, narrative report |

## Preview Recommendation Hints

Only use these hints to generate the 3 visual previews, not to auto-select silently.

| Deck / vibe | Recommended presets to offer |
|-------------|------------------------------|
| pitch, launch, fundraising | `bold-signal`, `electric-studio`, `neon-cyber` |
| product intro, SaaS, feature story | `electric-studio`, `pastel-geometry`, `split-pastel` |
| roadmap, process, technical plan | `swiss-modern`, `terminal-green`, `electric-studio` |
| report, data, executive summary | `swiss-modern`, `notebook-tabs`, `bold-signal` |
| lesson, workshop, course | `notebook-tabs`, `paper-ink`, `terminal-green` |
| editorial, brand story, thought leadership | `vintage-editorial`, `paper-ink`, `dark-botanical` |
| AI / developer / infrastructure | `neon-cyber`, `terminal-green`, `swiss-modern` |

## Runtime Contract

Use these `data-preset` values:

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

Preset effects should stay lightweight: CSS gradients, geometric pseudo-elements, borders, grids, tabs, scan lines, paper texture, and accent bars. Do not add heavy canvas effects in v1.

## Attribution

Preset names and source inspiration come from `zarazhangrui/frontend-slides` (`STYLE_PRESETS.md`, MIT License, Copyright 2025 Zara Zhang). `brand-slides` adapts them as structural preset choices while keeping visual tokens brand-driven.
