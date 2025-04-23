// 相较于文档版，这里能放的内容更多

export const preset_map = {
//
'Normal markdown': `\
\`^\` 点击编辑区域上面的预设下拉框，可以切换其他demo

this is ~~a~~ **MarkDown** *test*

[list2table]

- 1
  - 2
  - 3
- 2
  - 4 | <
  - 5
    - 6
    - 7

[list2lt]

- < Company name<br>公司名| Superior section<br>上级部门| Principal<br>负责人| Phone<br>电话
- ==ABC head office==| | | 
  - **Shanghai branch**| ==ABC head office==  | ZhangSan| 13&xxxxxxxx
    - Marketing section| **Shanghai branch** | LiSi| 
      |self    |father  |mother  |
      |--------|--------|--------|
      |201xxxxx|202xxxxx|203xxxxx|
      - Marketing Division 1| | | 
      - Marketing Division 2| | | 
    - Sales section| **Shanghai branch** | WangWu| 15&xxxxxxxx
  - *Beijing branch*| ==ABC head office==  | ChenLiu| 16&xxxxxxxx
    - Technical division| *Beijing branch* | OuYang| 17&xxxxxxxx
    - Finance| *Beijing branch* | HuangPu| 18&xxxxxxxx

[nodes]

- a
  - b
  - c
  - d
    - e
    - f


[mindmap]

- a
  - b
  - c
  - d
    - e
    - f


[markmap]

- a
  - b
  - c
  - d
    - e
    - f

[list2dt]

- vue-demo/
  - build/， 项目构建(webpack)相关代码
  - config/， 配置目录，包括端口号等。我们初学可以使用默认的
  - node_modules/， npm 加载的项目依赖模块
  - src/， 这里是我们要开发的目录
    - assets/， 放置一些图片，如logo等
    - components， 目录里面放了一个组件文件，可以不用
    - App.vue， 项目入口文件，我们也可以直接将组件写这里，而不使用 components 目录
    - main.js， 项目的核心文件。
  - static/， 静态资源目录，如图片、字体等
  - test/， 初始测试目录，可删除
  - .eslintignore
  - .gitignore， git配置
  - .index.html， 首页入口文件，你可以添加一些 meta 信息或统计代码啥的
  - package.json， 项目配置文件
  - READED.md， 项目的说明文档，markdown 格式<br>手动换行测试<br>自动换行测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试k
  - ...

[list2astreeH|code()]

- vue-demo/
	- build/
	- config/
	- src/
		- assets/
			- a/
				- b
		- components
	- .babelrc
	- .editorconfig
	- ...

[list2pumlWBS]

- vue-demo/
  - build/
  - config/
  - node_modules/
  - src/
    - < assets/
      - < a
        - b
        - < c
      - d
      - e
    - components
    - App.vue
    - main.js
  - static/
  - test/

(app版本暂不支持点击)

[list2tab]

- linux
  - 可以通过执行以下命令在终端中使用 apt 包安装程序：
    \`\`\`shell
    apt-get install python3.6
    \`\`\`
- windows
  - 转到官方 Python 站点，并导航到最新版本。在撰写本文时，即 \`3.10.6\`。
  - 下载适用于您平台的二进制文件。执行二进制。
  - 除了将 Python 添加到 \`PATH\` 之外，您不需要选择任何选项，因为默认安装程序具有您需要的一切。只需单击“安装”即可。
- macOS
  - 转到官方 Python 站点，并导航到最新版本。在撰写本文时，即 \`3.10.6\`。
  - 下载适用于您平台的二进制文件。执行二进制。
  - 在 Mac 上，这将默认在 dmg 安装程序中完成。

[list2card|addClass(ab-col3)]

- card1
  card1_item<br>$1+1=2$
- card2
  card2_item
  \`\`\`js
  var a = 1
  \`\`\`
- card3
  card3_item
  **Bold** *italics* ==highlight== ~~delete~~
  - list1
  - list2
  - list3
`,
//
'list2table (列表转多叉表格)': `\
[list2table]

- Gymnosperm<br> 裸子植物
	- Cypress<br> 松树
		- Chinese pine<br> 油松
		- Buddhist pine<br> 罗汉松
		- masson pine<br> 马尾松
		- Pinus koraiensis<br> 红松
	- Ginkgo<br> 柏树| (**This** is ~~just~~ a \`style\` *test*)<br> (**这** ~~仅仅~~ 是一个 \`样式\` *测试*)
	- Angiosperms<br> 银杏
- Angiosperm<br> 被子植物
	- Sunflower<br> 向日葵
	- Lotus<br> 荷花
	- Chrysanthemum<br> 菊花 | Chamomile<br> 甘菊

带代码框的情况

[list2mdtable]

- < Language<br>语言
  - Print statement<br>打印语句
    - characteristic<br>特点
- Java
  - \`\`\`java
    System.out.
        println("Hello World");
    \`\`\`
    - This sentence is a little long<br>这语句有点长
- C
  - \`\`\`c
    printf("Hello World");
    \`\`\`
    - The raw C output<br>原始的C输出
- C++
  - \`\`\`cpp
    std::cout<<"Hello Wrold";
    // <<std::end;
    \`\`\`
    - Stream output, but this thing has a high performance overhead<br>
      流输出，但是这东西开销大
      > - newline：\`<<std::end;\`
      > - 换行: \`<<std::end;\`
- Python
  - \`\`\`python
    print("Hello World")
    \`\`\`
      - Note that Python2 and Python3 have different print statements<br>需要注意一下Python2和Python3的打印语句不同
        |python2|python3|
        |---|---|
        |\`print ""\`|\`print("")\`|
- JavaScript
  - \`\`\`js
    console.log("Hello World");
    \`\`\`
      - Console printing<br>控制台打印
`,
//
'table+transposition (扩展表格+转置)': `\
## demo1

|*a*|*b*|
|:--|:--|
| c | d |

转置

[trs]

|*a*|*b*|
|---|---|
| c | d |

## demo2

[table]

- 1
  - 2 | _
  - 3
    - 3.1
    - 3.2
- 4
  - 5
  - 6

转置

[table|trs]

- 1
  - 2 | _
  - 3
    - 3.1
    - 3.2
- 4
  - 5
  - 6

## demo3

[exTable]

|*A*| < | a |
|---|---|---|
| 1 | 2 | ^ |

转置

[trs|exTable]

|*A*|<| a |
|---|---|---|
| 1 | 2 |^|

## demo4

[exTable]

|*A*| < | a |
|---|---|---|
| ^ | ^ | b |
| 1 | 2 | 3c|

转置

[trs|exTable]

|*A*| < | a |
|---|---|---|
| ^ | ^ | b |
| 1 | 2 | 3c|

## 其他

(TODO \`exTable + trs\` 顺序反过来会有问题，有空研究下)

[exTable|trs]

|*A*|<| a |
|---|---|---|
| 1 | 2 |^|
`,
//
'mdit (markdown-it-container形式的语法块)': `\
## 八种选择器

我把 markdown 中 “选择一段范围” 的方式分为8种，其中 AnyBlock 支持七种选择器。

这些选择器各有优缺点

详见: 

- en: [Selector](https://lincdocs.github.io/AnyBlock/docs/en/03.%20Selector.html)
- zh: [选择器](https://lincdocs.github.io/AnyBlock/docs/zh/03.%20%E9%80%89%E6%8B%A9%E5%99%A8.html)

这里介绍传统的代码块选择器、以及 markdown-it-container 选择器

## 代码块选择器

\`\`\`anyblock
[蓝字]

It is blue color text
\`\`\`

\`\`\`anyblock
[table]

- It is a **multicross table**
  - fork1
  - fokr2
\`\`\`

## markdown-it-container

注意：

- 该选择器在 vuepress 中由 markdown-it-container 以及基于该插件的其他插件提供功能。
- 仅在 obsidian、该App在线版本中，才由 anyblock 插件提供功能

:::col|width(25,50,25)

@col

text1

@col

text2

@col

text3

:::


:::tab

@tab title1

text1

@tab title2

text2

@tab title3

text3

:::

:::card

@card card1

text1

@card card2
 
text2

:::
`,
//
'plantuml': `
## pumlMindmap (puml思维导图)

[list2pumlMindmap]

- vue-demo/
	- build/
	- config/
	- node_modules/
	- src/
		- assets/
			- a/
				- b
		- components
		- App.vue
		- main.js
	- static/
	- test/

## pumlWBS (puml工作分解图)

[list2pumlWBS]

- vue-demo/
  - build/
  - config/
  - node_modules/
  - src/
    - < assets/
      - < a
        - b
        - < c
      - d
      - e
    - components
    - App.vue
    - main.js
  - static/
  - test/

## ActivityDiagram (活动图)

[list2pumlActivityDiagram]

- lane l1:
  - group g1:
    - if condition a:
      - a branch
    - elif condition b:
      - b branch
    - else:
      - else branch
  - switch flag11:
      - case flag12:
          - flag13
      - case flag14:
          - flag15
      - default:
          - flag16
- lane l2:
  - print('loop start')
  - while loop condition:
    - loop body
  - print('loop end')
- lane l1:

语法类似python，用代码块转成列表再转换也是可以的

[code2list|list2pumlActivityDiagram]

\`\`\`python
lane l1:
  group g1:
    if condition a:
      a branch
    elif condition b:
      b branch
    else:
      else branch

  switch flag11:
      case flag12:
          flag13
      case flag14:
          flag15
      default:
          flag16

lane l2:
  print('loop start')
  while loop condition:
    loop body
  print('loop end')

lane l1:
\`\`\`

其中可以用region注释来表示缩进 (region注释是一种多语言通用的语法，在多种IDE上均支持)

[code2list|list2pumlActivityDiagram]

\`\`\`python
#region lane l1:
#region group g1:
if condition a:
  a branch
elif condition b:
  b branch
else:
  else branch
#endregion

switch flag11:
  case flag12:
    flag13
  case flag14:
    flag15
  default:
    flag16

#region lane l2:
  print('loop start')
  while loop condition:
    loop body
  print('loop end')
#endregion

lane l1:
\`\`\`

仅生成对应文本

[code2list|list2pumlActivityDiagramText|code(js)]

\`\`\`python
lane l1:
  group g1:
    if condition a:
      a branch
    elif condition b:
      b branch
    else:
      else branch

  switch flag11:
      case flag12:
          flag13
      case flag14:
          flag15
      default:
          flag16

lane l2:
  print('loop start')
  while loop condition:
    loop body
  print('loop end')

lane l1:
\`\`\`
`
}
