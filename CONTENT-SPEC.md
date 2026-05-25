# CONTENT-SPEC — 共享文案规格

> 所有品牌预览页的**唯一内容来源**。每个 `examples/<brand>.html` 逐字照搬本文档,
> 唯一变量是设计风格(取自对应 DESIGN.md)。新增品牌时不要改文案,只改样式。

## 原则

页面是**一个连贯的虚构产品落地页**,不是组件目录。所有 HTML 元素(标题层级、
按钮各态、表单各控件、表格、tabs、徽章、提示、列表、引用、代码)都**自然嵌入
真实场景**,页面里**不出现** "Typography / Buttons / Form" 这类陈列标签。

虚构品牌:**Acme** —— 一个团队协作 / 项目管理 SaaS。不用任何真实品牌名、
logo、文案,规避 IP 风险。

页面顺序固定,12 个区块。文案逐字照搬。

---

## A. 公告条(页面最顶,细条)

文字:`Acme 2.5 is now available — explore what's new` ,行尾一个文字链接 `Read the changelog →`。
> 视觉用 info 提示风格(承载 alert-info 的语义)。

## B. 顶部导航(`<header>`)

- 文字 logo:**Acme**
- 导航链接(4):`Product` · `Pricing` · `Docs` · `Blog`
- 主题切换按钮:light 显示 `Dark`,dark 显示 `Light`
- CTA 按钮(主按钮,中尺寸):`Get started`

## C. Hero

- eyebrow 徽章:`Now in public beta`
- h1:`Ship your ideas faster`
- 副标题:`Acme is the collaborative workspace where modern teams plan, track, and ship — all in one place.`
- 主按钮(大尺寸):`Start free trial`
- 次按钮(大尺寸):`Watch demo`

## D. 数据条(Hero 下方,做信任背书)

3 个统计:

- `12,000+` —— `teams onboard`
- `99.98%` —— `uptime last year`
- `4.9 / 5` —— `average customer rating`

## E. 特性区

- h2:`Everything your team needs`
- 引导段:`From the first spec to the final release, Acme keeps every moving piece in one shared, always-current workspace.`
- 3 张卡片,每张:图标位 + 标题(h3 级)+ 描述 + 一个 ghost 文字按钮 `Learn more`。
  其中卡片标题旁带徽章:
  1. 标题 `Plan`,徽章 `New` —— 描述 `Break big goals into projects, milestones, and issues your team can act on.`
  2. 标题 `Track`,徽章 `Beta` —— 描述 `See progress in real time with boards, timelines, and automatic status rollups.`
  3. 标题 `Ship`(无徽章)—— 描述 `Cut releases with confidence using changelogs, approvals, and release notes.`

## F. 开发者区(承载正文排版 / 链接 / 代码 / 列表)

- h2:`Built for the way developers work`
- 正文段:`Acme keeps your team aligned with a single source of truth. Body text should stay comfortable to read across long passages, with a measure of roughly 65 characters per line and generous line height.`
- 正文段含行内链接:`Wire it into your stack in minutes — read the documentation to get started.`(`read the documentation` 为链接,指向 `#`)
- 正文段含行内代码:`Install the CLI with npm install acme and you're ready to ship.`(`npm install acme` 用 `<code>`)
- 代码块(`<pre><code>`):
  ```
  function ship(idea) {
    return idea.plan().track().release();
  }
  ```
- 无序列表(小标题 `Included in every plan`,3 项):`Real-time collaboration` / `Keyboard-first navigation` / `Offline support`
- 有序列表(小标题 `Get started in three steps`,3 项):`Create a project` / `Invite your team` / `Ship your first release`

## G. 客户评价(引用)

引用块(blockquote):`"Acme cut our release cycle from three weeks to four days. It's the first tool the whole team actually agreed on."`
署名(cite):`Jordan Lee · Head of Engineering, Northwind`

## H. 工作区展示(Tabs)

- h2:`Explore your workspace`
- 3 个标签:`Overview` / `Activity` / `Settings`(默认 Overview)
- 面板内容:
  - **Overview**:一句 `A snapshot of your workspace — projects, members, and recent activity, all on one page.`
  - **Activity**:一句引导 `Every change across your projects, in one chronological feed:` ,下面跟 **4 条通知**,各用一种提示语义:
    - info:`A new version of Acme is available.`
    - success:`Your changes have been saved.`
    - warning:`Your trial ends in 3 days.`
    - error:`We couldn't process your payment.`
  - **Settings**:一句 `Manage your workspace name, members, and billing preferences from a single control panel.`

