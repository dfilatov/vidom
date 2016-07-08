# vidom [![Build Status](https://secure.travis-ci.org/dfilatov/vidom.png)](http://travis-ci.org/dfilatov/vidom) [![npm version](https://badge.fury.io/js/vidom.svg)](http://badge.fury.io/js/vidom)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/dfilatov81.svg)](https://saucelabs.com/u/dfilatov81)

Vidom is just a library to build UI. It's highly inspired and based on ideas from [React](https://facebook.github.io/react/). Its main goal is to provide as fast as possible lightweight implementation with API similar to React. According to the corresponding benchmarks Vidom is 6x faster in Chrome, 5x faster in Firefox, 2x faster in IE and 10x faster in server-side rendering than React.

## Main features
  * Fast virtual DOM builder and patcher under the hood
  * Easy and clear way to subscribe to DOM Events
  * API to build your own high-level components
  * Server-side rendering with ability to reuse existing DOM in the browsers also known as isomorphism.
  * Namespaces support (e.g., SVG, MathML)
  * Ability to render multiple components without unwanted DOM wrappers
  * No extra markup in the result HTML
  * JSX support via babel plugin
  * Small footprint, about 8KB after gzip
  
## Benchmarks
  * [repaint rate challenge](http://mathieuancelin.github.io/js-repaint-perfs/)
  * [vdom-benchmark](http://vdom-benchmark.github.io/vdom-benchmark/)
  * [uibench](https://localvoid.github.io/uibench/)
  * server-side rendering
    
    <img src="https://img-fotki.yandex.ru/get/135076/58414218.1/0_f697b_9ef2325e_orig" width="254" height="76">

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
 
## Examples
  * [TodoMVC](http://dfilatov.github.io/vidom-todomvc/) ([source](https://github.com/dfilatov/vidom-todomvc))
  
## Thanks
  * [cdnjs](https://github.com/cdnjs/cdnjs) for library is avalaible on CDN.
