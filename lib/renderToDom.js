var domAttrSetter = require('./domAttrsMutators');

function render(node, ns) {
    var res;

    if('text' in node) {
        res = document.createTextNode(node.text);
    }
    else {
        'ns' in node && (ns = node.ns);

        res = ns?
            document.createElementNS(ns, node.tag) :
            document.createElement(node.tag);

        for(var name in node.attrs) {
            domAttrSetter(name).set(res, name, node.attrs[name]);
        }

        var children = node.children;
        if(children) {
            var i = 0,
                len = children.length;
            while(i < len) {
                res.appendChild(render(children[i++], ns));
            }
        }
    }

    return res;
}

module.exports = render;
