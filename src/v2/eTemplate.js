(function (self, doc) {

    const config = {
        startTag: '<%',
        endTag: '%>',
        cache: true
    }

    const BUILTINFN = '__builtInFn__'
    const objectToString = function (...args) {
        return args.map(function (v) { return typeCheker.isJSONObject(v) ? JSON.stringify(v) : v })
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

    let builtFnCode = spreadProperties(builtInFunctions, BUILTINFN)

    function refreshBuiltFnCode() {
        return builtFnCode = spreadProperties(builtInFunctions, BUILTINFN)
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
            ${builtFnCode};
            // 展开属性
            eval(spreadProperties(__data__,'__data__'));
            // 执行代码
            ${tpl};
        
            return codes.join('')
        `
        try {
            var render = new Function('__data__', BUILTINFN, code);
            return function (data) {
                return render(data, builtInFunctions)
            }
        } catch (e) {
            e.code = `function anonymous(__data__, __builtFn__) {${code}}`
            throw e;
        }
    }


    function getRenderFromId(name, id) {
        if (!id) {
            id = name
            name = id.slice(1)
        }
        const tpl = doc.querySelector(id).innerHTML
        return getRender(name, tpl)
    }

    function getRenderFromStr(name, tpl) {
        // 只传入name时， name为tpl
        if (!tpl) {
            tpl = name
            name = undefined
        }

        const code = parse(tpl)
        const fn = compileRender(code)
        if (name) {
            builtInFunctions[name] = fn
            refreshBuiltFnCode()
        }

        return fn
    }

    function getRender(idOrName) {
        return idOrName.indexOf('#') === 0 ? getRenderFromId(idOrName) : getRenderFromStr(idOrName)
    }

    function render(idOrName, d) {

        const renderer = getRender(idOrName)
        if (isJSONObjectOrArray(d)) {
            return renderer(d)
        }
        // each TODO:: 怎么获取index, arr

        return function (d, index, arr) {
            d['__index__'] = index
            d['__arr__'] = arr
            return renderer(d)
        }
    }

    /* 词法解析：End */


    function eTemplate(tpl, data) {
        const renderer = getRenderFromStr(tpl)
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
        refreshBuiltFnCode()
    }

    eTemplate.unregisterFun = function (name) {
        delete builtInFunctions[name]
        refreshBuiltFnCode()
    }

    eTemplate.register = function (name, tpl) {
        return getRenderFromStr(name, tpl)
    }

    eTemplate.registerById = function (name, id) {
        return getRenderFromId(name, id)
    }

    self.eTemplate = eTemplate

})(self || window, document)