var renderToDom = require('../../lib/renderToDom');

describe('renderToDom', function() {
    describe('tag', function() {
        it('should be rendered properly', function() {
            expect(renderToDom({ tag : 'span' }).tagName).to.equal('SPAN');
        });
    });

    describe('ns', function() {
        it('should be rendered with default namespace', function() {
            expect(renderToDom({ tag : 'div' }).namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with given namespace', function() {
            expect(renderToDom({ tag : 'svg', ns : 'http://www.w3.org/2000/svg' }).namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('attrs', function() {
        it('should be rendered as attributes', function() {
            var domNode = renderToDom({ tag : 'textarea', attrs : { cols : 5, rows : 2, disabled : true } });
            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.getAttribute('disabled')).to.equal('true');
        });

        it('should be rendered as properties', function() {
            var domNode = renderToDom({ tag : 'input', attrs : { checked : true } });
            expect(domNode.checked).to.equal(true);
        });
    });

    describe('children', function() {
        it('should be rendered as child nodes', function() {
            var domNode = renderToDom({
                    tag : 'div',
                    children : [
                        { tag : 'span' },
                        { tag : 'img' }
                    ]
                });

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('text', function() {
        it('should be rendered as text node', function() {
            var domNode = renderToDom({ text : 'some text' });
            expect(domNode.nodeType).to.equal(3);
            expect(domNode.nodeValue).to.equal('some text');
        });
    });
});
