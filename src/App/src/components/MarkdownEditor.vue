<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  mdData: any
}>()

// 准备预设数据
import { preset_map } from "../utils/preset_map.js"
// let preset_map2 = {} // 这里可以放一些其他例子
// preset_map2 = preset_map
// 这里可以补充各种处理器的用例
// (不过我设计上目前把alias和demo都分离出来了，而不耦合在用例中。好处是alias和demo都可以是考虑结合多个处理器的情况)
// import {ABConvertManager} from "../../../ABConverter/ABConvertManager"
// for (let item of ABConvertManager.getInstance().list_abConvert){
//   if (item.hasOwnProperty('demo')) {
//     preset[item.id] = item.demo
//   }
// }

// 事件
function onSelect(event: any) {
  const key = event.target.value
  props.mdData.mdPreset = key
  props.mdData.string = '# ' + key + '\n\n' + preset_map[key]
}
</script>

<template>
  <select class="preset-select" @change="onSelect" :value="mdData.mdPreset">
    <option v-for="(value, key) in preset_map" :key="key" :value="key">{{ key }}</option>
  </select>
  <textarea class="ab-app-editor" spellcheck="false" v-model="mdData.string"></textarea>
</template>

<style lang="scss" scoped>
.preset-select {
  width: 100%;
}
.ab-app-editor {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  margin: 0;

  tab-size: 2;
  white-space: pre;
  border: none;
  padding: 10px;
  overflow-x: auto;
  overflow-y: auto;
  resize: none;
  background-color: #2b2a33;
  color: #eee;
  font-size: 16px;
}
</style>
./preset_map.js/index.js