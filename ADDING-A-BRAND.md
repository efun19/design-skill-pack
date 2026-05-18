# 新增品牌预览页 — 给 AI 工具的操作文档

本文档让任意 AI 工具给 `preview/examples/` 新增一个品牌 HTML 页,并接入 `preview/index.html`。

`preview/index.html` 当前已列 71 个品牌、9 个分类,全部完成。新增品牌 = 写一个新
`examples/<BRAND>.html` + 在 index 里新增一张卡片 + 加一条 `.s-<BRAND>` 色板。

---

## ⚠️ 硬性要求

1. **不要用 Python / Node / 任何脚本批量生成 HTML。** 每个页面必须人(AI)亲自
   读完该品牌的 `DESIGN.md` 再手写。脚本套模板会丢掉品牌的设计灵魂 —— 按钮形状、
   字重、圆角、阴影哲学、装饰元素,这些只有读了 DESIGN.md 才能正确还原。
2. **一次只补一个品牌,串行做。** 多个 AI 并行改同一个 `index.html` 会冲突。
3. **逐个品牌:读 DESIGN.md → 写 HTML → 接入 index → 自检。** 不许跳步。

---

## 流程(每个品牌重复一遍)

### 1. 读设计规范

打开 `brand-design-tokens/design-md/<BRAND>/DESIGN.md`,抽取 YAML frontmatter:
`colors:` / `typography:` / `rounded:` / `spacing:` / `components:`(若有)。

`<BRAND>` = `design-md/` 下的目录名(如 `supabase`、`mistral.ai`)。

**关键:确定起始主题(亮色/暗色)**

在读 DESIGN.md 时,**必须立刻判断**该品牌默认起始主题:

| 判断依据 | 起始 `light` | 起始 `dark` |
|---------|-------------|------------|
| `canvas` 颜色 | `#ffffff` / 奶油色 / 浅灰 | `#000000` / 近黑 / 深色 |
| description 描述 | "white canvas" / "clean white" / "cream" | "dark canvas" / "near-black" / "immersive dark" |
| 已完成参考 | Claude、Stripe、Vercel、Notion | Linear、Spotify |

**在动手写 HTML 之前就确定好**,因为 `<html data-theme>` 的初始值取决于此。

### 2. 读共享文案

打开 `CONTENT-SPEC.md` —— 这是**所有页面文案和结构的唯一来源**。
每个新页面文案逐字照搬,12 个区块 A–L、DOM 顺序完全一致。唯一变量是 CSS。

### 3. 写 HTML 页

写 `preview/examples/<BRAND>.html`,自包含单文件(内联 `<style>` `<script>`,
无构建步骤,浏览器直接打开):

- 文案、12 区块、DOM 顺序逐字照搬 CONTENT-SPEC.md,**英文不动**。
- CSS token 全部取自 DESIGN.md 的 colors / typography / rounded / spacing。
  语义色映射到 CSS 变量:`--primary` `--ink` `--body` `--muted` `--muted-soft`
  `--hairline` `--canvas` `--surface-soft` `--surface-card` `--surface-strong`
  `--success` `--warning` `--error` `--code-bg` `--code-fg`。DESIGN.md 缺的语义名,
  从其调色板合理推导。新增品牌特征色也先定义成变量,再在规则里用 `var(...)` 引用。
- 字体:DESIGN.md 的 typography 映射到 `--font-display`(大标题)和 `--font-body`
  (正文)。专有字体(Copernicus、Sohne 等)用最接近的 Google Fonts + 系统兜底链。
- 亮 / 暗双主题都必须按照 DESIGN.md 的设计规范还原,不是只做机械反色。
  亮色直接用 DESIGN.md 的亮色 token / 风格描述;暗色用 `[data-theme="dark"]` 覆盖,
  优先采用 DESIGN.md 里的 `surface-dark*` / `inverse-*` / dark mode token。若 DESIGN.md
  没有暗色 token,再基于其调色板合理推导暗色,但仍要保留品牌冷暖、对比、阴影、
  边框和装饰哲学。
- `<html data-theme>` 初始值:暗色优先的品牌(如 Linear、Spotify)起始 `dark`,
  其余起始 `light`。
