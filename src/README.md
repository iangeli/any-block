# README

## 目录结构

该文件夹下的文件夹说明：

- ABConverter/  | 共用部分 (核心) (Core)
- Obsidian/     | Obsidian专用部分
- App/          | App 版本专用部分
- MarkdownIt/   | MarkdownIt 专用部分 (主要是vuepress/vitepress用)

具体查看各个文件夹下的 README 文件

## 编译

可以参考github工作流文件: `/.github/workflows/nodejs-build.yml`

单独编译某一版本：

核心模块

```bash
pnpm install      # monorepo，会自动 install 子包的依赖

pnpm ob:build     # 编译ob版本，或 pnpm run ob:build
pnpm ob:build-min # v3.2.1 新增min版本的工作流

pnpm app:dev      # app版本的开发调试，也可以 cd src/App 后运行 pnpm run dev
pnpm app:build    # app版本的构建，也可以 cd src/App 后运行 pnpm run build

pnpm mdit:build   # markdown-it版本的构建 (已上传npm)
```
