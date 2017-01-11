import escapeAttr from '../utils/escapeAttr';
import isInArray from '../utils/isInArray';
import dasherize from '../utils/dasherize';
import console from '../utils/console';
import { IS_DEBUG } from '../utils/debug';

function setAttr(node, name, val) {
    if(name === 'type' && node.tagName === 'INPUT') {
        const value = node.value; // value will be lost in IE if type is changed

        node.setAttribute(name, '' + val);
        node.value = value;
    }
    else {
        node.setAttribute(ATTR_NAMES[name] || name, '' + val);
    }
}

function setBooleanAttr(node, name, val) {
    if(val) {
        setAttr(node, name, val);
    }
    else {
        removeAttr(node, name);
    }
}

function setProp(node, name, val) {
    node[name] = val;
}

function setObjProp(node, name, val) {
    if(IS_DEBUG) {
        const typeOfVal = typeof val;

        if(typeOfVal !== 'object') {
            console.error(`"${name}" attribute expects an object as a value, not a ${typeOfVal}`);
            return;
        }
    }

    const prop = node[name];

    for(const i in val) {
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
    node.removeAttribute(ATTR_NAMES[name] || name);
}

function removeProp(node, name) {
    if(name === 'style') {
        node[name].cssText = '';
    }
    else if(name === 'value' && node.tagName === 'SELECT') {
        removeSelectValue(node);
    }
    else {
        node[name] = getDefaultPropVal(node.tagName, name);
    }
}

function setSelectValue(node, value) {
    const isMultiple = Array.isArray(value);

    if(isMultiple) {
        const { options } = node,
            len = options.length;
        let i = 0,
            optionNode;

        while(i < len) {
            optionNode = options[i++];
            optionNode.selected = value != null && isInArray(value, optionNode.value);
        }
    }
    else {
        node.value = value;
    }
}

function removeSelectValue(node) {
    const options = node.options,
        len = options.length;
    let i = 0;

    while(i < len) {
        options[i++].selected = false;
    }
}

function attrToString(name, value) {
    return value === false?
        '' :
        (ATTR_NAMES[name] || name) + (value === true? '' : '="' + escapeAttr(value) + '"');
}

function booleanAttrToString(name, value) {
    return value? name : '';
}

function stylePropToString(name, value) {
    let styles = '',
        i;

    for(i in value) {
        if(value[i] != null) {
            styles += dasherize(i) + ':' + value[i] + ';';
        }
    }

    return styles? name + '="' + styles + '"' : styles;
}

const defaultPropVals = {};

function getDefaultPropVal(tag, attrName) {
    const tagAttrs = defaultPropVals[tag] || (defaultPropVals[tag] = {});

    return attrName in tagAttrs?
        tagAttrs[attrName] :
        tagAttrs[attrName] = document.createElement(tag)[attrName];
}

const ATTR_NAMES = {
        acceptCharset : 'accept-charset',
        className : 'class',
        htmlFor : 'for',
        httpEquiv : 'http-equiv',
        autoCapitalize : 'autocapitalize',
        autoComplete : 'autocomplete',
        autoCorrect : 'autocorrect',
        autoFocus : 'autofocus',
        autoPlay : 'autoplay',
        encType : 'encoding',
        hrefLang : 'hreflang',
        radioGroup : 'radiogroup',
        spellCheck : 'spellcheck',
        srcDoc : 'srcdoc',
        srcSet : 'srcset',
        tabIndex : 'tabindex'
    },
    DEFAULT_ATTR_CFG = {
        set : setAttr,
        remove : removeAttr,
        toString : attrToString
    },
    BOOLEAN_ATTR_CFG = {
        set : setBooleanAttr,
        remove : removeAttr,
        toString : booleanAttrToString
    },
    DEFAULT_PROP_CFG = {
        set : setProp,
        remove : removeProp,
        toString : attrToString
    },
    BOOLEAN_PROP_CFG = {
        set : setProp,
        remove : removeProp,
        toString : booleanAttrToString
    },
    attrsCfg = {
        checked : BOOLEAN_PROP_CFG,
        controls : DEFAULT_PROP_CFG,
        disabled : BOOLEAN_ATTR_CFG,
        id : DEFAULT_PROP_CFG,
        ismap : BOOLEAN_ATTR_CFG,
        loop : DEFAULT_PROP_CFG,
        multiple : BOOLEAN_PROP_CFG,
        muted : DEFAULT_PROP_CFG,
        open : BOOLEAN_ATTR_CFG,
        readOnly : BOOLEAN_PROP_CFG,
        selected : BOOLEAN_PROP_CFG,
        srcDoc : DEFAULT_PROP_CFG,
        style : {
            set : setObjProp,
            remove : removeProp,
            toString : stylePropToString
        },
        value : {
            set : setPropWithCheck,
            remove : removeProp,
            toString : attrToString
        }
    };

export default function(attrName) {
    return attrsCfg[attrName] || DEFAULT_ATTR_CFG;
}
