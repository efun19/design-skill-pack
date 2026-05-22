# brand-design-systems Skill 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `preview/` 下 71 套品牌 DESIGN.md token 封装成可独立分发的 Claude Code Skill `brand-design-systems`,提供点名 / 浏览 / 场景推荐三路径路由。

**Architecture:** 方案 A —— `preview/` 目录整体进化成 skill 目录,新增 `SKILL.md`(路由说明)和 `brands.json`(71 条路由索引)。skill 不生成代码,只把对应 DESIGN.md 喂进上下文。完全离线、自包含。

**Tech Stack:** 纯静态文件 —— Markdown(SKILL.md)、JSON(brands.json)、已有 HTML。无构建、无运行时、无测试框架。验证靠 shell 检查脚本。

> 对应 spec: `docs/superpowers/specs/2026-05-19-brand-design-systems-skill-design.md`
> 注意:用户要求所有改动暂不提交,等其审批。计划中的 `git` 步骤先不执行,改动留本地。

---

## 关键陷阱:目录名 / 文件名的点-横杠不一致

4 个品牌 `design-md/` 目录名带点,`examples/` 文件名带横杠:

| design-md 目录 | examples 文件 | brands.json `id` |
|----------------|---------------|------------------|
| `design-md/mistral.ai/` | `examples/mistral-ai.html` | `mistral-ai` |
| `design-md/opencode.ai/` | `examples/opencode-ai.html` | `opencode-ai` |
| `design-md/together.ai/` | `examples/together-ai.html` | `together-ai` |
| `design-md/x.ai/` | `examples/x-ai.html` | `x-ai` |

规则:`id` 用横杠形式(与 `examples/` 文件名、`index.html` tile href 一致)。
`design_md` 字段指向带点的真实目录,`preview` 字段指向带横杠的文件。其余 67 个品牌
两种形式相同。

---

## Task 1: 迁移 preview/ 成 skill 目录

**Files:**
- Rename: `preview/` → `brand-design-systems/`

- [ ] **Step 1: 确认 preview/ 当前内容**

Run: `ls preview/`
Expected: `ADDING-A-BRAND.md  CONTENT-SPEC.md  design-md  examples  index.html`

- [ ] **Step 2: 重命名目录**

Run: `mv preview brand-design-systems`

- [ ] **Step 3: 验证迁移完整**

Run: `ls brand-design-systems/ && ls brand-design-systems/design-md | wc -l && ls brand-design-systems/examples | wc -l`
Expected: 顶层 5 项;`design-md` 71;`examples` 71。

- [ ] **Step 4: 验证 index.html 相对路径仍有效**

Run: `grep -o 'examples/[a-z0-9-]*\.html' brand-design-systems/index.html | sort -u | wc -l`
Expected: `71`(全部 tile href 是相对路径,迁移后无需改)。

不提交(等用户审批)。

---

## Task 2: 写 brands.json 路由索引

**Files:**
- Create: `brand-design-systems/brands.json`

`brands.json` 是一个数组,71 条。每条对象的字段与取值来源:

| 字段 | 取值规则 |
|------|---------|
| `id` | `examples/<id>.html` 的文件名(横杠形式) |
| `name` | `index.html` 该品牌 tile 的 `<h3>` 文本 |
| `category` | `index.html` 该 tile 所属 `<section class="cat">` 的 `<h2>` 文本 |
| `theme` | 读 `design-md/<dir>/DESIGN.md` 的 `canvas`:白/奶油/浅色→`light`;黑/近黑/深色→`dark` |
| `accent` | `design-md/<dir>/DESIGN.md` 的 `colors.primary` 值 |
| `vibe` | 新写:2-4 个中文风格词,概括该品牌气质(暗色/极简/编辑感/渐变/工程感等) |
| `scenarios` | 新写:2-4 个英文场景标签,取值见下方枚举 |
| `blurb` | `index.html` 该 tile `<p>` 的中文描述,逐字复用 |
| `design_md` | `design-md/<dir>/DESIGN.md`(`<dir>` 用真实目录名,4 个带点) |
| `preview` | `examples/<id>.html` |