- 12 区块自然嵌入页面叙事,**不出现** "Typography / Buttons / Form" 这类陈列标签。
- 不写内联 `style="..."`; spacing / 状态 / 装饰都沉到 `<style>` 里的 class。
- 末尾加 `@media (max-width: 860px)` 响应式回退。
- 还原品牌专属性格:按钮形状(胶囊 vs 圆角矩形)、边框粗细、阴影哲学(重 vs 无)、
  字重(细 / 轻 vs 粗)、装饰元素(渐变、色块、发丝线)。

**动手前先看一个已完成页做参考:**
`examples/claude.html`(亮·衬线)/ `examples/stripe.html`(亮·细体)/
`examples/linear.html`(暗·几何)。

### 4. 接入 index.html

在 `preview/index.html` 里给新品牌新增一张卡片:

1. 选定分类。9 个分类各有一个 `<section class="cat" id="cat-...">`,内部 `<div class="grid">`。
   把新卡片插到该分类 `.grid` 里(挑风格 / 行业最贴近的分类)。
2. 卡片结构照抄同分类已有卡片:
   ```html
   <a class="tile" href="examples/<BRAND>.html">
     <div class="swatch s-<BRAND>"><span>主题 · 强调色</span></div>
     <div class="tile-body"><h3>品牌名</h3>
       <p>一句话概括 DESIGN.md 的核心设计特征。</p>
       <span class="go">查看预览 →</span></div>
   </a>
   ```
   `<h3>` 文本是搜索栏匹配的品牌名,要写准。
3. 在 `<style>` 的「各品牌色板」段加一条 `.s-<BRAND>` 规则:
   ```css
   .s-<BRAND>{background:<canvas>} .s-<BRAND> span{background:<primary>;color:<对比色>}
   ```
   亮色品牌画布若是纯白 / 浅色,补 `border-bottom:1px solid var(--hairline)` 避免和卡片融为一体。
4. 更新该分类 `.cat-head` 的计数 `<span class="count">N 个</span>`,N 加 1。
5. 更新页面顶部 `.intro` 的 `<h1>` 和段落里的总数(当前 71),以及 `<title>`。

**色板和描述必须按以下清单核对:**

| 检查项 | 方法 | 常见错误 |
|-------|------|---------|
| 色板背景色 | 对比 DESIGN.md 的 `canvas` 值和设计风格 | 暗色品牌用了白色色板,或亮色品牌用了黑色色板 |
| 色板小标签颜色 | 应该是品牌的 primary/主强调色 | 用了与品牌无关的颜色 |
| 卡片描述(中文) | 概括 DESIGN.md 的核心设计特征 | 描述与实际风格不符(如把"奶油画布"写成"黑色画布") |
| 色板标签(中文) | 简短概括主题+强调色(如"暖奶油 · 橙") | 写错起始主题(如把亮色品牌标成"暗色") |

**一致性原则:** 色板背景、色板小标签、卡片描述、`examples/<BRAND>.html` 的初始 `data-theme` 必须讲同一个故事。默认亮色页不要配暗色色板,默认暗色页不要配亮色色板。`index.html` 全中文,新增编辑保持中文。

### 5. 自检

- `examples/<BRAND>.html` 浏览器打开无报错
- 主题切换按钮亮 ↔ 暗正常,亮色和暗色都符合 DESIGN.md 的品牌规范,两套都看着是有意设计的
- 含 5 个共享文案串:`Create your workspace`、`Recent releases`、
  `Jordan Lee`、`Continue with SSO`、`Workspace URL`
- 12 个区块标记 `<!-- A.` 到 `<!-- L.` 齐全,与 CONTENT-SPEC 对应
- `<div>` 开闭计数相等(`grep -c '<div' == grep -c '</div>'`)
- `index.html` 新卡片链接路径正确,分类计数和顶部总数已同步 +1
- `index.html` 色板背景 / 小标签 / 卡片描述与页面默认主题、DESIGN.md 核心气质一致
- 搜索栏输入新品牌名能命中新卡片
- 无内联 `style="..."`,`:root` 和 `[data-theme]` 之外无硬编码 hex 色值

### 6. 常见陷阱

#### 统计数据条用 `gap` 导致可见灰色缝隙

