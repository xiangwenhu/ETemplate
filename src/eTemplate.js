(function (self) {
    // 类型检查
    const typeCheker = {
        isObject(v) {
            return typeof v === 'object' && v != null
        },
        isFunction(v) {
            return typeof v === 'function' || v instanceof Function
        },
        isString(v) {
            return typeof v === 'string' || v instanceof String
        }
    }

    //模板缓存
    const templates = Object.create(null)
    // 内置log方法
    function log(...args) {
        return args.map(v => typeCheker.isObject(v) ? JSON.stringify(v) : v)
    }
    // 内置each方法
    function each(arr, fn) {
        return Array.prototype.map.call(arr, fn).join('')
    }
    const builtInFunctions = {
        each,
        log,
        render
    }

    const encode = function (code) {
        return code.replace(/\r|\n/g, '')
            .replace(/('|")/g, '\\$1')
    }

    const getProperties = function (obj = {}, include = false) {
        return include ? Object.keys(obj).concat('_data_') : Object.keys(obj)
    }

    const getValues = function (obj = {}, include = false) {
        return include ? Object.values(obj).concat(obj) : Object.values(obj)
    }

    const getFunction = (function () {
        function _getFunction(params, code) {
            params = params.map(c => `'${c}'`).join()
            const funStr = `return new Function(${params}, ${code})`
            return (new Function(funStr))()
        }
        return function getFunction(...args) {
            if (args.length < 0) {
                return null
            }
            const code = args.pop()
            return _getFunction([...args], `'return(\`${encode(code)}\`)'`)
        }
    })()

    function getParamterNames(d) {
        return getProperties(d, true).concat(getProperties(builtInFunctions))
    }

    function getParamterValues(d) {
        return getValues(d,true).concat(getValues(builtInFunctions))
    }

    function eTemplate(tpl, data) {
        return innerRender(tpl, data)
    }

    function innerRender(tpl, data) {
        var params = getParamterNames(data)
        var values = getParamterValues(data)
        return getFunction(...params, tpl)(...values)
    }

    function render(selectorOrName, d) {
        // 普通render
        if (typeCheker.isObject(d)) {
            return innerRender(getTemplate(selectorOrName), d)
        }
        // each
        return (d, index) => innerRender(getTemplate(selectorOrName), d)
    }

    function getTemplate(selectorOrName) {
        let tpl = templates[selectorOrName]
        if (tpl) {
            return templates[selectorOrName]
        }
        const el = document.querySelector(selectorOrName)
        if (el) {
            templates[selectorOrName] = el.innerHTML
        }
        return templates[selectorOrName] || ''
    }

    /**
     * 註冊函數
     * @param {函數名，也可以是對象} name 
     * @param {函數} fn 
     */
    eTemplate.registerFun = function (name, fn) {
        if (typeCheker.isString(name) && typeCheker.isFunction(fn)) {
            builtInFunctions[name] = fn
        }
        if (typeCheker.isObject(name)) {
            for (let p in name) {
                if (typeCheker.isFunction(name[p])) {
                    builtInFunctions[name] = name[p]
                }
            }
        }
    }

    eTemplate.registerTemplate = function (name, selector) {
        const el = document.querySelector(selectorOrName)
        if (el) {
            templates[selectorOrName] = el.innerHTML
        }
    }

    self.eTemplate = eTemplate
    
})(self || window)