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

var IS_ATTR = 1,
    IS_OBJ = 2,
    CHECK_VAL_BEFORE_SET = 3,

    DEFAULT_ATTR = '__default__',

    attrsCfg = {
        allowFullScreen : IS_ATTR,
        allowTransparency : IS_ATTR,
        charSet : IS_ATTR,
        classID : IS_ATTR,
        clipPath : IS_ATTR,
        contextMenu : IS_ATTR,
        cols : IS_ATTR,
        cx : IS_ATTR,
        cy : IS_ATTR,
        d : IS_ATTR,
        disabled : IS_ATTR,
        dx : IS_ATTR,
        dy : IS_ATTR,
        fill : IS_ATTR,
        'fill-rule' : IS_ATTR,
        fillOpacity : IS_ATTR,
        fontFamily : IS_ATTR,
        fontSize : IS_ATTR,
        form : IS_ATTR,
        formAction : IS_ATTR,
        formEncType : IS_ATTR,
        formMethod : IS_ATTR,
        formNoValidate : IS_ATTR,
        formTarget : IS_ATTR,
        fx : IS_ATTR,
        fy : IS_ATTR,
        gradientTransform : IS_ATTR,
        gradientUnits : IS_ATTR,
        height : IS_ATTR,
        hidden : IS_ATTR,
        list : IS_ATTR,
        manifest : IS_ATTR,
        markerEnd : IS_ATTR,
        markerMid : IS_ATTR,
        markerStart : IS_ATTR,
        maxLength : IS_ATTR,
        media : IS_ATTR,
        minLength : IS_ATTR,
        offset : IS_ATTR,
        opacity : IS_ATTR,
        patternContentUnits : IS_ATTR,
        patternUnits : IS_ATTR,
        points : IS_ATTR,
        preserveAspectRatio : IS_ATTR,
        r : IS_ATTR,
        role : IS_ATTR,
        rows : IS_ATTR,
        rx : IS_ATTR,
        ry : IS_ATTR,
        size : IS_ATTR,
        sizes : IS_ATTR,
        spreadMethod : IS_ATTR,
        srcSet : IS_ATTR,
        stopColor : IS_ATTR,
        stopOpacity : IS_ATTR,
        stroke : IS_ATTR,
        strokeDasharray : IS_ATTR,
        strokeLinecap : IS_ATTR,
        strokeOpacity : IS_ATTR,
        strokeWidth : IS_ATTR,
        style : IS_OBJ,
        textAnchor : IS_ATTR,
        transform : IS_ATTR,
        version : IS_ATTR,
        viewBox : IS_ATTR,
        value : CHECK_VAL_BEFORE_SET,
        width : IS_ATTR,
        wmode : IS_ATTR,
        x1 : IS_ATTR,
        x2 : IS_ATTR,
        x : IS_ATTR,
        y1 : IS_ATTR,
        y2 : IS_ATTR,
        y : IS_ATTR
    },
    attrsMutators = {};

attrsCfg[DEFAULT_ATTR] = 0;

for(var attrName in attrsCfg) {
    var attrCfg = attrsCfg[attrName],
        isAttr = checkBitmask(attrCfg, IS_ATTR);

    attrsMutators[attrName] = {
        set : isAttr?
            setAttr :
            checkBitmask(attrCfg, CHECK_VAL_BEFORE_SET)?
                setPropWithCheck :
                checkBitmask(attrCfg, IS_OBJ)?
                    setObjProp :
                    setProp,
        remove : isAttr? removeAttr : removeProp
    };
}

module.exports = function(attrName) {
    return attrsMutators[attrName] || attrsMutators[DEFAULT_ATTR];
};
