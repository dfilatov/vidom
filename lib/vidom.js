import createNode from './createNode';
import createComponent from './createComponent';
import renderToString from './renderToString';
import Component from './Component';

if(process.env.NODE_ENV !== "production") {
    console.log('You\'re using dev version of vidom');
}

export * from './client/mounter';

export {
    createNode as node,
    createComponent,
    renderToString,
    Component
}
