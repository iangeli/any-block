/**
 * 钩子入口
 * 
 * 总逻辑梳理
 * mermaid
 * - 状态管理器 : 用来设置状态的
 *   - 范围管理器 (全文文本构造) interface SpecKeyword : 一个文档有多个范围管理器
 *     - 装饰管理器 (传入范围管理器) / 替换管理器 : 一个子范围管理器有多个范围，每个范围可以使用的装饰不同
 * 
 * 流程：
 * - 选择范围
 */

import {EditorView, Decoration, type DecorationSet} from "@codemirror/view"
import {StateField, StateEffect, EditorState, EditorSelection, Transaction, Range} from "@codemirror/state"
import  {MarkdownView, type View, type Editor, type EditorPosition} from 'obsidian';

import type AnyBlockPlugin from '../../main'
import { ConfDecoration } from "../../config/ABSettingTab"
import { autoMdSelector, type MdSelectorRangeSpec} from "./ABSelector_Md"
import { ABDecorationManager } from "./ABDecorationManager"
import { ABReplacer_Widget } from "./ABReplacer_Widget"
import { abConvertEvent } from "src/ABConverter/ABConvertEvent";

// 获取 - 模式
enum Editor_mode{
  NONE,         // 获取失败
  SOURCE,       // 源码模式
  SOURCE_LIVE,  // 实时模式
  PREVIEW,      // 阅读模式
}

let once_flag = false // 保证css的添加只会被触发一次，避免重复添加css。ture为已经触发过了
let global_timer: NodeJS.Timer|null = null // 定时器，单例

/**
 * 状态管理器
 * 
 * @default
 * 启用状态字段装饰功能
 * RAII原则，一次性使用
 */
export class ABStateManager{

  /** --------------------------------- 主要参数 -------------------------- */

  plugin_this: AnyBlockPlugin
  replace_this = this
  view: View                // Ob View
  editor: Editor            // Ob Editor
  editorView: EditorView    // CM View
  editorState: EditorState  // CM State
  initialFileName: String   // 固定为构造时的名字

  // 用于防止频繁刷新
  // 若 true->true/false->false，不大刷新，仅局部刷新
  // 若 false->true/true->false，大刷新
  is_prev_cursor_in:boolean
  prev_decoration_mode:ConfDecoration
  prev_editor_mode:Editor_mode

  // get cursor(): EditorPosition {return this.editor.getCursor();}
  // get state(): any {return this.view.getState()}
  // get mdText(): string {return this.editor.getValue()}

  /** --------------------------------- 特殊函数 -------------------------- */

  constructor(plugin_this: AnyBlockPlugin){
    this.plugin_this=plugin_this
    // 因为打开文档会触发，所以后台打开的文档会return false，聚焦到一个非文件的新标签页也会return false
    let ret = this.constructor_init()

    if (this.plugin_this.settings.is_debug) console.log(">>> ABStateManager, initialFileName:", this.initialFileName, "initRet:", ret)

    if (ret) this.setStateEffects()

    // 后处理钩子 (在页面加载后被触发/定时触发)
    {
      if (global_timer !== null) { clearInterval(global_timer); global_timer = null; }
      if (plugin_this.settings.is_enhance_refresh) {
        global_timer = setInterval(() => {
          if (plugin_this.settings.is_debug) console.log("    auto refresh event:", this.initialFileName)
          abConvertEvent(document, true)
        }, 1000)
      }
    }
    abConvertEvent(document)
  }

  // 设置常用变量
  private constructor_init() {
    const view: View|null = this.plugin_this.app.workspace.getActiveViewOfType(MarkdownView); // 未聚焦(active)会返回null
    if (!view) return false
    this.view = view
    // @ts-ignore 这里会说View没有file属性
    this.initialFileName = this.view.file.basename
    // @ts-ignore 这里会说View没有editor属性
    this.editor = this.view.editor
    // @ts-ignore 这里会说Editor没有cm属性
    this.editorView = this.editor.cm
    this.editorState = this.editorView.state

    this.is_prev_cursor_in = true
    this.prev_decoration_mode = ConfDecoration.none
    this.prev_editor_mode = Editor_mode.NONE
    return true
  }

  destructor() {
    if (this.plugin_this.settings.is_debug) console.log("<<< ABStateManager, initialFileName:", this.initialFileName)
    if (global_timer !== null) { clearInterval(global_timer); global_timer = null; }
  }

  /** --------------------------------- CM 函数 -------------------------- */

