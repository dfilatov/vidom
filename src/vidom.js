import createElement from './createElement';
import createComponent from './createComponent';
import renderToString from './renderToString';
import Component from './Component';
import nodeToElement from './nodes/utils/nodeToElement';
import nodeToElements from './nodes/utils/nodeToElements';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';
import './globalHook';

export * from './client/mounter';

export {
    createElement as elem,
    createComponent,
    renderToString,
    nodeToElement as toElem,
    nodeToElements as toElems,
    IS_DEBUG,
    console,
    Component
};
