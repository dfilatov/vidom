import { node, createComponent } from '../../src/vidom';
import TopNode from '../../src/nodes/TopNode';

describe('renderToDom', () => {
    let topNode;

    beforeEach(() => {
        topNode = new TopNode();
    });

    describe('tag', () => {
        it('should be rendered properly', () => {
            expect(node('span').renderToDom(topNode).tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect(node('div').renderToDom(topNode).namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', () => {
            expect(node('svg').ns('http://www.w3.org/2000/svg').renderToDom(topNode).namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            var domNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('circle')))
                    .renderToDom(topNode);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = node('div').children([node('span'), node('img')]).renderToDom(topNode);

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = node('textarea').attrs({ cols : 5, rows : 2, disabled : true }).renderToDom(topNode);

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('shouldn\'t render falsy boolean attribute', () => {
            const domNode = node('textarea').attrs({ disabled : false }).renderToDom(topNode);

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should be rendered as properties', () => {
            const domNode = node('input').attrs({ type : 'radio', checked : true }).renderToDom(topNode);
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = node('div').attrs({ style : { width : '100px', display : 'none' } }).renderToDom(topNode);

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = node('input').attrs({ value : null }).renderToDom(topNode);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = node('input').attrs({ 'class' : undefined }).renderToDom(topNode);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = node('div').attrs({ 'data-id' : '123' }).renderToDom(topNode);

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = node('div').attrs({ 'custom-attr' : '123' }).renderToDom(topNode);

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode1 = node('label').attrs({ 'for' : 'id1', 'class' : 'c1' }).renderToDom(topNode),
                domNode2 = node('label').attrs({ htmlFor : 'id1', className : 'c1' }).renderToDom(topNode);

            expect(domNode1.className).to.equal('c1');
            expect(domNode1.getAttribute('for')).to.equal('id1');
            expect(domNode2.className).to.equal('c1');
            expect(domNode2.getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            const domNode = node('span').children('some text').renderToDom(topNode);

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = node('span').html('<span></span><i></i>').renderToDom(topNode);

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('fragment', () => {
        it('should be rendered without own node', () => {
            const domNode = node('div').children([
                node('a'),
                node('fragment').children([
                    node('i'),
                    node('fragment').children([
                        node('span'),
                        node('dl')
                    ]),
                    node('img')]),
                node('b')
            ]).renderToDom(topNode);

            expect(domNode.innerHTML).to.equal('<a></a><i></i><span></span><dl></dl><!----><img><!----><b></b>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = node('select')
                .attrs({ value : 2 })
                .children([
                    node('option').attrs({ value : 1 }),
                    node('option').attrs({ value : 2 })
                ])
                .renderToDom(topNode);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = node('select')
                .attrs({ multiple : true, value : [2, 3] })
                .children([
                    node('option').attrs({ value : 1 }),
                    node('option').attrs({ value : 2 }),
                    node('option').attrs({ value : 3 })
                ])
                .renderToDom(topNode);

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
                domNode = node(Component).attrs({ id : 'id1' }).children(node('i')).renderToDom(topNode);

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
                domNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node(Component)))
                    .renderToDom(topNode);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render <noscript/> if onRender() returns nothing', () => {
            const Component = createComponent({
                    onRender() {}
                }),
                domNode = node(Component).renderToDom(topNode);

            expect(domNode.tagName).to.equal('NOSCRIPT');
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
                domNode = node(Component).attrs({ id : 'id1' }).children(node('i')).renderToDom(topNode);

            expect(domNode.tagName).to.equal('DIV');
            expect(domNode.getAttribute('id')).to.equal('id1');
            expect(domNode.children.length).to.equal(3);
            expect(domNode.children[0].tagName).to.equal('A');
            expect(domNode.children[1].tagName).to.equal('SPAN');
            expect(domNode.children[2].tagName).to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = () => node('circle'),
                domNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node(Component)))
                    .renderToDom(topNode);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render <noscript/> if onRender() returns nothing', () => {
            const Component = () => {},
                domNode = node(Component).renderToDom(topNode);

            expect(domNode.tagName).to.equal('NOSCRIPT');
        });
    });
});
