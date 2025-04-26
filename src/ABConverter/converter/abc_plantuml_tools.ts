import type { List_ListItem, ListItem } from "./abc_list"

type Stat = {
  content: string,
  level: number
};

type ProcessResult = {
  result: string,
  nextIndex: number
};

const KEYWORD_IF = "if "
const KEYWORD_SWITCH = "switch "
const KEYWORD_SWITCH2 = "match "
const KEYWORD_WHILE = "while "
const KEYWORD_GROUP = "group "
const KEYWORD_PARTITION = "partition "
const KEYWORD_LANE = "lane "
const KEYWORD_ELSE = "else"
const KEYWORD_ELIF = "elif "
const KEYWORD_CASE = "case "
const KEYWORD_DEFAULT = "default"
const BLOCK_END = ":"
const INDENT = "  ";

// Process main content, recursively process all items
function processBody(stats: Stat[], startIndex: number, parentLevel: number): ProcessResult {
  let result = "";
  let i = startIndex;

  const statementTypes = {
    [KEYWORD_IF]: processIfStatement,
    [KEYWORD_SWITCH]: processSwitchStatement,
    [KEYWORD_SWITCH2]: processSwitchStatement,
    [KEYWORD_WHILE]: processWhileStatement,
    [KEYWORD_GROUP]: processGroupStatement,
    [KEYWORD_PARTITION]: processPartitionStatement,
    [KEYWORD_LANE]: processSwimLane
  };

  while (i < stats.length && (parentLevel === -1 || stats[i].level > parentLevel)) {
    const stat = stats[i];
    const content = stat.content.trim();
    const level = stat.level;

    if (isReservedWord(content)) {
      result += content + "\n";
      i++;
      continue;
    }

    let processed = false;
    for (const [prefix, processor] of Object.entries(statementTypes)) {
      if (content.startsWith(prefix) && content.endsWith(BLOCK_END)) {
        const { result: processedResult, nextIndex } = processor(stats, i);
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
function processIfStatement(stats: Stat[], index: number): { result: string, nextIndex: number } {
  let result = KEYWORD_IF;
  const stat = stats[index];
  const condition = takeTagOfBlock(stat.content, KEYWORD_IF);
  let nextIndex = index + 1;

  if (nextIndex < stats.length && stats[nextIndex].level > stat.level) {
    result += `(${condition}) then (yes)\n`;
    const { result: result2, nextIndex: nextIndex2 } = processBody(stats, nextIndex, stat.level);
    result += indentContent(result2);
    nextIndex = nextIndex2;
  }

  // Process else and else if branches
  while (nextIndex < stats.length && stats[nextIndex].level === stat.level && (isBlockOfType(stats[nextIndex].content.trim(), KEYWORD_ELIF) || isBlockOfType(stats[nextIndex].content.trim(), KEYWORD_ELSE))) {
    const branch = stats[nextIndex].content.trim();
    if (isBlockOfType(branch, KEYWORD_ELIF)) {
      const condition = takeTagOfBlock(branch, KEYWORD_ELIF);
      result += `else if(${condition}) then (yes)\n`;
    } else if (isBlockOfType(branch, KEYWORD_ELSE)) {
      result += `else\n`;
    }
    const { result: result2, nextIndex: nextIndex2 } = processBody(stats, nextIndex + 1, stat.level);
    result += indentContent(result2);
    nextIndex = nextIndex2;
  }

  result += "endif\n";
  return { result, nextIndex };
}

// 处理switch语句
function processSwitchStatement(stats: Stat[], index: number): { result: string, nextIndex: number } {
  let result = KEYWORD_SWITCH;
  const stat = stats[index];
  const condition = takeTagOfBlock(stat.content, KEYWORD_SWITCH);
  let nextIndex = index + 1;

  result += `(${condition})\n`;

  let hasDefault = false;
  // Process case statements
  while (nextIndex < stats.length && stats[nextIndex].level > stats[index].level) {
    const nextStat = stats[nextIndex];
    if (isBlockOfType(nextStat.content.trim(), KEYWORD_CASE)) {
      const caseTag = takeTagOfBlock(nextStat.content, KEYWORD_CASE);
      result += `case (${caseTag})\n`;
      const { result: caseResult, nextIndex: caseNextIndex } = processBody(stats, nextIndex, stat.level + 1);
      result += indentContent(caseResult);
      nextIndex = caseNextIndex;
    } else if (isBlockOfType(nextStat.content, KEYWORD_DEFAULT)) {
      result += `case (default)\n`;
      hasDefault = true;
      const { result: defaultResult, nextIndex: defaultNextIndex } = processBody(stats, nextIndex, stat.level + 1);
      result += indentContent(defaultResult);
      nextIndex = defaultNextIndex;
    }
    nextIndex++;
  }
  if (!hasDefault) {
    result += "case (default)\n:has no default case;\n";
  }

  result += "endswitch\n";
  return { result, nextIndex };
}

// 处理while语句
function processWhileStatement(stats: Stat[], index: number): { result: string, nextIndex: number } {
  const stat = stats[index];
  const condition = takeTagOfBlock(stat.content, KEYWORD_WHILE);
  let result = `${KEYWORD_WHILE}(${condition}) is (true)\n`;
  let nextIndex = index + 1;

  // Process while body
  const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(stats, nextIndex, stat.level);
  result += indentContent(bodyResult);
  nextIndex = bodyNextIndex;

  result += "endwhile\n";
  return { result, nextIndex };
}

// 处理group语句
function processGroupStatement(stats: Stat[], index: number): { result: string, nextIndex: number } {
  const stat = stats[index];
  const groupName = takeTagOfBlock(stat.content, KEYWORD_GROUP);
  let result = `${KEYWORD_GROUP}${groupName}\n`;
  let nextIndex = index + 1;

  // Process group body
  const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(stats, nextIndex, stat.level);
  result += indentContent(bodyResult);
  nextIndex = bodyNextIndex;

  result += "endgroup\n";
  return { result, nextIndex };
}

// 处理partition语句
function processPartitionStatement(stats: Stat[], index: number): { result: string, nextIndex: number } {
  const stat = stats[index];
  const partitionName = takeTagOfBlock(stat.content, KEYWORD_PARTITION);
  let result = `${KEYWORD_PARTITION}${partitionName} {\n`;
  let nextIndex = index + 1;

  // Process partition body
  const { result: bodyResult, nextIndex: bodyNextIndex } = processBody(stats, nextIndex, stat.level);
  result += indentContent(bodyResult);
  nextIndex = bodyNextIndex;

  result += "}\n";
  return { result, nextIndex };
}

// 处理swim lane
function processSwimLane(stats: Stat[], index: number): { result: string, nextIndex: number } {
  const stat = stats[index];
  const laneName = takeTagOfBlock(stat.content, KEYWORD_LANE);
  return { result: "|" + laneName + "|\n", nextIndex: index + 1 };
}

// 为内容添加缩进
function indentContent(content: string): string {
  return content.split('\n').map(line => INDENT + line).join('\n');
}

export function list2ActivityDiagramText(listdata: List_ListItem): string {
  let result = "@startuml\n";
  const stats = listdata.map(item => {
    return {
      content: item.content.trim(),
      level: item.level,
    }
  });
  const { result: bodyResult } = processBody(stats, 0, -1);
  const swimLanes = bodyResult.split("\n").filter(line => line.startsWith("|") && line.endsWith("|"));
  if (swimLanes.length > 0) {
    result += swimLanes.join("\n");
    result += "\n";
  }
  result += bodyResult;
  result += "@enduml";
  return result;
}
