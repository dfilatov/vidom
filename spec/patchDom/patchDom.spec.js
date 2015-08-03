var createNode = require('../../lib/createNode'),
    mounter = require('../../lib/client/mounter'),
    patchOps = require('../../lib/client/patchOps');

describe('patchDom', function() {
    describe('updateText', function() {
        it('should update node text', function() {
            var node = createNode().text('text'),
                domNode = node.renderToDom();

            node.patch(createNode().text('new text'));

            expect(domNode.textContent).to.equal('new text');
        });
    });

    describe('updateAttr', function() {
        it('should update node attribute', function() {
            var node = createNode('textarea').attrs({ cols : 5 }),
                domNode = node.renderToDom();

            node.patch(createNode('textarea').attrs({ cols : 3 }));

            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', function() {
            var node = createNode('input').attrs({ value : 'val' }),
                domNode = node.renderToDom();

            node.patch(createNode('input').attrs({ value : 'new val' }));

            expect(domNode.value).to.equal('new val');
        });
    });

    describe('removeAttr', function() {
        it('should remove node attribute', function() {
            var node = createNode('textarea').attrs({ disabled : true }),
                domNode = node.renderToDom();

            node.patch(createNode('textarea'));

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should remove node property', function() {
            var node = createNode('input').attrs({ value : 'val' }),
                domNode = node.renderToDom();

            node.patch(createNode('input'));

            expect(domNode.value).to.equal('');
        });
    });

    describe('replace', function() {
        it('should replace node', function() {
            var oldNode = createNode('span'),
                parentNode = createNode('div').children([createNode('a'), oldNode]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([createNode('a'), createNode('div')]));

            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });

    describe('appendChild', function() {
        it('should append child node', function() {
            var parentNode = createNode('div').children([createNode('a'), createNode('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([createNode('a'), createNode('span'), createNode('div')]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[2].tagName).to.equal('DIV');
        });
    });

    describe('removeChild', function() {
        it('should remove child node', function() {
            var oldNode = createNode('span'),
                parentNode = createNode('div').children([createNode('a'), oldNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0];

            parentNode.patch(createNode('div').children(createNode('a')));

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.childNodes[0]).to.equal(aDomNode);
        });
    });

    describe('insertChild', function() {
        it('should insert child node', function() {
            var parentNode = createNode('div').children([createNode('a').key('a'), createNode('span').key('c')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([
                createNode('a').key('a'),
                createNode('div').key('b'),
                createNode('span').key('c')
            ]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });
    });

    describe('moveChild', function() {
        it('should move child node', function() {
            var aNode = createNode('a').key('a'),
                bNode = createNode('a').key('b'),
                parentNode = createNode('div').children([aNode, bNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0],
                bDomNode = domNode.children[1];

            parentNode.patch(createNode('div').children([bNode, aNode]));

            expect(domNode.childNodes.length).to.equal(2);
            expect(domNode.childNodes[0]).to.equal(bDomNode);
            expect(domNode.childNodes[1]).to.equal(aDomNode);
        });

        it('should keep focus', function() {
            var rootDomElement = document.createElement('div');

            document.body.appendChild(rootDomElement);

            mounter.mountToDomSync(rootDomElement, createNode('div').children([
                createNode('div').key(1).children([
                    createNode('input').attrs({ id : 'id1' }).key(1),
                    createNode('input').key(2)
                ]),
                createNode('div').key(2)
            ]));

            var activeElement = document.getElementById('id1');
            activeElement.focus();

            mounter.mountToDomSync(rootDomElement, createNode('div').children([
                createNode('div').key(2),
                createNode('div').key(1).children([
                    createNode('input').key(2),
                    createNode('input').attrs({ id : 'id1' }).key(1),
                ])
            ]));

            expect(document.activeElement).to.equal(activeElement);

            document.body.removeChild(rootDomElement);
        });
    });

    describe('removeChildren', function() {
        it('should remove children nodes', function() {
            var parentNode = createNode('div').children([createNode('a'), createNode('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div'));

            expect(domNode.childNodes.length).to.equal(0);
        });
    });
});
