# Brand Tokens Bridge

DESIGN.md token → frontend-slides `:root` CSS 变量映射规则。
在 Phase 3 生成 HTML 时，用这些规则把品牌 token 覆盖 preset 的默认色值。

## 前提

先选定一个 preset（提供布局 / 动画 / 签名元素），再用品牌 token 替换颜色和字体。
**不替换** preset 的布局结构、几何装饰、动画时序。

---

## Color Mapping

从 DESIGN.md frontmatter 的 `colors:` 块提取：

| frontend-slides 变量 | DESIGN.md 优先级 |
|---|---|
| `--bg-primary` / `--bg-dark` | `colors.canvas` |
| `--bg-secondary` / `--bg-soft` | `colors.surface-1` → `colors.surface-soft` → `colors.canvas` |
| `--text-primary` / `--text-light` | `colors.ink` → `colors.foreground` |
| `--text-secondary` / `--text-muted` | `colors.ink-mute` → `colors.ink-muted` → `colors.muted` |
| `--accent` / `--accent-primary` / `--card-bg` | `colors.primary` → `colors.accent` → `colors.brand` |
| `--text-on-accent` / `--text-on-card` | `colors.on-primary` → `colors.on-brand` → 根据亮度自动选 `#fff` 或 `#111` |
| `--border` / `--divider` | `colors.hairline` → `colors.hairline-soft` → `colors.border` |

### 亮/暗判断

`colors.canvas` 亮度 < 0.35 → dark theme：文字用浅色 ink。
`colors.canvas` 亮度 ≥ 0.35 → light theme：文字用深色 ink。

如果 preset 是深色系但 DESIGN.md 是亮色品牌（或反之），**优先遵循 DESIGN.md**，但告知用户颜色主题已切换。

---

## Typography Mapping

从 DESIGN.md frontmatter 的 `typography:` 块提取：

| frontend-slides 变量 | DESIGN.md 优先级 |
|---|---|
| `--font-display` / display 字体 | `typography.display-xxl.fontFamily` → `display-xl` → `display-lg` → `display-md` → `headline` |
| `--font-body` / body 字体 | `typography.body-md.fontFamily` → `body.fontFamily` → `body-lg` |
| `--font-mono` / code 字体 | DESIGN.md 中的 mono/code 字体 → 降级为 `"SFMono-Regular", Consolas, monospace` |

字体规则：
- 保留 DESIGN.md 的 font stack（含 fallback）。
- 专有字体（如 GT Walsheim、Söhne）保留名称，加 Google Fonts 近似替代 + 系统兜底。
- **不要替换为 Inter / Arial / system-ui**，除非 DESIGN.md 本身指定。

---

## Radius Mapping

| frontend-slides 变量 | DESIGN.md 优先级 |
|---|---|
| `--radius` / `--radius-card` | `rounded.md` → `rounded.lg` → `radius.md` → `8px` |
| `--radius-sm` / `--radius-btn` | `rounded.sm` → `rounded.xs` → `radius.sm` → `4px` |
| `--radius-full` | `rounded.full` → `rounded.pill` → `9999px` |

---

## 输出格式

在 `:root` 里先写品牌 token，再保留 preset 的布局/动画变量：

```css
:root {
  /* === Brand Tokens (from DESIGN.md) === */
  --bg-primary:   #0f0f11;    /* colors.canvas */
  --bg-secondary: #1a1a1e;    /* colors.surface-1 */
  --text-primary: #f0f0f5;    /* colors.ink */
  --text-muted:   rgba(255,255,255,0.45);  /* colors.ink-mute */
  --accent:       #7c3aed;    /* colors.primary */
  --text-on-accent: #ffffff;  /* colors.on-primary */
  --border:       rgba(255,255,255,0.1);   /* colors.hairline */
  --font-display: "GT Walsheim", "Space Grotesk", sans-serif;
  --font-body:    "GT Walsheim", system-ui, sans-serif;
  --radius:       12px;       /* rounded.md */

  /* === Preset Layout Variables (keep from chosen preset) === */
  /* ... preset-specific animation, spacing, gradient variables ... */
}
```

---

## 缺字段时的降级

| 缺失字段 | 降级策略 |
|---|---|
| `colors.primary` | 用 preset 默认 accent 色，告知用户 |
| `typography.display` | 用 preset 字体 |
| `rounded` 全部缺失 | 用 preset radius |
| DESIGN.md 完全无法读取 | 回退到 preset 默认值，告知用户 |
