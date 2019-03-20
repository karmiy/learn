## overflow

- visible（默认值）

- hidden
    
    超出隐藏，经常用于触发BFC

- auto

    内容没有超出则等于visible，超出则scroll滚动条
    
- scroll

    不管有没有超出都有滚动条
    
- inherit
    
    继承父级的overflow（IE不支持）
    
- overflow-x、overflow-y

    水平、垂直方向
    
## 元素类型display

- block 块级元素

    基本特性：独占一行
    
    元素：div、h1-h6、p、ol、ul、li、dl、dt、dd ...
    
    宽高：width默认100%， 可以设置width、height
    
    外边距：默认支持margin
    
    内边距：默认支持padding
    
- inline-block 行内块元素

    基本特性