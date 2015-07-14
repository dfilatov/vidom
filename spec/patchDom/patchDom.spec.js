var createNode = require('../../lib/createNode'),
    patchDom = require('../../lib/client/patchDom'),
    UpdateTextOp = require('../../lib/client/patchOps/UpdateText'),
    UpdateAttrOp = require('../../lib/client/patchOps/UpdateAttr'),
    RemoveAttrOp = require('../../lib/client/patchOps/RemoveAttr'),
    ReplaceOp = require('../../lib/client/patchOps/Replace'),
    UpdateChildrenOp = require('../../lib/client/patchOps/UpdateChildren'),
    AppendChildOp = require('../../lib/client/patchOps/AppendChild'),
    RemoveChildOp = require('../../lib/client/patchOps/RemoveChild'),
    InsertChildOp = require('../../lib/client/patchOps/InsertChild'),
    MoveChildOp = require('../../lib/client/patchOps/MoveChild'),
    RemoveChildrenOp = require('../../lib/client/patchOps/RemoveChildren');

describe('patchDom', function() {
    describe('updateText', function() {
        it('should update node text', function() {
            var domNode = createNode().text('text').renderToDom();

            patchDom(domNode, [new UpdateTextOp('new text' )]);

            expect(domNode.textContent).to.equal('new text');
        });
    });

    describe('updateAttr', function() {
        it('should update node attribute', function() {
            var domNode = createNode('textarea', { attrs : { cols : 5 } }).renderToDom();

            patchDom(domNode, [new UpdateAttrOp('cols', 3)]);

            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', function() {
            var domNode = createNode('input', { attrs : { value : 'val' } }).renderToDom();

            patchDom(domNode, [new UpdateAttrOp('value', 'new val')]);

            expect(domNode.value).to.equal('new val');
        });
    });

    describe('removeAttr', function() {
        it('should remove node attribute', function() {
            var domNode = createNode('textarea', { attrs : { disabled : true } }).renderToDom();

            patchDom(domNode, [new RemoveAttrOp('disabled' )]);

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should remove node property', function() {
            var domNode = createNode('input', { attrs : { value : 'val' } }).renderToDom();

            patchDom(domNode, [new RemoveAttrOp('value' )]);

            expect(domNode.value).to.equal('');
        });
    });

    describe('replace', function() {
        it('should replace node', function() {
            var oldNode = createNode('span'),
                domNode = createNode('div').children([createNode('a'), oldNode]).renderToDom();

            patchDom(domNode, [
                new UpdateChildrenOp([
                    { idx : 1, patch : [new ReplaceOp(oldNode, createNode('div'))] }
                ])
            ]);

            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });

    describe('appendChild', function() {
        it('should append child node', function() {
            var domNode = createNode('div').children([createNode('a'), createNode('span')]).renderToDom();

            patchDom(domNode, [new AppendChildOp(createNode('div'))]);

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[2].tagName).to.equal('DIV');
        });
    });

    describe('removeChild', function() {
        it('should remove child node', function() {
            var oldNode = createNode('span'),
                domNode = createNode('div').children([createNode('a'), oldNode]).renderToDom(),
                aDomNode = domNode.children[0];

            patchDom(domNode, [new RemoveChildOp(oldNode, 1)]);

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.childNodes[0]).to.equal(aDomNode);
        });
    });

    describe('insertChild', function() {
        it('should insert child node', function() {
            var domNode = createNode('div').children([createNode('a'), createNode('span')]).renderToDom();

            patchDom(domNode, [new InsertChildOp(createNode('div'), 1)]);

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });

    describe('moveChild', function() {
        it('should move child node', function() {
            var domNode = createNode('div').children([createNode('a'), createNode('span')]).renderToDom(),
                aDomNode = domNode.children[0],
                spanDomNode = domNode.children[1];

            patchDom(domNode, [new MoveChildOp(1, 0)]);

            expect(domNode.childNodes.length).to.equal(2);
            expect(domNode.childNodes[0]).to.equal(spanDomNode);
            expect(domNode.childNodes[1]).to.equal(aDomNode);
        });
    });

    describe('removeChildren', function() {
        it('should remove children nodes', function() {
            var oldNodes = [createNode('a'), createNode('span')],
                domNode = createNode('div').children(oldNodes).renderToDom();

            patchDom(domNode, [new RemoveChildrenOp(oldNodes)]);

            expect(domNode.childNodes.length).to.equal(0);
        });
    });
});