`scenarios` 标签枚举(只从这些里选,保证过滤一致):
`landing` `blog` `docs` `dashboard` `saas` `ecommerce` `fintech` `developer`
`ai` `media` `marketing` `portfolio` `automotive` `enterprise`

- [ ] **Step 1: 导出三个数据源到临时参考**

Run: `ls brand-design-systems/examples | sed 's/\.html$//' > /tmp/ids.txt && cat /tmp/ids.txt | wc -l`
Expected: `71`

- [ ] **Step 2: 逐品牌组装条目**

对 `/tmp/ids.txt` 里每个 `id`:
1. 在 `brand-design-systems/index.html` 搜该品牌 tile,抽 `name` / `category` / `blurb`。
2. 算 `<dir>`:默认 `<dir>` = `id`;4 个例外按上方陷阱表(`mistral-ai`→`mistral.ai` 等)。
3. 读 `brand-design-systems/design-md/<dir>/DESIGN.md` frontmatter,抽 `theme`(由 `canvas` 判定)和 `accent`(`colors.primary`)。
4. 据 DESIGN.md `description` 和 `category` 写 `vibe`(中文)和 `scenarios`(英文,从枚举选)。

三条完整样例(直接照此格式写其余 68 条):

```json
[
  {
    "id": "stripe",
    "name": "Stripe",
    "category": "金融科技与加密",
    "theme": "light",
    "accent": "#533afd",
    "vibe": ["渐变", "细体标题", "氛围光感", "金融科技"],
    "scenarios": ["landing", "fintech", "saas", "developer"],
    "blurb": "纤细标题字体、靛蓝主色、hero 上的氛围渐变 mesh。",
    "design_md": "design-md/stripe/DESIGN.md",
    "preview": "examples/stripe.html"
  },
  {
    "id": "linear",
    "name": "Linear",
    "category": "生产力与 SaaS",
    "theme": "dark",
    "accent": "#5e6ad2",
    "vibe": ["暗色", "几何无衬线", "紧凑", "技术感"],
    "scenarios": ["saas", "developer", "landing", "dashboard"],
    "blurb": "近黑表面、紧凑几何无衬线、薰衣草强调 —— 安静的软件手艺。",
    "design_md": "design-md/linear/DESIGN.md",
    "preview": "examples/linear.html"
  },
  {
    "id": "x-ai",
    "name": "xAI",
    "category": "AI 与大模型平台",
    "theme": "dark",
    "accent": "#ffffff",
    "vibe": ["纯黑", "超大字间距", "极简", "前沿研究"],
    "scenarios": ["ai", "landing", "marketing"],
    "blurb": "纯黑画布、白色胶囊按钮、超大字间距 —— 前沿 AI 实验室。",
    "design_md": "design-md/x.ai/DESIGN.md",
    "preview": "examples/x-ai.html"
  }
]
```

把全部 71 条写进 `brand-design-systems/brands.json`,合法 JSON 数组。

- [ ] **Step 3: 验证 JSON 合法**

Run: `python3 -c "import json;d=json.load(open('brand-design-systems/brands.json'));print(len(d))"`
Expected: `71`

- [ ] **Step 4: 验证每条的 design_md / preview 路径都存在**

Run:
```bash
python3 -c "
import json,os
d=json.load(open('brand-design-systems/brands.json'))
base='brand-design-systems'
bad=[b['id'] for b in d if not os.path.exists(os.path.join(base,b['design_md'])) or not os.path.exists(os.path.join(base,b['preview']))]
print('BAD:',bad if bad else 'none')
"
```
Expected: `BAD: none`

- [ ] **Step 5: 验证 id 集合与 examples/ 文件一一对应**

