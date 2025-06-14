# README

![Obsidian plugin](https://img.shields.io/endpoint?url=https%3A%2F%2Fscambier.xyz%2Fobsidian-endpoints%2Fany-block.json) ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/LincZero/obsidian-any-block)

[中文](./README.zh.md) | [English](./README.md)

## What's AnyBlock?

- A markdown parsing and rendering module/plugin. (**Obsidian plugin, Markdown-it plugin, Online App, Vuepress plugin**)
- Feature: You can flexibility to create a 'Block' by many means. It also provides many useful features, like `list to table` and so on
- Feature (detail): You can select a section by list/heading/table/quote/codeBlock/markdown-it-container(`:::`), and trun into table/tabs/dir/card/column/mindmap/markmap/mermaid/PlantUML/timeLine/jsonChart/nodeTree and more

## More Links

- Related links：**tutorial**、use skill、contribution、secondary development、online use. Documentation is **multilingual** (zh/en), don't worry.
- [Online Wiki - github.io](https://lincdocs.github.io/AnyBlock/)
- [Online Effects warrior/Tutorial - github.io](https://lincdocs.github.io/AnyBlock/README.show.html), You can learn how to use it by switching between tabs.
- [Online Interaction - github.io](https://any-block.github.io/any-block/). You can write experiences here and learn usage through templates
- Alternate site links：When the website link to this article fails, try replacing `linczero.github.io` with `linczero-github-io.pages.dev` in the url
- [A Min-sized version of anyblock](https://github.com/any-block/obsidian-any-block-min), you can download it manually or use the BRAT plugin to download/update the obsidian plugin automatically

## Lightspot

This is a **【Syntax free, Extensible、Powerful and flexible、Multi-platform】** Markdown block extension analysis and rendering module/plugin.

- Syntax free
    - No new syntax、Syntax-free intrusion
	- This also leads to no excessive reliance on plugins. I think a good plugin should not cause - when you have used the plugin for a period of time, leaving it will cause the original content to deform, become unreadable or maintainable
- Extensible
    - Facilitate secondary development
- Flexible and powerful
    - Selector (Flexible)：The selection range is flexible, with six selection methods, making it simple and easy to use
	- Processor (Powerful)：Rich and diverse, powerful in function and highly scalable
- Multi-platform, strong universality
    - It can use: **Obsidian plugin, Markdown-it plugin, Online App, Vuepress plugin**
	- Blogs such as vuepress/vitepress that support markdown-it parsing

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

[![Star History Chart](https://api.star-history.com/svg?repos=any-block/any-block&type=Date)](https://www.star-history.com/#any-block/any-block&Date)
