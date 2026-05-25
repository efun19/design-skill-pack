# 新增品牌 — 完整流程

```
1. 写 DESIGN.md          → brand-design-tokens/design-md/<brand>/DESIGN.md
2. 加 brands.json 条目   → brand-design-tokens/brands.json
3. 写预览页              → docs/examples/<brand>.html
4. 接入 index.html       → docs/index.html
```

**`<brand>`** = 目录名，用 kebab-case（如 `supabase`、`mistral-ai`）。

⚠️ 不要用脚本批量生成预览页。每个页面必须读完该品牌的 DESIGN.md 再手写。一次只加一个品牌，串行操作。

---

## 步骤 1：写 DESIGN.md

创建 `brand-design-tokens/design-md/<brand>/DESIGN.md`，frontmatter 格式：

```yaml
---
version: alpha
name: <品牌名>-design-analysis
description: >
  英文描述：画布色调、字体选择、强调色哲学、视觉气质、适合什么产品。

colors:
  primary: "#..."          # CTA / 主强调色
  primary-active: "#..."
  primary-disabled: "#..."
  ink: "#..."              # 主文字色
  body: "#..."
  body-strong: "#..."
  muted: "#..."
  muted-soft: "#..."
  hairline: "#..."
  hairline-soft: "#..."
  canvas: "#..."           # 页面背景（决定亮/暗主题）
  surface-soft: "#..."
  surface-card: "#..."
  on-primary: "#..."       # 主色上的文字（通常 #fff 或 #000）
  success: "#..."
  warning: "#..."
  error: "#..."

typography:
  display-xl:
    fontFamily: "字体名, fallback, serif"
    fontSize: 64px
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: -1.5px
  body-md:
    fontFamily: "字体名, fallback, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
---
```

**最低要求：** `colors.canvas`、`colors.primary`、`colors.ink`、任意 display 字阶、任意 body 字阶、`rounded.md`。

**判断主题：** `canvas` 浅色（白/奶油/浅灰）→ `light`；深色（近黑）→ `dark`。

---

## 步骤 2：加 brands.json 条目

在 `brand-design-tokens/brands.json` 数组中新增：

```json
{
  "id": "<brand>",
  "name": "<品牌显示名>",
  "theme": "light",
  "scenarios": ["landing", "saas"],
  "description": "中文一句话：画布色调、字体、强调色，适合什么用途，想传递什么感觉。",
  "design_md": "design-md/<brand>/DESIGN.md"
}
```

`scenarios` 常用值：`ai` `landing` `marketing` `saas` `dashboard` `developer` `docs` `blog` `portfolio` `enterprise` `media` `ecommerce`

---

## 步骤 3：写预览页

写 `docs/examples/<brand>.html`，自包含单文件（内联 `<style>` `<script>`）。

1. 重读 DESIGN.md，抽取 `colors` / `typography` / `rounded`。
2. 读 `CONTENT-SPEC.md`——所有文案和结构的**唯一来源**，12 区块 A–L，逐字照搬，**英文不动**。
3. 确认起始主题：`canvas` 浅色 → `data-theme="light"`；深色 → `data-theme="dark"`。
4. CSS token 全取自 DESIGN.md，先定义 CSS 变量再用 `var(...)` 引用，无内联 `style="..."`。
5. 亮/暗双主题都按 DESIGN.md 还原，不是机械反色。暗色覆盖用 `[data-theme="dark"]`。
6. 专有字体用最接近的 Google Fonts + 系统兜底。
7. 还原品牌专属性格：按钮形状、边框粗细、阴影哲学、装饰元素。
8. 末尾加 `@media (max-width: 860px)` 响应式回退。

参考：`examples/claude.html`（亮·衬线）/ `examples/stripe.html`（亮·细体）/ `examples/linear.html`（暗·几何）。

---

## 步骤 4：接入 index.html

**1. 新增卡片**（在最贴近的分类 `.grid` 里）：

```html
<a class="tile" href="examples/<brand>.html">
  <div class="swatch s-<brand>"><span>主题 · 强调色</span></div>
  <div class="tile-body">
    <h3>品牌名</h3>
    <p>一句话概括核心设计特征。</p>
    <span class="go">查看预览 →</span>
  </div>
</a>
```

**2. 新增色板 CSS**（`<style>` 里「各品牌色板」段）：

```css
.s-<brand> { background: <canvas色> }
.s-<brand> span { background: <primary色>; color: <对比色> }
```

亮色品牌（canvas 接近白色）加：`border-bottom: 1px solid var(--hairline)`

**3. 分类计数 +1**：更新该分类 `.cat-head` 的 `<span class="count">N 个</span>`

**4. 总数 +1**：更新顶部 `.intro` 的 `<h1>`、段落和 `<title>` 里的数字

---

## 自检

- [ ] 浏览器打开无报错，主题切换亮 ↔ 暗正常
- [ ] 包含 5 个共享文案串：`Create your workspace`、`Recent releases`、`Jordan Lee`、`Continue with SSO`、`Workspace URL`
- [ ] 12 区块标记 `<!-- A.` 到 `<!-- L.` 齐全
- [ ] `<div>` 开闭数量相等
- [ ] `index.html` 卡片链接正确，计数和总数已 +1
- [ ] 色板背景色与 DESIGN.md `canvas` 一致，小标签用 `primary` 色
- [ ] 搜索栏输入品牌名能命中新卡片

---

## 常见陷阱

**统计数据条出现灰色缝隙** — 用 `gap:1px` + `background:var(--hairline)` 做列分割时，奶油画布配灰发丝线会出现突兀的灰条。改用子项 `border-right` 替代：

```css
.stats { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--hairline) }
.stat  { background: var(--surface-soft); border-right: 1px solid var(--hairline) }
.stat:last-child { border-right: none }
```

**主题切换子元素闪烁** — 引用 CSS 变量的子元素没有 transition。对 `background` / `border-color` / `color` 引用变量的元素补：

```css
.stat { transition: background .2s, border-color .2s }
```

---

## 从上游同步新品牌

上游仓库：[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

### 第一步：找出新增品牌

```bash
# 克隆上游到临时目录
git clone https://github.com/VoltAgent/awesome-design-md /tmp/awesome-design-md

# 对比上游与本地，列出本地缺失的品牌目录
diff <(ls /tmp/awesome-design-md/design-md/ | sort) \
     <(ls brand-design-tokens/design-md/ | sort) \
  | grep "^<" | sed 's/^< //'
```

输出即为待新增的品牌列表。

### 第二步：格式兼容性检查

复制前，抽查上游 DESIGN.md，确认关键字段存在：

- `colors.canvas` / `colors.primary` / `colors.ink`
- `typography`（至少一个 display 字阶、一个 body 字阶）
- `rounded.md`

字段名与本项目不一致时，**在复制后手动对齐**，不要照搬原始键名。

### 第三步：复制 DESIGN.md

每次只处理一个品牌：

```bash
cp -r /tmp/awesome-design-md/design-md/<brand> brand-design-tokens/design-md/<brand>
```

### 第四步：接入本项目

对每个新品牌，依次执行本文的**步骤 2–4**（brands.json → docs/examples/ → docs/index.html）。

⚠️ 串行操作，一次处理一个品牌，完成自检后再开始下一个。
