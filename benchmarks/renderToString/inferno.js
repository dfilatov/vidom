"use strict";

// inferno-component doesn't work on server because uses window
global.window = { screen : {} };

const Inferno = require('inferno'),
    Component = require('inferno-component'),
    InfernoServer = require('inferno-server'),
    createElement = require('inferno-create-element');

class App extends Component {
    render() {
        const childrenNum = this.props.childrenNum;

        return createElement('div', { className : 'app' }, [
            createElement(Header, { childrenNum }),
            createElement(Content, { childrenNum }),
            createElement(Footer, { childrenNum })
        ]);
    }
}

class Header extends Component {
    render() {
        const childrenNum = this.props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(createElement('div', { id : 'header-' + i++ }));
        }

        return createElement('div', { className : 'header' }, children);
    }
}

class Content extends Component {
    render() {
        const childrenNum = this.props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(
                createElement('b', null, 'bold' + i),
                createElement(
                    'span',
                    { className : 'input' },
                    createElement(ContentItem, { value : 'input-' + i })),
                createElement('i', null, 'italic' + i++),
                createElement(
                    'div',
                    null,
                    createElement(
                        'div',
                        null,
                        createElement(
                            'div',
                            null,
                            createElement(
                                'div',
                                null,
                                'div')))));
        }

        return createElement('div', { className : 'header' }, children);
    }
}

class ContentItem extends Component {
    render() {
        return createElement('input', { value : this.props.value });
    }
}

class Footer extends Component {
    render() {
        const childrenNum = this.props.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(createElement('div', { id : 'footer-' + i++ }));
        }

        return createElement('div', { className : 'footer' }, children);
    }
}

module.exports = childrenNum => () => InfernoServer.renderToString(createElement(App, { childrenNum }));
