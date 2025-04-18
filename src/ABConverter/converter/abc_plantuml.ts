/**
 * 转换器_目录树
 * 
 * md_str <-> md_str
 * md_str <-> html
 */

import {ABConvert_IOEnum, ABConvert, type ABConvert_SpecSimp} from "./ABConvert"
import {ABConvertManager} from "../ABConvertManager"
import {ListProcess, type List_ListItem} from "./abc_list"

import plantumlEncoder from "plantuml-encoder"

const abc_list2jsontext = ABConvert.factory({
  id: "json2pumlJson",
  name: "json到可视化",
  process_param: ABConvert_IOEnum.text,
  process_return: ABConvert_IOEnum.el,
  process: (el, header, content: string): HTMLElement=>{
    content = "@startjson\n" + content + "\n@endjson\n"
    render_pumlText(content, el)
    return el
  }
})


const abc_list2ActivityDiagramText = ABConvert.factory({
	id: "list2pumlActivityDiagramText",
	name: "列表到puml活动图文本",
	process_param: ABConvert_IOEnum.text,
	process_return: ABConvert_IOEnum.text,
	process: (el, header, content: string): string => {
		return list2ActivityDiagramText(ListProcess.data2strict(ListProcess.list2data(content)))
	}
})

const abc_list2ActivityDiagram = ABConvert.factory({
	id: "list2pumlActivityDiagram",
	name: "列表到puml活动图",
	process_param: ABConvert_IOEnum.text,
	process_return: ABConvert_IOEnum.el,
	process: (el, header, content: string): HTMLElement => {
		const puml = list2ActivityDiagramText(ListProcess.data2strict(ListProcess.list2data(content)))
		render_pumlText(puml, el)
		return el
	}
})

const abc_list2pumlWBS = ABConvert.factory({
  id: "list2pumlWBS",
  name: "列表到puml工作分解结构",
  process_param: ABConvert_IOEnum.text,
  process_return: ABConvert_IOEnum.el,
  process: (el, header, content: string): HTMLElement=>{
    let listdata:List_ListItem = ListProcess.list2data(content)
    listdata = ListProcess.data2strict(listdata)
    let newContent = "@startwbs\n"
    for (let item of listdata) {
      if (item.content.startsWith("< "))
        newContent += "*".repeat(item.level+1) + "< " + item.content.slice(2,) + "\n"
      else
        newContent += "*".repeat(item.level+1) + " " + item.content + "\n"
    }
    newContent += "@endwbs"

    render_pumlText(newContent, el)
    return el
  }
})

const abc_list2pumlMindmap = ABConvert.factory({
  id: "list2pumlMindmap",
  name: "列表到puml思维导图",
  process_param: ABConvert_IOEnum.text,
  process_return: ABConvert_IOEnum.el,
  process: (el, header, content: string): HTMLElement=>{
    let listdata:List_ListItem = ListProcess.list2data(content)
    listdata = ListProcess.data2strict(listdata)
    let newContent = "@startmindmap\n"
    for (let item of listdata) {
      newContent += "*".repeat(item.level+1) + " " + item.content + "\n"
    }
    newContent += "@endmindmap"

    render_pumlText(newContent, el)
    return el
  }
})

async function render_pumlText(text: string, div: HTMLElement) {
    // 1. 四选一。自己渲 (优缺点见abc_mermaid的相似方法)
    // 当前mdit和ob使用
    var encoded = plantumlEncoder.encode(text)
    let url = 'http://www.plantuml.com/plantuml/img/' + encoded
    div.innerHTML = `<img src="${url}">`

    // 2. 四选一。这里给环境渲染 (优缺点见abc_mermaid的相似方法)
    //ABConvertManager.getInstance().m_renderMarkdownFn("```plantuml\n"+text+"```", div)

    // 3. 四选一。这里不渲，交给上一层让上一层渲 (优缺点见abc_mermaid的相似方法)
    //div.classList.add("ab-raw")
    //div.innerHTML = `<div class="ab-raw-data" type-data="plantuml" content-data='${text}'></div>`

    // 4. 四选一。纯动态/手动渲染 (优缺点见abc_mermaid的相似方法)
    // ...

    return div
}

function list2ActivityDiagramText(listdata: List_ListItem): string {
  let result = "@startuml\n";
  const {result: bodyResult} = processBody(listdata, 0, -1);
  const swimLanes = bodyResult.split("\n").filter(line => line.startsWith("|") && line.endsWith("|"));
  if (swimLanes.length > 0) {
    result += swimLanes.join("\n");
	result += "\n";
  }
  result += "start\n";
  result += bodyResult;
  result += "end\n";
  result += "@enduml";
  return result;
}

const KEYWORD_IF = "if "
const KEYWORD_SWITCH = "switch "
const KEYWORD_WHILE = "while "
const KEYWORD_GROUP = "group "
const KEYWORD_PARTITION = "partition "
const KEYWORD_LANE = "lane "
const KEYWORD_ELSE = "else"
const KEYWORD_ELIF = "elif "
const KEYWORD_CASE = "case "
const BLOCK_END = ":"

