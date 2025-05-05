# README

![Obsidian plugin](https://img.shields.io/endpoint?url=https%3A%2F%2Fscambier.xyz%2Fobsidian-endpoints%2Fany-block.json) ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/LincZero/obsidian-any-block)

[中文](./README.md) | [English](./README.en.md)

## AnyBlock是什么?

- 一个markdown解析和渲染的模块/插件。(**Obsidian插件, Markdown-it插件, 在线App, Vuepress插件**)
- 您可以通过许多方式灵活地创建一个“块”。它还提供了许多有用的功能，如“列表转表格”等

## 相关链接

- 相关链接：**教程**、使用技能、贡献、二次开发、在线使用。文档是**多语言**的（zh/en），不用担心
- [在线文档 - github.io](https://linczero.github.io/MdNote_Public/ProductDoc/AnyBlock/)
- [在线效果展示/教程 - github.io](https://linczero.github.io/MdNote_Public/ProductDoc/AnyBlock/README.show.md), 你可以通过切换里面的标签页来学习用法
- [在线交互 - github.io](https://any-block.github.io/obsidian-any-block/)，你可以在这里编写体验、通过模板学习用法
- [文档对应的仓库 - github](https://github.com/LincDocs/MdNote_Public/tree/main/ProductDoc/AnyBlock), 你可以在此翻译或补充文档
- 备用网站链接：如果网站失效，则将网站链接部分的 `linczero.github.io` 替换成 `linczero-github-io.pages.dev` 就可以了
	  （**本文的默认网站链接指向 github.io，如果国内有不能访问的朋友，那么大概率需要做这一步**）

## 亮点

这是一个 **【无语法、可扩展、灵活强大、多平台】** 的 Markdown 块扩展解析与渲染模块插件。

- 无语法
    - 没有新语法、没有语法入侵
	- 这也导致没有过度的插件依赖。我认为好的插件不应该导致 —— 当你用了一段时间插件后，离开该插件会导致原来的内容变形，不可读或维护
- 可扩展性
    - 插件方便二次开发
- 灵活且强大
    - 选择器 (灵活)：选择范围灵活，六种选择方式，简单易用
	- 处理器 (强大)：丰富多样、功能强大、扩展性强
- 多平台, 高通用
    - 可用于: **Obsidian插件, Markdown-it插件, 在线App, Vuepress插件**
	- 支持markdown-it解析的博客，如vuepress/vitepress等

## Effects warrior (效果展示)

`multiWay table`/`multiCross table`/`Cross table` (`多叉表格`/`跨行表格`)

![](./docs/assets/Pasted%20image%2020240808202548.png)

![](./docs/assets/Pasted%20image%2020240808203055.png)

`ListTable`/`TreeTable`/`TreeGrid` (`列表格`/`树型表格`)

![](./docs/assets/Pasted%20image%2020240808203143.png)

Optimized list (优化列表)

The essence is "listtable" based on the addition of a mock list style (本质是 "列表格" 的基础上增加仿列表样式)

![](./docs/assets/listtable_likelist.png)

Dir Tree (目录树)

The essence is "listtable" based on the addition of imitation directory style (本质是"列表格"的基础上增加仿目录样式)

![](./docs/assets/Pasted%20image%2020240808203216.png)

ASCII Dir Tree (ascii 目录树) 

![](./docs/assets/Pasted%20image%2020240808203232.png)

  WBS (Work Breakdown Structure, 工作分解结构)

![](./docs/assets/Pasted%20image%2020240808203252.png)

timeline (时间线)

![](./docs/assets/Pasted%20image%2020240808203455.png)

tabs & card (标签页和卡片)

![](./docs/assets/tag%20and%20card.png)

mermaid flow (mermaid流程图)

![](./docs/assets/Pasted%20image%2020240808203517.png)

plantuml mindmap (plantuml 思维导图)

![](./docs/assets/Pasted%20image%2020240808203534.png)

nodes (ab mindmap) (转节点树图，AnyBlock版思维导图)

![](./docs/assets/list2node.png)

markmap mindmap (markmap 思维导图)

![](./docs/assets/Pasted%20image%2020240808203605.png)

mermaid mindmap (mermaid 思维导图)

![](./docs/assets/Pasted%20image%2020240808203621.png)

[more……](https://linczero.github.io/MdNote_Public/%E4%BA%A7%E5%93%81%E6%96%87%E6%A1%A3/AnyBlock/)

## Effects warrior - old (旧效果展示)

Here are some of the more common processors:
- list2table  (2datatable)
- list2listtable
- list2mermaid  (graph LR)
- list2mindmap  (mermaid v9.3.0 mindmap)
- list2tab
- list2timeline
- title2list + list2somthing

![](./docs/assets/list2table.png)

![](./docs/assets/list2tableT.png)

![](./docs/assets/list2lt.gif)
 
![](./docs/assets/list2tab.gif)
 
![](./docs/assets/list2mermaid.png)

![](./docs/assets/list2mindmap.png)

![](./docs/assets/titleSelector.png)

![](./docs/assets/addTitle.png)

![](./docs/assets/scroll.gif)
 
![](./docs/assets/overfold.png)

![](./docs/assets/flod.gif)

![](./docs/assets/heimu.gif)

![](./docs/assets/userProcessor.png)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=LincZero/obsidian-any-block&type=Date)](https://star-history.com/#LincZero/obsidian-any-block&Date)
