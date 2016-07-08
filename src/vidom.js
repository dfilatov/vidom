import createNode from './createNode';
import createComponent from './createComponent';
import renderToString from './renderToString';
import normalizeChildren from './utils/normalizeChildren';
import Component from './Component';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';
import './globalHook';

if(IS_DEBUG) {
    console.info('You\'re using dev version of Vidom');
}

export * from './client/mounter';

export {
    createNode as node,
    createComponent,
    renderToString,
    normalizeChildren,
    Component
}
