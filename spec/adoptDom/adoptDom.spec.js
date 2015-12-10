import createNode from '../../src/createNode';
import createComponent from '../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../src/client/mounter';

describe('adoptDom', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should properly adopt existing dom nodes', () => {
        const firstChildNode = createNode('span'),
            secondChildNode = createNode('i'),
            tree = createNode('div').children([firstChildNode, secondChildNode]),
            treeDomNode = document.createElement('div'),
            firstChildDomNode = document.createElement('span'),
            secondChildDomNode = document.createElement('i');

        treeDomNode.appendChild(firstChildDomNode);
        treeDomNode.appendChild(secondChildDomNode);
        domNode.appendChild(treeDomNode);

        mountToDomSync(domNode, tree);

        expect(tree.getDomNode()).to.equal(treeDomNode);
        expect(firstChildNode.getDomNode()).to.equal(firstChildDomNode);
        expect(secondChildNode.getDomNode()).to.equal(secondChildDomNode);
    });

    it('should properly adopt existing dom nodes through components', () => {
        const spanNode = createNode('span'),
            C1 = createComponent({
                onRender() {
                    return createNode(C2);
                }
            }),
            C2 = createComponent({
                onRender() {
                    return spanNode;
                }
            }),
            tree = createNode('div').children(createNode(C1)),
            treeDomNode = document.createElement('div'),
            childDomNode = document.createElement('span');

        treeDomNode.appendChild(childDomNode);
        domNode.appendChild(treeDomNode);

        mountToDomSync(domNode, tree);

        expect(spanNode.getDomNode()).to.equal(childDomNode);
    });

    it('should properly adopt existing dom nodes through function components', () => {
        const spanNode = createNode('span'),
            C1 = () => createNode(C2),
            C2 = () => spanNode,
            tree = createNode('div').children(createNode(C1)),
            treeDomNode = document.createElement('div'),
            childDomNode = document.createElement('span');

        treeDomNode.appendChild(childDomNode);
        domNode.appendChild(treeDomNode);

        mountToDomSync(domNode, tree);

        expect(spanNode.getDomNode()).to.equal(childDomNode);
    });
});
