# vidom

Experimental project that implements virtual dom differ. It enables you to get minimal set of operations (patch) needed to update real DOM tree.

## Patch operations

  * `updateText` { `node`, `text` }
  * `replaceNode` { oldNode, newNode }
  * `updateAttr` { node, attrName, attrVal }
  * `removeAttr` { node, attrName }
  * `appendChild` { parentNode, childNode }
  * `removeChild` { parentNode, childNode }
  * `removeChildren` { parentNode }
  * `insertChild` { parentNode, childNode, idx }
  * `moveChild` { parentNode, childNode, idx }

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


