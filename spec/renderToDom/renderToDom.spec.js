var createNode = require('../../lib/createNode'),
    createComponent = require('../../lib/createComponent');

describe('renderToDom', function() {
    describe('tag', function() {
        it('should be rendered properly', function() {
            expect(createNode('span').renderToDom().tagName).to.equal('SPAN');
        });
    });

    describe('ns', function() {
        it('should be rendered with default namespace', function() {
            expect(createNode('div').renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', function() {
            expect(createNode('svg').ns('http://www.w3.org/2000/svg').renderToDom().namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', function() {
        it('should be rendered as child nodes', function() {
            var domNode = createNode('div').children([createNode('span'), createNode('img')]).renderToDom();

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', function() {
        it('should be rendered as attributes', function() {
            var domNode = createNode('textarea').attrs({ cols : 5, rows : 2, disabled : true }).renderToDom();

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.getAttribute('disabled')).to.equal('true');
        });

        it('should be rendered as properties', function() {
            var domNode = createNode('input').attrs({ checked : true }).renderToDom();

            expect(domNode.checked).to.equal(true);
        });

        it('should be rendered after children', function() {
            var domNode = createNode('select')
                    .attrs({ value : 2 })
                    .children([
                            createNode('option').attrs({ value : 1 }),
                            createNode('option').attrs({ value : 2 })
                        ])
                        .renderToDom();

            expect(domNode.childNodes[1].selected).to.equal(true);
        });
    });

    describe('text', function() {
        it('should be rendered as text node', function() {
            var domNode = createNode().text('some text').renderToDom();

            expect(domNode.nodeType).to.equal(3);
            expect(domNode.nodeValue).to.equal('some text');
        });
    });

    describe('component', function() {
        it('should be rendered as component', function() {
            var Component = createComponent({
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

        it('should render <noscript/> if onRender() returns nothing', function() {
            var Component = createComponent({
                    onRender : function() {}
                }),
                domNode = createNode(Component).renderToDom();

            expect(domNode.tagName).to.equal('NOSCRIPT');
        });
    });
});
