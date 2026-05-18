# Presentation Format Choices

本文件定义 `brand-slides` 创建完整 presentation 时的内部格式参考。它参考 `frontend-slides` 的生成阶段：确定 viewport / HTML structure / animation / navigation，再生成最终单文件 HTML。

## Internal Format Contract

生成 HTML 前必须由 AI 内部确定四类配置：

```text
frame: fit-16x9 | full-bleed | stage-card | scroll-snap
navigation: keyboard-dots-touch | keyboard-only | dots-only | scroll
transition: fade-up | scale-in | slide-left | blur-in | cut
layout: per-slide layout from layouts/SLIDE-LAYOUTS.md
```

写入 HTML：

```html
<main class="deck" data-frame="fit-16x9" data-navigation="keyboard-dots-touch" data-transition="fade-up">
```

不要把这些配置逐项询问用户。用户只需要确认内容、design 和 3 个视觉预览中的方向；frame / navigation / transition / layout 是最终生成时服务于所选风格的内部决策。

## Frame Choices

| Frame | Behavior | Use when |
|-------|----------|----------|
| `fit-16x9` | 默认。每页保持 16:9，自动适配 viewport，可能出现留白 | 标准 PPT、pitch deck、报告 |
| `full-bleed` | 每页铺满整个 viewport，不显示外框 | 发布会感、沉浸封面、强视觉品牌 |
| `stage-card` | 16:9 slide 作为卡片浮在背景上 | 高级感、编辑感、需要留出环境氛围 |
| `scroll-snap` | 类 frontend-slides 的纵向 scroll snap，一页一屏 | 长讲义、课程、适合滚动浏览的 deck |

默认使用 `fit-16x9`。如果用户说“像网页一样滚动播放”或“scroll snap”，使用 `scroll-snap`。如果用户说“沉浸式、全屏、发布会”，使用 `full-bleed`。如果用户说“卡片、画布、舞台感”，使用 `stage-card`。

## Navigation Choices

| Navigation | Controls | Use when |
|------------|----------|----------|
| `keyboard-dots-touch` | 键盘、底部 dots、触摸滑动 | 默认；桌面和移动都可用 |
| `keyboard-only` | 只保留键盘翻页和进度 | 正式演示，减少视觉干扰 |
| `dots-only` | dots 点击跳转 + 进度 | 展示页嵌入、鼠标操作优先 |
| `scroll` | 浏览器滚动 + scroll snap | `scroll-snap` frame 专用 |

不要在 v1 中加入 URL hash、router、自动播放或复杂 presenter mode。

## Auto Defaults

| Deck type | Default frame | Default navigation |
|-----------|---------------|--------------------|
| `pitch-deck` | `fit-16x9` | `keyboard-dots-touch` |
| `product-intro` | `fit-16x9` | `keyboard-dots-touch` |
| `roadmap` | `fit-16x9` | `keyboard-dots-touch` |
| `report` | `stage-card` | `keyboard-only` |
| `lesson` | `scroll-snap` | `scroll` |

## Verification

检查所选配置是否生效：

- `fit-16x9`: slide 保持 16:9 且无滚动。
- `full-bleed`: slide 铺满 viewport，无外框感。
- `stage-card`: slide 居中成卡片，背景可见。
- `scroll-snap`: 可以纵向滚动，一次吸附一页。
- `keyboard-dots-touch`: 键盘、dots、touch 均可用。
- `keyboard-only`: dots 不显示，键盘可用。
- `dots-only`: dots 可用，键盘不作为主要交互要求。
- `scroll`: 使用浏览器滚动，不依赖 JS active 切页。
