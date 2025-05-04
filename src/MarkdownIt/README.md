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
import { ab_mdit, jsdom_init } from "markdown-it-any-block"
jsdom_init() // 如果模块根部有直接使用的，可能要改成 await jsdom_init() 同步操作

...

const userConfig: UserConfig = {
  extendsMarkdown: (md: markdownit) => {
    md.use(ab_mdit)
  }
}
```

> [!WARNING]
> 
> 注意，构建出来的只有对应的dom结构，而没有样式。因为纯markdown-it插件是不含样式的（除非用内联样式），自己引用一下就好
> 
> 对应的样式位置，例如在scss中：
> `@import '../../../node_modules/markdown-it-any-block/styles.css'`

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

## 服务端渲染与客户端渲染

其中，如果你想部署静态文档，并使用 anyblock 提前渲染好对应的结果，
那么你需要执行 `jsdom_init()`，像前面教程中说到的那样。

又或者，你可能想二次封装该 markdown-it 插件，让其在客户端渲染，
那么你无需使用虚拟dom模块，即无需执行 `jsdom_init()`
