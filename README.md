# 基于ES6字符串模板的模板


...持续更新中...

## 优点如下

1. 支持模板嵌套
```html
    <script type="text/template" id='demo1'>
        <div>人员信息</div>
        <div>姓名：${ "\"阿猫"}</div>
        <div>年龄: ${age}</div>
        <hr> ${each(list,render('#list'))}
    </script>

    <script type="text/template" id='date'>
        ${_data_.toJSON()} 'a' -- ${log(_data_,new Date(),[{a:1},1,2,3])} --
    </script>

    <script type="text/template" id='list'>
        <div>
            <di>索引：${__index__}</div>
            <div>${loc}</div>
            <div>${com}</div>
            <div>${title}</div>
            <div>${loc}</div>
            <div>${com}</div>
            <div>${title}</div>
            <div>${loc}</div>
            <div>${com}</div>
            <div>${title}</div>
            <div>${loc}</div>
            <div>${com}</div>
            <div>${title}</div>
        <div>
            <hr>
    </script>
```
2. 支持自定义函数
```js
eTemplate.registerFun('getNow', function () {
    alert(new Date().toJSON())
})
```
```html
    <script type="text/html" id='date'>
        ${getNow()}
        ${_data_.toJSON()} 'a'
    </script>
```
3. 支持模板注册
```js
    console.time('renderTime')
    var tpl = document.getElementById('demo1').innerHTML;
    eTemplate.registerTemplate('date','#date')
    document.getElementById('ct').innerHTML = eTemplate(tpl, {
        age: 28,
        list: getList()
    })
    console.timeEnd('renderTime')
```
4. 支持模板内打log, 直接输出到页面
```html
    <script type="text/html" id='date'>      
        ${_data_.toJSON()} 'a' -- ${log(_data_,new Date())} --
    </script>

```
5. 也支持语句
```html
    <script type="text/template" id='demo1'>
        <div>人员信息</div>
        <div>姓名：${ "\"阿猫"}</div>
        <div>年龄: ${age}</div>
        <% if(true) {%>
            ${new Date().toJSON()}
        <% }%>
        <hr> ${each(list,render('#list'))}        
    </script>
```


## 缺点
1. 有点慢
  *   Chrome: 65

| 数据条数        |    时间 （ms）  |
| -------------  |-------------: |
|   10000        |540            | 
|   1000         |60             | 
|   500          |30             | 
|   100          |7              | 
|   50           |4              | 
|   20           |2.2              | 
|   10           |1.8            | 
|   1            |1.2              | 




>[JavaScript Micro-Templating](https://johnresig.com/blog/javascript-micro-templating/)   
 [JavaScript template engine in just 20 lines](http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)     
 [只有20行Javascript代码！手把手教你写一个页面模板引擎](http://blog.jobbole.com/56689/)   
 [template.js](https://github.com/yanhaijing/template.js)   
 [各种JS模板引擎对比数据(高性能JavaScript模板引擎)](https://www.cnblogs.com/guohu/p/3870677.html)