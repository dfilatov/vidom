import createElement from './createElement';
import createComponent from './createComponent';
import renderToString from './renderToString';
import Component from './Component';
import console from './utils/console';
import { IS_DEBUG } from './utils/debug';
import './globalHook';

export * from './client/mounter';

export {
    createElement as elem,
    createComponent,
    renderToString,
    IS_DEBUG,
    console,
    Component
};
