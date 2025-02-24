// 相较于文档版，这里能放的内容更多

export const preset_map = {
//
'Normal markdown': `\
this is ~~a~~ **MarkDown** *test*

- a
	a2
	- b
	- c
	- d
`,
//
'list2table (列表转多叉表格)': `\
# list2table (列表转多叉表格)

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
	- Chrysanthemum<br> 菊花 | Chamomile<br> 甘菊`,
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
`
}