  // 设置初始状态字段并派发
  private setStateEffects() {
    let stateEffects: StateEffect<unknown>[] = []
  
    /**
     * 修改StateEffect1 - 加入StateField、css样式
     * 当EditorState没有(下划线)StateField时，则将该(下划线)状态字段 添加进 EditorEffect中
     *    （函数末尾再将EditorEffect派发到EditorView中）。
     * 就是说只会在第一次时执行，才会触发
     * 
     * TODO fix 后来发现不是第一次也会触发，导致被添加了很多冗余重复的css，所以加了once_flag判定。按理说应该是判断里面有没有某些css会比较稳妥
     */
    if (!this.editorState.field(this.decorationField, false)) {
      stateEffects.push(StateEffect.appendConfig.of(
        [this.decorationField] 
      ))
      if (!once_flag) {
        once_flag = true
        stateEffects.push(StateEffect.appendConfig.of(
          [ABDecorationManager.decoration_theme()]
        ))
      }
    }
  
    // 派发
    this.editorView.dispatch({effects: stateEffects})
    return true
  }

  /** 一个类成员。StateField，该状态管理Decoration */
  private decorationField = StateField.define<DecorationSet>({
    create: (editorState)=>{return Decoration.none},
    // create好像不用管，update无论如何都能触发的
    // 函数的根本作用，是为了修改decorationSet的范围，间接修改StateField的管理范围
    update: (decorationSet, tr)=>{
      return this.onUpdate(decorationSet, tr)
    },
    provide: f => EditorView.decorations.from(f)
  })

  /** --------------------------------- on更新事件 ------------------------- */

  // on update, to updateStateField
  private onUpdate (decorationSet:DecorationSet, tr:Transaction){    
    // 如果没有修改就不管了（点击编辑块的按钮除外）
    // if(tr.changes.empty) return decorationSet

    // 1. 准备，获取 - 编辑器模式、装饰选项、选择器选项
    let editor_mode: Editor_mode = this.getEditorMode()
    let decoration_mode:ConfDecoration
    if(editor_mode==Editor_mode.SOURCE) {
      decoration_mode = this.plugin_this.settings.decoration_source
    }
    else if(editor_mode==Editor_mode.SOURCE_LIVE) {
      decoration_mode = this.plugin_this.settings.decoration_live
    }
    else {
      decoration_mode = this.plugin_this.settings.decoration_render
    }

    // 2. 解析、并装饰调整匹配项（删增改），包起来准备防抖（未防抖）
    // let refreshStrong = this.onUpdate_refresh.bind(this)
    return this.onUpdate_refresh(decorationSet, tr, decoration_mode, editor_mode)
  }

  /**
   * 装饰调整（删增改），包起来准备防抖 
   * 小刷新：位置映射（每次都会刷新）
   * 大刷新：全部元素删掉再重新创建（避免频繁大刷新）
   * _
   * 大刷新的条件：
   *   - 当鼠标进出范围时
   *   - 当装饰类型改变时
   *   - 当切换编辑模式时
   * 
   * @param decorationSet 装饰集
   * @param tr 此次更新的修改内容
   * @param decoration_mode 如何装饰 (源md or 下划线 or 渲染成ab块)
   * @param editor_mode 编辑器模式 (源码/实时/阅读)
   */
  private onUpdate_refresh(decorationSet:DecorationSet, tr:Transaction, decoration_mode:ConfDecoration, editor_mode:Editor_mode){
    // #region 不查了
    if (decoration_mode==ConfDecoration.none) {
      // 大刷新，全文刷新，全清空掉再重新赋予
      if (decoration_mode!=this.prev_decoration_mode){
        decorationSet = decorationSet.update({
          filter: (from, to, value)=>{return false}
        })
        this.is_prev_cursor_in = true
        this.prev_decoration_mode = decoration_mode
        this.prev_editor_mode = editor_mode
      }
      // 不刷新
      else {}
      return decorationSet
    }
    // #endregion

    // 重新检测范围集
    const list_rangeSpec:MdSelectorRangeSpec[] = autoMdSelector(this.getMdText(tr))

    // #region 根据范围集，进行局部刷新
    const cursorSpec = this.getCursorCh(tr) // 将来光标的位置 (光标移动后的位置)
    let cursorSepc_correct:number|null = null // 需要纠正的光标位置 (必须在应用完tr后再纠正，避免被覆盖)
    let list_add_decoration:Range<Decoration>[] = [] // 规则表
    let is_current_cursor_in = false // 当前光标是否在ab块区域内
    for (let rangeSpec of list_rangeSpec){
      let decoration: Decoration
      // 当前光标位于该ab区域内，则该ab区域显示为下划线装饰
      if (cursorSpec.from>=rangeSpec.from_ch && cursorSpec.from<=rangeSpec.to_ch
          || cursorSpec.to>=rangeSpec.from_ch && cursorSpec.to<=rangeSpec.to_ch
      ) {
        decoration = Decoration.mark({class: "ab-line-yellow"}) // TODO fix bug：当光标在局部频繁移动时或其他情况? 这里会被重复添加很多层带这个class的span嵌套
        is_current_cursor_in = true
        // 纠正光标位置
        // const cursorSpec_last = this.getCursorCh() // 过去光标的位置 (光标移动前的位置)
        // if (cursorSpec.from==rangeSpec.from_ch && cursorSpec_last.from>rangeSpec.to_ch) {
        //   cursorSepc_correct = rangeSpec.to_ch
        // }
      }
      // 当前光标不位于该ab区域内，则该ab区域显示为渲染的ab块
      else{
        decoration = Decoration.replace({
          widget: new ABReplacer_Widget(rangeSpec, this.editor),
          // inclusive: true, block: false,
        })
      }
      list_add_decoration.push(decoration.range(rangeSpec.from_ch, rangeSpec.to_ch))
    }
    // console.log(`光标位置改变-----`,
    //   '\n    光标是否在位置集中: ', is_current_cursor_in,
    //   '\n    新位置', cursorSpec,
    //   '\n    位置集', list_rangeSpec,
    //   '\n    样式集', list_add_decoration.length, list_add_decoration,
    //   '\n    修改内容tr', tr.changes, tr
    // )
    // #endregion

    // #region 光标进出范围集事件检测
    if (is_current_cursor_in!=this.is_prev_cursor_in
      ||decoration_mode!=this.prev_decoration_mode
      ||editor_mode!=this.prev_editor_mode
    ){
      this.is_prev_cursor_in = is_current_cursor_in
      this.prev_decoration_mode = decoration_mode
      this.prev_editor_mode = editor_mode

      // 装饰调整 - 删
      decorationSet = decorationSet.update({            // 减少，全部删掉
        filter: (from, to, value)=>{return false}
      })
      // 装饰调整 - 增
      // 这里有点脱屁股放屁，但好像因为范围重叠的原因，直接传列表会报错：
      // Ranges must be added sorted by `from` position and `startSide`
      for(let item of list_add_decoration){
        decorationSet = decorationSet.update({
          add: [item]
        })
      }
      // #endregion
    }

    // 装饰调整 - 改 (映射)
    decorationSet = decorationSet.map(tr.changes)
    return decorationSet
  }

