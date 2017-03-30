import { node, createComponent } from '../../src/vidom';

describe('renderToDom', () => {
    let topNode;

    afterEach(() => {
        topNode.unmount();
    });

    describe('tag', () => {
        it('should be rendered properly', () => {
            expect((topNode = node('span')).renderToDom(null).tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect((topNode = node('div')).renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', () => {
            expect((topNode = node('svg')).setNs('http://www.w3.org/2000/svg').renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            const domNode = (topNode = node('svg'))
                .setNs('http://www.w3.org/2000/svg')
                .setChildren(node('g').setChildren(node('circle')))
                .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = (topNode = node('div')).setChildren([node('span'), node('img')]).renderToDom(null);

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = (topNode = node('textarea')).setAttrs({ cols : 5, rows : 2, disabled : true }).renderToDom(null);

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('shouldn\'t render falsy boolean attribute', () => {
            const domNode = (topNode = node('textarea')).setAttrs({ disabled : false }).renderToDom(null);

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should be rendered as properties', () => {
            const domNode = (topNode = node('input')).setAttrs({ type : 'radio', checked : true }).renderToDom(null);
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = (topNode = node('div')).setAttrs({ style : { width : '100px', display : 'none' } }).renderToDom(null);

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = (topNode = node('input')).setAttrs({ value : null }).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = (topNode = node('input')).setAttrs({ 'class' : undefined }).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = (topNode = node('div')).setAttrs({ 'data-id' : '123' }).renderToDom(null);

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = (topNode = node('div')).setAttrs({ 'custom-attr' : '123' }).renderToDom(null);

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode = (topNode = node('div')).setChildren([
                node('label').setAttrs({ 'for' : 'id1', 'class' : 'c1' }),
                node('label').setAttrs({ htmlFor : 'id1', className : 'c1' })
            ]).renderToDom(null);

            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            const domNode = (topNode = node('span')).setChildren('some text').renderToDom(null);

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });

        it('should be rendered as a text node', () => {
            const domNode = (topNode = node('div')).setChildren([
                node('text').setChildren('text1'),
                node('text').setChildren(''),
                node('text').setChildren('text2')
            ]).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<!---->text1<!----><!----><!----><!---->text2<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = (topNode = node('span')).setHtml('<span></span><i></i>').renderToDom(null);

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('fragment', () => {
        it('should be rendered without own node', () => {
            const domNode = (topNode = node('div')).setChildren([
                node('a'),
                node('fragment').setChildren([
                    node('i'),
                    node('fragment').setChildren([
                        node('span'),
                        node('dl')
                    ]),
                    node('img')]),
                node('b')
            ]).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><i></i><!----><span></span><dl></dl><!----><img><!----><b></b>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = (topNode = node('select'))
                .setAttrs({ value : 2 })
                .setChildren([
                    node('option').setAttrs({ value : 1 }),
                    node('option').setAttrs({ value : 2 })
                ])
                .renderToDom(null);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = (topNode = node('select'))
                .setAttrs({ multiple : true, value : [2, 3] })
                .setChildren([
                    node('option').setAttrs({ value : 1 }),
                    node('option').setAttrs({ value : 2 }),
                    node('option').setAttrs({ value : 3 })
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
                        return node('div').setAttrs(this.attrs).setChildren([
                            node('a'),
                            node('span')
                        ].concat(this.children));
                    }
                }),
                domNode = (topNode = node(Component)).setAttrs({ id : 'id1' }).setChildren(node('i')).renderToDom(null);

            expect(domNode.tagName).to.equal('DIV');
            expect(domNode.getAttribute('id')).to.equal('id1');
            expect(domNode.children.length).to.equal(3);
            expect(domNode.children[0].tagName).to.equal('A');
            expect(domNode.children[1].tagName).to.equal('SPAN');
            expect(domNode.children[2].tagName).to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = createComponent({
                    onRender() {
                        return node('circle');
                    }
                }),
                domNode = (topNode = node('svg'))
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('g').setChildren(node(Component)))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                    onRender() {}
                }),
                domNode = (topNode = node(Component)).renderToDom(null);

            expect(domNode.nodeType).to.equal(Node.COMMENT_NODE);
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                    return node('div').setAttrs(attrs).setChildren([
                        node('a'),
                        node('span')
                    ].concat(content));
                },
                domNode = (topNode = node(Component)).setAttrs({ id : 'id1' }).setChildren(node('i')).renderToDom(null);

            expect(domNode.tagName).to.equal('DIV');
            expect(domNode.getAttribute('id')).to.equal('id1');
            expect(domNode.children.length).to.equal(3);
            expect(domNode.children[0].tagName).to.equal('A');
            expect(domNode.children[1].tagName).to.equal('SPAN');
            expect(domNode.children[2].tagName).to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = () => node('circle'),
                domNode = (topNode = node('svg'))
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('g').setChildren(node(Component)))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = () => {},
                domNode = (topNode = node(Component)).renderToDom(null);

            expect(domNode.nodeType).to.equal(Node.COMMENT_NODE);
        });
    });
});
