function setAttr(node, name, val) {
    if(name === 'type' && node.tagName === 'INPUT') {
        var value = node.value; // value will be lost in IE if type is changed
        node.setAttribute(name, '' + val);
        node.value = value;
    }
    else {
        node.setAttribute(name, '' + val);
    }
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
    if(name === 'value' && node.tagName === 'SELECT') {
        setSelectValue(node, val);
    }
    else {
        node[name] !== val && (node[name] = val);
    }
}

function removeAttr(node, name) {
    node.removeAttribute(name);
}

function removeProp(node, name) {
    if(name === 'value' && node.tagName === 'SELECT') {
        removeSelectValue(node);
    }
    else {
        node[name] = getDefaultPropVal(node.tagName, name);
    }
}

function setSelectValue(node, value) {
    var i = 0,
        children = node.childNodes,
        len = children.length,
        childNode,
        isMultiple = Array.isArray(value);

    while(i < len) {
        childNode = children[i++];
        if(childNode.tagName === 'OPTION') {
            childNode.selected = value != null &&
                (isMultiple? isInArray(value, childNode.value) : childNode.value == value);
        }
        else {
            setSelectValue(childNode, value);
        }
    }
}

function removeSelectValue(node) {
    var i = 0,
        children = node.childNodes,
        len = children.length,
        childNode;

    while(i < len) {
        childNode = children[i++];
        if(childNode.tagName === 'OPTION') {
            childNode.selected = false;
        }
        else {
            setSelectValue(childNode, value);
        }
    }
}

function isInArray(arr, item) {
    var len = arr.length,
        i = 0;

    while(i < len) {
        if(arr[i++] == item) {
            return true;
        }

    }

    return false;
}

var defaultPropVals = {};
function getDefaultPropVal(tag, attrName) {
    var tagAttrs = defaultPropVals[tag] || (defaultPropVals[tag] = {});
    return attrName in tagAttrs?
        tagAttrs[attrName] :
        tagAttrs[attrName] = document.createElement(tag)[attrName];
}

var DEFAULT_ATTR_CFG = {
        set : setAttr,
        remove : removeAttr
    },
    DEFAULT_PROP_CFG = {
        set : setProp,
        remove : removeProp
    },
    attrsCfg = {
        checked : DEFAULT_PROP_CFG,
        controls : DEFAULT_PROP_CFG,
        id : DEFAULT_PROP_CFG,
        loop : DEFAULT_PROP_CFG,
        multiple : DEFAULT_PROP_CFG,
        muted : DEFAULT_PROP_CFG,
        readOnly : DEFAULT_PROP_CFG,
        selected : DEFAULT_PROP_CFG,
        srcDoc : DEFAULT_PROP_CFG,
        style : {
            set : setObjProp,
            remove : removeProp
        },
        value : {
            set : setPropWithCheck,
            remove : removeProp
        }
    };

module.exports = function(attrName) {
    return attrsCfg[attrName] || DEFAULT_ATTR_CFG;
};
