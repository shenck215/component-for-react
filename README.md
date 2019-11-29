<div align="center">
  React UI 组件库
</div>

## 使用

- 一次引入完整样式

```js
import React from "react"
import { HelloWorld } from "@xbzoom/react-component"
import "@xbzoom/react-component/dist/xbzoom.min.css"
```

- 按需加载: 手动加载样式模块

```js
import React from "react"
import { HelloWorld } from "@xbzoom/react-component"
import "@xbzoom/react-component/lib/HelloWorld/style"
```

- 按需加载: 通过 babel-plugin-import 实现

```js
// babel babel-plugin-import 插件配置： 创建多个 babel-plugin-import 实例
module.exports = {
  plugins: [
    ["babel-plugin-import", {
      libraryName: "@xbzoom/react-component",
      libraryDirectory: "es",
      camel2DashComponentName: false, // 是否需要驼峰转短线
      camel2UnderlineComponentName: false, // 是否需要驼峰转下划线
      style: true, // 动态加载相应组件的样式,'css'取css.js，true取index
    },'@xbzoom/react-component'],
  ]
}
```

```js
// 按需引入组件
import React from "react"
import { HelloWorld } from "@xbzoom/react-component"
```

## 本地开发

- 运行开发环境

```shell
npm install
npm start
```

- 编译 npm 包

```shell
npm run build
```

- 发布 npm 包

```shell
npm run pub
```