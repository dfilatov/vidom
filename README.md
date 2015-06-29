# vidom [![Build Status](https://secure.travis-ci.org/dfilatov/vidom.png)](http://travis-ci.org/dfilatov/vidom)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)

Vidom is an experimental project that implements a virtual dom differ. It enables you to get a minimal set of operations (patch) needed to update real DOM tree. It's based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html).

## API

### vdom.renderToDom(`tree`)
Renders a given `tree` to DOM.
 * @param {Object} `tree` root node of the given tree
 * @returns {Node} root DOM node

### vdom.calcPatch(`tree1`, `tree2`)
Calculates a patch between a `tree1` and a `tree2`. The patch is an array of operations which can be applied to the `tree1` to get the `tree2`.
 * @param {Object} `tree1` root node of the first tree
 * @param {Object} `tree2` root node of the second tree
 * @returns {Array} patch
  
### vdom.patchDom(`node`, `patch`)
Applies a given patch to DOM.
 * @param {Node} `node` root DOM node
 * @param {Array} `patch` patch
  
## Patch operations
Each operation is represented by an object contained its type and some specific fields depended on the type.

### Update text of node
```js
{
    type : UPDATE_TEXT,
    text : 'some new text'
}
```

### Update attribute
```js
{
    type : UPDATE_ATTR,
    attrName : 'href',
    attrVal : '/'
}
```

### Remove attribute
```js
{
    type : REMOVE_ATTR,
    attrName : 'disabled',
}
```

### Append child  
```js
{
    type : APPEND_CHILD,
    node : nodeToAppend
}
```

### Remove child at specified index
```js
{
    type : REMOVE_CHILD,
    idx : 5
}
```

### Remove all children
```js
{
    type : REMOVE_CHILDREN
}
```

### Insert child at specified index
```js
{
    type : INSERT_CHILD,
    idx : 3,
    node : nodeToInsert
}
```
  
### Move child from specified index to another one
```js
{
    type : MOVE_CHILD,
    idxFrom : 3,
    idxTo : 2
}
```

### Replace node
```js
{
    type : REPLACE,
    node : nodeToReplace
}
```

### Update children
```js
{
    type : UPDATE_CHILDREN,
    children : [
        {
            idx : idx
            patch : patch
        },
        ...
    ]
}
```

## Virtual dom nodes representaion

### Element node
```js
{
    tag : 'div',
    ns : 'http://www.w3.org/2000/svg', // optional
    key : '123', // optional
    attrs : { // optional
        className : 'test',
        tabIndex : 10
    },
    children : [] // optional
}
```

### Text node
```js
{
    text : 'some text', // required
    key : '342' // optional
}
```
