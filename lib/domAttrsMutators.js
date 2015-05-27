function setAttr(node, name, val) {
    node.setAttribute(name, '' + val);
}

function setProp(node, name, val) {
    node[name] = val;
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

var IS_ATTR = 0x1,
    IS_BOOLEAN = 0x2,
    CHECK_VAL_BEFORE_SET = 0x4,

    DEFAULT_ATTR = '__default__';

    attrsCfg = {
        checked : IS_BOOLEAN,
        disabled : IS_ATTR | IS_BOOLEAN,
        value : CHECK_VAL_BEFORE_SET
    },
    attrsMutators = {};

attrsCfg[DEFAULT_ATTR] = 0;

for(var attrName in attrsCfg) {
    var isAttr = checkBitmask(attrsCfg[attrName], IS_ATTR);
    attrsMutators[attrName] = {
        set : isAttr?
            setAttr :
            checkBitmask(attrsCfg[attrName], CHECK_VAL_BEFORE_SET)?
                setPropWithCheck :
                setProp,
        remove : isAttr? removeAttr : removeProp
    };
}

module.exports = function(attrName) {
    return attrsMutators[attrName] || attrsMutators[DEFAULT_ATTR];
};
