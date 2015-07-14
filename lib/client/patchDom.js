function patchDom(domNode, patch) {
    var i = 0,
        len = patch.length,
        res;

    while(i < len) {
        if(res = patch[i++].applyTo(domNode)) {
            return res;
        }
    }
}

module.exports = patchDom;
