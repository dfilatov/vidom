## ATTENTION! This project is in a progress state. Everything can be changed at any moment.

# vidom [![Build Status](https://secure.travis-ci.org/dfilatov/vidom.png)](http://travis-ci.org/dfilatov/vidom)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)

Vidom is an project that implements a virtual dom builder and differ. It enables you to get a minimal set of operations (patch) needed to update a real DOM tree. It's highly inspired and based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html). Its main goal is to provide as fast as possible implementation with API similar to React.

## Top-Level API

### vidom.createNode(`tag`)
Creates a virtual node with the given `tag`.
* @param {String} `tag` the tag
* @returns {TagNode}

### vidom.createNode()
* @returns {TextNode}
Creates a virtual text node.

### vidom.createNode(`Component`)
Creates a virtual node with the custom `Component`.
* @param {Function} `Component` the component class 
* @returns {ComponentNode}

### vidom.createComponent(`props`, `staticProps`)
Creates a component class.
* @param {Object} `props` the props
* @param {Object} `staticProps` the static props
* @returns {Function}

### vidom.mountToDom(`domNode`, `tree`, `cb`, `cbCtx`)
Mounts the virtual `tree` to the DOM.
 * @param {Object} `domNode` the container DOM node to mount to
 * @param {Object} `tree` the root node of the given tree
 * @param {Function} [`cb`] the callback which will be called when the given tree is mounted to the DOM
 * @param {Function} [`cbСtx`] the context to invoke callback with

### vidom.unmountFromDom(`domNode`, `cb`, `cbCtx`)
Unmounts a virtual tree from the DOM.
 * @param {Object} `domNode` the container DOM node to unmount from
 * @param {Function} [`cb`] the callback which will be called when a mounted tree is unmounted from the DOM
 * @param {Function} [`cbСtx`] the context to invoke callback with
 
## Tag node API

### node.attrs(`attrs`)
Sets the attributes to a node. When this node is mounted to the DOM, attributes will be translated to the corresponding DOM attributes or properties.
* @param {Object} `attrs` attributes
* @returns {TagNode} this
```js
vidom.createNode('input').attrs({
    className : 'input',
    type : 'text',
    value : 'bla',
    disabled : true
});
```

### node.on(`listeners`)
Adds DOM event `listeners` to a node. DOM event delegation mechanism will be automatically used if possible.
* @param {Object} `listeners` listeners
* @returns {TagNode} this
```js
vidom.createNode('input').on({
    change : function() { ... },
    focusin : function() { ... }
});
```
### node.key(`key`)
Sets the key to a node. It should be used when the node is specified as a child of another one.
* @param {String} `key` key
* @returns {TagNode} this
```js
vidom.createNode('div').children([
    vidom.createNode('div').key('header'),
    vidom.createNode('div').key('footer')
]);
```

### node.ns(`ns`)
Sets the namespace to the node.
* @param {String} `ns` namespace
* @returns {TagNode} this
```js
vidom.createNode('svg').ns('http://www.w3.org/2000/svg');
```

### node.children(`children`)
Sets the `children` to a node.
* @param {Array|Object|String} `children` children nodes
* @returns {TagNode} this
```js
vidom.createNode('div').children([
    vidom.createNode('div').key('header'),
    vidom.createNode(FooterComponent).key('footer')
]);

vidom.createNode('div').children(vidom.createNode('span'));

vidom.createNode('div').children('some text');
```

## Component lifecycle API

### onRender(`attrs`, `children`)
The callback which will be invoked when a component should be rendered.
* @param {Object} `attrs` the attributes passed to the corresponding virtual node
* @param {Array} `children` the children passed to the corresponding virtual node 

### onMount()
The callback which will be invoked when a component is mounted to the DOM.

### onAttrsReceive(`newAttrs`, `prevAttrs`)
The callback which will be invoked when a component is received new attributes.
* @param {Object} `newAttrs`
* @param {Object} `prevAttrs`

### onUpdate()
The callback which will be invoked after a component has updated its DOM.

### onUnmount()
The callback which will be invoked before a component is unmounted from the DOM.

## Component methods

### update(`cb`, `cbCtx`)
Forces to schedule component update.
* @param {Function} [`cb`] the callback which will be called when the update has been finished
* @param {Function} [`cbСtx`] the context to invoke callback with

### isMounted()
Returns whether a component is mounted to the DOM.
* @returns {Boolean} 

#### Example
```js
var InputComponent = vidom.createComponent({
        onRender : function() {
            return vidom.createNode('div')
                .attrs({ className : 'input' })
                .children(
                    vidom.createNode('input')
                        .attrs({ type : 'text', className : 'input__control' })
                        .on({ focusin : this.onFocus })); // onFocus will be invoked in a current component context
        },
        
        onMount : function() {
        },
        
        onUnmount : function() {
        },
        
        onFocus : function() {
        }
    });
```
