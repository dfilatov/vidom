"use strict";

const vidom = require('vidom'),
    node = vidom.node;

class App extends vidom.Component {
    onRender(attrs) {
        const childrenNum = attrs.childrenNum;

        return node('div').attrs({ className : 'app' }).children([
            node(Header).attrs({ childrenNum }),
            node(Content).attrs({ childrenNum }),
            node(Footer).attrs({ childrenNum })
        ]);
    }
}

class Header extends vidom.Component {
    onRender(attrs) {
        const childrenNum = attrs.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(node('div').attrs({ id : 'header-' + i++ }));
        }

        return node('div').attrs({ className : 'header' }).children(children);
    }
}

class Content extends vidom.Component {
    onRender(attrs) {
        const childrenNum = attrs.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(
                node('b').children('bold' + i),
                node('span')
                    .attrs({ className : 'link' })
                    .children(node(Link).attrs({ href : '/', value : 'link-' + i })),
                node('i').children('italic' + i++),
                node('div').children(
                    node('div').children(
                        node('div').children(
                            node('div').children('div')))));
        }

        return node('div').attrs({ className : 'header' }).children(children);
    }
}

class Link extends vidom.Component {
    onRender(attrs) {
        return node('a').attrs({ href : attrs.href }).children(attrs.value);
    }
}

class Footer extends vidom.Component {
    onRender(attrs) {
        const childrenNum = attrs.childrenNum,
            children = [];
        let i = 0;

        while(i < childrenNum) {
            children.push(node('div').attrs({ id : 'footer-' + i++ }));
        }

        return node('div').attrs({ className : 'footer' }).children(children);
    }
}

module.exports = childrenNum => () => vidom.renderToString(node(App).attrs({ childrenNum }));
