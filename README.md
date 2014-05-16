# vidom

Experimental project that implements virtual dom differ. It enables you to get minimal set of operations (patch) needed to update real DOM tree. It based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html).

## Patch operations

  * `updateText` { `node`, `text` } update text of given node `node`
  * `replaceNode` { `oldNode`, `newNode` } replace node `oldNode` with new node `newNode`
  * `updateAttr` { `node`, `attrName`, `attrVal` } update attribute `attrName` of `node` with value of `attrVal`
  * `removeAttr` { `node`, `attrName` } remove attribute of `node` with given `attrName`
  * `appendChild` { `parentNode`, `childNode` } append new `childNode` to `parentNode`
  * `removeChild` { `parentNode`, `childNode` } remove given `childNode` from `parentNode`
  * `removeChildren` { `parentNode` } remove all children from `parentNode`
  * `insertChild` { `parentNode`, `childNode`, `idx` } insert new `childNode` to the given position `idx` to children of `parentNode`
  * `moveChild` { `parentNode`, `childNode`, `idx` }

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


