# Transition Choices

这些 transition 借鉴 `frontend-slides/animation-patterns.md`，但只保留适合单文件 HTML deck 的轻量效果。transition 是最终生成时的内部设计决策，不是用户逐项配置。

## Deck-Level Choice

在 `.deck` 上设置：

```html
<main class="deck" data-transition="fade-up">
```

可选值：

| Transition | Motion direction | Use when |
|------------|---------|----------|
| `fade-up` | versatile, polished | 默认；适合大多数品牌 |
| `scale-in` | cinematic, premium | 高端、发布会、封面页强视觉 |
| `slide-left` | directional, product | roadmap、流程、产品演示 |
| `blur-in` | editorial, calm | 杂志感、思考型内容、柔和品牌 |
| `cut` | fast, precise | 企业汇报、数据报告、节奏快的 deck |

不要单独询问 transition。用户可以在 design 选择或 preview feedback 中描述效果，例如“更快一点”“更有发布会感”“不要动画”“柔和一点”，然后由 AI 映射到合适的 transition。

## Brand / Vibe Mapping

| Brand vibe | Suggested transition |
|------------|----------------------|
| 克制、企业、专业、数据 | `cut` 或 `fade-up` |
| 编辑感、杂志、温暖、calm | `blur-in` 或 `fade-up` |
| 科技、工程、developer、futuristic | `slide-left` 或 `fade-up` |
| 高端、cinematic、premium | `scale-in` |
| 活泼、创意、多彩 | `scale-in` 或 `slide-left` |

## Page-Level Override

如需单页覆盖，在 slide 上设置：

```html
<section class="slide layout-cover-centered" data-transition="scale-in">
```

页级 `data-transition` 优先于 deck 级选择。仅在封面、章节页、closing 这类关键页使用覆盖，不要每页乱换。

## Reveal Children

内容元素可以加 `.reveal`，当前页 active 后做 staggered reveal：

```html
<h1 class="reveal">Title</h1>
<p class="reveal">Subtitle</p>
```

规则：

- 标题、subtitle、cards、metrics 可以使用 `.reveal`。
- 不要给每个小字都加动画。
- 动画只使用 opacity / transform / filter，避免 expensive layout animation。
- 移动端或短 viewport 下可以保留效果，但不要依赖 hover。

## Navigation Modes

Minimal runtime supports:

- Keyboard: `ArrowRight`, `Space`, `PageDown`, `ArrowLeft`, `PageUp`
- Navigation dots: click any dot to jump
- Touch swipe: horizontal swipe left/right
- Progress text: `current/total`

Do not add heavy routing or URL state in v1.
