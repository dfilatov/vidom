var createNode = require('../../lib/createNode'),
    createComponent = require('../../lib/createComponent'),
    mounter = require('../../lib/client/mounter');

describe('adoptDom', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        document.body.removeChild(domNode);
    });

    it('should properly adopt existing dom nodes', function() {
        var firstChildNode = createNode('span'),
            secondChildNode = createNode('i'),
            tree = createNode('div').children([firstChildNode, secondChildNode]),
            treeDomNode = document.createElement('div'),
            firstChildDomNode = document.createElement('span'),
            secondChildDomNode = document.createElement('i');

        treeDomNode.appendChild(firstChildDomNode);
        treeDomNode.appendChild(secondChildDomNode);
        domNode.appendChild(treeDomNode);

        mounter.mountToDomSync(domNode, tree);

        expect(tree.getDomNode()).to.equal(treeDomNode);
        expect(firstChildNode.getDomNode()).to.equal(firstChildDomNode);
        expect(secondChildNode.getDomNode()).to.equal(secondChildDomNode);
    });

    it('should properly adopt existing dom nodes through components', function() {
        var spanNode = createNode('span'),
            C1 = createComponent({
                onRender : function() {
                    return createNode(C2);
                }
            }),
            C2 = createComponent({
                onRender : function() {
                    return spanNode;
                }
            }),
            tree = createNode('div').children(createNode(C1)),
            treeDomNode = document.createElement('div'),
            childDomNode = document.createElement('span');

        treeDomNode.appendChild(childDomNode);
        domNode.appendChild(treeDomNode);

        mounter.mountToDomSync(domNode, tree);

        expect(spanNode.getDomNode()).to.equal(childDomNode);
    });
});
