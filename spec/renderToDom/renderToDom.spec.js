import { elem, createComponent } from '../../src/vidom';

describe('renderToDom', () => {
    let topNode;

    afterEach(() => {
        topNode.unmount();
    });

    describe('tag', () => {
        it('should be rendered properly', () => {
            expect((topNode = elem('span')).renderToDom(null).tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect((topNode = elem('div')).renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', () => {
            expect((topNode = elem('svg')).setNs('http://www.w3.org/2000/svg').renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            const domNode = (topNode = elem('svg'))
                .setNs('http://www.w3.org/2000/svg')
                .setChildren(elem('g').setChildren(elem('circle')))
                .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = (topNode = elem('div')).setChildren([elem('span'), elem('img')]).renderToDom(null);

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = (topNode = elem('textarea')).setAttrs({ cols : 5, rows : 2, disabled : true }).renderToDom(null);

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('shouldn\'t render falsy boolean attribute', () => {
            const domNode = (topNode = elem('textarea')).setAttrs({ disabled : false }).renderToDom(null);

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should be rendered as properties', () => {
            const domNode = (topNode = elem('input')).setAttrs({ type : 'radio', checked : true }).renderToDom(null);
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = (topNode = elem('div')).setAttrs({ style : { width : '100px', display : 'none' } }).renderToDom(null);

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = (topNode = elem('input')).setAttrs({ value : null }).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = (topNode = elem('input')).setAttrs({ 'class' : undefined }).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = (topNode = elem('div')).setAttrs({ 'data-id' : '123' }).renderToDom(null);

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = (topNode = elem('div')).setAttrs({ 'custom-attr' : '123' }).renderToDom(null);

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode = (topNode = elem('div')).setChildren([
                elem('label').setAttrs({ 'for' : 'id1', 'class' : 'c1' }),
                elem('label').setAttrs({ htmlFor : 'id1', className : 'c1' })
            ]).renderToDom(null);

            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as a wrapped text node', () => {
            const domNode = (topNode = elem('span')).setChildren('some text').renderToDom(null);

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });

        it('should not render booleans in a wrapped text node', () => {
            const domNode = (topNode = elem('span')).setChildren(true).renderToDom(null);

            expect(domNode.childNodes.length).to.equal(0);
        });

        it('should be rendered as a plain text node', () => {
            const domNode = (topNode = elem('div')).setChildren([
                elem('plaintext').setChildren('text1'),
                elem('plaintext').setChildren(''),
                elem('plaintext').setChildren('text2')
            ]).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<!---->text1<!----><!----><!----><!---->text2<!---->');
        });

        it('should not render booleans in a plain text node', () => {
            const domNode = (topNode = elem('div')).setChildren([
                elem('plaintext').setChildren(true),
                elem('plaintext').setChildren(false)
            ]).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<!----><!----><!----><!---->');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = (topNode = elem('span')).setHtml('<span></span><i></i>').renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should not render "null"', () => {
            const domNode = (topNode = elem('span')).setHtml(null).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "undefined"', () => {
            const domNode = (topNode = elem('span')).setHtml(undefined).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "true"', () => {
            const domNode = (topNode = elem('span')).setHtml(true).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "false"', () => {
            const domNode = (topNode = elem('span')).setHtml(false).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });
    });

    describe('fragment', () => {
        it('should be rendered without own node', () => {
            const domNode = (topNode = elem('div')).setChildren([
                elem('a'),
                elem('fragment').setChildren([
                    elem('i'),
                    elem('fragment').setChildren([
                        elem('span'),
                        elem('dl')
                    ]),
                    elem('img')]),
                elem('b')
            ]).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><i></i><!----><span></span><dl></dl><!----><img><!----><b></b>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = (topNode = elem('select'))
                .setAttrs({ value : 2 })
                .setChildren([
                    elem('option').setAttrs({ value : 1 }),
                    elem('option').setAttrs({ value : 2 })
                ])
                .renderToDom(null);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = (topNode = elem('select'))
                .setAttrs({ multiple : true, value : [2, 3] })
                .setChildren([
                    elem('option').setAttrs({ value : 1 }),
                    elem('option').setAttrs({ value : 2 }),
                    elem('option').setAttrs({ value : 3 })
                ])
                .renderToDom(null);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
            expect(domNode.childNodes[2].selected).to.equal(true);
        });
    });

    describe('component', () => {
        it('should be rendered as component', () => {
            const Component = createComponent({
                    onRender() {
                        return elem('div').setAttrs(this.attrs).setChildren([
                            elem('a'),
                            elem('span')
                        ].concat(this.children));
                    }
                }),
                domNode = (topNode = elem(Component)).setAttrs({ id : 'id1' }).setChildren(elem('i')).renderToDom(null);

            expect(domNode.tagName)
                .to.equal('DIV');
            expect(domNode.getAttribute('id'))
                .to.equal('id1');
            expect(domNode.children.length)
                .to.equal(3);
            expect(domNode.children[0].tagName)
                .to.equal('A');
            expect(domNode.children[1].tagName)
                .to.equal('SPAN');
            expect(domNode.children[2].tagName)
                .to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = createComponent({
                    onRender() {
                        return elem('circle');
                    }
                }),
                domNode = (topNode = elem('svg'))
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(elem('g').setChildren(elem(Component)))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be rendered as an empty comment if onRender() returns null', () => {
            const Component = createComponent({
                    onRender() {
                        return null;
                    }
                }),
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as an empty comment if onRender() returns undefined', () => {
            const Component = createComponent({
                    onRender() {
                        return undefined;
                    }
                }),
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as an empty comment if onRender() returns boolean', () => {
            const Component = createComponent({
                    onRender() {
                        return true;
                    }
                }),
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as a fragment if onRender() returns string', () => {
            const Component = createComponent({
                    onRender() {
                        return 'text';
                    }
                }),
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });

        it('should be rendered as a fragment if onRender() returns array', () => {
            const Component = createComponent({
                    onRender() {
                        return [elem('div'), elem('span')];
                    }
                }),
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                    return elem('div').setAttrs(attrs).setChildren([
                        elem('a'),
                        elem('span')
                    ].concat(content));
                },
                domNode = (topNode = elem(Component)).setAttrs({ id : 'id1' }).setChildren(elem('i')).renderToDom(null);

            expect(domNode.tagName)
                .to.equal('DIV');
            expect(domNode.getAttribute('id'))
                .to.equal('id1');
            expect(domNode.children.length)
                .to.equal(3);
            expect(domNode.children[0].tagName)
                .to.equal('A');
            expect(domNode.children[1].tagName)
                .to.equal('SPAN');
            expect(domNode.children[2].tagName)
                .to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = () => elem('circle'),
                domNode = (topNode = elem('svg'))
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(elem('g').setChildren(elem(Component)))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be rendered as any empty comment if it returns null', () => {
            const Component = () => null,
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as an empty comment if it returns undefined', () => {
            const Component = () => undefined,
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as an empty comment if it returns boolean', () => {
            const Component = () => true,
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as a fragment if it returns string', () => {
            const Component = () => 'text',
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });

        it('should be rendered as a fragment if it returns array', () => {
            const Component = () => [elem('div'), elem('span')],
                domNode = (topNode = elem(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });
    });
});
