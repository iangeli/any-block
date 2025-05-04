import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    // key 输出文件名 (不带扩展名)，value 入口文件路径
    "mdit-any-block": "./index.ts"
  },
  outDir: 'dist',
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'markdown-it', 'jsdom'
  ]
});