Run:
```bash
python3 -c "
import json
d=json.load(open('brand-design-systems/brands.json'))
ids=sorted(b['id'] for b in d)
import os
files=sorted(f[:-5] for f in os.listdir('brand-design-systems/examples'))
print('MATCH' if ids==files else ('MISMATCH', set(ids)^set(files)))
"
```
Expected: `MATCH`

- [ ] **Step 6: 验证 scenarios 标签都在枚举内**

Run:
```bash
python3 -c "
import json
allowed={'landing','blog','docs','dashboard','saas','ecommerce','fintech','developer','ai','media','marketing','portfolio','automotive','enterprise'}
d=json.load(open('brand-design-systems/brands.json'))
bad=sorted({s for b in d for s in b['scenarios']}-allowed)
print('BAD TAGS:',bad if bad else 'none')
"
```
Expected: `BAD TAGS: none`

不提交。

---

## Task 3: 写 SKILL.md

**Files:**
- Create: `brand-design-systems/SKILL.md`

- [ ] **Step 1: 写 SKILL.md 全文**

写入 `brand-design-systems/SKILL.md`:

````markdown
---
name: brand-design-systems
description: >
  71 套真实品牌的设计系统(DESIGN.md 设计 token)。当用户要按某品牌或某设计
  风格写前端 —— HTML / React / 组件 / 网页 —— 时使用。支持点名品牌、浏览预览
  选择、按场景或风格推荐三种方式。触发词:按 X 品牌风格写、用某设计系统、
  design.md、设计 token、品牌配色字体、想要某种风格的页面、参考某品牌做 UI。
---

# brand-design-systems

71 套真实品牌的设计系统 token 库。本 skill **不生成代码**,只负责把用户的风格
意图路由到正确的 `DESIGN.md`,再由你按其 token 写前端,产物形态(HTML / React /
Vue 等)由当时需求决定。

## 数据文件

- `brands.json` —— 71 条路由索引。每条含 `id` `name` `category` `theme`
  `accent` `vibe`(中文风格词)`scenarios`(英文场景标签)`blurb`(一句话描述)
  `design_md`(token 文档路径)`preview`(渲染预览路径)。
- `design-md/<brand>/DESIGN.md` —— 各品牌完整设计 token(colors / typography /
  rounded / spacing / components)。
- `examples/<brand>.html` —— 各品牌的渲染预览页。
- `index.html` —— 71 套预览的总索引页,带搜索和分类。

## 三路径路由

判断用户属于哪条路径,然后执行:

### 路径 1 —— 用户点名了品牌

用户明确说了品牌名(如「用 Stripe 风格写一个落地页」):

1. 读 `brands.json`,按 `name` 或 `id` 定位该品牌。
2. **品牌不在 71 条内** → 直接告诉用户「该品牌不在库中」,并建议改走路径 2
   (浏览预览)或路径 3(描述需求)。不猜测、不强行套用近似品牌。
3. 命中 → 把该品牌 `design_md` 指向的 `DESIGN.md` **全文**读入上下文。
4. 按 DESIGN.md 的 token 写用户要的前端。

### 路径 2 —— 用户不确定要什么风格

用户没指定风格、或明确说想先看看:

1. 提示用户在浏览器打开本 skill 目录下的 `index.html`,浏览 71 套真实效果。
2. 用户选定品牌后,回到路径 1 第 3 步。

### 路径 3 —— 用户描述了场景或风格

用户描述用途或气质(如「写个博客」「想要暗色编辑感」「做个 SaaS 落地页」):

1. 读 `brands.json`,按 `scenarios`(场景:用途)和 `vibe`(风格:气质)过滤。
2. 推荐 2-3 个匹配品牌,每个附 `blurb` 让用户快速判断。
3. 用户拍板后,回到路径 1 第 3 步。

## 维护

新增品牌见 `ADDING-A-BRAND.md`;共享文案规格见 `CONTENT-SPEC.md`。新增品牌后
必须同步在 `brands.json` 追加一条。
````

- [ ] **Step 2: 验证 frontmatter 合法**

Run: `head -12 brand-design-systems/SKILL.md`
Expected: 看到 `---` 包裹的 `name:` 和 `description:` 字段。

