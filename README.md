vidom
=====

Experimental project that implements virtual dom differ. It enables you to get minimal set of operations needed to update real DOM tree.

===Virtual dom nodes representaion

====Element node
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

====Text node
```js
{
    text : 'some text',
    key : '342'
}
```


