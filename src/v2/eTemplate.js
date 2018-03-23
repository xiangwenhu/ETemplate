(function (self, doc) {

    const config = {
        startTag: '<%',
        endTag: '%>'
    }
    const objectToString = function (...args) {
        return args.map(v => typeCheker.isJSONObject(v) ? JSON.stringify(v) : v)
    }

    /* 类型检查:Begin */
    const toString = Object.prototype.toString
    const getObjectType = function (obj) {
        return toString.call(obj).slice(8, -1).toLowerCase()
    }

    function isObject(v) {
        return typeof v === 'object' && v != null
    }

    function isFunction(v) {
        return typeof v === 'function' || v instanceof Function
    }

    function isString(v) {
        return typeof v === 'string' || v instanceof String
    }

    function isJSONObject(v) {
        return isObject(v) && getObjectType(v) === 'object' && !v.length
    }

    function isJSONObjectOrArray(v) {
        return isJSONObject(v) || Array.isArray(v)
    }
    /* 类型检查:End */

    //模板缓存
    const templates = Object.create(null)


    /* 内置方法：Begin */
    function log(...args) {
        return objectToString(...args)
    }

    function each(arr, fn) {
        return Array.prototype.map.call(arr, fn).join('')
    }

    function encode(source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\\/g, '&#92;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const builtInFunctions = {
        each,
        log,
        spreadProperties,
        encode,
        render
    }
    /* 内置方法：End */


    /* 词法解析：Begin */
    function spreadProperties(obj, name) {
        if (isJSONObject(obj)) {
            return `var {${Object.keys(obj).join(',')}} = ${name};`
        }
        return ''
    }

    function parseHTML(html) {
        const r = html.replace(/\n\r/g, ' ')
        if (!!r) {
            return `codes.push(\`${r}\`);`
        }
        return ''
    }

    function arrayPush(arr, val) {
        if (!!val) {
            arr.push(val)
        }
    }

    function parseJS(code) {
        return code
    }

    function parse(tpl) {
        let codes = [],
            {
                startTag,
                endTag
            } = config
        let fragments = tpl.split(startTag);
        for (var i = 0, len = fragments.length; i < len; i++) {
            var fragment = fragments[i].split(endTag);
            if (fragment.length === 1) {
                arrayPush(codes, parseHTML(fragment[0]))
            } else {
                arrayPush(codes, parseJS(fragment[0]))
                if (fragment[1]) {
                    arrayPush(codes, parseHTML(fragment[1]))
                }
            }
        }
        return codes.join('');
    }

    function compileRender(tpl) {
        let code = `           
            let codes = [];       
            // 展开内置函数    
            ${spreadProperties(builtInFunctions,'__builtFn__')};
            // 展开属性
            eval(spreadProperties(__data__,'__data__'));
            // 执行代码
            ${tpl};
        
            return codes.join('')
        `
        try {
            var render = new Function('__data__', '__builtFn__', code);
            return function (data) {
                return render(data, builtInFunctions)
            }
        } catch (e) {
            e.temp = 'function anonymous(__data__, __builtFn__) {' + code + '}';
            throw e;
        }
    }

    function getRender(tpl) {
        const code = parse(tpl)
        return compileRender(code)
    }

    function getTemplate(selectorOrName) {
        let tpl = templates[selectorOrName]
        if (tpl) {
            return tpl
        }
        eTemplate.registerTemplate(selectorOrName)
        return templates[selectorOrName] || ''
    }

    function render(selectorOrName, d) {
        // 普通render
        const tpl = getTemplate(selectorOrName)
        const renderer = getRender(tpl)
        if (isJSONObjectOrArray(d)) {
            return renderer(d)
        }
        // each TODO:: 怎么获取index, arr
        
        return (d, index, arr) => { 
            d['__index__'] = index
            d['__arr__'] = arr
            return renderer(d)
        }
    }

    /* 词法解析：End */

    function eTemplate(tpl, data) {
        const renderer = getRender(tpl)
        if (!data) {
            return renderer
        }
        return renderer(data)
    }
    /**
     * 註冊函數
     * @param {函數名，也可以是對象} name 
     * @param {函數} fn 
     */
    eTemplate.registerFun = function (name, fn) {
        if (isString(name) && isFunction(fn)) {
            builtInFunctions[name] = fn
        }
        if (isObject(name)) {
            for (let p in name) {
                if (isFunction(name[p])) {
                    builtInFunctions[name] = name[p]
                }
            }
        }
    }

    eTemplate.registerTemplate = function (name, selector) {
        if (!selector) {
            selector = name
        }
        const el = doc.querySelector(selector)
        if (el) {
            templates[name] = el.innerHTML
        }
    }

    self.eTemplate = eTemplate

})(self || window, document)