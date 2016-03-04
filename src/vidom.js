import createNode from './createNode';
import createComponent from './createComponent';
import renderToString from './renderToString';
import normalizeChildren from './utils/normalizeChildren';
import Component from './Component';
import console from './utils/console';
import './globalHook';

if(process.env.NODE_ENV !== 'production') {
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
