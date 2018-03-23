let codes = [];           
let {each,log,spreadProperties,getNow} = _builtFn_;;

eval(spreadProperties(__data__,'__data__'));

codes.push(`
<div>人员信息</div>
<div>姓名：${name || "阿猫"}</div>
<div>年龄: ${age}</div>
<hr>
`);for (var i =0; i<list.length; i++){codes.push(`
`);if (name == 'JIM') {codes.push(`
    <div>
        JIM GO out
    </div>
`);} else {codes.push(`
    <div>
        <div>${list[i].loc}</div>
        <div>${list[i].com}</div>
        <div>${list[i].title}</div>
    </div>
`);} codes.push(`
`);}codes.push(`
`);;

return codes.join('')