  /** --------------------------------- 一些小工具 ------------------------- */

  /**
   * 获取编辑器模式
   */ 
  private getEditorMode(): Editor_mode {
    let editor_dom: Element | null
    /** @warning 不能用 editor_dom = document
     * 再editor_dom = editor_dom?.getElementsByClassName("workspace-tabs mod-top mod-active")[0];
     * 用document的话不知道为什么总是有属性is-live-preview的，总是认为是实时模式 
     */
    // 类型“WorkspaceLeaf”上不存在属性“containerEl”
    // 这里不能用getActiveViewOfType(MarkdownView)，好像那个无法判断编辑器模式是源还是实时
    // @ts-ignore
    editor_dom = this.plugin_this.app.workspace.activeLeaf.containerEl
    if (!editor_dom) {
      console.warn("无法获取dom来得知编辑器模式"); 
      return Editor_mode.NONE; 
    }
    editor_dom = editor_dom?.getElementsByClassName("workspace-leaf-content")[0]
    let str = editor_dom?.getAttribute("data-mode")
    if (str=="source") {
      editor_dom = editor_dom?.getElementsByClassName("markdown-source-view")[0]
      if(editor_dom?.classList.contains('is-live-preview')) return Editor_mode.SOURCE_LIVE
      else return Editor_mode.SOURCE
    }
    else if (str=="preview"){
      return Editor_mode.PREVIEW  // 但其实不会判定，因为实时是不触发update方法的
    }
    else {
      /*console.warn("无法获取编辑器模式，可能会产生BUG");*/ 
      return Editor_mode.NONE;
    } // 点一下编辑器再点其他布局位置，就会发生
  }

  /**
   * 获取光标位于全文第几个字符
   * 
   * @param tr 如果有tr参数，则计算通过修改后光标将会在什么位置
   */
  private getCursorCh(tr?: Transaction) {
    const ranges = tr?.state?.selection?.ranges
    if (ranges && ranges.length==1) { // 有tr，且单光标
      return {
        from: ranges[0].from,
        to: ranges[0].to
      }
    }

    let cursor_from_ch = 0
    let cursor_to_ch = 0
    let list_text: string[] = this.editor.getValue().split("\n")
    for (let i=0; i<=this.editor.getCursor("to").line; i++){
      if (this.editor.getCursor("from").line == i) {cursor_from_ch = cursor_to_ch+this.editor.getCursor("from").ch}
      if (this.editor.getCursor("to").line == i) {cursor_to_ch = cursor_to_ch+this.editor.getCursor("to").ch; break;}
      cursor_to_ch += list_text[i].length+1
    }
    return {
      from: cursor_from_ch, 
      to: cursor_to_ch
    }
  }

