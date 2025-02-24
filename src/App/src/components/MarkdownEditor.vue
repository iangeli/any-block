<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  mdData: any
}>()
</script>

<template>
  <textarea class="ab-app-editor" v-model="mdData.string"></textarea>
</template>

<style lang="scss" scoped>
.ab-app-editor {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  margin: 0;

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