## I. 更新记录(表格)

- h3:`Recent releases`
- 表头:`Release` · `Owner` · `Status` · `Date`
- 5 行(`Status` 列用徽章呈现):

| Release | Owner | Status | Date |
|---------|-------|--------|------|
| v2.5 Borealis | Priya Shah | Shipped | May 14 |
| v2.6 Cosmos | Marco Diaz | In review | May 16 |
| v2.7 Drift | Aria Kim | In progress | May 20 |
| v2.8 Ember | Sam Olsen | Planned | May 24 |
| v1.9 Legacy API | Jordan Lee | Deprecated | Apr 02 |

> 末行 `Deprecated` 徽章用弱化 / 中性样式,前四行 `Shipped` 用主色徽章、其余用中性徽章。

## J. 注册区(表单)

- h2:`Create your workspace`
- 副标题:`Set up your team in under a minute.`
- 表单字段:
  - 文本输入:label `Full name`,placeholder `Jane Appleseed`
  - 邮箱输入:label `Work email`,placeholder `jane@company.com`
  - 下拉 select:label `Team size`,选项 `1–10` / `11–50` / `51–200` / `200+`
  - 文本域:label `What are you building?`,placeholder `Tell us a little about your project…`
  - 文本输入(错误态):label `Workspace URL`,值 `acme`,下方红色错误文字
    `This workspace name is already taken.`
  - 单选组:label `Plan`,选项 `Starter` / `Pro`(默认选 Pro,`Pro` 旁带徽章 `Pro`)
  - 复选框:文字 `Send me product updates`(未选)
  - 开关(toggle):文字 `Enable two-factor authentication`(默认开)
  - 主按钮:`Create account`
  - 禁用按钮(并排,次要):`Continue with SSO`(禁用态,旁注 enterprise-only 的语气)

## K. 结尾 CTA 区

- 标题(h2/h3 级):`Start shipping with Acme today`
- 副标题:`Free for up to 10 members. No credit card required.`
- 按钮(大尺寸):`Get started`

## L. 页脚(`<footer>`)

- 文字 logo:**Acme**
- 一句话:`The collaborative workspace for modern teams.`
- 三组链接:
  - `Product`:`Features` / `Pricing` / `Changelog`
  - `Company`:`About` / `Careers` / `Contact`
  - `Resources`:`Docs` / `Community` / `Support`
- 版权:`© 2026 Acme, Inc. All rights reserved.`

---

## 元素覆盖核对(都应自然出现,无陈列标签)

- 标题层级 h1–h4:hero h1、区块 h2、卡片 h3、子标题 h4
- 按钮:主(nav 中尺寸 / hero 大尺寸)、次(hero)、ghost(卡片 Learn more)、禁用(注册区 SSO)
- 表单:文本 / 邮箱 / select / 文本域 / 复选 / 单选 / 开关 / 错误态
- 表格:更新记录 5 行 + 表头
- Tabs:工作区展示 3 标签,可切换
- 徽章:`New` `Beta`(特性卡)、`Pro`(注册区)、`Deprecated` + 表格状态徽章
- 提示语义:公告条(info)+ Activity 面板 4 条(info/success/warning/error)
- 列表:无序(Included in every plan)、有序(Get started in three steps)
- 引用:客户评价 blockquote + cite
- 代码:行内 `<code>` + 代码块 `<pre>`
- 链接:正文行内链接、公告条链接、页脚链接

## 功能要求(所有页面)

1. **暗色 / 亮色切换** —— 导航主题按钮切 `<html data-theme>`,CSS 变量随
   `[data-theme="dark"]` 重定义,无刷新。两套配色都取自 DESIGN.md。
2. **Tabs 切换** —— 纯 JS,点击切换 active 面板。
3. **表单错误态** —— `Workspace URL` 字段静态展示错误样式 + 文字。
4. **自包含** —— 单 HTML 文件,CSS/JS 内联,无构建;字体走 Google Fonts CDN,
   缺字体有 fallback 链。
5. **响应式** —— 桌面与窄屏均可读;网格窄屏堆叠。

## 新增品牌步骤

1. 拷该品牌 DESIGN.md 到 `brand-design-tokens/design-md/<brand>/DESIGN.md`
2. 按本文档手写 `brand-design-tokens/examples/<brand>.html`(文案逐字照搬,只换样式)
3. 在 `docs/brands.html` 加一张卡片
