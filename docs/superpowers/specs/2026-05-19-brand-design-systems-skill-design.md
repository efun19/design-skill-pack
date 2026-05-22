# brand-design-systems —— Skill 设计文档

> 日期: 2026-05-19
> 对应 ROADMAP 想法 2 —— Design 的 Skill
> 仓库: `design-skill-pack`

## 1. 目标

把 `preview/design-md/` 下 71 套真实品牌的 DESIGN.md 设计 token,封装成一个可独立分发的
Claude Code Skill。当用户要"按某品牌 / 某设计风格写前端"时,skill 负责把对应的
DESIGN.md 全文喂进上下文,由当时的需求决定产物形态(HTML / React / Vue 等)。

**skill 不生成代码,不规定产物形态。** 它只做一件事:把用户的风格意图,路由到正确的
DESIGN.md token 文档。

## 2. 范围

**做:**
- 打包 71 套 DESIGN.md token
- 一份 JSON 路由索引 + 三路径路由逻辑
- 视觉预览页(浏览器里看 71 套真实效果)
- 可独立分发(别人可安装,完全离线)

**不做(YAGNI):**
- mashup("Linear 布局 + Claude 配色"组合两套)—— 本期不做
- 代码生成器 / 产物模板 —— skill 只提供 token,不产代码
- 在线获取 DESIGN.md —— 全部离线打包

## 3. 名称

`brand-design-systems` —— 三维度(品牌 / 设计 / 系统)全占。

## 4. 目录结构(方案 A:skill 收编整个 preview/)

```
brand-design-systems/
├── SKILL.md                      # frontmatter + 三路径路由说明
├── brands.json                   # 路由索引:71 条品牌元数据
├── index.html                    # 视觉预览页(路径 2)
├── design-md/<brand>/DESIGN.md    # 71 份 token(payload)
├── examples/<brand>.html          # 71 个渲染预览(index.html 跳转目标)
├── CONTENT-SPEC.md                # 维护文档:共享文案规格
└── ADDING-A-BRAND.md              # 维护文档:新增品牌流程
```

**源头唯一:** `preview/` 目录进化成 skill 目录,不保留两份 token 拷贝。`index.html` /
`examples/` / `design-md/` 内部已是相对路径,迁移后无需改动。新增 `SKILL.md` 和
`brands.json` 两个文件。

**取舍:** skill 体积约 1.5MB(71 个 HTML 预览),换来路径 2 的"看效果再选"完全离线可用
—— skill 的核心卖点就是这个,值得。

## 5. brands.json schema

数组,71 条,每条:

```json
{
  "id": "stripe",
  "name": "Stripe",
  "category": "金融科技与加密",
  "theme": "light",
  "accent": "#533afd",
  "vibe": ["渐变", "细体标题", "氛围光感", "金融科技"],
  "scenarios": ["landing", "fintech", "saas", "developer"],
  "blurb": "纤细标题字体、靛蓝主色、hero 氛围渐变 mesh",
  "design_md": "design-md/stripe/DESIGN.md",
  "preview": "examples/stripe.html"
}
```

| 字段 | 用途 | 来源 |
|------|------|------|
| `id` | design-md 目录名 / 文件定位 | 目录名 |
| `name` | 展示名,路径 1 点名匹配 | index.html `<h3>` |
| `category` | 9 大分类之一 | index.html 分类 |
| `theme` | `light` / `dark`,起始主题 | DESIGN.md canvas |
| `accent` | 主强调色 hex | DESIGN.md `primary` |
| `vibe` | 中文风格词数组,答"什么气质" | 新写,概括 DESIGN.md |
| `scenarios` | 英文场景标签数组,答"什么用途" | 新写 |
| `blurb` | 一句话中文描述 | 复用 index.html tile 描述 |
| `design_md` | token 文档相对路径 | 固定规则 |
| `preview` | 渲染预览相对路径 | 固定规则 |

`vibe` 与 `scenarios` 分开:路径 3 用户既可能说气质("想要极简 / 暗色编辑感"),也可能说
用途("写个博客 / 做 SaaS 落地页"),两者都能命中。

## 6. 三路径路由(SKILL.md 核心逻辑)

**路径 1 —— 点名品牌**
用户说"用 Stripe 风格写一个落地页" → 读 `brands.json` 按 `name` / `id` 定位 →
把 `design-md/stripe/DESIGN.md` 全文读入上下文 → 按 token 写前端。

**路径 2 —— 用户不确定**
用户没指定风格 → 提示用户在浏览器打开 skill 内的 `index.html` 浏览 71 套真实效果 →
用户选定后回到路径 1。

**路径 3 —— 描述场景 / 风格**
用户说"写个博客 / 想要暗色编辑感" → 读 `brands.json`,按 `scenarios` + `vibe` 过滤 →
推荐 2-3 个品牌(附 `blurb`)→ 用户拍板后回到路径 1。

**边界 —— 品牌不在库**
用户点名的品牌不在 71 套内 → 直接提示"该品牌不在库中",并建议改走路径 2(浏览)
或路径 3(描述需求)。不猜测、不强行套用近似品牌。

## 7. SKILL.md frontmatter

```yaml
---
name: brand-design-systems
description: >
  71 套真实品牌的设计系统(DESIGN.md token)。当用户要按某品牌或某设计风格写
  前端 —— HTML / React / 组件 / 网页 —— 时使用。支持点名品牌、浏览预览选择、
  按场景或风格推荐三种方式。触发词:按 X 品牌风格写、用某设计系统、design.md、
  设计 token、品牌配色字体、想要某种风格的页面。
---
```

正文 = 第 6 节三路径路由说明 + brands.json 用法 + index.html 打开方式。

## 8. 落地步骤(概览,详细计划见后续 implementation plan)

1. `preview/` 迁移成 `brand-design-systems/` skill 目录
2. 写 `brands.json` —— 71 条,`blurb` 复用 index.html,`vibe` / `scenarios` 新写
3. 写 `SKILL.md` —— frontmatter + 三路径路由说明
4. 验证:三条路径各跑一遍;品牌不在库的边界提示;index.html 离线可开
5. ROADMAP 想法 2 标记进行中 → 完成

## 9. 已知风险(沿用 ROADMAP)

- 上游已有 zephyrwang6/brand-design-md(62 品牌)、bergside/awesome-design-skills
  (67 抽象风格)—— 本 skill 差异点是"71 套可视化预览 + 三路径路由",不是单纯 token 堆。
- Anthropic 官方 frontend-design skill 占了通用前端审美 —— 本 skill 不碰审美生成,只供 token。
- 付费字体:DESIGN.md 常指定 Copernicus / Sohne 等,各 examples 页已用 Google Fonts +
  系统兜底链处理,DESIGN.md 原文保留专有字体名。
