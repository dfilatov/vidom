# vidom
[![Build Status](https://img.shields.io/travis/dfilatov/vidom/master.svg?style=flat-square)](https://travis-ci.org/dfilatov/vidom/branches)
[![NPM Version](https://img.shields.io/npm/v/vidom.svg?style=flat-square)](https://www.npmjs.com/package/vidom)
[![Dependencies](https://img.shields.io/david/dfilatov/vidom.svg?style=flat-square)](https://david-dm.org/dfilatov/vidom)
[![NPM Downloads](https://img.shields.io/npm/dm/vidom.svg?style=flat-square)](https://www.npmjs.org/package/vidom)
<!---[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)/]-->

Vidom is just a library to build UI. It's highly inspired from [React](https://facebook.github.io/react/) and based on the same ideas. Its main goal is to provide as fast as possible lightweight implementation with API similar to React.

## Main features
  * Fast virtual DOM builder and patcher under the hood
  * Update batching and synchronization with browsers rendering lifecycle by default
  * Fast server-side rendering with ability to reuse existing DOM in the browsers also known as isomorphism
  * Easy and clear way to subscribe to DOM Events
  * API to build your own high-level components  
  * Namespaces support (e.g., SVG, MathML)
  * Ability to render multiple components without unwanted DOM wrappers
  * No extra markup in the result HTML
  * JSX support via [babel plugin](https://github.com/dfilatov/babel-plugin-vidom-jsx)
  * TypeScript support
  * Small footprint, 9KB after gzip
  * Zero dependencies
  
## Benchmarks
  * [repaint rate challenge](http://mathieuancelin.github.io/js-repaint-perfs/)
  * [vdom-benchmark](http://vdom-benchmark.github.io/vdom-benchmark/)
  * [uibench](https://localvoid.github.io/uibench/)
  * server-side rendering (nodejs 8.8.1)
```
                   mean time ops/sec
  vidom v0.9.23    0.505ms   1981
  inferno v3.10.1  0.511ms   1958
  preact v8.2.6    1.414ms   707
  react v16.0.0    1.479ms   676
  vue v2.5.2       8.883ms   113
```

## Playground
Try [live playground](http://dfilatov.github.io/vidom/playground/) to play with Vidom in your browser.

## Documentation
  * [Getting started](../../wiki/Getting-started)
  * [Tutorial](../../wiki/Tutorial)
  * [Top-level API](../../wiki/Top-Level-API)
  * [DOM Events API](../../wiki/DOM-Events-API)
  * [Component properties](../../wiki/Component-properties)
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
  * [vidom-ui](https://dfilatov.github.io/vidom-ui/) Set of basic UI components
  * [vidom-redux](https://github.com/dfilatov/vidom-redux) Redux bindings 
 
## Examples
  * [TodoMVC](http://dfilatov.github.io/vidom-todomvc/) ([source](https://github.com/dfilatov/vidom-todomvc))
  
## Thanks
  * [cdnjs](https://github.com/cdnjs/cdnjs) for library is avalaible on CDN.
