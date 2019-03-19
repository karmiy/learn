## CSS层叠样式表

在\<head>中添加\<style type='text/css'>\</style> (内部样式),type可以不写，写了必须是text/css不能写错

    <!DOCTYPE HTML>
    <html>
        <head>
            <meta charset='UTF-8' />
            <title>标题</title>
            <meta name='description' content='描述' />
            <style type='text/css'>
                h1 {
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <h1>HTML基础</h1>
        </body>
    </html>
    
## 盒子模型

- content: 内容
- padding: 内边距(填充物)
- border: 边框(盒子外包装)
- margin: 外边距(盒子与盒子之间的距离)

起名：

1. id: 一个标签只能有一个id，其他标签的id不能与之相同

2. class: 一个标签可以有很多class，其他标签class可以与之相同

命名规则:

1. 严格注意大小写，没有特殊需要请使用小写
 
2. 字母 数字 - _
    
3. 不能以数字 - 开头

4. 见名知意


    <div id='bar'></div>
    <div class='nav'></div>
    

    