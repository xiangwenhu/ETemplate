# 基于ES6字符串模板的模板


...持续更新中...

## 优点如下

1. 支持模板嵌套
```html
    <script type="text/html" id='demo1'>
        <div>人员信息</div>
        <div>姓名：${name || "阿猫"}</div>
        <div>年龄: ${age}</div>
        <hr>
        <div>
            ${render('#date',new Date())} ${each(list,render('#list'))}
        </div>
    </script>

    <script type="text/html" id='date'>
        ${getNow()}
        ${_data_.toJSON()} 'a'
    </script>

    <script type="text/html" id='list'>
        <div>
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

## 缺点
1. 慢慢慢
2. 烂烂烂



>[JavaScript Micro-Templating](https://johnresig.com/blog/javascript-micro-templating/)   
 [JavaScript template engine in just 20 lines](http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line)     
 [只有20行Javascript代码！手把手教你写一个页面模板引擎](http://blog.jobbole.com/56689/)   
 [template.js](https://github.com/yanhaijing/template.js)   
 [各种JS模板引擎对比数据(高性能JavaScript模板引擎)](https://www.cnblogs.com/guohu/p/3870677.html)