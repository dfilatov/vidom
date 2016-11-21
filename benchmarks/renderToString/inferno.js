"use strict";

// inferno-component doesn't work on server because uses window
global.window = { screen : {} };

const Inferno = require('inferno');
const InfernoServer = require('inferno-server');

const createVNode = Inferno.createVNode;

function App(props) {
    const childrenNum = props.childrenNum;

    return createVNode(66, 'div', { className : 'app' }, [
        createVNode(8, Header, { childrenNum }, null, null, null, true),
        createVNode(8, Content, { childrenNum }, null, null, null, true),
        createVNode(8, Footer, { childrenNum }, null, null, null, true)
    ], null, null, false);
}

function Header(props) {
    const childrenNum = props.childrenNum,
        children = [];
    let i = 0;

    while(i < childrenNum) {
        children.push(createVNode(2, 'div', { id : 'header-' + i++ }, null, null, null, true));
    }

    return createVNode(2, 'div', { className : 'header' }, children, null, null, true);
}

function Content(props) {
    const childrenNum = props.childrenNum,
        children = [];
    let i = 0;

    while(i < childrenNum) {
        children.push(
            createVNode(2, 'b', null, 'bold' + i, null, null, null, true),
            createVNode(2, 
                'span',
                { className : 'link' },
                createVNode(8, Link, { href : '/', value : 'link-' + i }, null, null, null, true), null, null, true),
            createVNode(2, 'i', null, 'italic' + i++, null, null, true),
            createVNode(2, 
                'div',
                null,
                createVNode(2,
                    'div',
                    null,
                    createVNode(2,
                        'div',
                        null,
                        createVNode(2,
                            'div',
                            null,
                            'div', null, null, true), null, null, true), null, null, true), null, null, true));
    }

    return createVNode(66, 'div', { className : 'header' }, children, null, null, true);
}

function Link(props) {
    return createVNode(2, 'a', { href : props.href }, props.value, null, null, true);
}

function Footer(props) {
    const childrenNum = props.childrenNum,
        children = [];
    let i = 0;

    while(i < childrenNum) {
        children.push(createVNode(2, 'div', { id : 'footer-' + i++ }, null, null, true));
    }

    return createVNode(2, 'div', { className : 'footer' }, children, null, null, true);
}

module.exports = childrenNum => () => InfernoServer.renderToString(createVNode(8, App, { childrenNum }, null, null, null, true));
