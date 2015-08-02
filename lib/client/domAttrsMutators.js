function setAttr(node, name, val) {
    node.setAttribute(name, '' + val);
}

function setProp(node, name, val) {
    node[name] = val;
}

function setObjProp(node, name, val) {
    var prop = node[name];
    for(var i in val) {
        prop[i] = val[i] == null? '' : val[i];
    }
}

function setPropWithCheck(node, name, val) {
    node[name] !== val && (node[name] = val);
}

function removeAttr(node, name) {
    node.removeAttribute(name);
}

function removeProp(node, name) {
    node[name] = getDefaultPropVal(node.tagName, name);
}

var defaultPropVals = {};
function getDefaultPropVal(tag, attrName) {
    var tagAttrs = defaultPropVals[tag] || (defaultPropVals[tag] = {});
    return attrName in tagAttrs?
        tagAttrs[attrName] :
        tagAttrs[attrName] = document.createElement(tag)[attrName];
}

function checkBitmask(value, bitmask) {
    return (value & bitmask) === bitmask;
}

var IS_PROP = 1,
    IS_OBJ = 2,
    CHECK_VAL_BEFORE_SET = 4,

    DEFAULT_ATTR = '__default__',

    attrsCfg = {
        checked : IS_PROP,
        controls : IS_PROP,
        id : IS_PROP,
        loop : IS_PROP,
        multiple : IS_PROP,
        muted : IS_PROP,
        readOnly : IS_PROP,
        selected : IS_PROP,
        srcDoc : IS_PROP,
        style : IS_PROP | IS_OBJ,
        value : IS_PROP | CHECK_VAL_BEFORE_SET
    },
    attrsMutators = {};

attrsCfg[DEFAULT_ATTR] = 0;

for(var attrName in attrsCfg) {
    var attrCfg = attrsCfg[attrName],
        isProp = checkBitmask(attrCfg, IS_PROP);

    attrsMutators[attrName] = {
        set : isProp?
            checkBitmask(attrCfg, CHECK_VAL_BEFORE_SET)?
                setPropWithCheck :
                checkBitmask(attrCfg, IS_OBJ)?
                    setObjProp :
                    setProp :
            setAttr,
        remove : isProp? removeProp : removeAttr
    };
}

module.exports = function(attrName) {
    return attrsMutators[attrName] || attrsMutators[DEFAULT_ATTR];
};