// Process main content, recursively process all items
function processBody(listdata: List_ListItem, startIndex: number, parentLevel: number): { result: string, nextIndex: number } {
	let result = "";
	let i = startIndex;

	const statementTypes = {
		[KEYWORD_IF]: processIfStatement,
		[KEYWORD_SWITCH]: processSwitchStatement,
		[KEYWORD_WHILE]: processWhileStatement,
		[KEYWORD_GROUP]: processGroupStatement,
		[KEYWORD_PARTITION]: processPartitionStatement,
		[KEYWORD_LANE]: processSwimLane
	};

	while (i < listdata.length && (parentLevel === -1 || listdata[i].level > parentLevel)) {
		const item = listdata[i];
		const content = item.content.trim();
		const level = item.level;

		if (isReservedWord(content)) {
			result += content + "\n";
			i++;
			continue;
		}

		let processed = false;
		for (const [prefix, processor] of Object.entries(statementTypes)) {
			if (content.startsWith(prefix) && content.endsWith(BLOCK_END)) {
				const { result: processedResult, nextIndex } = processor(listdata, i, level);
				result += processedResult;
				i = nextIndex;
				processed = true;
				break;
			}
		}

		if (processed) continue;

		if (content.length > 0) {
			result += `:${content};` + "\n";
		}
		i++;
	}

	return { result, nextIndex: i }
}

// 判断是否为保留字
function isReservedWord(content: string): boolean {
	return content === "start" || content === "stop" || content === "kill" ||
		content === "detach" || content === "break" || content === "end" ||
		content === "fork" || content === "fork again" || content === "end fork" ||
		content === "end merge";
}

function isBlockOfType(content: string, type: string): boolean {
	return content.startsWith(type) && content.endsWith(BLOCK_END);
}

function takeTagOfBlock(content: string, type: string): string {
	const condition = content.substring(type.length, content.length - BLOCK_END.length).trim();
	return condition;
}

// 处理if语句
function processIfStatement(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	let result = KEYWORD_IF + " ";
	const content = listdata[index].content.trim();
	const condition = takeTagOfBlock(content, KEYWORD_IF);
	let nextIndex = index + 1;

	if (nextIndex < listdata.length && listdata[nextIndex].level === level + 1) {
		result += `(${condition}) then (yes)\n`;
		const { result: result2, nextIndex: nextIndex2 } = processBody(listdata, nextIndex, level);
		result += result2;
		nextIndex = nextIndex2;
	}

	// Process else and else if branches
	while (nextIndex < listdata.length && listdata[nextIndex].level === level && (isBlockOfType(listdata[nextIndex].content.trim(), KEYWORD_ELIF) || isBlockOfType(listdata[nextIndex].content.trim(), KEYWORD_ELSE))) {
		const branch = listdata[nextIndex].content.trim();
		if (isBlockOfType(branch, KEYWORD_ELIF)) {
			const condition = takeTagOfBlock(branch, KEYWORD_ELIF);
			result += `else if(${condition}) then (yes)\n`;
		} else if (isBlockOfType(branch, KEYWORD_ELSE)) {
			result += `else\n`;
		}
		const { result: result2, nextIndex: nextIndex2 } = processBody(listdata, nextIndex + 1, level);
		result += result2;
		nextIndex = nextIndex2;
	}

	result += "endif\n";
	return { result, nextIndex };
}

// 处理switch语句
function processSwitchStatement(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	let result = KEYWORD_SWITCH + " ";
	const content = listdata[index].content.trim();
	const condition = takeTagOfBlock(content, KEYWORD_SWITCH);
	let nextIndex = index + 1;

	result += `(${condition})\n`;

	// Process case statements
	while (nextIndex < listdata.length && listdata[nextIndex].level > level) {
		if (isBlockOfType(listdata[nextIndex].content.trim(), KEYWORD_CASE)) {
			const caseTag = takeTagOfBlock(listdata[nextIndex].content, KEYWORD_CASE);
			result += `case (${caseTag})\n`;
			nextIndex++;
			const { result: caseResult, nextIndex: caseNextIndex } = processBody(listdata, nextIndex, level + 1);
			result += indentContent(caseResult);
			nextIndex = caseNextIndex;
		} else {
			nextIndex++;
		}
	}

	result += "endswitch\n";
	return { result, nextIndex };
}

// 处理while语句
function processWhileStatement(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	const content = listdata[index].content.trim();
	const condition = takeTagOfBlock(content, KEYWORD_WHILE);
	let result = `${KEYWORD_WHILE} (${condition}) is (true)\n`;
	let nextIndex = index + 1;

	// Process while body
	const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(listdata, nextIndex, level);
	result += indentContent(bodyResult);
	nextIndex = bodyNextIndex;

	result += "endwhile\n";
	return { result, nextIndex };
}

// 处理group语句
function processGroupStatement(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	const content = listdata[index].content.trim();
	const groupName = takeTagOfBlock(content, KEYWORD_GROUP);
	let result = `${KEYWORD_GROUP} ${groupName}\n`;
	let nextIndex = index + 1;

	// Process group body
	const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(listdata, nextIndex, level);
	result += indentContent(bodyResult);
	nextIndex = bodyNextIndex;

	result += "endgroup\n";
	return { result, nextIndex };
}

// 处理partition语句
function processPartitionStatement(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	const content = listdata[index].content.trim();
	const partitionName = takeTagOfBlock(content, KEYWORD_PARTITION);
	let result = `${KEYWORD_PARTITION} ${partitionName} {\n`;
	let nextIndex = index + 1;

	// Process partition body
	const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(listdata, nextIndex, level);
	result += indentContent(bodyResult);
	nextIndex = bodyNextIndex;

	result += "}\n";
	return { result, nextIndex };
}

// 处理swim lane
function processSwimLane(listdata: List_ListItem, index: number, level: number): { result: string, nextIndex: number } {
	const content = listdata[index].content.trim();
	const laneName = takeTagOfBlock(content, KEYWORD_LANE);
	return { result: "|" + laneName + "|\n", nextIndex: index + 1 };
}

// 为内容添加缩进
function indentContent(content: string): string {
	return content.split('\n').map(line => "  " + line).join('\n');
}