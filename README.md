# vidom [![Build Status](https://secure.travis-ci.org/dfilatov/vidom.png)](http://travis-ci.org/dfilatov/vidom)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)

Vidom is an project that implements a virtual dom builder and differ. It enables you to get a minimal set of operations (patch) needed to update real DOM tree. It's highly inspired and based on ideas from React (http://facebook.github.io/react/docs/reconciliation.html). Its main goal is to provide as fast as possible implementation with API similar to React.

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
Mounts the virtual `tree` to DOM.
 * @param {Object} `domNode` the container DOM node to mount to
 * @param {Object} `tree` the root node of the given tree
 * @param {Function} [`cb`] the callback which will be called when the given tree is mounted to DOM
 * @param {Function} [`cbСtx`] the context to invoke callback with

### vidom.unmountFromDom(`domNode`, `cb`, `cbCtx`)
Unmounts a virtual tree from DOM.
 * @param {Object} `domNode` the container DOM node to unmount from
 * @param {Function} [`cb`] the callback which will be called when a mounted tree is unmounted from DOM
 * @param {Function} [`cbСtx`] the context to invoke callback with

## Component API

### render(`attrs`, `children`)
Renders component content. Shouldn't be invoked directly.
* @param {Object} `attrs` the attributes passed to the corresponding virtual node
* @param {Array} `children` the children passed to the corresponding virtual node 

### update()
Forces to schedules component update.

### isMounted()
Returns whether a component is mounted to DOM.
* @returns {Boolean} 

### onMount()
The callback which will be invoked when a component is mounted to DOM.

### onAttrsReceive(`newAttrs`, `prevAttrs`)
The callback which will be invoked when a component is received new attributes.
* @param {Object} `newAttrs`
* @param {Object} `prevAttrs`

### onUpdate()
The callback which will be invoked after a component has updated its DOM.

### onUnmount()
The callback which will be invoked before a component is unmounted from DOM.

#### Example
```js
var InputComponent = vidom.createComponent({
        render : function() {
            return vidom.createNode('div')
                .attrs({ className : 'input' })
                .children(vidom.createNode('input').attrs({ type : 'text', className : 'input__control' }));
        },
        
        onMount : function() {
        },
        
        onUnmount : function() {
        }
    });
```
