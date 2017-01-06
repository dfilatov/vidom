import createNode from './createNode';
import createComponent from './createComponent';
import renderToString from './renderToString';
import normalizeChildren from './utils/normalizeChildren';
import Component from './Component';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';
import './globalHook';

export * from './client/mounter';

export {
    createNode as node,
    createComponent,
    renderToString,
    normalizeChildren,
    IS_DEBUG,
    console,
    Component
};
