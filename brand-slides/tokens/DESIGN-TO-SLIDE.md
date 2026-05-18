# DESIGN.md → Slide CSS Variables

本文件定义 `brand-slides` 如何把 `brand-design-tokens/design-md/<brand>/DESIGN.md` 裁剪成 HTML slides 使用的最小 CSS 变量。目标是保留品牌气质，同时避免把网页 token 原样搬进 16:9 幻灯片。

## Source

读取对应品牌 `DESIGN.md` 的 YAML frontmatter：

```yaml
colors:
  canvas: "#ffffff"
  ink: "#0d253d"
  primary: "#533afd"
typography:
  display-xl:
    fontFamily: ...
  body-md:
    fontFamily: ...
rounded:
  md: ...
```

如果字段缺失，按本文的优先级降级。不要凭品牌印象编造不存在的 token。

## Output Contract

生成的 slide token 必须写成 `:root` CSS variables：

```css
:root {
  --slide-bg: #ffffff;
  --slide-surface: #f6f9fc;
  --slide-text-color: #0d253d;
  --slide-heading-color: #0d253d;
  --slide-muted-color: #64748d;
  --slide-accent: #533afd;
  --slide-accent-soft: #665efd;
  --slide-accent-text: #ffffff;
  --slide-border: #e3e8ee;
  --slide-font-display: "SF Pro Display", system-ui, sans-serif;
  --slide-font-body: system-ui, sans-serif;
  --slide-font-mono: "Space Mono", "SFMono-Regular", monospace;
  --slide-radius: 16px;
  --slide-radius-sm: 10px;
}
```

## Color Mapping

| Slide variable | DESIGN.md priority |
|----------------|--------------------|
| `--slide-bg` | `colors.canvas` |
| `--slide-surface` | `colors.surface-1` → `colors.surface-card` → `colors.surface-soft` → `colors.canvas-soft` → `colors.canvas` |
| `--slide-text-color` | `colors.ink` → `colors.body` → `colors.inverse-ink` |
| `--slide-heading-color` | `colors.ink` → `colors.body-strong` → `--slide-text-color` |
| `--slide-muted-color` | `colors.ink-mute` → `colors.ink-muted` → `colors.ink-subtle` → `colors.muted` → `colors.muted-soft` |
| `--slide-accent` | `colors.primary` |
| `--slide-accent-soft` | `colors.primary-soft` → `colors.primary-bg-subdued` → `colors.surface-soft` → `colors.canvas-soft` |
| `--slide-accent-text` | `colors.on-primary` → `#ffffff` |
| `--slide-border` | `colors.hairline` → `colors.hairline-soft` → `colors.hairline-strong` |

### Dark / Light Rule

判断 `colors.canvas` 的相对亮度：

- 深色画布：接近 `#000000` 到 `#333333`，或描述中明确 dark / near-black / dark-app shell。
- 亮色画布：接近白色、米白、浅灰、cream，或 `theme` 为 light。

深色主题应优先使用浅色 `ink`，亮色主题应优先使用深色 `ink`。如果 DESIGN.md 已经定义了 `inverse-*`，只有在当前画布需要反相时才使用。

## Typography Mapping

| Slide variable | DESIGN.md priority |
|----------------|--------------------|
| `--slide-font-display` | `typography.display-xxl.fontFamily` → `display-xl` → `display-lg` → `display-md` → `headline` → `title-lg` |
| `--slide-font-body` | `typography.body-md.fontFamily` → `body.fontFamily` → `body-lg` → `body-sm` → `typography.display-md.fontFamily` |
| `--slide-font-mono` | DESIGN.md 中的 mono/code 字体 → `"Space Mono", "SFMono-Regular", Consolas, monospace` |

字体规则：

- 保留 DESIGN.md 的 font stack。
- 付费或专有字体必须保留后续 fallback，例如 `system-ui`、`-apple-system`、`sans-serif`、`serif`。
- 不要因为 slides 而强行替换成 Inter/Arial，除非 DESIGN.md 本身如此指定。

## Radius Mapping

| Slide variable | DESIGN.md priority |
|----------------|--------------------|
| `--slide-radius` | `rounded.md` → `rounded.lg` → `radius.md` → `16px` |
| `--slide-radius-sm` | `rounded.sm` → `rounded.xs` → `radius.sm` → `10px` |

## Spacing Guidance

不要把网页 spacing 原样复制到 slides。Slides 默认使用 viewport 相关间距：

```css
--slide-pad-x: clamp(48px, 6vw, 92px);
--slide-pad-y: clamp(36px, 5vw, 72px);
--slide-gap: clamp(18px, 2.4vw, 34px);
```

如果 DESIGN.md 有强烈的紧凑 / 留白描述，可以小幅调整，但必须保持单页内容可读。

## Cropping Principles

1. 只裁剪 slides 需要的 10-14 个关键 token。
2. 优先保证对比度和演示可读性。
3. 保留品牌的核心色、字体声音、圆角和边框哲学。
4. 不引入 logo、真实品牌资产或官网布局。
5. 不从 `examples/*.html` 反向抽 token。
