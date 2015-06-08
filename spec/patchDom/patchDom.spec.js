var renderToDom = require('../../lib/renderToDom'),
    patchOps = require('../../lib/patchOps'),
    patchDom = require('../../lib/patchDom');

describe('patchDom', function() {
    describe('updateText', function() {
        it('should update node text', function() {
            var domNode = renderToDom({ tag : 'span', children : [{ text : 'text' }]});
            patchDom(domNode, [{ type : patchOps.UPDATE_TEXT, path : '.0', text : 'new text' }]);
            expect(domNode.childNodes[0].nodeValue).to.equal('new text');
        });
    });

    describe('updateAttr', function() {
        it('should update node attribute', function() {
            var domNode = renderToDom({ tag : 'textarea', attrs : { cols : 5 } });
            patchDom(domNode, [{ type : patchOps.UPDATE_ATTR, path : '', attrName : 'cols', attrVal : 3 }]);
            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', function() {
            var domNode = renderToDom({ tag : 'input', attrs : { value : 'val' } });
            patchDom(domNode, [{ type : patchOps.UPDATE_ATTR, path : '', attrName : 'value', attrVal : 'new val' }]);
            expect(domNode.value).to.equal('new val');
        });
    });

    describe('removeAttr', function() {
        it('should remove node attribute', function() {
            var domNode = renderToDom({ tag : 'textarea', attrs : { disabled : true } });
            patchDom(domNode, [{ type : patchOps.REMOVE_ATTR, path : '', attrName : 'disabled' }]);
            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should remove node property', function() {
            var domNode = renderToDom({ tag : 'input', attrs : { value : 'val' } });
            patchDom(domNode, [{ type : patchOps.REMOVE_ATTR, path : '', attrName : 'value' }]);
            expect(domNode.value).to.equal('');
        });
    });

    describe('replace', function() {
        it('should replace node', function() {
            var domNode = renderToDom({ tag : 'div', children : [{ tag : 'a' }, { tag : 'span' }] });
            patchDom(domNode, [{ type : patchOps.REPLACE, path : '.1', newNode : { tag : 'div' } }]);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });

    describe('appendChild', function() {
        it('should append child node', function() {
            var domNode = renderToDom({ tag : 'div', children : [{ tag : 'a' }, { tag : 'span' }] });
            patchDom(domNode, [{ type : patchOps.APPEND_CHILD, path : '', childNode : { tag : 'div' } }]);
            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[2].tagName).to.equal('DIV');
        });
    });

    describe('removeChild', function() {
        it('should remove child node', function() {
            var domNode = renderToDom({ tag : 'div', children : [{ tag : 'a' }, { tag : 'span' }] });
            patchDom(domNode, [{ type : patchOps.REMOVE_CHILD, path : '', idx : 1 }]);
            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.childNodes[0].tagName).to.equal('A');
        });
    });

    describe('insertChild', function() {
        it('should insert child node', function() {
            var domNode = renderToDom({ tag : 'div', children : [{ tag : 'a' }, { tag : 'span' }] });
            patchDom(domNode, [{ type : patchOps.INSERT_CHILD, path : '', idx : 1, childNode : { tag : 'div' } }]);
            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });
});
