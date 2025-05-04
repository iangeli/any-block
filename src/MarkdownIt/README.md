# AnyBlock MarkdownIt

markdown-it 版本的入口

## markdown-it-any-block 使用

新版 npm 流程

从npm下载并使用：

```bash
$ pnpm install -D markdown-it-any-block@latest
```

使用 (vuepress为例，其他使用markdown-it插件的类似)

`config.ts`

```ts
import { ab_mdit, jsdom_init_ } from "markdown-it-any-block"
jsdom_init_() // 如果模块根部有直接使用的，可能要改成 await jsdom_init_() 同步操作

...

const userConfig: UserConfig = {
  extendsMarkdown: (md: markdownit) => {
    md.use(ab_mdit)
  }
}
```

## 构建

构建就简单的 `pnpm build`

(仅自用) 构建、上传npm:

```bash
# $ pnpm build # 设置了prepublishOnly，不需要先手动编译。但是你可以手动执行这一步，来检查编译是否正常

$ npm adduser  # 先登录，在vscode里他会让我打开浏览器来登录
Username: ...
Password: ...

$ npm publish  # 上传 (注意不要重名、npm账号可能需要邮箱验证)
               # 如果设置了 package.json::script.prepublishOnly，会先执行 (一般是build)
               # 这一步会将当前文件夹内容都上传到npm中名为 `<package.json 里 name@version>` 的包里
               # 如果没有对应包，会自动创建

# or 或
$ npm publish --tag beta  # 如果使用测试或beta版本 (包含 `-tagname`)，如 `-beta` 
                          # 需要 添加 `--tag <tagname>`，如 `--tag beta`
```
