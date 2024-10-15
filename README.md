## 初始化项目

> 如果你打算启动一个新项目，你可能会发现使用 [create-vue](https://github.com/vuejs/create-vue) 这个脚手架工具更容易，它能创建一个基于 Vite 的项目，并包含加入 Vue Router 的选项：

```node
npm create vue@latest
```

## 其他笔记

### npm的--save和--save-dev的区别

```node
npm i [包名] --save
简写: npm i [包名] -S
```

> 生产阶段的依赖，项目运行时的依赖，程序上线后仍然需要依赖。也就是项目上线运行还需要用到的功能。

```node
npm i [包名] --save-dev
简写: npm i [包名] -D
```

> ​	在开发过程中需要的依赖。也就是项目打包上线后就用不到了，在写项目时才需要。

### 升级 Vite 5 出现警告

[相关文档](https://blog.csdn.net/u013737132/article/details/135462327)
