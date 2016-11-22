# vidom
[![Build Status](https://img.shields.io/travis/dfilatov/vidom/master.svg?style=flat-square)](https://travis-ci.org/dfilatov/vidom/branches)
[![NPM Version](https://img.shields.io/npm/v/vidom.svg?style=flat-square)](https://www.npmjs.com/package/vidom)
[![Dependencies](https://img.shields.io/david/dfilatov/vidom.svg?style=flat-square)](https://david-dm.org/dfilatov/vidom)
[![NPM Downloads](https://img.shields.io/npm/dm/vidom.svg?style=flat-square)](https://www.npmjs.org/package/vidom)
<!---[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)/]-->

Vidom is just a library to build UI. It's highly inspired and based on ideas from [React](https://facebook.github.io/react/). Its main goal is to provide as fast as possible lightweight implementation with API similar to React. According to the corresponding benchmarks Vidom is 6x faster in Chrome, 5x faster in Firefox, 2x faster in IE and 10x faster in server-side rendering than React.

## Main features
  * Fast virtual DOM builder and patcher under the hood
  * Fast server-side rendering with ability to reuse existing DOM in the browsers also known as isomorphism.
  * Easy and clear way to subscribe to DOM Events
  * API to build your own high-level components
  * Namespaces support (e.g., SVG, MathML)
  * Ability to render multiple components without unwanted DOM wrappers
  * No extra markup in the result HTML
  * JSX support via [babel plugin](https://github.com/dfilatov/babel-plugin-vidom-jsx)
  * Small footprint, 9KB after gzip
  * Zero dependencies
  
## Benchmarks
  * [repaint rate challenge](http://mathieuancelin.github.io/js-repaint-perfs/)
  * [vdom-benchmark](http://vdom-benchmark.github.io/vdom-benchmark/)
  * [uibench](https://localvoid.github.io/uibench/)
  * server-side rendering (nodejs 4.6.2)
```    
                         mean time ops/sec
  vidom v0.5.4           1.717ms   582
  inferno v1.0.0-beta13  1.805ms   554
  react v15.4.0          18.482ms  54
```

## Documentation
  * [Getting started](../../wiki/Getting-started)
  * [Tutorial](../../wiki/Tutorial)
  * [Top-level API](../../wiki/Top-Level-API)
  * [TagNode API](../../wiki/TagNode-API)
  * [FragmentNode API](../../wiki/FragmentNode-API)
  * [ComponentNode API](../../wiki/ComponentNode-API)
  * [FunctionComponentNode API](../../wiki/FunctionComponentNode-API)
  * [DOM Events API](../../wiki/DOM-Events-API)
  * [Component lifecycle](../../wiki/Component-lifecycle)
  * [Component methods](../../wiki/Component-methods)
  * [Function component](../../wiki/Function-Component)
  * [JSX](../../wiki/JSX)
  * [Isomorphism](../../wiki/Isomorphism)
  * [FAQ](../../wiki/FAQ)
  * [Changelog](../../releases)

## Tools
  * [Vidom inspector](https://github.com/dfilatov/vidom-inspector) developer tool which helps debug vidom-based applications
   
## Addons
  * [vidom-css-animation-group](https://github.com/dfilatov/vidom-css-animation-group) API for "appearance", "entering" and "leaving" animation via CSS transitions and animation
  * [vidom-redux](https://github.com/dfilatov/vidom-redux) Redux bindings 
 
## Examples
  * [TodoMVC](http://dfilatov.github.io/vidom-todomvc/) ([source](https://github.com/dfilatov/vidom-todomvc))
  
## Thanks
  * [cdnjs](https://github.com/cdnjs/cdnjs) for library is avalaible on CDN.
