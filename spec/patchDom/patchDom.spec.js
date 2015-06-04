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
            var domNode = renderToDom({ tag : 'textarea', attrs : { cols : 5, rows : 2, disabled : true } });
            patchDom(domNode, [{ type : patchOps.UPDATE_ATTR, path : '', attrName : 'cols', attrVal : 3 }]);
            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', function() {
            var domNode = renderToDom({ tag : 'input', attrs : { value : 'val' } });
            patchDom(domNode, [{ type : patchOps.UPDATE_ATTR, path : '', attrName : 'value', attrVal : 'new val' }]);
            expect(domNode.value).to.equal('new val');
        });
    });
});