  /**
   * 获取当前文本
   * 
   * @param tr 如果有tr参数，则获取修改后的md文本
   */
  private getMdText(tr?: Transaction): string {
    const mdText = tr?.state?.doc?.toString()
    if (mdText) {
      return mdText
    }

    return this.editor.getValue()
  }

  /**
   * 光标位置纠正
   * 
   * 问题导致的原理：
   * 替换后的区间被识别为原子区间（atomic range），CodeMirror 默认会将光标定位到原子区间的开始位置
   * 当使用方向键移动时，光标会跳过整个原子区间
   * 
   * 光标位置修复方案：
   * (使其行为与callout一致，避免光标向上/向下移动时，跨越整个ab块。不过光标向下是正常的)
   * 检测逻辑：向上移动时，从范围外向上移动到范围内且第一格处
   * 缺点1：必须借助setTimeout，否则事件还是会被覆盖
   * 缺点2：光标会连同滚动条一起到达顶端，然后再往段末尾移动，会有问题
   * 
   * 最后解决方法：
   * 最后居然是靠css解决的……以前ab-replace消除cm-widgetBuffer自带的间隙，居然会导致光标移动时跳过cm-widgetBuffer，非常奇怪
   * 把ab-replace的负margin再调整一下，就正常了
   */
  private setPos(cursorSepc: number) {
    setTimeout(() => { // 使用微任务确保在当前事务完成后执行
      // 方式一：EditorSelection
      const newSelection = EditorSelection.create([
        EditorSelection.range(cursorSepc, cursorSepc)
      ])
      this.editorView.dispatch({
        selection: newSelection
      })

      // 方式二：EditorState
      // const newSelection = EditorState.create({}).selection;
      // const tr2 = this.editorState.update({
      //   selection: newSelection,
      //   changes: tr.changes
      // })
      // this.editorView.dispatch(tr2)

      // 方式三
      // 设置光标到第3行第5列（行号从0开始）。打印顺序对，实际光标位置没改变
      // const targetLine = 6;
      // const targetColumn = 2;
      // // 创建新选区
      // const newSelection = EditorState.create({
      //   doc: this.editorView.state.doc,
      //   selection: { anchor: this.editorView.state.doc.line(targetLine + 1).from + targetColumn }
      // });
      // // 通过事务更新视图
      // this.editorView.dispatch({
      //   selection: newSelection.selection,
      //   effects: EditorView.scrollIntoView(newSelection.selection.main.from) // 滚动到光标
      // });

      // 方式四：obsidian editor。打印顺序对，实际光标位置没改变
      // this.editor.setCursor(correct)
      // this.editor.setCursor({ch: 1, line: 6})
    }, 50)
  }

  /** 防抖器（可复用） */
  /*debouncedFn = this.debounce(this.onUpdate_refresh, 1000, false)
  private debounce(
    method:any,       // 防抖方法
    wait:number,      // 等待
    immediate:boolean // 是否立即执行
  ) {
    let timeout:NodeJS.Timeout|null
    // debounced函数为返回值
    // 使用Async/Await处理异步，如果函数异步执行，等待setTimeout执行完，拿到原函数返回值后将其返回
    // args为返回函数调用时传入的参数，传给method
    let debounced = function(...args: any[]) {
      return new Promise (resolve => {
        // 用于记录原函数执行结果
        let result
        // 将method执行时this的指向设为debounce返回的函数被调用时的this指向
        let context = this
        // 如果存在定时器则将其清除
        if (timeout) {
          clearTimeout(timeout)
        }
        // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
        if (immediate) {
          // 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
          // 这样确保立即执行后wait毫秒内不会被再次触发
          let callNow = !timeout
          timeout = setTimeout(() => {
            timeout = null
          }, wait)
          // 如果满足上述两个条件，则立即执行并记录其执行结果
          if (callNow) {
            result = method.apply(context, args)
            resolve(result)
          }
        } else {
          // 如果immediate为false，则等待函数执行并记录其执行结果
          // 并将Promise状态置为fullfilled，以使函数继续执行
          timeout = setTimeout(() => {
            // args是一个数组，所以使用fn.apply
            // 也可写作method.call(context, ...args)
            result = method.apply(context, args)
            resolve(result)
          }, wait)
        }
      })
    }
  
    // 在返回的debounced函数上添加取消方法
    //debounced.cancel = function() {
    //  clearTimeout(timeout)
    //  timeout = null
    //}
  
    return debounced
  }*/
}
