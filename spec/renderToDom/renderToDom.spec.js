import createNode from '../../src/createNode';
import createComponent from '../../src/createComponent';

describe('renderToDom', () => {
    describe('tag', () => {
        it('should be rendered properly', () => {
            expect(createNode('span').renderToDom().tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect(createNode('div').renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', () => {
            expect(createNode('svg').ns('http://www.w3.org/2000/svg').renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            var domNode = createNode('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(createNode('g').children(createNode('circle')))
                    .renderToDom();

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = createNode('div').children([createNode('span'), createNode('img')]).renderToDom();

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = createNode('textarea').attrs({ cols : 5, rows : 2, disabled : true }).renderToDom();

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('should be rendered as properties', () => {
            const domNode = createNode('input').attrs({ type : 'radio', checked : true }).renderToDom();
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = createNode('div').attrs({ style : { width : '100px', display : 'none' } }).renderToDom();

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = createNode('input').attrs({ value : null }).renderToDom();

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = createNode('input').attrs({ 'class' : undefined }).renderToDom();

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = createNode('div').attrs({ 'data-id' : '123' }).renderToDom();

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = createNode('div').attrs({ 'custom-attr' : '123' }).renderToDom();

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode1 = createNode('label').attrs({ 'for' : 'id1', 'class' : 'c1' }).renderToDom(),
                domNode2 = createNode('label').attrs({ htmlFor : 'id1', className : 'c1' }).renderToDom();

            expect(domNode1.className).to.equal('c1');
            expect(domNode1.getAttribute('for')).to.equal('id1');
            expect(domNode2.className).to.equal('c1');
            expect(domNode2.getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            const domNode = createNode('span').children('some text').renderToDom();

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = createNode('span').html('<span></span><i></i>').renderToDom();

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = createNode('select')
                    .attrs({ value : 2 })
                    .children([
                            createNode('option').attrs({ value : 1 }),
                            createNode('option').attrs({ value : 2 })
                        ])
                        .renderToDom();

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = createNode('select')
                    .attrs({ multiple : true, value : [2, 3] })
                    .children([
                            createNode('option').attrs({ value : 1 }),
                            createNode('option').attrs({ value : 2 }),
                            createNode('option').attrs({ value : 3 })
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
                    onRender : function(attrs, content) {
                        return createNode('div').attrs(attrs).children([
                            createNode('a'),
                            createNode('span')
                        ].concat(content));
                    }
                }),
                domNode = createNode(Component).attrs({ id : 'id1' }).children(createNode('i')).renderToDom();

            expect(domNode.tagName).to.equal('DIV');
            expect(domNode.getAttribute('id')).to.equal('id1');
            expect(domNode.children.length).to.equal(3);
            expect(domNode.children[0].tagName).to.equal('A');
            expect(domNode.children[1].tagName).to.equal('SPAN');
            expect(domNode.children[2].tagName).to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = createComponent({
                    onRender : () => {
                        return createNode('circle');
                    }
                }),
                domNode = createNode('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(createNode('g').children(createNode(Component)))
                    .renderToDom();

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should render <noscript/> if onRender() returns nothing', () => {
            const Component = createComponent({
                    onRender : () => {}
                }),
                domNode = createNode(Component).renderToDom();

            expect(domNode.tagName).to.equal('NOSCRIPT');
        });
    });
});
