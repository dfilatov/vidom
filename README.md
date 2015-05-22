# vidom

Vidom is an experimental project that implements a virtual dom differ. It enables you to get a minimal set of operations (patch) needed to update real DOM tree. It's based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html).

## API

### vdom.renderToDom(`tree`)
Renders given `tree` to DOM.
 * @param {Object} `tree` root node of the first tree
 * @returns {Node} root DOM node

### vdom.diff(`tree1`, `tree2`)
Calculates patch between `tree1` and `tree2`. The patch is the array of operations which can be applied to `tree1` to get `tree2`.
 * @param {Object} `tree1` root node of the first tree
 * @param {Object} `tree2` root node of the second tree
 * @returns {Array} patch
  
### vdom.patchDom(`node`, `patch`)
Patches DOM .
 * @param {Node} `node` root DOM node
 * @param {Array} `patch` patch
  
## Patch operations
Each operation is represented by object contained its type, path to target node and some specific fields depended on type.

### Update text of node
```js
{
    type : 'updateText',
    path : pathToNode,
    text : 'some new text'
}
```

### Update attribute
```js
{
    type : 'updateAttr',
    path : pathToNode,
    attrName : 'href',
    attrVal : '/'
}
```

### Remove attribute
```js
{
    type : 'removeAttr',
    path : pathToNode,
    attrName : 'disabled',
}
```

### Append child  
```js
{
    type : 'appendChild',
    path : pathToNode,
    childNode : nodeToBeAppended
}
```

### Remove child at specified index
```js
{
    type : 'removeChild',
    path : pathToNode,
    idx : 5
}
```

### Remove all children
```js
{
    type : 'removeChildren',
    path : pathToNode
}
```

### Insert child at specified index
```js
{
    type : 'insertChild',
    path : pathToNode,
    idx : 3,
    childNode : childNode
}
```
  
### Move child from specified index to another one
```js
{
    type : 'moveChild',
    path : pathToNode,
    idxFrom : 3,
    idxTo : 2
}
```

### Replace node
```js
{
    type : 'replaceNode',
    path : pathToNode,
    newNode : nodeToReplace
}
```
  
## Virtual dom nodes representaion

### Element node
```js
{
    tag : 'div',
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