**现象:** 统计数据条的三列(`12,000+` / `99.98%` / `4.9 / 5`)之间出现与画布不协调的灰色缝隙。

**原因:** 用 `gap:1px` + 容器 `background:var(--hairline)` 做列分割线,容器背景色通过 gap 区域透出。当 `var(--hairline)` 与 `var(--canvas)` 色相不同时(如奶油画布 `#fffaf0` 配灰发丝线 `#e5e5e5`),gap 区域形成突兀的灰色条。

**修复:** 把 gap 分割改为子项 `border-right`:
```css
/* 错误 */
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hairline)}

/* 正确 */
.stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--hairline)}
.stat{background:var(--surface-soft);border-right:1px solid var(--hairline)}
.stat:last-child{border-right:none}
```

#### 主题切换时使用 CSS 变量的子元素闪烁

**现象:** 切换亮/暗主题时,统计数据条等区块的背景和边框"闪"一下才到位。

**原因:** 只有 `html,body` 设置了 `transition:background .2s,color .2s`,但其他元素(如 `.stat`)的 `background:var(--surface-soft)` 和 `border-color:var(--hairline)` 没有过渡。CSS 变量在 `data-theme` 切换瞬间全局更新,无过渡的元素直接从旧变量值跳到新值。

**修复:** 在引用 CSS 变量的元素上补充 transition:
```css
.stat{transition:background .2s,border-color .2s}
```
涉及 `background` / `border-color` / `color` 等引用 CSS 变量的子元素都要检查。

---

## 可直接粘贴的交接 prompt

把下面整块发给另一个 AI 工具,填入 `<BRAND>` 即可:

```
任务：给 design-skill-pack 新增一个品牌预览页。严格照 ADDING-A-BRAND.md 执行。

品牌：<BRAND>   (design-md 目录名，如 supabase / mistral.ai)

⚠️ 不要用 Python 或任何脚本批量生成。必须读完该品牌的 DESIGN.md 再手写这一个 HTML。

步骤：
1. 读 brand-design-tokens/design-md/<BRAND>/DESIGN.md，抽 colors/typography/rounded/spacing。
   **立刻判断起始主题**：canvas 为白色/奶油/浅色 → data-theme="light"；
   canvas 为黑色/近黑/深色 → data-theme="dark"。
2. 读 CONTENT-SPEC.md —— 文案和结构的唯一来源。
3. 写 preview/examples/<BRAND>.html：自包含单文件，内联 style/script。
   文案、12 区块 A–L、DOM 顺序逐字照搬 CONTENT-SPEC.md（英文不动）；
   CSS token 全来自 DESIGN.md；特征色先定义变量再用 var(...) 引用；
   不写内联 style；专有字体用最接近的 Google Fonts + 系统兜底；
   亮/暗双主题都按 DESIGN.md 规范还原,不是机械反色；
   <html data-theme> 初始值按步骤 1 的判断。
   参考 examples/claude.html / stripe.html / linear.html。
4. 在 preview/index.html 接入新品牌：
   - 在最贴近的分类 .grid 里新增一张 <a class="tile" href="examples/<BRAND>.html"> 卡片
     （结构照抄同分类已有卡片，<h3> 写准品牌名供搜索匹配）；
   - 在 <style> 的「各品牌色板」段加一条 .s-<BRAND> 规则；
   - 该分类 .cat-head 计数 +1，页面顶部 h1/段落总数 +1，<title> 同步。
   **必须检查** .s-<BRAND> 色板背景色（对比 DESIGN.md canvas 值）、
   色板小标签颜色（用 brand primary）、卡片中文描述（概括核心设计特征）、
   色板中文标签（主题+强调色，如"暖奶油 · 橙"）。
   index.html 全中文。
5. 自检：浏览器无报错；主题切换正常,亮色和暗色都符合 DESIGN.md；含 5 个共享文案串
   (Create your workspace / Recent releases / Jordan Lee /
   Continue with SSO / Workspace URL)；12 区块齐全；<div> 开闭计数相等；
   index 色板背景/小标签/描述与页面默认主题、DESIGN.md canvas 值一致；
   搜索栏能命中新卡片；无内联 style；:root 和 [data-theme] 之外无硬编码 hex。
```
