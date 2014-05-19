# vidom

Experimental project that implements virtual dom differ. It enables you to get minimal set of operations (patch) needed to update real DOM tree. It based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html).

## API

```js

/*
 * Calculates patch between `tree1` and `tree2`. The patch is the array of commands which can be applied with `tree1` to get `tree2`.
 * @param {Object} `tree1` root node of the first tree
 * @param {Object} `tree2` root node of the second tree
 * @param {Object} [options]
 * @param {Function} [options.after] hook which is called after comparing of two nodes
 * @returns {Array} patch
 */
```
### vdom.diff(tree1, tree2, options)
  
## Patch operations

  * `updateText` { `node`, `text` } update text of given `node`
  * `replaceNode` { `oldNode`, `newNode` } replace `oldNode` with new `newNode`
  * `updateAttr` { `node`, `attrName`, `attrVal` } update attribute `attrName` of `node` with value of `attrVal`
  * `removeAttr` { `node`, `attrName` } remove attribute of `node` with given `attrName`
  * `appendChild` { `parentNode`, `childNode` } append new `childNode` to `parentNode`
  * `removeChild` { `parentNode`, `childNode` } remove given `childNode` from `parentNode`
  * `removeChildren` { `parentNode` } remove all children from `parentNode`
  * `insertChild` { `parentNode`, `childNode`, `idx` } insert new `childNode` to the given position `idx` of children of `parentNode`
  * `moveChild` { `parentNode`, `childNode`, `idx` }  move given `childNode` to the given position `idx` of children of `parentNode`

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


