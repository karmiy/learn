## VSCode 帮助文档

### 设置文件树水平 tab 间距：

```text
setting => 搜索 tree => 找到 Workbench Tree: Indent   Controls tree indentation in pixels. => 改为25
```

### 快捷键

- 批量保存文件：Ctrl + K => S

- 复制当前行：Shift + Alt + ↑↓

- 上下移动当前行：Alt + ↑↓

- 块注释：Shift + Alt + A

- 删除行：Ctrl + Shift + K

- 打开新 VSCode 窗口：Ctrl + Shift + N

- 选中后同时编辑全体选中项：Ctrl + Shift + L

- 格式化代码：Alt + Shift + F

- 展开代码块：Ctrl + K => Ctrl + J

### 插件

- Vue：

    - vetur：识别 vue 模板

    - vue-helper：Ctrl template 上的变量可索引

### 配置

```json
{
    "workbench.tree.indent": 16,
    "prettier.tabWidth": 4,
    "editor.detectIndentation": false,
    "vetur.format.defaultFormatter.html": "prettyhtml",
    "vetur.format.defaultFormatterOptions": {
        "prettyhtml": {
            "tabWidth": 4,
        }
    },
    "vetur.format.options.tabSize": 4,
    "vetur.format.options.useTabs": false,
    "vetur.format.defaultFormatter.css": "prettier",
    "vetur.format.defaultFormatter.postcss": "prettier",
    "vetur.format.defaultFormatter.scss": "prettier",
    "vetur.format.defaultFormatter.sass": "sass-formatter",
    "vetur.format.defaultFormatter.less": "prettier",
    "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
    "vetur.format.defaultFormatter.js": "prettier",
    "vetur.format.defaultFormatter.ts": "prettier",
}
```