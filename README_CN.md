[English](./README.md) | 简体中文

qg-tool
==============================


## 功能

- **vue-cli**：可以进行自助生成一个多页面开发的vue项目，无需进行脚手架的修改，但是目前只实现了联网版；
- **母版**：你可以把重复的代码（默认支持`.html`和`.tpl`，你可以在配置中修改，以便支持更多类型）写在母版文件中，然后在主文件里引用母版文件，支持全引用、部分引用以及代码注入（目前正在制作）；

## 安装
因为该项目还没加入到npm中，只能将整个项目拉下然后进行安装
```shell
npm install -g 
```

## 使用

直接在你的项目目录里执行`qgfont <command>`，支持以下`<command>`：

- `-v` 查看bag-tool当前版本。
- `help` 获取帮助。
- `initvue` 初始化vue-cli录以及配置文件。