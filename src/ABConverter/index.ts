/**
 * - obsidian版的，那么index.ts是入口函数
 * - mdit版的，那么index_mdit.ts是入口函数
 */

// 转换器模块
export { ABConvertManager } from "./ABConvertManager"
export {} from "./converter/abc_list"
export {} from "./converter/abc_c2list"
export {} from "./converter/abc_table"
export {} from "./converter/abc_dir_tree"
export {} from "./converter/abc_deco"
export {} from "./converter/abc_ex"
export {} from "./converter/abc_mdit_container"

// 定义环境条件
import { ABCSetting } from "./ABReg"
ABCSetting.env = "obsidian"
