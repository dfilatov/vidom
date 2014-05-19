# vidom

Vidom is an experimental project that implements a virtual dom differ. It enables you to get a minimal set of operations (patch) needed to update real DOM tree. It based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html).

## API

### vdom.diff(`tree1`, `tree2`, `options`)
Calculates patch between `tree1` and `tree2`. The patch is the array of operations which can be applied to `tree1` to get `tree2`.
 * @param {Object} `tree1` root node of the first tree
 * @param {Object} `tree2` root node of the second tree
 * @param {Object} [options]
 * @param {Function} [options.after] hook which is called after comparing of two nodes
 * @returns {Array} patch
  
## Patch operations
Each operation is represented by object contained its type and some specific fields depended on type.

### Update text of node
```js
    {
        type : 'updateText',
        node : nodeToBeUpdated,
        text : 'some new text'
    }
```

### Replace node
```js
    {
        type : 'replaceNode',
        oldNode : nodeToBeReplaced, 
        newNode : nodeToReplace
    }
```
  
### Update attribute
```js
    {
        type : 'updateAttr',
        node : nodeToBeUpdated,
        attrName : 'href',
        attrVal : '/'
    }
```

### Remove attribute
```js
    {
        type : 'removeAttr',
        node : nodeToBeUpdated,
        attrName : 'disabled',
    }
```

### Append child  
```js
    {
        type : 'appendChild',
        parentNode : nodeToBeAppendedTo,
        childNode : nodeToBeAppended
    }
```

### Remove child
```js
    {
        type : 'removeChild',
        parentNode : parentNode,
        childNode : nodeToBeRemoved
    }
```

### Remove all children
```js
    {
        type : 'removeChildren',
        parentNode : parentNode
    }
```

### Insert child at specified position
```js
    {
        type : 'insertChild',
        parentNode : parentNode,
        idx : 3
    }
```
  
### Move child to specified position
```js
    {
        type : 'moveChild',
        parentNode : parentNode,
        idx : 3
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


