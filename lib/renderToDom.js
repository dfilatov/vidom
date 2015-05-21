function render(node) {
    var res;

    if('text' in node) {
        res = document.createTextNode(node.text);
    }
    else {
        res = document.createElement(node.tag);
        for(var name in node.attrs) {
            res[name] = node.attrs[name];
        }

        var children = node.children;
        if(children) {
            var i = 0,
                len = children.length;
            while(i < len) {
                res.appendChild(render(children[i++]));
            }
        }
    }

    return node.domNode = res;
}

module.exports = render;
