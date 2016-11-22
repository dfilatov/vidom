"use strict";

// inferno-component doesn't work on server because uses window
global.window = { screen : {} };

const Inferno = require('inferno');
const InfernoServer = require('inferno-server');
const InfernoComponent = require('inferno-component');

const createVNode = Inferno.createVNode;

class App extends InfernoComponent {
    render(props) {
        const childrenNum = props.childrenNum;

        return createVNode(66, 'div', { className : 'app' }, [
            createVNode(4, Header, { childrenNum }, null, null, null, true),
            createVNode(4, Content, { childrenNum }, null, null, null, true),
            createVNode(4, Footer, { childrenNum }, null, null, null, true)
        ], null, null, false);
    }
}

class Header extends InfernoComponent {
    render(props) {
        const childrenNum = props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(createVNode(2, 'div', { id : 'header-' + i++ }, null, null, null, true));
        }

        return createVNode(2, 'div', { className : 'header' }, children, null, null, true);
    }
}

class Content extends InfernoComponent {
    render(props) {
        const childrenNum = props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(
                createVNode(2, 'b', null, 'bold' + i, null, null, null, true),
                createVNode(2,
                    'span',
                    { className : 'link' },
                    createVNode(4, Link, {
                        href : '/',
                        value : 'link-' + i
                    }, null, null, null, true), null, null, true),
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
}

class Link extends InfernoComponent {
    render(props) {
        return createVNode(2, 'a', { href : props.href }, props.value, null, null, true);
    }
}

class Footer extends InfernoComponent {
    render(props) {
        const childrenNum = props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(createVNode(2, 'div', { id : 'footer-' + i++ }, null, null, true));
        }

        return createVNode(2, 'div', { className : 'footer' }, children, null, null, true);
    }
}

module.exports = childrenNum => () => InfernoServer.renderToString(createVNode(4, App, { childrenNum }, null, null, null, true));