不提交。

---

## Task 4: 整体验证

**Files:** 无改动,仅检查。

- [ ] **Step 1: 验证 skill 目录结构完整**

Run:
```bash
ls brand-design-systems/SKILL.md brand-design-systems/brands.json \
   brand-design-systems/index.html brand-design-systems/CONTENT-SPEC.md \
   brand-design-systems/ADDING-A-BRAND.md && \
ls brand-design-systems/design-md | wc -l && \
ls brand-design-systems/examples | wc -l
```
Expected: 5 个文件都在;`design-md` 71;`examples` 71。

- [ ] **Step 2: 路径 1 演练 —— 点名命中**

人工:假装用户说「用 Notion 风格写一个页面」。在 `brands.json` 搜 `"name": "Notion"`,
确认能定位到 `design_md: "design-md/notion/DESIGN.md"`,且该文件存在。
Expected: 命中,文件存在。

- [ ] **Step 3: 路径 1 演练 —— 边界(品牌不在库)**

人工:假装用户说「用 Adobe 风格」。在 `brands.json` 搜 `Adobe`。
Expected: 搜不到 → 按 SKILL.md 应提示「不在库中」+ 建议路径 2/3。

- [ ] **Step 4: 路径 3 演练 —— 场景过滤**

Run:
```bash
python3 -c "
import json
d=json.load(open('brand-design-systems/brands.json'))
hits=[b['name'] for b in d if 'blog' in b['scenarios']]
print('blog 场景命中:',hits)
"
```
Expected: 输出若干品牌名(非空),证明 `scenarios` 过滤可用。

- [ ] **Step 5: 路径 2 演练 —— index.html 离线可开**

人工:浏览器直接打开 `brand-design-systems/index.html`,确认页面渲染、搜索栏可用、
随便点一张卡片能跳到对应 `examples/*.html` 且不 404。
Expected: 全部正常。

---

## Task 5: 更新 ROADMAP

**Files:**
- Modify: `ROADMAP.md`

- [ ] **Step 1: 改想法 2 状态**

把 `ROADMAP.md` 进展一览表里想法 2 那行:
```
| 2 | Design 的 Skill | ⬜ 未开始 | — |
```
改成:
```
| 2 | Design 的 Skill | ✅ 已完成 | `brand-design-systems/` skill |
```

- [ ] **Step 2: 更新想法 1 的品牌数**

把想法 1 行和正文里的「9 个品牌」改成「71 个品牌」,产物路径 `preview/` 改成
`brand-design-systems/`(目录已迁移)。

- [ ] **Step 3: 在想法 2 章节补「已完成」小节**

在 `## 想法 2` 章节追加:
```markdown
**已完成:**
- skill 目录 `brand-design-systems/`,自包含可独立分发
- `brands.json` 71 条路由索引(theme/accent/vibe/scenarios/blurb)
- `SKILL.md` 三路径路由(点名 / 浏览 / 场景推荐)
- mashup 本期未做,留待后续
```

- [ ] **Step 4: 验证**

Run: `grep -n '想法 2\|brand-design-systems' ROADMAP.md`
Expected: 看到状态已改为已完成。

不提交。全部任务完成后,统一交用户审批再决定是否提交。

---

## 自检结果

- **Spec 覆盖:** 目录结构→T1;brands.json schema→T2;三路径路由+边界→T3/T4;
  SKILL.md frontmatter→T3;落地步骤→T1-T5;名称 `brand-design-systems`→全程。无遗漏。
- **占位符:** 无 TBD/TODO。brands.json 71 条是真实工作量,T2 给了确定的提取规则
  + 3 条完整样例 + 6 步验证,非占位。
- **类型一致:** `brands.json` 字段名(`id`/`name`/`theme`/`accent`/`vibe`/
  `scenarios`/`blurb`/`design_md`/`preview`)在 T2 schema、T3 SKILL.md、T4 验证脚本中一致。
