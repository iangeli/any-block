# README

## 目录结构

该文件夹下的文件夹说明：

- ABConverter/  | 共用部分 (核心) (Core)
- Obsidian/     | Obsidian专用部分
- App/          | App 版本专用部分
- MarkdownIt/   | MarkdownIt 专用部分 (主要是vuepress/vitepress用)

具体查看各个文件夹下的 README 文件

## 编译

```bash
npm run build # 编译ob版本，或 npm run ob:build
npm run ob:build-min # v3.2.1 新增min版本的工作流

npm app:dev   # app版本的开发调试，也可以 cd src/App 后运行 npm run dev
npm app:build # app版本的构建，也可以 cd src/App 后运行 npm run build
```
