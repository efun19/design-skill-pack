---
name: brand-design-tokens
description: >
  按真实品牌设计系统生成前端页面或组件。用户提到品牌风格（Claude、Stripe、
  Linear、Apple、Vercel、Notion 等）、design tokens、DESIGN.md、或要求某种
  视觉风格时触发。负责品牌选择、design 确认、demo 对比，再按用户技术栈生成
  最终产物（HTML / React / Vue / Tailwind 等）。
---

# brand-design-tokens

## 这个 skill 做什么

从 71 套真实品牌 token 库中选定品牌，读取对应 `DESIGN.md`，生成符合该品牌
视觉风格的前端产物。技术栈（HTML / React / Vue / Tailwind 等）跟用户需求走，
不做限定。

**铁律：品牌必须由用户确认，不允许替用户默认选择，不允许跳过确认直接生成。**

---

## 路径判断 — 三选一

### 路径 1 · 用户点名了品牌

示例：「用 Stripe 风格做落地页」「按 Linear 风格写 dashboard」

1. 读 `brands.json`，按 `name` / `id` 定位品牌。
2. 不在库中 → 告诉用户「该品牌不在库中」，转路径 2，不套近似品牌。
3. 命中 → 告诉用户也可以再选 1-2 个一起对比，若只选这一个则直接转「确认与生成」流程。

### 路径 2 · 用户没有指定品牌

用户没点名品牌时，**立即提供预览链接**：

> 「这里有 71 套品牌预览，可以先浏览选一个（或多个）：
> [https://efun19.github.io/design-skill-pack/brands.html](https://efun19.github.io/design-skill-pack/brands.html)
> 选好后告诉我品牌名称。选多个也可以，我会各生成一个轻量 demo 对比，再决定用哪个。
> 如果你想让我根据你的需求推荐，也可以告诉我。」

**2A · 用户浏览后回复了品牌名**

转路径 1。

**2B · 用户要求你推荐**

1. 问用户两件事（可一次问完）：
   - 页面/组件的**内容和用途**（如果没说清楚）
   - 想要的**视觉感觉**（亮/暗、轻盈/厚重、极简/有装饰等）
2. 读 `brands.json`，按 `scenarios`（用途）+ `vibe`（气质）+ `theme`（亮暗）三维过滤。
3. 推荐 2-3 个品牌，每条格式：**品牌名（brands.json 中的 `name`）** + `blurb` 说明。
   不要只说风格描述，必须带品牌名。示例格式：
   ```
   • Linear — 深色极简，几何感强，适合工具类 SaaS
   • Vercel — 黑白对比，工程感，适合开发者工具
   ```
4. 候选不足时放宽到最强维度，向用户说明取舍。
5. **告诉用户可以选 1 个或多个**：选 1 个直接生成；选多个先各生成一个轻量 demo 对比，再拍板。
6. 等用户回复，转「确认与生成」流程。

---

## 确认与生成流程

### 1. 确认选定品牌

用户明确说出品牌后，**立即**读取对应 `DESIGN.md` 全文（路径在 `brands.json` 的
`design_md` 字段）。不读 `examples/<id>.html`，预览页不是生成依据。

### 2. 多品牌对比（可选）

用户选了多个候选但还没拍板时，运行脚本生成对比文件：

**运行前先确定项目根目录：**

```bash
# git 项目
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
# 非 git 项目：根据上下文判断项目根目录的绝对路径
PROJECT_ROOT=/path/to/project
```

```bash
node brand-design-tokens/generate-demo.js <brand1> <brand2> [brand3] \
  --root "$PROJECT_ROOT" \
  --title "..." --sub "..." --cta "..." --feat "a,b,c"
```

内容参数从用户描述中提取。

生成后告知用户文件路径（`$PROJECT_ROOT/.brand-demos/compare-*.html`），等待选定。用户拍板后**立即删除** `.brand-demos/compare-*.html`（不删 `.brand-demos/` 目录），再进入第 3 步。

### 3. 用户确认后再生成

用户明确选定品牌（或对 demo 给出选择）后：
- 按用户原始需求（HTML / React / Vue / Tailwind 等）生成完整产物。
- CSS token 全部取自 DESIGN.md 的 colors / typography / rounded / spacing。
- 先定义 CSS 变量或 design token，再在规则里用变量引用，不写硬编码色值。
- 专有字体用最接近的 Google Fonts + 系统兜底。
- 还原品牌专属性格：按钮形状、边框粗细、阴影哲学、字重、装饰元素。
- 不复刻真实品牌官网 / logo / 营销文案，页面内容服务用户项目。

---

## 禁止行为

- **跳过路径，凭印象写** — 必须真的读 DESIGN.md 全文，不靠记忆。
- **品牌不在库时套近似品牌** — 明确告知不在库，转路径 2 或 3。
- **路径 3 只看 vibe 不看 scenarios** — 两个维度都要过滤。
- **读 examples/*.html 后照着写** — 禁止。预览页只供人工浏览。
- **未经用户确认就开始生成完整产物** — 必须先确认品牌，demo 对比后再动手。
- **替用户默认选一个品牌** — 即使你觉得某品牌"显然"最合适，也必须等用户拍板。
