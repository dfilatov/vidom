import { node, createComponent } from '../../src/vidom';

describe('renderToDom', () => {
    let topNode;

    afterEach(() => {
        topNode.unmount();
    });

    describe('tag', () => {
        it('should be rendered properly', () => {
            expect((topNode = node('span')).renderToDom().tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect((topNode = node('div')).renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', () => {
            expect((topNode = node('svg')).ns('http://www.w3.org/2000/svg').renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            var domNode = (topNode = node('svg'))
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('circle')))
                    .renderToDom();

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = (topNode = node('div')).children([node('span'), node('img')]).renderToDom();

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = (topNode = node('textarea')).attrs({ cols : 5, rows : 2, disabled : true }).renderToDom();

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('shouldn\'t render falsy boolean attribute', () => {
            const domNode = (topNode = node('textarea')).attrs({ disabled : false }).renderToDom();

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should be rendered as properties', () => {
            const domNode = (topNode = node('input')).attrs({ type : 'radio', checked : true }).renderToDom();
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = (topNode = node('div')).attrs({ style : { width : '100px', display : 'none' } }).renderToDom();

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = (topNode = node('input')).attrs({ value : null }).renderToDom();

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = (topNode = node('input')).attrs({ 'class' : undefined }).renderToDom();

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = (topNode = node('div')).attrs({ 'data-id' : '123' }).renderToDom();

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = (topNode = node('div')).attrs({ 'custom-attr' : '123' }).renderToDom();

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode = (topNode = node('div')).children([
                node('label').attrs({ 'for' : 'id1', 'class' : 'c1' }),
                node('label').attrs({ htmlFor : 'id1', className : 'c1' })
            ]).renderToDom();

            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            const domNode = (topNode = node('span')).children('some text').renderToDom();

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });

        it('should be rendered as a text node', () => {
            const domNode = (topNode = node('div')).children([
                node('text').children('text1'),
                node('text').children(''),
                node('text').children('text2')
            ]).renderToDom();

            expect(domNode.innerHTML)
                .to.equal('<!---->text1<!----><!----><!----><!---->text2<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = (topNode = node('span')).html('<span></span><i></i>').renderToDom();

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('fragment', () => {
        it('should be rendered without own node', () => {
            const domNode = (topNode = node('div')).children([
                node('a'),
                node('fragment').children([
                    node('i'),
                    node('fragment').children([
                        node('span'),
                        node('dl')
                    ]),
                    node('img')]),
                node('b')
            ]).renderToDom();

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><i></i><!----><span></span><dl></dl><!----><img><!----><b></b>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = (topNode = node('select'))
                .attrs({ value : 2 })
                .children([
                    node('option').attrs({ value : 1 }),
                    node('option').attrs({ value : 2 })
                ])
                .renderToDom();

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = (topNode = node('select'))
                .attrs({ multiple : true, value : [2, 3] })
                .children([
                    node('option').attrs({ value : 1 }),
                    node('option').attrs({ value : 2 }),
                    node('option').attrs({ value : 3 })
                ])
                .renderToDom();

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
            expect(domNode.childNodes[2].selected).to.equal(true);
        });
    });

    describe('component', () => {
        it('should be rendered as component', () => {
            const Component = createComponent({
                    onRender(attrs, content) {
                        return node('div').attrs(attrs).children([
                            node('a'),
                            node('span')
                        ].concat(content));
                    }
                }),
                domNode = (topNode = node(Component)).attrs({ id : 'id1' }).children(node('i')).renderToDom();

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
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node(Component)))
                    .renderToDom();

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                    onRender() {}
                }),
                domNode = (topNode = node(Component)).renderToDom();

            expect(domNode.nodeType).to.equal(Node.COMMENT_NODE);
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                    return node('div').attrs(attrs).children([
                        node('a'),
                        node('span')
                    ].concat(content));
                },
                domNode = (topNode = node(Component)).attrs({ id : 'id1' }).children(node('i')).renderToDom();

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
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node(Component)))
                    .renderToDom();

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = () => {},
                domNode = (topNode = node(Component)).renderToDom();

            expect(domNode.nodeType).to.equal(Node.COMMENT_NODE);
        });
    });
});
